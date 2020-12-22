import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
export class Sidebar implements vscode.WebviewViewProvider {
  _view?: vscode.WebviewView;
  constructor(private readonly extensionPath: string) {}
  public resolveWebviewView(webviewView: vscode.WebviewView) {
    this._view = webviewView;
    webviewView.webview.options = {
      enableScripts: true,
    };
    const filePath: vscode.Uri = vscode.Uri.file(
      path.join(this.extensionPath, "src", "page3.html")
    );
    webviewView.webview.html = fs.readFileSync(filePath.fsPath, "utf-8");
  }

  public getMessage(name: string) {
    //this.resolveWebviewView(this._view);
  }
}
