# Screen Patron

A place where you can find, share, and support local DIY film screenings.

## Version

This branch is a proof of concept version of the app using dummy data. You can interact with the app but there is no actual database backing it.

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

The pre-alpha verison of the app is using the built-in Remix app server which is production-ready.

Once ready, deploy the output of `remix build`:

- `build/`
- `public/build/`
