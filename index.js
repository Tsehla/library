
// dom fill details of the book

function dom_book_content_fill(id, value){
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
//mock database format almost similar(nosql)
//user login db
var user_array = [
     {email : "tsehla@gmail.com", password : "123456", phone : "0710000000"},
     {email : "admin", password : "admin", phone : "071"}
];

//book content db
var array = [
    {book_name:"book 1", book_image:"1.png",book_genre:"romantic", book_category:"fiction", book_available:"yes", book_location:"library", book_story:"Once upon a time there was a guy called tsehla"}, 
    {book_name:"book 2", book_image:"2.png", book_genre:"science fiction", book_category:"reality", book_available:"no", book_location:"tim.g@gmail.org", book_story:"Tsehla as the name suggest, was highly misterius"},
    {book_name:"book 3", book_image:"3.png",book_genre:"romantic", book_category:"fiction", book_available:"yes", book_location:"library", book_story:"He liked reading adventure novels, that took the characters to new and unknown places"}, 
    {book_name:"book 4", book_image:"4.png",book_genre:"romantic", book_category:"fiction", book_available:"no", book_location:"Jo.j@teamb.co.za", book_story:"Since young he never liked the ordinary, he felt the world was too much and reality too real"}, 
    {book_name:"book 5", book_image:"5.png", book_genre:"science fiction", book_category:"reality", book_available:"yes", book_location:"library", book_story:"When he read this novels who's characters had abilities"},
    {book_name:"book 6", book_image:"6.png",book_genre:"romantic", book_category:"fiction", book_available:"yes", book_location:"library", book_story:"They could fly, they could slice mountains with theirs swords, they could go against fate "}, 
    {book_name:"book 7", book_image:"7.png",book_genre:"romantic", book_category:"fiction", book_available:"yes", book_location:"library", book_story:"They could create their destiny and direct their future as they willed"}, 
    {book_name:"book 8", book_image:"8.png", book_genre:"science fiction", book_category:"reality", book_available:"no", book_location:"Mamello.m@earth.org", book_story:"He longed for such a world, but due to his soft nature, he couldn't stand the cruelty of world controlled by power"},
    {book_name:"book 9", book_image:"9.png",book_genre:"romantic", book_category:"fiction", book_available:"yes", book_location:"library", book_story:"He can't stand the thought of how the cruel strong take advantage of the weak. "}, 
    
];
//get book db content and process
function start(){
for(var i=0; i<=array.length; i++){
     var db_content_data = array[i];
     db_ripper(db_content_data, i);
}
}
function db_ripper(db_data, id){ //rip en preprare db data not necessary but alright
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
//let div be created first
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
book_button.onclick = ()=>{ book_booking(id);}//front book button
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
       book_booking(id);
       }
    }  
};
/* disable is not working as expected, hiding works, each can only be hidden as they are called/created
especially for pop since im using non unique div elements*/
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

function book_booking(id){//booking requests and making
//alert(id +" "+logged_in_user);
     
   if(logged_in_user == null || logged_in_user == undefined){
         login_hide_display('show');
         dom_book_content_fill("login_text", "Please login to book");
         return ;
   }
   else{
         //alert();
         if(array[id].book_available == "yes"){//check if book still available before booking
         array[id].book_available = "no";
         array[id].book_location = logged_in_user;
         alert("Book : "+array[id].book_name+" , has been reserved by "+logged_in_user);
         //update screen details
         var image = array[id].book_image;
         var bookName = array[id].book_name;
         var bookStory = array[id].book_story;
         var bookGenre = array[id].book_genre;
         var bookCategory = array[id].book_category;
         var bookAvailability = array[id].book_available;
         var bookLocation = array[id].book_location;
         pop(image, id, bookName, bookStory, bookGenre, bookCategory, bookAvailability, bookLocation);
         document.getElementById("book_button"+id).style.display = "none";
         book_detail_pop_hide();
         user_library_write(id, bookName);//update library library
         }
      else{ dom_book_content_fill("book_title", "Sorry one second late, book taken");//incase get reserved by remote user few seconds before
      }
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
        dom_book_content_fill("login_navie", "LogIn");
     }
  }
}
/*login */
function user_login(){
var loginName = dom_input_value_get("login_name_input");
var loginPassword = dom_input_value_get("login_password_input");
 login_check(loginName, loginPassword);

}

