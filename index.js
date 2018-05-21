/* bRoKeN lOgiX: *///if hE saY iTs nonsense AnD he aRguE itS prouFounD, Do we Now caLl It ProFoundNonsensE.


//make PouchDB
//local db
var db = new PouchDB("bib");
//remote db to aync
var online_db=new PouchDB("https://cb3593e0-8b4c-47de-b5fa-0443bc6b75cc-bluemix.cloudant.com/umuzi_library");
//db sync function
function db_sync(){//call database sycing    
db.sync(online_db)
  .then(function(sucess){ alert(JSON.stringify(sucess))
                        
     //update arrays
//db get books 
db.allDocs({ //search and or filter
  include_docs: true,
  startkey: 'book_',
  endkey: 'book_\ufff0'
  })
.then(function(data){ return array = data.rows;})                

  //------------------eish ya---------------------               
                        })
  .catch(function(fail){alert("online sync faulty: ")});   
}
db_sync();//calling sync at first start

// dom fill details of the book

function dom_book_content_fill(id, value) {
  document.getElementById(id).innerHTML = value;
}
//Dom get input
function dom_input_value_get(div){
    return document.getElementById(div).value;
}
//Dom hide show
function dom_hide_show(value, command){
   var div = document.getElementById(value);
   
   if(command == "hide"){return div.style.display = "none";}
   if(command == "show"){ return div.style.display = "block";}
}

//db get books and fill array
var array;

db.allDocs({ //search and or filter
  include_docs: true,
  startkey: 'book_',
  endkey: 'book_\ufff0'
  })
.then(function(data){ 

               array = data.rows;
               start();//books loader
               
               return;
               })
//.catch(function(error){ alert (error)});//getting silly error no workaround

//get book db content and process
function start(){
for(var i=0; i<=array.length; i++){
     var db_content_data = array[i].doc;
     db_ripper(db_content_data, i);
}
}
function db_ripper(db_data, id){ //rip en preprare db data not necessary but alright. //db the ripper lol
     var bookName = db_data.book_name;
     var bookImage = db_data.book_image;
     var bookStory = db_data.book_story;
     var bookGenre = db_data.book_genre;
     var bookCategory = db_data.book_category;
     var bookAvailability = db_data.book_available;
     var bookLocation = db_data.book_location;
   dom_write(bookImage, id, bookName, bookStory, bookGenre, bookCategory, bookAvailability, bookLocation); //add the book
}

//writes books to body
function dom_write(image, id, bookName, bookStory, bookGenre, bookCategory, bookAvailability, bookLocation){
//let div be created first// haha let there be light
var div_maker = '<div id="book'+id+'"><div id="book_image'+id+'"></div><button id="book_button'+id+'">Book</button></div>';

$('#books_container').append(div_maker);

var book = document.getElementById("book"+id);
var book_image = document.getElementById("book_image"+id);
var book_button = document.getElementById("book_button"+id);
book.style.width = "30%";
book.style.height = "35%";
book.style.float = "left";
book.style.margin = "1%";
book_image.style.width = "100%";
book_image.style.height = "90%";
book_image.style.backgroundImage = 'url('+image+')';
book_image.style.backgroundPosition = "center";
book_image.style.backgroundSize = "cover"; 
book_image.style.backgroundRepeat = "no-repeat";
book_button.style.height = "10%";
book_button.style.width = "100%";
front_button_disable(id, bookAvailability);//front button enable disable
book_button.onclick = function(){ book_booking(id, bookName);}//front book button
pop(image, id, bookName, bookStory, bookGenre, bookCategory, bookAvailability, bookLocation);

}
function pop(image, id, bookName, bookStory, bookGenre, bookCategory, bookAvailability, bookLocation){//write to popup
    document.getElementById("book_image"+id).onclick = function (){
    dom_book_content_fill("book_title", bookName);
    dom_book_content_fill("book_story", bookStory);
    dom_book_content_fill("genre_value", bookGenre);
    dom_book_content_fill("category_value", bookCategory);
    dom_book_content_fill("book_location_name", bookLocation);
    dom_book_content_fill("availability_value", bookAvailability);
    pop_button_disable(bookAvailability); //pop button enable or diaable
    
var book_cover = document.getElementById("book_cover");
    book_cover.style.backgroundImage = 'url('+image+')';
    book_cover.style.backgroundSize = "cover";
    book_cover.style.backgroundPosition = "center";
    book_cover.style.backgroundRepeat = "no-repeat";
    book_detail_pop_show();
    document.getElementById("book_button").onclick = function(){//book button in pop
        
       book_booking(id, bookName);
        
       }
    }  
};
function front_button_disable(id, bookAvailability){//same as below just from side
  if(bookAvailability == "no"){
    document.getElementById("book_button"+id).style.display="none";} 
  if(bookAvailability == "yes"){ 
    document.getElementById("book_button"+id).style.display = "block";}
}

