var budgetController=(function(){
    
      var Expense = function(id,description,value){
          this.id=id;
          this.description=description;
          this.value=value;
          this.percent=-1;
      };               
       var Income = function(id,description,value){
          this.id=id;
          this.description=description;
          this.value=value;
      } ; 
    
    var calcTotal=function(type){
        var sum=0;
        
        data.allItems[type].forEach(function(current,index,array){
            sum += current.value;    
        });
        
        data.totals[type]=sum;
        
    };
    
    var data={
        allItems:{
             exp:[],
             inc:[]
        },
      
        totals:{
             exp:0,
             inc:0  
        } ,
        
        budget:0,
        percentage:-1
        
    } ;
    
    Expense.prototype.calcpercent = function(totalincome){
        if(totalincome>0)
            this.percent=Math.round(this.value/totalincome*100);
        else
            this.percent=-1;
        
    }
    
    Expense.prototype.getpercent=function(){
        return this.percent;
    }
    
    return{
      addItem: function(type,des,val){
          var newItem,ID;
          // create a new id
          if(data.allItems[type].length>0)
            ID=data.allItems[type][data.allItems[type].length-1].id + 1;
          else
             ID=0; 
          // add item in exp or inc
          if(type==='exp')
            newItem =new Expense(ID,des,val);
          else if(type==='inc')
            newItem =new Income(ID,des,val);
          
          //pushing the new Item in our data structure
          data.allItems[type].push(newItem);
          
          //returning the new element
          return newItem;
      },
        
       
          deleteItem: function(type, id) {
            var ids, index;
            
            // id = 6
            //data.allItems[type][id];
            // ids = [1 2 4  8]
            //index = 3
            
            ids = data.allItems[type].map(function(current) {
                return current.id;
            });

            index = ids.indexOf(id);

            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
            
        },
        calculateBudget: function(){
          //1. add total incomes and expenses
            calcTotal('inc');
            calcTotal('exp');
          
        //2.calc the bugdet inc-exp
            data.budget=data.totals.inc-data.totals.exp;
     
        //3. calc percentage  
            if(data.totals.exp>0)
                data.percentage = (data.totals.exp/data.totals.inc) *100;
            else
                data.percentage=-1;
            
        },
        calculatepercentage: function(){
            
            data.allItems.exp.forEach(function(cur){
                 cur.calcpercent(data.totals.inc);
            });
            
        },
        getpercent:function(){
            var allpercent=data.allItems.exp.map(function(cur){
                    return cur.getpercent();
            })  ;  
            
            return allpercent;
        },
        getBudget:function(){
            return {
                budget: data.budget,
                percentage: data.percentage,
                totalinc: data.totals.inc,
                totalexp:data.totals.exp
            }  
        },
       testing : function(){
           console.log(data);                    
       } 
      
    };

                      
})();


