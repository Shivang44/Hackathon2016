
$('#mainForm').submit(function(e){
  e.preventDefault();
  
  // Get the type the entered
  var typeValue = $('.typeValue').val();

 
  // get the zipcode they entered
  var zipCode=$('.zipCode').val();
  
  
  // build url like this: /view?type=[TYPE]&zipcode=[ZIPCODE]
  var url = "/view?type=" + typeValue + "&zipcode=" + zipCode;


  // redirect to that url  
  window.location = url;
  
});

// // $('.zip').keypress(function(e){
// //   if (e.which == 13) {
// //       window.location="/view";
// //   }
// });




