const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const Issue = require('./models/Issue')
const User = require('./models/User')
const Token = require('./models/Token')
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const app = express()
const router = express.Router()
const port = process.env.PORT || 4000


app.use(cors())
app.use(bodyParser.json())

const dbpassword = process.env.PASSWORD;
const dbusername = process.env.USERNAME;
const dbname = process.env.DBNAME;

mongoose.connect(`mongodb://${dbusername}:${dbpassword}@ds127545.mlab.com:27545/${dbname}`)

const connection = mongoose.connection

connection.once('open', () => {
    console.log('MongoDB database connection established successfully!')
})

const accessTokenSecret = 'youraccesstokensecret'

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization
    if (authHeader) {
        const token = authHeader.split(' ')[1]

        jwt.verify(token, accessTokenSecret, (err, user) => {
            if (err) {
                return res.sendStatus(403)
            }
            req.user = user
            next()
        })
    } else {
        res.sendStatus(401)
    }
}

router.get('/issues', getIssue)
router.get('/issues/:id', getIssueById)
router.post('/issues/add', authenticateJWT, addIssue)
router.post('/issues/update/:id', authenticateJWT, updateIssue)
router.get('/issues/delete/:id', authenticateJWT, deleteIssue)

router.post('/users/signup', signup)
router.post('/users/login', login)
router.get('/users', authenticateJWT, getUser)
router.get('/users/:id', getUserById)
router.post('/users/update/:id', authenticateJWT, updateUser)
router.get('/users/delete/:id', authenticateJWT, deleteUser)
router.get('/users/resend/:email', resendEmail)
router.get('/confirmation/:email/:token', confirmationEmail)

function resendEmail(req, res) {
    User.findOne({ email: req.params.email }, function (err, user) {
        if (!user) {
            res.json({ status: 400, message: 'Email address does not exist.' })
            return
        }
        if (user.confirmed) {
            res.json({ status: 401, message: 'This account has already been verified. Please log in.' })
            return
        }
        // Create a verification token, save it, and send email
        var token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });
        // Save the token
        token.save(function (err) {
            if (err) { return res.status(500).send({ msg: err.message }); }
             // Send the email
             const url = `${req.protocol}://${req.headers.host}/confirmation/${user.email}/${token.token}`
             var transporter = nodemailer.createTransport({
                 host: 'smtp.gmail.com',
                 port: 465,
                 secure: true,
                 service: 'gmail',
                 auth: {
                     user: process.env.EMAILFROM,
                     pass: process.env.PASSEMAIL
                 }
             });

             //body Email
             var mailOptions = {
                 from: process.env.EMAILFROM,
                 to: `${user.email}`,
                 subject: '[Important] Account Verification Token',
                 html: `<h4>Hello ${user.firstname} ${user.lastname},</h4>
                 <p>Please click to activate your account: <a href="${url}">Click me</a></p><p style="font-style: italic">The token is valid for 1 hours</p>`
             };

             transporter.sendMail(mailOptions, function (error, info) {
                 if (error) {
                     if (error.code === 'EAUTH' && error.responseCode == 535) {
                         console.log('Allow less secure apps: OFF');
                         res.status(401).send("Allow less secure apps: OFF.");
                     }
                     else {
                         console.log('ERROR--', error);
                     }
                 } else {
                     res.json({ status: 200, message: 'Resend email successfully - Please check email.' })
                     console.log('Email sent: ' + info.response);
                 }
             })
        })
    })
}

function confirmationEmail(req, res) {
    try {
        Token.findOne({ token: req.params.token }, function (err, token) {
            if (!token) return res.status(400).send({ type: 'not-verified', msg: 'Invalid token. Your token my have expired.' });
            User.findOne({ email: req.params.email }, function (err, user) {
                if (!user) return res.status(400).send({ msg: 'We were unable to find a user for this token.' });
                if (user.confirmed) return res.status(400).send({ type: 'already-verified', msg: 'This user has already been verified.' });
                user.confirmed = true;
                user.save(function (err) {
                    if (err) { return res.status(500).send({ msg: err.message }); }
                    res.status(200).send("The account has been verified. Please log in.");
                });
            })
        })
    } catch (e) {
        res.send('error');
    }
}

function getIssue(req, res) {
    Issue.find((err, issues) => {
        if (err)
            console.log(err)
        else
            res.json(issues)
    })
}

function getIssueById(req, res) {
    Issue.findById(req.params.id, (err, issue) => {
        if (err)
            console.log(err)
        else
            res.json(issue)
    })
}

