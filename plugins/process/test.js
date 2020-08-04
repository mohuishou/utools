let a = `
Handles  NPM(K)    PM(K)      WS(K)     CPU(s)     Id  SI ProcessName                                                  
-------  ------    -----      -----     ------     --  -- -----------                                                  
    486      40    42024      27580       4.67    448   1 Adobe CEF Helper                                             
   1090     135   130680      53640      15.53  10292   1 Adobe Desktop Service                                        
    255      16     3768       3552       1.38   9848   1 AdobeIPCBroker                                               
    353      19     7164       3844       0.83   8892   1 AdobeNotificationClient                                      
    211      13     2040        700              2884   0 AdobeUpdateService                                           
    218      12     2308       2208              3084   0 AGMService                                                   
    341      17     3692       3184              2648   0 AGSService                                                   
    447      25    20952       3532       0.41   7432   1 ApplicationFrameHost                                         
    174      10     6200      11356       0.19  14400   0 audiodg                                                      
    141       9     1656       1552       0.06   7768   1 browser_broker                                               
     64       5      688        188       0.02   9764   1 CCXProcess                                                   
    476      25     8692       6320       0.67   6572   1 ChsIME                                                       
    121       8     6512        896       0.16   9644   1 conhost                                                      
    119       8     3060       7524       0.02  11784   1 conhost                                                      
    324      21     8100       6992       1.70  10936   1 CoreSync                                                     
    917      83    24616      31384      11.84   4732   1 Creative Cloud                                               
    549      20     1864       1348               436   0 csrss                                                        
    645      23     2648       1992               536   1 csrss                                                        
    656      29    11364      11116       5.64   6316   1 ctfmon                                                       
    249      14     4076       3448              1516   0 dllhost                                                      
    214      16     3508       4280       0.25   2344   1 dllhost                                                      
    121       7     1436       2948       0.08   6848   1 dllhost                                                      
    978      66   231652     104824               460   1 dwm                                                          
   2714     143    83196     135672      88.94   6472   1 explorer       
`;
let reg = new RegExp(
  /(.+?)\s+(.+?)\s+(.+?)\s+(.+?)\s+(.+?)\s+(.+?)\s+(.+?)\s+\n/gi
);
console.log(a.match(reg));
