/* eslint-disable */

console.log('asd2345', chrome.webRequest)

// chrome.webRequest.onHeadersReceived.addListener(function (res, asd){
//     console.log('webRequest请求', res, asd)
// })

// chrome.webRequest.onHeadersReceived.addListener(function(details) {
//     details.responseHeaders.push({name:'Access-Control-Allow-Origin',value:"*"});
//     console.log(details.responseHeaders)
//       return {responseHeaders:details.responseHeaders};
//       }
// )

let requuestMap = {

}

chrome.webRequest.onHeadersReceived.addListener(details => {
    console.log(details)
    requuestMap[details.url] = details
}, {
    urls: ["<all_urls>"],
    "types": [
        "main_frame", 
        "sub_frame", 
        "stylesheet", 
        "script", 
        "image", 
        "object", 
        "xmlhttprequest", 
        "other"
    ]
},
["responseHeaders"])

chrome.extension.onMessage.addListener(function(request,sender,sendResponse){
  if (request.type === 'getHeaders') {
    sendResponse(requuestMap[request.url])
  }
})