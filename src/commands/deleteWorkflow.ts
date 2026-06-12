import * as vscode from 'vscode';
import { StorageService } from '../services/storageService';

export async function deleteWorkflow(
  storage: StorageService
) {

  const workflows =
    storage.getWorkflows();

  if (!workflows.length) {

    vscode.window.showInformationMessage(
      'No workflow found'
    );

    return;
  }

  const groups =
    storage.getGroups();

  const selected =
    await vscode.window.showQuickPick(
      workflows.map(workflow => ({
        label:
          workflow.name,

        description:
          groups.find(
            group =>
              group.id ===
              workflow.groupId
          )?.name,
        workflow
      })),
      {
        placeHolder:
          'Select workflow to delete'
      }
    );

  if (!selected) {
    return;
  }

  const confirm =
    await vscode.window.showWarningMessage(
      `Delete "${selected.workflow.name}"?`,
      'Yes',
      'No'
    );

  if (confirm !== 'Yes') {
    return;
  }

  await storage.deleteWorkflow(
    selected.workflow.id
  );

  vscode.window.showInformationMessage(
    'Workflow deleted'
  );
}