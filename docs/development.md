# Development
API: https://develop.kde.org/docs/plasma/kwin/api/#signals-1
GUIDE: https://develop.kde.org/docs/plasma/kwin/#output

## Debugging
Execute the script using: `WM Console`.
Or running:
`plasma-interactiveconsole --kwin`

Access the console output with:
`journalctl -f QT_CATEGORY=js QT_CATEGORY=kwin_scripting`

If you find that multiple instances seem to be running at the same time, then you need to logout and log back in to reload the scripts.

## Contributing
Feel free to make a pull request if you have a new feature or patch a bug.