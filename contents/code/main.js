var windowVisible = false;

function loadConfig() {

}

function showPanels() {
    callDBus('org.kde.plasmashell', '/PlasmaShell', 'org.kde.PlasmaShell', 'evaluateScript', 'panelById(106).hiding = "windowsgobelow"');
    callDBus('org.kde.plasmashell', '/PlasmaShell', 'org.kde.PlasmaShell', 'evaluateScript', 'panelById(143).hiding = "windowsgobelow"');
}

function hidePanels() {
    callDBus('org.kde.plasmashell', '/PlasmaShell', 'org.kde.PlasmaShell', 'evaluateScript', 'panelById(106).hiding = "dodgewindows"');
    callDBus('org.kde.plasmashell', '/PlasmaShell', 'org.kde.PlasmaShell', 'evaluateScript', 'panelById(143).hiding = "dodgewindows"');
}

function windowAdded(window) {
    if (window.resourceName == "plasmashell" || window.resourceName == "krunner") {
        showPanels();
        windowVisible = true;
    }
}

function windowRemoved(window) {
    if (window.resourceName == "plasmashell" || window.resourceName == "krunner") {
        hidePanels();
        windowVisible = false;
    }
}

function desktopChanged(timer) {
    // Prevents panels being hidden while switching desktops with KRunner open
    if (windowVisible) {
        timer.stop();
        return;
    }

    // Restarts the timer if one is already active
    if (timer.active) {
        timer.stop();
    }
     
    // Show and start timer to hide
    showPanels();
    timer.start();
}

function main() {
    // Set up
    print("===== Smart Panels Loaded ====")
    loadConfig();

    // Timer can be used to hide panels after x ms
    var timer = new QTimer();
    timer.interval = 3000;
    timer.singleShot = true;

    timer.timeout.connect(function() {
        hidePanels();
        print("3 seconds passed!");
    });    

    // Connect signals
    workspace.windowAdded.connect(windowAdded);
    workspace.windowRemoved.connect(windowRemoved);
    workspace.currentDesktopChanged.connect(() => desktopChanged(timer));
}

main();
