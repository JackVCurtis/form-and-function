const express = require('express');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

const validateWith = require('../middleware/validateWith');
const describeWith = require('../middleware/describeWith');
const filterMetaRequest = require('../middleware/filterMetaRequest');
const AccountService = require('../services/accountService');

dotenv.config();
const accountRouter = express.Router();

accountRouter.route('/accounts')
    .post(        
        validateWith(AccountService.create.validate),
        describeWith(AccountService.create.describe), 
        filterMetaRequest,
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