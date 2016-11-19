
$('.search').click(function(e){
  e.preventDefault();
  window.location="/view";
});

$('.zip').keypress(function(e){
  if (e.which == 13) {
      window.location="/view";
  }
});




