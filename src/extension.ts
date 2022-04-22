// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

let hoogleWebview: HoogleWebview | null = null;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "hoogle-webview" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  const openCommand = vscode.commands.registerCommand("hoogle-webview.openWebview", () => {
    const hoogleUrl = vscode.workspace.getConfiguration("hoogle-webview").get("hoogleUrl");
    if (hoogleWebview === null) {
      hoogleWebview = new HoogleWebview(context);
    } else {
      hoogleWebview.show();
    }
    // The code you place here will be executed every time your command is executed
    // Display a message box to the user
  });

  context.subscriptions.push();

  context.subscriptions.push(openCommand);
}

// this method is called when your extension is deactivated
export function deactivate() {}

// Webview class for the application
class HoogleWebview implements vscode.WebviewViewProvider {
  public static readonly viewType = "hoogle-webview.hoogleWebview";
  public static _instance?: HoogleWebview;
  public static instance(context: vscode.ExtensionContext): HoogleWebview {
    if (!HoogleWebview._instance) {
      HoogleWebview._instance = new HoogleWebview(context);
    }

    return HoogleWebview._instance;
  }

  private _webviewPanel?: vscode.WebviewPanel;
  private _hoogleUrl: string;

  constructor(private readonly context: vscode.ExtensionContext) {
    this._hoogleUrl =
      vscode.workspace.getConfiguration("hoogle-webview").get("hoogleUrl") ??
      "https://hoogle.haskell.org/";
    this._webviewPanel = this.createWebviewPanel(context);
  }

  public show() {
    if (this._webviewPanel === undefined) {
      this._webviewPanel = this.createWebviewPanel(this.context);
    }
    this._webviewPanel.reveal();
  }

  private createWebviewPanel(context: vscode.ExtensionContext): vscode.WebviewPanel {
    const webviewPanel = vscode.window.createWebviewPanel(
      HoogleWebview.viewType,
      "Hoogle Webview",
      vscode.ViewColumn.Beside,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        enableFindWidget: true,
      }
    );

    webviewPanel.webview.html = this.getWebviewContent();

    webviewPanel.onDidDispose(
      () => {
        this._webviewPanel = undefined;
      },
      null,
      this.context.subscriptions
    );

    return webviewPanel;
  }

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext<unknown>,
    token: vscode.CancellationToken
  ): void | Thenable<void> {
    if (this._webviewPanel === undefined) {
      this._webviewPanel = this.createWebviewPanel(this.context);
      this._webviewPanel;
    }
  }

  private getWebviewContent(): string {
    return `<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>Hoogle Webview</title>
			<style>
				html, body {
					height: 100%;
					background-color: white;
				}

				#frame {
					width: 100%;
					height: 100%;
				}
			</style>
		</head>
		<body>
			<iframe id="frame" src="${this._hoogleUrl}" width="100%" height="100%" frameborder="0"></iframe>
		</body>
		</html>`;
  }
}
