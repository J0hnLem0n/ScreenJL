const electron = require('electron')
const {
  app,
  BrowserWindow,
  globalShortcut,
  desktopCapturer
} = require('electron')

let mainWindow

function createWindow () {
  let displays = electron.screen.getAllDisplays()
  let externalDisplay = displays.find((display) => {
    return display.bounds.x !== 0 || display.bounds.y !== 0
  });
  const winSize = displays.reduce(function(size, val) {
      size.width += val.size.width
      size.height += val.size.height
      return size;
    }
  , {width:0, height:0});
  if (externalDisplay) {
    mainWindow = new BrowserWindow({
      resizable: false,
      frame: false,
      titleBarStyle: 'hidden',
    });
    mainWindow.loadURL(`file://${__dirname}/index.html`)
  }
  mainWindow.setContentSize(winSize.width, winSize.height)
  mainWindow.setPosition(0,0)

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  mainWindow.on('closed', function () {
    mainWindow = null
  })

  globalShortcut.register('PrintScreen', () => {
    console.log('click')
  })
  globalShortcut.register('Esc', () => {
    app.quit()
  })
}

app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})
