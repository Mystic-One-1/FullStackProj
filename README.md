# Netflix Clone Skeleton

This repository contains a simplified full-stack project modeled after Netflix. It includes a Node.js backend with Express and a React frontend. The code is organized as follows:

```
server/          # Express backend
  src/
    controllers/
    middleware/
    models/
    routes/
    utils/
  package.json
  .env            # sample environment variables

client/          # React frontend
  public/
    index.html
  src/
    components/
    context/
    pages/
    services/
    App.jsx
    index.js
  package.json
  .env.local
```

Run `npm install` inside both `server` and `client` to install dependencies.
Use `npm run dev` in `server` and `npm start` in `client` to start development servers.
