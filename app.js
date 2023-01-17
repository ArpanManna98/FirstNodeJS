const express = require('express');
const app = express();
let fs = require('fs');
const bodyParser = require('body-parser')
const { join } = require('path');
const { con } = require('./demo_db_connection');
const { error } = require('console');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.static(join(__dirname, 'public')));
// parse application/json
app.use(bodyParser.json())


app.get('/', function (req, response) {
    fs.readFile('./html/loginpage.html', null, function (error, data) {
        if (error) {
            response.writeHead(404);
            respone.write('Whoops! File not found!');
        } else {
            response.write(data);
        }
        response.end();
    });
})
app.get('/welcome', function (req, response) {
    fs.readFile('./html/welcome.html', null, function (error, data) {
        if (error) {
            response.writeHead(404);
            respone.write('Whoops! File not found!');
        } else {
            response.write(data);
        }
        response.end();
    });
})
app.post('/register', function (req, res) {
    let nameVar = req.body.namezzzz;
    let emailVar = req.body.emailzzzz;
    let passwordVar = req.body.passwordzzzz;
    con.connect(function (err) {
        if (err) throw err;
        console.log("Connected!");
        con.query("INSERT INTO `users` set ?", { name: nameVar, email: emailVar, password: passwordVar },
            (error, result) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log(result);
                    res.send({ msg: "User Registration Sucessfull" });
                }
            })
        //INSERT INTO `users`(`name`, `email`, `password`, `isActive`) 
        //VALUES ('[value-2]','[value-3]','[value-4]','[value-5]')

    });

})

app.post('/login', async (req, res) => {
    console.log(req.body.emailzzz);
    console.log(req.body.passwordzzz);
    let useremailyyy = req.body.emailzzz;
    let userpwdyyy = req.body.passwordzzz;
    let sql = `SELECT * FROM users WHERE email = '${useremailyyy}' and password ='${userpwdyyy}'`;

    //    con.connect(function(err) {
    //     if (err) throw err;
    //     console.log("Connected!");

    //     //INSERT INTO `users`(`name`, `email`, `password`, `isActive`) 
    //     //VALUES ('[value-2]','[value-3]','[value-4]','[value-5]')

    //   });
    con.query(sql, {},
        (error, results) => {
            if (error) {
                console.log(error);
            } else {
                console.log(results);
                if(results.length<1){
                    return  res.send({ msg: 'Incorrect Email and Password', loginstatus: false });
                }
                const { email, password } = results[0]
                let uid = email;
                let pd = password;
                if (useremailyyy == uid && userpwdyyy == pd) {
                    res.send({ msg: 'Succefully Loggin', loginstatus: true });
                }
                else if (useremailyyy == uid && userpwdyyy != pd) {
                    res.send({ msg: 'Incorrect Password', loginstatus: false });
                }
                else if (useremailyyy != uid && userpwdyyy == pd) {
                    res.send({ msg: 'Incorrect Email', loginstatus: false });
                }
                else {
                    res.send({ msg: 'Incorrect Email and Password', loginstatus: false });
                }
            }
        })

})

app.get('/signuppage', function (req, response) {
    fs.readFile('./html/signuppage.html', null, function (error, data) {
        // console.log(req.body.email);
        // console.log(req.body.password);
        // let useremail = req.body.email;
        // let userpwd = req.body.password;
        // let uid="amanna@gmail.com";
        // let pd= "123456";

        if (error) {
            response.writeHead(404);
            respone.write('Whoops! File not found!');
        } else {
            response.write(data);
        }
        response.end();
    });
})
const server = app.listen(8081, function () {
    let host = server.address().address
    let port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
})