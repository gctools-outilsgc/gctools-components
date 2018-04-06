import cassandra from 'cassandra-driver';
import { Client, Consumer } from 'kafka-node';
import restify from 'restify';

const phase1_client = new cassandra.Client({
  contactPoints: ['cassandra.default']
});

// TODO: multiple data centre deploy would require a different replication
// strategy below.
console.log(`
Recommendation store micro-service
Copyright (c) 2017 National Research Council

Initializing...
`);

const cescape = str => str.replace(/'/g, "''");

process.stdout.write('Phase 1: Create keyspace ');
phase1_client.execute(`
  CREATE KEYSPACE IF NOT EXISTS recommendation
    WITH REPLICATION = { 'class' : 'SimpleStrategy', 'replication_factor' : 3 }
`
).then(() => {
  console.log('. done.');
  process.stdout.write('Phase 2: Create types ');
  const client = new cassandra.Client({
    contactPoints: ['cassandra.default'],
    keyspace: 'recommendation'
  });
  const create_types = [
    `
      CREATE TYPE IF NOT EXISTS phrase (
        phrase text,
        rank float
      );
    `, `
      CREATE TYPE IF NOT EXISTS article (
        guid text,
        title text,
        rank float,
        phrase_cloud set<frozen <phrase>>,
        touched int
      );
    `
  ];
  client.execute(create_types[0]).then(() => {
    process.stdout.write('.');
    client.execute(create_types[1]).then(() => {
      console.log('. done.');
      process.stdout.write('Phase 3: Create tables ');
      client.execute(`
        CREATE TABLE IF NOT EXISTS recommendations (
          uuid text,
          context text,
          context_obj1 text,
          context_obj2 text,
          context_obj3 text,
          articles set<frozen <article>>,
          PRIMARY KEY (uuid, context, context_obj1, context_obj2, context_obj3)
        );
      `).then(() => {
        process.stdout.write('.');
        client.execute(`
        CREATE TABLE IF NOT EXISTS profiles (
          uuid text,
          payload text,
          PRIMARY KEY (uuid)
        );
        `).then(() => {
          process.stdout.write('.');
          client.execute(`
          CREATE TABLE IF NOT EXISTS articles (
            auid text,
            payload text,
            PRIMARY KEY (auid)
          );
          `).then(() => {
            console.log('. done.\n');
            console.log('Initialization done.\n');

            const article_handler = message => {
              const { payload, auid } = JSON.parse(message.value);
              console.log(`Updating article ${auid}`);
              const params = [`${auid}`];
              client.execute(`
                DELETE FROM
                  articles
                WHERE
                  auid = ?
                `,
                params,
                { prepare: true }
              ).then(() => {
                params.push(JSON.stringify(payload));
                client.execute(`
                  INSERT INTO articles (auid, payload) VALUES (?, ?)
                `, params, { prepare: true}).then(() => {
                  console.log('Article updated on cluster');
                }).catch(e => { console.error(e); });
              });
            }

            const profile_handler = message => {
              const { payload, uuid } = JSON.parse(message.value);
              console.log(`Updating profile for ${uuid}`);
              const params = [`${uuid}`];
              client.execute(`
                DELETE FROM
                  profiles
                WHERE
                  uuid = ?
                `,
                params,
                { prepare: true }
              ).then(() => {
                params.push(JSON.stringify(payload));
                client.execute(`
                  INSERT INTO profiles (uuid, payload) VALUES (?, ?)
                `, params, { prepare: true}).then(() => {
                  console.log('Profile updated on cluster');
                }).catch(e => { console.error(e); });
              });
            }

            const recommendation_handler = message => {
              const {
                payload,
                context,
                uuid,
                context_obj1,
                context_obj2,
                context_obj3 } = JSON.parse(message.value);
              if (context) {
                const use_uuid = uuid || '-1';
                const c1 = context_obj1 || '-1';
                const c2 = context_obj2 || '-1';
                const c3 = context_obj3 || '-1';
                console.log(`Updating ${use_uuid} in ${context} -(${c1},${c2},${c3})-`);
                const params
                  = [`${use_uuid}`, `${context}`, `${c1}`, `${c2}`, `${c3}`];
                client.execute(`
                  DELETE FROM
                    recommendations
                  WHERE
                    uuid = ?
                    AND context = ?
                    AND context_obj1 = ?
                    AND context_obj2 = ?
                    AND context_obj3 = ?
                    `,
                  params,
                  { prepare: true }
                ).then(() => {
                  const statements = [{
                    query: `
                      INSERT INTO
                        recommendations (
                          uuid,
                          context,
                          context_obj1,
                          context_obj2,
                          context_obj3,
                          articles
                        )
                      VALUES (?, ?, ?, ?, ?, {})
                    `,
                    params,
                  }];
                  payload.forEach(recdata => {
                    const [articleId, rank, clusterId, title, ph, t] = recdata;
                    // TODO: sigh.  add injection protection.
                    const phrase_inserts = Object.keys(ph).map(p =>
                      `('${cescape(p)}', ${ph[p]})`
                    );
                    statements.push({
                      query: `
                        UPDATE recommendations
                          SET articles = articles + {
                            (
                              '${cescape(articleId)}',
                              '${cescape(title)}',
                              ${rank},
                              {${phrase_inserts.join(',')}},
                              ${t}
                            )
                          }
                        WHERE
                          uuid = ?
                          AND context = ?
                          AND context_obj1 = ?
                          AND context_obj2 = ?
                          AND context_obj3 = ?
                      `,
                      params
                    });
                  });
                  client.batch(statements, { prepare: true }).then(() => {
                    console.log('Recommendations updated on cluster.');
                    console.log(`Article count: ${payload.length}`);
                  }).catch(insert_error => {
                    console.log('Error updating stored recommendations');
                    console.log(insert_error);
                  });
                }).catch(delete_e => {
                  console.log('Error resetting stored recommendations!');
                  console.log(delete_e);
                })
              }
            }

            const kafka_client = new Client(
              'zookeeper.kafka:2181/',
              'recommendation-store'
            );

            const consumer = new Consumer(
              kafka_client,
              [
                { topic: 'recommendation', partition: 0 },
                { topic: 'article', partition: 0 },
                { topic: 'profile', partition: 0 },
              ]
            );

            consumer.on('message', message => {
              console.log(`-- received message for topic: ${message.topic}`);
              if (message.topic === 'article') {
                article_handler(message);
              } else if (message.topic === 'profile') {
                profile_handler(message);
              } else if (message.topic === 'recommendation') {
                recommendation_handler(message);
              }
            });

            const get_recommendation = (req, res, next) => {
              const { context, uuid, c1, c2, c3 } = req.params;
              const co1 = c1 || '-1';
              const co2 = c2 || '-1';
              const co3 = c3 || '-1';
              client.execute(`
                SELECT * FROM
                  recommendations
                WHERE
                  uuid = ?
                  AND context = ?
                  AND context_obj1 = ?
                  AND context_obj2 = ?
                  AND context_obj3 = ?
                `,
                [`${uuid}`, `${context}`, `${co1}`, `${co2}`, `${co3}`],
                { prepare: true }
              ).then((result) => {
                res.send(result);
                next();
              }).catch(rest_error => {
                next(rest_error);
              });
            };

            const get_profile = (req, res, next) => {
              const { uuid } = req.params;
              client.execute(`
                SELECT * FROM
                  profiles
                WHERE
                  uuid = ?
              `, [`${uuid}`], { prepare: true }).then((result) => {
                res.send(result);
                next();
              }).catch(e => next(e));
            }

            const server = restify.createServer();
            server.get('/recommendation/:context/:uuid', get_recommendation);
            server.get('/recommendation/:context/:uuid/:c1', get_recommendation);
            server.get('/recommendation/:context/:uuid/:c1/:c2', get_recommendation);
            server.get('/recommendation/:context/:uuid/:c1/:c2/:c3', get_recommendation);
            server.get('/profile/:uuid', get_profile);

            server.listen(8080, () => {
              console.log('%s listening at %s', server.name, server.url);
            });

            console.log('Micro-service ready.');
          }).catch(e2 => {
            console.log('Error creating table(s).');
            console.log(e2);
            process.exit();
          });
        }).catch(() => { console.log('Error.'); process.exit(); });
      }).catch(() => { console.log('Error.'); process.exit(); });
    }).catch(() => { console.log('Error.'); process.exit(); });
  }).catch(() => { console.log('Error.'); process.exit(); });

}).catch(e => {
  console.log('An error occurred during phase 1.');
  console.log(e);
  process.exit();
})
