const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');

const promos = require('../models/promotions');


const promoRouter = express.Router();

promoRouter.use(bodyparser.json());

promoRouter.route('/')

.get((req,res,next) =>{
    promos.find({})
    .then((promos) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promos);


    }, (err) => next(err))
    .catch((err) => next(err));
})

.post(authenticate.verifyUser,(req,res,next) =>{
    promos.create(req.body)
    .then((promos) => {
        console.log('promos created', promos);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promos);
    }, (err) => next(err))
    .catch((err) => next(err));
})

.put(authenticate.verifyUser,(req,res,next) =>{
    res.statuscode = 403;
    res.end("put operation not supported in promo");
})

.delete(authenticate.verifyUser,(req,res,next) =>{
    promos.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

promoRouter.route('/:promoId')
.get((req,res,next) =>{
    promos.findById(req.params.promoId)
    .then((promos) => {
        console.log('promo created', promos);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promos);
    }, (err) => next(err))
    .catch((err) => next(err));
})

.post(authenticate.verifyUser,(req,res,next) =>{
    res.statuscode = 403;
    res.send("post operation not supported in promo" + req.params.promoId);
})

.put(authenticate.verifyUser,(req,res,next) =>{
    promos.findByIdAndUpdate(req.params.promoId, {
        $set: req.body
    }, { new: true })
        .then((promos) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(promos);
        }, (err) => next(err))
        .catch((err) => next(err));
})

.delete(authenticate.verifyUser,(req,res,next) =>{
    promos.findByIdAndRemove(req.params.promoId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

promoRouter.route('/:promoId/comments')
.get((req, res, next) => {
    promos.findById(req.params.promoId)
        .then((promos) => {
            if (promos != null) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(promos.comments);
            } else {
                err = new Error('promos' + req.params.promoId + 'not found')
                err.status = 404;
                return next(err);
            }
        }, (err) => next(err))
        .catch((err) => next(err));
})


.post(authenticate.verifyUser,(req, res, next) => {
    promos.findById(req.params.promoId)
        .then((promos) => {
            if (promos != null) {
                promos.comments.push(req.body);
                promos.save()
                    .then((promos) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(promos);
                    },(err) => next(err));

            } else {
                err = new Error('promos' + req.params.promoId + 'not found')
                err.status = 404;
                return next(err);
            }
        }, (err) => next(err))
        .catch((err) => next(err));
})

.put(authenticate.verifyUser,(req, res, next) => {
    res.statuscode = 403;
    res.end("put operation not supported on /promo/" + req.params.promoId + '/comments');
})

.delete(authenticate.verifyUser,(req, res, next) => {
    promos.findById(req.params.promoId)
    .then((promos) => {
        if (promos != null) {
           for( var i= (promos.comments.length -1); i>=0; i--){
            promos.comments.id(promos.comments[i]._id).remove();
           }
           promos.save()
           .then((promos) => {
               res.statusCode = 200;
               res.setHeader('Content-Type', 'application/json');
               res.json(promos);
            },(err) => next(err));

        } else {
            err = new Error('promo' + req.params.promoId + 'not found')
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
        .catch((err) => next(err));
});



promoRouter.route('/:promoId/comments/:commentId')
.get((req, res, next) => {
    promos.findById(req.params.promoId)
        .then((promos) => {
            if ((promos) != null && promos.comments.id(req.params.commentId) != null) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(promos.comments.id(req.params.commentId));
            } else if( promos == null) {
                err = new Error('promo' + req.params.promoId + 'not found')
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

.post(authenticate.verifyUser,(req, res, next) => {
    res.statuscode = 403;
    res.send("post operation not supported on /promos/" + req.params.promoId + "/comments/" + req.params.commentId);
})

.put(authenticate.verifyUser,(req, res, next) => {
    promos.findById(req.params.promoId)
    .then((promos) => {
        if (promos != null && promos.comments.id(req.params.commentId) != null) {
            if(req.body.rating){
                promos.comments.id(req.params.commentId).rating = req.body.rating; 
            }
            if(req.body.comment){
                promos.comments.id(req.params.commentId).comment = req.body.comment;
            }
            promos.save()
                .then((promos) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(promos);
                },(err) => next(err));
        } 
        else if( promos == null) {
            err = new Error('promo' + req.params.promoId + 'not found')
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

.delete(authenticate.verifyUser,(req, res, next) => {
    promos.findById(req.params.promoId)
    .then((promos) => {
        if (promos != null && promos.comments.id(req.params.commentId) != null) {
            promos.comments.id(req.params.commentId).remove();               
            promos.save()
           .then((promos) => {
               res.statusCode = 200;
               res.setHeader('Content-Type', 'application/json');
               res.json(promos);
            },(err) => next(err));

        } 
        else if( promos == null) {
            err = new Error('promo' + req.params.promoId + 'not found')
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




module.exports = promoRouter;