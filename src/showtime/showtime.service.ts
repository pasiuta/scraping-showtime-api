import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ShowtimeEntity } from './entity/showtime.entity';
import { DataSource, Repository } from 'typeorm';
import { ShowtimeSummaryEntity } from './entity/showtimeSummary.entity';

@Injectable()
export class ShowtimeService {
    constructor(
        @InjectRepository(ShowtimeEntity)
        private showtimeEntityRepository: Repository<ShowtimeEntity>,
        @InjectRepository(ShowtimeSummaryEntity)
        private showtimeSummaryEntityRepository: Repository<ShowtimeSummaryEntity>,
        private dataSource: DataSource,
    ) {}


    private async updateShowtimeSummary() {
        await this.dataSource.query(`
        INSERT INTO "showtime-summary"
        ("showtimeDate",
         "cinemaName",
         "movieTitle",
         attributes,
         city,
         "showtimeCount")
        select date(showtime."showtimeInUTC" AT TIME ZONE 'UTC'),
            showtime."cinemaName",
            showtime."movieTitle",
            showtime.attributes,
            showtime.city,
            count(*)
        from "showtime"
        group by 1, 2, 3, 4, 5
        ON CONFLICT
            (
            "showtimeDate",
            "cinemaName",
            "movieTitle",
            attributes,
            city
            )
            DO UPDATE
                   SET "showtimeCount"= EXCLUDED."showtimeCount"
    `);
    }

    async addShowtimes(showtimes: ShowtimeInterface[]) {
        try {
            const showtimeValues = showtimes.map(showtime => ({
                showtimeId: showtime.showtimeId,
                movieTitle: showtime.movieTitle,
                cinemaName: showtime.cinemaName,
                showtimeInUTC: showtime.showtimeInUTC,
                bookingLink: showtime.bookingLink,
                attributes: showtime.attributes,
            }));

            await this.dataSource
                .createQueryBuilder()
                .insert()
                .into(ShowtimeEntity)
                .values(showtimeValues)
                .orIgnore()
                .execute();
        } catch (error) {
            console.error('Error inserting showtimes: ', error);
        }

        await this.updateShowtimeSummary();
    }






}
