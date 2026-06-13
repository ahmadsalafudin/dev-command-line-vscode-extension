import * as vscode from 'vscode';
import { StorageService } from '../services/storageService';

export async function editGroup(
  storage: StorageService,
  treeProvider: any,
  groupId: string
) {

  const groups = storage.getGroups();
  const group = groups.find(g => g.id === groupId);

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

  await storage.updateGroup({
    ...group,
    name: newName
  });

  vscode.window.showInformationMessage('Group updated');

  treeProvider.refresh();
}