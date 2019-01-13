module.exports = {
    dbUrl: 'mongodb://localhost:27017/novel',
    port: process.env.NODE_ENV === 'production' ? 80 : 8080,
    key: 'novel'
};
