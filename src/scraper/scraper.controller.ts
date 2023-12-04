import {Controller, Get, HttpException, HttpStatus, Query, UsePipes, ValidationPipe} from '@nestjs/common';
import {ApiOperation, ApiResponse, ApiTags} from '@nestjs/swagger';
import { ScraperRequestDto } from './dto/scraper-request.dto';
import { ScraperService } from './scraper.service';
import { ScraperResponseDto } from './dto/scraper-response.dto';

@Controller()
export class ScraperController {
  constructor(private readonly scraperService: ScraperService) {}
  @ApiOperation({
    summary: 'Initiate a new scraping process for the provided URL',
  })
  @ApiResponse({
    status: 200,
    description: 'The scraping process was successful. Returns the scraped data.',
    type: ScraperResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - The provided URL was invalid or not properly formatted.',
  })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @Get('scrape')
  async scrapeRequest(
      @Query() scrapeRequestDto: ScraperRequestDto,
  ): Promise<ScraperResponseDto> {
    try {
      return await this.scraperService.scrape(scrapeRequestDto.url);
    } catch (error) {
      throw new HttpException('Failed to scrape the website', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