function pop_button_disable(bookAvailability){//hide book for unavailable book popup side
    
  if(bookAvailability == "no"){
    document.getElementById("book_button").style.display ="none";}
  if(bookAvailability == "yes"){
    document.getElementById("book_button").style.display = "block"; }
}

function book_booking(id, bookName){//booking requests and making 
   
   var id = id;
  
   if(logged_in_user == null || logged_in_user == undefined){
         login_hide_display('show');
         dom_book_content_fill("login_text", "Please login to book");
         return ;
   }
   else{
   //----------------------------------------------   
   db.get("book_"+bookName)
   .then(function(data){//connection to do get book

         if(data.book_available == "yes"){//check if book still available before booking 
        //make booking to db
     db.get("book_"+bookName)
     .then(function(data){
     
         var booking_history = data.history;
         var date = new Date();
         if(data.history.length == 10){
            booking_history.pop();
            booking_history.unshift("Book : "+bookName+", was booked on [ "+date+" ] by [ "+logged_in_user+" ]");
         }
         else{
               booking_history.unshift("Book : "+bookName+", was booked on [ "+date+" ] by [ "+logged_in_user+" ]");
               
         }
         var reservation_time = data.reservation_times + 1;
          
        return db.put({
                    _id : data._id,
                    book_name: data.book_name,
                    book_image: data.book_image,
                    book_genre: data.book_genre,
                    book_category: data.book_category,
                    book_available: "no",
                    book_location: logged_in_user,
                    book_story: data.book_story,
                    history : booking_history,
                    reservation_times : reservation_time,
                    _rev: data._rev
                  })
         })
     .then(function(data){
    db.get(data.id)
    .then(function (data){
  
           alert("Book : "+data.book_name+" , has been reserved by "+logged_in_user);
           //update screen details
           var image = data.book_image;
           var bookName = data.book_name;
           var bookStory = data.book_story;
           var bookGenre = data.book_genre;
           var bookCategory = data.book_category;
           var bookAvailability = data.book_available;
           var bookLocation = data.book_location;
           pop(image, id, bookName, bookStory, bookGenre, bookCategory, bookAvailability, bookLocation);
           document.getElementById("book_button"+id).style.display = "none";
           book_detail_pop_hide();
           user_library_write(id, bookName);//update library library
           })
     
     })
     .catch(function(error){alert("Error "+error)});
             
         }
         else{ dom_book_content_fill("book_title", "Sorry one second late, book taken");//incase get reserved by remote user few seconds before
      }
 })
   }
   
}
//show book detail popup/basically show div
function book_detail_pop_show(){
 return document.getElementById("book_pop_container").style.display = "block";
}
function book_detail_pop_hide(){//hide
return document.getElementById("book_pop_container").style.display = "none";
}

//register login 

