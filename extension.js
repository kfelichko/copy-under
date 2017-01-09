// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
var vscode = require('vscode');
var path = require('path');

function activate(context) {

    var disposable = vscode.commands.registerCommand('extension.copyUnder', function () {
       var oldEditor = vscode.window.activeTextEditor;
        if (!oldEditor) {
	        return;
        }

        if (oldEditor.selection.isEmpty && oldEditor.selections.length == 0) {
            return;
        }

        var document = oldEditor.document;
        
        var ext = path.extname(document.fileName);
        var untitled = vscode.Uri.parse(`untitled:${vscode.workspace.rootPath}/new${ext}`);
        
        vscode.workspace.openTextDocument(untitled).then((newbie) => {
            vscode.window.showTextDocument(newbie, 1, false).then((newEditor) => {
                newEditor.edit((edit) => {
                    var selections = oldEditor.selections;
                    for (var idx = 0; idx < selections.length; ++idx) {
                        var selection = selections[idx];
                        var selectedText = oldEditor.document.getText(selection);
                        edit.insert(new vscode.Position(idx, 0), `${selectedText}\n`);
                    };
                });
            });
        });
    });

    context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;