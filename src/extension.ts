import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  const openCommand = vscode.commands.registerCommand("hoogle-webview.openWebview", () => {
    new HoogleWebview(context);
  });

  context.subscriptions.push();
  context.subscriptions.push(openCommand);
}

export function deactivate() {}

class HoogleWebview {
  public static readonly viewType = "hoogle-webview.hoogleWebview";

  private _webviewPanel?: vscode.WebviewPanel;
  private _hoogleUrl: string;

  constructor(private readonly context: vscode.ExtensionContext) {
    this._hoogleUrl =
      vscode.workspace.getConfiguration("hoogle-webview").get("hoogleUrl") ??
      "https://hoogle.haskell.org/";
    this.createWebviewPanel(context);
  }

  private createWebviewPanel(context: vscode.ExtensionContext): vscode.WebviewPanel {
    const webviewPanel = vscode.window.createWebviewPanel(
      HoogleWebview.viewType,
      "Hoogle Webview",
      vscode.ViewColumn.Two,
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
