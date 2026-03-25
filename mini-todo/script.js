window.onload = function () {                                                                       
   const taskInput = document.getElementById("taskInput");                                            
   const addButton = document.getElementById("addButton");                                            
   const taskList = document.getElementById("taskList");                                           
                                                                                                       
   addButton.onclick = function () {                                                                   
   const taskText = taskInput.value.trim();                                                            
                                                                                                       
   if (taskText === "") {                                                                              
   alert("Type a task first.");                                                                        
   return;                                                                                             
   }                                                                                                   
                                                                                                       
   const li = document.createElement("li");                                                            
                                                                                                       
   const taskSpan = document.createElement("span");                                                    
   taskSpan.textContent = taskText;                                                                    
                                                                                                       
   const deleteButton = document.createElement("button") ;                                             
   deleteButton.textContent = "Delete";                                                                
   deleteButton.className = "delete-btn";                                                              
                                                                                                       
   deleteButton.onclick = function () {                                                                
   taskList.removeChild(li);                                                                           
   };                                                                                                  
                                                                                                       
   li.appendChild(taskSpan);                                                                           
   li.appendChild(deleteButton);                                                                       
   taskList.appendChild(li);                                                                           
                                                                                                       
   taskInput.value = "";      
   
   };                                                                                                  
   };                   
