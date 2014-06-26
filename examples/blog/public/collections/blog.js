(function (root, factory) {
  if (typeof module !== 'undefined') {
    var Backbone = require('backbone');
    module.exports = factory(Backbone);
  } else
    root.BlogCollection = factory(this.Backbone);
}(this, function (Backbone) {
  'use strict';
  var BlogCollection = Backbone.Collection.extend({
    url: 'resources/blog'
  });

  return BlogCollection;
}));
