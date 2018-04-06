const identity_server = 'https://gcidentity.lpss.me';

const pleioHeader = `(function(){
  function getcook() {
    m = document.cookie.match(/( |^)gctoken=(.*?)(;|$)/);
    return m;
  }
  var w = document.createElement('iframe');
  var token = false;
  window.addEventListener("message", function(event) {
    if (event.origin === '${identity_server}') {
      token = event.data;
      if (token == '403') {
        window.location.href = '${identity_server}';
      } else if (!getcook()) {
        document.cookie = 'gctoken=' + token;
        window.location.reload();
      } else {
        var old_token = getcook()[2];
        if (old_token !== token) {
          console.log('must update token!');
          document.cookie = 'gctoken=' + token;
          window.location.reload();
        }
      }
    }
  }, w);
  w.src = '${identity_server}/token';
  document.body.appendChild(w);
  if (getcook()) {
    return 'Bearer ' + getcook()[2];
  }
  return 'Bearer invalid';
})()`;

export default pleioHeader;
