# Backbone.Component

Backbone.Component is a wrapper for React.Component and brings all the power of Facebook's React to Backbone.js.

## Dependencies
* [Backbone](http://backbonejs.org/) ([jQuery](http://jquery.com/)/[Underscore](http://underscorejs.org/))
* [React](http://facebook.github.io/react/)

## How To
### Downloading and including the script
Using [Bower](http://bower.io/)
```shell
bower install backbone-component
```
If you're not using [Bower](http://bower.io/) downlooad the source from the dist folder.

Include the script on your webpage (or use [RequireJS](http://requirejs.org/)/[Browserify](http://browserify.org/))
```html
...
<script type="text/javascript" src="bower_components/backbone-component/backbone-component-min.js"></script>
...
```

### Using Backbone.Component
It follows all the principles behind React.Component, though it binds models to the component's props and also automatically
mounts the component into the component's $el.
```js
/** @jsx React.DOM */
var MyComponent = Backbone.Component.extend({
  componentDidMount: function () {
    this.$el = $(this.getDOMNode());
  },
  componentWillUnmount: function () {

  },
  getDefaultProps: function () {
    return {};
  },
  getInitialState: function () {
    return {};
  },
  render: function () {
    return <div>{this.props.test}</div>;
  }
});
var model = new Backbone.Model();
var newComponent = new MyComponent({
  el: $("body"),
  model: model
});
model.set("test", "Hello world!");
```
The Component will listen to any model changes, making it automatically refresh (and mount if needed) using React's virtual DOM capabilities.

If you are not relying on models or simply want to mount the component on the DOM just do:
```js
newComponent.renderComponent();
```

### API
Besides inherting all the methods from [React.Component](http://facebook.github.io/react/docs/component-api.html) and [Backbone.Events](http://backbonejs.org/#Events) you can find the following methods:

#### new Backbone.Component(options)
options is a hash and may contain el and model properties. Any other property gets stored inside this.options.

#### renderComponent([$el = this.$el], [onRender])
* $el {jQuery|DOMElement} it supports multiple element (if a jQuery object)
* onRender {Callback}
Mounts the component in the DOM and sets the component has rendered (this.isRendered = true).

#### remove()
Stops component listeners, unmount the component from the DOM and then removes the DOM element.