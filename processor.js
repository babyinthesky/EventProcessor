var xz = require('xz');
var fs = require('fs');

var Processor = function(){

  this.launches = {};  //records the launched times for each product
  this.firstLaunch={}; //records the number of first launches for each product
  this.eventList={};   //records every event_id as property and the number of occurence as value
  this.duplicaList=[]; //records the duplicated event_id
  this.timeErr=0;      //the number of events that send_timestamp is larger than received_timestamp
  this.timeCounter=new Array(25).join(0).split('').map(parseFloat); //records the number of events for every hour
  this.deviceRecord={};//records every device_id as property and an object with timestamp of first/last event as value
}

/*
Start to process the file of event list.
*/
Processor.prototype.startProcess=function(file){
  var reader;
  var data = '';
  var rowCounter=0;
  var pro = this;

  var arrfile=file.split('.');
  if(arrfile[arrfile.length-1]!=='xz'){
    reader=fs.createReadStream(file);
  }
  else{
    reader=new xz.Decompressor();
    fs.createReadStream(file).pipe(reader);
  }

  reader.on('data',function(chunk){
    if(Buffer.isBuffer(chunk)) data+=chunk.toString();
    var endOfRow=data.indexOf('\n');
    while(endOfRow>0){
      rowCounter++;
      var row = JSON.parse(data.slice(0,endOfRow+1));
      pro.analyze(row);
      data=data.slice(endOfRow+1);
      endOfRow=data.indexOf('\n');
    }
    console.log('Read: '+chunk.length+' Bytes');
  });

  reader.on('end',function(){
    console.log('Number of Rows:'+ rowCounter + '\n');
    pro.printResult();
  })

  reader.on('error', function(err){
     console.log("Error: " + err.stack);
  });
}

/*
Call each procedure for analysis
*/
Processor.prototype.analyze=function(row){
  this.countLaunch(row);
  this.detectDuplica(row);
  this.checkTimestamp(row);
}

/*
Count the times of launching and first launching for each product
*/
Processor.prototype.countLaunch=function(row){
  if((row.type==="launch")&&(row.hasOwnProperty('source'))){
    var product=row.source;
    if(product!==''){
      if(this.launches.hasOwnProperty(product)) this.launches[product]++;
      else {
        this.launches[product]=0;
        this.firstLaunch[product]=[];
      }
      if(row.device.hasOwnProperty('device_id')){
        var deviceId=row.device.device_id;
        if((deviceId!=='')&&(this.firstLaunch[product].indexOf(deviceId)<0)){
          this.firstLaunch[product].push(deviceId);
        }
      }
    }
  }
}

/*
Detect which event_id has been duplicated
*/
Processor.prototype.detectDuplica=function(row){
  if(row.hasOwnProperty('event_id')){
    var event=row.event_id;
    if(event!==''){
      if(this.eventList.hasOwnProperty(event)){
        this.eventList[event]++;
        if(this.duplicaList.indexOf(event)<0) this.duplicaList.push(event);
      }
      else{
        this.eventList[event]=1;
      }
    }
  }
}

/*
Check the timestamp of each event and write down:
 1. the overall number of occuring events for each hour(24h)
 2. the number of events that send_timestamp is larger than received_timestamp
 3. the timstamp of first and last event for each device_id
*/
Processor.prototype.checkTimestamp=function(row){
  var sendTime=row.time.send_timestamp;
  var recvTime = row.sender_info.received_timestamp;
  var time= new Date(sendTime);
  var hour=time.getHours();

  //increase the counter of events for the corresponding hour
  this.timeCounter[hour]++;

  //record the errors that send_timestamp is bigger than received_timestamp
  if(parseInt(sendTime)>parseInt(recvTime)) {
    this.timeErr++;
  }

  //record the timestamp of the first and last event for each device_id:
  var deviceId=row.device.device_id;
  if (this.deviceRecord.hasOwnProperty(deviceId)){
    this.deviceRecord[deviceId].last=parseInt(recvTime);
  }
  else {
    this.deviceRecord[deviceId]={};
    this.deviceRecord[deviceId].first=parseInt(recvTime);
    this.deviceRecord[deviceId].last=parseInt(recvTime);
  }
}

/*
Find the device with longest activity time
*/
Processor.prototype.findMaxTimeGap=function(){
  var pro=this;

  var maxTimeGap=Math.max.apply(Math, Object.keys(pro.deviceRecord).map(function (key) {
    return (pro.deviceRecord[key].last-pro.deviceRecord[key].first);
  }));

  console.log("The longest activity time is : " + maxTimeGap/3600000 + ' hours.');

  var maxDeviceId=Object.keys(pro.deviceRecord).find(function(key){
    var diffTime = pro.deviceRecord[key].last-pro.deviceRecord[key].first;
    return diffTime == maxTimeGap;
  });

  return maxDeviceId;
}

/*
Print out all the records.
This function should be called only in the end when the whole event file has been fully streamly readed.
*/
Processor.prototype.printResult=function(){
  var pro=this;
  console.log('***************************************************************\n');

//Print out a list of detailed launch information for each product
  Object.keys(pro.launches).forEach(function(productName){
    console.log('Products:'+productName+' | Lauch Times:'+pro.launches[productName]
    +' | First Time Lauches:'+pro.firstLaunch[productName].length);
  });
  console.log('***************************************************************\n');

//Print out the duplicted event_id and the duplicated times
  console.log("There are all together "+ this.duplicaList.length +" 'event_id' duplicated.")
  this.duplicaList.forEach(function(value,index){
    console.log("'event_id' "+value+" duplicated "+(pro.eventList[value]-1).toString()+" times.")
  })
  console.log('***************************************************************\n');

//Print out the number of events from which send_timestamp is later than received_timestamp
  console.log("'send_timestamp' is bigger than 'received_timestamp' happend "+this.timeErr+' times.\n');
  console.log('***************************************************************\n');

//Print out the number of events for every hour and the hour with minimal events
  this.timeCounter.forEach(function(value,index){
      console.log("Number of events at hour "+index+' is: '+pro.timeCounter[index]);
  })

  var minEvents = Math.min.apply(Math, pro.timeCounter);
  var minHour = pro.timeCounter.indexOf(minEvents);
  console.log("The least active hour is hour "+minHour);
  console.log('***************************************************************\n');

//Print out which device_id has the longest activity time
  console.log('The device with longest activity time has ID: '+this.findMaxTimeGap());
  console.log('***************************************************************\n');
  console.log('Program ended.')
}

module.exports= Processor;
