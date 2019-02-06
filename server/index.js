const express = require('express');
const bodyParser = require('body-parser');
const accountRouter = require('./routers/accounts');

const app = express();

app.use(bodyParser.json());

app.use('/api', accountRouter);

app.use('/*', function(req, res) {
    res.sendFile('index.html', {root: __dirname});
});

app.listen(3000, () => console.log('Form and Function listening on port 3000'));