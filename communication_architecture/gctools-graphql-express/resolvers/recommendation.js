import request from 'request'
import { makeSourcedString as mkStr } from '../schema/types/SourcedString';
import { getArticleData } from './article';

const recurl = 'http://recommendation-storage.gctoolsv2/recommendation';

export const recommendationResolver = (context) => {
  return (root, a, ctx, info) => {
      let uri = `${recurl}/${context}`;
      if (context === 'article_c1') {
        uri += `/${root.uuid}`;
      } else if (context === 'article_c2') {
        uri += `/-1`;
      } else if (context === 'article_c3') {
        uri += `/${root.uuid}/${a.article}`;
      } else if (context === 'article_c4') {
        uri += `/-1/${a.article}`;
      } else if (context === 'article_c5') {
        uri += `/${root.uuid}/${a.article}`;
      } else if (context === 'article_c6') {
        uri += `/-1/${a.article}`;
      }

      return new Promise((resolve, reject) => {
      request({
        uri: encodeURI(uri),
        tunnel: false,
        proxy: false,
        json: true,
      }, (error, response, body) => {
        if (error) {
          reject(error);
        } else {
          if (body.rows
            && body.rows.length > 0) {

            const context_sel = getSelectionsForField([context], info);
            const args = getArgumentsForSelector('phraseCloud', context_sel[0].selectionSet.selections);
            const articles = body.rows[0].articles || [];
            const articleArgs = getArgumentsForSelector('articles', context_sel);
            const additionalData = [];

            let groupBy = false;

            if (articleArgs.length) {
              for (let x = 0; x < articleArgs.length; x += 1) {
                const a = articleArgs[x];
                if (a.name.value === 'groupBy') {
                  groupBy = a.value.value;
                  break;
                }
              }
            }

            const newRoot = {
              articles: articles.map(a => ({
                id: a.guid,
                rank: a.rank,
                touched: a.touched,
                name: mkStr([{
                  value: a.title,
                  source: 'gcpedia'
                }]),
                // TODO: Move argument processing to common utility
                phraseCloud: a.phrase_cloud.map(pc => ({
                  text: mkStr([{ value: pc.phrase, source: 'gcprofile' }]),
                  rank: parseFloat(pc.rank),
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
                }),
              }))
              .filter(o => {
                if (articleArgs.length === 0) return true;
                let ret = true;
                for (let x = 0; x < articleArgs.length; x += 1) {
                  const a = articleArgs[x];
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
                if (articleArgs.length === 0) return true;
                for (let x = 0; x < articleArgs.length; x += 1) {
                  const a = articleArgs[x];
                  if (a.name.value === 'top') {
                    return idx < a.value.value;
                  }
                }
                return true;
              })
              .sort((a, b) => {
                if (groupBy) {
                  const dateA = new Date(parseInt(a.touched) * 1000);
                  const dateB = new Date(parseInt(b.touched) * 1000);
                  let compA = dateA.getFullYear();
                  let compB = dateB.getFullYear();

                  if (groupBy === 'month') {
                    compA = new Date(
                      dateA.getFullYear(),
                      dateA.getMonth(),
                      1
                    ).getTime() / 1000;
                    compB = new Date(
                      dateB.getFullYear(),
                      dateB.getMonth(),
                      1
                    ).getTime() / 1000;
                  }
                  return compB - compA
                    || parseFloat(b.rank) - parseFloat(a.rank);
                }
                return parseFloat(b.rank) - parseFloat(a.rank);
              })
            };
            newRoot.articles.forEach(a => {
              additionalData.push(
                getArticleData(a, context_sel[0].selectionSet.selections)
              );
            });
            Promise.all(additionalData).then(() => resolve(newRoot));
          } else {
            resolve(null);
          }
        }
      });
    });
  };
};

// TODO: Move these to a utility library
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


export default recommendationResolver;
