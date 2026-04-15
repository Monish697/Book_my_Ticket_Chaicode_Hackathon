import { getPool } from "../../common/utils/db.config.js";

const BookSeat = async (seatId, userName) => {
    const pool = getPool();
    const client = await pool.connect();
    try {
        const id = seatId;
        const name = userName;

        await client.query("BEGIN");

        const sql =
            "SELECT * FROM seats WHERE id = $1 AND is_booked = FALSE FOR UPDATE";
        const result = await client.query(sql, [id]);

        if (result.rows.length === 0) {
            await client.query("ROLLBACK");
            return { error: "Seat is already booked or does not exist" };
        }
        //if we get the row, we are safe to update
        const sqlU = "update seats set is_booked=TRUE, name=$2 where id = $1";
        const updateResult = await client.query(sqlU, [id, name]); // Again to avoid SQL INJECTION we are using $1 and $2 as placeholders

        await client.query("COMMIT");
        return { success: true, message: "Seat booked successfully" };
    } catch (error) {
        await client.query("ROLLBACK");
        console.error(error);
        return { error: "Failed to book seat" };
    } finally {
        client.release();
    }
};

export { BookSeat };
