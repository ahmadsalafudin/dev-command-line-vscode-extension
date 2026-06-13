import * as vscode from 'vscode';
import { StorageService } from '../services/storageService';


export async function exportWorkflow(
  storage: StorageService
) {

  const data = {
    instruction: [
      "Import this file using Dev Workflow > Import",
      "groups contains workflow groups",
      "workflows contains workflow commands"
    ],

    groups:
      storage.getGroups(),

    workflows:
      storage.getWorkflows()
  };


  const uri =
    await vscode.window.showSaveDialog({
      filters: {
        JSON: [
          'json'
        ]
      }
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
    'Workflow exported'
  );
}