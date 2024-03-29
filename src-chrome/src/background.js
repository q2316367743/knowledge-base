// 图标点击事件：跳转指定网页
chrome.action.onClicked.addListener(() => {
    chrome.tabs.create({'url': chrome.runtime.getURL('dist/index.html')}, function (tab) {
    });
});
