const vscode = require('vscode');
const { traverseAST } = require('./tasks')
/**
 * 注册全局指令
 * 这是全局指令的集合
*/
exports.registerCommands = (context) => {
    // The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('replace-handler.helloWorld', function () {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from replace-handler!');
	});

	context.subscriptions.push(disposable);

    vscode.commands.registerCommand('replace-handler.replaceAll', () => {
        console.log('replace-handler.replaceAll', traverseAST());
    });
}
