import { build } from "esbuild"

const isProd = process.env.NODE_ENV === 'prod'

build({
    entryPoints: ['uploader.js'],
    bundle: true,
    minify: isProd,
    outfile: 'dist/uploader.min.js'
})
.then(() => {
    console.log('Build')
})