const pool = require('./db.js');
const ValidatorService = require('../../shared/validatorService.js');

module.exports = new ValidatorService({
    isUnique: async function (value, table, field) {
        const result = await pool.query(`SELECT * FROM ${table} WHERE ${field} = $1 LIMIT 1`, [value]);
        return result.rows.length == 0;
    }
})