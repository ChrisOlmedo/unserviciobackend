import jwt from "jsonwebtoken";
import { Response } from "express";
import { CookieOptions } from "express";
import { IUserDocument } from "../models/userModel";

const generateToken = (user: IUserDocument): string => {
    return jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: "7d" });
};

const generateCookieOptions = (): CookieOptions => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
});

export const setAuthCookie = (res: Response, user: IUserDocument) => {
    const token = generateToken(user);
    res.cookie("token", token, generateCookieOptions());
    console.log("Cookie establecida");
};
