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
     el: $('body'),
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
    var ReactComponent = React.createClass(Clazz);
    var ComponentFactory = function () {
      var component = new ReactComponent(arguments[0], arguments[1]);
      _.extend(component, Backbone.React.Component.prototype);
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
     component.
     */
    componentDidMount: function () {
      this.setElement(this.getDOMNode());
    },
    /**
     * Stops all listeners and removes this component from the DOM.
     */
    remove: function () {
      this.stopListening();
      if (this.$el) {
        React.unmountComponentAtNode(this.$el);
        this.$el.remove();
      }
    },
    /**
     * Renders/mounts the component through {@link http://facebook.github.io/react/|React}.
     * @param {DOMElement} [el=this.el] The DOM element where we want to mount
     the component.
     * @param {Callback} [onRender] Callback to be executed when the component
     is rendered/mounted. If not passed it syncs this.model with this.props.
     * @returns {this}
     */
    renderComponent: function (el, onRender) {
      if (!el && !this.el) return;
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
     * Sets a DOM element to render/mount this component on this.$el.
     * @param {jQuery|DOMElement} el The DOMElement where we want to render/mount
     the component.
     */
    setElement: function (el) {
      if (el) {
        if ($) {
          if (el instanceof $) {
            if (!el.length)
              throw new Error('DOM element unspecified');
            else if (el.length > 1)
              throw new Error('More than one DOM element specified');
            /**
             * The jQuerified DOM element where the component will be/is mounted.
             * @member
             */
            this.$el = el;
            /**
             * The native DOM element where the component will be/is mounted.
             * @member
             */
            this.el = el[0];
          } else {
            this.$el = $(el);
            this.el = el;
          }
        } else this.el = el;
      }
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
      var eventId, callback;
      if (this.events) {
        for (eventId in this.events) {
          if (typeof this.events[eventId] === 'function') {
            callback = this.events[eventId];
          } else callback = this[this.events[eventId]];
          this.listenTo(this.model, eventId, callback);
        }
      } else {
        var setPropsModel = function () {
          if (!this.isRendered) {
            this.renderComponent(null, this.setPropsModel.bind(this));
          } else this.setPropsModel();
        };
        this
          .listenTo(this.model, 'change', setPropsModel)
          .listenTo(this.model, 'change:*', setPropsModel)
          .listenTo(this.model, 'add:*', setPropsModel)
          .listenTo(this.model, 'remove:*', setPropsModel);
      }
    }
  });
  return Backbone.React.Component;
}));