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
  var name = doc.discussion_title;
  var guid = parseInt(doc.discussion_id);
  if (name) {
    for (var x=1; x<=name.length; x++) {
      if ((name.substr(0, x).trim() === '') || (name.substr(0, x).trim() === '_')) continue;
      if (name[x] !== ' ') {
        emit(name.substr(0, x).toLowerCase().trim(), { guid: guid, name: name });
      }
    }
  }
}

// nameEndsWith
function(doc) {
  var name = doc.discussion_title;
  var guid = parseInt(doc.discussion_id);
  if (name) {
    var lidx = name.length-1;
    for (var x=lidx; x>=0; x--) {
      if ((name.substr(x, 1).trim() === '') || (name.substr(x, 1).trim() === '_')) continue;
      if (name.substr(x, 1).trim().length >= 0) {
        emit(name.substr(x).toLowerCase().trim(), { guid: guid, name: name });
      }
    }
  }
}

// nameContains

function(doc){
  if (doc.discussion_title) {
    var name = doc.discussion_title.toLowerCase();
    var guid = parseInt(doc.discussion_id);
    var orig_name = doc.discussion_title;
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

*/

import request from 'request';
import { makeSourcedString as mkStr } from '../schema/types/SourcedString';

const gcconnex = 'https://gcconnex.gc.ca/missions/api/v0/';

const couchdb = 'http://gctools-couchdb.gctools-recommendation:5984/' +
  'discussions/_design/finder/_view';

const profileAny = `${couchdb}/nameContains?key="[term]"`;
const profileStarts = `${couchdb}/nameStartsWith?key="[term]"`;
const profileEnds = `${couchdb}/nameEndsWith?key="[term]"`;

const profile_service
  = 'http://recommendation-storage.gctoolsv2/discussion';

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

const mergeDiscussionData = (discussion, data) => {
  const base_obj = discussion;
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

const getDiscussionData = (discussion, selections) => {
  /**
   * Retreive discussion data from sources such as GCconnex, GCprofile, etc
   */
  const { missing_selections } = isDataAvailable(discussion, selections);

  if (missing_selections.length === 0) {
    return new Promise((resolve) => resolve([discussion]));
  }

  const guid = discussion.id;
  const promises = [];

  const gcconnex_fields = ['id', 'name', 'email', 'department', 'description'];
  const rec_fields = ['recommendations'];
  const gcprofile_fields = ['phraseCloud'];

  if (missing_selections.some(v => rec_fields.includes(v))) {
    promises.push(new Promise(resolve => resolve({
      recommendations: { context: { uuid: `${guid}` }}})));
  }

  if (missing_selections.some(v => gcconnex_fields.includes(v))) {
    promises.push(new Promise((resolve, reject) => {
      const uri = encodeURI(`${gcconnex}/discussion/${guid}`);
      request({
        uri,
        headers: {
          'X-Custom-Authorization': 'fp6DmvY2HRwZgn+WjW8qFRfU2duXcxZ1DfNIYqNJYg1tjchEgOVldgVyFl2mD8cZHyb4S2v/T/QFsB4+qwm6NK/ZdJv0exLZn34U+2VzhEusFIKMsM5EA93sde/RgWAm7hi5nZUI7qHqtmfS20mGJnmYAEdNHRLFPnYjZWplXEJFi91NdTCL7PbkfqsmeCHPODhNzlbWquQVFM0UnPiI+17r3/wx1dYEomiXII3d6wyY4yPxpOG0+FIzeqKv3bmftC8+qDkB0vunwksjI6WOdTbktyhWWUlOmIBwp6HZzv9DFVxLnUmgr58EF4tn7+wV5wvbpGFtArKutbpT0vymwyvIzxsh48Um0+Tf7LjdC+g8LhwvqRid/yrET++I3sygnAX4yNzlLgixEUzoxW5c2Bdgs9ptu0AU5HwwE12USdVjvalRn4A+WzmrpKpFFed8nG4tGeBS5pMWHI521BWbfr00zAX4mLFe22sJDLHkFE5lk/8CEaCwaW4237ykBRyFoV7fyaU34nt5rcKpOkDIb98PHy0c2Iu29hjSklFcpp9f0GtHff2+5cCHhTLcR7Lc7pUUUEsSwkHCnwIcJ3SIcoVrc0LxAdGuhqcE/mIVvGsLaaq4NfxGlbCbj9nVBCUw+0803Fv/XxcmQXdqU0gIQQ4hDfUhGOGA8mjGoUcVj0A='
        },
        tunnel: true,
        json: true,
      }, (error, response, body) => {
        const gcconnex_source = { name: 'gcconnex' };
        if (!error && response.statusCode == 200) {
          const p = body.export[1];
          const data = {
            id: `${p.guid}`,
            name:
              mkStr([{ value: p.name, source: gcconnex_source }]),
            email:
              mkStr([{ value: p.email, source: gcconnex_source }]),
            department:
              mkStr([{ value: p.department, source: gcconnex_source }]),
            description:
              mkStr([{ value: p.description, source: gcconnex_source }]),
          };
          resolve(data);
        }
        reject(error);
      });
    }));
  }

  if (missing_selections.some(v => gcprofile_fields.includes(v))) {
    const gcprofile_source = { name: 'GCprofile' };
    promises.push(new Promise((resolve, reject) => {
      const uri = encodeURI(`${profile_service}/${guid}`);
      request({
        uri,
        proxy: false,
        json: true,
      }, (error, response, body) => {
        if (error) {
          reject(error);
        } else if (body.rows && body.rows.length === 1) {
          const profile = JSON.parse(body.rows[0].payload);
          const { pc } = profile;
          const obj = {};
          if (missing_selections.includes('phraseCloud')) {
            const args = getArgumentsForSelector('phraseCloud', selections);
            const phraseCloud = Object.keys(pc)
              .map(text => ({
                text: mkStr([{ value: text, source: gcprofile_source }]),
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
              });
            obj.phraseCloud = phraseCloud;
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
      mergeDiscussionData(discussion, data);
      resolve([discussion]);
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

export const discussionResolver = (root, args, context, info) => {
  const selections = getSelectionsForField(['people', 'me'], info);
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
            res.push(getDiscussionData(data[0][x], selections));
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
                res.push(getDiscussionData(data[x][y], selections));
                if (counter === args.limit) break;
              }
            }
            if (counter === args.limit) break;
          }
        }
        Promise.all(res)
          .then(final_data => {
            const people = final_data.map(([u]) => u);
            resolve(people);
          }).catch(err => reject(err));
      }).catch(err => reject(err));
    });
  }
  return new Promise((resolve, reject) => {
    if (root.gcconnex_guid != '-1') {
      getDiscussionData({id: root.gcconnex_guid}, selections)
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
