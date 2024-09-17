import express from "express";
import cors from "cors";
import imageroutes from "./routes/imageroutes.js";
import helmet from "helmet";

const PORT = 5000;
const server = express();

// server.use(
//   cors({ origin: "http://localhost:3000", optionsSuccessStatus: 200 })
// );

server.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:"],
        connectSrc: ["'self'", "https://image-processor-b2u8.onrender.com"],
      },
    },
  })
);

server.use(
  cors({
    origin: "https://image-processor.vercel.app",
    optionsSuccessStatus: 200,
    methods: ["GET", "POST"],
    credentials: true,
  })
);

server.use("/api", imageroutes);

server.listen(PORT || 5000, () =>
  console.log(`Server running on port ${PORT}`)
);
