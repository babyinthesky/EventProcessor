# EventProcessor
Process a huge dataset of events in streaming way. The processor is written in node.js.

An example of the dataset is in file exmple.txt, of which each row is one event and in JSON format. 

How to use:
  
    From command line run "node main.js"
    
    The processor defaultly runs check up for the online file 
    "http://ew1-fscdev-ds-public.s3-website-eu-west-1.amazonaws.com/obfuscated_data.xz" 
    if there is no local "obfuscated_data.xz" file. 
    
    "obfuscated_data.xz" is a dataset with around 1.5 million events.
  
  
