/** @jsx React.DOM */
(function (root, factory) {
  if (typeof module !== 'undefined') {
    var _ = require('underscore');
    var Backbone = require('backbone');
    var React = require('react');
    var Component = require('backbone-react-component');
    module.exports = factory(_, Backbone, React, Component);
  } else
    root.BlogComponent = factory(this._, this.Backbone, this.React, this.Backbone.React.Component);
}(this, function (_, Backbone, React, Component) {
  'use strict';
  // In a better implementation this would be splited into multiple components.
  // Keeping this under one component for the sake of the example. Remember composition :)
  var BlogComponent = Component.extend({
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
        <form onSubmit={this.handleSubmit}>
          <h2>{this.state.id ? 'Edit Post' : 'Create Post'}</h2>
          <input name='id' type='hidden' value={this.state.id} />
          <input name='title' type='text' value={this.state.title} onChange={this.handleChange} />
          <textarea name='content' value={this.state.content} onChange={this.handleChange} />
          <input type='submit' value={this.state.id ? 'Update' : 'Insert'} />
        </form>
      );
    },
    // Post rendering
    createPost: function (post) {
      return (
        <div key={post.id} data-id={post.id}>
          <h2>{post.title}</h2>
          <input type='button' value='Edit' onClick={this.handleEdit} />
          <input type='button' value='Remove' onClick={this.handleRemove} />
          <p>{post.content}</p>
        </div>
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
      // By getting collection through this.props you get an hash of the collection
      this.setState(_.findWhere(this.props.collection, {id: id}));
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
        model = new Backbone.Model(this.state);
        collection.create(model, {wait: true});
      }
      // Set initial state
      this.replaceState(this.getInitialState());
    },
    // Go go react
    render: function () {
      return (
        <div>
          {this.props.collection.map(this.createPost)}
          {this.createForm()}
        </div>
      );
    }
  });

  return BlogComponent;
}));