
const express = require('express');
const app = express();
const path = require('path');
const bcrypt = require("bcrypt");
const { MongoClient } = require("mongodb");
const axios = require('axios');

const saltRounds = 10;

const port = process.env.PORT || 8080;
                                                                                                                                    
const dburl = process.env.DB_URL;
const client = new MongoClient(dburl);
let database;

// const buildPath = path.join(__dirname, '../build');
// app.use(express.static(buildPath));
// console.log("Express serving", buildPath);

let server = app.listen(port, () => {
    const port = server.address().port;
    try {
        MongoClient.connect(url, (err, db) => {
            if (err) throw err;
            database = db.db("CP476");
        })
    } catch (err) {
        console.error(err);
    }
    console.log("Produce 404 API listening at port %s", port);
 })

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    next();
});

app.use(express.json());

////// Idol database

// Get groups
// params: groupName
// returns: groups (array[obj], if groupName = "all") OR group (obj, if groupName != "all")
// returns false if unsuccessful
app.get('/api/groups/:groupName', (req, res) => {
    try {
        // Get all
        if(req.params.groupName == "all") {
            database.collection("groups").find({}).sort({"group_name": 1}).toArray((err, groups) => {
                if (err) throw err;
                res.send(groups);
            })
        } else {
            // Get one
            database.collection("groups").findOne({"group_name":req.params.groupName}, (err, group) => {
                if (err) throw err;
                res.send(group);
            })
        }  
    } catch (err) {
        console.error(err);
        res.send(false);
    }
}) 

// Get list of members in group
// params: groupName
// returns: group members (array[obj])
// returns false if unsuccessful
app.get('/api/groups/:groupName/members', (req, res) => {
    try {
        database.collection("members_info").find({"group":req.params.groupName}).toArray((err, members) => {
            if (err) throw err;
            res.send(members);
        })  
    } catch (err) {
        console.error(err);
        res.send(false);
    }  
})

// Get member from group + stage name
// params: groupName, memberName
// returns: member info (obj)
// returns false if unsuccessful
app.get('/api/groups/:groupName/members/:memberName', (req, res) => {
    try {
        database.collection("members_info").find({"group":req.params.groupName, "stage_name":req.params.memberName}, (err, member) => {
            if (err) throw err;
            res.send(member);
        })       
    } catch (err) {
        console.error(err);
        res.send(false);
    }
})

// Get member from member id
// params: memberId
// returns: member info (obj)
// returns false if unsuccessful
app.get('/api/memberid/:memberid', (req, res) => {
    try {
        database.collection("members_info").find({"member_id":req.params.memberid}, (err, member) => {
            res.send(member);
        })       
    } catch (err) {
        console.error(err);
        res.send(false);
    }
    
})

////// Account/Profile

// Login attempt
// body: username, password
// returns: true if successful, false if unsuccessful
app.post('/api/login', function(req,res) {
    console.log("Attempted login",req.body.username);
    const username = req.body.username

    try {
        database.collection("user").findOne({
            "username": {$regex: "^"+req.body.username+"$"}, 
            "password": req.body.password
            }, (err, user) => {
                if (err) throw err;
                if (user) {
                    console.log("User", username, "found")
                    bcrypt.compare(req.body.password, user.password, (err, passCheck) => {
                        if (err) throw err;
                        passCheck ? console.log("Password correct") : console.log("Password incorrect")
                        res.send(passCheck)
                    })
                } else {
                    console.log("User", username, "not found")
                    res.send(false); 
                } 
            }) 
    } catch (err) {
        console.error(err);
        res.send(false);
    }
})

// Registration attempt
// body: username, password
// returns: true if successful, false if unsuccessful
app.post('/api/register', (req, res) => {
    console.log("Attempted registration", req.body.username);
    const username = req.body.username;
    try {
        database.collection("user").findOne({
            "username": {$regex: "^" + newUser.username + "$"
            }}, (err, user) => {
                if (err) throw err;
                if(!user){
                    console.log("Username", username, "available");
                    bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
                        if (err) throw err;
                        const newUser = { username: username, password: hash, role: 1 };
                        database.collection("user").insertOne(newUser, (err, result) => {
                            
                            console.log("New user", newUser);

                            const newUserInfo = {
                                username: username,
                                group_name:"My K-pop Group",
                                name:"New User",
                                location:"Anywhere",
                                bio:"No bio yet."
                            }
                            database.collection("user_profile").insertOne(newUserInfo, (err, result) => {
                                if (err) throw err;
                                res.send(true);
                            })
                        })
                    })
                } else {
                    console.log("Username", username, "not available")
                    res.send(false)
                }
            })
    } catch (err) {
        console.error(err);
        res.send(false);
    }  
})

