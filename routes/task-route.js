const express = require('express');
const router = express.Router();

const authMiddleware = require('../utils/auth-middleware');
var Task = require('../models/task-model');

// GET TASKS Array BY SINGLE list_id
router.get('/:listid' , authMiddleware, (req,res)=>{
     var listid = req.params.listid
     Task.find({ listid : listid , author : req.user.username }).exec()
     .then(docs=>{
          res.status(200).json(docs)
     })
     .catch(err=>{
          res.status(501).json(err.message)
     })
})
// GET SINGLE TASK
router.get('/:listid/:taskid', authMiddleware , async (req,res)=>{
     var { listid , taskid } = req.params;
     try{
          let doc = await Task.findById(taskid).exec()
          if(doc) res.status(200).json(doc)
          else throw Error('can not fetched data try again')
     }catch(err){ res.status(501).json(err.message) }
})
router.post('/', authMiddleware , (req,res)=>{
     // var listid = req.params.listid;
     var newtask = {
          title : req.body.title,
          listid : req.body.listid,
          author : req.user.username
     }
     new Task(newtask).save()
     .then(doc=>{
          res.status(201).json(doc)
     })
     .catch(err=>{
          res.status(501).json(err.message)
     })
})
router.patch('/:listid/:taskid', authMiddleware , async (req,res)=>{
     let { listid , taskid } = req.params
     try{
          let updatedDoc = await Task.findByIdAndUpdate(taskid, req.body , { new : true}).exec()
          if(updatedDoc) res.status(201).json(updatedDoc)
          else throw Error('task can not be updated tryagain');
     }catch(err) {
          res.status(501).json(err.message)
     }
})
router.delete('/:taskid',authMiddleware, (req,res)=>{
     let taskid = req.params.taskid
     try{
          let success = Task.findByIdAndDelete(taskid).exec()
          if(success) res.status(200).json(success)
          else throw Error('task can not be deleted...')
     }catch(err){
          res.status(501).json(err.message)
     }
})

module.exports = router;