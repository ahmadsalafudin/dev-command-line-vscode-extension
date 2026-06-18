import * as vscode from 'vscode';
import { CommandGroup } from '../models/commandGroup';
import { StorageService } from '../services/storageService';

export async function pickGroup(storage: StorageService, excludeGroupId?: string): Promise<CommandGroup | undefined> {
  const groups =
    storage
      .getGroups()
      .filter(
        group =>
          group.id !== excludeGroupId
      );

  const selected =
    await vscode.window.showQuickPick(
      [
        ...groups.map(group => ({
          label: group.name,
          group
        })),

        {
          label: '+ Create New Group'
        }
      ],
      {
        placeHolder: 'Select Group'
      }
    );

  if (!selected) {
    return;
  }

  if (selected.label === '+ Create New Group') {
    const name =
      await vscode.window.showInputBox({
        prompt: 'Group Name'
      });

    if (!name) {
      return;
    }

    const group: CommandGroup = {
      id: Date.now().toString(),
      name: name.trim(),
      updatedAt: new Date().toISOString()
    };

    await storage.addGroup(group);
    return group;
  }


  if ('group' in selected) {
    return selected.group;
  }


  return undefined;
}