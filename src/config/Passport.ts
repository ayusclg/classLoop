import { Request } from "express";
import passport from "passport";
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from "passport-google-oauth20";
import { Student } from "../models/Student";
import dotenv from 'dotenv'
dotenv.config()

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID || "",
      clientSecret: process.env.CLIENT_SECRET || "",
      callbackURL: "http://localhost:3000/auth/google/callback",
      passReqToCallback: true,
    },
    async (
      req: Request,
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback,
    ) => {
      try {
        let user = await Student.findOne({ googleId: profile.id });

        if (!user) {
          user = await Student.create({
           googleId: profile.id,
            fullname: profile.displayName,
            email: profile.emails?.[0]?.value || "",
            profilePicture: profile.photos?.[0]?.value || "",
          });
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);



