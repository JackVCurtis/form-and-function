const express = require('express');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

const AccountService = require('../services/AccountService');
const supportMeta = require('../middleware/supportMeta');

const loginRouter = express.Router();
dotenv.config();

loginRouter.route('/login')
    .put(
        supportMeta({
            validations: [
                {
                    fields: ["email"], 
                    validators: ["exists", "isEmailFormat"],
                    messages: ["An email is required", "Please enter a valid email"]
                },
                {fields: ["password"], validators: ["exists"], messages: ["A password is required"]},
            ]               
        }),
        async function(req, res) {
        try {
            const account = await AccountService.login(req.body.email, req.body.password);
            if (account) {
                const token = jwt.sign({sub: account.id}, process.env.JWT_SECRET);
                res.cookie('authorization',token);
                res.sendStatus(200);
            } else {
                res.status(401).send(new Error("Invalid password"))
            }
        } catch (error) {
            console.log(error);
            res.status(404).send(new Error("Account not found"));
        }
    });

module.exports = loginRouter;