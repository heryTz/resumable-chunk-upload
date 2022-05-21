import { buildSync } from "esbuild"

const isProd = process.env.NODE_ENV === 'prod'

if (isProd) {
    buildSync({
        entryPoints: ['src/index.js'],
        bundle: true,
        minify: true,
        outfile: `dist/uploader.min.js`
    })
}

if (!isProd) {
    buildSync({
        entryPoints: ['src/index.js'],
        bundle: true,
        outfile: 'dist-dev/uploader.js'
    })
}