const express = require('express');
const bodyparser = require('body-parser');


const promoRouter = express.Router();

promoRouter.use(bodyparser.json());

promoRouter.route('/')
.all((req,res,next) =>{
 req.statusCode=200;
 res.setHeader('content-type','text/html');
 next();

})

.get((req,res,next) =>{
  res.send('will send all the promos to you');
})

.post((req,res,next) =>{
    res.send('will add the promos' + req.body.name + 'with details'+ req.body.description);
})

.put((req,res,next) =>{
    res.statuscode = 403;
    res.end("put operation not supported in promo");
})

.delete((req,res,next) =>{
    res.send('deleteing all the promos');
});

promoRouter.route('/:promoId')
.all((req,res,next) =>{
 req.statusCode=200;
 res.setHeader('content-type','text/html');
 next();

})

.get((req,res,next) =>{
    res.end("will send details of the promo:" + req.params.promoId);
})

.post((req,res,next) =>{
    res.statuscode = 403;
    res.send("post operation not supported in promo" + req.params.promoId);
})

.put((req,res,next) =>{
    res.write(" updataing the  promo" + req.params.promoId);
    res.end("will update the promo:"+ req.body.name + 'with details' + req.body.description);
})

.delete((req,res,next) =>{
    res.statuscode = 403;
    res.send("deleting  the promos");
});




module.exports = promoRouter;