describe("Navigation", () => {
	it("Should navigate to /", () => {
		cy.visit("http://localhost:3000");
		cy.contains("Home").click();
		cy.url().should("include", "/");
	});

    it("Should navigate to /top", () => {
		cy.visit("http://localhost:3000");
		cy.contains("Top").click();
		cy.url().should("include", "/top");
	});

    it("Should navigate to /random", () => {
		cy.visit("http://localhost:3000");
		cy.contains("Random").click();
		cy.url().should("include", "/random");
	});
});