function register_hide_display(value){
 var div = document.getElementById("register_container");
    if(value == "hide"){ return div.style.display = "none";}
    if(value == "show"){ return div.style.display = "block";}
}
function login_hide_display(value){
 var div = document.getElementById("login_container");
    if(value == "hide"){ return div.style.display = "none";}
    if(value == "show"){ return div.style.display = "block";}
}
function forgot_password_hide_display(value){//forgot password show hide aka routing
var div = document.getElementById("forgot_password_container");

if(value == "hide"){ return div.style.display = "none";}
if(value == "login"){
   div.style.display = "none";
   login_hide_display('show');
   return;
}
if(value == "register"){
   div.style.display = "none";
   register_hide_display("show");
   return;
}
if(value == "forgotten"){
   login_hide_display("hide");
   div.style.display = "block";
   return ;
    }
}
/* login/registration functions*/
/*login logout request handler*/
var logged_in_user = null;
function login_logout(){
  if(logged_in_user == null){
     login_hide_display('show');
  }
  else{
     //this will handle logout
     // en write login back to the Dom
     // return logged in user to null
     var logout = confirm("You are about to logout, continue?");
     if(logout == true){
        logged_in_user = null;
         is_user_admin = null;//logging out admin
        dom_book_content_fill("user_library_content", " ");//clear library
          document.getElementById("user_library_content_error").style.display = "block";
        dom_book_content_fill("login_navie", "LogIn");
     }
  }
}
/*login */ // ++++++++++++++++++++++++++++++
function user_login(){
var loginName = dom_input_value_get("login_name_input");
var loginPassword = dom_input_value_get("login_password_input");

db.get("password_"+loginName)
.then(function (data){
     if(data.email == loginName && data.password == loginPassword){
       if(data.email == "admin"){//escape authorization if admin
            
            logged_in_user = data.email;
            dom_book_content_fill("login_navie", "LogOut");
            login_hide_display("hide");
            fill_library();
            return;
      
       }
      
      if(data.authorized == "no"){return alert("You can't be logged in.\r\n Your account has not been authorized by admin.\r\nPlease ask admin to authorize your account for use in this system.");}//check account authorization 
       
       else{

             logged_in_user = data.email;
             dom_book_content_fill("login_navie", "LogOut");
             login_hide_display("hide");
             fill_library();
             return;
           }
      }
      
     else{ return dom_book_content_fill("login_text", "Password not found"); }
  })
.catch(function (data){ return dom_book_content_fill("login_text","account not registered");})}

/* forgotten password */ 
  function forgotten_password(){
       var loginName = document.getElementById("forgot_password_name_input").value;
       var loginPhone = document.getElementById("forgot_password_phone_number_input").value;
       
       
         db.get("password_"+loginName)
         .then(function(data){   
            if(data.email == loginName && data.phone == loginPhone){ 
              return  dom_book_content_fill("forgot_password_text", "Password : "+data.password);
          }
            else{ return dom_book_content_fill("forgot_password_text", "Incorrect details, Ask admin for password");}
         })
         .catch(function(error){
            dom_book_content_fill("forgot_password_text", "Username not found");
 });
} 
 /*user register */
 function user_register(){
   var loginPassword = document.getElementById("register_password_input").value;
   var loginPasswordConfirm = document.getElementById("register_password_input_confirm").value;
   
   if(loginPassword == loginPasswordConfirm && loginPassword != "" ){
      return user_register_check();
   }
  else{ return dom_book_content_fill("register_text", "Passwords don't match");
 }
}

function user_register_check(){//check if account exist/register
 var loginName = document.getElementById("register_name_input").value;

db.get("password_"+loginName)
.then(function(sucess){ //exist  
 
         return dom_book_content_fill("register_text", "Account already exists.");
      })
.catch(function(error){//not exists
   var loginName = document.getElementById("register_name_input").value;
   var loginPassword = document.getElementById("register_password_input").value;
   var loginPasswordConfirm = document.getElementById("register_password_input_confirm").value;
   var loginPhone = document.getElementById("register_phone_number_input").value;
   
   db.put({     _id : "password_"+loginName, 
                email : loginName, 
                password : loginPassword, 
                phone : loginPhone, 
                authorized : "no"
                } )

.then(function (success){//sucess

           register_hide_display("hide");
           login_hide_display("show");
           dom_book_content_fill("login_text", "Account created, please login.");
           db_sync();//calling sync updating online db
})
.catch(function (error){alert("Account creation error : "+error)});
})

}

