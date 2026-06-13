import * as vscode from 'vscode';
import { StorageService } from '../services/storageService';

export async function deleteWorkflow(
  storage: StorageService,
  treeProvider: any,
  workflowId: string
) {

  const confirm =
    await vscode.window.showWarningMessage(
      `Delete this workflow?`,
      { modal: true },
      'Delete'
    );

  if (confirm !== 'Delete') {
    return;
  }

  await storage.deleteWorkflow(workflowId);

  vscode.window.showInformationMessage('Workflow deleted');

  treeProvider.refresh();
}