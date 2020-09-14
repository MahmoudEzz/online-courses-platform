const express =  require('express');
const cors = require('cors');
// connect to db
require('./db/mongoose');

// Routers require
const userRouter = require('./routers/user');
const categoryRouter = require('./routers/category');
const courseRouter = require('./routers/course');

const app = express();
app.use(cors());
app.use(express.json());

// Routers use
app.use(userRouter);
app.use(categoryRouter);
app.use(courseRouter);

// 404 route 
app.get('*', (req, res)=>{
    res.status(404).send('404 Page not found');
})

module.exports = app;