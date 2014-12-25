/** @jsx React.DOM */
/* globals _:true, document:true */
(function () {
  'use strict';
  // Our implementation of `Backbone.Model`
  var Model = Backbone.Model.extend({
    set: function (attrs) {
      var self = this;
      if (attrs.collection) {
        // Bind any child collection changes to the model by triggering `change`.
        // This allows the root components to be aware that we need to change the
        // DOM.
        attrs.collection.on('add remove change', function () {
          self.trigger('change');
        });
      }
      Backbone.Model.prototype.set.apply(this, arguments);
    }
  });
  // Our implementation of `Backbone.Collection`
  var Collection = Backbone.Collection.extend({
    model: Model
  });
  // Create a `Collection` with a `Model` that contains a `Collection`
  var collection = new Collection([{
    foo: 'tar',
    collection: new Collection([{
      foo: 'bar',
      collection: new Collection()
    }])
  }]);
  // Component that represents a `Collection`. It's composed by `ModelComponent`s.
  var CollectionComponent = React.createClass({
    mixins: [Backbone.React.Component.mixin],
    createModel: function (model) {
      // We'll use `foo` as our id. Normally you would use `model.id`.
      return (
        <li>
          <ModelComponent key={model.get('foo')} model={model} />
        </li>
      );
    },
    render: function () {
      // Using `this.getCollection` to grab model instances instead of JSON through `this.props`
      return (
        <div>
          <strong>Collection</strong>
          <button onClick={this.addToCollection}>Insert</button>
          <ul>
            {this.getCollection().map(this.createModel)}
          </ul>
        </div>
      );
    },
    addToCollection: function (event) {
      this.getCollection().add({
        foo: _.uniqueId('new'),
        collection: new Collection()
      });
    }
  });
  // Component that represents a `Model`.
  var ModelComponent = React.createClass({
    mixins: [Backbone.React.Component.mixin],
    createCollection: function () {
      if (this.props.collection) {
        return <CollectionComponent collection={this.props.collection} />;
      }
    },
    render: function () {
      return (
        <div>
          <strong>{this.props.foo}</strong>
          <button onClick={this.removeModel}>Remove</button>
          <ul>
            <li>{this.createCollection()}</li>
          </ul>
        </div>
      );
    },
    removeModel: function (event) {
      this.getModel().destroy();
    }
  });
  // Render a `CollectionComponent` with the `collection` into `document.body`
  React.render(<CollectionComponent collection={collection} />, document.body);
}());
