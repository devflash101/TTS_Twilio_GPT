const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
require('dotenv').config();

const PORT = process.env.PORT || 3000;

const routes = require('./src/routes'); // Adjust the path based on your folder structure
app.use('/webhook', routes); // Prefix all routes defined in `routes.js` with '/api'
app.use(express.static('public'));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
/*
FuriousComet729@gmail.com
password007123!@#

+1 214 377 1383

skype
jasonlynn1976@outlook.com
jasonlynn0219


gpt key
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


remote
173.44.141.154
11:11
Administrator
11:11
jasonmichael1115!QQ
*/