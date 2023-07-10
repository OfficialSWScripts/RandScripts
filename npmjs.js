// ==UserScript==
// @name        npmjs -> unpkg.com && copy script tag
// @namespace   Violentmonkey Scripts
// @match       https://www.npmjs.com/package/*
// @match       https://unpkg.com/browse/*/dist/
// @grant       GM_setClipboard
// @version     1.4
// @author      hunmer
// ==/UserScript==

if (location.host === 'www.npmjs.com') {
  let span = document.querySelector('._50685029');
  let url = 'https://unpkg.com' + location.pathname.replace('package', 'browse') + '/dist/';
  
  // Open link in new tab
  let link = document.createElement('a');
  link.href = url;
  link.target = '_blank';
  link.innerHTML = span.innerHTML;
  span.innerHTML = '';
  span.appendChild(link);
} else {
  let filesTable = document.querySelector('div[data-testid="pkg-file-table"] table');
  let tableRows = filesTable && filesTable.querySelectorAll('tbody > tr');

  if (tableRows) {
    tableRows.forEach((row) => {
      let fileNameCell = row.querySelector('td:nth-child(2) a');
      
      if (fileNameCell) {
        let fileUrl = fileNameCell.href.replace('/browse/', '/');
        let fileExtension = fileUrl.split('.').pop().toLowerCase();

        let button = document.createElement('button');
        button.innerText = 'Copy';
        button.style.backgroundColor = '#f44336';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.padding = '8px 12px';
        button.style.borderRadius = '4px';
        button.style.cursor = 'pointer';

        button.addEventListener('click', () => {
          let format = '{url}';
          
          switch (fileExtension) {
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
          
          GM_setClipboard(format.replace('{url}', fileUrl));
          button.disabled = true;
          button.innerText = 'Copied!';
          setTimeout(() => {
              button.disabled = false;
              button.innerText = 'Copy';
          }, 2000);
        });

        let buttonCell = document.createElement('td');
        buttonCell.style.verticalAlign = 'middle';
        buttonCell.style.textAlign = 'center';
        buttonCell.appendChild(button);

        row.appendChild(buttonCell);
      }
    });
  }
}

// Keyboard Shortcut (Ctrl + C)
document.addEventListener('keydown', function (event) {
  if (event.ctrlKey && event.code === 'KeyC') {
    let activeButton = document.querySelector('button[disabled]');
    if (activeButton) {
      activeButton.click();
    }
  }
});
