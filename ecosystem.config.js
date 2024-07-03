module.exports = {
  apps: [
    {
      name: "wa1",
      script: "app.js",
      env: {
        PORT: 5000, // Specify the port here
        NODE_ENV: "production",
        FOLDER: "wa1",
      },
    },
    {
      name: "wa2",
      script: "app.js",
      env: {
        PORT: 4000, // Specify the port here
        NODE_ENV: "production",
        FOLDER: "wa2",
      },
    },
  ],
};
