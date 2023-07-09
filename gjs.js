// ==UserScript==
// @id              greasyfork-search-other-sites@BNLOS (formerly "HACKSCOMICON")
// @name            Greasy Fork - Search scripts on other sites (Added more sites)
// @namespace       https://github.com/LouCypher/userscripts
// @description     Add search option to search on Userscripts.org, OpenUserJS.org, MonkeyGuts.com (Code Remodified), Google.com(Beta;Work in progress;still functional) and Google Custom Search(Search all userscript websites with one click). Plus especially Userscripts-mirror.org(As Userscripts.org has shut down).
// @icon            http://www.mediafire.com/convkey/6b10/64gmr1m4qul6xalzg.jpg?size_id=2
// @version         v6.1
// @author          BNLOS (formerly "HACKSCOMICON") Credits:LouCypher
// @contributionURL http://loucypher.github.io/userscripts/donate.html?Greasy+Fork+-+Search+other+sites
// @homepageURL     https://greasyfork.org/en/scripts/9630
// @supportURL      https://greasyfork.org/en/scripts/9630/feedback
// @include         https://greasyfork.org/*
// @grant           none
// ==/UserScript==

(function () {
  'use strict';

  function $(aSelector, aNode) {
    return (aNode || document).querySelector(aSelector);
  }

  function createElement(aTagName) {
    return document.createElement(aTagName);
  }

  function createText(aText) {
    return document.createTextNode(aText);
  }

  function createLink(aURL, aText, aName) {
    var link = createElement("a");
    if (aURL) {
      link.href = aURL;
    }
    if (aText) {
      link.textContent = aText;
    }
    if (aName) {
      link.name = aName;
    }
    return link;
  }

  function addStyle(aCSS) {
    var style = createElement("style");
    style.type = "text/css";
    style.textContent = aCSS;
    (document.head || document.documentElement).appendChild(style);
    return style;
  }

  var sites = [
    { name: "Userscripts.zone", url: "https://www.userscript.zone/search?source=index&q=" },
    { name: "OpenUserJS", url: "https://openuserjs.org/?q=" },
    { name: "GreasyFork", url: "https://greasyfork.org/en/scripts?q=" },
    // Add more sites here if desired
  ];

  function onsubmit(aEvent) {
    aEvent.preventDefault();
    var query = aEvent.target.q.value;
    var site = $("#search-other-sites").value;
    var searchURL = sites[site].url;
    location.assign(searchURL + encodeURIComponent(query));
  }

  function onchange() {
    var input = $("#script-search").q;
    var site = $("#search-other-sites").value;
    input.placeholder = "Search " + sites[site].name;
    $("#script-search input[type='submit']").title = input.placeholder;
  }

  var form = $("#script-search");
  if (form) {
    addStyle("#search-other-sites{direction:rtl}" +
      "#link-other-sites li{line-height:1.5em}" +
      ".search-bar-container { display: flex; align-items: flex-start; }" +
      ".search-bar-container > div { margin-right: 10px; }" +
      ".search-bar-container > select { width: 150px; }" +
      ".status-label { margin-left: 5px; font-weight: bold; }" +
      ".status-label.offline { color: red; }" +
      ".status-label.online { color: green; }");

    var searchBarContainer = createElement("div");
    searchBarContainer.classList.add("search-bar-container");

    var select = createElement("select");
    select.id = "search-other-sites";
    select.title = "Search other sites";
    sites.forEach(function (site, index) {
      var option = createElement("option");
      option.value = index;
      option.textContent = site.name;
      select.appendChild(option);
    });

    select.addEventListener("change", onchange);
    form.addEventListener("submit", onsubmit);

    searchBarContainer.appendChild(createElement("label")).appendChild(createText("Other Sites: "));
    searchBarContainer.appendChild(select);
    form.insertBefore(searchBarContainer, form.lastChild);
  }

  if (location.pathname === "/scripts/search") {
    var noScriptsFound = $("#script-list-sort + p:text('No scripts found.')");
    if (noScriptsFound) {
      var query = $("#script-search").q.value;
      var infoText = createText("Search '" + query + "' on other sites:");
      var ul = createElement("ul");
      ul.id = "link-other-sites";

      sites.forEach(function (site) {
        var li = createElement("li");
        var link = createLink(site.url + encodeURIComponent(query), site.name);
        var statusLabel = createElement("span");
        statusLabel.classList.add("status-label");
        checkURLStatus(link.href, function (online) {
          statusLabel.textContent = online ? "Online" : "Offline";
          statusLabel.classList.add(online ? "online" : "offline");
        });
        li.appendChild(link);
        li.appendChild(statusLabel);
        ul.appendChild(li);
      });

      noScriptsFound.parentNode.appendChild(createElement("br"));
      noScriptsFound.parentNode.appendChild(infoText);
      noScriptsFound.parentNode.appendChild(ul);
    }
  }

  function checkURLStatus(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        callback(xhr.status >= 200 && xhr.status < 400);
      }
    };
    xhr.open("HEAD", url, true);
    xhr.send();
  }
})();
