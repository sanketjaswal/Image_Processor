import express from "express";
import cors from "cors";
import imageroutes from "./routes/imageroutes.js";

const PORT = 5000;
const server = express();

// server.use(
//   cors({ origin: "http://localhost:3000", optionsSuccessStatus: 200 })
// );

server.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' https://image-processor-b2u8.onrender.com"
  );
  next();
});

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
