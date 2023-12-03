import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {AppConfigService} from "./config.service";

@Module({
    imports: [ConfigModule],
    providers: [AppConfigService, ConfigService],
    exports: [AppConfigService, ConfigService],
})
export class AppConfigModule {}
