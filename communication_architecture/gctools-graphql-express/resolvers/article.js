/*
 * Author: National Research Council Canada
 * Website: http://www.nrc-cnrc.gc.ca/eng/rd/ict/
 *
 * License: MIT
 * Copyright: Her Majesty the Queen in Right of Canada, as represented by
 * the Minister of National Research Council, 2017
 */

/*
* CouchDB Maps

// nameStartsWith
function(doc) {
  if (doc.article_title && doc.article_id === 364562) {
    var name = doc.article_title.toLowerCase();
    var guid = parseInt(doc.article_id);
    var orig_name = doc.article_title;
    for (var x=3; x<=name.length; x++) {
      if ((name.substr(0, x).trim() === '').length >= 3) {
        emit(name.substr(0, x).trim(), { guid: guid, name: orig_name });
      }
    }
  }
}

// nameEndsWith
function(doc) {
  if (doc.article_title && doc.article_id === 364562) {
    var name = doc.article_title.toLowerCase();
    var guid = parseInt(doc.article_id);
    var orig_name = doc.article_title;
    var lidx = name.length-1;
    for (var x=lidx; x>=3; x--) {
      if (name.substr(x, 1).trim().length >= 3) {
        emit(name.substr(x).trim(), { guid: guid, name: orig_name });
      }
    }
  }
}

// nameContains

function(doc){
  if (doc.article_title) {
    var name = doc.article_title.toLowerCase();
    var guid = parseInt(doc.article_id);
    var orig_name = doc.article_title;
    var keys = {};
    var re = /^[a-z0-9].{2}/;
    for (var x=3; x<=name.length; x++) {
      var trimmed = name.substr(0, x).trim();
      if (trimmed.match(re)) keys[trimmed] = true;
      for (var y=x-(x-3); y<name.length-(x-3); y++) {
        var trimmed2 = name.substr(x-2, y).trim();
        if (trimmed2.match(re)) keys[trimmed2] = true;
      }
    }
    var emit_keys = Object.keys(keys);
    var emit_obj = { guid: guid, name: orig_name };
    for (var x=0; x<emit_keys.length; x++) {
      emit(emit_keys[x], emit_obj);
    }
  }
}

//*/

import request from 'request';
import { makeSourcedString as mkStr } from '../schema/types/SourcedString';

const cachedRequest = require('cached-request')(request);
cachedRequest.setCacheDirectory('/tmp/cache');

const gcconnex = 'https://gcconnex.gc.ca/missions/api/v0/';
const couchdb = 'http://gctools-couchdb.gctools-recommendation:5984/articles/_design/finder/_view';
const profileAny = `${couchdb}/nameContains?key="[term]"`;
const profileStarts = `${couchdb}/nameStartsWith?key="[term]"`;
const profileEnds = `${couchdb}/nameEndsWith?key="[term]"`;

const article_service
  = 'http://recommendation.rest/profile/article';

const isDataAvailable = (data, selections) => {
  /* Used to determine if the incoming data is complete, or not.
  * This information can be used to make a decision about fetching data
  * from a remote API, for example.
  */
  let total_selections = [];
  let found_selections = [];
  selections.forEach((sel) => {
    const { value } = sel.name;
    if (!value.startsWith('__')) {
      total_selections.push(value);
      if (typeof data[value] !== 'undefined') {
        found_selections.push(value);
        if (sel.selectionSet) {
          const ret
            = isDataAvailable(data[value], sel.selectionSet.selections);
          total_selections = [...total_selections, ...ret.total_selections];
          found_selections = [...found_selections, ...ret.found_selections];
        }
      }
    }
  });
  const missing_selections
    = total_selections.filter(x => found_selections.indexOf(x) == -1);
  return { total_selections, found_selections, missing_selections };
}

export const mergeArticleData = (article, data) => {
  const base_obj = article;
  data.forEach(d => {
    Object.keys(d).forEach(k => {
      if (d[k].list) {
        if (base_obj[k] && base_obj[k].list) {
          base_obj[k].list = [...base_obj[k].list, ...d[k].list];
          base_obj[k].value = d[k].value;
          base_obj[k].source = d[k].source;
        } else {
          base_obj[k] = d[k];
        }
      } else {
        base_obj[k] = d[k];
      }
    })
  });
}

