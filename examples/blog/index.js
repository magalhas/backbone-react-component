'use strict';
var BlogCollection = require('./public/blog-collection');
var BlogComponent = require('./public/blog-component');
var express = require('express');
var React = require('react');
// Collection setup with dummy data
var blogCollection = new BlogCollection([
  {
    title: 'Test',
    content: 'Maecenas at lorem turpis. Maecenas elementum interdum ornare. Praesent ut lobortis tellus, et luctus eros. Curabitur id tristique justo. Morbi ultrices sapien at neque volutpat pulvinar. Vestibulum fringilla scelerisque justo, ac lacinia diam interdum et. Fusce id dolor in dui dapibus elementum in condimentum arcu. Praesent cursus fermentum porttitor. Praesent et imperdiet orci, lacinia sollicitudin tortor. Ut aliquet semper turpis quis facilisis. Aenean diam odio, malesuada ut velit dapibus, pellentesque egestas mauris. Vestibulum sit amet purus a diam laoreet varius. Donec condimentum pulvinar enim quis molestie. Phasellus tristique, augue ut eleifend fringilla, arcu leo mollis urna, egestas vestibulum lacus mi eu neque. Sed vulputate orci odio, eu egestas est mattis nec. Donec porta dolor vel iaculis fringilla.' 
  }
]);
// Component setup
var blogComponent = new BlogComponent({
  collection: blogCollection
});
// Httpd setup
var httpd = express();
httpd.use(express.json());
httpd.use(express.urlencoded());
httpd.get('/components/blog', function (req, res) {
  blogComponent.toHTML(function (html) {
    res.send({
      component: html,
      data: blogCollection.toJSON()
    });
  });
});
httpd.get('/resources/blog', function (req, res) {
  res.send(blogCollection.toJSON());
});
httpd.post('/resources/blog', function (req, res) {
  blogCollection.add(req.body);
  res.send(req.body);
});
httpd.use(express.static(__dirname + '/public'));
httpd.listen(8888);