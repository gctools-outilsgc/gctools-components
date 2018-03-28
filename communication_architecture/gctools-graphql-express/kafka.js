import { Client, Producer, Consumer } from 'kafka-node';
import { PubSub } from 'graphql-subscriptions'

const client = new Client(
  'zookeeper.kafka:2181/',
  'graphql-server'
);

const producer = new Producer(client);

export const postContextEvent = (event) => {
  return new Promise((resolve, reject) => {
    producer.send(
      [{ topic: 'context', messages: JSON.stringify(event) }],
      (e, d) => {
        if (e) {
          reject(e);
        } else {
          resolve(JSON.stringify(d));
        }
      }
    );
  });
}

const subscriptions = {};

export const subscribeToTopic = (topic) => {
  if (!subscriptions[topic]) {
    const consumer = new Consumer(
      client, [{ topic, partition: 0 }]
    );
    // TODO: build something using PubSubEngine instead
    subscriptions[topic] = new PubSub();
    consumer.on('message', message => {
      subscriptions[topic].publish(topic, message);
    });
  }
  return subscriptions[topic].asyncIterator(topic);
};