/* side menu */
function side_menu_hide_display(value){
var div = document.getElementById("side_menu");
var div2 = document.getElementById("menu_close_button");
     if(value == "hide"){
         div.style.display = "none";
         div2.style.display = "none";
         }
     if(value == "show"){
         div.style.display = "block";
         div2.style.display = "block";
         }
}
//user library
function fill_library(){
  var bookName = 0;
  var id = 0;
  var loop_counter =0;
   if(logged_in_user != null || logged_in_user != undefined){//validation not necessary function called after login sucess
   
      for(var i = 0; i<=array.length; i++){
            if(array[i].doc.book_location == logged_in_user){
                bookName = array[i].doc.book_name;
                id = i;
                  user_library_write(id, bookName);
            }
        loop_counter = loop_counter + 1;
        empty_library();
      }
   function empty_library(){
      if(loop_counter == array.length){//user library empty
       return document.getElementById("user_library_content_error").innerHTML = "You have no books borrowed. Please reserve and reload you browser";
      }
     }
   }
    else{
        return document.getElementById("user_library_content").innerHTML = "Please login to see your library contents.";
    }
}
function user_library_write(id, bookName){//add book plus button on menu
     
  var div_maker = '<div id="user_library_book'+id+'">'+bookName+'</div><button id="library_book'+id+'">return</button>';
  document.getElementById("user_library_content_error").style.display = "none";
  $('#user_library_content').append(div_maker);
  document.getElementById("library_book"+id).onclick = function(){
       return book_returning(id, bookName);
       
}
} 
function book_returning(id, bookName){/*return book*/
    
    
    

          
var id = id;
   var confirm_ = confirm("Are you sure you want to return : "+bookName+" ?");
    if(confirm_ == true){
    
    db.get("book_"+bookName)
    .then(function (data){
    
    if(data.book_available == "no"){
    
    db.put({
    _id : data._id,
    book_name: data.book_name,
    book_image: data.book_image,
    book_genre: data.book_genre,
    book_category: data.book_category,
    book_available: "yes",
    book_location: "library",
    book_story: data.book_story,
    history : data.history,
    reservation_times : data.reservation_times,
    _rev: data._rev
    })
    .then(function (data){
     db.get(data.id)
     .then(function (data){
    
    var library_book = "library_book"+id;
    var user_library_book = "user_library_book"+id;
    $('#'+library_book).remove();
    $('#'+user_library_book).remove();
  
    //update screen details
    var image = data.book_image;
    var bookName = data.book_name;
    var bookStory = data.book_story;
    var bookGenre = data.book_genre;
    var bookCategory = data.book_category;
    var bookAvailability = data.book_available;
    var bookLocation = data.book_location;
    pop(image, id, bookName, bookStory, bookGenre, bookCategory, bookAvailability, bookLocation);
    document.getElementById("book_button"+id).style.display = "block";    
    })
 })
   }     
  else { alert("Sorry, book : "+data.book_name+" has been booked.");
    }
})
   }  
}

var is_user_admin = null;
/*admin tools*/
function admin_tool(){ //admin action allow

    if(logged_in_user == "admin"){//if user is admin give admintool acess
    is_user_admin = "yes";
    alert("you have admin privileges");
    document.getElementById("admin_tool_choices").style.display = "block";
    return;
    }

    if(is_user_admin == null || is_user_admin == undefined){
        return admin_user_content_show_hide("show");
    }
    else{
        return admin_user_password_confirm();
    }
}

function admin_user_password_confirm(){//check admin user password input
    
    var admin_password_input = document.getElementById("user_admin_password_input").value;

    if(admin_password_input != "" && logged_in_user != null || logged_in_user != undefined){//forcing user to login first, but admin will get admin priveladges by default

     //check password against admin account
db.get("password_admin")
.then(function(data){

    if(data.password == admin_password_input){
    
        admin_user_content_show_hide("hide");
        
        is_user_admin = "yes"; //the user can now use admin menu
                 alert("hello : "+logged_in_user+". You have obtained admin rights");
       document.getElementById("admin_tool_choices").style.display = "block";

  }

     else{//call password not found
        
          return dom_book_content_fill("admin_user_text", "Password not found/incorrect");
 }
    
 })
      }
    
 else{//no password text input
         
         dom_book_content_fill("admin_user_text", "Please enter password, Also make sure your are looged in"); 
         return ;
       } 
} 
function admin_user_content_show_hide(value){
var div = document.getElementById("admin_user_content");
    
    if(value == "hide"){
        return div.style.display = "none";
    }
    if(value == "show"){
        return div.style.display = "block";
    }
}

//admin tools
function admin_tool_close(){
document.getElementById("admin_tool_choices").style.display = "none";

}
function admin_tool_work_space_close(){
dom_book_content_fill("work_space_content", "");
document.getElementById("tools_work_space").style.display = "none";

}
//admin tool users-------
//users authorize

function user_authorize(){
admin_tool_close();

  document.getElementById("tools_work_space").style.display = "block";

db.allDocs({
            include_docs: true,
            startkey: 'password_',
            endkey: 'password_\ufff0'
 })
.then(function (data){
        
var array = data.rows;
  for(var i = 0; i <= array.length; i++){  
     authorize_fill_users(array [i].doc);
      
  }                     
                       
}); }

