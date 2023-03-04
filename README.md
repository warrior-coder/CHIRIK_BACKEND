# CHIRIK BACKEND

Back-End of the service for posting records on the Internet – Chirik.

Install used dependencies:

```SH
npm install
```

Set up PostgreSQL и Redis services in Docker:

```SH
docker-compose up
```

Build the project:

```SH
npm run build
```

Run migrations:

```SH
npm run typeorm migration:run -- -d ./configs/data-source.ts
```

Start application in development mode:

```SH
npm run start:dev
```
