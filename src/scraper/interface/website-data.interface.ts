import {ApiProperty} from "@nestjs/swagger";

export class WebsiteData {

  @ApiProperty({
    description: 'The title of the website',
    example: 'My Awesome Website'
  })
  title: string;

  @ApiProperty({
    description: 'The meta description of the website, used for SEO',
    example: 'This is an example meta description for a website'
  })
  metaDescription: string;

  @ApiProperty({
    description: 'URL of the website\'s favicon',
    example: 'https://www.example.com/favicon.ico'
  })
  faviconUrl: string;

  @ApiProperty({
    description: 'Array of URLs for scripts included in the website',
    example: ['https://www.example.com/script1.js', 'https://www.example.com/script2.js']
  })
  scriptUrls: string[];

  @ApiProperty({
    description: 'Array of URLs for stylesheets used in the website',
    example: ['https://www.example.com/style1.css', 'https://www.example.com/style2.css']
  })
  stylesheetUrls: string[];

  @ApiProperty({
    description: 'Array of URLs for images found in the website',
    example: ['https://www.example.com/image1.jpg', 'https://www.example.com/image2.png']
  })
  imageUrls: string[];

  @ApiProperty({
    description: 'Array of showtimes, each represented by a ShowtimeInterface object',
  })
  showtimes: ShowtimeInterface[];
}
