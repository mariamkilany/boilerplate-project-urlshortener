require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
var bodyParser = require('body-parser')
const dns = require('dns');
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
var jsonParser = bodyParser.json()
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
let map1 = new Map()
let map2 = new Map()
let index= 1;
app.post('/api/shorturl',urlencodedParser,function(req, res) {
  var expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
var regex = new RegExp(expression);
  if(!map1.has(req.body.url)&&req.body.url.match(regex)){
        map1.set(req.body.url,index);
        map2.set(index,req.body.url)
        index++;
  }
if(!req.body.url.match(regex)){
  res.json({error: 'invalid url'})
}
  res.json({original_url : req.body.url ,         
  short_url:map1.get(req.body.url)})
  
});

app.get('/api/shorturl/:short',(req,res)=>{
  // console.log(map2.get(parseInt(req.params.short)))
  res.redirect(map2.get(parseInt(req.params.short)))
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
