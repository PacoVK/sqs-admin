import * as esbuild from "esbuild";

const ctx = await esbuild.context({
  bundle: true,
  entryPoints: ["frontend/index.tsx"],
  minify: false,
  outfile: "public/assets/app.js",
});

await ctx.watch();

let { host, port } = await ctx.serve({
  servedir: "public",
  port: 3000,
});
