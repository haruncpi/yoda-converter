const vscode = require('vscode');

/**
 * Invoke during VScode active
 * 
 * @since 1.0.0
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	context.subscriptions.push(vscode.commands.registerCommand('yodac.convertToYoda', function () {
		const activeEditor = vscode.window.activeTextEditor;
		let selectedText = activeEditor.document.getText(activeEditor.selection);

		let assignmentExp = /\$(\w+->\w+(\['?(\w+)?'?\])?|\w+|\w+\[\]|\w+\['?\w+'?\])\s?=\s?(\$\w+->\w+(\['?\w+'?\])?|('|")\w+('|")|\d+|''|\$\w+(\['?\w+'?\])?)/;
		let doubleEqualExp = /\$(\w+->\w+(\['?(\w+)?'?\])?|\w+|\w+\[\]|\w+\['?\w+'?\])\s?==\s?(\$\w+->\w+(\['?\w+'?\])?|('|")\w+('|")|\d+|''|\$\w+(\['?\w+'?\])?)/;
		let strictEqualExp = /\$(\w+->\w+(\['?(\w+)?'?\])?|\w+|\w+\[\]|\w+\['?\w+'?\])\s?===\s?(\$\w+->\w+(\['?\w+'?\])?|('|")\w+('|")|\d+|''|\$\w+(\['?\w+'?\])?)/;

		let isAssignment = assignmentExp.test(selectedText);
		let isDoubleEqual = doubleEqualExp.test(selectedText)
		let isStrictEqual = strictEqualExp.test(selectedText)

		if (isAssignment) {
			vscode.window.showInformationMessage('Assignment can not convert');
		}

		if (!isAssignment) {
			let final = '';

			if (isDoubleEqual) {
				let matchArr = selectedText.match(new RegExp(doubleEqualExp, 'g'))
				selectedText = matchArr[0];

				let arr = selectedText.split('==').map(function (el) {
					return el.trim()
				})

				final = `${arr[1]} == ${arr[0]}`;
			}

			// 3-equal check.
			if (isStrictEqual) {
				let matchArr = selectedText.match(new RegExp(strictEqualExp, 'g'))
				selectedText = matchArr[0] ? matchArr[0] : '';

				let arr = selectedText.split('===').map(function (el) {
					return el.trim()
				})

				final = `${arr[1]} === ${arr[0]}`;
			}

			if (final.trim().length != '') {
				activeEditor.edit((selectedText) => {
					selectedText.replace(activeEditor.selection, final);
				})
			}

		}

	}));

}

function deactivate() { }

module.exports = {
	activate,
	deactivate
}
