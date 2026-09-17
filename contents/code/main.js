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
const PANELS = readConfig("panelIds", "106,143").split(",").map(panel => parseInt(panel));
const SHOW_ON_DESKTOP_CHANGE = readConfig("showOnDesktopChange", true);
const HIDE_AFTER = readConfig("hideAfter", 1500);
const RESOURCE_NAMES = readConfig("resourceNames", "krunner,plasmashell").split(",").map(name => name.trim());

// Runtime
let windowVisible = false;

let timer = new QTimer();
timer.interval = HIDE_AFTER;
timer.singleShot = true;

for (let name in RESOURCE_NAMES) {
    print("NAME:" + name);
}

function showPanels() {
    for (let panel of PANELS) {
        print("SHOW:" + panel);
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
    for (let panel of PANELS) {
        print("HIDE" + panel);
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
    if (window.resourceName in RESOURCE_NAMES) {
        showPanels();
        windowVisible = true;
    }
}

function windowRemoved(window) {
    if (window.resourceName in RESOURCE_NAMES) {
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

    // Timer can be used to hide panels after x ms
    timer.timeout.connect(function() {
        hidePanels();
        print("3 seconds passed!");
    });

    // Connect signals
    workspace.windowAdded.connect(windowAdded);
    workspace.windowRemoved.connect(windowRemoved);

    if (SHOW_ON_DESKTOP_CHANGE) {
        workspace.currentDesktopChanged.connect(desktopChanged);
    }
}

main();
