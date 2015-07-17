var express = require('express'),
  mongoskin = require('mongoskin'),
  bodyParser = require('body-parser')
  logger = require('morgan')

var app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(logger('dev'))

var db = mongoskin.db('mongodb://@localhost:27017/products', {safe:true})

app.get('/', function(req, res, next) {
  res.json({msg: 'Welcome to products API 1.0. Please specify a method name.'})
})

app.get('/products', function(req, res, next) {
  db.collection("products").find({} ,{limit: 10, sort: {'id': 1}}).toArray(function(e, results){
    if (e) return next(e)
    res.send(results)
  })
})

app.post('/products', function(req, res, next) {
  db.collection("products").insert(req.body, {}, function(e, results){
    if (e) return next(e)
    res.send(results)
  })
})

app.get('/products/:id', function(req, res, next) {
  db.collection("products").findById(req.params.id, function(e, result){
    if (e) return next(e)
    res.send(result)
  })
})

app.put('/products/:id', function(req, res, next) {
  db.collection("products").updateById(req.params.id, {$set: req.body}, {safe: true, multi: false}, function(e, result){
    if (e) return next(e)
    res.send((result === 1) ? {msg:'success'} : {msg: 'error'})
  })
})

app.delete('/products/:id', function(req, res, next) {
  db.collection("products").removeById(req.params.id, function(e, result){
    if (e) return next(e)
    res.send((result === 1)?{msg: 'success'} : {msg: 'error'})
  })
})

app.listen(3000, function(){
  console.log('API server listening on port 3000')
})
