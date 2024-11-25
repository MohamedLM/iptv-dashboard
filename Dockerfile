FROM public.ecr.aws/lambda/nodejs:20 AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS builder
COPY . /app
WORKDIR /app

ARG DATABASE_URL
ARG AUTH_SECRET
ARG STATIC_HOST
ARG NOVU_SECRET_KEY
ARG NEXT_PUBLIC_NOVU_IDENTIFIER
ARG SMTP_HOST
ARG SMTP_USERNAME
ARG SMTP_PASSWORD

ENV DATABASE_URL=$DATABASE_URL
ENV AUTH_SECRET=$AUTH_SECRET
ENV STATIC_HOST=$STATIC_HOST
ENV NOVU_SECRET_KEY=$NOVU_SECRET_KEY
ENV NEXT_PUBLIC_NOVU_IDENTIFIER=$NEXT_PUBLIC_NOVU_IDENTIFIER
ENV SMTP_HOST=$SMTP_HOST
ENV SMTP_USERNAME=$SMTP_USERNAME
ENV SMTP_PASSWORD=$SMTP_PASSWORD

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm build

FROM public.ecr.aws/lambda/nodejs:20 as dashboard
COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.8.3 /lambda-adapter /opt/extensions/lambda-adapter

ENV PORT=8080 NODE_ENV=production
ENV HOSTNAME "0.0.0.0"

WORKDIR ${LAMBDA_TASK_ROOT}

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.mjs ./next.config.mjs
# COPY --from=builder /app/cache-handler.mjs ./cache-handler.mjs
COPY --from=builder /app/public ./public
RUN ln -s /tmp/cache ./.next/cache

ENTRYPOINT ["npm", "run", "start", "--loglevel=verbose", "--cache=/tmp/npm"]
