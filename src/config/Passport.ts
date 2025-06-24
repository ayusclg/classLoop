import { Request } from "express";
import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import { Student } from "../models/Student";
import dotenv from 'dotenv'
dotenv.config()

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID || "",
      clientSecret: process.env.CLIENT_SECRET || "",
      callbackURL: "/auth/google/callback",
      passReqToCallback: true,
    },
    async (
      req: Request,
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: (error: any, user?: Express.User | false, info?: any) => void
    ) => {
      try {
        let student = await Student.findOne({ googleId: profile.id });

        if (!student) {
          student = await Student.create({
           googleId: profile.id,
            fullname: profile.displayName,
            email: profile.emails?.[0]?.value || "",
            profilePicture: profile.photos?.[0]?.value || "",
          });
        }
        return done(null, student);
      } catch (error) {
        return done(error);
      }
    }
  )
);
