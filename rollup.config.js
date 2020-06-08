import babel from 'rollup-plugin-babel';

module.exports = {
    input: 'src/wheel-zoom.js',
    output: {
        file: 'dist/wheel-zoom.js',
        format: 'umd',
        name: 'WZoom'
    },
    plugins: [
        babel()
    ],
    watch: {
        clearScreen: false
    }
};
