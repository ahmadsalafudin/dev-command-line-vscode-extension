import * as vscode from 'vscode';
import { StorageService } from '../services/storageService';

export async function editGroup(
  storage: StorageService
) {

  const groups =
    storage.getGroups();

  if (!groups.length) {

    vscode.window.showInformationMessage(
      'No group found'
    );

    return;
  }

  const selected =
    await vscode.window.showQuickPick(
      groups.map(group => ({
        label: group.name,
        group
      })),
      {
        placeHolder:
          'Select Group'
      }
    );

  if (!selected) {
    return;
  }

  const name =
    await vscode.window.showInputBox({
      prompt:
        'Group Name',
      value:
        selected.group.name
    });

  if (!name) {
    return;
  }

  await storage.updateGroup({
    ...selected.group,
    name
  });

  vscode.window.showInformationMessage(
    'Group updated'
  );
}