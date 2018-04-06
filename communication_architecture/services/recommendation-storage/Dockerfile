FROM alpine:latest
LABEL maintainer="luc.belliveau@nrc-cnrc.gc.ca"
RUN mkdir /app && apk --no-cache add nodejs
COPY lib/ /app/
WORKDIR /app
EXPOSE 8080
CMD node bundle.js
