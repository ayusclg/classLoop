import mongoose from "mongoose";
import  Jwt  from "jsonwebtoken";

export interface Istudent extends Document{
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
    required:true,
  },
  level: {
    type: String,
    require: true,
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
  }

})
studentSchema.methods.generateRefreshToken = function () {
  if (!process.env.REFRESH_TOKEN_SECRET || !process.env.REFRESH_TOKEN_EXPIRY) {
    console.log("No Credentials Found For Refresh Token")
  }
  return Jwt.sign({
    _id: this._id,
   
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

studentSchema.index({email:1,})
export const Student = mongoose.model<Istudent>("Student",studentSchema)