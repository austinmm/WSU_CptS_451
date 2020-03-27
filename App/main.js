const { app, BrowserWindow } = require("electron");
const ipcMain = require("electron").ipcMain;
const url = require("url");
const path = require("path");

let win;
var businessData = {};

function createWindow() {
	// Create the browser window.
	win = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			nodeIntegration: true
		},
		show: true
	});

	// and load the index.html of the app.
	win.loadURL(
		url.format({
			pathname: path.join(__dirname, "index.html"),
			protocol: "file:",
			slashes: true
		})
	);

	let server = require("./server/server.js");
	// Open the DevTools.
	win.webContents.openDevTools();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.

app.whenReady().then(createWindow);

// IPC messages

// Event handler for asynchronous incoming messages
ipcMain.on("set-business-data", (event, arg) => {
	console.log(arg);
	businessData.info = arg;
	event.sender.send("reply-business-data", businessData);
});

// Event handler for asynchronous incoming messages
ipcMain.on("get-business-data", (event, arg) => {
	// Event emitter for sending asynchronous messages
	event.sender.send("listen-business-data", businessData);
});

// Quit when all windows are closed.
app.on("window-all-closed", () => {
	// On macOS it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== "darwin") {
		app.quit();
	}
});

app.on("activate", () => {
	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
