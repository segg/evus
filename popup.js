$("#import").click(function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.executeScript(
            tabs[0].id,
            { code: 'importData();' });
    });
});

$("#clear").click(function () {
    if (!confirm("Delete all the imported data?")) {
        return;
    }
    chrome.storage.sync.clear(function () {
        refresh();
    });
});

$("#help").click(function () {
    chrome.tabs.create({url: "https://github.com/segg/evus/blob/master/README.md"});
});


function refresh() {
    chrome.storage.sync.get(null, function (data) {
        $("#candidates").html("");
        $("#data").hide();
        const fullNames = Object.keys(data);
        for (const fullName of fullNames) {
            let button = $(`<button>${fullName}</button>`);
            button.click(function () {
                chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                    chrome.tabs.executeScript(
                        tabs[0].id,
                        { code: `fillForm("${fullName}");` });
                });
            });
            button.appendTo("#candidates");
            $("#data").show();
        }
    });
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.cmd === "refresh") {
        refresh();
    }
});

refresh();