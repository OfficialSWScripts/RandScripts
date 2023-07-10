// ==UserScript==
// @name        npmjs -> unpkg.com && copy script tag
// @namespace   Violentmonkey Scripts
// @match       https://www.npmjs.com/package/*
// @match       https://unpkg.com/browse/*/dist/
// @grant       GM_setClipboard
// @version     1.2
// @author      hunmer
// @description 2022/6/28 00:37:30
// ==/UserScript==

if (location.host == 'www.npmjs.com') {
  let span = document.querySelector('._50685029');
  let url = 'https://unpkg.com' + location.pathname.replace('package', 'browse') + '/dist/';
  
  // Open link in new tab
  span.innerHTML = '<a href="' + url + '" target="_blank">' + span.innerHTML + '</a>';
} else {
  let [first, second, ...trs] = document.querySelectorAll('tr');
  
  for (let tr of trs) {
    let btn = document.createElement('button');
    
    btn.onclick = e => {
      let url = tr.querySelector('a').href.replace('/browse/', '/')
      let ext = url.split('.').at(-1).toLowerCase();
      let format = '{url}';
      
      switch (ext) {
        case 'css':
          format = '<link href="{url}" rel="stylesheet" />';
          break;
          
        case 'js':
          format = '<script src="{url}"></script>';
          break;
          
        // Add support for additional file types
        case 'png':
          format = '<img src="{url}" alt="Image" />';
          break;
          
        case 'json':
          format = '<script src="{url}"></script>';
          break;
      }
      
      GM_setClipboard(format.replace('{url}', url));
      
      // Provide copy notification
      btn.innerText = 'Copied!';
      btn.disabled = true;
    }
    
    // Add a class to the button for styling
    btn.className = 'copy-button';
    
    // Improved Button Styling
    btn.style.backgroundColor = '#f44336';
    btn.style.color = 'white';
    btn.style.border = 'none';
    btn.style.padding = '8px 12px';
    btn.style.borderRadius = '4px';
    btn.style.cursor = 'pointer';
    
    let td = document.createElement('td');
    td.append(btn);
    tr.append(td);
  }
}

// Keyboard Shortcut (Ctrl + C)
document.addEventListener('keydown', function (event) {
  if (event.ctrlKey && event.code === "KeyC") {
    let activeButton = document.querySelector('.copy-button');
    if (activeButton) {
      activeButton.click();
    }
  }
});
