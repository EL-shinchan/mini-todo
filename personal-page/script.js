   window.onload = function () {                                                                                                                           
   const mainText = document.getElementById("mainText");                                                                                                  
   const aboutButton = document.getElementById("aboutButton");                                                                                            
   const buildButton = document.getElementById("buildButton");                                                                                            
                                                                                                                                                           
   const boxAi = document.getElementById("boxAi") ;                                                                                                        
   const boxBuilder = document.getElementById("boxBuilder");                                                                                              
   const boxDiscipline = document.getElementById("boxDiscipline");                                                                                        
   const boxGrowth = document.getElementById("boxGrowth");                                                                                                
                                                                                                                                                           
   function clearActiveBoxes() {                                                                                                                           
   boxAi.classList.remove("active-box");                                                                                                                  
   boxBuilder.classList.remove("active-box");                                                                                                             
   boxDiscipline.classList.remove("active-box");                                                                                                          
   boxGrowth.classList.remove("active-box");                                                                                                              
   }                                                                                                                                                       
                                                                                                                                                           
   aboutButton.onclick = function () {                                                                                                                     
   mainText.textContent = "I am Eddie, 17 years old, learning from zero, building discipline, and trying to become sharper, stronger, and harder to break.";                                                                                                                                                  
                                                                                                                                                           
   clearActiveBoxes();                                                                                                                                     
   boxDiscipline.classList.add("active-box");                                                                                                             
   boxGrowth.classList.add("active-box");                                                                                                                 
   };                                                                                                                                                      
                                                                                                                                                           
   buildButton.onclick = function () {                                                                                                                     
   mainText.textContent = "Right now I am building coding skills, learning AI, making projects, and turning small daily effort into something real.";      
                                                                                                                                                           
   clearActiveBoxes();                                                                                                                                     
   boxAi.classList.add("active-box" );                                                                                                                     
   boxBuilder.classList.add("active-box");                                                                                                                
   };                                                                                                                                                      
   };                                                                                                                                                                                
