$(document).ready(function() {
  $('form').on('submit', function(e){
    // validation code here
    if(!valid) {
      e.preventDefault();
    }
  });
});