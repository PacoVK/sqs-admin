const esbuild = require("esbuild");

esbuild
  .build({
    entryPoints: ["./frontend/index.js"],
    outfile: "./public/assets/app.js",
    minify: true,
    bundle: true,
    loader: {
      ".js": "jsx",
    },
    define: {
      "process.env.REACT_APP_VERSION": '"v0.6.0"',
    },
  })
  .catch(() => process.exit(1));
