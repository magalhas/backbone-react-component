'use strict';
var _ = require('underscore');
var BlogCollection = require('./public/collections/blog');
var BlogComponent = require('./public/components/blog');
var express = require('express');
var React = require('react');
// Collection setup without dummy daya
var blogCollection = new BlogCollection();
var blogComponent = BlogComponent({collection: blogCollection});
// Httpd setup
var httpd = express();
httpd.use(express.json());
httpd.use(express.urlencoded());
// Get component first render and collection
httpd.get('/components/blog', function (req, res) {
  res.send({
    component: React.renderComponentToString(blogComponent),
    data: blogCollection.toJSON()
  });
});
// Get collection
httpd.get('/resources/blog', function (req, res) {
  res.send(blogCollection.toJSON());
});
// Post new model
httpd.post('/resources/blog', function (req, res) {
  var post = req.body;
  post.id = _.uniqueId();
  blogCollection.add(post);
  res.send(post);
});
// Update existing model
httpd.put('/resources/blog/:id', function (req, res) {
  var id = req.params.id;
  var post = blogCollection.get(id);
  if (post) {
    post.set(req.body);
    res.send(post);
  } else {
    res.send(404);
  }
});
// Delete existing model
httpd.delete('/resources/blog/:id', function (req, res) {
  var id = req.params.id;
  var post = blogCollection.get(id);
  if (post) {
    blogCollection.remove(post);
    res.send(post);
  } else {
    res.send(404);
  }
});
httpd.use(express.static(__dirname + '/public'));
httpd.listen(8888);
