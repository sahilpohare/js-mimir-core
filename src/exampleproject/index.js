const express = require("express");

let app = express();

app.get('/', (req,res)=>{
    res.send('Hii Yuraj');
});

app.listen(3000,console.log('Jingling on 3000'))