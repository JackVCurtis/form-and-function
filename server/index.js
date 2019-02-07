const express = require('express');
const bodyParser = require('body-parser');
const expressJwt = require('express-jwt');
const dotenv = require('dotenv');
const path = require('path');

const accountRouter = require('./routers/accounts');
const loginRouter = require('./routers/login');
const app = express();

dotenv.config();

app.use(bodyParser.json());

app.use('/static', express.static(path.join(__dirname, 'static')));
app.use('/api', expressJwt({secret: process.env.JWT_SECRET}).unless({path: [
    '/api/login',
    { url: '/api/accounts', methods: ['POST'] }
]}));
app.use('/api', loginRouter);
app.use('/api', accountRouter);

app.use('/*', function(req, res) {
    res.sendFile('/static/index.html', {root: __dirname});
});

app.listen(3000, () => console.log('Form and Function listening on port 3000'));