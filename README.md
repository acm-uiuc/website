# ACM @ UIUC's Website

View the website at [acm.illinois.edu](https://www.acm.illinois.edu/).

The frontend source code for ACM's website is built mainly with TypeScript, [Astro](https://astro.build/), and [Preact](https://preactjs.com/). Viewers can learn about our organization, upcoming events, SIGs/Committees, become members, buy merch, and more!

## Getting Started

In the project directory, you can run:

### `yarn dev`

Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The page will reload if you make edits.

You will also see any lint errors in the console.

### `yarn build`

Builds the app for production to the `build` folder.

It correctly bundles Astro in production mode and optimizes the build for the best performance.

### `yarn format:fix`

Runs `prettier` and `eslint` to format the code in the project. These tools also run as a pre-commit hook.

## Testing

We have written some basic end-to-end tests as sanity checks using Playwright. These will run on every pull request.

You can also run these locally by first starting the development server with `yarn dev`, and then run the tests in a separate terminal with `yarn test:e2e`. You may first need to install dependencies with `npx playwright install --with-deps`.
