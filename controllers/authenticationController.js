import express from "express";
const app = express();

import Jwt from 'jsonwebtoken';
const { jwt } = Jwt;

import { loginMdl } from '../models/authenticationModel.js'
import { createUserMdl } from '../models/authenticationModel.js'


export const LoginAppCtrl = function (req, res) {
  const { userEmail, Password } = req.body;

  loginMdl({ userEmail, Password }, (err, results) => {
    if (err) {
      return res
        .status(400)
        .json({ status: 400, message: "Not able to process the request, please try again" });
    }
    if (!results.length) {
      return res
        .status(404)
        .json({ status: 404, message: "Email/Mobile number not exist" });
    }

    const user = results[0];
    const validPass = Password === user.password;
    if (!validPass) {
      return res
        .status(400)
        .json({ status: 400, message: "Invalid password" });
    }

    // Use the numeric user.id as the JWT subject
    const payload = { subject: user.id };
    const secretKey = process.env.SecretKey;
    const token = Jwt.sign(payload, secretKey, { expiresIn: "3h" });

    // Return the token and any needed user data
    return res.json({
      status: 200,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        userName: user.userName,
        email: user.email
      }
    });
  });
};



export const createUserCtrl = (req, res) => {
    const userData = req.body;

    createUserMdl(userData, (err, results) => {
        if (err) {
            if (err.message === "Email already exists") {
                res.status(400).json({ status: 400, message: "Email already exists" });
            } else if (err.message === "Username already exists") {
                res.status(400).json({ status: 400, message: "Username already exists" });
            } else {
                res.status(500).json({ status: 500, message: "Internal server error" });
            }
        } else {
            res.status(201).json({ status: 201, message: "User registered successfully" });
        }
    });
};