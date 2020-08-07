
// ! ===============================================
// npm install mongoose
const mongoose = require('mongoose');

// ! Require MongoDB Atlas key link to here:
const db = require('./config/keys').mongoAtlas
// ! ===============================================

var express = require('express');
var bodyParser = require('body-parser');


var app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use( bodyParser.json());


app.set('view engine', 'hbs');

// ! ===============================================

mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Create Collections: "tasks"
 
var taskSchema = new mongoose.Schema({

    task: String,
    date: Date

});

var Task = mongoose.model('tasks', taskSchema);


// ! ===============================================

// Get Request - get data from server to page 

app.get('/',function(Request,response){

  Task.find(function(err,tasks){
    if (err) return console.log(err);
    response.render('login',{list : tasks});

  })


});

// Post Request - sent data from page to server

app.post('/insert', function(request,response){

  new Task({ task: request.body.task, date:request.body.date}).save(
    function(err, Task){
      if (err) response.redirect('/');
      response.send('Please enter new TASK!')
    }
  );
});

// Delete : Get Request

app.get('/delete', function(request,response){

  var id = request.query.id;

  if(id){
    Task.deleteOne({_id:id}, function(err, tasks){
      if(err) throw err;
      response.redirect('/');
    });
  }else{
    response.send('Please enter Id');
    response.end();
  }
});

app.listen(5000);
