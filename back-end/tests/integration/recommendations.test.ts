import { Recommendation } from "@prisma/client";
import supertest from "supertest";
import app from "../../src/app";
import { prisma } from "../../src/database";
import { createRecomendationFactory, createRecomendationsWithScoreFactory, createRecomendationWithNegativeScoreFactory, recommendationFactory } from "../factories/recommendationFactory";


beforeEach(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE "recommendations"`;
});

describe("POST /recommendations", () => {
    it("Should return 422 if the body is empty!", async () => {
        const response = await supertest(app).post("/recommendations").send({});
        expect(response.statusCode).toBe(422);
    });

    it("Should return 422 if the name is wrong!", async () => {
        const recommendation = recommendationFactory();
        recommendation.name = "";
        const response = await supertest(app).post("/recommendations").send(recommendation);
        expect(response.statusCode).toBe(422);
    });

    it("Should return 422 if the youtubeLink is wrong!", async () => {
        const recommendation = recommendationFactory();
        recommendation.youtubeLink = "WrongLinkFormat";
        const response = await supertest(app).post("/recommendations").send(recommendation);
        expect(response.statusCode).toBe(422);
    });

    it("Should return 201 if the body is right!", async () => {
        const recommendation = recommendationFactory();
        const response = await supertest(app).post("/recommendations").send(recommendation);
        expect(response.statusCode).toBe(201);
    });

    it("Should return 409 if already has a recommendation with the same name!", async () => {
        const recommendation = recommendationFactory();
        //inserindo o primeiro
        await supertest(app).post("/recommendations").send(recommendation)
        const response = await supertest(app).post("/recommendations").send(recommendation);
        expect(response.statusCode).toBe(409);
    });
});


describe("POST /recommendations/:id/upvote", () => {
    it("Should return 200 if id is right", async () => {
        await createRecomendationFactory();
        const recommendationId = 1;
        const response = await supertest(app).post(`/recommendations/${recommendationId}/upvote`);
        expect(response.statusCode).toBe(200);
    });
    

    it("Should return 404 if id is wrong", async () => {
        const recommendationId = 1; //not created
        const response = await supertest(app).post(`/recommendations/${recommendationId}/upvote`);
        expect(response.statusCode).toBe(404);
    });
});

describe("POST /recommendations/:id/downvote", () => {
    it("Should return 200 before and 404 after if id is right", async () => {
        await createRecomendationWithNegativeScoreFactory();
        const recommendationId = 1;
        const response = await supertest(app).post(`/recommendations/${recommendationId}/downvote`);
        const responseAfterDelete = await supertest(app).post(`/recommendations/${recommendationId}/downvote`)
        
        expect(response.statusCode).toBe(200);
        expect(responseAfterDelete.statusCode).toBe(404);
    });
    

    it("Should return 404 if id is wrong", async () => {
        const recommendationId = 1; //not created
        const response = await supertest(app).post(`/recommendations/${recommendationId}/downvote`);
        expect(response.statusCode).toBe(404);
    });
});

describe("GET /recommendations", () => {
    it("Should return 200 and a list", async () => {
        const response = await supertest(app).get(`/recommendations`);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.statusCode).toBe(200);
    });
});

describe("GET /recommendations/:id", () => {
    it("Should return 200 and a object", async () => {
        await createRecomendationFactory();
        const recommendationId = 1;
        const response = await supertest(app).get(`/recommendations/${recommendationId}`);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty("id");
        expect(response.body).toHaveProperty("name");
        expect(response.body).toHaveProperty("youtubeLink");
        expect(response.body).toHaveProperty("score");
        expect(response.statusCode).toBe(200);
    });

    it("Should return 404 if id is wrong", async () => {
        const recommendationId = -1;
        const response = await supertest(app).get(`/recommendations/${recommendationId}`);
        expect(response.statusCode).toBe(404);
    });
});

describe("GET /recommendations/random", () => {
    it("Should return 200 and a object", async () => {
        await createRecomendationsWithScoreFactory();
        const recommendationsList: Recommendation[] = [];
        for(let i = 1; i <= 100; i++){
            const response = await supertest(app).get(`/recommendations/random`);
            recommendationsList.push(response.body);
        }
        expect(recommendationsList.length).toBeGreaterThan(0);
    });

    it("Should return 404 if doesnt exist recommendations", async () => {
        const response = await supertest(app).get(`/recommendations/random`);
        expect(response.statusCode).toBe(404);
    });
});

describe("GET /recommendations/top/:amount", () => {
    it("Should return 200 and a list with specific length", async () => {
        await createRecomendationsWithScoreFactory();
        const amount = 5;
        const response = await supertest(app).get(`/recommendations/top/${amount}`);
        const recommendationsList: Recommendation[] = response.body;
        expect(recommendationsList.length).toBeLessThanOrEqual(amount);
    });

    it("Should return 200 and a list ordered by score", async () => {
        await createRecomendationsWithScoreFactory();
        const amount = 5;
        const response = await supertest(app).get(`/recommendations/top/${amount}`);
        const recommendationsList: Recommendation[] = response.body;
        const maxScore = Math.max(...recommendationsList.map(recommendation => recommendation.score));
        const minScore = Math.min(...recommendationsList.map(recommendation => recommendation.score));
        
        expect(recommendationsList).toBeInstanceOf(Array);
        expect(maxScore).toBe(recommendationsList[0].score);
        expect(minScore).toBe(recommendationsList[recommendationsList.length -1].score);
    });
});

afterAll(async () => {
    await prisma.$disconnect();
});