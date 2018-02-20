# for more information about the base image for this container,
# see: https://github.com/smebberson/docker-alpine/tree/master/alpine-nginx-nodejs

FROM smebberson/alpine-nginx-nodejs
RUN  apk update && apk add wget
RUN  mkdir /frontend && mkdir /frontend/src && mkdir /frontend/dist
ADD  src /frontend/src/
COPY package.json /frontend 
COPY webpack.config.js /frontend
RUN  cd /frontend && npm install && npm run build
RUN  cp -r /frontend/dist/* /usr/html/
ENTRYPOINT \
     wget -P /usr/html/ http://celestrak.com/NORAD/elements/stations.txt \
     && nginx