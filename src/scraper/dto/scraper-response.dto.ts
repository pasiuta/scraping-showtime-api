import { WebsiteData } from '../interface/website-data.interface';
import {ApiProperty} from "@nestjs/swagger";

export class ScraperResponseDto {

  @ApiProperty({
    description: 'The URL of the website that was scraped',
    example: 'https://www.example.com',
  })
  requestUrl: string;

  @ApiProperty({
    description: 'The data scraped from the requested URL',
    type: WebsiteData,
  })
  responseData: WebsiteData;
}
