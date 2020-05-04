const express = require('express');
const router = express.Router();

const authMiddleware = require('../utils/auth-middleware');

var List = require("../models/list-model");
var Task = require("../models/task-model");

// GET ALL LISTS
router.get('/', authMiddleware ,(req,res)=>{
     List.find({ author : req.user.username  }).exec()
     .then(docs=>{
               var lists = docs.map(doc=>{
                    return {
                         _id : doc._id,
                         title : doc.title,
                         author : doc.author
                    }
               })
          res.status(200).json(lists)
     }).catch(err=>{
          res.status(501).json(err.message)
     })
})
// GET SIngle List
router.get('/:listid', authMiddleware ,async (req,res)=>{
     var id = req.params.listid;
     try{
          let doc = await List.findById(id).exec()
          if(doc) res.status(200).json(doc)
          else throw Error('List can not be get ...')
     }catch(err){
          res.status(501).json(err.message)
     }
})

// CREATE A SINGLE LIST
router.post('/' , authMiddleware , (req,res)=>{
     var title = req.body.title;
     var listobject = {
          title : title,
          author : req.user.username
     }
     var list = new List(listobject)
     list.save()
     .then(doc =>{
          res.status(201).json(doc);
     })
     .catch(err=>{
          res.status(401).json(err)
     })
})
// UPDATE A SINGLE LIST
router.patch('/:listid', authMiddleware , (req,res)=>{
     var title = req.body.title
     var id = req.params.listid;
     List.findByIdAndUpdate(id , { $set : { title : title } }, { new : true} ).exec()
     .then(doc=>{
          res.status(200).json(doc)
     }).catch(err=>{
          res.status(501).json(err.message)
     })
})
// DELETE A SINGLE LIST
router.delete('/:listid', authMiddleware, (req,res)=>{
     List.findByIdAndDelete(req.params.listid).exec()
     .then(doc=>{
          if(doc){
               return Task.deleteMany({ listid : doc._id }).exec()
          }else{
               throw Error("List does not exist")
          }
     }).then(doc=>{
          res.status(200).json(doc);
     })
     .catch(err=>{
          res.status(501).json(err.message)
     })
})


module.exports = router;
