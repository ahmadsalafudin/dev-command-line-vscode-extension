import * as vscode from 'vscode';
import { StorageService } from '../services/storageService';
import { WorkflowTreeProvider } from '../views/workflowTreeProvider';


export async function importWorkflow(
  storage: StorageService,
  treeProvider: WorkflowTreeProvider
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



  if (
    !files ||
    !files[0]
  ) {
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



  if (
    !data.groups ||
    !data.workflows
  ) {

    vscode.window.showErrorMessage(
      'Invalid backup file'
    );

    return;
  }



  const mode =
    await vscode.window.showQuickPick(
      [
        {
          label:
            'Replace Existing Data',

          value:
            'replace'
        },

        {
          label:
            'Merge With Existing Data',

          value:
            'merge'
        }
      ],
      {
        placeHolder:
          'Select Import Mode'
      }
    );



  if (!mode) {
    return;
  }



  if (
    mode.value ===
    'replace'
  ) {

    await storage.replaceData(
      data.groups,
      data.workflows
    );

  } else {

    await storage.mergeData(
      data.groups,
      data.workflows
    );

  }



  treeProvider.refresh();



  vscode.window.showInformationMessage(
    'Workflow imported successfully'
  );
}