const { app, BrowserWindow } = require('electron')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: "apple-touch-icon"
  })

  win.loadFile('index.html')
}

app.on('ready', createWindow)

app.on('window-all-closed', function() {
  if(process.platform !== 'darwin')
  app.quit()
})

app.on('activate', function() {
  if (mainWindow === null)
  createWindow();
})  