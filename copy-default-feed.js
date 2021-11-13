var fs = require('fs')
fs.readFile('src/feed/default-feed.json', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  var result = data.replace(/default-feed\//g, 'https://play.webrcade.com/default-feed/');

  fs.writeFile('public/default-feed.json', result, 'utf8', function (err) {
     if (err) return console.log(err);
  });
});