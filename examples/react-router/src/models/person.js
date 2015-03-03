import {Model, Collection} from 'backbone';

class Person extends Model {
  defaults() {
    return {
      id: -1,
      name: '',
      description: 'Your average Joe'
    }
  }
}

class Persons extends Collection {
  model:Person
}

exports = {Person, Persons};

export default exports;
