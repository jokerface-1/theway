import express from "express";
import bodyparser from "body-parser";
import pg from "pg";
const db = new pg.Client({
    user:'postgres',
    host:'localhost',
    password:'jokerface',
    database:'theway', 
    port:5432,
});
db.connect()
const app = express();
const port = 3000;
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended:true}));


app.get("/", (req, res)=>{
    res.render("index.ejs")
})

app.post("/submit", async(req, res)=>{
    const result = req.body.username;
    const result2 = req.body.skill;
    const result3 = req.body.mail;
    const result4 = req.body.passkey;
   const check=await db.query("select*from info where mail = $1", [result3])
    if(check.rows.length>0){
        res.send("already registered")
    }
    else{
        db.query("INSERT into info(name ,skill ,mail ,pass) values($1, $2, $3, $4)"
            ,[result, result2, result3, result4])
       res.render("login.ejs")
    }
    
       
})
app.post("/login", (req, res)=>{
    res.render("login.ejs")
})
app.post("/login2", async(req, res)=>{
    const mail = req.body.mail;
    const pass = req.body.passkey;
    const check = await db.query("select*from info where mail=$1", [mail]);
    if(check.rows.length>0){
        const user = check.rows[0];
        if(pass===user.pass && mail===user.mail){
            res.render("profile.ejs", {name:user.name, email:mail, skill:user.skill})
        }
        else{
            console.log("username or password is wrong")
        }
    }
})
app.listen(port,()=>{
    console.log("listening")
})