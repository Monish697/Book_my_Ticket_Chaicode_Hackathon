import * as bookingService from "./booking.service.js";
import ApiResponse from "../../common/utils/api-response.js";

const getAllSeat = async (req, res) => {
    const rows = await bookingService.getAllSeat();
    ApiResponse.ok(res, "Seats loaded successfully", rows);
};
const BookSeat = async (req, res) => {
    const seatId = req.params.id;
    const userName =
        req.user?.firstName || req.params.name || req.body?.name || "Anonymous";

    const bookingServiceRes = await bookingService.BookSeat(seatId, userName);

    res.send({ ...bookingServiceRes, seatId, name: userName });
};
export { getAllSeat, BookSeat };
