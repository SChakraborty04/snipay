require('dotenv').config();

const app = require('./src/app');
const connectToDB = require('./src/config/db');

const PORT = process.env.PORT || 3001;

connectToDB();


app.listen(PORT, () => {
  console.log('Server is running on port 3000');
});