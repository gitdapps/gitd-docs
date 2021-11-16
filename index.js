const express = require("express");
const axios = require("axios");
const path = require("path");
const PORT = process.env.PORT || 5000;

const clientId = "6cec68d5949ad85f6574";
const clientSecret = "d833631e1f58f05def37c1b03027f5f6c382e900";

express()
  .use(express.static(path.join(__dirname, "dist")))

  .get("/github-access-token", (req, res) => {
    const body = {
      client_id: clientId,
      client_secret: clientSecret,
      code: req.query.code,
    };
    const opts = { headers: { accept: "application/json" } };

    axios
      .post("https://github.com/login/oauth/access_token", body, opts)
      .then((res) => res.data["access_token"])
      .then((githubAccessToken) => {
        res.json({ githubAccessToken });
      })
      .catch((err) => res.status(400).json({ message: err.message }));
  })

  .listen(PORT, () => console.log(`Listening on ${PORT}`));
