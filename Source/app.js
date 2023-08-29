const express=require("express");
const bodyParser=require("body-parser");
const app=express();
const mysql=require('mysql2');
const path = require("path")
const port=process.env.PORT||3000;

//Conection to database
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "vivek@0321",
  port:'3306'
});

con.connect((err)=>{
  if (err) throw err;
  else console.log("Connected!");
  // con.query("CREATE DATABASE mydb", function (err, result) {
  //   if (err) throw err;
  //   console.log("Database created");
  // });
  con.query("USE mydb", function (err, result) {
    if (err) throw err;
    console.log("Database changed");
  });
  // var sql = "CREATE TABLE guest(G_ID INT primary key NOT NULL,G_NAME VARCHAR(30) NOT NULL,C_IN DATE NOT NULL,C_OUT DATE NOT NULL,B_ID INT NOT NULL)";
  //   con.query(sql, function (err, result) {
  //     if (err) throw err;
  //     console.log("Guests Table created");
  //   });
  //   var sql = "CREATE TABLE room(R_ID INT primary key NOT NULL,R_STATUS varchar(30) DEFAULT "AVAILABLE" NOT NULL,R_B_ID INT)";
  //   con.query(sql, function (err, result) {
  //     if (err) throw err;
  //     console.log("Rooms Table created");
  //   });  
    // var sql = "CREATE TABLE staff(S_ID INT primary key NOT NULL,S_NAME varchar(30) NOT NULL,S_CONTACT INT NOT NULL,S_JOB varchar(20) NOT NULL,S_SAL INT NOT NULL)";
    // con.query(sql, function (err, result) {
    //   if (err) throw err;
    //   console.log("Staff Table created");
    // });
  //var sql = "INSERT INTO room(R_ID) values (101),(102),(103),(104),(105),(201),(202),(203),(204),(205),(301),(302),(303),(304),(305);";
  //   con.query(sql, function (err, result) {
  //     if (err) throw err;
  //     console.log("Rooms inserted in Rooms table");
  //   }); 
  // var sql = "CREATE TABLE admin(A_ID varchar(10) primary key not null,Password varchar(20) not null)";
  // con.query(sql, function (err, result) {
  //   if (err) throw err;
  //   console.log("Admin Table created");
  // });
  // var sql = "INSERT INTO admin values ('20JE0373','Vivek'),('20JE0272','Shreeya'),('20JE0250','Naipunya')";
  // con.query(sql, function (err, result) {
  //   if (err) throw err;
  //   console.log("Admins created");
  // }); 
});

con.on('error', function(err) {
    console.log("[mysql error]",err);
});

//View Path Directory
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');
app.use(express.json());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.urlencoded());


app.use("/styles",express.static(__dirname + "/styles"));

app.get("/",(req,res)=>{
    res.render("home");
});

app.get("/home",(req,res)=>{
  res.render("home");
});

app.get("/login",(req,res)=>{
  res.render("login");
});


app.post("/login",(req,res)=>{
    var A_ID = req.body.A_ID
    var Password = req.body.Password
    if(A_ID && Password)
    {
        let sql="SELECT * FROM admin WHERE A_ID='"+A_ID+"'";
        con.query(sql, function (err, result){
            if(result[0].Password== Password)
            {
              res.redirect("/guests");
            }
            else
            {
              res.send("Invalid credentials");
            }
        });
    }
    else 
    {
        res.send("Please enter admin id and password")
    }
});


//DISPLAY STAFF 
app.get("/staff",(req,res)=>{
  let sql="SELECT * FROM staff";
    let query=con.query(sql, function (err, rows) {
      if (err) throw err;
      res.render("staff",{staff : rows});
    });
});

//ADD STAFF
app.post('/saveSTAFF',(req,res)=>{
    const S_ID=req.params.S_ID;
    let data={ S_ID:req.body.S_ID, S_NAME:req.body.S_NAME, S_CONTACT:req.body.S_CONTACT, S_JOB:req.body.S_JOB, S_SAL:req.body.S_SAL};
    let sql="INSERT INTO staff SET ?";
    let query=con.query(sql,data, function (err, result) {
      if (err) throw err;
      res.redirect("/staff");
    });
});

