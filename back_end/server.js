const express = require('express');
const app = express()
const bodyParser = require('body-parser')
const fs = require('fs')
const axios = require('axios')
const bcrypt        = require('bcryptjs');
const jwt           = require('jsonwebtoken');
const authorize     = require('./middleware/authorize');

//Requirements for setting path/port on ubuntu instance.
const path = require('path');
const PORT = process.env.PORT || 8888;

//Static directory to be YOUR path to build folder.
app.use(express.static(__dirname + './../front_end/build'))


//to parse url encoded data
app.use(bodyParser.urlencoded({ extended: false }))
// to parse json data
app.use(bodyParser.json())
// cross origin 
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With,Authorization, Content-Type, Accept");
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});
//require and configure knex first
const knex = require('knex')({
  client: 'postgres',
  connection: {
    host     : '127.0.0.1',
    user     : 'postgres',
    password : 'postgres',
    database : 'mydb',
    charset  : 'utf8'
  }
});
const bookshelf = require('bookshelf')(knex);
const User = bookshelf.Model.extend({
  tableName:'users',
  meetupinfo:function(){
    return this.hasMany(MeetupInfo)
  }
})

const MeetupInfo = bookshelf.Model.extend({
  tableName:'meetupinfo',
  users:function(){
    return this.belongsTo(User)
  }
})

app.post('/encrypt',(req,res) => {
    let username = req.body.username;
    let password = req.body.password;
    //generate salt and create a hash the password
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
                // Store hash in your password DB. 
                if(err) console.log(err);

                let newUser = new User({
                  username:username,
                  password:hash
                })
                newUser.save().then(user=>{
                  return res.send(user.attributes)
                })
                .catch(error=>{
                  return res.status(500).json(error)
                })
                
            });
        });
});
//login point 
app.post('/login', (req,res) => {
    let username = req.body.username;
    let password = req.body.password;
    
    User.where({username:username}).fetch().then( 

      user=>{
        bcrypt.compare(password,user.attributes.password,(err,result)=>{
            if(result){
                let token = jwt.sign({username:username},'secretkey')
                res.json({token:token})
            }
            else{  
              res.status(404).send({token:null}) 
            }
          })
})

})


app.get('/private/record',authorize('secretkey'),(req,res)=>{
 
 
  User.where({username:req.decoded.username}).fetch().then(
    userit=>{
       res.send(userit.attributes)
    }
  )

})
app.post('/save',(req,res)=>{

                let newMeetupinfo = new MeetupInfo({
                  name:req.body.name,
                  lat:req.body.lat,
                  lon:req.body.lon,
                  user_id:req.body.userid,
                  time:req.body.time?req.body.time.time:'unknow'
                })
                console.log('i am here')
                console.log(newMeetupinfo)
                newMeetupinfo.save().then(user=>{
                  return res.send(user.attributes)
                })
                .catch(error=>{
                  return res.status(500).json(error)
                })
})

app.post('/meetup', (req, res) => {
    
let url = 'https://api.meetup.com/find/groups?&sign=true&photo-host=public&lon='+req.body.lng+'&lat='+req.body.lat+'&page=15&radius='+req.body.radius+'&key=322c4a3f48d312a576a29702a21e32'
axios.get(url)
.then(result=>{
   
     var meetupArr = result.data.map(item=>{
      
        return {'name':item.name,'lat':item.lat,'lon':item.lon,'url':item.link,'photo':item.key_photo,'time':item.next_event}
     })
 //console.log(meetupArr)

    res.send(meetupArr)
   // console.log(meetupArr)
  
})
.catch(err=>{
    res.status(403)
})

})

app.get('/getrecord/:id',(req,res)=>{
  MeetupInfo.where({user_id:req.params.id}).fetchAll().then(
    info=>{
      const infoArr = info.models.map(item=>{
       return item.attributes
      })
      res.send(infoArr);
    })
    .catch(error=>{
      return res.status(500).json(error)
        })
})

app.delete('/delete/:id',(req,res)=>{
  MeetupInfo.where({id:req.params.id}).destroy()
  
  .then( item=>{
    return res.send(item)
  }
  )
  .catch(error=>{
    console.log(error)
    return res.status(500).json(error)
  })

})



//Catchall route to send our index.html file no matter what.
app.get('*', function (req, res) {
    res.sendFile(path.resolve((__dirname + './../front_end/build/index.html')));
});

app.listen(PORT, () => {
  console.log('server is running on prot 8080')
})

