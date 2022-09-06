<a href="https://www.producthunt.com/posts/tricktionary?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-tricktionary" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=286868&theme=light" alt="Tricktionary - Creative icebreaker game for Zoom meetings | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a>

# Tricktionary

Tricktionary is a game developed by StorySquad.

This frontend application is a React/TypeScript project that relies heavily on the use of WebSockets.
We use socket.io to handle player connections and game events.

## Notable Technologies/Dependencies Used

- [yarn](https://yarnpkg.com/)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [socket.io](https://socket.io/)
- [Recoil.js](https://recoiljs.org/)
- [node-sass (SCSS)](https://www.npmjs.com/package/node-sass)
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)

## Application Architecture

Here is a basic layout of the application from a frontend perspective:

![](./src/assets/tricktionary_architecture_fe.png)

## Environment Variables for Developers and Deployment

For a list of required environment variables, look in [./src/utils/constants.ts](./src/utils/constants.ts)

- REACT_APP_API_URL
- REACT_APP_JWT_SECRET
- REACT_APP_STORYSQUAD_AI_API_URL



---

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `yarn build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
