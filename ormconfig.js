module.exports = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  timezone: '+07:00',
  entities: ['dist/**/*.entity{ .ts,.js}'],
  migrations: ['dist/migrations/*{.ts,.js}'],
  cli: {
    migrationsDir: 'src/migrations',
  },
  synchronize: false,
  logging: true,
  logger: 'advanced-console',
};
