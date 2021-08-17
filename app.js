const express = require('express');
const app = express();
const path = require('path');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.listen('3000',()=>{
    console.log("They are taking the hobits to port 3000!")
})

app.get('/', (req,res)=>{
    res.send("Hello from the shire!")
})