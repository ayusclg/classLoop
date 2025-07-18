import mongoose from "mongoose";
import Jwt from 'jsonwebtoken'
import { boolean, string } from "joi";

export interface Iteacher extends mongoose.Document{
    fullname: string,
    email: string,
    contact: string,
    password:string,
    education: Record<any, string[]>,
    experienceYear: number,
    profilePicture: string,
    post: mongoose.Types.ObjectId[],
    subjectExpertise: string[]
    generateRefreshToken(): string,
  generateAccessToken(): string,
  refreshToken:string,
}

const teacherSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
    required: true,
    unique: true,
  },
  education: [{
    collegeName: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      required: true,
    },
        
  }],
  experienceYear: {
    type: Number,
    required: true,
  },
  college: [
    {
      type: mongoose.Types.ObjectId,
      ref: "College",
      required: true,
    }
  ],
  profilePicture: {
    type: String,
    required: true,
  },
  posts: [{
    type: mongoose.Types.ObjectId,
    ref: "Post",
  }],
  subjectExpertise: [{
    type: String,
    required: true,
  }],
  refreshToken: {
    type:String,
  },
  isTeacher: {
    type:Boolean,
    default:false
  },
  role: {
    type: String,
    
  }
},
    { timestamps: true })



teacherSchema.methods.generateRefreshToken = function () {
  if (!process.env.REFRESH_TOKEN_SECRET || !process.env.REFRESH_TOKEN_EXPIRY) {
    console.log("No Credentials Found For Refresh Token")
  }
  return Jwt.sign({
    _id: this._id,
    role:"teacher"
   
  }, process.env.REFRESH_TOKEN_SECRET as string, {
    expiresIn:process.env.REFRESH_TOKEN_EXPIRY as any
  })
}

teacherSchema.methods.generateAccessToken = function () {
  if (!process.env.ACCESS_TOKEN_SECRET || !process.env.ACCESS_TOKEN_EXPIRY) {
  console.log("No Credentials Found For Access Token")
}
  return Jwt.sign({
    _id: this._id,
    email: this.email,
    fullname: this.fullname,
    role:"teacher"
  }, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn:process.env.ACCESS_TOKEN_EXPIRY as any
  })
}



teacherSchema.index({ experienceYear: 1, college: 1, fullname: 1 })


export const Teacher =mongoose.model<Iteacher>("Teacher",teacherSchema)