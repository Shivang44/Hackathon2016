
var routes = [
  {
        method: 'GET',
        path: '/public/{param*}',
        handler: {
            directory: {
                path: 'public/'
            }
        }
  },
  
  {
    method: 'GET',
    path:'/', 
    handler: function (request, reply) {
      reply.file('views/index.html');
    }
  }, 
  

  {
    method: 'GET',
    path: '/hello',
    handler: function(request, reply) {
      console.log(request.query.name);
      
      reply('Worked!');
    }
  },
  {
    method: 'POST',
    path: '/view',
    handler: function (request, reply) {
      
      var pg = require('pg');
      var conString = "postgres://dictsigh:JHp8LzQJs3Y2aTHHId7QNiJpbJVqGcGW@elmer.db.elephantsql.com:5432/dictsigh";
      var client = new pg.Client(conString);
      var hasZipCode = true;
      
      if (typeof request.payload.location === "undefined") {
        hasZipCode = false;
      }
      
      client.connect(function(err){
        if (err) {
          return console.error(err);
        }
        
      // Queries
      var dataArray = [request.payload.dtp , request.payload.parking , request.payload.ramp , request.payload.tableheight , request.payload.waterheight , request.payload.bathacc , request.payload.doorwidth, request.payload.rail, request.payload.type];
      //console.log(request.payload);
      console.log(dataArray);
      if (!hasZipCode) {
        client.query("SELECT * FROM access WHERE dtp >= ($1) AND parking >= ($2) AND ramp >= ($3) AND tableheight >= ($4) AND waterheight >= ($5) AND bathacc >= ($6) AND doorwidth >= ($7) AND rail >= ($8) AND type = ($9)", dataArray, function(err, result){
          client.end();
          reply(JSON.stringify(result.rows));
        });
      } else {
        dataArray.push(request.payload.location);
        client.query("SELECT * FROM access WHERE dtp <= ($1) AND parking >= ($2) AND ramp >= ($3) AND tableheight >= ($4) AND waterheight >= ($5) AND bathacc >= ($6) AND doorwidth >= ($7) AND rail >= ($8) AND location = ($9) AND type = ($10)", dataArray, function(err, result){
          client.end();
          reply(JSON.stringify(result.rows));
        });
      }
          
          
          
        
        
      });
      
      

    }
  },
  {
    method: 'GET',
    path:'/view', 
    handler: function (request, reply) {
      
      var type = request.query.type;
      var location = request.query.zipcode;
      
      
      
      
      //////////////////////////////////// FROM HERE
      var pg = require('pg');
      var conString = "postgres://dictsigh:JHp8LzQJs3Y2aTHHId7QNiJpbJVqGcGW@elmer.db.elephantsql.com:5432/dictsigh";
      var client = new pg.Client(conString);
      client.connect(function(err) {
        if(err) {
          return console.error('could not connect to postgres', err);
        }
        
        var query = "SELECT * FROM access LEFT JOIN review ON (review.refaddress = access.address) WHERE type=($1) AND location=($2)";
        var dataArray = [type, location];
        if (location === "") {
          query = "SELECT * FROM access LEFT JOIN review ON (review.refaddress = access.address) WHERE type=($1)";
          dataArray = [type];
        }
        
        client.query(query, dataArray, function(err, result) {
       
        if(err) {
          return console.error('error running query', err);
        }
          
          
      ///////////////////////////////// TO HERE, GETTING DATA FROM DB
      
          reply.view('view', {
            title: 'View places',
            data: result.rows,
            zipCode: location,
            type: type
          });
          
          
          
          //output: Tue Jan 15 2013 19:12:47 GMT-600 (CST)
          client.end();
        });
      });
      
      
      
    }
  },
  {
    method: 'GET',
    path: '/redeem',
    handler: function(request, reply) {
      reply.file('views/redeem.html');
  }
  },
  {
    method: 'GET',
    path: '/add',
    handler: function(request, reply) {
      reply.file('views/add.html');
    }
  },
  {
    method: 'GET',
    path: '/thankyou',
    handler: function(request, reply) {
      reply.file('views/thankyou.html');
    }
  },
  {
  method: 'POST',
  path: '/add',
  handler: function(request, reply) {
    // Get variables
    var name = request.payload.name;
    var location = request.payload.zipCode;
    var type = request.payload.type;
    var dtp = parseInt(request.payload.dtp);
    var ramp = parseInt(request.payload.ramp);
    var parking = parseInt(request.payload.parking);
    var tableheight = parseInt(request.payload.tableheight);
    var waterheight = parseInt(request.payload.waterheight);
    var bathacc = parseInt(request.payload.bathacc);
    var doorwidth = parseInt(request.payload.doorwidth);
    var rail = parseInt(request.payload.rail);
    var review=request.payload.quickreview;
    var review2=request.payload.quickreview;
    var address = request.payload.address;
    var address2 = address;
    var address3 = address;
    var address4 = address; 
    var address5 = address;
    var Revaddress = address;
        
    var query = "INSERT INTO access (name, location, type, dtp, ramp, parking, tableheight, waterheight, bathacc, doorwidth, rail, address) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)";
    var dataArray = [name, location, type, dtp, ramp, parking, tableheight, waterheight, bathacc, doorwidth, rail, address];
    //console.log(dataArray);
    
    
     //////////////////////////////////// Insert data into DB
     
      var pg = require('pg');
      var conString = "postgres://dictsigh:JHp8LzQJs3Y2aTHHId7QNiJpbJVqGcGW@elmer.db.elephantsql.com:5432/dictsigh";
      var client = new pg.Client(conString);
      
      
      
      client.connect(function(err) {
        if(err) {
          return console.error('could not connect to postgres', err);
        }
        client.query("SELECT COUNT(*) FROM access WHERE address = ($1)", [address], function(err, result) {
          var count = result.rows[0].count;
          if(count == 0)
          {
              // NOT IN DB. INSERT.
              // WHERE DATA IS INSERTED
              console.log('ZERO ROWS');
            client.query(query, dataArray, function(err, result) {
              if(err) {
                return console.error('error running query', err);
              }
              

              // insert into review (reviews, refId);
              client.query("INSERT INTO review (reviews, refaddress) values($1, $2)", [review, Revaddress], function(err, result) {
                  if (err) {
                    return console.error(err);
                  }
                  
                  console.log(result);
                
                  reply.redirect('/thankyou');
                  client.end();
              });

              
              
              
               
              
              
              
            });
            
            
          } else if (count == 1) {
            // IN DB. AVERAGE => INSERT.
            console.log('MULTIPLE ROWS');
            // QUERY START
             client.query("SELECT * FROM access WHERE address=($1)", [address2], function(err,result2){
               if (err) {
                 return console.error('some error...');
               }
               
                var count = parseInt(result2.rows[0].counts, 10);
               
                //console.log("old result",result2.rows[0].dtp);
                //console.log("new dtp: ", dtp);
                var oldDtp = parseInt(result2.rows[0].dtp);
                oldDtp = oldDtp*count;
                oldDtp=oldDtp+dtp;
                oldDtp = oldDtp/(count+1);
                
                var oldRamp = parseInt(result2.rows[0].ramp);
                oldRamp=oldRamp * count;
                oldRamp=oldRamp+ramp;
                oldRamp = oldRamp / (count+1);
                
                var oldParking = parseInt(result2.rows[0].parking);
                oldParking=oldParking* count;
                oldParking=oldParking+parking;
                oldParking= oldParking/(count+1);
                
                var oldTableheight = parseInt(result2.rows[0].tableheight);
                oldTableheight=oldTableheight* count;
                oldTableheight=oldTableheight+tableheight;
                oldTableheight= oldTableheight/(count+1);
                
                var oldWaterheight = parseInt(result2.rows[0].waterheight);
                oldWaterheight=oldWaterheight* count;
                oldWaterheight=oldWaterheight+waterheight;
                oldWaterheight= oldWaterheight/(count+1);
                
                var oldBathacc = parseInt(result2.rows[0].bathacc);
                oldBathacc=oldBathacc* count;
                oldBathacc=oldBathacc+bathacc;
                oldBathacc= oldBathacc/(count+1);
                
                var oldDoorwidth = parseInt(result2.rows[0].doorwidth);
                oldDoorwidth=oldDoorwidth*count;
                oldDoorwidth=oldDoorwidth+doorwidth;
                oldDoorwidth=oldDoorwidth/(count+1);
                
                var oldRail = parseInt(result2.rows[0].rail);
                oldRail = oldRail * count;
                oldRail=oldRail+rail;
                oldRail = oldRail / (count+1);
                
                count++;
                var updatedValues = [location, type, Math.round(oldDtp), name, Math.round(oldRamp), Math.round(oldParking), Math.round(oldTableheight), Math.round(oldWaterheight), Math.round(oldBathacc), Math.round(oldDoorwidth), Math.round(oldRail), address4, count];
                
                
                // DELETE ROW
                client.query("DELETE FROM access WHERE address = ($1)", [address3], function(err, result) {
                    if (err) {
                      console.error('Could not delete');
                    }
                    client.query("INSERT INTO access (location, type, dtp, name, ramp, parking, tableheight, waterheight, bathacc, doorwidth, rail, address, counts) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)", updatedValues, function(err, result) {
                      if (err) {
                        console.error(err);
                      }
                      console.log('INSERTED VALUSE!!!!');
                      reply.redirect('/thankyou');
                      client.end();
                    });
                });
                
                // UPDATE that SINGLE row
                
         
               
               
             });
            // QUERY END
          
          } else {
            console.error('COUNT NOT ZERO OR ONE. ERROR ERROR ERROR');
          }
          
          
          

          
          
          
          
        });
        
        

      });
    

  }
  }
];

module.exports = routes;