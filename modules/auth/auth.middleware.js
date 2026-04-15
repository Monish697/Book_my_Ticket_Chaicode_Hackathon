import ApiError from "../../common/utils/api-error.js";

import { getPool } from "../../common/utils/db.config.js";

const authenticate = async (req, res, next) => {
    const name = req.params.name;
    const id = req.params.id;
    const token = req.cookies.token;
    const pool = getPool();
    const client = await pool.connect();
    try {
        const requestedName = req.params.name;

        const token = req.cookies.token;

        if (!token) {
            return res
                .status(401)
                .json({ error: "Unauthorized: Please log in to book a seat." });
        }

        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

        const userId = decoded.id;

        const pool = getPool();

        const userQuery = `
            SELECT * FROM users 
            WHERE id = $1 AND "first name" = $2;
        `;
        const result = await pool.query(userQuery, [userId, requestedName]);

        if (result.rows.length === 0) {
            return res.status(403).json({
                error: "Forbidden: The name provided does not match the logged-in user.",
            });
        }

        req.user = result.rows[0];
        next();
    } catch (error) {
        res.status(401).json({
            error,
        });
    } finally {
        client.release();
    }
};

export { authenticate };
