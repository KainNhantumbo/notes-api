#  🌟 Choconotey REST API (Node.JS + Typescript + Mongo DB)

This REST API server application is built to serve its endpoints to Choconotey application ([see the source code here](https://github.com/KainNhantumbo/notes-api)), which is currently under active development.

**See the API Documentation at: [https://choconotey-api-demo.onrender.com/docs](https://choconotey-api-demo.onrender.com/docs)**

**Access this app live at: [https://choconotey-demo.vercel.app](https://choconotey-demo.vercel.app)**

## 🌠 Project status

This project is under active development, it means that new features a being backed at meanwhile and to catch all them please refer to the front-end app repository [here](https://github.com/KainNhantumbo/notes-app).

## 🐾 Project Stack

- **Node.JS** - Javascript runtime.
- **Typescript** - a superset language of Javascript that provides typechecking.
- **Express.js** - a small unpinionated framework for building server apps with Node.js
- **MongoDB** - database for storing data.
- **Jest and Supertest** - for testing.
- **Mongoose** - an ORM for conneting application to MongoDB.
- **Swagger Docs** - for API documentation.

## 🪁 Current features

### - Release v1.0.0

- Handle create, read, update and delete notes, folder and users on the database.
- Handle user login, registration and authentication with jwt (JSON web tokens) strategy.
- Serve all data to a separated front-end React.JS application.

## 🏗️ Testing and Local Setup

Make sure you have installed **Node.js (v18.17.0 or later recommended) which also comes with npm v9.6.7**.\

> **IMPORTANT**: - Make sure you add those environment variables below to your .env file:

```bash
# NODE ENVIRONMENT (DEVELOPMENT OR PRODUCTION)
NODE_ENV=

# DEBUG SYSTEM
NODE_DEBUG=

# SERVER PORT
PORT =

# ALLOWED DOMAINS FOR CORS
ALLOWED_DOMAINS=

# TOKEN KEYS
REFRESH_TOKEN=
ACCESS_TOKEN=

# MONGO DB URI
DB_URI =

# JWT EXPIRATION TIME
ACCESS_TOKEN_EXPDATE = 
REFRESH_TOKEN_EXPDATE =
```
Then, in the project directory, you can run in terminal:

```bash
npm install 
npm run dev
```

Runs the app in the development mode and the server will reload when you make changes to the source code.

```bash
npm run build
```

Builds the app for production to the **dist folder**.

```bash
npm run start
```

Builds and starts the server in prodution.

## ☘️  Find me!

E-mail: [nhantumbok@gmail.com](nhantumbok@gmail.com 'Send an e-mail')\
Github: [https://github.com/KainNhantumbo](https://github.com/KainNhantumbo 'See my github profile')  
Portfolio: [https://codenut-dev.vercel.app](https://codenut-dev.vercel.app 'See my portfolio website')\
My Blog: [https://codenut-dev.vercel.app/blog](https://codenut-dev.vercel.app/blog 'Visit my blog site')

#### If you like this project, let me know by leaving a star on this repository so I can keep improving this app.😊😘

Best regards, Kain Nhantumbo.\
✌️🇲🇿 **Made with ❤ React + Vite and Typescript**

## 📜 License

Licensed under Apache License 2.0. All rights reserved.\
Copyright &copy; 2023 Kain Nhantumbo.

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
