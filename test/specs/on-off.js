/* global document:true */
describe('Mixinless component', function () {
  'use strict';

  var el, component, mountedComponent, spy;

  beforeEach(function () {
    el = document.createElement('div');
  });

  afterEach(function () {
    React.unmountComponentAtNode(el);
    spy = void 0;
  });

  describe('with a model', function () {
      var model1 = new Backbone.Model({hello: 'world!'});

      var Component = React.createFactory(React.createClass({
        componentWillMount: function () {
          Backbone.React.Component.mixin.on(this, model1);
        },
        componentDidMount: function () {
          if (spy) spy.call(this);
        },
        componentWillUnmount: function () {
          Backbone.React.Component.mixin.off(this);
        },
        componentDidUpdate: function () {
          if (spy) spy.call(this);
        },
        getInitialState: function () {
          return {};
        },
        render: function () {
          return React.DOM.div({}, this.state.hello);
        }
      }));

      it('renders', function () {
        spy = jasmine.createSpy().and.callFake(function () {
          expect(this.state.model.hello).toEqual('world!');
        });

        component = Component();
        mountedComponent = React.render(component, el);
        expect(spy).toHaveBeenCalled();
      });

      it('binds to a model', function () {
        component = Component();
        mountedComponent = React.render(component, el);
        spy = jasmine.createSpy().and.callFake(function () {
          expect(this.state.model.hello).toEqual('hell!');
        });
        model1.set('hello', 'hell!');
        expect(spy).toHaveBeenCalled();
      });
  });

  describe('with a collection', function () {
    var collection1 = new Backbone.Collection([{hello: 1}, {hello: 2}]);

    var Component = React.createFactory(React.createClass({
      componentWillMount: function () {
        Backbone.React.Component.mixin.on(this, collection1);
      },
      componentDidMount: function () {
        if (spy) spy.call(this);
      },
      componentWillUnmount: function () {
        Backbone.React.Component.mixin.off(this);
      },
      componentDidUpdate: function () {
        if (spy) spy.call(this);
      },
      getInitialState: function () {
        return {};
      },
      render: function () {
        return React.DOM.div({}, this.state.collection.map(function (model) {
          return model.hello;
        }));
      }
    }));

    it('renders', function () {
      spy = jasmine.createSpy().and.callFake(function () {
        expect(this.state.collection[0].hello).toEqual(1);
        expect(this.state.collection[1].hello).toEqual(2);
      });

      component = Component();
      mountedComponent = React.render(component, el);
      expect(spy).toHaveBeenCalled();
    });

    it('binds to a collection', function () {
      component = Component();
      mountedComponent = React.render(component, el);
      spy = jasmine.createSpy().and.callFake(function () {
        expect(this.state.collection[0].hello).toEqual(3);
        expect(this.state.collection[1].hello).toEqual(2);
      });
      collection1.at(0).set('hello', 3);
      expect(spy).toHaveBeenCalled();
    });
  });
});
