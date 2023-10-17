FROM node:buster as BUILDER

WORKDIR /app
COPY . .

RUN yarn install
RUN export $BUILD_ENVS && yarn build

# --------------------------------------------------
FROM nginx

COPY --from=BUILDER /app/build /usr/share/nginx/html

EXPOSE 80
