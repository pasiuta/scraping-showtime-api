import { HttpService } from "@nestjs/axios";
import { ScraperService } from "../../scraper/scraper.service";
import { of } from "rxjs";
import { mockResponse } from "../../utils/mockResponse";
import { Test, TestingModule } from "@nestjs/testing";
import { jest, it, expect, beforeEach } from '@jest/globals';
import {mockUrl} from "../../utils/mockUrl";

describe('ScraperService', () => {
    let service: ScraperService;
    let mockHttpService: HttpService;

    beforeEach(async () => {
        mockHttpService = {
            get: jest.fn().mockImplementation((url: string) => of({ data: mockResponse })) as unknown as HttpService
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ScraperService,
                {
                    provide: HttpService,
                    useValue: mockHttpService
                },
            ],
        }).compile();

        service = module.get<ScraperService>(ScraperService);
    });

    it('should return data on successful scrape', async () => {

        (mockHttpService.get as jest.Mock).mockReturnValue(of({ data: mockResponse }));

        const result = await service.scrape(mockUrl);

        expect(mockHttpService.get).toHaveBeenCalledWith(mockUrl);
        expect(result).toEqual(mockResponse);
    });
});
