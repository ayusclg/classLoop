import mongoose from "mongoose";
import  Jwt  from "jsonwebtoken";

export interface Istudent {
  googleId?: string,
  linkedinId?: string,
  fullname: string,
  email: string,
  bio: string,
  level: string,
  password:string,
  college: mongoose.Types.ObjectId,
  profilePicture?: string,
  address: string,
  generateRefreshToken(): string,
  generateAccessToken(): string,
  refreshToken:string,
}

const studentSchema = new mongoose.Schema({
  googleId: {
    type:String,
  },
  linkedinId: {
    type: String,
  },
  fullName: {
    type: String,
    required:true,
  },
  password: {
          type:String,
          required:true,
      },
  email: {
    type: String,
    required: true,
    unique:true,
  },
  bio: {
    type: String,
    
  },
  level: {
    type: String,
    
  },
  college: {
    type: mongoose.Types.ObjectId,
    ref:"College",  
    },
  address: {  
    type: String,
  },
  profilePicture: {
    type: String,
  },
  refreshToken: {
    type:String,
  },
  isStudent: {
    type: Boolean,
    default:true,
  }
})
studentSchema.methods.generateRefreshToken = function () {
  if (!process.env.REFRESH_TOKEN_SECRET || !process.env.REFRESH_TOKEN_EXPIRY) {
    console.log("No Credentials Found For Refresh Token")
  }
  return Jwt.sign({
    _id: this._id,
    role:"student"
   
  }, process.env.REFRESH_TOKEN_SECRET as string, {
    expiresIn:process.env.REFRESH_TOKEN_EXPIRY as any
  })
}

studentSchema.methods.generateAccessToken = function () {
  if (!process.env.ACCESS_TOKEN_SECRET || !process.env.ACCESS_TOKEN_EXPIRY) {
  console.log("No Credentials Found For Access Token")
}
  return Jwt.sign({
    _id: this._id,
    email: this.email,
    fullname: this.fullname,
    role:"student"
  }, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn:process.env.ACCESS_TOKEN_EXPIRY as any
  })
}


export const Student = mongoose.model<Istudent>("Student",studentSchema)