###############################################################################
# Build 
###############################################################################

FROM node:12.13.1 as builder

RUN apt-get update -y && apt-get install -y zip

RUN mkdir webrcade 
COPY \
  copy-default-feed.js \
  dist.sh \
  dist-package.sh \
  dist-clone-deps.sh \
  dist-version.sh \
  package.json \
  package-lock.json \
  VERSION \
  ./webrcade/
COPY public ./webrcade/public
COPY CHANGELOG.md ./webrcade/public
COPY src ./webrcade/src

RUN chmod +x /webrcade/dist.sh && \
  chmod +x /webrcade/dist-package.sh && \
  chmod +x /webrcade/dist-clone-deps.sh && \
  chmod +x /webrcade/dist-version.sh

RUN cd / && /webrcade/dist-clone-deps.sh

COPY docker/config.json /webrcade-app-common/src/conf/

RUN cd /webrcade && \
  ./dist-version.sh "Docker Build" && \
  ./dist.sh
RUN wget -O - https://webrcade.github.io/webrcade-utils/cors.php > /webrcade/dist/out/cors.php
RUN cd /webrcade && \
  ./dist-package.sh  

###############################################################################
# Image
###############################################################################

FROM php:8.0-apache
COPY --from=builder ./webrcade/dist/package /var/www/html

RUN a2enmod headers && \
  a2enmod proxy_http && \
  a2enmod proxy_balancer && \
  a2enmod lbmethod_byrequests

# Node 16
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash - && \
  apt-get install -y nodejs && \
  apt-get clean && \
  apt-get autoclean && \
  apt-get autoremove

# Node-based CORS
RUN npm install -g miniflare && \
  curl -fsSL https://webrcade.github.io/webrcade-utils/cors.js > /var/www/cors.js && \
  curl -fsSL https://webrcade.github.io/webrcade-utils/apache.conf > /etc/apache2/sites-available/000-default.conf

# Create .htaccess for content directory
RUN echo "Options +Indexes" >> /home/.htaccess && \
  echo "Header add Access-Control-Allow-Origin \"*\"" >> /home/.htaccess

# Start script
RUN echo "#!/bin/bash" >> /home/start.sh && \
  echo "yes | cp -rf /home/.htaccess /var/www/html/content" >> /home/start.sh && \
  echo "miniflare /var/www/cors.js &" >> /home/start.sh && \
  echo "apache2-foreground" >> /home/start.sh && \
  chmod +x /home/start.sh

# Create content directory
RUN mkdir -p /var/www/html/content

# Expose content
VOLUME ["/var/www/html/content"]

# Export port
EXPOSE 80

CMD ["/home/start.sh"]
