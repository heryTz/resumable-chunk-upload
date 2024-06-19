import express from "express";
import { resumableChunkUpload } from "rcu-express";

const app = express();
const port = 9000;

app.use(express.static("public"));
app.use(resumableChunkUpload());

app.get("/", (_, res) => {
  res.render("index.html");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
