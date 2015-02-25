/** @jsx React.DOM */
(function (root, factory) {
  if (typeof module !== 'undefined') {
    var _ = require('underscore');
    var Backbone = require('backbone');
    var React = require('react');
    module.exports = factory(_, Backbone, React, require('backbone-react-component'));
  } else
    root.BlogComponent = factory(this._, this.Backbone, this.React, this.Backbone.React.Component.mixin);
}(this, function (_, Backbone, React, backboneMixin) {
  'use strict';
  // In a better implementation this would be splited into multiple components.
  // Keeping this under one component for the sake of the example. Remember composition :)
  var BlogComponent = React.createClass({
    mixins: [backboneMixin],
    getInitialState: function () {
      return {
        id: null,
        title: '',
        content: ''
      };
    },
    // Form rendering
    createForm: function () {
      return (
        React.DOM.form( {onSubmit:this.handleSubmit},
          React.DOM.h2(null, this.state.id ? 'Edit Post' : 'Create Post'),
          React.DOM.input( {name:"id", type:"hidden", value:this.state.id} ),
          React.DOM.input( {name:"title", type:"text", value:this.state.title, onChange:this.handleChange} ),
          React.DOM.textarea( {name:"content", value:this.state.content, onChange:this.handleChange} ),
          React.DOM.input( {type:"submit", value:this.state.id ? 'Update' : 'Insert'} )
        )
      );
    },
    // Post rendering
    createPost: function (post) {
      return (
        React.DOM.div( {key:post.id, 'data-id':post.id},
          React.DOM.h2(null, post.title),
          React.DOM.input( {type:"button", value:"Edit", onClick:this.handleEdit} ),
          React.DOM.input( {type:"button", value:"Remove", onClick:this.handleRemove} ),
          React.DOM.p(null, post.content)
        )
      );
    },
    // Whenever an input changes, set it into this.state
    handleChange: function (event) {
      var target = event.target;
      var key = target.getAttribute('name');
      var nextState = {};
      nextState[key] = target.value;
      this.setState(nextState);
    },
    // Getting the id of the post that triggered the edit button and passing the
    // respective model into this.state.
    handleEdit: function (event) {
      var id = event.target.parentNode.getAttribute('data-id');
      // By getting collection through this.state you get an hash of the collection
      this.setState(_.findWhere(this.state.collection, {id: id}));
    },
    // Getting the id of the post that triggered the remove button and destroying
    // it (local and server).
    handleRemove: function (event) {
      var id = event.target.parentNode.getAttribute('data-id');
      // This is how you get the real Backbone.Collection instance
      var collection = this.getCollection();
      collection.get(id).destroy({wait: true});
    },
    // Save the new or existing post to the services
    handleSubmit: function (event) {
      event.preventDefault();
      var collection = this.getCollection();
      var id = this.state.id;
      var model;
      if (id) {
        // Update existing model
        model = collection.get(id);
        model.save(this.state, {wait: true});
      } else {
        // Create a new one
        collection.create(this.state, {wait: true});
      }
      // Set initial state
      this.replaceState(this.getInitialState());
    },
    // Go go react
    render: function () {
      return (
        React.DOM.div(null,
          this.state.collection && this.state.collection.map(this.createPost),
          this.createForm()
        )
      );
    }
  });

  return BlogComponent;
}));
