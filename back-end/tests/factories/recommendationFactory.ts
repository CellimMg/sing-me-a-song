import { prisma } from "../../src/database";
import { CreateRecommendationData } from "../../src/services/recommendationsService";

export function recommendationFactory(): CreateRecommendationData{
    return {
        "name": "Falamansa - Xote dos Milagres",
        "youtubeLink": "https://www.youtube.com/watch?v=chwyjJbcs1Y"
    };
}


export async function createRecomendationFactory(){
    await prisma.$executeRaw`INSERT 
        INTO recommendations (id, name, "youtubeLink") 
        VALUES (1, 'teste', 'https://www.youtube.com')`;
}

export async function createRecomendationsWithScoreFactory(){
    await prisma.$executeRaw`INSERT 
        INTO recommendations (id, name, "youtubeLink", score) 
        VALUES (1, 'teste', 'https://www.youtube.com', -5),
        (2, 'teste1', 'https://www.youtube.com', -4),
        (3, 'teste2', 'https://www.youtube.com', -3),
        (4, 'teste3', 'https://www.youtube.com', 5),
        (5, 'teste4', 'https://www.youtube.com', 3),
        (6, 'teste5', 'https://www.youtube.com', 2),
        (7, 'teste6', 'https://www.youtube.com', 1),
        (8, 'teste7', 'https://www.youtube.com', 15),
        (9, 'teste8', 'https://www.youtube.com', 20),
        (10, 'teste9', 'https://www.youtube.com', 13)`;
}

export async function createRecomendationWithNegativeScoreFactory(){
    await prisma.$executeRaw`INSERT 
        INTO recommendations (id, name, "youtubeLink", score) 
        VALUES (1, 'teste', 'https://www.youtube.com', -5)`;
}