// import { NextFunction,Request,Response } from "express";
// import Joi from "joi";


// const validateRegisterSchema = Joi.object({
//   fullname: Joi.string().min(4).max(15).required(),
//   fatherName: Joi.string().min(4).max(15).required(),
//   motherName: Joi.string().min(4).max(15).required(),
//   address: Joi.string().min(3).max(15).required(),
//   gender: Joi.string().valid("male", "female").required(),
//   fatherContact: Joi.string().length(10).pattern(/^[0-9]+$/).required(),
//   studentContact: Joi.string().length(10).pattern(/^[0-9]+$/).required(),
//   level: Joi.string(),
//   email: Joi.string().email({ tlds: { allow: false } }).required(),
//   password: Joi.string()
//     .min(8)
//     .max(30)
//     .pattern(new RegExp("^[a-zA-Z0-9@#$%^&+=!]+$"))
//     .required()
//     .messages({
//       'string.pattern.base': 'Password can only contain letters, numbers, and special characters',
//       'string.min': 'Password must be at least 8 characters',
//       'string.max': 'Password must not exceed 30 characters',
//     }),
// }).unknown(true);

// const validate = async (req: Request, res: Response,next:NextFunction): Promise<void> => {
//     try {
//         await validateRegisterSchema.validateAsync(req.body)
//         next()
//     } catch (error:any) {
//         res.status(500).json({
//             message: "Validation Error In Server",
//             error: error.details?.[0]?.message || "Invalid input"
//         })
//     }
// }

// export { validate }
