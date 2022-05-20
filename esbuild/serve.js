const { build } = require("esbuild");
const chokidar = require("chokidar");
const liveServer = require("live-server");

(async () => {
  const builder = await build({
    bundle: true,
    entryPoints: ["src/index.tsx"],
    incremental: true,
    minify: false,
    outfile: "public/assets/app.js",
  });
  chokidar
    .watch("src/**/*.{ts,tsx}", {
      interval: 0,
    })
    .on("all", () => {
      builder.rebuild();
    });
  liveServer.start({
    open: true,
    port: 3000,
    root: "public",
  });
})().catch(() => process.exit());
