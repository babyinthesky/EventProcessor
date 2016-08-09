# EventProcessor
Event Processor takes a huge dataset of events as input file and processes it in streaming way. The Event Processor is written in node.js. Below texts we simplify "Event Processor" as "Processor".

An example of the dataset is in file exmple.txt, of which each row is one event and in JSON format. 

## How to use:
  
### Step1. Install node.js before hand.
    $ brew install nodejs

### Step2. Download file "main.js", "processor.js", "package.json" and save them to a folder.

### Step2. From the command line under this fodler run: 
    $ npm install 
    $ node main.js
    
If there is no local file "obfuscated_data.xz" exists, Processor downloads the file from online and continue to process: 
"http://ew1-fscdev-ds-public.s3-website-eu-west-1.amazonaws.com/obfuscated_data.xz" 
     
"obfuscated_data.xz" is a dataset with around 1.5 million events.
    
### Optionally, Processor can analyze for other dataset files with the same structure as "obfuscated_data.xz":
    
From the command line under the same folder run:
      
    $ node main.js <filename>
      
If the input filename does not exist locally, Processor quits.
      

### Others
An output example file is "output.log", which prints out the overall rows of the dataset, the launching times for different products, events with duplicated ID, events with suspicious timestamp, the amount of events at every hour and the device which has longest activity time. 

  
  
