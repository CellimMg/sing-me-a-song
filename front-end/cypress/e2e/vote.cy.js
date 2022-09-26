Cypress.Commands.add("addSong", () => {
	cy.request("POST", "http://localhost:5000/recommendations", {
		name: "New Name",
		youtubeLink: "https://www.youtube.com/watch?v=8UuGaKrFEIo"
	});
});

Cypress.Commands.add("resetDatabase", () => {
	cy.request("POST", "http://localhost:5000/reset");
});



describe("Voting", () => {
	it("Should downvote", () => {
		cy.resetDatabase();
		cy.addSong();
		cy.visit("http://localhost:3000");
        cy.intercept("POST", "**/downvote").as('downvote');
		cy.get("article").find("svg").eq(1).click();
        cy.wait('@downvote').then(xhr => {
			expect(xhr.response.statusCode).to.eq(200);
		});
	});

	it("Should upvote", () => {
		cy.resetDatabase();
		cy.addSong();
		cy.visit("http://localhost:3000");
        cy.intercept("POST", "**/upvote").as('upvote');
		cy.get("article").find("svg").first().click();
        cy.wait('@upvote').then(xhr => {
			expect(xhr.response.statusCode).to.eq(200);
		});
    });

    
});