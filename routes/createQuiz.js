// import {nanoid} from 'nanoid'
// var { nanoid } = require("nanoid");
// // var ID = nanoid(10 );
// console.log("nano id : ", ID);

var { customAlphabet } = require('nanoid/async')
const nanoId = customAlphabet('1234567890', 10)

const router = require('express')();
const Quiz = require('../models/questions');

const Result = require('../models/answerSheet');

// URL : /api/admin/createquiz
router.post('/createquiz',async (req, res)=>{

    try{


        req.checkBody('name', 'name is required').notEmpty();
        req.checkBody('date', 'date is required').notEmpty();
        req.checkBody('time', 'time is required').notEmpty();
        req.checkBody('questionArray', 'Questions are required').notEmpty();

        let err = req.validationErrors();

        if(err){
            return res.json({success : false, message : 'Something went wrong', msg : err})
        }
        // let time = req.body.time;

        // let hour = time.slice(0, 2);
        // let minutes = time.slice(3);
    
        // console.log("hours : ", hour, minutes);
        
        
        var testId = await nanoId();

        const quiz =  new Quiz({
            ...req.body,
            quizId : testId
        });
    
        await quiz.save();
        return res.json({success : true, message : "Saved"})
        
    }catch(e){
        return res.json({success : false, message : e});
    }
})

router.get("/allquiz",async(req, res)=>{

    try{
        const quiz = await Quiz.find({});

        return res.json({success : true, data : quiz});

    } catch(e){

        console.log("err is : ", e);
        return res.json({success : false, e : e})
    }
})

router.get("/quizbyid/:quizId", async (req, res)=>{

    
    if(!req.params.quizId){
        return res.json({success : false, e : "provide quiz id"})
    }

    var id = req.params.quizId

    try{

        const quiz = await Quiz.findById(id);

        if(!quiz){
            return res.json({success : true, message : "No quiz found", data : []})
        } else {
            return res.json({success : true,  data : quiz})
        }

    } catch(e){

        console.log("err is : ", e);
        return res.json({success : false, e : e})
    }
    
})

router.get("/quizbycustomId/:quizId", async (req, res)=>{

    if(!req.params.quizId){
        return res.json({success : false, e : "provide quiz id"})
    }

    try{

        const quiz = await Quiz.find({"quizId" : req.params.quizId });

        if(!quiz){
            return res.json({success : true, message : "No quiz found", data : []})
        } else {
            return res.json({success : true,  data : quiz})
        }

    } catch(e){

        console.log("err is : ", e);
        return res.json({success : false, e : e})
    }
    
})

router.get('/quizbydate', async (req, res)=>{

    // try {
        var today = new Date();
        
        let quiz = await Quiz.find({"date" : {$gte : today}});
        return res.json({success : true, data : quiz});

    // } catch(e){
        return res.json({success : false, message : e, msg : e});
    // }
})

router.get('/quizbySingledate/:date', async (req, res)=>{
    var date = req.params.date;
    if(!date){
        return res.json({success : false, message : "provide date"})
    }
    try {
        var today = new Date();
    
        let quiz = await Quiz.find(                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           );
        return res.json({success : true, data : quiz})

    } catch(e){
        return res.json({success : false, message : e, msg : e})
    }
})

router.post('/savequiz/:userid', async(req, res)=>{
    let userid = req.params.userid;
    console.log(req.body)
    if(!userid){
        return res.json({success : false, message : "Provide user id"});
    }
    if(!req.body.quizId){
        return res.json({success : false, message : "Provide quizId"});
    }
    if(!req.body.questionAttempted){
        return res.json({success : false, message : "Provide questionAttempted"});
    }
    if(!req.body.markedAns){
        return res.json({success : false, message : "Provide markedAns"});
    }
    if(!req.body.markesObtained){
        return res.json({success : false, message : "Provide markesObtained"});
    }

    try {
        const result = new Result({
            ...req.body,
            userId : userid
        });
        
        await result.save();
        return res.json({success : true, message : "Result saved"})

    } catch(e){
        return res.json({success : false, message : "Something went wrong", err : e})
    }
    
    
})
module.exports = router