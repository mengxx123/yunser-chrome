/* eslint-disable */
console.log('background - tab')
import storage from '../util/storage.js'

let allTabs = []
let closedTabOne

chrome.tabs.query({}, tabs => {
    allTabs = tabs.map(item => {
        return {
            id: item.id,
            histories: [
                {
                    favIconUrl: item.favIconUrl,
                    title: item.title,
                    url: item.url,
                }
            ]
        }
    })
    console.log('===所有tab', allTabs)
})

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (tab.status === 'complete') {
        console.log('===on update', tabId,changeInfo,tab)
        for (let i = 0; i < allTabs.length; i++) {
            if (allTabs[i].id === tabId) {
                console.log('===找到')
                allTabs[i] && allTabs[i].histories.unshift({
                    favIconUrl: tab.favIconUrl,
                    title: tab.title,
                    url: tab.url,
                })
            }
        }
        console.log('===所有tab', allTabs)
    }
})

chrome.tabs.onRemoved.addListener((tabId, info) => {
    console.log('===关闭', tabId, info)
    for (let i = 0; i < allTabs.length; i++) {
        if (allTabs[i].id === tabId) {
            console.log('===找到')
            closedTabOne = allTabs[i]
            allTabs.splice(i, 1)
        }
    }
    console.log('===所有tab', allTabs)
})

chrome.tabs.onCreated.addListener(tab => {
    console.log('===onCreated', tab)
    allTabs.push({
        id: tab.id,
        histories: {
            favIconUrl: tab.favIconUrl,
            title: tab.title,
            url: tab.url,
        }
    })
    console.log('===所有tab', allTabs)
})

chrome.extension.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'type_openCloseTab') {
        console.log('===收到打开消息', closedTabOne)
        chrome.tabs.create({
            url: closedTabOne.histories[0].url
        })
    }

    if (request.type === 'type_newTab') {
        chrome.tabs.create({
            url: 'chrome://newtab/'
        })
    }

    if (request.type === 'type_history') {
        chrome.tabs.create({
            url: 'chrome://history/'
        })
    }

    if (request.type === 'type_openUrl') {
        chrome.tabs.create({
            url: request.data
        })
    }

    if (request.type === 'type_readLater') {
        chrome.tabs.getSelected(null, tab => {
            let tempList = storage.get('tempList', [])
            tempList.unshift({
                title: tab.title,
                url: tab.url
            })
            storage.set('tempList', tempList)
            chrome.tabs.remove(tab.id)
        })
    }
})
