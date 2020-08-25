![banner](public/images/frontend%20github%20banner.png)
[Mealie.Moe](https://mealie.moe) Frontend

This repository houses the frontend parts of the website. Following is a short summary of
its workings and how you can contribute if you want to!

# Table of Contents
- [Table of Contents](#table-of-contents)
- [Tooling](#tooling)
- [Get it working yourself](#get-it-working-yourself)
- [Project Architecture](#project-architecture)
- [Helping out](#helping-out)

# Tooling
You can take a look at the entire tooling in the `package.json` file, but in short,
it uses Next.js for its server side rendering, caching, and building. Uses typescript
and react in adition with that to build a reactive user experience while also being
much easier for search engine optimization and payload sizes for pages.

For styling we use scss, just for the ease of nesting selectors.

And linting is managed by eslint with the typescript plugin. We are not using any fancy
pants linting rules for this project, and simply following the recommended suite from react.

# Get it working yourself
First of all you need to install docker and follow the guide to install the backend service over
on [mealiedotmoe/backend](https://gitbub.com/mealiedotmoe/backend).
After you are done with that simply clone this repository, and run
```sh
# Install dependencies
npm install
# Start local server
npm run dev
```
This should start the Next.js development server over at https://localhost:8080

# Project Architecture
This project follows somewhat of the basic architecture suggested by Next.js.

- **`.github`**: Contains config files for GitHub actions if you do decide to utilise them.
- **`.vscode/`**: Editor settings for VSCode if you choose to use it.
- **`components/`**: Contains sub-directories which houses reusable react components. The components,
if have a stylesheet attached to them will be in the same sub directory.
- **`pages/`**: This directory contains all the pages that Next will serve. Check the
[Next `Router` Docs](https://nextjs.org/docs/routing/introduction) for more details.
- **`public/`**: Contains all the static images and resources that will be served from the root of
the webserver. Check the Next Router docs linked above for more details.
- **`styles/`**: Contains all the stylesheets for the base pages. `styles/admin` houses stylesheets
for the admin version of the pages.
- **`utils/`**: Contains all the one of functions that can be used anywhere in the project.
- **`.env.production`**: .env file for Next.js to use while building for production mode. You'll
probably not need this env file much.
- **`.env.development`**: .env file for Next.js to use while running in development mode. You can
change `NEXT_PUBLIC_API_HOST` to some other value if you have the backend running differently.
- **`.eslintrc`**: ESLint rules.
- **`Dockerfile`**: Docker config for deployment.

# Helping out
Have you found a bug that we might have missed, or want to contribute with a fix yourself, or a feature?
Shoot an [issue](https://github.com/mealiedotmoe/frontend/issues/new) or send in PR and we'll be happy to review them and get them included!

If you still feel lost, but want to contribute, feel free to ping me on discord Ikari#5684.