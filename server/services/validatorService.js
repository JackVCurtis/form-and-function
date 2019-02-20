const pool = require('./db.js');
const ValidatorService = require('../../shared/validatorService.js');

module.exports = new ValidatorService({
    isUnique: async function (value, table, field) {
        const result = await pool.query(`SELECT * FROM ${table} WHERE ${field} = $1 LIMIT 1`, [value]);
        return result.rows.length == 0;
    },

    isUniqueOrMatches: async function (uniqueValue, table, uniqueField, matchingField, matchingFieldValue) {
        const result = await pool.query(`SELECT * FROM ${table} WHERE ${uniqueField} = $1 LIMIT 1`, [uniqueValue]);
        return result.rows.filter((row) => row[matchingField] != matchingFieldValue) == 0;
    }
})