// Profile page
// params: username
// returns: user profile info (obj)
// returns false if unsuccessful
app.get('/api/profile/:username', function(req,res) {
    database.collection("user_profile").findOne({
        "username": { $regex: "^" + req.params.username + "$"}}, 
        (err, profile) => {
            if (err) throw err;
            res.send(profile);
    })
})

// User list
// returns: user list (array[obj])
// returns false if unsuccessful
app.get('/api/userlist', function(req,res) {
    try {
        database.collection("user_profile").find({}).sort({"username":1}).toArray((err, userList) => {
            if (err) throw err;
            res.send(userList);
        })
    } catch (err) {
        console.error(err);
        res.send(false);
    }  
})

// Update profile info
// body: username, group_name, name, location, bio
// returns: true if successful, false if unsuccessful
app.post('/api/edit', function(req,res) {
    const newProfile = { 
        username:req.body.username, 
        group_name:req.body.group_name, 
        name:req.body.name, 
        location:req.body.location, 
        bio:req.body.bio 
    };
    try {
        database.collection("user_profile").updateOne({
            "username": {$regex: "^" + req.body.username + "$"}
        }, 
        {$set: newProfile}, 
        (err, result) => {
            if (err) throw err;
            res.send(true);
    })
    } catch (err) {
        console.error(err);
        res.send(false);
    }  
})

// Delete account
// body: username
// returns: true if successful, false if unsuccessful
app.post('/api/deleteaccount', function(req,res) {
    try {
        database.collection("user").deleteOne({"username":{$regex: "^"+req.body.username+"$"}}, (err, result) => {
            if (err) throw err;

            database.collection("user_profile").deleteOne({"username":{$regex: "^"+req.body.username+"$"}}, (err ,result) => {
                if (err) throw err;
                console.log("Deleted account", req.body.username);
                res.send(true);
            })
        })
    } catch (err) {
        console.error(err);
        res.send(false);
    }
})
    

////// Personal group

// Add idol to personal group
app.post('/api/add', function(req,res) {
    var addMember = {username:req.body.username, member:req.body.member};

    database.collection("user_group_members").find(addMember).toArray(function(err, result) {
        if(!result[0]) {
            database.collection("user_group_members").insertOne(addMember, function(err, result) {
                res.send([addMember]);
            })
        } else {
            res.send([]);
        }
    })
})

// Remove idol from personal group
app.post('/api/remove', function(req,res) {
    var removeMember = {username:req.body.username, member:req.body.member};

    database.collection("user_group_members").find(removeMember).toArray(function(err, result) {
        if(result[0]) {
            database.collection("user_group_members").deleteOne(removeMember, function(err, result) {
                res.send([removeMember]);
            })
        } else {
            res.send([]);
        }
    })
})

// Retrieve personal group
app.get('/api/:username/mygroup', function(req,apires) {
    var username = req.params.username;
    var members = [];

    database.collection("user_group_members").find({"username":username})
    .sort({"member": 1})
    .project({"member":1})
    .toArray(function(err, db1res) {
        db1res.forEach(member=> {
            database.collection("members_info").findOne({"member_id":member.member}, function(err, db2res) {
                members.push(db2res);
                if(members.length === db1res.length) {
                    apires.send(members);
                }
            })
        })
    })
})

////// Leaderboard

// Retrieve leaderboard
app.get('/api/leaderboard', function(req, res) {

    database.collection("leaderboard").find({}).sort({"score":-1}).toArray(function(err, result) {
        res.send(result);
    })
})

// Add to leaderboard
app.post('/api/leaderboard/new', function(req, res) {
    var entry = {
        username: req.body.username,
        score: req.body.score,
        group_name: req.body.group_name,
        group_members: req.body.group_members,
        song: req.body.song,
        video_id: req.body.video_id,
        date: req.body.date
    }
    
    database.collection("leaderboard").find(entry).toArray(function(err,db1res) {
        if(!db1res[0]){
            database.collection("leaderboard").insertOne(entry, function(err,db2res){
                console.log("Leaderboard entry by", entry.username);
                res.send(entry);
            })
        } else {
            console.log("Leaderboard entry already exists");
                res.send(entry);
        }
    })
    
})

