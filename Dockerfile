FROM nginx:1.28-alpine

ARG APP_DIR=/usr/share/nginx/html

# Copie du build
COPY dist/out/ ${APP_DIR}/

# Entrypoint
COPY docker-entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh && \
    mkdir -p ${APP_DIR}/content ${APP_DIR}/feeds

# Volumes pour ROMs et feed
VOLUME ["/usr/share/nginx/html/content", "/usr/share/nginx/html/feeds"]

ENV CUSTOM_FEED_URL=""
EXPOSE 80

ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
