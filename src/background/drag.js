/* eslint-disable */
console.log('drag background')

function tabAction(tab, drag_data) {
    var new_idx = tab.index;
    if (drag_data.x_dir > 0) {
        ++new_idx;
    }
    var fg = (drag_data.y_dir == 1);
    var link;
    if (drag_data.selection.type == "text") {
        var engine = "https://www.baidu.com/s?wd=";
        link = engine + drag_data.selection.data;
    } else {
        link = drag_data.selection.data;
    }
    chrome.tabs.create({ url: link, selected: fg, index: new_idx });
}

chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.type === "drag_and_go") {
        chrome.tabs.getSelected(null, function (tab) {
            tabAction(tab, request)
        })
    }
})