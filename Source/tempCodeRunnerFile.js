app.post("/save",(req,res)=>{
//   const R_ID=req.params.B_ID;
//   //const R_B_ID=req.body.B_ID;
//   // let temp=req.body.B_ID;
//   let data={R_B_ID : req.body.B_ID};
//   let sql="INSERT INTO room SET ?";
//   //let sql="UPDATE room SET R_B_ID=temp,R_STATUS='OCCUPIED' WHERE R_ID=temp";
//   let query=con.query(sql,data,function(err,result){
//     if(err) throw err;
//     res.redirect("/guests");
//   });
// });