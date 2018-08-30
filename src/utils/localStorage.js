var storage = {
  set : function(key,value){
    if(window.localStorage){
      localStorage.setItem(key,JSON.stringify(value));
    }else{
      cook.setCookie(key,value);
    }
  },
  get : function(key){
    if(window.localStorage){
      var data = localStorage.getItem(key);
      var dataObj = JSON.parse(data);
      return dataObj;
    }else{
      var val = cook.getCookie(key);
      return val;
    }
  },
  remove: function (key) {
    if(window.localStorage){
      localStorage.removeItem(key);
    }else{
      cook.clearCookie(key);
    }
    return -1;
  }
}
var cook = {
  setCookie : function(cname, cvalue, exdays) {
    var d = new Date();
    exdays = exdays || Number.MAX_VALUE;
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires +";domain="+window.location.origin;
  },
  getCookie : function(key) {
    var strCookie = document.cookie;
    var arrCookie = strCookie.split("; ");
    for(var i = 0; i < arrCookie.length; i++){
      var arr = arrCookie[i].split("=");
      if(key == arr[0]){
        return arr[1];
      }
    }
    return "";
  },
  //清除cookie
  clearCookie : function(name) {
    this.setCookie(name, "", -1);
  }
}
export {
  storage
}
