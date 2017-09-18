var Post = require('./Post');
var express = require('express');

var router = express.Router();

router.get('/', function(req, res, next) {
  Post.find({}, {text: 1}, function(err, docs) {
    if (err) return next(err);
    res.send(docs);
  });
});

router.post('/', function(req, res, next) {
  Post.create({
    text: req.body.text
  }, function(err) {
    if (err) return next(err);
    res.send('ok');
  });
});

router.delete('/:id', function(req, res, next) {
  Post.remove({_id: req.params.id}, function(err) {
    if (err) return next(err);
    res.send('ok');
  });
});


module.exports = router;