FROM alpine:3.7
LABEL maintainer="luc.belliveau@nrc-cnrc.gc.ca"
RUN mkdir /app && apk --no-cache add nodejs nodejs-npm && npm install -g serve
COPY build/ /app/
WORKDIR /app
EXPOSE 5000
CMD serve -s .
