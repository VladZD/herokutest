var express = require('express');
var app = express();

app.use(express.static('.'));
app.get('/secret', function(req, res) {
  res.send(process.env.CODE || 'There\'s no secret code');
});
app.listen(process.env.PORT || 3000);