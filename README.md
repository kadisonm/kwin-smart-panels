# kwin-smart-panel
A KWin script that automatically shows your panels during key actions (Switching Desktops / KRunner / Application Launcher).

## Installation

## Usage
In the script's config, add a new entry with your panel IDs.

Get the ID of your panels in:
`~/.config/plasmashellrc`

## Contribution
Execute the script using: `WM Console`.
Or running:
`plasma-interactiveconsole --kwin`

Access the console output with:
`journalctl -f QT_CATEGORY=js QT_CATEGORY=kwin_scripting`