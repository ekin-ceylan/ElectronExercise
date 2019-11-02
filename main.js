const electron = require("electron");
const url = require("url");
const path = require("path");

const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow;
const isMac = process.platform == "darwin";
const isProd = process.env.NODE_ENV == "production";

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        webPreferences: {nodeIntegration: true}
    });

    let urlParam = url.format({
        pathname: path.join(__dirname, "main.html"),
        protocol: "file:",
        slashes: true
    });

    mainWindow.loadURL(urlParam);

    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    Menu.setApplicationMenu(mainMenu);

    ipcMain.on("key:inputValue", (err, data) => {
        console.log(data);
    });
});

const mainMenuTemplate = [
    {
        label: "Dosya",
        submenu: [
            { label: "Yeni TODO Ekle" },
            { label: "Tümünü Sil" },
            {
                label: "Çıkış",
                role: "quit",
                accelerator: isMac ? "Command+Q" : "Ctrl+Q"
            }
        ]
    }
];

if (isMac) {
    mainMenuTemplate.unshift({
        label: app.name,
        role: "TODO"
    })
}

if (!isProd) {
    mainMenuTemplate.push(
        {
            label: "Dev Tools",
            submenu: [
                {
                    label: "Geliştirici Penceresini Aç",
                    click(item, focusedWindow) {
                        focusedWindow.toggleDevTools();
                    }
                },
                {
                    label: "Yenile",
                    role: "reload"
                },
            ]
        }
    );
}