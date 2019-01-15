const path = require('path');
const express = require('express');


const publicPath = path.join(__dirname, '../public');
const port = path.env.PORT || 3000;
const app = new express();

app.use(express.static(publicPath));
 

console.log(publicPath);

app.listen(port, ()=>{
    console.log('server running on port '+port);
})