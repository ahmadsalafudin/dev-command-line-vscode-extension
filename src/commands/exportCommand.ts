import * as vscode from 'vscode';
import { StorageService } from '../services/storageService';


export async function exportCommand(
  storage: StorageService
) {
  const data = {
    version: 1,
    exportedAt:
      new Date()
        .toISOString(),

    description: 'Dev Command Line backup',
    groups: storage.getGroups(),
    Commands: storage.getCommands()
  };

  const uri =
    await vscode.window.showSaveDialog({
      filters: {
        JSON: ['json']
      },
      saveLabel: 'Export Backup'
    });
  if (!uri) {
    return;
  }



  await vscode.workspace.fs.writeFile(
    uri,

    Buffer.from(
      JSON.stringify(
        data,
        null,
        2
      )
    )
  );



  vscode.window.showInformationMessage(
    'Backup exported'
  );
}