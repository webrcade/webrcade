###############################################################################
# Build
###############################################################################

FROM ubuntu:20.04 as builder

RUN apt-get update -y && apt-get install -y zip curl git wget
RUN curl -fsSL https://deb.nodesource.com/setup_12.x | bash - && apt-get install -y nodejs

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

RUN apt-get update --allow-insecure-repositories
# Node 16
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash - && \
  apt-get install -y nodejs openssl apache2-utils  && \
  apt-get clean && \
  apt-get autoclean && \
  apt-get autoremove

# Enable the SSL module for Apache
RUN a2enmod ssl

# Create a directory for SSL certificates
RUN mkdir -p /usr/local/apache2/conf/ssl

# Generate the self-signed certificate only if it doesn't already exist
RUN echo '#!/bin/bash' > /usr/local/bin/generate-certificate.sh && \
    echo 'DOMAIN="localhost"' >> /usr/local/bin/generate-certificate.sh && \
    echo 'CERT_DIR="/usr/local/apache2/conf/ssl"' >> /usr/local/bin/generate-certificate.sh && \
    echo 'CERT_KEY="${CERT_DIR}/server.key"' >> /usr/local/bin/generate-certificate.sh && \
    echo 'CERT_CRT="${CERT_DIR}/server.crt"' >> /usr/local/bin/generate-certificate.sh && \
    echo 'DAYS_VALID=365' >> /usr/local/bin/generate-certificate.sh && \
    echo '' >> /usr/local/bin/generate-certificate.sh && \
    echo '# Check if the certificate and key already exist' >> /usr/local/bin/generate-certificate.sh && \
    echo 'if [ ! -f "$CERT_KEY" ] || [ ! -f "$CERT_CRT" ]; then' >> /usr/local/bin/generate-certificate.sh && \
    echo '    echo "Generating self-signed certificate..."' >> /usr/local/bin/generate-certificate.sh && \
    echo '' >> /usr/local/bin/generate-certificate.sh && \
    echo '    # Create the SSL certificate and key using OpenSSL' >> /usr/local/bin/generate-certificate.sh && \
    echo '    openssl genpkey -algorithm RSA -out $CERT_KEY -pkeyopt rsa_keygen_bits:2048' >> /usr/local/bin/generate-certificate.sh && \
    echo '    openssl req -new -key $CERT_KEY -out ${CERT_DIR}/server.csr -subj "/C=US/ST=State/L=City/O=Organization/OU=OrgUnit/CN=$DOMAIN"' >> /usr/local/bin/generate-certificate.sh && \
    echo '    openssl x509 -req -in ${CERT_DIR}/server.csr -signkey $CERT_KEY -out $CERT_CRT -days $DAYS_VALID' >> /usr/local/bin/generate-certificate.sh && \
    echo '    # Clean up the CSR file' >> /usr/local/bin/generate-certificate.sh && \
    echo '    rm -f ${CERT_DIR}/server.csr' >> /usr/local/bin/generate-certificate.sh && \
    echo '    echo "Self-signed certificate generated."' >> /usr/local/bin/generate-certificate.sh && \
    echo 'else' >> /usr/local/bin/generate-certificate.sh && \
    echo '    echo "Certificate already exists, skipping generation."' >> /usr/local/bin/generate-certificate.sh && \
    echo 'fi' >> /usr/local/bin/generate-certificate.sh

# Make the script executable
RUN chmod +x /usr/local/bin/generate-certificate.sh