function login_check(name, password){
var loop_counter = 0;
    
    for(var i = 0; i<=user_array.length; i++){
          if(user_array[i].email == name && user_array[i].password == password){
             logged_in_user = user_array[i].email;
             dom_book_content_fill("login_navie", "LogOut");
             login_hide_display("hide");
             fill_library();
             return ;
          }
        loop_counter = loop_counter + 1;
        wrong_credential();
    }
    
function wrong_credential(){//write error
       if(loop_counter == user_array.length){//don't ask me why it works with assignment not condition check when I side loop
                                              // so I moved it out
       return dom_book_content_fill("login_text", "User name or password not found");
       }
    }
}
/* forgotten password */
  function forgotten_password(){
       var loginName = document.getElementById("forgot_password_name_input").value;
       var loginPhone = document.getElementById("forgot_password_phone_number_input").value;
       forgotten_password_check(loginName, loginPhone);
  }
  
 function forgotten_password_check(name, phone){
       var loop_counter = 0;
       
         for(var i = 0; i<=user_array.length; i++){
            
            if(user_array[i].email == name && user_array[i].phone == phone){ 
              return  dom_book_content_fill("forgot_password_text", "Password : "+user_array[i].password);
            }
         loop_counter = loop_counter +1;
         wrong_details();
         }
     function wrong_details(){
         if(loop_counter == user_array.length){
            dom_book_content_fill("forgot_password_text", "Incorrect details, Ask admin for password");
         }
     }
 }
 
 /*user register */
 function user_register(){
   var loginName = document.getElementById("register_name_input").value;
   var loginPassword = document.getElementById("register_password_input").value;
   var loginPasswordConfirm = document.getElementById("register_password_input_confirm").value;
   var loginPhone = document.getElementById("register_phone_number_input").value;
   
   if(loginPassword == loginPasswordConfirm && loginPassword != "" ){
      return user_register_check(loginName, loginPassword, loginPhone);
   }
  else{ return dom_book_content_fill("register_text", "Passwords don't match");
 }
}

function user_register_check(loginName, loginPassword, loginPhone){

 var loop_count = 0;
   for(var i = 0; i<=user_array.length; i++){
      if(loginName == user_array[i].email){
         return dom_book_content_fill("register_text", "Account already exists.");
      }
    loop_count = loop_count + 1;
    db_fill(loginName, loginPassword, loginPhone);
   
   }
function db_fill(loginName, loginPassword, loginPhone){
       if(loop_count == user_array.length){
           user_array.push({email : loginName, password : loginPassword, phone : loginPhone});
           register_hide_display("hide");
           login_hide_display("show");
           dom_book_content_fill("login_text", "Account created, please login.");
       }
    }
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
            if(array[i].book_location == logged_in_user){
                bookName = array[i].book_name;
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
     
  //alert( id+" "+bookName);
  var div_maker = '<div id="user_library_book'+id+'">'+bookName+'</div><button id="library_book'+id+'" onclick = "book_returning(id)">return</button>';
  document.getElementById("user_library_content_error").style.display = "none";
  $('#user_library_content').append(div_maker);
  //document.getElementById("library_book"+id).onclick = function(){
      //) return book_returning(id);
       
  //}
} 
function book_returning(id){/*return book*/
                            //bug or none expected behavior
                            //function allow book and return of same book in sigle session, 
                            //on third try confirm not responding
                            //so used a button since Dom fails and modified id to return 12 character
                            //+++++ I'm thinking above solution could be unnecessarily, my junior do check if you can
                            //by removing below var id ++++
                            //isue Dom hide show fails
                            //was constantly hiding div and append would create new div until things go north south
                            //deleting div is right since append will create new one each time, comment remove below
                            //uncomment hide function to reproduce issue
          
var id = id[12];
//alert(id);
    var confirm_ = confirm("Are you sure, you want to return the book?");
    if(confirm_ == true){
    array[id].book_available = "yes";
    array[id].book_location = "library";
    var library_book = "library_book"+id;
    var user_library_book = "user_library_book"+id;
    $('#'+library_book).remove();
    $('#'+user_library_book).remove();
    //dom_hide_show(library_book, "hide");
    //dom_hide_show(user_library_book, "hide");
    
  
    //update screen details
    var image = array[id].book_image;
    var bookName = array[id].book_name;
    var bookStory = array[id].book_story;
    var bookGenre = array[id].book_genre;
    var bookCategory = array[id].book_category;
    var bookAvailability = array[id].book_available;
    var bookLocation = array[id].book_location;
    pop(image, id, bookName, bookStory, bookGenre, bookCategory, bookAvailability, bookLocation);
    document.getElementById("book_button"+id).style.display = "block";
    
    }
   
}
//function start -------
start();