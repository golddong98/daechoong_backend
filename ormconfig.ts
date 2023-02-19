// import { TypeOrmModuleOptions } from '@nestjs/typeorm';

// function ormConfig(): TypeOrmModuleOptions {
//   const commonConf = {
//     SYNCRONIZE: true,
//     ENTITIES: [__dirname + '/database/**/*.entity.{js,ts}'],
//     AUTOLOADENTITIES: true,
//     SEEDS: ['src/database/seeds/**/*.seed.ts'],
//     // MIGRATIONS: [__dirname + '/migrations/**/*{.ts,.js}'],
//     // CLI: {
//     //   migrationsDir: 'src/migrations',
//     // },
//     // MIGRATIONS_RUN: false,
//   };

//   const ormconfig: TypeOrmModuleOptions = {
//     type: 'mysql',
//     database: 'word',
//     host: 'localhost',
//     port: 3306,
//     username: 'root',
//     password: 111111,
//     logging: true,
//     synchronize: commonConf.SYNCRONIZE,
//     entities: commonConf.ENTITIES,
//     autoLoadEntities: commonConf.AUTOLOADENTITIES,
//     seeds: commonConf.SEEDS,
//     // migrations: commonConf.MIGRATIONS,
//     // cli: commonConf.CLI,
//     // migrationsRun: commonConf.MIGRATIONS_RUN,
//   };

//   return ormconfig;
// }

// export { ormConfig };

const commonConf = {
  SYNCRONIZE: true,
  ENTITIES: ['src/**/*.entity.ts'],
  AUTOLOADENTITIES: true,
  SEEDS: ['src/database/seeds/**/*.seed.ts'],
  // MIGRATIONS: [__dirname + '/migrations/**/*{.ts,.js}'],
  // CLI: {
  //   migrationsDir: 'src/migrations',
  // },
  // MIGRATIONS_RUN: false,
};

module.exports = {
  type: process.env.DB_TYPE,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  logging: true,
  synchronize: commonConf.SYNCRONIZE,
  entities: commonConf.ENTITIES,
  autoLoadEntities: commonConf.AUTOLOADENTITIES,
  seeds: commonConf.SEEDS,
  // migrations: commonConf.MIGRATIONS,
  // cli: commonConf.CLI,
  // migrationsRun: commonConf.MIGRATIONS_RUN,
};
