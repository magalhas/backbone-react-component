!function(a,b){"function"==typeof define&&define.amd?define(["react","backbone","underscore"],b):(a.Backbone.React||(a.Backbone.React={}),a.Backbone.React.Component=b(React,Backbone,_))}(window,function(a,b,c){"use strict";return b.React||(b.React={}),b.React.Component=function(a){this.cid=c.uniqueId(),this.options=c.defaults(a||{},{}),this.setElement(this.options.el),delete this.options.el,this.model=this.options.model,delete this.options.model,this.model&&this.startModelListeners()},b.React.Component.extend=function(){var d,e=arguments[0],f=function(){var a=new d(arguments[0],arguments[1]);return b.React.Component.apply(a,arguments),a};return f.extend=function(){return b.React.Component.extend(c.extend({},e,arguments[0]))},c.extend(f.prototype,b.React.Component.prototype,e),d=a.createClass(f.prototype),f},c.extend(b.React.Component.prototype,b.Events,{$:function(){return this.$el?this.$el.find.apply(this.$el,arguments):void 0},componentDidMount:function(){this.setElement(this.getDOMNode()).startModelListeners()},componentWillUnmount:function(){this.stopListening()},getModel:function(){return this.getOwner().model},getOwner:function(){for(var a=this;a.props.__owner__;)a=a.props.__owner__;return a},mount:function(b,c){if(!b&&!this.el)throw new Error("No element to mount on");return b||(b=this.el),!c&&this.model&&(c=this.setPropsModel.bind(this)),a.renderComponent(this,b,c),this.isRendered=!0,this},remove:function(){return this.unmount()&&this.el.remove(),this},setElement:function(a){if(a&&a instanceof $){if(a.length>1)throw new Error("You can only assign one element to a component");this.el=a[0],this.$el=a}else a&&(this.el=a,$&&(this.$el=$(a)));return this},setPropsModel:function(){return this.replaceProps(this.model.toJSON())},startModelListeners:function(){this.model&&this.listenTo(this.model,"change",this.setPropsModel)},unmount:function(){return a.unmountComponentAtNode(this.el.parentNode)}}),b.React.Component});