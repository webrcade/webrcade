#!/bin/sh
set -e

CFG="/usr/share/nginx/html/config.js"

if [ ! -f "$CFG" ]; then
  echo "[entrypoint] ERREUR : $CFG introuvable." >&2
  exit 1
fi

# Remplacement du placeholder dans config.js
if grep -q '{{CUSTOM_FEED_URL}}' "$CFG"; then
  if [ -n "$CUSTOM_FEED_URL" ] && [ "$CUSTOM_FEED_URL" != "{{CUSTOM_FEED_URL}}" ]; then
    echo "[entrypoint] Injection du feed custom : $CUSTOM_FEED_URL"
    sed -i "s|{{CUSTOM_FEED_URL}}|$CUSTOM_FEED_URL|g" "$CFG"
  else
    echo "[entrypoint] Pas d'URL fournie -> feed par défaut"
    sed -i "s|{{CUSTOM_FEED_URL}}|https://play.webrcade.com/default-feed.json|g" "$CFG"
  fi
else
  echo "[entrypoint] Pas de placeholder (déjà injecté ?)."
fi

exec "$@"
