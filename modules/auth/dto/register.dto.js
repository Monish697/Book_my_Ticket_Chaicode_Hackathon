import Joi from "joi";
import BaseDto from "../../../common/dto/base.dto.js";

class RegisterDto extends BaseDto {
    static schema = Joi.object({
        firstName: Joi.string().trim().min(2).max(50).required(),
        lastName: Joi.string().trim().min(2).max(50),
        email: Joi.string().email().lowercase().required(),
        password: Joi.string().min(8).required(),
    });
}

export default RegisterDto;
