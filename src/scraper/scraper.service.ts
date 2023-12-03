import { Injectable, Logger } from '@nestjs/common';
import { AxiosError } from 'axios';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { ScraperResponseDto } from './dto/scraper-response.dto';
import * as cheerio from 'cheerio';
import { WebsiteData } from './interface/website-data.interface';
import { ShowtimeService } from '../showtime/showtime.service';
import { AppConfigService } from "../config/config.service";
const moment = require('moment');

@Injectable()
export class ScraperService {
  private readonly logger: Logger = new Logger(ScraperService.name);
  private readonly BASE_URL: string = this.configService.baseUrl


  constructor(
    private readonly httpService: HttpService,
    private readonly showtimeService: ShowtimeService,
    private readonly configService: AppConfigService,
  ) {}

  private async fetchHtml(ur: string): Promise<string> {
    const { data } = await firstValueFrom(
      this.httpService.get<string>(ur).pipe(
        catchError((error: AxiosError) => {
          const msg = error?.response?.data || error?.response || error;
          this.logger.error(msg);
          throw 'An error happened!';
        }),
      ),
    );
    return data;
  }

  private parseHtml(html: string): WebsiteData {
    const $ = cheerio.load(html);
    const title: string = $('title').text().trim();
    const metaDescription: string = $('meta[name="description"]').attr('content') ?? '';
    const faviconUrl: string = $('link[rel="shortcut icon"]').attr('href') ?? '';

    const scriptUrls: string[] = [];
    $('script').each((_i, el) => {
      const src: string = $(el).attr('src');
      if (src) {
        scriptUrls.push(src);
      }
    });

    const stylesheetUrls: string[] = [];
    $('link[rel="stylesheet"]').each((_i, el) => {
      const href:string = $(el).attr('href');
      if (href) {
        stylesheetUrls.push(href);
      }
    });

    const imageUrls: string[] = [];
    $('img').each((_i, el) => {
      const src:string = $(el).attr('src');
      if (src) {
        imageUrls.push(src);
      }
    });

    const showtimes: ShowtimeInterface[] = this.parseShowtimes(html);


    return {
      title,
      metaDescription,
      faviconUrl,
      scriptUrls,
      stylesheetUrls,
      imageUrls,
      showtimes,
    };
  }

  private convertToUTCTimestamp(dateString, timeString) {
    const dateTime = moment(`${dateString} ${timeString}`, 'YYYY-MM-DD h:mma');

    return dateTime.utc().format();
  }


  private parseShowtimes(html: string): ShowtimeInterface[] {
    const $ = cheerio.load(html);
    const showtimes: ShowtimeInterface[] = [];

    $('article.movie-compare').each((_articleIndex, article) => {
      const movieTitle: string = $(article).find('h2').text().trim();
      const cinemaName: string = 'Al Hamra Mall - Ras Al Khaimah';

      $(article).find('ol.showtimes li').each((_showtimeIndex, showtimeLi) => {
        const screenType: string = $(showtimeLi).find('strong').text().trim();

        $(showtimeLi).find('ol li').each((_timeIndex, timeLi) => {
          const showtimeId: string = $(timeLi).attr('data-id');
          const showtimeLinkElement = $(timeLi).find('a.action.showtime');
          const showtimeInUTC: string = showtimeLinkElement.text().trim();
          let bookingLink: string = showtimeLinkElement.attr('href');

          if (bookingLink && !bookingLink.startsWith('http')) {
            bookingLink = this.BASE_URL + bookingLink;
          }
          const date: string = '2023-11-03';

          showtimes.push({
            showtimeId,
            cinemaName,
            movieTitle,
            showtimeInUTC: this.convertToUTCTimestamp(date, showtimeInUTC),
            bookingLink,
            attributes: [screenType],
          });
        });
      });
    });

    return showtimes;
  }

  async scrape(url: string): Promise<ScraperResponseDto> {
    const html: string = await this.fetchHtml(url);
    const websiteData: WebsiteData = this.parseHtml(html);
    await this.showtimeService.addShowtimes(websiteData.showtimes);
    return {
      requestUrl: url,
      responseData: websiteData,
    };
  }
}
