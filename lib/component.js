(function (root, factory) {
  if (typeof define === 'function' && define.amd)
    define(['react', 'backbone', 'underscore', 'jquery'], factory);
  else {
    if (!root.Backbone.React) root.Backbone.React = {};
    root.Backbone.React.Component = factory(React, Backbone, _, $);
  }
}(window, function (React, Backbone, _, $) {
  'use strict';
  /**
   * @class Backbone.React.Component
   * @extends React.Component
   * @mixes Backbone.Events
   * @desc The Reactor.Component is a React.Component wrapper to serve
   as a bridge between the React and Backbone worlds. Besides some extra members
   that may be set by extending/instancing a component, it works pretty much the
   same way that {@link http://facebook.github.io/react/|React} components do.
   <br />
   When bound to a model, the component gets automatically mounted/rendered on
   the DOM as the model changes. If already rendered it just updates the element
   by using {@link http://facebook.github.io/react/|React} virtual DOM engine.
   * @example
   // Instancing a component
   var myComponent = new Backbone.React.Component({
     el: document.body,
     model: model
   });
   * @example
   // Extending a component
   /** @jsx React.DOM *\/
   var MyComponent = Backbone.React.Component.extend({
     render: function () {
       return &lt;div&gt;Hello world!&lt;/div&gt;;
     }
   });
   */
  if (!Backbone.React) Backbone.React = {};
  Backbone.React.Component = function (options) {
    this.cid = _.uniqueId();
    options = options || {};
    this.setElement(options.el);
    delete options.el;
    /**
     * The model or models bound to this component. It'll bind any changes
     to this.props.
     * @member
     */
    this.model = options.model;
    delete options.model;
    /**
     * The collection or collections bound to this component. It'll bind any changes
     to this.props.collection.
     * @member
     */
    this.collection = options.collection;
    delete options.collection;
    if (this.initialize) this.initialize(options);
  };
  /**
   * Wraps React.Component into Backbone.React.Component and extends to a new
   class.
   * @method extend
   * @memberof Component
   * @static
   */
  Backbone.React.Component.extend = function () {
    var Clazz = arguments[0];
    var ReactComponent;
    var ComponentFactory = function () {
      var component = new ReactComponent(arguments[0], arguments[1]);
      Backbone.React.Component.apply(component, arguments);
      return component;
    };
    ComponentFactory.extend = function () {
      return Backbone.React.Component.extend(_.extend({}, Clazz, arguments[0]));
    };
    _.extend(ComponentFactory.prototype, Backbone.React.Component.prototype, Clazz);
    ReactComponent = React.createClass(ComponentFactory.prototype);
    return ComponentFactory;
  };
  _.extend(Backbone.React.Component.prototype, Backbone.Events,
  /** @lends Reactor.Component.prototype */
  {
    mixins: [{
      /**
       * Hook called by React when the component is mounted on a DOM element.
       Overriding this to set this.el and this.$el (if jQuery available) on the
       component. Also starts component listeners.
       */
      componentDidMount: function () {
        this
          .setElement(this.getDOMNode())
          .startModelListeners()
          .startCollectionListeners();
      },
      /**
       * Hook called by React when the component is going to be unmounted from
       the DOM. Overriding this to stop this components listeners.
       */
      componentWillUnmount: function () {
        this.stopListening();
      }
    }],
    /**
     * Shortcut to this.$el.find. Inspired by Backbone.View.
     * @returns {jQuery}
     */
    $: function () {
      if (this.$el)
        return this.$el.find.apply(this.$el, arguments);
    },
    /**
     * Crawls to the owner of the component and gets the collection.
     */
    getCollection: function () {
      return this.getOwner().collection;
    },
    /**
     * Crawls to the owner of the component and gets the model.
     * @returns {Backbone.Model}
     */
    getModel: function () {
      return this.getOwner().model;
    },
    /**
     * Crawls this.props.__owner__ recursively until it finds the owner of this
     component. In case of being a parent component (no owners) it returns itself.
     * @returns {Backbone.React.Component}
     */
    getOwner: function () {
      var owner = this;
      while (owner.props.__owner__) owner = owner.props.__owner__;
      return owner;
    },
    /**
     * Renders/mounts the component through {@link http://facebook.github.io/react/|React}.
     * @param {DOMElement} [el=this.el] The DOM element where we want to mount
     the component.
     * @param {Callback} [onRender] Callback to be executed when the component
     is rendered/mounted. If not passed it syncs this.model or this.collection
     with this.props.
     * @returns {this}
     */
    mount: function (el, onRender) {
      if (!el && !this.el) throw new Error('No element to mount on');
      else if (!el) el = this.el;
      if (!onRender) {
        if (this.model && this.collection) {
          onRender = function () {
            this.setPropsModel();
            this.setPropsCollection();
          }.bind(this);
        }
        else if (this.model) onRender = this.setPropsModel.bind(this);
        else if (this.collection) onRender = this.setPropsCollection.bind(this);
      }
      React.renderComponent(this, el, onRender);
      /**
       * A boolean indicating that the component has already been rendered.
       * @member
       */
      this.isRendered = true;
      return this;
    },
    /**
     * Sets this.props.hasError when a model/collection request results in error.
     * @listens Backbone.Model#error
     * @listens Backbone.Collection#error
     * @todo Improve error handling
     */
    onError: function () {
      return this.setProps({
        isRequesting: false,
        hasError: true
      });
    },
    /**
     * Sets this.props.isRequesting when a model/collection request starts.
     * @listens Backbone.Model#request
     * @listens Backbone.Collection#request
     */
    onRequest: function () {
      this.setProps({isRequesting: true});
    },
    /**
     * Sets this.props. It delegates to this.setPropsCollection and this.setPropsModel.
     * @param {Backbone.Model|Backbone.Collection} modelOrCollection The model or collection
     that was sync.
     * @param {String} [key] The collection or model identifier.
     * @listens Backbone.Model#sync
     * @listens Backbone.Collection#sync
     */
    onSync: function (modelOrCollection, key) {
      this.setProps({isRequesting: false});
      if (modelOrCollection instanceof Backbone.Model)
        this.setPropsModel(modelOrCollection, key);
      else if (modelOrCollection instanceof Backbone.Collection)
        this.setPropsCollection(modelOrCollection, key);
    },
    /**
     * Stops all listeners and removes this component from the DOM.
     * @returns {this}
     */
    remove: function () {
      this.unmount();
      this.el.remove();
      return this;
    },
    /**
     * Sets a DOM element to render/mount this component on this.el and this.$el
     (if jQuery is available).
     * @param {DOMElement} el The DOMElement where we want to render/mount
     the component.
     * @returns {this}
     */
    setElement: function (el) {
      if (el && el instanceof $) {
        if (el.length > 1) throw new Error('You can only assign one element to a component');
        this.el = el[0];
        this.$el = el;
      } else if (el) {
        this.el = el;
        this.$el = $(el);
      }
      return this;
    },
    /**
     * Used internally to set this.collection on this.props.collection. Delegates to
     this.replaceProps. It also handles if a request triggers this method more than
     once.
     * @param {Backbone.Collection} [collection=this.collection] The collection we're
     setting into this.props.
     * @param {String} [key] In case of multiple collections a key is passed to identify
     the collection.
     * @listens Backbone.Collection#add
     * @listens Backbone.Collection#remove
     * @listens Backbone.Collection#change
     */
    setPropsCollection: function (collection, key) {
      if (!collection) {
        collection = this.collection;
        if (!(collection instanceof Backbone.Collection)) {
          for (key in collection)
            this.setPropsCollection(collection[key], key);
          return;
        }
      }
      var lastArg = arguments[arguments.length - 1];
      // If this was triggered by a ajax request don't do nothing, wait for the 'sync'
      // event to happen.
      if (!lastArg || !lastArg.xhr) {
        var props = {};
        if (key) props[key] = collection.toJSON();
        else props.collection = collection.toJSON();
        this.setProps(props);
      }
    },
    /**
     * Used internally to set this.model on this.props. Delegates to
     this.replaceProps.
     * @param {Backbone.Model} [model=this.model] The model we're setting into this.props.
     * @param {String} [key] In case of multiple models a key is passed to identify
     the model.
     * @listens Backbone.Model#change
     */
    setPropsModel: function (model, key) {
      if (!model) {
        model = this.model;
        if (!(model instanceof Backbone.Model)) {
          for (key in model)
            this.setPropsModel(model[key], key);
          return;
        }
      }
      var lastArg = arguments[arguments.length - 1];
      // If this was triggered by a ajax request don't do nothing, wait for the 'sync'
      // event to happen.
      if (!lastArg || !lastArg.xhr) {
        var props = {};
        if (key) props[key] = model.toJSON();
        else props = model.toJSON();
        this.setProps(props);
      }
    },
    /**
     * Binds this.props.collection to any this.collection changes, making the component
     to get instantly rerendered. This has high performance since it uses the
     {@link http://facebook.github.io/react/|React} virtual DOM.
     * @param {Backbone.Collection|Object} [collection=this.collection] In case of being
     an object it calls startCollectionListeners for each entry.
     * @param {String} [key] In case of multiple collections a key is passed to identify
     the collection.
     * @returns {this}
     */
    startCollectionListeners: function (collection, key) {
      if (!collection) collection = this.collection;
      if (collection instanceof Backbone.Collection)
        this
          .listenTo(collection, 'add remove change', this.setPropsCollection.bind(this, collection, key))
          .listenTo(collection, 'error', this.onError.bind(this, collection, key))
          .listenTo(collection, 'request', this.onRequest.bind(this, collection, key))
          .listenTo(collection, 'sync', this.onSync.bind(this, collection, key));
      else if (collection)
        for (key in collection)
          this.startCollectionListeners(collection[key]);
      return this;
    },
    /**
     * Binds this.props to any this.model changes, making the screen component
     get instantly rerendered in the screen. This has high performance
     since it uses the {@link http://facebook.github.io/react/|React} virtual DOM.
     * @param {Backbone.Model|Object} [model=this.model] In case of being
     an object it calls startModelListeners for each entry.
     * @param {String} [key] In case of multiple models a key is passed to identify
     the model.
     * @returns {this}
     */
    startModelListeners: function (model, key) {
      if (!model) model = this.model;
      if (model instanceof Backbone.Model)
        this
          .listenTo(model, 'change', this.setPropsModel.bind(this, model, key))
          .listenTo(model, 'error', this.onError.bind(this, model, key))
          .listenTo(model, 'request', this.onRequest.bind(this, model, key))
          .listenTo(model, 'sync', this.onSync.bind(this, model, key));
      else if (model)
        for (key in model)
          this.startModelListeners(model[key], key);
      return this;
    },
    /**
     * Unmount the component from the DOM.
     * @throws {Error} If component isn't unmounted successfully.
     */
    unmount: function () {
      if (!React.unmountComponentAtNode(this.el.parentNode)) {
        throw new Error('There was an error unmounting the component');
      }
      delete this.isRendered;
    }
  });
  return Backbone.React.Component;
}));