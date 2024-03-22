// const vscode = require('vscode');
const { registerCommands } = require('./src/globalCommands')

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	registerCommands(context)
	// console.log('info ==>', obj);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
