const vscode = require('vscode')
const { parse } = require('@babel/parser')
const traverse = require('@babel/traverse').default
const { getCN2IdAsMap } =require('./methods')

const activeTextEditor = vscode.window.activeTextEditor;

const getActiveText = () => {
    if (!activeTextEditor) {
        return ''
    }
    return activeTextEditor.document.getText()
}
const getActiveTextAsAST = () => {
    const text = getActiveText()
    return parse(text, {
        sourceType: 'module',
        plugins: ['jsx']
    })
}
const traverseAST = () => {
    const ast = getActiveTextAsAST();
    traverse(ast, {
        StringLiteral(path) {
            const targetString = path.node.value.trim()
            if (targetString && getCN2IdAsMap().hasOwnProperty(targetString)) {
                // path.node.value = getCN2IdAsMap()[targetString]
                console.log(targetString)
            }
        },
        JSXText(path) {
            const targetString = path.node.value.trim()
            if (targetString && getCN2IdAsMap().hasOwnProperty(targetString)) {
                console.log(targetString)
            }
        }
    })
}
module.exports = {
    getActiveText,
    getActiveTextAsAST,
    traverseAST
}