const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/biosamples',
        createProxyMiddleware({
            target: 'https://wwwdev.ebi.ac.uk/',
            changeOrigin: true,
        })
    );
};
