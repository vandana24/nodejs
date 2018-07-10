const express = require('express');
const bodyparser = require('body-parser');


const dishRouter = express.Router();

dishRouter.use(bodyparser.json());

dishRouter.route('/')
.all((req,res,next) => {
    
    req.statusCode = 200;
    res.setHeader('content-type','text/html');
    next();

})


.get((req,res,next) => {
    res.send("will send all the dishes to you!"); 
})
   
.post((req,res,next) => {
    res.send("will add the dish:" + req.body.name + 'with details'+ req.body.description);
})
   
.put((req,res,next) => {
    res.statuscode = 403;
    res.end("put operation not supported in dish");
})
   
.delete((req,res,next) => {
    res.statuscode = 403;
    res.end("deleted all the dishes");
});


dishRouter.route('/:dishId')
.all((req,res,next) => {
    
    req.statusCode = 200;
    res.setHeader('content-type','text/html');
    next();

})


.get((req,res,next) => {
    res.end("will send details of the dish:" + req.params.dishId); 
    
})
   
.post((req,res,next) => {
    res.statuscode = 403;
    res.send("post operation not supported in dish" + req.params.dishId);
})
   
.put((req,res,next) => {
       res.write(" updataing the  dish" + req.params.dishId);
       res.end("will update the dish:"+ req.body.name + 'with details' + req.body.description);
})
   
.delete((req,res,next) => {
       res.statuscode = 403;
       res.send("deleting  the dishes");
});



module.exports = dishRouter;