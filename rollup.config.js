const babel = require('@rollup/plugin-babel');

module.exports = {
    input: 'src/wheel-zoom.js',
    output: {
        file: 'dist/wheel-zoom.js',
        format: 'umd',
        name: 'WZoom'
    },
    plugins: [
        babel({
            babelHelpers: 'bundled',
        })
    ],
    watch: {
        exclude: 'node_modules/**',
        clearScreen: false,
        chokidar: {
            usePolling: true
        }
    }
};
