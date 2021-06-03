
const express = require('express');
const app = express();
const path = require('path');
const bcrypt = require("bcrypt");
const { MongoClient } = require("mongodb");
const axios = require('axios');

const saltRounds = 10;

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

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
        MongoClient.connect(dburl, (err, db) => {
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
// returns error codes 404 if group not found, 500 if database error
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
                if (!group) {
                    res.sendStatus(404);
                    return;
                }
                res.send(group);
            })
        }  
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}) 

// Get list of members in group
// params: groupName
// returns: group members (array[obj])
// returns error codes 404 if members not found, 500 if database error
app.get('/api/groups/:groupName/members', (req, res) => {
    try {
        database.collection("members_info").find({"group":req.params.groupName}).toArray((err, members) => {
            if (err) throw err;
            if (members.length === 0) {
                res.sendStatus(404);
                return;
            }
            res.send(members);
        })  
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }  
})

// Get member from group + stage name
// params: groupName, memberName
// returns: member info (obj)
// returns error codes 404 if member not found, 500 if database error
app.get('/api/groups/:groupName/members/:memberName', (req, res) => {
    try {
        database.collection("members_info").find({"group":req.params.groupName, "stage_name":req.params.memberName}, (err, member) => {
            if (err) throw err;
            if (!member) {
                res.sendStatus(404);
                return;
            }
            res.send(member);
        })       
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
})

// Get member from member id
// params: memberId
// returns: member info (obj)
// returns error codes 404 if member not found, 500 if database error
app.get('/api/memberid/:memberid', (req, res) => {
    try {
        database.collection("members_info").find({"member_id":req.params.memberid}, (err, member) => {
            if (!member) {
                res.sendStatus(404);
                return;
            }
            res.send(member);
        })       
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
    
})

////// Account/Profile

// Login attempt
// body: username, password
// returns: true if successful, false if username does not exist
// returns error code 500 if database error
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
        res.sendStatus(500);
    }
})

// Registration attempt
// body: username, password
// returns: true if successful, false if account already exists
// returns error code 500 if database error
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
        res.sendStatus(500);
    }  
})

// Profile page
// params: username
// returns: user profile info (obj)
// returns error codes 404 if user not found, 500 if database error
app.get('/api/profile/:username', (req, res) => {
    try {
        database.collection("user_profile").findOne({
            "username": { $regex: "^" + req.params.username + "$"}}, 
            (err, profile) => {
                if (err) throw err;
                if (!profile) {
                    res.sendStatus(404);
                    return;
                }
                res.send(profile);
        })
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
})

// User list
// returns: user list (array[obj])
// returns false if unsuccessful
// returns error code 500 if database error
app.get('/api/userlist', (req, res) => {
    try {
        database.collection("user_profile").find({}).sort({"username":1}).toArray((err, userList) => {
            if (err) throw err;
            res.send(userList);
        })
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }  
})

// Update profile info
// body: username, groupName, name, location, bio
// returns: true if successful
// returns error code 500 if database error
app.post('/api/edit', (req, res) => {
    const newProfile = { 
        username:req.body.username, 
        group_name:req.body.groupName, 
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
        res.sendStatus(500);
    }  
})

// Delete account
// body: username
// returns: true if successful
// returns error code 500 if database error
app.post('/api/deleteaccount', (req, res) => {
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
        res.sendStatus(500);
    }
})
    

////// Personal group