function authorize_fill_users(data){
 var user_div_maker;
 
 dom_book_content_fill("work_space_text", "<b>Users</b>");

 
 if(data.authorized == "no"){
 user_div_maker = '<div id = "'+data._id+'")>User Email : <b>'+data.email+'</b> User Password : <b>'+data.password+'</b> Authorized : <b>'+data.authorized+'</b> .<br /><button onclick ="admin_user_delete(\''+data._id+'\')">Delete</button>  <button onclick ="admin_user_authorize(\''+data._id+'\')">Authorize</button></div><hr>';
 
     }
     
 else{
 user_div_maker = '<div id = "'+data._id+'")>User Email : <b>'+data.email+'</b> User Password : <b>'+data.password+'</b> Authorized : <b>'+data.authorized+'</b> .<br /><button onclick ="admin_user_delete(\''+data._id+'\')">Delete</button></div><hr>';  
   
   }
   $('#work_space_content').append(user_div_maker);

}

function admin_user_authorize (data){
     
  db.get(data)
  .then(function (data){
       return db.put({
              _id : data._id,
              email : data.email, 
              password : data.password, 
              phone : data.phone, 
              authorized : "yes",
              _rev : data._rev
       
       })
     .then(function (data){dom_book_content_fill("work_space_content", ""); user_authorize(); alert("Success")})
     .catch(function (data){alert("Error "+data)});
    })
  .catch(function (data){alert(data)});

}
function admin_user_delete (data){
  db.get(data)
  .then(function (data){ return db.remove(data)})
  .then(function (data){dom_book_content_fill("work_space_content", ""); user_authorize(); alert("Success")})
  .catch (function (data){ alert(data)});
  
}

//admin tools books
//book add
function books_add(){
admin_tool_close();
document.getElementById("tools_work_space").style.display = "block";
dom_book_content_fill("work_space_text", "<b>Add book</b>");

var books_div_maker ='<hr><input type = "text" id = "books_book_name" placeholder = "Enter book name"><br /><hr><input type = "text" id = "books_book_image" placeholder = "Enter link to book image: www.example.com/book1.png"><br /><hr><input type = "text" id = "books_book_genre" placeholder = "Enter genre"><br /><hr><input type = "text" id = "books_book_category" placeholder = "Enter book category"><br /><hr><input type = "text-area" id = "books_book_story" placeholder = "Enter book synopsis"><br /><hr><button id="add_book_button" onclick = "book_add_adding()">Add new book</button>';

$('#work_space_content').append(books_div_maker);

}

function book_add_adding(){
var bookName = document.getElementById("books_book_name").value;
var bookImage = document.getElementById("books_book_image").value;
var bookGenre = document.getElementById("books_book_genre").value;
var bookCategory = document.getElementById("books_book_category").value;
var bookStory = document.getElementById("books_book_story").value;

if(bookName != "" && bookImage != "" && bookGenre != "" && bookCategory != "" && bookStory != ""){
   db.get("book_"+bookName)
   .then(function (data){return alert("Can't add. Book already exists")})//if success book already exists
    .catch(function (data){//if error book does not exist
          db.put({
                   _id : "book_"+bookName,
                   book_name : bookName,
                   book_image : bookImage,
                   book_genre : bookGenre,
                   book_category : bookCategory, 
                   book_available : "yes",
                   book_location : "library",
                   book_story : bookStory,
                   history : [],
                   reservation_times : 0
          })
         .then(function (data){ alert("Book added : reload page")})
         .catch(function (data){alert("Error : "+error)})
   })
 }
 else{ return alert("Please fill all book details");}
}
//book remove
function books_remove(){
   admin_tool_close();
     document.getElementById("tools_work_space").style.display = "block";
     dom_book_content_fill("work_space_text", "<b>Remove book</b>");
    
    
 db.allDocs({ //search and or filter
             include_docs: true,
             startkey: 'book_',
             endkey: 'book_\ufff0'
   })
 .then(function(data){ 
    
    var array = data.rows;
    
    for(var i = 0; i <= array.length; i++){
         
        book_remove_fill(array[i].doc);
    }
    
   })
}
function book_remove_fill(data){
         
  var book_remove_div_maker = '<div id = "'+data._id+'">Book name : <b>'+data.book_name+'</b>, Book location : <b>'+data.book_location+'</b>, Book reservations amount <b>'+data.reservation_times+' times</b>.<br /><button onclick = "book_removing(\''+data._id+'\')">Delete book</button><hr></div>';
  
  $('#work_space_content').append(book_remove_div_maker);  
}

function book_removing(data){//remove book

      db.get(data)
      .then(function (data){
           
           db.remove(data)
           .then(function (data){
                                  document.getElementById(data.id).innerHTML = "";
                                  alert("Success");
                                  
                                  })
           .catch(function (data){alert("Error "+data)});
      })
      .catch(function (data){alert("Error "+data)});
}

