import { PrismaClient } from '../../generated/prisma/client'
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { Injectable } from "@nestjs/common";
import { OnModuleInit, OnModuleDestroy } from "@nestjs/common";
@Injectable()
export class DatabaseService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const adapter = new PrismaBetterSqlite3({
      url: process.env.DATABASE_URL || 'file:./dev.db',
    });

    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}