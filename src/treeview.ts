import * as vscode from "vscode";

export class TreeDataProvider implements vscode.TreeDataProvider<TreeItem> {
  data: TreeItem[] = [];
  constructor() {}

  private _onDidChangeTreeData = new vscode.EventEmitter<
    TreeItem | undefined | null | void
  >();
  public readonly onDidChangeTreeData: vscode.Event<
    TreeItem | undefined | null | void
  > = this._onDidChangeTreeData.event;

  public refresh(name: string): void {
    this.data.push(new TreeItem("participants", [new TreeItem(name)]));
    vscode.window.showInformationMessage(name + " Joined");
    this._onDidChangeTreeData.fire();
  }

  public removeData(name: string): void {
    for (let i = 0; i < this.data.length; i++) {
      let childrens = this.data[i].children;
      if (childrens) {
        for (let j = 0; j < childrens.length; j++) {
          if (childrens[j].label === name) {
            childrens.splice(j, 1);
          }
        }
      }
    }
    vscode.window.showInformationMessage(name + " Left");
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: TreeItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return element;
  }

  getChildren(
    element?: TreeItem | undefined
  ): vscode.ProviderResult<TreeItem[]> {
    if (element === undefined) {
      return this.data;
    }
    return element.children;
  }
}

class TreeItem extends vscode.TreeItem {
  children: TreeItem[] | undefined;

  constructor(label: string, children?: TreeItem[]) {
    super(
      label,
      children === undefined
        ? vscode.TreeItemCollapsibleState.None
        : vscode.TreeItemCollapsibleState.Expanded
    );
    this.children = children;
  }
}
