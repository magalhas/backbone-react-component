/* global _:true, document:true */
describe('Parent Component', function () {
  'use strict';
  var component, el, mountedComponent, model1, model2, collection1, collection2, spy, initialStateSpy;

  var Component = React.createFactory(React.createClass({
    mixins: [Backbone.React.Component.mixin],
    getInitialState: function () {
      if (initialStateSpy) initialStateSpy.call(this);
      return {};
    },
    render: function () {
      if (spy) spy.call(this);
      return React.DOM.div({}, this.state.hello);
    }
  }));

  beforeEach(function () {
    el = document.createElement('div');
    model1 = new Backbone.Model({hello: 'world!'});
    model2 = new Backbone.Model({goodbye: 'other world!'});
    collection1 = new Backbone.Collection([model1, model2]);
    collection2 = new Backbone.Collection([model2, model1]);
    mountedComponent = component = spy = initialStateSpy = null;
  });

  afterEach(function () {
    model1.stopListening();
    collection1.stopListening();
    ReactDOM.unmountComponentAtNode(el);
  });

  it('gets the model(s)', function () {
    component = Component({model: model1});
    mountedComponent = ReactDOM.render(component, el);
    expect(mountedComponent.getModel()).toEqual(model1);
  });

  it('gets the collection(s)', function () {
    component = Component({collection: collection1});
    mountedComponent = ReactDOM.render(component, el);
    expect(mountedComponent.getCollection()).toEqual(collection1);
  });

  it('binds to a model', function (done) {
    component = Component({model: model1});
    mountedComponent = ReactDOM.render(component, el);
    expect(mountedComponent.state.model.hello).toEqual('world!');
    model1.set('hello', 'again');
    // Defering because setting state is defered as well
    _.defer(function () {
      expect(mountedComponent.state.model.hello).toEqual('again');
      done();
    });
  });

  it('binds to multiple models', function () {
    component = Component({
      model: {
        firstModel: model1,
        secondModel: model2
      }
    });
    mountedComponent = ReactDOM.render(component, el);
    expect(mountedComponent.state.firstModel.hello).toEqual('world!');
    expect(mountedComponent.state.secondModel.goodbye).toEqual('other world!');
  });

  it('binds to a collection', function (done) {
    component = Component({collection: collection1});
    mountedComponent = ReactDOM.render(component, el);
    expect(mountedComponent.state.collection[0].hello).toEqual('world!');
    mountedComponent.getCollection().at(0).set('hello', 'again');
    // Defering because setting state is defered as well
    _.defer(function () {
      expect(mountedComponent.state.collection[0].hello).toEqual('again');
      done();
    });
  });

  it('binds to multiple collections', function (done) {
    component = Component({
      collection: {
        firstCollection: collection1,
        secondCollection: collection2
      }
    });
    mountedComponent = ReactDOM.render(component, el);
    expect(mountedComponent.state.firstCollection[0].hello).toEqual('world!');
    expect(mountedComponent.state.secondCollection[0].goodbye).toEqual('other world!');
    mountedComponent.getCollection().firstCollection.at(0).set('hello', 'again');
    mountedComponent.getCollection().secondCollection.at(0).set('goodbye', 'other again');
    // Defering because setting state is defered as well
    _.defer(function () {
      expect(mountedComponent.state.firstCollection[0].hello).toEqual('again');
      expect(mountedComponent.state.secondCollection[0].goodbye).toEqual('other again');
      done();
    });
  });

  it('updates on collection reset', function (done) {
    component = Component({
        collection: collection1
    });
    mountedComponent = ReactDOM.render(component, el);
    expect(mountedComponent.state.collection[0].hello).toEqual('world!');
    collection1.reset({hello: 'other world!'});
    _.defer(function () {
      expect(mountedComponent.state.collection[0].hello).toEqual('other world!');
      done();
    });
  });

  it('grabs the collection instance on `getInitialState`', function (done) {
    component = Component({
      collection: collection1
    });

    initialStateSpy = jasmine.createSpy().and.callFake(function () {
      expect(this.getCollection()).toEqual(collection1);
      done();
    });

    ReactDOM.render(component, el);
  });

  it('grabs the model instance on `getInitialState`', function (done) {
    component = Component({
      model: model1
    });

    initialStateSpy = jasmine.createSpy().and.callFake(function () {
      expect(this.getModel()).toEqual(model1);
      done();
    });

    ReactDOM.render(component, el);
  });

  it('updates the collection when a new one is passed', function (done) {
    component = Component({
      collection: collection1
    });

    mountedComponent = ReactDOM.render(component, el, function () {
      expect(this.state.collection[0].hello).toEqual('world!');

      component = Component({
        collection: collection2
      });

      mountedComponent = ReactDOM.render(component, el, function () {
        _.defer(function () {
          expect(this.state.collection[0].goodbye).toEqual('other world!');
          done();
        }.bind(this));
      });
    });
  });

  it('updates the model when a new one is passed', function (done) {
    component = Component({
      model: model1
    });

    mountedComponent = ReactDOM.render(component, el, function () {
      expect(this.state.model.hello).toEqual('world!');

      component = Component({
        model: model2
      });

      mountedComponent = ReactDOM.render(component, el, function () {
        _.defer(function () {
          expect(this.state.model.goodbye).toEqual('other world!');
          done();
        }.bind(this));
      });
    });
  });

  it('overrides the model(s) if hooked', function () {
    var NewComponent = React.createFactory(React.createClass({
      mixins: [Backbone.React.Component.mixin],
      overrideModel: function () {
        return model2;
      },
      render: function () {
        return React.DOM.div();
      }
    }));

    var component = NewComponent({model: model1});
    var mountedComponent = ReactDOM.render(component, el);
    expect(mountedComponent.getModel()).toEqual(model2);
  });

  it('overrides the collection(s) if hooked', function () {
    var NewComponent = React.createFactory(React.createClass({
      mixins: [Backbone.React.Component.mixin],
      overrideCollection: function () {
        return collection2;
      },
      render: function () {
        return React.DOM.div();
      }
    }));

    var component = NewComponent({collection: collection1});
    var mountedComponent = ReactDOM.render(component, el);
    expect(mountedComponent.getCollection ()).toEqual(collection2);
  });

  describe('Child Component', function () {

    describe('with nested models', function () {
      var newSpy;
      var NewComponent = React.createFactory(React.createClass({
        mixins: [Backbone.React.Component.mixin],
        render: function () {
          if (newSpy) newSpy.call(this);
          return Component({model: this.getCollection().at(0)});
        }
      }));

      beforeEach(function () {
        component = NewComponent({collection: collection1});
      });

      afterEach(function () {
        mountedComponent = ReactDOM.render(component, el);
        if (newSpy) expect(newSpy).toHaveBeenCalled();
        if (spy) expect(spy).toHaveBeenCalled();
      });

      it('gets the model when inside the child component', function () {
        spy = jasmine.createSpy().and.callFake(function () {
          expect(this.getModel()).toEqual(model1);
        });
      });

      it('gets the same collection inside child and parent components', function () {
        newSpy = jasmine.createSpy().and.callFake(function () {
          expect(this.getCollection()).toEqual(collection1);
        });
        spy = jasmine.createSpy().and.callFake(function () {
          expect(this.getCollection()).toEqual(collection1);
        });
      });
    });

    describe('with nested collections', function () {
      var newSpy;
      var NewComponent = React.createFactory(React.createClass({
        mixins: [Backbone.React.Component.mixin],
        render: function () {
          if (newSpy) newSpy.call(this);
          return Component({collection: collection2});
        }
      }));

      beforeEach(function () {
        component = NewComponent({collection: collection1});
        spy = newSpy = null;
      });

      it('gets the right collection inside the parent component', function () {
        newSpy = jasmine.createSpy().and.callFake(function () {
          expect(this.getCollection()).toEqual(collection1);
        });
        mountedComponent = ReactDOM.render(component, el);
        expect(newSpy).toHaveBeenCalled();
      });

      it('gets the right collection inside the child component', function () {
        spy = jasmine.createSpy().and.callFake(function () {
          expect(this.getCollection()).toEqual(collection2);
        });
        mountedComponent = ReactDOM.render(component, el);
        expect(spy).toHaveBeenCalled();
      });

      it('has the right JSON data inside the parent state', function () {
        newSpy = jasmine.createSpy().and.callFake(function () {
          expect(this.state.collection instanceof Array).toBeTruthy();
          expect(this.state.collection).toEqual(this.getCollection().toJSON());
        });
        mountedComponent = ReactDOM.render(component, el);
        expect(newSpy).toHaveBeenCalled();
      });

      it('has the right JSON data inside the child state', function () {
        spy = jasmine.createSpy().and.callFake(function () {
          expect(this.state.collection instanceof Array).toBeTruthy();
          expect(this.state.collection).toEqual(this.getCollection().toJSON());
        });
        mountedComponent = ReactDOM.render(component, el);
        expect(spy).toHaveBeenCalled();
      });

      it('has the right JSON data inside the parent state after collection changes', function (done) {
        newSpy = jasmine.createSpy().and.callFake(function () {
          expect(this.getCollection()).toEqual(collection1);
          expect(this.state.collection instanceof Array).toBeTruthy();
          expect(this.state.collection).toEqual(this.getCollection().toJSON());
        });
        mountedComponent = ReactDOM.render(component, el);
        expect(newSpy).toHaveBeenCalled();
        collection1.add(new Backbone.Model());
        _.defer(function () {
          expect(newSpy.calls.count()).toEqual(2);
          done();
        });
      });

      it('has the right JSON data inside the child state after collection changes', function (done) {
        spy = jasmine.createSpy().and.callFake(function () {
          expect(this.getCollection()).toEqual(collection2);
          expect(this.state.collection instanceof Array).toBeTruthy();
          expect(this.state.collection).toEqual(this.getCollection().toJSON());
        });
        mountedComponent = ReactDOM.render(component, el);
        expect(spy).toHaveBeenCalled();
        collection1.add(new Backbone.Model());
        _.defer(function () {
          expect(spy.calls.count()).toEqual(2);
          done();
        });
      });
    });
  });

});
