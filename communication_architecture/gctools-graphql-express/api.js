
import request from 'request';
import { makeSourcedString as mkStr } from './schema/types/SourcedString';

const cHost = 'http://167.37.33.21:443/';
const gcconnex = 'https://gcconnex.gc.ca/missions/api/v0/'

export const getPerson = (root) => {
  return new Promise((resolve, reject) => {
    if (root.gcconnex_guid != '-1') {
      const uri
        = `${gcconnex}/user/${root.gcconnex_guid}`;
      request({
        uri,
        headers: {
          'X-Custom-Authorization': 'fp6DmvY2HRwZgn+WjW8qFRfU2duXcxZ1DfNIYqNJYg1tjchEgOVldgVyFl2mD8cZHyb4S2v/T/QFsB4+qwm6NK/ZdJv0exLZn34U+2VzhEusFIKMsM5EA93sde/RgWAm7hi5nZUI7qHqtmfS20mGJnmYAEdNHRLFPnYjZWplXEJFi91NdTCL7PbkfqsmeCHPODhNzlbWquQVFM0UnPiI+17r3/wx1dYEomiXII3d6wyY4yPxpOG0+FIzeqKv3bmftC8+qDkB0vunwksjI6WOdTbktyhWWUlOmIBwp6HZzv9DFVxLnUmgr58EF4tn7+wV5wvbpGFtArKutbpT0vymwyvIzxsh48Um0+Tf7LjdC+g8LhwvqRid/yrET++I3sygnAX4yNzlLgixEUzoxW5c2Bdgs9ptu0AU5HwwE12USdVjvalRn4A+WzmrpKpFFed8nG4tGeBS5pMWHI521BWbfr00zAX4mLFe22sJDLHkFE5lk/8CEaCwaW4237ykBRyFoV7fyaU34nt5rcKpOkDIb98PHy0c2Iu29hjSklFcpp9f0GtHff2+5cCHhTLcR7Lc7pUUUEsSwkHCnwIcJ3SIcoVrc0LxAdGuhqcE/mIVvGsLaaq4NfxGlbCbj9nVBCUw+0803Fv/XxcmQXdqU0gIQQ4hDfUhGOGA8mjGoUcVj0A='
        },
        tunnel: true,
        json: true,
      }, (error, response, body) => {
        const gcconnex_source = { name: 'gcconnex' };
        const gcidentity_source = { name: 'gcidentity' };
        if (!error && response.statusCode == 200) {
          const p = body.export[1];
          const ret = {
            id: `${p.guid}`,
            name:
              mkStr([{ value: p.name, source: gcconnex_source }]),
            email:
              mkStr([{ value: root.email, source: gcidentity_source }]),
            department:
              mkStr([{ value: p.department, source: gcconnex_source }]),
            description:
              mkStr([{ value: p.description, source: gcconnex_source }]),
            recommendations:
              { context:
                { uuid: `${root.gcconnex_guid}` }
              }
          };
          resolve(ret);
          return true;
        }
        reject(error);
        return false;
      });
    } else {
      resolve({
        recommendations:
        { context:
          { uuid: `${root.gcconnex_guid}` }
        }
      });
    }
  });

}

export const getArticles = (term) => {
  return new Promise((resolve, reject) => {
    const uri
      = `${cHost}/articles/_design/finder/_view/title?key="[term]"&limit=50`;
    request({
      uri: uri.replace(/\[term\]/g, term.toLowerCase().trim()),
      json: true,
      success: (data) => {
        const ret = data.rows.map((r) =>
          ({ text: r.value.title, value: parseInt(r.value.guid), type: "Article" }));
        resolve(ret);
      },
      error: reject
    });
  });
}

export const getDiscussions = (term) => {
  return new Promise((resolve, reject) => {
    const discussionResolver
    = `${cHost}discussions/_design/finder/_view/resolve?key="[term]"&limit=1`;
    const uri
    = `${cHost}discussions/_design/finder/_list/typeahead/title?startkey=` +
    '"[term]"&endkey="[term]%E9%A6%99"&top=20&group_level=1';
    request({
      uri: uri.replace(/\[term\]/g, term.toLowerCase().trim()),
      json: true,
      success: (titles) => {
        const resolvers = [];
        for (let x = 0; x < titles.length; x += 1) {
          resolvers.push(
            request({
              uri: discussionResolver
                .replace(/\[term\]/g, encodeURIComponent(titles[x])),
              type: 'json',
            })
          );
        }
        Promise.all(resolvers).then((a) => {
          const ret = a.filter(r => r.rows && r.rows.length === 1).map(r =>
            ({
              text: r.rows[0].key,
              value: parseInt(r.rows[0].value),
              type: "Discussion"
            }));
        resolve(ret);
      })
      },
      error: (e) => reject
    });
  });
}
