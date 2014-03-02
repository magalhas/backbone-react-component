# Backbone.React.Component
[![Build Status](https://travis-ci.org/magalhas/backbone-react-component.png)](https://travis-ci.org/magalhas/backbone-react-component)

Backbone.React.Component is a wrapper for React.Component and brings all the power of Facebook's React to Backbone.js.

It works as a bridge between React and Backbone enabling data binding between models/collections and components both on the client and server sides.

## Dependencies
* [Backbone](http://backbonejs.org/) ([Underscore](http://underscorejs.org/))
* [React](http://facebook.github.io/react/)

## How To
### Downloading and including the script
Using [Bower](http://bower.io/)
```shell
bower install backbone-react-component
```

Using [Npm](https://npmjs.org/)
```shell
npm install backbone-react-component
```
If you're not using [Bower](http://bower.io/) nor [Npm](https://npmjs.org/) download the source from the dist folder or use [CDNJS](http://cdnjs.com/).

The fastest way to start is including the script on your webpage (or use [RequireJS](http://requirejs.org/)/[Browserify](http://browserify.org/))
```html
...
<script type="text/javascript" src="https//cdnjs.cloudflare.com/ajax/libs/backbone-react-component/0.5.0/backbone-react-component-min.js"></script>
...
```

### Using Backbone.React.Component
It follows all the principles behind [React.Component](http://facebook.github.io/react/docs/component-api.html), though it binds models and collections to the component's props besides giving you a set of extra methods (extend, toHTML, getModel, getCollection, $, etc).

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
    return <div>{this.props.collection.map(this.createEntry())}</div>;
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
        {this.props.firstCollection.map(this.createEntry())}
        {this.props.secondCollection.map(this.createEntry())}
      </div>
    );
  }
});
```

### Using Backbone.React.Component on the server (Node.js)
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
helloWorld.toHTML(function (html) {
  console.log(html);
});
// Updating the model
model.set('helloWorld', 'Hi again!');
helloWorld.toHTML(function (html) {
  console.log(html);
});
```

### How it works
Backbone.React.Component is nothing more nothing less than a bridge between [Backbone](http://backbonejs.org/) and [React](http://facebook.github.io/react/).

The following diagram illustrates how the data binding is achieved between our models/collections and a React.Component:

[Bridge between Backbone and React](http://yuml.me/88e7b7fd)

## API
Besides inheriting all the methods from [React.Component](http://facebook.github.io/react/docs/component-api.html) and [Backbone.Events](http://backbonejs.org/#Events) you can find the following methods:

#### constructor(props, children)
props is an object and may contain el, model and collection properties. Model and collection properties may be multiple by passing an object as their values. The usage of the new keyword is optional.

#### extend(spec)
Inspired by Backbone, it inherits a component definition (class) to a new one.

#### $
Inspired by Backbone.View, it's a shortcut to this.$el.find method.

#### getCollection()
Gets the collection from the component's owner.

#### getModel()
Gets the model from the component's owner.

#### getOwner()
Gets the component owner (greatest parent component).

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
* Remember your root components start listening to model and collection changes when created. To dispose of them call the remove method (mount/unmount no longer starts/stops listeners).

## TO DO
* Any ideas?