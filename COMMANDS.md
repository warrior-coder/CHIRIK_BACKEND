# COMMANDS

ESLint packages:

```SH
npm install -d @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint eslint-config-prettier eslint-import-resolver-typescript eslint-plugin-import eslint-plugin-prettier eslint-plugin-sort-destructure-keys eslint-plugin-typescript-sort-keys prettier --save-dev
```

Migrations commands:

```SH
npm run typeorm migration:create -- ./migrations/<migration-name>
npm run typeorm migration:generate -- -d ./configs/data-source.ts -p ./migrations/<migration-name>
npm run typeorm migration:run -- -d ./configs/data-source.ts
npm run typeorm migration:revert -- -d ./configs/data-source.ts
```

PostgreSQL CLI in Docker:

```TEXT
$ docker exec -i -t chirik_postgres sh
# psql -U postgres -h localhost
postgres=# \c chirik
chirik=# \dt
```

Redis CLI in Docker:

```TEXT
$ docker exec -i -t chirik_redis sh
/data # redis-cli
127.0.0.1:6379> keys *
```

Some of HTTP exceptions:

```TS
class BadRequestException {} ; // - 400
class UnauthorizedException {} ; // - 401
class ForbiddenException {}; // - 403
class NotFoundException {}; // - 404
class InternalServerErrorException {} // - 500
```
