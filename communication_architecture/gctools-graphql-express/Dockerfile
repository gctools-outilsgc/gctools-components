FROM node:9.3
RUN mkdir /app && \
  apt-get update && \
  apt-get install -f apt-transport-https && \
  curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
  echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
  apt-get update && \
  apt-get -f install yarn
COPY package.json /app/
WORKDIR /app
RUN yarn
ADD . /app
RUN yarn build-lib && (cd lib && yarn)

# TODO: add build step to compile /lib folder

FROM alpine:3.7
LABEL maintainer="luc.belliveau@nrc-cnrc.gc.ca"
RUN mkdir /app && apk --no-cache add nodejs
COPY --from=0 /app/lib/ /app/
WORKDIR /app

EXPOSE 3001
EXPOSE 3002

CMD node bundle.js
