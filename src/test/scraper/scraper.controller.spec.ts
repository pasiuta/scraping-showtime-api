import {ScraperController} from "../../scraper/scraper.controller";
import {ScraperService} from "../../scraper/scraper.service";
import {Test} from "@nestjs/testing";
import {ScraperResponseDto} from "../../scraper/dto/scraper-response.dto";
import {HttpException, HttpStatus} from "@nestjs/common";
import {mockResponse} from "../../utils/mockResponse";
import {mockUrl} from "../../utils/mockUrl";

describe('ScraperController', () => {
    let controller: ScraperController;
    let mockScraperService: {
        scrape: jest.MockedFunction<(url: string) => Promise<ScraperResponseDto>>;
    };

    beforeEach(async () => {
        mockScraperService = {
            scrape: (jest.fn() as jest.Mock<Promise<ScraperResponseDto>, [string]>)
        };


        const module = await Test.createTestingModule({
            controllers: [ScraperController],
            providers: [
                {
                    provide: ScraperService,
                    useValue: mockScraperService
                },
            ],
        }).compile();

        controller = module.get<ScraperController>(ScraperController);
    });

    it('should return scraped data for a valid URL', async () => {
        mockScraperService.scrape.mockResolvedValue(mockResponse);

        const result = await controller.scrapeRequest({ url: mockUrl });

        expect(mockScraperService.scrape).toHaveBeenCalledWith(mockUrl);
        expect(result).toEqual(mockResponse);
    });

    it('should handle invalid URL error', async () => {
        const mockUrl = 'invalid-url';
        const errorMessage = 'Bad Request - The provided URL was invalid or not properly formatted.';
        mockScraperService.scrape.mockRejectedValue(new Error(errorMessage));

        await expect(controller.scrapeRequest({ url: mockUrl }))
            .rejects
            .toThrow(new HttpException(errorMessage, HttpStatus.BAD_REQUEST));
    });


});
