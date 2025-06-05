import jwt from "jsonwebtoken";
import { Response } from "express";
import { CookieOptions } from "express";
import { IUserDocument } from "@modules/user/types";

const generateToken = (user: IUserDocument): string => {
    if (!user._id) throw new Error("User._id no está definido");
    if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET no está definido en las variables de entorno");
    return jwt.sign({ id: user._id.toString() }, process.env.JWT_SECRET!, {
        expiresIn: "7d"
    });
};

const generateCookieOptions = (): CookieOptions => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
});

export const setToken = (res: Response, user: IUserDocument) => {
    const token = generateToken(user);
    res.cookie("token", token, generateCookieOptions());
    console.log("Cookie establecida");
};