//book stats
  
  function view_stats(){
         
         document.getElementById("tools_work_space").style.display = "block";
         dom_book_content_fill("work_space_text", "<b>Book stats</b>");
         
        db.allDocs({ //search and or filter
        include_docs: true,
        startkey: 'book_',
        endkey: 'book_\ufff0'
        })
        .then(function(data){ 
        
        var array = data.rows;
        
        for(var i = 0; i <= array.length; i++){
        
        write_stats(array[i].doc);
        }
    })
  
  function write_stats(data){ 
       var stats_div_maker = '<div id = "'+data.
       _id+'">Book name : <b>'+data.book_name+'</b>, Reservation times : <b>'+data.reservation_times+'</b></div><br /><button onclick = "alert(\''+data.history+'\')" style = "width : 100%;">Show booking history</button><hr>';
       
       $('#work_space_content').append(stats_div_maker);
  }
}
//×××××××××××××××××××××××××××××××××××××××××××××××××××××××××××××××××

//fill fake db----
/*
db.bulkDocs([
           {_id : "book_book 1", book_name:"book 1", book_image:"1.png",book_genre:"romantic", book_category:"fiction", book_available:"yes", book_location:"library", book_story:"Once upon a time there was a guy called tsehla", history : [], reservation_times : 0}, 
           {_id : "book_book 2", book_name:"book 2", book_image:"2.png", book_genre:"science fiction", book_category:"reality", book_available:"no", book_location:"tim.g@gmail.org", book_story:"Tsehla as the name suggest, was highly misterius", history : [], reservation_times : 0},
           {_id : "book_book 3", book_name:"book 3", book_image:"3.png",book_genre:"romantic", book_category:"fiction", book_available:"yes", book_location:"library", book_story:"He liked reading adventure novels, that took the characters to new and unknown places", history : [], reservation_times : 0}, 
           {_id : "book_book 4", book_name:"book 4", book_image:"4.png",book_genre:"romantic", book_category:"fiction", book_available:"no", book_location:"Jo.j@teamb.co.za", book_story:"Since young he never liked the ordinary, he felt the world was too much and reality too real", history : [], reservation_times : 0}, 
           {_id : "book_book 5", book_name:"book 5", book_image:"5.png", book_genre:"science fiction", book_category:"reality", book_available:"yes", book_location:"library", book_story:"When he read this novels who's characters had abilities", history : [], reservation_times : 0},
           {_id : "book_book 6", book_name:"book 6", book_image:"6.png",book_genre:"romantic", book_category:"fiction", book_available:"yes", book_location:"library", book_story:"They could fly, they could slice mountains with theirs swords, they could go against fate ", history : [], reservation_times : 0}, 
           {_id : "book_book 7", book_name:"book 7", book_image:"7.png",book_genre:"romantic", book_category:"fiction", book_available:"yes", book_location:"library", book_story:"They could create their destiny and direct their future as they willed", history : [], reservation_times : 0}, 
           {_id : "book_book 8", book_name:"book 8", book_image:"8.png", book_genre:"science fiction", book_category:"reality", book_available:"no", book_location:"Mamello.m@earth.org", book_story:"He longed for such a world, but due to his soft nature, he couldn't stand the cruelty of world controlled by power", history : [], reservation_times : 0},
           {_id : "book_book 9", book_name:"book 9", book_image:"9.png",book_genre:"romantic", book_category:"fiction", book_available:"yes", book_location:"library", book_story:"He can't stand the thought of how the cruel strong take advantage of the weak. ", history : [], reservation_times : 0}, 
           ]
     
)
.then((data)=>{console.log(data);})
.catch((error)=>{alert(error);});
*/
/*

db.allDocs({include_docs: true})
.then((data)=>{console.log(JSON.stringify(data));})
.catch((error)=>{alert(error);});
*/
/*
db.bulkDocs([
           {_id : "password_tsehla@gmail.com", email : "tsehla@gmail.com", password : "123456", phone : "0710000000", authorized : "no"},
           {_id :  "password_admin", email : "admin", password : "admin", phone : "071", authorized : "yes"}
        ])
.then((data)=>{console.log(JSON.stringify(data))})
.catch((error)=>{alert(error)});
*/
/*
db.destroy()
.then(function (data){alert (JSON.stringify(alert))});

*/