export const getArticleData = (article, selections) => {
  /**
   * Retreive article data from sources such as GCconnex, GCprofile, etc
   */
  const { missing_selections } = isDataAvailable(article, selections);

  if (missing_selections.length === 0) {
    return new Promise((resolve) => resolve([article]));
  }

  const guid = article.id;
  const promises = [];

  const rec_fields = ['recommendations'];
  const article_fields = [
    'phraseCloud',
    'id',
    'namespace',
    'name',
    'touched',
    'lang',
    'rev',
    'rank'
  ];

  if (missing_selections.some(v => rec_fields.includes(v))) {
    promises.push(new Promise(resolve => resolve({
      recommendations: { context: { uuid: `${guid}` }}})));
  }

  if (missing_selections.some(v => article_fields.includes(v))) {
    const gcpedia_source = { name: 'GCpedia' };
    promises.push(new Promise((resolve, reject) => {
      const uri = encodeURI(`${article_service}/${guid}`);
      cachedRequest({
        uri,
        proxy: false,
        json: true,
      }, (error, response, body) => {
        if (error) {
          reject(error);
        } else if (body.length === 2) {
          const [ status, article_data ] = body;
          const obj = {};
          const { pc } = article_data;
          if (missing_selections.includes('phraseCloud') && pc) {
            const args = getArgumentsForSelector('phraseCloud', selections);
            const phraseCloud = Object.keys(pc)
              .map(text => ({
                text: mkStr([{ value: text, source: gcpedia_source }]),
                rank: pc[text],
              }))
              .filter(o => {
                if (args.length === 0) return true;
                let ret = true;
                for (let x = 0; x < args.length; x += 1) {
                  const a = args[x];
                  if (a.name.value === 'rankGreaterThan') {
                    ret = ret && o.rank > parseFloat(a.value.value);
                  } else if (a.name.value === 'rankEqualOrGreaterThan') {
                    ret = ret &&  o.rank >= parseFloat(a.value.value);
                  } else if (a.name.value === 'rankLesserThan') {
                    ret = ret &&  o.rank < parseFloat(a.value.value);
                  } else if (a.name.value === 'rankEqualOrLesserThan') {
                    ret = ret &&  o.rank <= parseFloat(a.value.value);
                  } else if (a.name.value === 'rankEqualTo') {
                    ret = ret && o.rank == parseFloat(a.value.value);
                  }
                  if (ret === false) break;
                }
                return ret;
              })
              .sort((a, b) => parseFloat(b.rank) - parseFloat(a.rank))
              .filter((o, idx) => {
                if (args.length === 0) return true;
                for (let x = 0; x < args.length; x += 1) {
                  const a = args[x];
                  if (a.name.value === 'top') {
                    return idx < a.value.value;
                  }
                }
                return true;
              });
            obj.phraseCloud = phraseCloud;
          }
          if (missing_selections.includes('id')) {
            obj.id = article_data.uid;
          }
          if (missing_selections.includes('namespace')) {
            obj.namespace = article_data.namespace;
          }
          if (missing_selections.includes('name')) {
            obj.name = mkStr([{
              value: article_data.title,
              source: gcpedia_source }
            ]);
          } else if (article_data.title && article.name && article.name) {
            article.name.list.push({
              value: article_data.title,
              source: gcpedia_source
            });
            article.name.value = article_data.title;
          }
          if (missing_selections.includes('touched')) {
            obj.touched = article_data.touched;
          }
          if (missing_selections.includes('lang')) {
            obj.lang = article_data.lang;
          }
          if (missing_selections.includes('rev')) {
            obj.rev = article_data.rev;
          }
          if (article_data.rs) {
            if (missing_selections.includes('rank') || (!article.rank)) {
              obj.rank = article_data.rs.rank;
            }
          }
          resolve(obj);
        } else {
          resolve({});
        }
      });
    }));
  }

  return new Promise((resolve, reject) => {
    Promise.all(promises).then(data => {
      mergeArticleData(article, data);
      resolve([article]);
    }).catch(e => reject(e));
  });
}

const getSelectionsForField = (name, info) => {
  let names = name;
  if (!Array.isArray(name)) {
    names = [name]
  }
  for (let x = 0; x < info.fieldNodes.length; x += 1) {
    const { kind, value } = info.fieldNodes[x].name;
    if ((kind === 'Name') && (names.indexOf(value) >= 0)) {
      return info.fieldNodes[x].selectionSet.selections;
    }
  }
  return [];
}

