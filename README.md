# [Backbone.React.Component](http://magalhas.github.io/backbone-react-component/) [![Build Status](https://travis-ci.org/magalhas/backbone-react-component.png)](https://travis-ci.org/magalhas/backbone-react-component)

Backbone.React.Component is a wrapper or mixin for React.Component and brings all the power of Facebook's React to Backbone.js.

It works as a bridge between React and Backbone enabling data binding between models, collections and components both on the client and server sides.

It comes in two flavours, a ready to use React mixin or a wrapper class with an extended API.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](http://doctoc.herokuapp.com/)*

- [Dependencies](#dependencies)
- [How To](#how-to)
	- [Usage through the mixin](#usage-through-the-mixin)
	- [Usage through the component](#usage-through-the-component)
		- [Basic usage](#basic-usage)
		- [Mounting the component](#mounting-the-component)
		- [With a collection](#with-a-collection)
		- [With multiple models and collections](#with-multiple-models-and-collections)
	- [Usage on the server (Node.js)](#usage-on-the-server-nodejs)
	- [How it works](#how-it-works)
	- [Shared API (Component/Mixin)](#shared-api-componentmixin)
		- [$](#$)
		- [getCollection()](#getcollection)
		- [getModel()](#getmodel)
		- [getOwner()](#getowner)
	- [Component API](#component-api)
		- [constructor(props, children)](#constructorprops-children)
		- [extend(spec)](#extendspec)
		- [mount([el = this.el], [onRender])](#mountel-=-thisel-onrender)
		- [unmount()](#unmount)
		- [remove()](#remove)
		- [toHTML()](#tohtml)
		- [clone(props, children)](#cloneprops-children)
- [Examples](#examples)
- [Tips](#tips)
- [TO DO](#to-do)

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


### Usage through the mixin
The usage of Backbone.React.Component.mixin is similar to Backbone.React.Component, though it relies on React top level API instead of wrapping it.
```js
var MyComponent = React.createClass({
  mixins: [Backbone.React.Component.mixin],
  render: function () {
    return <div>{this.props.foo}</div>;
  }
});
var model = new Backbone.Model({foo: 'bar'});
var myComponent = <MyComponent model={model} />;

React.renderComponent(newComponent, document.body);
model.set('test', 'Hello world!');
```

### Usage through the component
It follows all the principles behind [React.Component](http://facebook.github.io/react/docs/component-api.html), though it binds models and collections to the component's props besides giving you a set of extra methods (extend, toHTML, getModel, getCollection, $, etc). Many of the principles found in the following examples are applied to the mixin version as well.

#### Basic usage
```js
/** @jsx React.DOM */
var MyComponent = Backbone.React.Component.extend({
  render: function () {
    return <div>{this.props.test}</div>;
  }
});
var model = new Backbone.Model();
var newComponent = new MyComponent({
  el: $('body'),
  model: model
});
model.set('test', 'Hello world!');
```
The Component will listen to any model changes, making it automatically refresh using React's algorithm.

#### Mounting the component
```js
newComponent.mount();
```

#### With a collection
```js
var newComponent = new MyComponent({
  el: $('body'),
  collection: new Backbone.Collection([{helloWorld: 'Hello world!'}])
});
```
```js
var MyComponent = Backbone.React.Component.extend({
  createEntry: function (entry) {
    return <div>{entry.helloWorld}</div>;
  },
  render: function () {
    return <div>{this.props.collection.map(this.createEntry)}</div>;
  }
});
```

#### With multiple models and collections
```js
var newComponent = new MyComponent({
  el: $('body'),
  model: {
    firstModel: new Backbone.Model({helloWorld: 'Hello world!'}),
    secondModel: new Backbone.Model({helloWorld: 'Hello world!'})
  },
  collection: {
    firstCollection: new Backbone.Collection([{helloWorld: 'Hello world!'}]),
    secondCollection: new Backbone.Collection([{helloWorld: 'Hello world!'}])
  }
});
```
```js
var MyComponent = Backbone.React.Component.extend({
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
```

### Usage on the server (Node.js)
```js
var Backbone = require('backbone');
var Component = require('backbone-react-component');
var React = require('react');

var model = new Backbone.Model({
  helloWorld: 'Hello world!'
});
var HelloWorld = Component.extend({
  render: function () {
    return React.DOM.div({}, this.props.helloWorld);
  }
});
var helloWorld = new HelloWorld({
  model: model
});
helloWorld.toHTML();
// Updating the model
model.set('helloWorld', 'Hi again!');
helloWorld.toHTML(); 
```

### How it works
Backbone.React.Component is nothing more nothing less than a bridge between [Backbone](http://backbonejs.org/) and [React](http://facebook.github.io/react/).

The following diagram illustrates how the data binding is achieved between our models/collections and a React.Component:

[Bridge between Backbone and React](http://yuml.me/88e7b7fd)

### Shared API (Component/Mixin)
The following API is available on both mixin (through Backbone.React.Component.mixin) or Backbone.React.Component (through Backbone.React.Component.extend).

#### $
Inspired by Backbone.View, it's a shortcut to this.$el.find method.

#### getCollection()
Crawls to the owner of the component searching for a collection.

#### getModel()
Crawls to the owner of the component searching for a model.

#### getOwner()
Gets the component owner (greatest parent component).


### Component API
Besides inheriting all the methods from [React.Component](http://facebook.github.io/react/docs/component-api.html) and [Backbone.Events](http://backbonejs.org/#Events) you can find the following methods:

#### constructor(props, children)
props is an object and may contain el, model and collection properties. Model and collection properties may be multiple by passing an object as their values.

#### extend(spec)
This is a static method inspired by Backbone, it inherits a component definition (class) to a new one.

#### mount([el = this.el], [onRender])
* el (DOMElement)
* onRender (Callback)
Mounts the component into the DOM.

#### unmount()
Unmounts the component. Throws an error if the component doesn't unmount successfully.

#### remove()
Stops component listeners and unmounts the component.

#### toHTML()
Intended to be used on the server, returns an HTML string representation of the component.

#### clone(props, children)
Returns a clone of the component.

## Examples
* [Blog](https://github.com/magalhas/backbone-react-component/tree/master/examples/blog)
* [Typewriter](https://rawgithub.com/magalhas/backbone-react-component/master/examples/typewriter/index.html)

## Tips
* When using the component instead of the mixin remember your root components start listening to model and collection changes when created. To dispose of them call the remove method (mount/unmount no longer starts/stops listeners). If you're using the mixin you don't have to worry because disposal is automatic when the component unmounts.

## TO DO
* Any ideas?
