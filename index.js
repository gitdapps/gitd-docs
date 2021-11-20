const express = require("express");
const axios = require("axios");
const path = require("path");
const PORT = process.env.PORT || 5000;

const clientId = "6cec68d5949ad85f6574";
const clientSecret = "d833631e1f58f05def37c1b03027f5f6c382e900";

express()
  .use(express.static(path.join(__dirname, "dist")))

  .get("/github-access-token", async (req, res) => {
    console.log("entering github-access-token");
    const body = {
      client_id: clientId,
      client_secret: clientSecret,
      code: req.query.code,
    };
    const opts = { headers: { accept: "application/json" } };

    try {
      const ghResponse = await axios.post(
        "https://github.com/login/oauth/access_token",
        body,
        opts
      );

      const {
        data: { access_token: gitHubAccessToken },
      } = ghResponse;

      if (!gitHubAccessToken) {
        throw gitHubAccessToken;
      }

      res.status(200).json({ gitHubAccessToken });
    } catch (err) {
      res.status(400).send();
    }
  })

  .listen(PORT, () => console.log(`Listening on port ${PORT}`));
