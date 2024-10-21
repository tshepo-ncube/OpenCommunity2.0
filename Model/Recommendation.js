// Recommendations.js

// Encapsulation: Define a Recommendation class
export class Recommendation {
  constructor(id, name, category, description, userEmail) {
    this.id = id;
    this.name = name;
    this.category = category;
    this.description = description;
    this.userEmail = userEmail; // This references the user who made the recommendation
  }

  // Method to provide a brief description
  getBrief() {
    return `${this.name}: ${this.description.substring(0, 50)}...`;
  }
}
