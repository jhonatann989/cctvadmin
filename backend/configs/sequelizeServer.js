const server = {
    params : {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT
    },
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD
}

module.exports = server