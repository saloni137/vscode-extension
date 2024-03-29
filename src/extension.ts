import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import { TreeDataProvider } from "./treeview";
import { MeetTreeView } from "./meet-tree";
const express = require("express");
const app = express();
import * as cors from "cors";
import { Sidebar } from "./sideBar";
let t = new TreeDataProvider();
let m = new MeetTreeView();
let s: Sidebar;
let meetingId = "";
let meetingName = "";
const socket = require("socket.io");
app.use(cors());

app.get("/sendParticipants/:participant", (req: any, res: any) => {
  t.refresh(req.params.participant);
  res.send("");
});

app.get("/sendMeetingId/:meetingId", (req: any, res: any) => {
  m.refresh(req.params.meetingId);
  res.send("");
});

app.get("/removeParticipants/:participant", (req: any, res: any) => {
  t.removeData(req.params.participant);
  res.send("");
});

app.get("/setSession", (req: any, res: any) => {
  return res.json({ meetingId: meetingId, meetingName: meetingName });
});

app.get("/leaveMeeting", (req: any, res: any) => {
  vscode.workspace
    .getConfiguration("zujonow")
    .update("isMeetingActive", false, vscode.ConfigurationTarget.Global);
});

app.listen(9000);

// sockerio server for chat
let server = express();
server.set("port", 1000);
server.use(express.static("src"));
server.use(cors());
var http = require("http").Server(server);
let io = socket(http, {
  cors: {
    origin: "*",
  },
});
io.on("connection", (socket: any) => {
  socket.on("chat", (data: any) => {
    io.sockets.emit("chat", data);
  });
  socket.on("messages", (data: any) => {
    io.sockets.emit("messages", data);
  });
});
http.listen(1000);

export function activate(context: vscode.ExtensionContext) {
  vscode.workspace
    .getConfiguration("zujonow")
    .update("isMeetingActive", false, vscode.ConfigurationTarget.Global);

  let disposable = vscode.commands.registerCommand("meeting.join", async () => {
    let meetingCode = await vscode.window.showInputBox({
      placeHolder: "Enter the meeting code",
    });
    if (meetingCode) {
      let path = vscode.Uri.parse("" + meetingCode);
      meetingId = path.path.replace("/", "");
    }
    let name = await vscode.window.showInputBox({
      placeHolder: "Enter Your Name",
    });
    if (name) {
      let path = vscode.Uri.parse("" + name);
      meetingName = path.path.replace("/", "");
    }

    vscode.commands.executeCommand("meeting.start");
  });

  let webview = vscode.commands.registerCommand("meeting.start", () => {
    let panel = vscode.window.createWebviewPanel(
      "meeting",
      "ZujoNow",
      vscode.ViewColumn.One,
      {
        enableScripts: true,
      }
    );
    const filePath: vscode.Uri = vscode.Uri.file(
      path.join(context.extensionPath, "src", "page1.html")
    );
    panel.webview.html = fs.readFileSync(filePath.fsPath, "utf-8");
    s = new Sidebar(context.extensionPath);
    context.subscriptions.push(
      vscode.window.registerWebviewViewProvider("sidebar", s)
    );

    vscode.window.registerTreeDataProvider("zujoCall", t);
    vscode.window.registerTreeDataProvider("meetInfo", m);

    vscode.workspace
      .getConfiguration("zujonow")
      .update("isMeetingActive", true, vscode.ConfigurationTarget.Global);
  });

  context.subscriptions.push(disposable);
  context.subscriptions.push(webview);
}
export function deactivate() {}
