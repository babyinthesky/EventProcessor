# EventProcessor
Event Processor takes a huge dataset of events as input file and processes it in streaming way. The Event Processor is written in node.js.

An example of the dataset is in file exmple.txt, of which each row is one event and in JSON format. 

How to use:
  
    Download file "main.js" and "processor.js" and save to a folder.
    
    From the command line under this fodler run: 
      "node main.js"
    
    The processor defaultly runs check up for the online file 
    "http://ew1-fscdev-ds-public.s3-website-eu-west-1.amazonaws.com/obfuscated_data.xz" 
    if there is no local file "obfuscated_data.xz" existing. 
    
    "obfuscated_data.xz" is a dataset with around 1.5 million events.
    
    Optionally, the processor can check up for other dataset files with the same structure
    as "obfuscated_data.xz":
    
    From the command line under the same folder run:
      "node main.js <filename>"
      

An output example file is "output.log", which prints out the overall rows of the dataset, the launching times for different products, events with duplicated ID, events with suspicious timestamp, the amount of events at every hour and the device which has longest activity time. 

  
  
