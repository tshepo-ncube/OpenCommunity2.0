// Community.js

// Import User to establish relationships
// import { User } from "./User.js";

// Encapsulation: Define a Community class
export class Community {
  constructor(
    id,
    name,
    description,
    category,
    admin,
    status,
    events = [],
    users = []
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.category = category;
    this.admin = admin; // This is a reference to a User object - demonstrating Composition
    this.status = status;
    this.events = events; // Composition - a community can have multiple events
    this.users = users; // Composition - a community has multiple users
  }

  // Method to add a user to the community
  addUser(user) {
    this.users.push(user);
  }

  // Method to add an event to the community
  addEvent(event) {
    this.events.push(event);
  }

  // Polymorphism: Different ways to describe the community
  getDetails() {
    return `${this.name} - ${this.description}`;
  }
}
