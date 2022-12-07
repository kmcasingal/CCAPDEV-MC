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

function confirmation() {
  var anonToggle = document.getElementById("anonBox");
  
  if(anonToggle.checked == false){
    alert("WARNING: Anonymous post has been turned off.");
  } 
}

// var date = new Date().toLocaleString(); // 11/16/2015, 11:18:48 PM
// const date = event.toISOString().substr(0,16).split("T")[0] + " " + event.toISOString().substr(0,16).split("T")[1];

