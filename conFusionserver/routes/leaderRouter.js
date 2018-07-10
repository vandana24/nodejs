const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');


const leaders = require('../models/leaders');


const leaderRouter = express.Router();

leaderRouter.use(bodyparser.json());

leaderRouter.route('/')
.get((req,res,next) =>{
    leaders.find({})
    .then((leaders) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leaders);


    }, (err) => next(err))
    .catch((err) => next(err));
})

.post((req,res,next) =>{
    leaders.create(req.body)
    .then((leaders) => {
        console.log('leaders created', leaders);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leaders);
    }, (err) => next(err))
    .catch((err) => next(err));
})

.put((req,res,next) =>{
    res.statuscode = 403;
    res.end("put operation not supported in leader");
})

.delete((req,res,next) =>{
    leaders.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

leaderRouter.route('/:leaderId')

.get((req,res,next) =>{
    leaders.findById(req.params.leaderId)
    .then((leaders) => {
        console.log('leaders created', leaders);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leaders);
    }, (err) => next(err))
    .catch((err) => next(err));
})

.post((req,res,next) =>{
    res.statuscode = 403;
    res.send("post operation not supported in leader" + req.params.leaderId);
})

.put((req,res,next) =>{
    leaders.findByIdAndUpdate(req.params.leaderId, {
        $set: req.body
    }, { new: true })
        .then((leaders) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(leaders);
        }, (err) => next(err))
        .catch((err) => next(err));
})

.delete((req,res,next) =>{
    leaders.findByIdAndRemove(req.params.leaderId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});







leaderRouter.route('/:leaderId/comments')
.get((req, res, next) => {
    leaders.findById(req.params.leaderId)
        .then((leaders) => {
            if (leaders != null) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(leaders.comments);
            } else {
                err = new Error('leaders' + req.params.leaderId + 'not found')
                err.status = 404;
                return next(err);
            }
        }, (err) => next(err))
        .catch((err) => next(err));
})


.post((req, res, next) => {
    leaders.findById(req.params.leaderId)
        .then((leaders) => {
            if (leaders != null) {
                leaders.comments.push(req.body);
                leaders.save()
                    .then((leaders) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(leaders);
                    },(err) => next(err));

            } else {
                err = new Error('leaders' + req.params.leaderId + 'not found')
                err.status = 404;
                return next(err);
            }
        }, (err) => next(err))
        .catch((err) => next(err));
})

.put((req, res, next) => {
    res.statuscode = 403;
    res.end("put operation not supported on /leaders/" + req.params.leaderId + '/comments');
})

.delete((req, res, next) => {
    leaders.findById(req.params.leaderId)
    .then((leaders) => {
        if (leaders != null) {
           for( var i= (leaders.comments.length -1); i>=0; i--){
            leaders.comments.id(leaders.comments[i]._id).remove();
           }
           leaders.save()
           .then((leaders) => {
               res.statusCode = 200;
               res.setHeader('Content-Type', 'application/json');
               res.json(leaders);
            },(err) => next(err));

        } else {
            err = new Error('leaders' + req.params.leaderId + 'not found')
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
        .catch((err) => next(err));
});



leaderRouter.route('/:leaderId/comments/:commentId')
.get((req, res, next) => {
    leaders.findById(req.params.leaderId)
        .then((leaders) => {
            if ((leaders) != null && leaders.comments.id(req.params.commentId) != null) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(leaders.comments.id(req.params.commentId));
            } else if( promos == null) {
                err = new Error('promo' + req.params.leaderId + 'not found')
                err.status = 404;
                return next(err);
            }
            else{
                err = new Error('Comment' + req.params.commentId + 'not found')
                err.status = 404;
                return next(err);
            }
        }, (err) => next(err))
        .catch((err) => next(err));

})

.post((req, res, next) => {
    res.statuscode = 403;
    res.send("post operation not supported on /leaders/" + req.params.leaderId + "/comments/" + req.params.commentId);
})

.put((req, res, next) => {
    leaders.findById(req.params.leaderId)
    .then((leaders) => {
        if (leaders != null && leaders.comments.id(req.params.commentId) != null) {
            if(req.body.rating){
                leaders.comments.id(req.params.commentId).rating = req.body.rating; 
            }
            if(req.body.comment){
                leaders.comments.id(req.params.commentId).comment = req.body.comment;
            }
            leaders.save()
                .then((leaders) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(leaders);
                },(err) => next(err));
        } 
        else if( leaders == null) {
            err = new Error('promo' + req.params.leaderId + 'not found')
            err.status = 404;
            return next(err);
        }
        else{
            err = new Error('Comment' + req.params.commentId + 'not found')
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
        .catch((err) => next(err));

})

.delete((req, res, next) => {
    leaders.findById(req.params.leaderId)
    .then((leaders) => {
        if (leaders != null && leaders.comments.id(req.params.commentId) != null) {
            leaders.comments.id(req.params.commentId).remove();               
            leaders.save()
           .then((leaders) => {
               res.statusCode = 200;
               res.setHeader('Content-Type', 'application/json');
               res.json(leaders);
            },(err) => next(err));

        } 
        else if( leaders == null) {
            err = new Error('leaders' + req.params.leaderId + 'not found')
            err.status = 404;
            return next(err);
        }
        else{
            err = new Error('Comment' + req.params.commentId + 'not found')
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
        .catch((err) => next(err));
});








module.exports = leaderRouter;