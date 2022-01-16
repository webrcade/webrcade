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
  package.json \
  package-lock.json \  
  ./webrcade/
COPY public ./webrcade/public
COPY src ./webrcade/src

RUN chmod +x /webrcade/dist.sh && chmod +x /webrcade/dist-package.sh

RUN \
  git clone https://github.com/webrcade/webrcade-app-common.git && \
  git clone https://github.com/webrcade/webrcade-editor.git && \
  git clone https://github.com/webrcade/webrcade-app-snes9x.git && \
  git clone https://github.com/webrcade/webrcade-app-genplusgx.git && \
  git clone https://github.com/webrcade/webrcade-app-javatari.git && \
  git clone https://github.com/webrcade/webrcade-app-js7800.git && \
  git clone https://github.com/webrcade/webrcade-app-fceux.git && \
  git clone https://github.com/webrcade/webrcade-app-vba-m.git

COPY docker/config.json /webrcade-app-common/src/conf/

RUN cd /webrcade && ./dist.sh
RUN wget -O - https://webrcade.github.io/webrcade-utils/cors.php > /webrcade/dist/out/cors.php
RUN cd /webrcade && ./dist-package.sh

###############################################################################
# Image
###############################################################################

FROM php:8.0-apache
COPY --from=builder ./webrcade/dist/package /var/www/html

RUN a2enmod headers

# Create .htaccess for content directory
RUN echo "Options +Indexes" >> /home/.htaccess
RUN echo "Header add Access-Control-Allow-Origin \"*\"" >> /home/.htaccess

# Start script
RUN echo "#!/bin/bash" >> /home/start.sh
RUN echo "yes | cp -rf /home/.htaccess /var/www/html/content" >> /home/start.sh
RUN echo "apache2-foreground" >> /home/start.sh
RUN chmod +x /home/start.sh

# Create content directory
RUN mkdir -p /var/www/html/content

# Expose content
VOLUME ["/var/www/html/content"]

# Export port
EXPOSE 80

CMD ["/home/start.sh"]
