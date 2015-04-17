// Init Backbone jquery object
import $ from 'jquery';
import Backbone from 'backbone';
Backbone.$ = $;

import React from 'react';
import Router from 'react-router';
import BackboneReactMixin from 'backbone-react-component';

let {Route, RouteHandler, Link, State, Navigation} = Router;

class Person extends Backbone.Model {
  default() {
    return {
      id: 1,
      name: ''
    }
  }
}

class Persons extends Backbone.Collection {
  model: Person
}


let persons = new Persons();

let Ioan = new Person({id: 0, name:'Ioan Eugen'})
persons.add(Ioan);
persons.add(new Person({id: 1, name: 'Jose'}));
persons.add(new Person({id: 3, name: 'Eugen'}))

let App = React.createClass({
  mixins:[BackboneReactMixin],
  render(){
    return (
      <div>
          <nav>
            <Link to="home">Home</Link> <br/>
            <Link to="hello">Hello stranger</Link> <br/>
            <Link to="hello" query={{id: 3}}>Hello Eugen</Link> <br/>
            <Link to="hello" query={{id: 1}}>Hello Jose</Link> <br/>
          </nav>

          <h1>Route is rendered here:</h1>
          <RouteHandler model={Ioan}/>
      </div>
    )
  }
});

let Hello = React.createClass({
  mixins: [BackboneReactMixin, State],
  render(){
    // debugger;
    return (
      <div>hello {this.state.model.name}</div>
    );
  }
});

let routes = (
  <Route name="home" handler={App} path="/">
    <Route name="hello" path="hello" handler={Hello} />
  </Route>
);

// main application
const content = document.body;
let router = Router.create({routes});
router.run((Handler) => React.render(<Handler />, content));
