const uuidv4 = require('uuid/v4');
const moment = require('moment');
const bcrypt = require('bcrypt');
const pool = require('./db.js');
const ValidatorService = require('./validatorService');

const AccountService = {
    columns: ["id", "email", "password", "name", "created_date", "modified_date"],
    jsonColumns: ["id", "email", "name", "created_date", "modified_date"],
    updateColumns: ["email", "name"],

    create: async function(account) {
        const queryString = `INSERT INTO accounts (${AccountService.columns.join(", ")})
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
        `
        const values = [
            uuidv4(),
            account.email,
            await bcrypt.hash(account.password, 10),
            account.name,
            moment(new Date()),
            moment(new Date)
        ];

        try {
            const result = await pool.query(queryString, values);
            return AccountService.toJson(result.rows[0]);            
        } catch (error) {
            throw error;
        }
    },

    get: async function(id) {
        const queryString = `SELECT * FROM accounts WHERE id = $1 LIMIT 1`;
        isUuid(id);

        return await AccountService.queryOne(queryString, [id]);
    },

    update: async function(id, account) {
        const oldAccount = await AccountService.get(id);
        const updatedValues = AccountService.updateColumns.map(function(column) { return account[column] || oldAccount[column]; })
        var updateFieldString = "";

        AccountService.updateColumns.forEach(function(column, index){
            updateFieldString += `${column}=$${index + 1}, `;
        });

        updateFieldString += `modified_date=$${AccountService.updateColumns.length + 1}`;

        const updateOneQuery =`UPDATE accounts
          SET ${updateFieldString}
          WHERE id=$${AccountService.updateColumns.length + 2} returning *`;
        const values = updatedValues.concat([moment(new Date()), id]);
        console.log(updateOneQuery, values);
        return await AccountService.queryOne(updateOneQuery, values);
    },

    delete: async function(id) {
        const queryString = `DELETE FROM accounts WHERE id = $1 RETURNING *`;
        isUuid(id);

        return await AccountService.queryOne(queryString, [id]);
    },

    login: async function(email, password) {
        const queryString = `SELECT * FROM accounts WHERE email = $1 LIMIT 1`
        const account = await AccountService.queryOne(queryString, [email], {toJson: false});
        if (account) {
            const match = await bcrypt.compare(password, account.password);
            return match ? account : match;
        } else {
            return false;
        }
    },

    validate: async function(account) {
        const results = await ValidatorService.validate(account, [
            {fields: ["email"], validators: ["isUnique:accounts,email", "exists", "isEmailFormat"]},
            {fields: ["name"], validators: ["exists"]},
            {fields: ["password"], validators: ["exists", "isSecurePass"]},
            {fields: ["password", "confirmPassword"], validators: ["matches"]}
        ]);

        return results;
    },

    toJson: function (account) {
        const accountJson = {};
        AccountService.jsonColumns.forEach(function(column) {
            accountJson[column] = account[column];
        });

        return accountJson;
    },

    queryOne: async function (queryString, values, options) {
        var account;

        try {
            const result = await pool.query(queryString, values);
            account = result.rows[0];
        } catch (dbError) {
            console.log(dbError);
            const error = new Error(`Error retrieving account in routine: ${dbError.routine}`);
            error.status = 500;
            throw error;
        }

        if (!account) { 
            const error = new Error("Account not found");
            error.status = 404;
            throw error;
        }

        if (options && options.toJson == false){
            return account;
        } else {
            return AccountService.toJson(account);            
        }
    }
}

function isUuid(string) {
    const matches = string.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);

    if (!(matches && (matches[0].length == string.length))) {
        const error = new Error("Invalid account ID");
        error.status = 400;
        throw error;
    }
}


module.exports = AccountService;