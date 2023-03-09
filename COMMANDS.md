# COMMANDS

Prettier and ESLint packages:

```TEXT
npm install
    @typescript-eslint/eslint-plugin
    @typescript-eslint/parser eslint
    eslint-config-prettier
    eslint-import-resolver-typescript
    eslint-plugin-import
    eslint-plugin-prettier
    eslint-plugin-sort-destructure-keys
    eslint-plugin-typescript-sort-keys
    prettier
    --save-dev
```

Create database:
```TEXT
CREATE DATABASE chirik;
```

Run PostgreSQL script from file:

```TEXT
sudo docker cp ./migrations/up/001-create-base-tables.sql chirik_postgres:/migrations/up/001-create-base-tables.sql
\i ./migrations/up/001-create-base-tables.sql
```

PostgreSQL CLI in Docker container:

```TEXT
$ docker exec -i -t chirik_postgres sh
# psql -U postgres -h localhost
postgres=# \l
postgres=# \c chirik
chirik=# \dt
chirik=# \q
```

Redis CLI in Docker container:

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
