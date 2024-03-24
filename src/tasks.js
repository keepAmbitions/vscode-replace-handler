const vscode = require('vscode')
const { parse } = require('@babel/parser')
const traverse = require('@babel/traverse').default
const { getCN2IdAsMap, getRangeFrom } = require('./methods')

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
        plugins: ['jsx'] // TODO 这里有待补充
    })
}

/**
 * 检查目标节点并收集target相关的信息
*/
const checkTarget = (path, targetNodes) => {
    // console.log('path.node', path.node);
    const { loc, value, type } = path.node
    let targetString;
    // 这里根据测试用例，暂时只处理以下三种情况
    // 1. TemplateElement
    // 2. StringLiteral
    // 3. JSXText
    // TODO 其它用例，有待补充
    switch (type) {
        case 'TemplateElement':
            targetString = value.raw.trim();
            break;
        default: targetString = value.trim();
            break;
    }
    if (targetString && getCN2IdAsMap().hasOwnProperty(targetString)) {
        // targetStrings.push(targetString)
        targetNodes.push({ loc, value: targetString })
    }
}
const traverseAST = () => {
    // 用于收集目标节点
    const targetNodes = []
    const ast = getActiveTextAsAST();
    traverse(ast, {
        // 模板字符串中的中文
        TemplateElement(path) {
            checkTarget(path, targetNodes)
        },
        StringLiteral(path) {
            checkTarget(path, targetNodes)
        },
        JSXText(path) {
            checkTarget(path, targetNodes)
        }
    })
    console.log('targetNodes=>', targetNodes);
    return targetNodes
}

const replaceAllTargets = async () => {
    if (!activeTextEditor) return
    const editorEdit = new vscode.WorkspaceEdit();
    const { document } = activeTextEditor;
    const Nodes = traverseAST()
    // console.log('Nodes=>', Nodes);
    if (Nodes.length === 0) {
        vscode.window.showInformationMessage("没有找到可替换的文案");
        return;
    }
    if (Nodes.length > 0) {
        Nodes.reverse().forEach(({ loc, value }) => {
            const textToReplace = getCN2IdAsMap()[value]
            // TODO textToReplace这里最终要替换成什么样的值，要根据具体业务再分别处理
            editorEdit.replace(document.uri, getRangeFrom(loc), textToReplace)
        })
    }
    // 应用编辑到文档
    // FIXME 执行这里有个异步报错，暂时未找到原因，不影响最终替换结果
    await vscode.workspace.applyEdit(editorEdit)
}

// 这种只适用于单个替换
// const replaceTarget = (range, textToReplace) => {
//     activeTextEditor.edit(editBuilder => {  
//         editBuilder.replace(range, textToReplace); // 替换指定范围内的文本  
//     }).then(success => {  
//         if (success) {  
//             vscode.window.showInformationMessage('Text replaced successfully at the specified range.');  
//         } else {  
//             vscode.window.showErrorMessage('Failed to replace text at the specified range.');  
//         }  
//     }); 
// }
module.exports = {
    getActiveText,
    getActiveTextAsAST,
    traverseAST,
    replaceAllTargets
    // replaceTarget
}