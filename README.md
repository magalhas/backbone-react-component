# [Backbone.React.Component](http://magalhas.github.io/backbone-react-component/) [![Build Status](https://travis-ci.org/magalhas/backbone-react-component.png)](https://travis-ci.org/magalhas/backbone-react-component)

`Backbone.React.Component` is a mixin that glues [Backbone](http://backbonejs.org/) models and collections into [React](http://facebook.github.io/react/) components.

When the component is mounted, a wrapper starts listening to models and collections changes to automatically set your component props and achieve UI binding through reactive updates.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](http://doctoc.herokuapp.com/)*

- [Dependencies](#dependencies)
- [How To](#how-to)
  - [Usage](#usage)
    - [One model](#one-model)
    - [One collection](#one-collection)
    - [Multiple models and collections](#multiple-models-and-collections)
  - [Usage on the server (Node.js)](#usage-on-the-server-nodejs)
  - [API](#api)
    - [$](#$)
    - [getCollection()](#getcollection)
    - [getModel()](#getmodel)
    - [getOwner()](#getowner)
- [Examples](#examples)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Dependencies
* [Backbone](http://backbonejs.org/) ([Underscore](http://underscorejs.org/))
* [React](http://facebook.github.io/react/)

## How To
Using [Bower](http://bower.io/)
```
bower install backbone-react-component
```

Using [Npm](https://npmjs.org/)
```
npm install backbone-react-component
```
If you're not using [Bower](http://bower.io/) nor [Npm](https://npmjs.org/) download the source from the dist folder or use [CDNJS](http://cdnjs.com/).


### Usage

#### One model
```js
var MyComponent = React.createClass({
  mixins: [Backbone.React.Component.mixin],
  render: function () {
    return <div>{this.props.foo}</div>;
  }
});

var model = new Backbone.Model({foo: 'bar'});

React.renderComponent(<MyComponent model={model} />, document.body);
// Update the UI
model.set('foo', 'Hello world!');
```
`MyComponent` will listen to any model changes, making the UI refresh.

#### One collection
```js
var MyComponent = React.createClass({
  mixins: [Backbone.React.Component.mixin],
  createEntry: function (entry) {
    return <div>{entry.helloWorld}</div>;
  },
  render: function () {
    return <div>{this.props.collection.map(this.createEntry)}</div>;
  }
});
var collection = new Backbone.Collection([{helloWorld: 'Hello world!'}]);

React.renderComponent(<MyComponent collection={collection} />, document.body);
```

#### Multiple models and collections
```js
var MyComponent = React.createClass({
  mixins: [Backbone.React.Component.mixin],
  createEntry: function (entry) {
    return <div>{entry.helloWorld}</div>;
  },
  render: function () {
    return (
      <div>
        {this.props.firstModel.helloWorld}
        {this.props.secondModel.helloWorld}
        {this.props.firstCollection.map(this.createEntry)}
        {this.props.secondCollection.map(this.createEntry)}
      </div>
    );
  }
});

var newComponent = MyComponent({
  model: {
    firstModel: new Backbone.Model({helloWorld: 'Hello world!'}),
    secondModel: new Backbone.Model({helloWorld: 'Hello world!'})
  },
  collection: {
    firstCollection: new Backbone.Collection([{helloWorld: 'Hello world!'}]),
    secondCollection: new Backbone.Collection([{helloWorld: 'Hello world!'}])
  }
});
React.renderComponent(newComponent, document.body);
```

### Usage on the server (Node.js)
```js
var Backbone = require('backbone');
var backboneMixin = require('backbone-react-component');
var React = require('react');

var model = new Backbone.Model({
  helloWorld: 'Hello world!'
});
var HelloWorld = React.createClass({
  mixins: [backboneMixin],
  render: function () {
    return React.DOM.div({}, this.props.helloWorld);
  }
});
var helloWorld = new HelloWorld({
  model: model
});
// Render to an HTML string
React.renderComponentToString(helloWorld);
// Updating the model
model.set('helloWorld', 'Hi again!');
// Rendering to an HTML string again
React.renderComponentToString(helloWorld);
```

### API
The following API is under `Backbone.React.Component.mixin` (`require('backbone-react-component')`):

#### $
Inspired by Backbone.View, it's a shortcut to this.$el.find method.

#### getCollection()
Crawls to the owner of the component searching for a collection.

#### getModel()
Crawls to the owner of the component searching for a model.

#### getOwner()
Gets the component owner (greatest parent component).

## Examples
* [Blog](https://github.com/magalhas/backbone-react-component/tree/master/examples/blog)
* [Nested](https://github.com/magalhas/backbone-react-component/tree/master/examples/nested)
* [Typewriter](https://rawgithub.com/magalhas/backbone-react-component/master/examples/typewriter/index.html)
