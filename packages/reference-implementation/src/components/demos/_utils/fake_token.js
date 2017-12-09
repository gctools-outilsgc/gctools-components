/*
 * Author: National Research Council Canada
 * Website: http://www.nrc-cnrc.gc.ca/eng/rd/ict/
 *
 * License: MIT
 * Copyright: Her Majesty the Queen in Right of Canada, as represented by
 * the Minister of National Research Council, 2017
 */
import { KJUR } from 'jsrsasign';

const createTokenForUser = (user) => {
  const secret = 'qWxPJrZCLeHZraNTWjEKHdJJxJyho8';
  const { email, gcconnex_username, gcconnex_guid } = user;
  // Header
  const header = { alg: 'HS256', typ: 'JWT' };
  // Payload
  const payload = { email, gcconnex_guid, gcconnex_username };
  // const tEnd = KJUR.jws.IntDate.get('now + 1day');
  // payload.exp = tEnd;
  // Sign JWT, password=616161
  const sHeader = JSON.stringify(header);
  const sPayload = JSON.stringify(payload);
  const sJWT = KJUR.jws.JWS.sign('HS256', sHeader, sPayload, secret);
  return `Bearer ${sJWT}`;
};

export default createTokenForUser;

