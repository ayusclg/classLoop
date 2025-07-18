import { Student } from "../models/Student";
import apiError from "../utils/ApiError";
import { asyncHandler } from "../utils/AsyncHandler";
import { Request, Response } from "express";
import bcrypt from 'bcrypt'
import apiResponse from "../utils/ApiRes";
import { uploadImage } from "../middlewares/fileUpload";
import { filterQuery } from "../utils/filterJson";



const studentCreate = asyncHandler(async (req: Request, res: Response):Promise<void> => {
    console.log(req.body)
    const { fullName, password, email } = req.body
    
    const studentExist = await Student.findOne({ email, })
    if (studentExist) throw new apiError(403, "Permission Denied")
    
    const hashedPW = await bcrypt.hash(password, 10) 
    
    const studentCreate = await Student.create({
        fullName,
        password:hashedPW,
        email,
    })
    if (!studentCreate) throw new apiError(400, "Student Not Created")
    
    const createdStudent = await Student.findById(studentCreate._id).select("-password")
    if(!createdStudent) throw new apiError(500,"Server Error")
    res.status(201).json(new apiResponse(201,createdStudent,"New Student Created"))
})

const studentLogin = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body
 
    const studentExist = await Student.findOne({ email, })
    if (!studentExist) {
        throw new apiError(401,"Unauthorized! Please Create Account")
    }
    const checkPW = bcrypt.compare(password, studentExist.password)
    if (!checkPW) throw new apiError(404, "Password Invalid")
    
    
    const accessToken = studentExist.generateAccessToken()
    const refreshToken = studentExist.generateRefreshToken()
    studentExist.refreshToken = refreshToken
    await studentExist.save()

    const loggedInUser = await Student.findById(studentExist._id).select("-password -refreshToken")
    if(!loggedInUser) {throw new apiError(400,"Server Error")}
    const options = {
        httpOnly: true,
        secure:false,
    }

    res.cookie("accessToken",accessToken,options)
    res.cookie("refreshToken", refreshToken, options)
    res.status(200).json(new apiResponse(200,{loggedInUser,accessToken,refreshToken},`welcome to ClassLoop`))
})

const getMyDetails = asyncHandler(async (req: Request, res: Response):Promise<void> => {
    const user = req.userId
    if(!user) throw new apiError(401,"User Not Logged")
    const dbStd = await Student.findById(user).select("-password -refreshToken").lean()
    if (!dbStd) throw new apiError(401, "Please Create Your Account")
    res.status(200).json(new apiResponse(200,dbStd,"Details Fetched Successfully"))
})

const getStudentById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  
    const studentFetched = await Student.findById(req.params.id).select("-password -refreshToken").lean()
    if (!studentFetched) throw new apiError(404, "User Not Found")
    res.status(200).json(new apiResponse(200,studentFetched,"Student Fetched Successfully"))
})

const logout = asyncHandler(async (req: Request, res: Response):Promise<void> => {
    res.clearCookie("refreshToken", {
        httpOnly:true,
        secure:false,
    })
    res.clearCookie("accessToken", {
        httpOnly:true,
        secure:false,
    })
    res.status(200).json(new apiResponse(200,{},"User Logout Successfully"))
    
})

const addOrUpdateProfile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const file = req.file as Express.Multer.File
    const uploadCloud = await uploadImage(file)
    const studentProfileCheck = await Student.findById(req.userId) 
    if (studentProfileCheck) {
        if (studentProfileCheck.profilePicture == null) {
            console.log("aayush")
            await Student.findByIdAndUpdate(req.userId, {
                $set: {
                    profilePicture: uploadCloud
                }
            })
        }
        else {   
            studentProfileCheck.profilePicture = uploadCloud
        }
    }
    else {
        throw new apiError(404,"User Not Found")
        
    }
    res.status(200).json(new apiResponse(200,studentProfileCheck,"Profile Picture Updated"))
})

const deleteAccount = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const deleteUser = await Student.findByIdAndDelete(req.userId)
    if (!deleteUser) throw new apiError(500, "Server Error In Deleting User")
    
    res.clearCookie("refreshToken",{httpOnly:true,secure:false})
    res.clearCookie("accessToken", { httpOnly: true, secure: false })
    
    res.status(200).json(new apiResponse(200,{},"Please Create New Account Soon"))
})

const addMyDetails = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { address, bio } = req.body
    const studentExist = await Student.findById(req.userId)
    if (!studentExist) throw new apiError(401, "Unauthorized")
    
    if (address) studentExist.address = address;
    if (bio) studentExist.bio = bio;
    await studentExist.save()

    res.status(200).json(new apiResponse(200,studentExist,"Details Added"))
})

const searchStudent = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const filter = req.query.filter as string || ""
   
    const sortOption = req.query.filter  as string || "fullName"
    const page = parseInt(req.query.page as string) || 1

    const query: Record<string, any> = filter ? filterQuery(filter) : { field: "empty", value: null }

    const documentExist = await Student.countDocuments(query)
    if (documentExist === 0)
    {
        throw new apiError(404,"No Student Results Found")
    }
    
    const perPage = 10
    const skip = (page - 1) * perPage
    
    const result = await Student.find(query).sort({ [sortOption]: 1 }).select("-password -refreshToken").skip(skip).limit(perPage).lean()
    const totalResult = documentExist

    const resultObj = {
        result,
        totalResult,
        page,
        skip,
    }
    res.status(200).json(new apiResponse(200,resultObj,"Search Item Fetched Successfully"))
        
})
export {studentCreate,studentLogin,getMyDetails,getStudentById,logout,deleteAccount,addOrUpdateProfile,addMyDetails,searchStudent}                