const vscode = require('vscode');
const corpus = require("./corpus");

/**
 * 获取语言名与对应的id的映射关系
 * @return {Object}
 * @example
 * {
 *   "C++": 63,
 *   "Python": 64,
 *   ...
 * }
*/
const getCN2IdAsMap = () => corpus.reduce((acc, cur) => {
    acc[cur.cn] = cur.id;
    return acc;
}, {})

/**  
 * 将 Babel AST 节点的 loc 对象转换为 VSCode 的 Range 对象。  
 * @param loc Babel AST 节点的 loc 对象  
 * @returns VSCode 的 Range 对象  
 */
const getRangeFrom = loc => {  
    const startLine = loc.start.line - 1; // VSCode 行号从0开始  
    const startCharacter = loc.start.column; // 经过测试，这里不需要-1 
    const endLine = loc.end.line - 1; // VSCode 行号从0开始
    const endCharacter = loc.end.column; // end.column 是结束位置的下一个字符，所以不需要减1  
  
    const startPosition = new vscode.Position(startLine, startCharacter);  
    const endPosition = new vscode.Position(endLine, endCharacter);  
  
    return new vscode.Range(startPosition, endPosition);  
}

module.exports = {
    getCN2IdAsMap,
    getRangeFrom
}