import * as vscode from 'vscode';
import { StorageService } from '../services/storageService';

export async function deleteCommand(
  storage: StorageService,
  treeProvider: any,
  CommandId: string
) {

  const confirm =
    await vscode.window.showWarningMessage(
      `Delete this Command?`,
      { modal: true },
      'Delete'
    );

  if (confirm !== 'Delete') {
    return;
  }

  await storage.deleteCommand(CommandId);

  vscode.window.showInformationMessage('Command deleted');

  treeProvider.refresh();
}