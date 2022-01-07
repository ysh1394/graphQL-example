import express from "express";
// import cors from "cors";
// import messagesRoute from "./routes/messages.js";
// import usersRoute from "./routes/users.js";
import resolvers from "./resolvers/index.js";
import schema from "./schema/index.js";
import { readDB } from "./dbController.js";

import { ApolloServer } from "apollo-server-express";

// 그래프 큐엘에서는 필요없는 부분
// const app = express();
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

// app.use(
//   cors({
//     origin: "http://localhost:3000",
//     credentials: true,
//   })
// );

const server = new ApolloServer({
  typeDefs: schema,
  resolvers, // 그래프큐엘에서 route 대신해서 사용함
  context: {
    db: {
      messages: readDB("messages"),
      users: readDB("users"),
    },
  },
});

const app = express();
await server.start();

server.applyMiddleware({
  app,
  path: "/graphql",
  cors: {
    origin: ["http://localhost:3000", "https://studio.apollographql.com"],
    credentials: true,
  },
});

await app.listen({ port: 8000 });
console.log("server listening on 8000 ...");

// 그래프큐엘은 일반 express 서버와 달리 route가 필요 없음
// const routes = [...messagesRoute, ...usersRoute];
// routes.forEach(({ method, route, handler }) => app[method](route, handler));

// app.listen(8000, () => {
//   console.log("server listening on 8000 ...");
// });
