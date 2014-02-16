(function (root, factory) {
  if (typeof module !== 'undefined') {
    var React = require('react');
    var Component = require('backbone-react-component');
    module.exports = factory(React, Component);
  } else
    root.BlogComponent = factory(this.React, this.Backbone.React.Component);
}(this, function (React, Component) {
  'use strict';
  var BlogComponent = Component.extend({
    createForm: function () {
      return React.DOM.form({onSubmit: this.handleSubmit}, [
        React.DOM.h2({}, 'New Post'),
        React.DOM.input({name: 'title', type: 'text', placeholder: 'Title'}),
        React.DOM.textarea({name: 'content', placeholder: 'Content'}),
        React.DOM.input({type: 'submit', value: 'Insert'})
      ]);
    },
    createPost: function (post, index) {
      return [
        React.DOM.h2({key: index + 't'}, post.title),
        React.DOM.p({key: index + 'c'}, post.content)
      ];
    },
    handleSubmit: function (event) {
      event.preventDefault();
      this.getCollection().create({
        title: this.$('[name="title"]').val(),
        content: this.$('[name="content"]').val()
      }, {
        wait: true
      });
      event.target.reset();
    },
    render: function () {
      var children = this.props.collection.map(this.createPost);
      children.push(this.createForm());
      return React.DOM.div({}, children);
    }
  });

  return BlogComponent;
}));