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
    select DISTINCT date(showtime."showtimeInUTC" AT TIME ZONE 'UTC'),
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

        //TODO: Investigate and resolve the duplication issue in the "showtime-summary" table.
        // If you check the "showtime-summary" table rows you will notice that there duplicate rows.
        // Analyze the current aggregation query to identify why duplicates are being created.
        // Modify the query or the table structure as necessary to prevent duplicate entries.
        // Ensure your solution maintains data integrity and optimizes performance.
    }





    async addShowtimes(showtimes: ShowtimeInterface[]) {
        for (const showtime of showtimes) {
            const existingShowtime = await this.showtimeEntityRepository.findOne({where: { showtimeId: showtime.showtimeId }});
            if (!existingShowtime) {
                await this.showtimeEntityRepository.save(showtime);
            } else {
                console.warn(`Skipping duplicate entry with showtimeId: ${showtime.showtimeId}`);
            }
        }
        await this.updateShowtimeSummary();
    }



}
