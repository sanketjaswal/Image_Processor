import express from "express";
import cors from "cors";
import imageroutes from "./routes/imageroutes.js";

const PORT = 5000;
const server = express();

// server.use(
//   cors({ origin: "http://localhost:3000", optionsSuccessStatus: 200 })
// );

server.use(
  cors({
    origin: "https://image-processor-b2u8.onrender.com",
    optionsSuccessStatus: 200,
  })
);

server.use("/api", imageroutes);

server.listen(PORT || 5000, () =>
  console.log(`Server running on port ${PORT}`)
);
