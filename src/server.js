const express = require('express');
const next = require('next');
const mongoose = require('mongoose');
const path = require('path');
const { parse } = require('url');
const cluster = require('cluster');

const numCPUs = require('os').cpus().length;

const dev = process.env.NODE_ENV !== 'production';
const { port, dbUrl } = require('./server/config/index.js');

async function App(dev, port) {
    const app = next({ dir: path.resolve(__dirname, './client'), dev });
    const handle = app.getRequestHandler();

    await Promise.all([
        app.prepare(),
        mongoose.connect(
            dbUrl,
            { useNewUrlParser: true }
        )
    ]);

    const server = express();

    // service-worker
    server.use((req, res, next) => {
        const parsedUrl = parse(req.url, true);
        const { pathname } = parsedUrl;
        if (pathname === '/service-worker.js') {
            const filePath = path.join(__dirname, './client/.next', pathname);
            app.serveStatic(req, res, filePath);
            return;
        }
        next();
    });

    // middlewares
    require('./server/middlewares')(server);

    // graphql
    require('./server/graphql')(server, dev);

    server.get('*', (req, res) => {
        return handle(req, res);
    });

    server.listen(port, (err) => {
        if (err) throw err;
        if (dev) {
            console.log(`> Ready on http://localhost:${port}`);
            console.log(`> Ready on http://localhost:${port}/graphql`);
        }
    });
}

if (!dev) {
    if (cluster.isMaster) {
        for (let i = 0; i < numCPUs; i++) {
            cluster.fork();
        }
        cluster.on('exit', (worker, code, signal) => {
            console.log(`工作进程 ${worker.process.pid} 已退出`);
            cluster.fork();
        });
    } else {
        App(false, port);
        console.log(`工作进程 ${process.pid} 已启动`);
    }
} else {
    App(true, port);
}
