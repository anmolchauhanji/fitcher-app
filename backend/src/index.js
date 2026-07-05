import http from "http";

import app from "./app.js";
import { connectDB } from "./config/db.js";
import env from "./config/env.js";

import { initSocket } from "./socket/socket.js";

const startServer = async () => {
  try {
    await connectDB();

    const server = http.createServer(app);

    initSocket(server);

    server.listen(env.PORT, () => {
      console.log(
        `🚀 Server running on http://localhost:${env.PORT}`
      );
    });
  } catch (error) {
    console.error(
      "Failed to start server:",
      error.message
    );
    process.exit(1);
  }
};

startServer();