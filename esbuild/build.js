const esbuild = require("esbuild");

esbuild
  .build({
    entryPoints: ["./src/index.js"],
    outfile: "./public/assets/app.js",
    minify: true,
    bundle: true,
    loader: {
      ".js": "jsx",
    },
  })
  .catch(() => process.exit(1));
