# IPTV Dashboard
This is an IPTV Dashboard app built on top of NextJS

## Technology Stack
- Programming Languge: Javascript / Typescript
- Framework: NextJs
- Database: Postgres (neon)

## Development
- Install dependencies using pnpm `pnpm install`
- Copy `env.sample` to `.env` and fill in the values
- (optional) if you have docker installed on your computer and want to use local postgres database, you can run `pnpm docker:up` to start the local postgres database inside the docker.
- (optional) if you use new database, you need to migrate the database scheme with `pnpm db:push`
- Run project with `pnpm dev`

## Deployment

### Node.js Server
This app can be deployed to nodejs server.
- Run `pnpm build` to build production ready app
- Run `pnpm start` to start to start the server

### Docker
This app can also be deployed to any hosting provider that supports Docker containers
- Build the container by running `pnpm docker:build`
- Run the container with `docker run --env-file .env -p 8080:8080 -d iptv-dashboard`
