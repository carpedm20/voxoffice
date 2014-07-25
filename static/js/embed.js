function loadXMLDoc(url) {
  var xmlhttp;

  if (window.XMLHttpRequest) {
    xmlhttp = new XMLHttpRequest();
  } else {
    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
  }

  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 ) {
      if(xmlhttp.status == 200){
        var data = JSON.parse(xmlhttp.responseText);

        if (data['status'] == 'success') {
          document.getElementById("sermo").innerHTML="<iframe id=\"sermo-frame\" src=\"http://"+sermo_server+"/c/"+data['msg']+"/\" scrolling=\"no\" horizontalscrolling=\"no\" verticalscrolling=\"no\" style=\"width: 100% !important; border: none !important; overflow: hidden !important;\"></iframe>";
          iFrameResize({},"#sermo-frame");
        } else {
          document.getElementById("sermo").innerHTML = "<p>"+data['msg']+"</p>";
        }
      }
      else if(xmlhttp.status == 400) {
        alert('There was an error 400')
      }
      else {
        alert('something else other than 200 was returned')
      }
    }
  }

  xmlhttp.open("GET", url, true);
  xmlhttp.send();
}

loadXMLDoc("http://"+sermo_server+"/check/"+sermo_shortname+"/"+encodeURIComponent(window.location.pathname));
