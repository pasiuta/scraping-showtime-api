import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
``
@Injectable()
export class AppConfigService {
    constructor(private configService: ConfigService) {}

    get(key: string, defaultValueForAbsentVariable = ''): string {
        return this.configService.get<string>(key, defaultValueForAbsentVariable);
    }

    get appPort(): number {
        return this.configService.get<number>('APP_PORT', 3000);
    }

    get dbHost(): string {
        return this.configService.get<string>('DB_HOST', 'localhost');
    }

    get dbPort(): number {
        return this.configService.get<number>('DB_PORT', 5432);
    }

    get dbUsername(): string {
        return this.configService.get<string>('DB_USERNAME', 'postgres');
    }

    get dbPassword(): string {
        return this.configService.get<string>('DB_PASSWORD', 'defaultPassword');
    }

    get dbName(): string {
        return this.configService.get<string>('DB_NAME', 'scraper');
    }

    get dbSynchronize(): boolean {
        return this.configService.get<boolean>('DB_SYNCHRONIZE', true);
    }

    get dbLogging(): boolean {
        return this.configService.get<boolean>('DB_LOGGING', true);
    }
    get baseUrl(): string {
        return this.configService.get<string>('BASE_URL', 'https://uae.voxcinemas.com');
    }



}
