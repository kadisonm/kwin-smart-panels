// Copyright (C) 2026 Kadison McLellan

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

// Configuration
let config = {};

// Runtime
let windowVisible = false;

let timer = new QTimer();
timer.singleShot = true;

function loadConfig() {
    config.panels = readConfig("panelIds", "").split(",").map(panel => parseInt(panel));
    config.showOnDesktopChange = readConfig("showOnDesktopChange", true);
    config.hideAfter = readConfig("hideAfter", 1500);
    config.resourceNames = readConfig("resourceNames", "krunner,plasmashell").split(",").map(name => name.trim());
}

function showPanels() {
    for (let panel of config.panels) {
        callDBus(
            'org.kde.plasmashell', 
            '/PlasmaShell', 
            'org.kde.PlasmaShell', 
            'evaluateScript', 
            `panelById(${panel}).hiding = "windowsgobelow"`
        );
    }
}

function hidePanels() {
    for (let panel of config.panels) {
        callDBus(
            'org.kde.plasmashell', 
            '/PlasmaShell', 
            'org.kde.PlasmaShell', 
            'evaluateScript', 
            `panelById(${panel}).hiding = "dodgewindows"`
        );
    }
}

function windowAdded(window) {
    if (config.resourceNames.includes(window.resourceName)) {
        showPanels();
        timer.stop();
        windowVisible = true;
    }
}

function windowRemoved(window) {
    // User defined windows to hide panel on
    if (config.resourceNames.includes(window.resourceName)) {
        hidePanels();
        windowVisible = false;
    }
}

function desktopChanged() {
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

    timer.interval = config.hideAfter;

    // Timer can be used to hide panels after x ms
    timer.timeout.connect(function() {
        hidePanels();
    });

    // Connect signals
    workspace.windowAdded.connect(windowAdded);
    workspace.windowRemoved.connect(windowRemoved);

    if (config.showOnDesktopChange) {
        workspace.currentDesktopChanged.connect(desktopChanged);
    }
}

main();
