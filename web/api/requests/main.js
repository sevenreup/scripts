const express = require("express");

const app = express();

app.all("/*", (req, res) => {
  console.log(req);
  console.log(`${req.method} ${req.originalUrl}`);
  for (const h in req.headers) {
    console.log(`\t ${h}:${req.headers[h]}`);
  }

  res.status(404).send();
});

app.listen(8585, (err) => {
  if (err) {
    console.error(err);
    return;
  }
    console.log("Listening on http://localhost:8585");
});