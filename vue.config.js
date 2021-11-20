module.exports = {
  configureWebpack: {
    devtool: "source-map",
    devServer: {
      proxy: {
        "/github-access-token": { target: "http://localhost:5000" },
      },
      allowedHosts: [".githubpreview.dev"],
    },
  },
};