# Single script to handle both HTTPS config (including CORS) and the certificate generation
RUN echo '#!/bin/bash' > /usr/local/bin/setup-https.sh && \
    echo 'APACHE_CONF="/etc/apache2/sites-available/000-default.conf"' >> /usr/local/bin/setup-https.sh && \
    echo 'if ! grep -q "SSLEngine on" "$APACHE_CONF"; then' >> /usr/local/bin/setup-https.sh && \
    echo '    echo "Adding HTTPS configuration to Apache..."' >> /usr/local/bin/setup-https.sh && \
    echo '' >> /usr/local/bin/setup-https.sh && \
    echo '    # Backup the existing Apache config before modifying (optional)' >> /usr/local/bin/setup-https.sh && \
    echo '    cp "$APACHE_CONF" "$APACHE_CONF.bak"' >> /usr/local/bin/setup-https.sh && \
    echo '' >> /usr/local/bin/setup-https.sh && \
    echo '    # Add the HTTPS configuration to the Apache config file' >> /usr/local/bin/setup-https.sh && \
    echo '    cat >> "$APACHE_CONF" <<EOL' >> /usr/local/bin/setup-https.sh && \
    echo '' >> /usr/local/bin/setup-https.sh && \
    echo '# Enable HTTPS on port 443' >> /usr/local/bin/setup-https.sh && \
    echo '' >> /usr/local/bin/setup-https.sh && \
    echo '<VirtualHost *:443>' >> /usr/local/bin/setup-https.sh && \
    echo '    ServerAdmin webmaster@localhost' >> /usr/local/bin/setup-https.sh && \
    echo '    DocumentRoot "/var/www/html"' >> /usr/local/bin/setup-https.sh && \
    echo '' >> /usr/local/bin/setup-https.sh && \
    echo '    # SSL Configuration' >> /usr/local/bin/setup-https.sh && \
    echo '    SSLEngine on' >> /usr/local/bin/setup-https.sh && \
    echo '    SSLCertificateFile /usr/local/apache2/conf/ssl/server.crt' >> /usr/local/bin/setup-https.sh && \
    echo '    SSLCertificateKeyFile /usr/local/apache2/conf/ssl/server.key' >> /usr/local/bin/setup-https.sh && \
    echo '' >> /usr/local/bin/setup-https.sh && \
    echo '    # CORS Configuration for HTTPS' >> /usr/local/bin/setup-https.sh && \
    echo '    ProxyRequests Off' >> /usr/local/bin/setup-https.sh && \
    echo '    <Location /cors>' >> /usr/local/bin/setup-https.sh && \
    echo '        ProxyPreserveHost On' >> /usr/local/bin/setup-https.sh && \
    echo '        ProxyPass http://localhost:8787' >> /usr/local/bin/setup-https.sh && \
    echo '        ProxyPassReverse http://localhost:8787' >> /usr/local/bin/setup-https.sh && \
    echo '    </Location>' >> /usr/local/bin/setup-https.sh && \
    echo '' >> /usr/local/bin/setup-https.sh && \
    echo '    ErrorLog ${APACHE_LOG_DIR}/error.log' >> /usr/local/bin/setup-https.sh && \
    echo '    CustomLog ${APACHE_LOG_DIR}/access.log combined' >> /usr/local/bin/setup-https.sh && \
    echo '</VirtualHost>' >> /usr/local/bin/setup-https.sh && \
    echo '' >> /usr/local/bin/setup-https.sh && \
    echo 'EOL' >> /usr/local/bin/setup-https.sh && \
    echo '    echo "HTTPS configuration added to Apache config."' >> /usr/local/bin/setup-https.sh && \
    echo 'else' >> /usr/local/bin/setup-https.sh && \
    echo '    echo "HTTPS configuration already exists in $APACHE_CONF."' >> /usr/local/bin/setup-https.sh && \
    echo 'fi' >> /usr/local/bin/setup-https.sh

# Make the script executable
RUN chmod +x /usr/local/bin/setup-https.sh

# Node-based CORS
RUN npm install -g miniflare@2.12.1 && \
  curl -fsSL https://webrcade.github.io/webrcade-utils/cors-v2.js > /var/www/cors.js && \
  curl -fsSL https://webrcade.github.io/webrcade-utils/apache.conf > /etc/apache2/sites-available/000-default.conf

# Create .htaccess for content directory
RUN echo "Options +Indexes" >> /home/.htaccess && \
  echo "Header add Access-Control-Allow-Origin \"*\"" >> /home/.htaccess

# COOP and COEP to /play
RUN echo '<IfModule mod_headers.c>\n\
    <FilesMatch "^.*$">\n\
        Header set Cross-Origin-Opener-Policy "same-origin"\n\
        Header set Cross-Origin-Embedder-Policy "require-corp"\n\
    </FilesMatch>\n\
</IfModule>' > /var/www/html/play/.htaccess

# Disable COOP and COEP to app/editor
RUN echo '<IfModule mod_headers.c>\n\
    <FilesMatch "^.*$">\n\
        Header set Cross-Origin-Opener-Policy "unsafe-none"\n\
        Header set Cross-Origin-Embedder-Policy "unsafe-none"\n\
    </FilesMatch>\n\
</IfModule>' > /var/www/html/play/app/editor/.htaccess

# Start script
RUN echo "#!/bin/bash" >> /home/start.sh && \
  echo "/usr/local/bin/generate-certificate.sh" >> /home/start.sh && \
  echo "/usr/local/bin/setup-https.sh" >> /home/start.sh && \
  echo "yes | cp -rf /home/.htaccess /var/www/html/content" >> /home/start.sh && \
  echo "miniflare /var/www/cors.js &" >> /home/start.sh && \
  echo "apache2-foreground" >> /home/start.sh && \
  chmod +x /home/start.sh

# Fix file corruption issues that occurred via content mounts
RUN echo "EnableMMAP off" >> /etc/apache2/apache2.conf && \
  echo "EnableSendfile off" >> /etc/apache2/apache2.conf

# Create content directory
RUN mkdir -p /var/www/html/content

# Expose content
VOLUME ["/var/www/html/content"]

# Export ports
EXPOSE 80 443

CMD ["/home/start.sh"]