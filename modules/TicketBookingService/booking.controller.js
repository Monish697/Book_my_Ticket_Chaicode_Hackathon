import * as bookingService from "./booking.service.js";
import ApiResponse from "../../common/utils/api-response.js";

const BookSeat = async (req, res) => {
    const seatId = req.params.id;
    const userName =
        req.user?.firstName || req.params.name || req.body?.name || "Anonymous";

    const bookingServiceRes = await bookingService.BookSeat(seatId, userName);

    res.send({ ...bookingServiceRes, seatId, name: userName });
};
export { BookSeat };
