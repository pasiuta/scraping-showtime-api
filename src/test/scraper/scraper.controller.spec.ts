import {ScraperController} from "../../scraper/scraper.controller";
import {ScraperService} from "../../scraper/scraper.service";
import {Test} from "@nestjs/testing";
import {ScraperResponseDto} from "../../scraper/dto/scraper-response.dto";
import {BadRequestException, HttpException, HttpStatus} from "@nestjs/common";
import {mockResponse} from "../../utils/mockResponse";
import {mockUrl} from "../../utils/mockUrl";
import {ScraperRequestDto} from "../../scraper/dto/scraper-request.dto";
import {validate} from "class-validator";

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

});
