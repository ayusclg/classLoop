import { Request,Response } from "express";
import { asyncHandler } from "../utils/AsyncHandler";
import apiResponse from "../utils/ApiRes";
import apiError from "../utils/ApiError";
import { Istudent } from "../models/Student";

export const googleCallback = asyncHandler(async (req: Request, res: Response): Promise<void>=> {
    const user = req.user as Istudent
    if(!user) throw new apiError(404,"User Not Found In Google Callback")

    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    res
        .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure:false,
    })
        .cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
    })

    res.status(200).json(new apiResponse(200, { user, accessToken, refreshToken }, "User Logged In "))
      
        


})