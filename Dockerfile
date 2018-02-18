FROM nginx:stable-alpine
RUN apt update
RUN apt install -y nodejs
RUN apt install -y npm
RUN mkdir /frontend && mkdir /frontend/src && mkdir /frontend/dist
COPY src /frontend/src
RUN cd /frontend && npm install && npm run build
COPY /frontend/src/index.html /frontend/dist/index.html
COPY /frontend/dist /usr/share/nginx/html
ENTRYPOINT wget -P /usr/share/nginx/html http://celestrak.com/NORAD/elements/stations.txt 