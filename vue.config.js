module.exports = {
  configureWebpack: {
    devtool: "source-map",
    devServer: {
      allowedHosts: [
        ".githubpreview.dev",
      ],
    },
  },
};
