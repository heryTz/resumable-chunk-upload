import { buildSync } from "esbuild"
import fs from 'fs'

const packages = JSON.parse(fs.readFileSync('package.json').toString())
const isProd = process.env.NODE_ENV === 'prod'

if (isProd) {
    buildSync({
        entryPoints: ['src/index.js'],
        bundle: true,
        minify: true,
        outfile: `dist/uploader-${packages.version}.js`
    })
}

if (!isProd) {
    buildSync({
        entryPoints: ['src/index.js'],
        bundle: true,
        outfile: 'dist-dev/uploader.js'
    })
}