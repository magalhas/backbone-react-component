# Backbone.React.Component

Backbone.React.Component is a wrapper for React.Component and brings all the power of Facebook's React to Backbone.js.

## Dependencies
* [Backbone](http://backbonejs.org/) ([jQuery](http://jquery.com/)/[Underscore](http://underscorejs.org/))
* [React](http://facebook.github.io/react/)

## How To
### Downloading and including the script
Using [Bower](http://bower.io/)
```shell
bower install backbone-react-component
```
If you're not using [Bower](http://bower.io/) download the source from the dist folder.

Include the script on your webpage (or use [RequireJS](http://requirejs.org/)/[Browserify](http://browserify.org/))
```html
...
<script type="text/javascript" src="path_to_script/backbone-react-component-min.js"></script>
...
```

### Using Backbone.React.Component
It follows all the principles behind [React.Component](http://facebook.github.io/react/docs/component-api.html), though it binds models to the component's props and also automatically
mounts the component into the component's $el.
```js
/** @jsx React.DOM */
var MyComponent = Backbone.React.Component.extend({
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

If you are not relying on models or simply want to mount the component into the DOM just call:
```js
newComponent.renderComponent();
```

### API
Besides inheriting all the methods from [React.Component](http://facebook.github.io/react/docs/component-api.html) and [Backbone.Events](http://backbonejs.org/#Events) you can find the following methods:

#### new Backbone.React.Component(options)
options is a hash and may contain el and model properties. Any other property gets stored inside this.options.

#### mount([el = this.el], [onRender])
* el (DOMElement)
* onRender (Callback)
Mounts the component into the DOM and sets it has rendered (this.isRendered = true).

#### unmount()
Unmounts the component.

#### remove()
Stops component listeners, unmounts the component and then removes the DOM element.

### TO DO
* Any ideas?