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
    prettier
    --save-dev
```

Create database:
```TEXT
CREATE DATABASE chirik;
```

Run PostgreSQL script from file:

```TEXT
sudo docker cp ./migrations/up/<migration>.sql chirik_postgres:/migrations/up/<migration>.sql
\i ./migrations/up/<migration>.sql
```

PostgreSQL CLI in Docker container:

```TEXT
$ sudo docker exec -i -t chirik_postgres sh
# psql -U postgres -h localhost
postgres=# \l
postgres=# \c chirik
chirik=# \dt
chirik=# \q
```

Redis CLI in Docker container:

```TEXT
$ sudo docker exec -i -t chirik_redis sh
# redis-cli
127.0.0.1:6379> KEYS *
```

Some of HTTP exceptions:

```TS
class BadRequestException {} ; // - 400
class UnauthorizedException {} ; // - 401
class ForbiddenException {}; // - 403
class NotFoundException {}; // - 404
class InternalServerErrorException {} // - 500
```
