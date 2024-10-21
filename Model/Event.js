// Events.js

// Import Community for establishing relationships
import { Community } from "./Community.js";

// Encapsulation: Define an Event class
export class Event {
  constructor(
    id,
    name,
    description,
    location,
    startDate,
    endDate,
    status,
    communityId,
    rsvpLimit = "No Limit",
    rsvpCount = 0
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.location = location;
    this.startDate = startDate;
    this.endDate = endDate;
    this.status = status;
    this.communityId = communityId; // Reference to the Community that this event belongs to - demonstrating Interdependencies
    this.rsvpLimit = rsvpLimit;
    this.rsvpCount = rsvpCount;
  }

  // Method to RSVP to the event
  rsvp() {
    if (this.rsvpLimit !== "No Limit" && this.rsvpCount >= this.rsvpLimit) {
      throw new Error("RSVP limit reached.");
    }
    this.rsvpCount++;
  }

  // Method to check if the event is active
  isActive() {
    return this.status === "active";
  }
}
