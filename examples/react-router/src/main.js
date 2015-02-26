import React from 'react';
import Router from 'react-router';
import BackboneReactMixin from './../../../dist/backbone-react-component';

import PeopleStore from './store';

let {RouteHandler, Route, DefaultRoute, Link, State, Navigation} = Router;

let App = React.createClass({
  mixins: [BackboneReactMixin],
  render() {
    return (
      <div>
        <h2>A simple person list</h2>
        <ul>
          <li>
            <Link to="home">Home</Link>
          </li>
          <li>
            <Link to="list">List people</Link>
          </li>
        </ul>
        <div style={{borderStyle: 'solid'}}>
          <RouteHandler/>
        </div>
      </div>
    );
  }
});

let PersonList = React.createClass({
  mixins: [BackboneReactMixin],
  overrideCollection() {
    // supply `this.props.collection` programmatically
    return PeopleStore;
  },
  renderPersonList() {
    return this.props.collection.map((person, index) => {
      return (
        <li key={index}>
          <!-- Create a link to the specific user-->
          <Link to="person" params={{id: person.get('id')}}>{person.get('name')}</Link>
        </li>
      )
    })
  },
  render() {
    return (
      <div>
        <ul>
        {this.renderPersonList()}
        </ul>
      </div>
    );
  }
});

let PersonDetail = React.createClass({
  mixins: [State, Navigation, BackboneReactMixin],
  // supply a model programmatically, since we don't know beforehand which model we need to bind
  // we could perform an Ajax request here to get the model from the server
  overrideModel() {
    let modelId = this.getParams().id;
    return PeopleStore.get(modelId);
  },
  render() {
    return (
      <div>
        <a onClick={() => this.goBack()}>Back</a>

        <div>
          <h3>Details for {this.props.model.get('name')}</h3>
          <p>{this.props.model.get('description')}</p>
        </div>
      </div>
    )
  }
});

// _Declare_ routes and what views they should render
let routes = (
  <Route name="home" path="/" handler={App} >
    <Route name="list" path="persons" handler={PersonList}/>
    <Route name="person" path="persons/:id" handler={PersonDetail}/>
  </Route>
);

// build the routers and render the handlers (only top level gets actually mounted in the supplied DOM element )
let content = document.getElementById('content');
Router.run(routes, (Handler) => React.render(<Handler/>, content));
