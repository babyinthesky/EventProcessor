'use strict';

var fs = require('fs');
var zlib = require('zlib');
var util = require('util');
var Processor=require('./processor');
var http = require('http');

var processor=new Processor();
var file=process.argv[2]||'obfuscated_data.xz';

if(file!=='obfuscated_data.xz'){
  if (fs.existsSync(file)){
    console.log("Start Processing file "+file+"...");
    processor.startProcess(file);
  }
  else{
    console.log("Local file " + file + " does not exist!");
    return;
  }
}
else{
  if (fs.existsSync('obfuscated_data.xz')){
    console.log("Start Processing file obfuscated_data.xz...");
    processor.startProcess('obfuscated_data.xz');
  }
  else{
    console.log("Download file obfuscated_data.xz from online to continue test processing...")
    var localfile = fs.createWriteStream("obfuscated_data.xz");
    var request = http.get("http://ew1-fscdev-ds-public.s3-website-eu-west-1.amazonaws.com/obfuscated_data.xz", function(response) {
      console.log("Downloading...Please wait.");
      response.pipe(localfile);
      localfile.on('finish',function(){
        console.log("Start Processing...");
        processor.startProcess('obfuscated_data.xz');
      })
    });
  }
}