//UPDATE STAFF INFO
app.post('/updatestaff',(req,res)=>{
  const S_ID=req.body.S_ID;
  let sql=" UPDATE staff SET S_NAME='"+req.body.S_NAME+"', S_CONTACT="+req.body.S_CONTACT+", S_JOB='"+req.body.S_JOB+"', S_SAL="+req.body.S_SAL+" WHERE S_ID="+S_ID;
  let query=con.query(sql, function (err, result) {
    if (err) throw err;
    res.redirect("/staff");
  });
});

//DELETE STAFF
app.post('/delete',(req,res)=>{
  const S_ID=req.body.S_ID;
  let sql="DELETE FROM staff WHERE S_ID="+S_ID;
  let query=con.query(sql, function (err, result) {
    if (err) throw err;
    res.redirect("/staff");
  });
});

//DISPLAY GUESTS INFO
app.get("/guests",(req,res)=>{
  let sql="select G_ID, G_NAME, C_IN, C_OUT, B_ID,DATEDIFF(C_OUT,C_IN)*2500 as AMOUNT FROM guest";
  let query=con.query(sql, function (err, rows) {
    if (err) throw err;
    res.render("guests",{guest : rows});
  });
});

// ADD GUESTS INFO
// app.post("/save",(req,res)=>{
//   let data ={G_ID:req.body.G_ID, G_NAME:req.body.G_NAME, C_IN:req.body.C_IN, C_OUT:req.body.C_OUT, B_ID:req.body.B_ID};
//   let sql="INSERT INTO guest SET ?";
//     let query1=con.query(sql,data,function (err, result) {
//       if (err) throw err;
//     });
//     let sql1= "UPDATE room SET R_B_ID="+req.body.B_ID+",R_Status='OCCUPIED' WHERE R_ID="+req.body.B_ID;
//     let query2=con.query(sql1,function(err,result){
//       if(err) throw err;
//       res.redirect("/guests");
//     });
// });
app.post("/save",(req,res)=>{
  const B_ID=req.params.B_ID;
  let data ={G_ID:req.body.G_ID, G_NAME:req.body.G_NAME, C_IN:req.body.C_IN, C_OUT:req.body.C_OUT, B_ID:req.body.B_ID};
  let sql="INSERT INTO guest SET ?";
    let query1=con.query(sql,data, function (err, result) {
      if (err) throw err;
      let sql1="UPDATE room SET R_B_ID="+req.body.B_ID+",R_STATUS='OCCUPIED' WHERE R_ID="+req.body.B_ID;
      let query2=con.query(sql1,function(err,result){
      if(err) throw err;
      res.redirect("/guests");
  });
    });
});

//UPDATE GUESTS INFO
app.post('/update',(req,res)=>{
  const G_ID=req.body.G_ID;
  let sql="UPDATE guest SET G_NAME='"+req.body.G_NAME+"',C_OUT='"+req.body.C_OUT+"' WHERE G_ID="+G_ID;
  let query=con.query(sql,function(err,result){
    if(err) throw err;
    res.redirect("/guests");
  });
});

//CHECK-OUT GUEST
app.post('/deleteguest',(req,res)=>{
  var G_ID=req.body.G_ID;
  let x="SELECT * from guest where G_ID="+G_ID;
    let query=con.query(x,function(err,result){
      if(err) throw err;
      var a=result[0].B_ID;
      let sql1="UPDATE room SET R_B_ID=null,R_STATUS='AVAILABLE' WHERE R_ID="+a;
      let query1=con.query(sql1,function(err,result){
        if(err) throw err;
      });
    });
    let sql="DELETE FROM guest WHERE G_ID="+G_ID;
    let query1=con.query(sql,function(err,result){
      if(err) throw err;
      res.redirect("/guests");
    });
});

//DISPLAY ROOMS INFO
app.get('/rooms',(req,res)=>{
  let sql="SELECT guest.G_ID,room.R_ID,guest.G_NAME FROM room LEFT JOIN guest ON room.R_B_ID=guest.B_ID";
  let query=con.query(sql,function(err,rows){
    if(err) throw err;
    res.render("rooms",{room : rows});
  });
});


app.listen(port,()=>{
    console.log(`Server listening at port ${port}`);
})