# [Backbone.React.Component](http://magalhas.github.io/backbone-react-component/) [![Build Status](https://travis-ci.org/magalhas/backbone-react-component.png)](https://travis-ci.org/magalhas/backbone-react-component)

`Backbone.React.Component` is a mixin that glues [Backbone](http://backbonejs.org/) models and collections into [React](http://facebook.github.io/react/) components.

When the component is mounted, a wrapper starts listening to models and collections changes to automatically set your component state and achieve UI binding through reactive updates.

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
    - [overrideModel()](#overridemodel)
    - [overrideCollection()](#overridecollection)
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
    return <div>{this.state.model.foo}</div>;
  }
});

var model = new Backbone.Model({foo: 'bar'});

React.render(<MyComponent model={model} />, document.body);
// Update the UI
model.set('foo', 'Hello world!');
```
`MyComponent` will listen to any model changes, making the UI refresh.

#### One collection
```js
var MyComponent = React.createClass({
  mixins: [Backbone.React.Component.mixin],
  createEntry: function (entry) {
    return <div key={entry.id}>{entry.helloWorld}</div>;
  },
  render: function () {
    return <div>{this.state.collection.map(this.createEntry)}</div>;
  }
});
var collection = new Backbone.Collection([
  {id: 0, helloWorld: 'Hello world!'},
  {id: 1, helloWorld: 'Hello world!'}
]);

React.render(<MyComponent collection={collection} />, document.body);
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
        {this.state.firstModel.helloWorld}
        {this.state.secondModel.helloWorld}
        {this.state.firstCollection.map(this.createEntry)}
        {this.state.secondCollection.map(this.createEntry)}
      </div>
    );
  }
});

var MyFactory = React.createFactory(MyComponent);

var newComponent = MyFactory({
  model: {
    firstModel: new Backbone.Model({helloWorld: 'Hello world!'}),
    secondModel: new Backbone.Model({helloWorld: 'Hello world!'})
  },
  collection: {
    firstCollection: new Backbone.Collection([{helloWorld: 'Hello world!'}]),
    secondCollection: new Backbone.Collection([{helloWorld: 'Hello world!'}])
  }
});
React.render(newComponent, document.body);
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
    return React.DOM.div({}, this.state.model.helloWorld);
  }
});
var HelloWorldFactory = React.createFactory(HelloWorld);

// Render to an HTML string
React.renderToString(HelloWorldFactory({model: model}));
// Updating the model
model.set('helloWorld', 'Hi again!');
// Rendering to an HTML string again
React.renderToString(HelloWorldFactory({model: model}));
```

### API
The following API is under `Backbone.React.Component.mixin` (`require('backbone-react-component')`):

#### $
Inspired by Backbone.View, it's a shortcut to this.$el.find method if `jQuery`
is present, else it fallbacks to native DOM `querySelector`.

#### getCollection()
Grabs the component's collection(s) or from one of the parents.

#### getModel()
Grabs the component's model(s) or from one of the parents.

#### overrideModel()
Hook that can be implemented to return a model or multiple models. This hook is
executed when the component is initialized. It's useful on cases such as when
`react-router` is being used.

#### overrideCollection()
Hook that can be implemented to return a collection or multiple collections.
This hook is executed when the component is initialized. It's useful on cases
such as when `react-router` is being used.


## Examples
* [Blog](https://github.com/magalhas/backbone-react-component/tree/master/examples/blog)
* [Nested](https://github.com/magalhas/backbone-react-component/tree/master/examples/nested)
* [Typewriter](https://rawgithub.com/magalhas/backbone-react-component/master/examples/typewriter/index.html)
* [Screencast](https://www.youtube.com/watch?v=iul1fWHVU6A)
