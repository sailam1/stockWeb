const express=require("express");
const ejs=require('ejs');
const bodyparser=require("body-parser");
const session=require("express-session");
const mongoose=require('mongoose');
const spawn=require("child_process").spawn;
const fs=require("fs");

app=express();

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    cookie:{maxAge:3600000}
}));

app.use(bodyparser.urlencoded({extended:true}));
app.use(bodyparser.json());
app.use(express.static("public"));

app.set("view engine","ejs");

async function test(){
    await mongoose.connect("mongodb+srv://sailam:sailam2000@cluster0.jquj8.mongodb.net/stock?retryWrites=true/userData",{useNewUrlParser:true,useUnifiedTopology: true});
}

test();

mongoose.set("useCreateIndex",true);


//creating fields to store user personal data
const userScema=new mongoose.Schema({
    username:String,
    email:String,
    fname:String,
    lname:String,
    password:String
});

const User=mongoose.model("User",userScema);






app.get("/signup",function(req,res){
    res.render("signup");
});

app.get("/signin",function(req,res){
    res.render("signin",{message:""});
});


//signup details saving and user login
app.post("/signup",function(req,res){
    var userName=req.body.username;
    var password=req.body.password;
    var email=req.body.email;
    var fname=req.body.fname;
    var lname=req.body.lname;
    const data=new User({
        username:userName,
        email:email,
        fname:fname,
        lname:lname,
        password:password
    });
    data.save();
    req.session.loggedin=true;
    req.session.username=userName;
    res.redirect("/signin");
});

//user checking and logging him in
app.post("/signin",function(req,res){
    const username=req.body.uname;
    const password=req.body.password;
    User.find({username:username},function(err,data){
        if(err){
            console.log(err);
            res.render("signin",{message:""});
        }
        else if(data.length===0){
            const message="invalid user";
            res.render('signin',{message:message});
        }
        else{
            if(password!==data[0].password){
                const message2="invalid password";
                res.render("signin",{message:message2});
            }
            else{
                req.session.loggedin=true;
                req.session.username=data[0].username;
                res.redirect("/");
            }
        }
    });
});
// started making changes from hear
var out="";
var num="";
app.get("/",function(req,res){
    if(req.session.loggedin){
        res.render("home2");
        out="";
        num="";
    }
    else{
        res.render("home1");
    }
});


app.post("/outcome",async function(req,res){
    if(req.session.loggedin){
        const sym=req.body.finder;
        num=req.body.days;
        const python=spawn('python',["./python/extractor.py",sym,num]);
        res.redirect("/output");
        python.stdout.on('data', function (data){
            out = data.toString();
        });
    }
    else{
        res.redirect("/");
    }
});
app.get("/output",function(req,res){
    if(req.session.loggedin){
        if(out.length===0){
            res.render("loader");
        }
        else{
            res.render("output",{open_price:out,days:num});
        }
    }
    else{
        res.redirect("/");
    }
});




//logout button
app.post("/logout",function(req,res){
    req.session.destroy(function(err){
        res.redirect("/");
    })
});

let port=process.env.PORT;

if(port==null || port==""){
    port=3000;
}

app.listen(port,function(req,res){
    console.log("port 3000 running");
});

