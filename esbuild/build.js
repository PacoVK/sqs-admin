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
  })
  .catch(() => process.exit(1));
