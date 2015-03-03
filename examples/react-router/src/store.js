import {Person, Persons } from './models/person'

let people = new Persons();

people.add(new Person({id: 1, name: "Eugen ", description: "The greatest"}));
people.add(new Person({id: 2, name: "Adrian", description: "The second greatest"}));

export default people;
