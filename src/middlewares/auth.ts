import { NextFunction,Request,Response } from "express";
import apiError from "../utils/ApiError";
import Jwt, { JwtPayload } from "jsonwebtoken";
import { Student } from "../models/Student";
import { Teacher } from "../models/Teacher";


declare global{
    namespace Express{
        interface Request{
            userId?:string |null,
        }
    }
}

export const verifyUser = async (req: Request, res: Response, next: NextFunction) => {

    const token = req.headers.authorization?.startsWith("Bearer") ? req.headers.authorization.split(" ")[1]
        : req.cookies.accessToken
    if (!token) {
            throw new apiError(401,"Please Login")
    }
    try {
        const decode = Jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as JwtPayload
        let user;
        if (decode.role === "student") {
            user = await Student.findById(decode._id).select("-password -refreshToken")
            if (!user) {
                throw new apiError(404,"Student not found")
            }
          req.userId = user._id.toString()
            
        }
        // else {
        //     user = await Teacher.findById(decode._id).select("-passsword -refreshToken")
        //     if (!user) { throw new apiError(404, "Teacher Not Found") }
        //     req.userId = user._id.toString()
        // }
        
        next()
    
    } catch (error) {
        console.log("Error In Verification Of User", error)
        return next(new apiError(401,"Invalid Or Expired Token"))
    }
    
}