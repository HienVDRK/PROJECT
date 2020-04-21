import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

import Issue from './models/Issue';
import User from './models/User';

const app = express();
const router = express.Router();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/issues');

const connection = mongoose.connection;

connection.once('open', () => {
    console.log('MongoDB database connection established successfully!');
});

const accessTokenSecret = 'youraccesstokensecret';

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, accessTokenSecret, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }

            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

router.get('/issues', getIssue);
router.get('/issues/:id', getIssueById);
router.post('/issues/add', addIssue);
router.post('/issues/update/:id', updateIssue);
router.get('/issues/delete/:id', deleteIssue);
// router.get('/issues/delete/:id', authenticateJWT, deleteIssue);
router.post('/users/signup', signup);
router.post('/users/login', login);


function getIssue(req, res) {
    Issue.find((err, issues) => {
        if (err)
            console.log(err);
        else
            res.json(issues);
    });
}


function getIssueById(req, res) {
    Issue.findById(req.params.id, (err, issue) => {
        if (err)
            console.log(err);
        else
            res.json(issue);
    });
}


function addIssue(req, res) {
    let issue = new Issue(req.body);
    issue.save()
        .then(issue => {
            res.status(200).json({ 'issue': 'Added successfully' });
        })
        .catch(err => {
            res.status(400).send('Failed to create new record');
        });
}


function updateIssue(req, res) {
    Issue.findById(req.params.id, (err, issue) => {
        if (!issue)
            return next(new Error('Could not load document'));
        else {
            issue.title = req.body.title;
            issue.responsible = req.body.responsible;
            issue.description = req.body.description;
            issue.severity = req.body.severity;
            issue.status = req.body.status;

            issue.save().then(issue => {
                res.json('Update done');
            }).catch(err => {
                res.status(400).send('Update failed');
            });
        }
    })
}


function deleteIssue(req, res) {
    Issue.findByIdAndRemove({ _id: req.params.id }, (err, issue) => {
        if (err)
            res.json(err);
        else
            res.json('Remove successfully');
    })
}

// -------------------------------------


function signup(req, res, next) {
    let user = new User(req.body);
    bcrypt.hash(user.password, 10, function (err, hash) {
        if (err) {
            return next(err);
        }
        user.password = hash;
        user.save()
            .then(user => {
                res.status(200).json({ 'user': 'Signup successfully' });
            })
            .catch(err => {
                res.status(400).send('Failed to create new record');
            });
    })
}

function login(req, res) {
    let user = new User(req.body)
    let username = user.username
    let password = user.password

    User.findOne({ username: username })
        .exec(function (err, userinDb) {
            if (err) {
                res.json({message: err})
                return
            } else if (!userinDb) {
                res.json({message : 'User not found'})
                return
            }
            bcrypt.compare(password, userinDb.password, function (err, result) {
                if (result === true) {
                    const accessToken = jwt.sign({ username: user.username }, accessTokenSecret);
                    res.json({ status: 200, userinDb, accessToken });
                } else {
                    res.json({message : 'Incorrect password'})
                }
            })
        });
}

app.use('/', router);
app.listen(port, () => console.log('Express server running on port ' + port));