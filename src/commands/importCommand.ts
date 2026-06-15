import * as vscode from 'vscode';
import { StorageService } from '../services/storageService';
import { CommandTreeProvider } from '../views/commandTreeProvider';

export async function importCommand(
  storage: StorageService,
  treeProvider: CommandTreeProvider
) {
  const files =
    await vscode.window.showOpenDialog({
      filters: {
        JSON: [
          'json'
        ]
      },
      canSelectMany: false
    });

  if (!files || !files[0]) {
    return;
  }

  const buffer =
    await vscode.workspace.fs.readFile(
      files[0]
    );

  const data =
    JSON.parse(
      Buffer.from(buffer)
        .toString('utf-8')
    );

  if (!data.groups || !data.Commands) {
    vscode.window.showErrorMessage('Invalid backup file');
    return;
  }

  const mode =
    await vscode.window.showQuickPick(
      [
        {
          label: 'Replace Existing Data',
          value: 'replace'
        },

        {
          label: 'Merge With Existing Data',
          value: 'merge'
        }
      ],
      {
        placeHolder: 'Select Import Mode'
      }
    );

  if (!mode) {
    return;
  }

  if (mode.value === 'replace') {
    await storage.replaceData(
      data.groups,
      data.Commands
    );
  } else {
    await storage.mergeData(
      data.groups,
      data.Commands
    );
  }

  treeProvider.refresh();

  vscode.window.showInformationMessage(
    'Command imported successfully'
  );
}