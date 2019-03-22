/* eslint-disable */

function initOmnibox() {
  chrome.omnibox.onInputChanged.addListener(
      function (text, suggest) {
          console.log('inputChanged: ' + text);
          suggest([
              { content: text + " one", description: "the first one" },
              { content: text + " number two", description: "the second entry" }
          ]);
      })

  chrome.omnibox.onInputEntered.addListener(text => {
      if (!text) {
          return
      }
      let url = 'https://search.yunser.com/search?keyword=' + encodeURIComponent(text)
      console.log('url', url)
      chrome.tabs.getSelected(null, tab => {
          chrome.tabs.update(tab.id, {
              url
          })
      })
  })
}

initOmnibox()