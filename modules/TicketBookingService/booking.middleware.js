import { authenticate } from "../auth/auth.middleware.js";

const checkLoggedIn = async (req, res, next) => {
    try {
        await authenticate(req, res, () => {
            next();
        });
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Authentication required. Please log in to book seats.",
            error: error.message,
        });
    }
};

export { checkLoggedIn };
