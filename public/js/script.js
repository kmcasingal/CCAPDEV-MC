// Drop down Menu/Profile
//hover and toggle of dropdown content
function menu() {
  document.getElementById("dropcontent").classList.toggle("show");
}

//closes dropdown when un-hover
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
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