// Retrieve highest leaderboard entry for user


////// Connect to Spotify
var current_access_token;
var access_token_expiry;

var client_id = process.env.SPOTIFY_CLIENT_ID;
var client_secret = process.env.SPOTIFY_CLIENT_SECRET;

// Compare token expiry time
function tokenExpired() {
    if(access_token_expiry){
        console.log("Current token expires in", access_token_expiry - Date.now(), "ms");
        return Date.now() > access_token_expiry;
    } else return true;
    
}

// Return token according to expiry
async function checkExpiry() {
    if(tokenExpired()) {
        const new_token = await spotifyAuth();
        console.log("Using new token",new_token);
        return new_token;
    } else {
        console.log("Using current token");
        return current_access_token;
    }
}

// Get Spotify auth token
async function spotifyAuth() {
    const auth = await axios({
        url: "https://accounts.spotify.com/api/token",
        headers: {
            "Accept":"application/json",
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "post",
        auth: {
            username: client_id,
            password: client_secret
        },
        params: { grant_type:"client_credentials" }
      })
    .catch(err => {
        console.log(err);
        return;
    })
    console.log("Spotify auth:",auth.data);
    current_access_token = auth.data.access_token;
    access_token_expiry = (auth.data.expires_in * 1000) + Date.now();
    return auth.data.access_token;
}

checkExpiry();

// Get a group's top tracks
app.get('/api/tracks/:group', function(req, apires) {
    checkExpiry().then((token) => {
        var group = req.params.group;
        var artist_id;
    
        database.collection("groups").findOne({"group_name":group}, function(err, dbres) {
            artist_id = dbres.artist_id;
    
            console.log("Retrieving top tracks for", group, artist_id);
    
            axios({
                url: "https://api.spotify.com/v1/artists/" + artist_id + "/top-tracks",
                headers: {
                    "Accept":"application/json",
                    "Content-Type":"application/json",
                    "Authorization":"Bearer " + token
                },
                method: "get",
                params: { market:"CA" }
              })
            .then((axres) => {
                var tracks = [];
                axres.data.tracks.forEach(track => {
                    tracks.push({id:track.id, name:track.name, album:track.album.name, imageurl:track.album.images[1].url});
                })
                apires.send(tracks);
            })
            .catch(err => {
                console.log(err);
            })
        })
    })

    
})

// Get score for a performance
app.post('/api/performance', function(req, apires) {
    checkExpiry().then((token) => {

        var track_id = req.body.track_id;
        var singavg = req.body.singavg;
        var rapavg = req.body.rapavg;
        var danceavg = req.body.danceavg;
        
        // Get features
        axios({
            url: "https://api.spotify.com/v1/audio-features/" + track_id,
            headers: {
                "Accept":"application/json",
                "Content-Type":"application/json",
                "Authorization":"Bearer " + token
            },
            method: "get"
            })
        .then((axres) => {
            // Calculate score
            var m_sing = 1 - axres.data.speechiness;
            var m_rap = axres.data.energy;
            var m_dance = axres.data.danceability;

            var score = Math.round((((singavg * m_sing) + (rapavg * m_rap) + (danceavg * m_dance)) * 1000000)/6);

            console.log("Score is",score);
            apires.send({score:score});
        })
        .catch(err => {
            console.log(err);
            apires.send({score:-1});
        })
    
    })
})

////// Connect to YouTube 

// Get video
app.get('/api/video/:group/:song', function(req,apires) {
    var yt_api_key = process.env.YT_API_KEY;

    axios(
        {
            url: "https://www.googleapis.com/youtube/v3/search",
            params: {
                key: yt_api_key,
                q: req.params.group+" "+req.params.song,
                part: "snippet",
                maxResults: 1,
                type: "video",
                videoEmbeddable: true
            },
            method: "get"
        })
    .then((axres) => {
        console.log("YouTube access", req.params.group, req.params.song, "id",axres.data.items[0].id.videoId);
        apires.send({video_id:axres.data.items[0].id.videoId});
    })
    .catch(err => {
        console.log(err);
        apires.send();
    })
})

////// React
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build/index.html'));
  });
