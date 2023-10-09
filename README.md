# Aleph Zero Dashboard

## Using Containers

You may build a container using:

```
./shell/build-container.sh
```

Then run your container with:

```
podman run --d -p 8080:80 localhost/aleph-zero-dashboard
```

And access the **Dashboard** at http://localhost:8080/.
