const express = require('express');
const bodyparser = require('body-parser');


const leaderRouter = express.Router();

leaderRouter.use(bodyparser.json());

leaderRouter.route('/')
.all((req,res,next) =>{
 req.statusCode=200;
 res.setHeader('content-type','text/html');
 next();

})

.get((req,res,next) =>{
  res.send('will send all the leaders to you');
})

.post((req,res,next) =>{
    res.send('will add the leaders' + req.body.name + 'with details'+ req.body.description);
})

.put((req,res,next) =>{
    res.statuscode = 403;
    res.end("put operation not supported in leader");
})

.delete((req,res,next) =>{
    res.send('deleteing all the leaders');
});

leaderRouter.route('/:leaderId')
.all((req,res,next) =>{
 req.statusCode=200;
 res.setHeader('content-type','text/html');
 next();

})

.get((req,res,next) =>{
    res.end("will send details of the leaders:" + req.params.leaderId);
})

.post((req,res,next) =>{
    res.statuscode = 403;
    res.send("post operation not supported in leader" + req.params.leaderId);
})

.put((req,res,next) =>{
    res.write(" updataing the  leader" + req.params.leaderId);
    res.end("will update the leader:"+ req.body.name + 'with details' + req.body.description);
})

.delete((req,res,next) =>{
    res.statuscode = 403;
    res.send("deleting  the leaders");
});




module.exports = leaderRouter;