# Screen Patron

A place where you can find, share, and support local DIY film screenings. Still in development.


## Development

From your terminal:

```sh
npm run dev
```

This starts the app in development mode, rebuilding assets on file changes.

## Deployment

First, build the app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

The app is currently using the built-in Remix app server which is production-ready. This may change as in the future, since I still need to decide a host to deploy it to.

Once ready, deploy the output of `remix build`:

- `build/`
- `public/build/`
