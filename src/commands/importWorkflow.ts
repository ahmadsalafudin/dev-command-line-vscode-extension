import * as vscode from 'vscode';
import { StorageService } from '../services/storageService';


export async function importWorkflow(
  storage: StorageService
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


  const json =
    JSON.parse(
      Buffer.from(buffer)
        .toString('utf-8')
    );


  await storage.importData(
    json
  );


  vscode.window.showInformationMessage(
    'Workflow imported'
  );
}