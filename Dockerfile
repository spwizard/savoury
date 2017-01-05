FROM alpine

WORKDIR /savory-web

ADD views /savory-web/views/
ADD shared /savory-web/shared/
ADD shared/assets/scripts/umami.js shared/assets/scripts/umami.js.map /savory-web/shared/assets/scripts/
ADD index.html app-controller.js app.js robots.txt /savory-web/

VOLUME /savory-web

CMD []
ENTRYPOINT []
