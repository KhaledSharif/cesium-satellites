FROM nginx:stable
RUN  apt update && apt install -y curl gnupg wget
RUN  curl -sL https://deb.nodesource.com/setup_9.x | bash - 
RUN  apt install -y nodejs npm
RUN  mkdir /frontend && mkdir /frontend/src && mkdir /frontend/dist
ADD  src /frontend/src/
COPY package.json /frontend 
COPY webpack.config.js /frontend
RUN  cd /frontend && npm install && npm run build
RUN  cp -r /frontend/dist/* /usr/share/nginx/html
ENTRYPOINT \
     wget -P /usr/share/nginx/html http://celestrak.com/NORAD/elements/stations.txt \
     && nginx -g "daemon off;"