const express = require('express');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

const supportMeta = require('../middleware/supportMeta');
const AccountService = require('../services/accountService');

dotenv.config();
const accountRouter = express.Router();

accountRouter.route('/accounts')
    .post(supportMeta({
            validations: [
                {fields: ["email"], validators: ["isUnique:accounts,email", "exists", "isEmailFormat"], endpoint: "POST /api/accounts"},
                {fields: ["name"], validators: ["exists"]},
                {fields: ["password"], validators: ["exists", "isSecurePass"]},
                {fields: ["password", "confirmPassword"], validators: ["matches"]}
            ]
        }),
        async function(req, res) {
            try {
                const account = await AccountService.create(req.body);
                const token = jwt.sign({sub: account.id}, process.env.JWT_SECRET);
                res.cookie('authorization',token);
                res.json(account);            
            } catch (error) {
                res.status(500).send(error);
            }
        }
    );

accountRouter.use('/accounts/:id', async function(req, res, next) {
    if (req.user.sub != req.params.id) {
        res.status(401).send({});
    } else {
        next();
    }
})
accountRouter.route('/accounts/:id')
    .get(async function(req, res) {
        try {
            const account = await AccountService.get(req.params.id);
            res.json(account);
        } catch (error) {
            res.status(error.status).send(error);
        }
    })
    .put(
        async function(req, res) {
            try {
                const account = await AccountService.update(req.params.id, req.body);
                res.json(account);
            } catch (error) {
                res.status(error.status).send(error);
            }
        }
    )
    .delete(async function(req, res) {
        try {
            const account = await AccountService.delete(req.params.id);
            res.json(account);
        } catch (error) {
            res.status(error.status).send(error);
        }
    });

module.exports = accountRouter;