var UIController=(function(){
     var DomStrings= {
         inputtype:'.add__type',
         descriptiontypr:'.add__description',
         valuetype:'.add__value',
         inputbtn:'.add__btn',
         incomeContainer:'.income__list',
         expensesContainer:'.expenses__list',
         incomelabel:'.budget__income--value',
         expenseslabel:'.budget__expenses--value',
         budgetlabel:'.budget__value',
         percentagelabel:'.budget__expenses--percentage',
         container:'.container',
         expensespercents:'.item__percentage'
         
     };
     return{
         getinput:function(){
             
         return{
            type:document.querySelector(DomStrings.inputtype).value,
            description:document.querySelector(DomStrings.descriptiontypr).value,
            value:parseFloat(document.querySelector(DomStrings.valuetype).value)
            };     
          },
          getDomStrings:function(){
            return DomStrings;
          },
          addListItem: function(obj,type){
              
              //create html string with placeholder
              var html,element;
              if(type==='inc'){
                  element=DomStrings.incomeContainer;
              html='<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
              }
              else{
                  element=DomStrings.expensesContainer;
                  html='<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
              }
              // adding actual data by replacing
              var newHtml;
              
              newHtml=html.replace('%id%',obj.id);
              newHtml=newHtml.replace('%description%',obj.description);
              newHtml=newHtml.replace('%value%',obj.value);
              
              //inserting html into DOM
              document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
         },
         
         deleteListItem: function(selectorId){
             
            var el=document.getElementById(selectorId);
             el.parentNode.removeChild(el);
             
         },
         
         displayBudget:function(obj){
            
             document.querySelector(DomStrings.incomelabel).textContent=obj.totalinc;
             document.querySelector(DomStrings.expenseslabel).textContent=obj.totalexp;
             document.querySelector(DomStrings.budgetlabel).textContent=obj.budget;
             
             if(obj.percentage>0)
                document.querySelector(DomStrings.percentagelabel).textContent=obj.percentage+'%';
             else
                 document.querySelector(DomStrings.percentagelabel).textContent='--';
         },
         
         displayPerc:function(percent){
             
             var fields=document.querySelectorAll(DomStrings.expensespercents);
             
             var nodelistforeach=function(list,callback){
                 for(var i=0;i<list.length;i++){
                     callback(list[i],i);
                 }                
             };
             
              nodelistforeach(fields,function(current,index){
                  if(percent[index]>0)
                  current.textContent=percent[index]+'%';
                  else
                      current.textContent='--';
                  
              });
                   
         },
         
         clearfields: function(){
             
             var field,fieldArr;
             
             field=document.querySelectorAll(DomStrings.descriptiontypr + ', ' + DomStrings.valuetype);
             fieldArr=Array.prototype.slice.call(field);
             
             fieldArr.forEach(function(current,index,array){
                 
                 current.value="";
             });
         }
        
     }  
})();


var controller=( function(budgetcrl,UIctrl){
   
    var setUpEventListeners=function(){
        var dom=UIctrl.getDomStrings();
        
        document.querySelector(dom.budgetlabel).textContent=0;
        document.querySelector(dom.expenseslabel).textContent=0;
        document.querySelector(dom.incomelabel).textContent=0;
         document.querySelector(dom.percentagelabel).textContent=0;
        
        document.querySelector(dom.inputbtn).addEventListener('click',ctrladditem);
    
        document.addEventListener('keypress',function(event)    {
            if(event.keyCode===13){
                ctrladditem();
            }
        });
        
        document.querySelector(dom.container).addEventListener('click',ctrlDelItem);
      }
    
 var updatebudget=function(){
      budgetcrl.calculateBudget(); 
     var bugdet=budgetcrl.getBudget();
     UIctrl.displayBudget(bugdet);
     
 }  
    
 var ctrladditem=function(){
     
     
     // 1. get field input data
    var ginput=UIctrl.getinput();
     
   
        // 2. add item to bugdet controller 
     if(ginput.value!==0 && !isNaN(ginput.value) && ginput.description!==""){
          
         var additem=budgetcrl.addItem(ginput.type,ginput.description,ginput.value);
   
     
        //3. add to ui controller
        UIctrl.addListItem(additem,ginput.type);
     
     //4. clear field
     UIctrl.clearfields();
     
     //5. calculate the budget
     updatebudget();
      
         //6. update percentage
     updatepercentage();
     }
           
 };
 
    var updatepercentage=function(){
        
        //1. calculate perecentage
        budgetcrl.calculatepercentage();
        
        //2. read them from budget controller
        var percents=budgetcrl.getpercent();
        
        //3. update the UI with new per
        UIctrl.displayPerc(percents);
        
    };
    
 var ctrlDelItem = function(event){
         
     var itemId ,splitId ,type ,ID;
     
     itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;
     
     if(itemId){
        splitId = itemId.split('-');
        type = splitId[0];
        ID = parseInt(splitId[1]);
     }
     
     //1. delete the item from data structure
     budgetcrl.deleteItem(type,ID);
     
     //2. delete item from ui
     UIctrl.deleteListItem(itemId);
     
     //3 recalculate new budgets
     updatebudget();
     
     // 4 update percentage
    updatepercentage();

 };
    
    
    
    
 return{
     init: function(){
         setUpEventListeners();
     }
 } ; 
    
})(budgetController,UIController);

controller.init();