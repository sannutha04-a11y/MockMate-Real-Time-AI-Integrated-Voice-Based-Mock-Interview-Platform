const express = require("express");

const http = require("http");

const { Server: SocketIOServer } = require("socket.io");

const cors = require("cors");

const dotenv = require("dotenv");

const connectDB = require("./config/db");

dotenv.config();

connectDB();

const app = express();

app.use(cors());

app.use(express.json({ limit: "5mb" }));

// ── HTTP + SOCKET.IO SERVER (real-time features) ──
// We wrap the express app in a raw http server so Socket.IO can share the
// same port. This powers lightweight real-time features like the live
// "people practicing right now" presence counter on the Home page.
const httpServer = http.createServer(app);

const io = new SocketIOServer(httpServer, {
  cors: { origin: "*" },
});

let livePresenceCount = 0;

io.on("connection", (socket) => {
  livePresenceCount += 1;
  io.emit("presence:count", livePresenceCount);

  socket.on("disconnect", () => {
    livePresenceCount = Math.max(0, livePresenceCount - 1);
    io.emit("presence:count", livePresenceCount);
  });
});

// Make io available to controllers that want to broadcast events
// (e.g. "AI is thinking" / interview lifecycle events) without
// tightly coupling every controller to the socket.io import.
app.set("io", io);


// ROUTES

app.use(
  "/api/auth",
  require("./routes/authRoutes")
);

app.use(
  "/api/upload",
  require("./routes/uploadRoutes")
);

app.use(
  "/api/rag",
  require("./routes/ragRoutes")
);

app.use(
  "/api/interview",
  require("./routes/interviewRoutes")
);
app.use(
"/api/coding",
require("./routes/codingRoutes")
);
app.use(
"/api/resume-analysis",
require(
"./routes/resumeAnalysisRoutes"
)
);
app.use(
  "/api/company",
  require("./routes/companyRoutes")
);
app.use(
  "/api/speech",
  require("./routes/speechRoutes")
);

// Simple health check (useful for deployment platforms)
app.get("/api/health", (req, res) => res.json({ ok: true }));
const PORT =
  process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(
    `Server Running on Port ${PORT} (HTTP + Socket.IO)`
  );
});