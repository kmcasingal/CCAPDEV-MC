function menu() {
  var x = document.getElementsByClassName("header-menu")[0];
  if (x.style.display == "none" || x.style.display == "") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}

function scrollUp() {
  document.body.scrollTop = 0;
}

$('.message a').click(function(){
  $('form').animate({height: "toggle", opacity: "toggle"}, "slow");
});