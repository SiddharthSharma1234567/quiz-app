const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const app = express();

const { MongoClient } = require('mongodb');
MongoClient.connect("mongodb+srv://SiddharthSharma:siddharth@cluster0.gacgrpw.mongodb.net/")
    .then((client) => {
        dbinstance = client.db("2111981178-SiddharthSharma");
        console.log("MongoDB connected");
    })
    .catch((err) => {
        console.log(err);
    });

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    saveUninitialized: true,
    resave: true,
    secret: "lknfvoiinb",
    cookie: { maxAge: 3600000 }
}))

app.post("/logindata", (req, res) => {
    const { email, password } = req.body;

    dbinstance.collection("users").findOne({ "email": email, "password": password })
    .then((data)=>{
        if(data){
            req.session.email = email;
            res.status(200).json({ success: true, data: data.submissions });
        }
        else{
            res.status(200).json({ success: false, error: "Invalid email or password" });
        }
    })
})

app.get("/getData",(req,res)=>{
    const email=req.session.email;

    dbinstance.collection("users").findOne({ "email": email })
    .then((data)=>{
        res.status(200).json({ success: true, submissions: data.submissions });
    })
    .catch((err)=>{
        console.log(err);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    })
})

app.get("/getQue",(req,res)=>{
    dbinstance.collection("Questions").find().toArray()
    .then((data)=>{
        res.status(200).json({ success: true, questions: data });
    })
    .catch((err)=>{
        console.log(err);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    })

})


app.post("/signupdata", (req, res) => {
    const { email, password, confirmPassword, gender } = req.body;

    if(confirmPassword!==password){
        res.json({ success: false, error: "password does not match" });
        return;
    }

    const obj = {
        "email": email,
        "password": password,
        "confirmPassword": confirmPassword,
        "gender": gender,
        "submissions": []
    };

    dbinstance.collection("users").insertOne(obj)
        .then(() => {
            req.session.email = email;
            res.status(200).json({ success: true});
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ success: false, error: "Internal Server Error" });
        });
})

app.post("/submit", (req, res) => {
    const { currentDate, currentTime, marks } = req.body;
    const email = req.session.email;

    dbinstance.collection("users").updateOne({
        "email": email
    }, {
        $push: {
            "submissions": {
                "Date": currentDate,
                "Time": currentTime,
                "marks": marks
            }
        }
    })
        .then(() => {
            res.status(200).json({ success: true });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ success: false, error: "Internal Server Error" });
        }); // Add closing parenthesis and semicolon here
});

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            res.status(500).send('Error destroying session');
        } else {
            res.status(200).send({"success":true}); // Redirect to the login page after destroying the session
        }
    });
});

app.get("/", (req, res) => {
    if (req.session.email) {
        res.sendFile(__dirname + '/index.html');
    } else {
        res.redirect('/login');
    }
})

app.get("/quiz.html",(req,res)=>{
    res.sendFile(__dirname + '/quiz.html');
})

app.get("/quiz.js",(req,res)=>{
    res.sendFile(__dirname + '/quiz.js');
})

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/login.html');
})

app.get('/signup', (req, res) => {
    res.sendFile(__dirname + '/signup.html');
})

app.get("/index.js",(req,res)=>{
    res.sendFile(__dirname + '/index.js');
})

app.listen(3000, (err) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log("server activated");
    }
})