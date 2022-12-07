// Drop down Menu/Profile
function menu() {
  var x = document.getElementsByClassName("header-menu")[0];
  if (x.style.display == "none" || x.style.display == "") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}

// Back to top button
function scrollUp() {
  document.body.scrollTop = 0;
}

// For the animation under the registration page
$('.message a').click(function(){
  $('form').animate({height: "toggle", opacity: "toggle"}, "slow");
});

// Confirmation when turning off anonymous posting
function confirmation() {
  var anonToggle = document.getElementById("anonBox");
  
  if(anonToggle.checked == false){
    alert("WARNING: Anonymous post has been turned off.");
  } 
}


