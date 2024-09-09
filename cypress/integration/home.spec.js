describe("Dashboard page", () => {
  it("should render properly", () => {
    cy.visit("http://localhost:3000/Home");
    cy.contains("Welcome to the Home Page").should("be.visible"); // Example check
  });
});
