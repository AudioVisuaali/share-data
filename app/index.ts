import express from "express";
import { Storage } from "./storage";
import { logger } from "./logger";

const storage = new Storage();
const API_KEY = process.env.API_KEY || "abc123";
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json({ strict: true, limit: "10kb" }));

app.get("/:key", (req, res) => {
  const data = storage.get(req.params.key);
  return res.json(data || {});
});

app.post("/:key/:password", (req, res) => {
  if (req.params.password !== API_KEY) {
    logger.log("Unauthorized attempt with password", req.params.password);
    return res.status(401).send();
  }

  if (typeof req.body !== "object" || Array.isArray(req.body)) {
    logger.log("Bad request body:", req.params.key, ",", req.body);
    return res.status(400).send({ message: "Request body Must be an object" });
  }

  storage.set(req.params.key, req.body);

  return res.status(200).send();
});

const errorHandler: express.ErrorRequestHandler = (err, _req, res, _next) => {
  logger.error(err.stack);
  res.status(400).send("Check your payload");
};

app.use(errorHandler);

app.listen(PORT, function (err) {
  if (err) console.log(err);
  logger.log("Server listening on PORT", PORT);
  logger.log("Server listening with password", API_KEY);
});
