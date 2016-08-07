# EventProcessor
Process a huge dataset of events in streaming way. The processor is written in node.js.

An example of the dataset is in file exmple.txt, of which each row is one event and in JSON format. 

How to use:
  
    From command line run "node main.js"
    
    The processor defaultly runs check up for the online file 
    "http://ew1-fscdev-ds-public.s3-website-eu-west-1.amazonaws.com/obfuscated_data.xz" 
    if there is no local file "obfuscated_data.xz" existing. 
    
    "obfuscated_data.xz" is a dataset with around 1.5 million events.


  
    Optionally, the processor can check up for other dataset files with the same structure
    as "obfuscated_data.xz":
    
    From command line run "node main.js <filename>"

  
  
