// User.js

// Encapsulation: Define a User class and its properties
export class User {
  constructor(
    id,
    email,
    name,
    role,
    points,
    profileImage,
    phoneNumber,
    communitiesJoined = []
  ) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.role = role;
    this.points = points;
    this.profileImage = profileImage;
    this.phoneNumber = phoneNumber;
    this.communitiesJoined = communitiesJoined; // Composition - a user is associated with multiple communities
  }

  // Method to join a community
  joinCommunity(community) {
    this.communitiesJoined.push(community);
  }

  // Polymorphism: Method to get user role
  getRole() {
    return this.role;
  }
}
