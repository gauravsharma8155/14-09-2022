console.log("this is console for background js ");
chrome.action.onClicked.addListener((tab) => {
    console.log('clicked');

    var action_url = "index.html"
    // chrome.tabs.create({ url:  chrome.runtime.getURL("index.html") });

    // window.chrome.tabs.create({ url: action_url, type:"popup", width:400, height:400});
    // url:

    // chrome.window.create({url:action_url})

    chrome.windows.create({
        url: chrome.runtime.getURL("index.html"),
        type: "popup",
        width: 800,
        height: 377, //377
        left: Math.round(690),
        top: Math.round(400),
        focused: !0
    }, function(e) {});
    

});


// const URL = "http:\\ www.youtube.com";
// function onclickRun() { chrome.browserAction.onClicked.addListener(() => { chrome.windows.create({ type: "popup", width: 100, height: 700 }) }) } 
// onclickRun();

// var targetWindow = null;
// var tabCount = 0;

// function start(tab) {
//   chrome.windows.getCurrent(getWindows);
// }

// function getWindows(win) {
//   targetWindow = win;
//   chrome.tabs.getAllInWindow(targetWindow.id, getTabs);
// }

// function getTabs(tabs) {
//   tabCount = tabs.length;
//   // We require all the tab information to be populated.
//   chrome.windows.getAll({"populate" : true}, moveTabs);
// }

// function moveTabs(windows) {
//   var numWindows = windows.length;
//   var tabPosition = tabCount;

//   for (var i = 0; i < numWindows; i++) {
//     var win = windows[i];

//     if (targetWindow.id != win.id) {
//       var numTabs = win.tabs.length;

//       for (var j = 0; j < numTabs; j++) {
//         var tab = win.tabs[j];
//         // Move the tab into the window that triggered the browser action.
//         chrome.tabs.move(tab.id,
//             {"windowId": targetWindow.id, "index": tabPosition});
//         tabPosition++;
//       }
//     }
//   }
// }

// // Set up a click handler so that we can merge all the windows.
// chrome.browserAction.onClicked.addListener(start);