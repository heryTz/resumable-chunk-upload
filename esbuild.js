import { buildSync } from "esbuild"

buildSync({
    entryPoints: ['uploader.js'],
    bundle: true,
    minify: true,
    drop: ['console', 'debugger'],
    outfile: 'dist/uploader.min.js'
})