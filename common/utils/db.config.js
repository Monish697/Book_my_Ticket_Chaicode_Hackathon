import pg from "pg";

let pool = null;

export const getPool = () => {
    if (!pool) {
        pool = new pg.Pool({
            connectionString: process.env.POSTGRES_URI,
            ssl: {
                require: true,
            },
            max: 20,
            connectionTimeoutMillis: 0,
            idleTimeoutMillis: 30000,
        });

        pool.on("connect", (client) => {
            console.log("New client connected to the database");
        });

        pool.on("error", (err, client) => {
            console.error("Unexpected error on idle client", err);
            process.exit(-1);
        });
    }
    return pool;
};
