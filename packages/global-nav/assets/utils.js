var prevScrollpos = window.pageYOffset;
window.onscroll = function() {
var currentScrollPos = window.pageYOffset;
  if(document.getElementById("mobileFip")) {
    if (prevScrollpos > currentScrollPos) {
      document.getElementById("mobileFip").style.top = "0";
      document.getElementById("mobileNavBar").style.top = "48px";
    } else {
      document.getElementById("mobileFip").style.top = "-50px";
      document.getElementById("mobileNavBar").style.top = "0";
    }
  }
  prevScrollpos = currentScrollPos;
}