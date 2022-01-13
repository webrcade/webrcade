var fs = require('fs')
fs.readFile('src/feed/default-feed.json', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  var result = data.replace(/default-feed\/images\//g, 'https://play.webrcade.com/default-feed/images/');
  var final = result.replace(/default-feed\/content\//g, 'https://raw.githubusercontent.com/webrcade/webrcade/master/public/default-feed/content/');

  fs.writeFile('public/default-feed.json', final, 'utf8', function (err) {
     if (err) return console.log(err);
  });
});
