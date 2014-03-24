describe('Mixin', function () {
  'use strict';
  var Component = React.createClass({
    mixins: [Backbone.React.Component.mixin],
    render: function () {
      if (spy) spy.call(this);
      return React.DOM.div({}, this.props.hello);
    }
  });

  var component, el, mountedComponent, model1, model2, collection1, collection2, spy;

  beforeEach(function () {
    el = document.createElement('div');
    model1 = new Backbone.Model({hello: 'world!'});
    model2 = new Backbone.Model({goodbye: 'other world!'});
    collection1 = new Backbone.Collection([model1, model2]);
    collection2 = new Backbone.Collection([model2, model1]);
  });

  afterEach(function () {
    model1.stopListening();
    collection1.stopListening();
    React.unmountComponentAtNode(el);
  });

  it('gets the model(s)', function () {
    component = Component({model: model1});
    mountedComponent = React.renderComponent(component, el);
    expect(mountedComponent.getModel()).toEqual(model1);
  });

  it('gets the collection(s)', function () {
    component = Component({collection: collection1});
    mountedComponent = React.renderComponent(component, el);
    expect(mountedComponent.getCollection()).toEqual(collection1);
  });

  it('gets the owner', function () {
    component = Component();
    mountedComponent = React.renderComponent(component, el);
    expect(mountedComponent.getOwner()).toEqual(mountedComponent);
  });

  it('binds to a model', function (done) {
    component = Component({model: model1});
    mountedComponent = React.renderComponent(component, el);
    expect(mountedComponent.props.hello).toEqual('world!');
    model1.set('hello', 'again');
    // Defering because setting props is defered as well
    _.defer(function () {
      expect(mountedComponent.props.hello).toEqual('again');
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
    mountedComponent = React.renderComponent(component, el);
    expect(mountedComponent.props.firstModel.hello).toEqual('world!');
    expect(mountedComponent.props.secondModel.goodbye).toEqual('other world!');
  });

  it('binds to a collection', function (done) {
    component = Component({collection: collection1});
    mountedComponent = React.renderComponent(component, el);
    expect(mountedComponent.props.collection[0].hello).toEqual('world!');
    mountedComponent.getCollection().at(0).set('hello', 'again');
    // Defering because setting props is defered as well
    _.defer(function () {
      expect(mountedComponent.props.collection[0].hello).toEqual('again');
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
    mountedComponent = React.renderComponent(component, el);
    expect(mountedComponent.props.firstCollection[0].hello).toEqual('world!');
    expect(mountedComponent.props.secondCollection[0].goodbye).toEqual('other world!');
    mountedComponent.getCollection().firstCollection.at(0).set('hello', 'again');
    mountedComponent.getCollection().secondCollection.at(0).set('goodbye', 'other again');
    // Defering because setting props is defered as well
    _.defer(function () {
      expect(mountedComponent.props.firstCollection[0].hello).toEqual('again');
      expect(mountedComponent.props.secondCollection[0].goodbye).toEqual('other again');
      done();
    });
  });

  describe('Child Component', function () {
    var newComponent, newSpy;
    var NewComponent = React.createClass({
      mixins: [Backbone.React.Component.mixin],
      render: function () {
        if (newSpy) newSpy.call(this);
        return Component({model: this.getCollection().at(0)});
      }
    });

    beforeEach(function () {
      component = NewComponent({collection: collection1});
    });

    afterEach(function () {
      mountedComponent = React.renderComponent(component, el);
      if (newSpy) expect(newSpy).toHaveBeenCalled();
      if (spy) expect(spy).toHaveBeenCalled();
    });

    it('gets the owner', function () {
      spy = jasmine.createSpy().and.callFake(function () {
        expect(this.getOwner()).toEqual(component.__realComponentInstance);
      });
      newSpy = jasmine.createSpy().and.callFake(function () {
        expect(this.getOwner()).toEqual(component.__realComponentInstance);
      });
    });

    it('gets the model(s)', function () {
      spy = jasmine.createSpy().and.callFake(function () {
        expect(this.getModel()).toEqual(model1);
      });
    });

    it('gets the collection(s)', function () {
      newSpy = jasmine.createSpy().and.callFake(function () {
        expect(this.getCollection()).toEqual(collection1);
      });
      spy = jasmine.createSpy().and.callFake(function () {
        expect(this.getCollection()).toEqual(collection1);
      });
    });
  });
});