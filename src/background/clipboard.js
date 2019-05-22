/* eslint-disable */
console.log('background - clipboard')

let clipboards = []
let latestClipboardData = ''

function getClipboard() {
    var t = document.createElement("input");
    document.body.appendChild(t);
    t.focus();
    document.execCommand("paste");
    var clipboardText = t.value; //this is your clipboard data
    // alert('asd' + clipboardText); //prepends "Hi" to the clipboard text
    // console.log('asd' + clipboardText)
    document.body.removeChild(t);
    return clipboardText

    // console.log('huoqu jianqieban')
    // let bg = chrome.extension.getBackgroundPage();        // get the background page
    // bg.document.body.innerHTML= "";                   // clear the background page

    // // add a DIV, contentEditable=true, to accept the paste action
    // var helperdiv = bg.document.createElement("div");
    // document.body.appendChild(helperdiv);
    // helperdiv.contentEditable = true;

    // // focus the helper div's content
    // var range = document.createRange();
    // range.selectNode(helperdiv);
    // window.getSelection().removeAllRanges();
    // window.getSelection().addRange(range);
    // helperdiv.focus();    

    // // trigger the paste action
    // bg.document.execCommand("Paste");

    // // read the clipboard contents from the helperdiv
    // var clipboardContents = helperdiv.innerHTML;
    // alert(clipboardContents)
}

chrome.extension.onMessage.addListener(function(request,sender,sendResponse){
    if (request.type === 'getClipboard') {
        sendResponse({
            type: 'getClipboardSuccess',
            data: getClipboard()
        })
    }
})

latestClipboardData = getClipboard()
console.log('latestClipboardData', latestClipboardData)
setInterval(() => {
    let data = getClipboard()
    if (data !== latestClipboardData) {
        console.log('剪切板变了')
        console.log('data', data)
        latestClipboardData = data
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
                type: 'type_clipboardChange',
                data: latestClipboardData
            })
        })
    }
}, 1000)
