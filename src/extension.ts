import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

const REACT_COMPONENT_TEMPLATE = `interface Props {}

const 

`;

const createComponent = (componentName: string) =>
    `interface Props {}

const ${componentName} = ({}: Props) => {
	return <></>;
}

export default ${componentName};
`;

function removeExtension(fileName: string) {
    return fileName.endsWith('.tsx') ? fileName.slice(0, -4) : fileName;
}

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand(
        'vscode-tsx-populator.createTSXComponent',
        async (uri: vscode.Uri | undefined) => {
            if (!uri) {
                vscode.window.showErrorMessage(
                    'Please select a folder in the explorer.',
                );
                return;
            }

            const response = await vscode.window.showInputBox({
                prompt: 'Enter the TSX component name',
            });
            if (!response) return;

            const componentName = removeExtension(response);

            const fileName = `${componentName}.tsx`;

            const dirPath = uri.fsPath;
            const filePath = path.join(dirPath, fileName);

            const componentContent = createComponent(componentName);

            fs.writeFileSync(filePath, componentContent);

            const document = await vscode.workspace.openTextDocument(filePath);
            vscode.window.showTextDocument(document);
        },
    );

    context.subscriptions.push(disposable);
}

export function deactivate() {}
