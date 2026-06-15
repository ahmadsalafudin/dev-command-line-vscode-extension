import * as vscode from 'vscode';
import { StorageService } from '../services/storageService';

export async function editGroup(
  storage: StorageService,
  treeProvider: any,
  groupId: string
) {

  const groups = storage.getGroups();
  const group =
    groups.find(
      item =>
        item.id === groupId
    );

  if (!group) {
    return;
  }

  const newName =
    await vscode.window.showInputBox({
      value: group.name,
      prompt: 'Group Name'
    });

  if (!newName) {
    return;
  }

  const cleanName = newName.trim();
  const exists =
    groups.some(
      item =>
        item.id !== group.id &&
        item.name
          .trim()
          .toLowerCase() ===
        cleanName
          .toLowerCase()
    );

  if (exists) {
    vscode.window.showWarningMessage(
      'Group name already exists'
    );
    return;
  }

  await storage.updateGroup({
    ...group,
    name:
      cleanName
  });

  vscode.window.showInformationMessage(
    'Group updated'
  );


  treeProvider.refresh();
}