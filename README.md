# Aleph Zero Dashboard

## Setup for development

```
# create .env file with this content: VITE_DISABLE_FIAT=1 and run
yarn dev
```

## Using Containers

You may build a container using:

```
docker build  --tag aleph-staking-dashboard:latest -f ./docker/Dockerfile . --build-arg BUILD_ENVS="VITE_DISABLE_MAINNET=1 VITE_DISABLE_FIAT=1"
```

Then run your container with:

```
docker run --rm -ti -p 8080:80 --name test-dashboard aleph-staking-dashboard:latest
```

## Environment Variables

Optionally apply the following environment variables in an environment file such as `.env` or with `yarn build` to customize the build of dashboard, see [.env](.env) file.
