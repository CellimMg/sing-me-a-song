Cypress.Commands.add("resetDatabase", () => {
	cy.request("POST", "http://localhost:5000/reset");
});

Cypress.Commands.add("addSong", () => {
	cy.request("POST", "http://localhost:5000/recommendations", {
		name: "New Name",
		youtubeLink: "https://www.youtube.com/watch?v=8UuGaKrFEIo"
	});
});

describe("Add recommendations", () => {
	it("Should insert name and url rightly", () => {
	cy.resetDatabase();
		cy.visit("http://localhost:3000");
		cy.intercept("POST", "http://localhost:5000/recommendations").as('postRecommendations');
		cy.get("input[type=text]").eq(0).type("New Name");
		cy.get("input[type=text]").eq(1).type("https://www.youtube.com/watch?v=8UuGaKrFEIo");
		cy.get("button").click();
		cy.wait('@postRecommendations').then(xhr => {
			expect(xhr.response.statusCode).to.eq(201);
		});
	});

	it("Should return 422 and modal if youtube url is incorrect", () => {
		cy.visit("http://localhost:3000");
		cy.intercept("POST", "http://localhost:5000/recommendations").as('postRecommendations');
		cy.get("input[type=text]").eq(0).type("New Name");
		cy.get("input[type=text]").eq(1).type("WrongUrl");
		cy.get("button").click();
		cy.on('window:alert', (str) => {
			expect(str).to.equal(`Error creating recommendation!`)
		  });
		cy.wait('@postRecommendations').then(xhr => {
			expect(xhr.response.statusCode).to.eq(422);
		});
	});

	it("Should return 409 and modal if already inserted", () => {
		cy.resetDatabase();
		cy.addSong();
		cy.visit("http://localhost:3000");
		cy.intercept("POST", "http://localhost:5000/recommendations").as('postRecommendations');
		cy.get("input[type=text]").eq(0).type("New Name");
		cy.get("input[type=text]").eq(1).type("https://www.youtube.com/watch?v=8UuGaKrFEIo");
		cy.get("button").click();
		cy.wait('@postRecommendations').then(xhr => {
			expect(xhr.response.statusCode).to.eq(409);
		});
	});
});