function addIssue(req, res) {
    let issue = new Issue(req.body)
    issue.save()
        .then(issue => {
            res.json({ status: 200, message: 'Issue added successfully.' })
        })
        .catch(err => {
            res.json({ status: 400, message: 'Failed to create new record.' })
        })
}

function updateIssue(req, res) {
    Issue.findById(req.params.id, (err, issue) => {
        if (!issue)
            return next(new Error('Could not load document'))
        else {
            issue.title = req.body.title
            issue.responsible = req.body.responsible
            issue.description = req.body.description
            issue.severity = req.body.severity
            issue.status = req.body.status

            issue.save().then(issue => {
                res.json({ status: 200, message: 'Issue updated successfully.' })
            }).catch(err => {
                res.status(400).send('Issue update failed.')
            })
        }
    })
}

function deleteIssue(req, res) {
    Issue.findByIdAndRemove({ _id: req.params.id }, (err, issue) => {
        if (err)
            res.json(err)
        else
            res.json({ status: 200, message: 'Delete issue successfully.' })
    })
}

function getUser(req, res) {
    User.find((err, users) => {
        if (err)
            console.log(err)
        else
            res.json(users)
    })
}

function getUserById(req, res) {
    User.findById(req.params.id, (err, user) => {
        if (err)
            console.log(err)
        else
            res.json(user)
    })
}

function signup(req, res, next) {
    let user = new User(req.body)
    bcrypt.hash(user.password, 10, function (err, hash) {
        if (err) {
            return next(err)
        }
        user.password = hash
        user.save()
            .then(user => {
                res.json({ status: 200, message: 'Signup successfully - Please check email.' })
                // Create a verification token for this user
                var token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });
                // Save the verification token
                token.save(function (err) {
                    if (err) { return res.status(500).send({ msg: err.message }); }
                    // Send the email
                    const url = `${req.protocol}://${req.headers.host}/confirmation/${user.email}/${token.token}`
                    var transporter = nodemailer.createTransport({
                        host: 'smtp.gmail.com',
                        port: 465,
                        secure: true,
                        service: 'gmail',
                        auth: {
                            user: process.env.EMAILFROM,
                            pass: process.env.PASSEMAIL
                        }
                    });

                    //body Email
                    var mailOptions = {
                        from: process.env.EMAILFROM,
                        to: `${user.email}`,
                        subject: '[Important] Account Verification Token',
                        html: `<h4>Hello ${user.firstname} ${user.lastname},</h4>
                        <p>Please click to activate your account: <a href="${url}">Click me</a></p><p style="font-style: italic">The token is valid for 1 hours</p>`
                    };

                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            if (error.code === 'EAUTH' && error.responseCode == 535) {
                                // res.json({ status: 401, message: `${error.response}` })
                                console.log('Allow less secure apps: OFF');
                                res.status(401).send("Allow less secure apps: OFF.");
                            }
                            else {
                                console.log('ERROR--', error);
                            }
                        } else {
                            console.log('Email sent: ' + info.response);
                        }
                    })
                });
            })
            .catch(err => {
                if (err.code == 11000) {
                    res.json({ status: 11000, message: 'Email already associated with another account.' })
                }
                else {
                    res.json({ status: 400, message: `Failed to create new record -- ${err}.` })
                }
            })
    })
}

function login(req, res) {
    let user = new User(req.body)
    let email = user.email 
    let password = user.password

    User.findOne({ email: email })
        .exec(function (err, userDb) {
            if (err) {
                res.json({ message: err })
                return
            } else if (!userDb) {
                res.json({ status: 400, message: 'User not found.' })
                return
            }
            else if (userDb.confirmed == false) {
                res.json({ status: 401, message: 'Account is not activated.' })
                return
            }
            bcrypt.compare(password, userDb.password, function (err, result) {
                if (result === true) {
                    const accessToken = jwt.sign({ email: user.email }, accessTokenSecret)
                    res.json({ status: 200, userDb, accessToken })
                } else {
                    res.json({ status:403, message: 'Incorrect password.' })
                }
            })
        })
}

function updateUser(req, res) {
    User.findById(req.params.id, (err, user) => {
        if (!user)
            return next(new Error('Could not load document.'))
        else {
            user.firstname = req.body.firstname
            user.lastname = req.body.lastname
            user.role = req.body.role

            user.save().then(user => {
                res.json({ status: 200, message: 'User updated successfully.' })
            }).catch(err => {
                res.status(400).send('User update failed.')
            })
        }
    })
}

function deleteUser(req, res) {
    User.findByIdAndRemove({ _id: req.params.id }, (err, user) => {
        if (err)
            res.json(err)
        else
            res.json({ status: 200, message: 'Delete user successfully.' })
    })
}

app.use('/', router)
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))