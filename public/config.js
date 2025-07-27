// public/config.js
(function () {
  // Valeur par défaut (fallback)
  var DEFAULT_FEED = "https://play.webrcade.com/default-feed.json";

  // Placeholder à remplacer par l'entrypoint Docker
  var injected = "{{CUSTOM_FEED_URL}}";

  window.CUSTOM_FEED_URL = injected && injected !== "{{CUSTOM_FEED_URL}}" ? injected : DEFAULT_FEED;
})();
