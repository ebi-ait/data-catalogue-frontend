const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/biosamples',
        createProxyMiddleware({
            target: 'https://www.ebi.ac.uk/',
            changeOrigin: true,
        })
    );
};
