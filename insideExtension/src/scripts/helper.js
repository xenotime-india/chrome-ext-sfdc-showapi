String.prototype.trimEnd = function(c) {
    if (c)
        return this.replace(new RegExp(c.escapeRegExp() + "*$"), '');
    return this.replace(/\s+$/, '');
};
String.prototype.trimStart = function(c) {
    if (c)
        return this.replace(new RegExp("^" + c.escapeRegExp() + "*"), '');
    return this.replace(/^\s+/, '');
};

String.prototype.escapeRegExp = function() {
    return this.replace(/[.*+?^${}()|[\]\/\\]/g, "\\$0");
};

convertSFDC15To18 = function(sfdcID15){
    if (sfdcID15.length == 15) {
        var s = "";
        for (var i = 0; i < 3; i++) {
            var f = 0;
            for (var j = 0; j < 5; j++) {
                var c = sfdcID15.charAt(i * 5 + j);
                if (c >= "A" && c <= "Z")
                    f += 1 << j;
            }
            s += "ABCDEFGHIJKLMNOPQRSTUVWXYZ012345".charAt(f);
        }
        return sfdcID15 + s;
    } else {
        throw "Error : " + sfdcID15 + " has not a length of 15 characters. Current length detected: " + sfdcID15.length + " characters.";
    }
};

subStrAfterChars = function(str, char, pos) {
    if(pos=='b')
        return str.substring(str.indexOf(char) + 1);
    else if(pos=='a')
        return str.substring(0, str.indexOf(char));
    else
        return str;
};

getUrlEncodedKey = function(key, query) {
    if (!query)
        query = window.location.search;
    var re = new RegExp("[?|&]" + key + "=(.*?)&");
    var matches = re.exec(query + "&");
    if (!matches || matches.length < 2)
        return "";
    return decodeURIComponent(matches[1].replace("+", " "));
};
setUrlEncodedKey = function(key, value, query) {

    query = query || window.location.search;
    var q = query + "&";
    var re = new RegExp("[?|&]" + key + "=.*?&");
    if (!re.test(q))
        q += key + "=" + encodeURIComponent(value);
    else
        q = q.replace(re, "&" + key + "=" + encodeURIComponent(value) + "&");
    q = q.trimStart("&").trimEnd("&");
    return (q[0]=="?" ? q : q = "?" + q);
};

var getServerURL = function() {
  var url = window.location.href;
  var arr = url.split("/");
  return arr[0] + "//" + arr[2];
}

var __getCookie = function(c_name){
  var i,x,y,ARRcookies=document.cookie.split(";");
  for (i=0;i<ARRcookies.length;i++){
    x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
    y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
    x=x.replace(/^\s+|\s+$/g,"");
    if (x==c_name){
      return unescape(y);
    }
  }
}

showApiName = function (recordId) {
  var sforce = new jsforce.Connection({
    serverUrl : getServerURL(),
    sessionId : __getCookie('sid')
  });

  sforce.describeGlobal().then(function(res) {
    return res.sobjects.find(function (item) {
        return item.keyPrefix == recordId.substring(0, 3);
    });
  }).then(function (currentSobject) {
    return sforce.sobject(currentSobject.name).describe();
  }).then(function (value) {
    jQuery("#bodyCell").find(".detailList").each(function() {
      jQuery(this).find("td.labelCol").each(function() {
        var e = jQuery(this),
          field = getColLable(this);
        if (!isBlank(field)) {
          var s = getKeyByValue(value.fields, field);
          isBlank(s) || e.append('<p class="Tesforce_Api_Name_JQ" style="padding: 0; color: #999; font-size: 75%; margin: 5px 0; font-weight: normal;">' + s.name + "</p>")
        }
      })
    });
  }).catch(function (err)  {
    console.error(err);
  });

}

var isBlank = function(e) {
  return "undefined" == typeof e || null === e ? !0 : "string" == typeof e && ("undefined" === e || "null" === e || "" === e)
}

var getColLable = function(e) {
  var t = jQuery(e).clone().children().remove().end().text();
  return isBlank(t) && (t = jQuery(e).children(":visible").first().clone().children().remove().end().text()), t
};

var getKeyByValue = function (value, field) {
  return value.find(function (item) {
    return (item.label === field);
  })
}


function showAlert(mess) {
    if (sfdcPage.dialogs['SFDCDialog'] == null) { // checking if SFDCDialog modal popup already created on page.

        sfdcPage.dialogs['SFDCDialog'] = new SimpleDialog('SFDCDialog', false); // creating modal popup with name ‘SFDCDialog’

        sfdcPage.dialogs['SFDCDialog'].title = "Salesforce Deployment Helper - Xenotime"; // setting title of popup

        sfdcPage.dialogs['SFDCDialog'].isMovable = false; //set true if want movable

        sfdcPage.dialogs['SFDCDialog'].displayX = true; // set true if want close button on header

        sfdcPage.dialogs['SFDCDialog'].extraClass = "" // use to set any extra style class if wanted

        sfdcPage.dialogs['SFDCDialog'].width = 346; // set size of popup default = 400

        sfdcPage.dialogs['SFDCDialog'].isModal = true; // set true if want block background.

        sfdcPage.dialogs['SFDCDialog'].createDialog(); // finally call this method to create modal pop up  and append to current page.

    }
    var message = '<table border="0"><tbody><tr><td style="vertical-align: top"><img src="/s.gif" class="confirmLarge" alt="Confirm"></td><td style="padding-left: 8px; vertical-align: top; line-height: 16px"><p>'+mess+'</p></td></tr></tbody></table>'
    sfdcPage.dialogs['SFDCDialog'].setContentInnerHTML('<div>' + message + '</div>');

    sfdcPage.dialogs['SFDCDialog'].show();// show modal popup
}