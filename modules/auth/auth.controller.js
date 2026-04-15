import bcrypt from "bcryptjs";
import { generateAccessToken } from "../../common/utils/jwt.utils.js";
import { getPool } from "../../common/utils/db.config.js";

const register = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    const pool = getPool();
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const hashedPassword = await bcrypt.hash(password, 12);

        const insertUserQuery = `
            INSERT INTO users ("first name", last_name, email, password)
            VALUES ($1, $2, $3, $4)
            RETURNING id;
        `;

        const userResult = await client.query(insertUserQuery, [
            firstName,
            lastName,
            email,
            hashedPassword,
        ]);

        const newUserId = userResult.rows[0].id;

        const accessToken = generateAccessToken({ id: newUserId });

        await client.query("COMMIT");
        console.log("Success! User created.");

        res.cookie("token", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        res.status(201).json({
            success: true,
            message: "Registration successful",
            token: accessToken,
            userId: newUserId,
        });
    } catch (error) {
        await client.query("ROLLBACK");
        console.error("Transaction failed. Rolled back all changes:", error);

        if (error.code === "23505") {
            return res
                .status(400)
                .json({ error: "A user with this email already exists." });
        }

        res.status(500).json({
            error: "Registration failed",
            details: error.message,
        });
    } finally {
        client.release();
    }
};

const login = async (req, res) => {
    let { email, password } = req.body;
    const pool = getPool();
    const client = await pool.connect();
    try {
        const result = await client.query(
            'SELECT id, "first name" AS first_name, last_name, email, password FROM users WHERE email = $1',
            [email],
        );
        const user = result.rows[0];
        if (!user) {
            return res.status(400).json({ error: "Invalid email or password" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        const accessToken = generateAccessToken({ id: user.id });

        res.json({
            message: "Login successful",
            token: accessToken,
            user: {
                id: user.id,
                firstName: user.first_name,
                lastName: user.last_name,
                email: user.email,
            },
        });
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ error: "Internal Server Error" });
    } finally {
        client.release();
    }
};

export { register, login };