const getArgumentsForSelector = (name, selections) => {
  for (let x = 0; x < selections.length; x += 1) {
    const { kind, value } = selections[x].name;
    if ((kind === 'Name') && (name === value)) {
      return selections[x].arguments;
    }
  }
  return [];
}

const couhcdb_request = (term, queue, uri) => {
  if (!term) return false;
  const couchdb_source = { name: 'couchdb' };
  queue.push(new Promise((resolve_inner, reject_inner) => {
    request({
      uri: encodeURI(uri.replace(/\[term\]/g, term.toLowerCase().trim())),
      proxy: false,
      json: true,
    }, (error, response, body) => {
      const res = body.rows.map(({ value }) => {
        return {
          id: value.guid,
          name: mkStr([{ value: value.name, source: couchdb_source }])
        }
      });
      resolve_inner(res);
    });
  }));
}

export const articleResolver = (root, args, context, info) => {
  const selections = getSelectionsForField(['articles'], info);
  if (args && Object.keys(args).length > 0) {
    return new Promise((resolve, reject) => {
      const queries = [];
      couhcdb_request(args.nameContains, queries, profileAny);
      couhcdb_request(args.nameStartsWith, queries, profileStarts);
      couhcdb_request(args.nameEndsWith, queries, profileEnds);
      Promise.all(queries).then((data) => {
        if (args.hasId) {
          data.push([{ id: `${args.hasId}` }]);
        }
        const seen = {};
        const res = [];
        let counter = 0;
        if (args.limit === 0) {
          console.log('warn: limit of 0');
        } else if (data.length === 1) {
          for (let x = 0; x < data[0].length; x += 1) {
            counter += 1;
            res.push(getArticleData(data[0][x], selections));
            if (counter === args.limit) break;
          }
        } else {
          for (let x = 0; x < data.length; x += 1) {
            for (let y = 0; y < data[x].length; y += 1) {
              const evaluate = data[x][y].id;
              let add = false;
              if (seen[evaluate]) continue;
              seen[evaluate] = true;
              for (let x1 = 0; x1 < data.length; x1 += 1) {
                if (x1 === x) continue;
                for (let y1 = 0; y1 < data[x1].length; y1 += 1) {
                  if (data[x1][y1].id === evaluate) {
                    add = true;
                    break;
                  }
                }
                if (add) break;
              }
              if (add) {
                counter += 1;
                res.push(getArticleData(data[x][y], selections));
                if (counter === args.limit) break;
              }
            }
            if (counter === args.limit) break;
          }
        }
        Promise.all(res)
          .then(final_data => {
            const articles = final_data
              .map(([u]) => u)
              .filter(o => {
                if (Object.keys(args).length === 0) return true;
                let ret = true;
                if (typeof args.rankGreaterThan !== 'undefined') {
                  ret = ret && o.rank > parseFloat(args.rankGreaterThan);
                }
                if (typeof args.rankEqualOrGreaterThan !== 'undefined') {
                  ret = ret &&  o.rank >= parseFloat(args.rankEqualOrGreaterThan);
                }
                if (typeof args.rankLesserThan !== 'undefined') {
                  ret = ret &&  o.rank < parseFloat(args.rankLesserThan);
                }
                if (typeof args.rankEqualOrLesserThan !== 'undefined') {
                  ret = ret &&  o.rank <= parseFloat(args.rankEqualOrLesserThan);
                }
                if (typeof args.rankEqualTo !== 'undefined') {
                  ret = ret && o.rank == parseFloat(args.rankEqualTo);
                }
                return ret;
              })
              .sort((a, b) => parseFloat(b.rank) - parseFloat(a.rank))
              .filter((o, idx) => {
                if (typeof args.top === 'undefined') return true;
                return idx < parseInt(args.top);
              });
            resolve(articles);
          }).catch(err => reject(err));
      }).catch(err => reject(err));
    });
  }
  return new Promise((resolve, reject) => {
    if (root.gcconnex_guid != '-1') {
      getArticleData({id: root.gcconnex_guid}, selections)
        .then(data => {
          resolve(data)
        })
        .catch(err => reject(err));
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
