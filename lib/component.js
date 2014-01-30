(function (root, factory) {
  if (typeof define === 'function' && define.amd)
    define(['react', 'backbone', 'underscore'], factory);
  else {
    if (!root.Backbone.React) root.Backbone.React = {};
    root.Backbone.React.Component = factory(React, Backbone, _);
  }
}(window, function (React, Backbone, _) {
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
    this.options = _.defaults(options || {}, {});
    this.setElement(this.options.el);
    delete this.options.el;
    /**
     * @member
     * @desc The model bound to this component. It'll bind any changes
     * to this.props.
     */
    this.model = this.options.model;
    delete this.options.model;
    if (this.model) this.startModelListeners();
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
    var ReactComponent = React.createClass(_.extend({}, Backbone.React.Component.prototype, Clazz));
    var ComponentFactory = function () {
      var component = new ReactComponent(arguments[0], arguments[1]);
      Backbone.React.Component.apply(component, arguments);
      return component;
    };
    ComponentFactory.extend = function () {
      return Backbone.React.Component.extend(_.extend({}, Clazz, arguments[0]));
    };
    return ComponentFactory;
  };
  _.extend(Backbone.React.Component.prototype, Backbone.Events,
  /** @lends Reactor.Component.prototype */
  {
    /**
     * Hook called by React when the component is mounted on a DOM element.
     Overriding this set this.el and this.$el (if jQuery available) on the
     component. Also starts component listeners.
     */
    componentDidMount: function () {
      this
        .setElement(this.getDOMNode())
        .startModelListeners();
    },
    /**
     * Hook called by React when the component is going to be unmounted from
     the DOM. Overriding this to stop this components listeners.
     */
    componentWillUnmount: function () {
      this.stopListening();
    },
    /**
     * Renders/mounts the component through {@link http://facebook.github.io/react/|React}.
     * @param {DOMElement} [el=this.el] The DOM element where we want to mount
     the component.
     * @param {Callback} [onRender] Callback to be executed when the component
     is rendered/mounted. If not passed it syncs this.model with this.props.
     * @returns {this}
     */
    mount: function (el, onRender) {
      if (!el && !this.el) throw new Error('No element to mount on');
      else if (!el) el = this.el;
      if (!onRender && this.model) onRender = this.setPropsModel.bind(this);
      React.renderComponent(this, el, onRender);
      /**
       * A boolean indicating that the component has already been rendered.
       * @member
       */
      this.isRendered = true;
      return this;
    },
    /**
     * Stops all listeners and removes this component from the DOM.
     * @returns {this}
     */
    remove: function () {
      if (this.unmount()) this.el.remove();
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
        if ($) this.$el = $(el);
      }
      return this;
    },
    /**
     * Used internally to set this.model on this.props. Delegates to
     * this.replaceProps.
     */
    setPropsModel: function () {
      return this.replaceProps(this.model.toJSON());
    },
    /**
     * Binds this.props to any this.model changes, making the screen component
     * get instantly rerendered in the screen. This has high performance
     * since it uses the {@link http://facebook.github.io/react/|React} virtual DOM.
     */
    startModelListeners: function () {
      if (this.model)
        this.listenTo(this.model, 'change', this.setPropsModel);
    },
    /**
     * Unmount the component from the DOM.
     * @returns {Boolean} True if the component was unmounted with success.
     False otherwise.
     */
    unmount: function () {
      return React.unmountComponentAtNode(this.el.parentNode);
    }
  });
  return Backbone.React.Component;
}));