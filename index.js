require('dotenv').config();
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const body_parser = require('body-parser');
const corsLib = require('./server/libs/corsLib');
const config = require('config');
const user = require("./server/routes/users");
const issue = require("./server/routes/issues");
const attachment = require("./server/routes/attachments");
const comment = require("./server/routes/comments");


const app = express();

app.use(express.json());
app.use(body_parser.urlencoded({extended:false}));

app.use(corsLib);

app.use("/user",user);
app.use("/issue",issue);
app.use("/attachment",attachment);
app.use("/comment",comment);



mongoose.connect(config.get("mongodbUrl"),{useNewUrlParser:true,useCreateIndex:true,useUnifiedTopology:true})
    .then(()=>{console.log("db connected Successfully")})
    .catch((err)=>{console.log(err)});

const server = http.createServer(app);

server.listen(config.get("port"),()=>{
    console.log("listening on 3000");
    
});

