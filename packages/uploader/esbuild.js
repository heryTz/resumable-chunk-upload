import { buildSync } from "esbuild"

const isProd = process.env.NODE_ENV === 'prod'

if (isProd) {
    // esm build
    buildSync({
        entryPoints: ['src/index.ts'],
        bundle: true,
        format: 'esm',
        outfile: 'dist/uploader.js'
    })
    
    // bundle build
    buildSync({
        entryPoints: ['src/index.ts'],
        bundle: true,
        minify: true,
        outfile: 'dist/uploader.min.js'
    })
} else {
    
}
