/*
twitterer anywhere


The MIT License
Copyright (c) 2008 Atsushi Nakatsugawa <atsushi@moongift.jp>
 */
var twitterer_anywhere_style; // If set to "false", you can use css for style settings. ( Default true)
var twitterer_anywhere_limit; // Disp
var twitterer_anywhere_collapse; // Don't use now.
var twitterer_anywhere_url = "http://lifehacker.com/5118454/firefox-and-chrome-run-gmail-twice-as-fast-as-ie-says-google"; // URL. If not set, using current URL.

function __twitterer_anywhere_receiver(json) {
    try {
	var html = "";

	var escapeHTML = function(str) {
	    str = str.replace("&","&amp;");
	    str = str.replace("\"","&quot;");
	    str = str.replace("'","&#039;");
	    str = str.replace("<","&lt;");
	    str = str.replace(">","&gt;");
	    return str;
	}

	// http://juce6ox.blogspot.com/2007/11/cssdom.html
	// by latchet
	var addCSSRule = (document.createStyleSheet)
	    ? (function(sheet){
		    return function(selector, declaration){
			sheet.addRule(selector, declaration);
		    };
		})(document.createStyleSheet())
	    : (function(sheet){
		    return function(selector, declaration){
			sheet.insertRule(selector + '{' + declaration + '}', sheet.cssRules.length);
		    };
		})((function(e){
			    e.appendChild(document.createTextNode(''));
			    (document.getElementsByTagName('head')[0] || (function(h){
				    document.documentElement.insertBefore(h, this.firstChild);
				    return h;
				})(document.createElement('head'))).appendChild(e);
			    return e.sheet;
			})(document.createElement('style')))

	if(twitterer_anywhere_style!==false) {
	    addCSSRule("#twitterer_anywhere", "font-size: 90%; font-family: \"Arial\", sans-serif; color: #000;");
	    addCSSRule("#twitterer_anywhere * ", "margin: 0; padding: 0; text-align: left; font-weight: normal; font-family: \"Arial\", sans-serif;");
	    addCSSRule("#twitterer_anywhere .twitterer_anywhere_zero", "background-color:#edf1fd; border-top:1px solid #5279e7; list-style-position: inside; margin:2px 0 0 0;padding: 8px 5px 12px 8px;");
	    addCSSRule("#twitterer_anywhere ul", "background-color:#9ae4e8; border-top:1px solid #87bc44; list-style-position: inside; margin:2px 0 0 0;padding: 8px 5px 12px 8px;");
	    addCSSRule("#twitterer_anywhere ul li", "list-style-type: none; padding: 2px 2px; background-color: white; border-bottom: #d2dada 1px dashed;");
	    addCSSRule("#twitterer_anywhere .twitterer_anywhere_user", "color: #00e; text-decoration: underline; margin: 0 2px;");
	    addCSSRule("#twitterer_anywhere .twitterer_anywhere_tags", "font-size: 90%; color: #66c; margin: 0 4px 0 2px;");
	    addCSSRule("#twitterer_anywhere .twitterer_anywhere_tags a", "text-decoration: none; color: #66c;");
	    addCSSRule("#twitterer_anywhere .twitterer_anywhere_go", "font-size: 90%; color: #66c; text-decoration: none;");
	}

	if(json==null) {
	    html += "Twitterer to this entry (0) <a class=\"twitterer_anywhere_go\" href=\"http://search.twitter.com/search?q="+escapeHTML(twitterer_anywhere_url)+"\">Jump to twitter search</a><br/>";
	    html += "<div class=\"twitterer_anywhere_zero\">";
	    html += "Anyone no twitter now.";
	    html += "</div>";
	}
	else {
	    if((typeof twitterer_anywhere_limit)!="number") twitterer_anywhere_limit = 100;
	    if((typeof twitterer_anywhere_collapse)=="undefined" && json.bookmarks.length>twitterer_anywhere_limit) twitterer_anywhere_collapse = true;

	    html += "Twitter to this entry ("+json.count+") <a class=\"twitterer_anywhere_go\" href=\"http://search.twitter.com/search?q="+escapeHTML(twitterer_anywhere_url)+"\">Jump to twitter search</a><br/>";
	    html += "<ul id=\"bookmarked_user\">";

	    for(var i=0; i<json.bookmarks.length&&twitterer_anywhere_limit>0; ++i) {
		var bookmark = json.bookmarks[i];
		var t = bookmark.timestamp.split(" ")[0].split("/");
		if(twitterer_anywhere_collapse!=true || bookmark.comment!='') {
		    html += "<li><span class=\"__twitterer_anywhere_timestamp\">"+escapeHTML(t[1])+"/"+escapeHTML(t[2])+"/"+escapeHTML(t[0])+"</span><img src=\"http://img.twitty.jp/twitter/user/"+escapeHTML(bookmark.user)+"/s.gif\" width=\"16\" height=\"16\"><a href=\"http://twitter.com/"+escapeHTML(bookmark.user)+"\" class=\"twitterer_anywhere_user\">"+escapeHTML(bookmark.user)+"</a>"+escapeHTML(bookmark.comment)+"<a href=\""+bookmark.url+"\">view</a></li>";
		    twitterer_anywhere_limit--;
		}
	    }
	    html += "</ul>";
	}

	var wrap = document.createElement("div");
	wrap.innerHTML = html;
	document.getElementById("twitterer_anywhere").appendChild(wrap);
    } catch(e) { }
}

function __twitterer_anywhere_loade() {
    try {
	if((typeof document.getElementById("twitterer_anywhere"))!="undefined") {
	    var script = document.createElement("script");
	    script.setAttribute("type","text/javascript");
	    if((typeof twitterer_anywhere_url)=="undefined") twitterer_anywhere_url = location.href.replace(/#.*/,"");
	    script.setAttribute("src","http://localhost:3000/m/"+twitterer_anywhere_url+"?callback=__twitterer_anywhere_receiver");
	    document.body.appendChild(script);
	}
    } catch(e) { }
}

try {
    if(window.addEventListener) {
	window.addEventListener("load", __twitterer_anywhere_loade, false);
    }
    else {
	window.attachEvent("onload", __twitterer_anywhere_loade);
    }
} catch(e) { }
