import { recommendationRepository } from "../../src/repositories/recommendationRepository";
import {
  recommendationService,
  CreateRecommendationData,
} from "../../src/services/recommendationsService";
import { conflictError, notFoundError } from "../../src/utils/errorUtils";
import { recommendationFactory } from "../factories/recommendationFactory";


beforeEach(() => {
  jest.resetAllMocks();
  jest.clearAllMocks();
});

describe("Recommendation service tests", () => {
  it("Recommendation should be created", async () => {
    const recommendation: CreateRecommendationData = recommendationFactory();

    jest
      .spyOn(recommendationRepository, "findByName")
      .mockResolvedValueOnce(null);

    jest
      .spyOn(recommendationRepository, "create")
      .mockImplementationOnce(async () => {});

    await recommendationService.insert(recommendation);
    expect(recommendationRepository.create).toBeCalledTimes(1);
  });

  it("Duplicated recommendation should not be created", async () => {
    const recommendation: CreateRecommendationData = recommendationFactory();

    jest
      .spyOn(recommendationRepository, "findByName")
      .mockImplementationOnce((): any => {
        return recommendation;
      });

    const result = recommendationService.insert({ ...recommendation });

    expect(result).rejects.toEqual(
      conflictError("Recommendations names must be unique")
    );

    expect(recommendationRepository.create).not.toBeCalled();
  });
});

describe("Recommendation reset", () => {
    it("Recommendation reseted", async () => {
      const recommendation: CreateRecommendationData = recommendationFactory();
  
      jest
        .spyOn(recommendationRepository, "reset")
        .mockResolvedValueOnce(null);
  
      await recommendationService.reset();
      expect(recommendationRepository.reset).toBeCalledTimes(1);
    });
  
  });




describe("Upvote/Downvote service tests", () => {
  const id = 1;
  const recommendation = recommendationFactory();

  it("Should upvote new recommendation succesfully", async () => {
    jest
      .spyOn(recommendationRepository, "find")
      .mockImplementationOnce((): any => {
        return { ...recommendation };
      });
    jest
      .spyOn(recommendationRepository, "updateScore")
      .mockResolvedValueOnce(null);

    await recommendationService.upvote(id);

    expect(recommendationRepository.updateScore).toBeCalled();
  });

  it("Should fail upvote if the ID is invalid", async () => {
    jest.spyOn(recommendationRepository, "find").mockResolvedValueOnce(null);

    const result = recommendationService.upvote(id);

    expect(result).rejects.toEqual(notFoundError(""));
  });

  it("Should success downvote", async () => {
    jest
      .spyOn(recommendationRepository, "find")
      .mockImplementationOnce((): any => {
        return { ...recommendation };
      });

    jest
      .spyOn(recommendationRepository, "updateScore")
      .mockImplementationOnce((): any => {
        return { score: 10 };
      });

    await recommendationService.downvote(id);

    expect(recommendationRepository.updateScore).toBeCalled();
  });

  it("Should fail downvote if invalid id", async () => {
    jest.spyOn(recommendationRepository, "find").mockResolvedValueOnce(null);

    const result = recommendationService.downvote(id);

    expect(result).rejects.toEqual(notFoundError(""));
  });

  it("Should delete the recommendation if score less than -5", async () => {
    jest
      .spyOn(recommendationRepository, "find")
      .mockImplementationOnce((): any => {
        return { ...recommendation };
      });

    jest
      .spyOn(recommendationRepository, "updateScore")
      .mockImplementationOnce((): any => {
        return { score: -6 };
      });

    jest.spyOn(recommendationRepository, "remove").mockResolvedValue(null);

    await recommendationService.downvote(id);

    expect(recommendationRepository.remove).toBeCalled();
  });
});

describe("Get recommendations", () => {
  it("Should get random song with 10 or more upvotes", async () => {
    jest.spyOn(Math, "random").mockReturnValue(0.6);

    jest
      .spyOn(recommendationRepository, "findAll")
      .mockResolvedValue([{ ...recommendationFactory(), id: 1, score: 11 }]);

    const result = await recommendationService.getRandom();

    expect(result.score).toBeGreaterThan(10);
    expect(recommendationRepository.findAll).toBeCalled();
  });

  it("Should get random songs", async () => {
    jest.spyOn(Math, "random").mockImplementationOnce(() => {
      return 0.8;
    });
    jest
      .spyOn(recommendationRepository, "findAll")
      .mockResolvedValue([{ ...recommendationFactory(), id: 1, score: 5 }]);

    await recommendationService.getRandom();

    expect(recommendationRepository.findAll).toBeCalled();
  });

  it("Should fail", async () => {
    jest.spyOn(recommendationRepository, "findAll").mockResolvedValue([]);

    const result = recommendationService.getRandom();

    expect(result).rejects.toEqual(notFoundError());
  });
});

describe("getTop service tests", () => {
  const quantity = 6;

  it("Should return the top results", async () => {
    jest
      .spyOn(recommendationRepository, "getAmountByScore")
      .mockImplementationOnce((): any => {
        return [1, 2];
      });

    await recommendationService.getTop(quantity);

    expect(recommendationRepository.getAmountByScore).toBeCalled();
  });
});