// Add idol to personal group
// body: username, member
// returns true if successful, false if member already in user's group
// returns error code 500 if database error
app.post('/api/add', (req, res) => {
    const addMember = { username: req.body.username, member: req.body.member };

    try {
        database.collection("user_group_members").find(addMember, (err, member) => {
            if (err) throw err;
            if (!member) {
                database.collection("user_group_members").insertOne(addMember, (err, result) => {
                    res.send(true);
                })
            } else {
                res.send(false);
            }
        })
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
})

// Remove idol from personal group
// body: username, member
// returns true if successful, false if member not in user's group
// returns error code 500 if database error
app.post('/api/remove', (req, res) => {
    const removeMember = { username: req.body.username, member: req.body.member };

    try {
        database.collection("user_group_members").find(removeMember).toArray((err, member) => {
            if (err) throw err;
            if(member) {
                database.collection("user_group_members").deleteOne(removeMember, (err, result) => {
                    if (err) throw err;
                    res.send(true);
                })
            } else {
                res.send(false);
            }
        })
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
})

// Retrieve personal group
// params: username
// returns: members (arr[obj])
// returns error codes 404 if user not found, 500 if database error
app.get('/api/:username/mygroup', (req, res) => {
    const username = req.params.username;
    let myMembers = [];

    try {
        database.collection("user_group_members").find({"username":username})
        .sort({"member": 1})
        .project({"member":1})
        .toArray((err, membersList) => {
            if (err) throw err;
            if (membersList.length === 0) {
                res.sendStatus(404);
                return;
            }
            membersList.forEach(member => {
                database.collection("members_info").findOne({"member_id":member.member}, (err, memberInfo) => {
                    if (err) throw err;
                    myMembers.push(memberInfo);
                    if(myMembers.length === membersList.length) {
                        res.send(myMembers);
                    }
                })
            })
        })
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }

    
})

////// Leaderboard

// Retrieve leaderboard
// returns: entries (arr[obj])
// returns error code 500 if database error
app.get('/api/leaderboard', (req, res) => {
    try {
        database.collection("leaderboard").find({}).sort({"score":-1}).toArray((err, entries) => {
            if (err) throw err;
            res.send(entries);
        })
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
})

// Add to leaderboard
// body: username, score, groupName, groupMembers, song, videoId, date
// returns: true if successful, false if leaderboard entry already exists
// returns error code 500 if database error
app.post('/api/leaderboard/new', (req, res) => {
    const entry = {
        username: req.body.username,
        score: req.body.score,
        group_name: req.body.groupName,
        group_members: req.body.groupMembers,
        song: req.body.song,
        video_id: req.body.videoId,
        date: req.body.date
    }

    try {
        database.collection("leaderboard").findOne(entry).toArray((err, lbEntry) => {
            if (err) throw err;
            if(!lbEntry){
                database.collection("leaderboard").insertOne(entry, (err, result) => {
                    if (err) throw err;
                    console.log("Leaderboard entry by", entry.username);
                    res.send(true);
                })
            } else {
                console.log("Leaderboard entry already exists");
                    res.send(false);
            }
        })
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }    
})

////// Connect to Spotify
let current_access_token;
let access_token_expiry;

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

// Compare token expiry time
function tokenExpired() {
    if (access_token_expiry) {
        console.log("Current token expires in", access_token_expiry - Date.now(), "ms");
        return Date.now() > access_token_expiry;
    } else return true;
    
}

// Return token according to expiry
async function checkExpiry() {
    if (tokenExpired()) {
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
        console.error(err);
        return;
    })
    console.log("Spotify auth:",auth.data);
    current_access_token = auth.data.access_token;
    access_token_expiry = (auth.data.expires_in * 1000) + Date.now();
    return auth.data.access_token;
}

checkExpiry();

// Get a group's top tracks
// params: group
// returns: tracks (arr[obj])
// returns error code 500 if error with database or Spotify API
app.get('/api/tracks/:group', (req, res) => {
    checkExpiry().then((token) => {
        const group = req.params.group;
        let artistId;

        try {    
            database.collection("groups").findOne({"group_name":group}, (err, group) => {
                if (err) throw err;
                artistId = group.artist_id;
        
                console.log("Retrieving top tracks for", group, artistId);
        
                axios({
                    url: "https://api.spotify.com/v1/artists/" + artistId + "/top-tracks",
                    headers: {
                        "Accept":"application/json",
                        "Content-Type":"application/json",
                        "Authorization":"Bearer " + token
                    },
                    method: "get",
                    params: { market:"CA" }
                })
                .then((axres) => {
                    let tracks = [];
                    axres.data.tracks.forEach(track => {
                        tracks.push({id:track.id, name:track.name, album:track.album.name, imageurl:track.album.images[1].url});
                    })
                    res.send(tracks);
                })
                .catch(err => {
                    throw err;
                })
            })
        } catch (err) {
            console.error(err);
            res.send(500);
        }
    })
})

// Get score for a performance
// body: trackID, singAvg, rapAvg, danceAvg
// returns: score (obj)
// returns error code 500 if error with Spotify API
app.post('/api/performance', (req, res) => {
    checkExpiry().then((token) => {

        const trackId = req.body.trackId;
        const singAvg = req.body.singavg;
        const rapAvg = req.body.rapavg;
        const danceAvg = req.body.danceavg;
        
        // Get features
        axios({
            url: "https://api.spotify.com/v1/audio-features/" + trackId,
            headers: {
                "Accept":"application/json",
                "Content-Type":"application/json",
                "Authorization":"Bearer " + token
            },
            method: "get"
            })
        .then((axres) => {
            // Calculate score
            const m_sing = 1 - axres.data.speechiness;
            const m_rap = axres.data.energy;
            const m_dance = axres.data.danceability;

            const score = Math.round((((singAvg * m_sing) + (rapAvg * m_rap) + (danceAvg * m_dance)) * 1000000)/6);

            console.log("Score is",score);
            res.send({ score: score });
        })
        .catch(err => {
            console.error(err);
            res.sendStatus(500);
        })
    })
})

////// Connect to YouTube 

// Get video
// params: group, song
// returns: videoId (obj)
// returns error code 500 if error with YouTube API
app.get('/api/video/:group/:song', (req, res) => {
    const yt_api_key = process.env.YT_API_KEY;

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
        res.send({ videoId: axres.data.items[0].id.videoId });
    })
    .catch(err => {
        console.error(err);
        res.sendStatus(500);
    })
})

////// React
// app.get('/*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../build/index.html'));
// });
