import { getPool } from "../../common/utils/db.config.js";
import { verifyAccessToken } from "../../common/utils/jwt.utils.js";

const authenticate = async (req, res, next) => {
    const pool = getPool();
    const client = await pool.connect();
    try {
        const authHeader = req.headers.authorization || req.headers.Authorization;
        const bearerToken =
            typeof authHeader === "string" && authHeader.startsWith("Bearer ")
                ? authHeader.slice("Bearer ".length).trim()
                : null;
        const token = bearerToken || req.cookies?.token;

        if (!token) {
            return res
                .status(401)
                .json({ error: "Unauthorized: Please log in to book a seat." });
        }

        const decoded = verifyAccessToken(token);

        const userId = decoded.id;

        const userQuery = `
            SELECT * FROM users 
            WHERE id = $1;
        `;
        const result = await client.query(userQuery, [userId]);

        if (result.rows.length === 0) {
            return res.status(401).json({ error: "Unauthorized: User not found." });
        }

        const row = result.rows[0];
        req.user = {
            id: row.id,
            firstName: row["first name"],
            lastName: row.last_name,
            email: row.email,
        };
        next();
    } catch (error) {
        res.status(401).json({ error: "Unauthorized: Invalid or expired token." });
    } finally {
        client.release();
    }
};

export { authenticate };
