import * as vscode from 'vscode';
import { WorkflowGroup } from '../models/workflowGroup';
import { StorageService } from '../services/storageService';

export async function pickGroup(
  storage: StorageService
): Promise<WorkflowGroup | undefined> {

  const groups =
    storage.getGroups();

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
        placeHolder:
          'Select Group'
      }
    );

  if (!selected) {
    return;
  }

  if (
    selected.label ===
    '+ Create New Group'
  ) {

    const name =
      await vscode.window.showInputBox({
        prompt:
          'Group Name'
      });

    if (!name) {
      return;
    }

    const group: WorkflowGroup = {
      id: Date.now().toString(),
      name
    };

    await storage.addGroup(
      group
    );

    return group;
  }

  if ('group' in selected) {
    return selected.group;
  }

  return undefined;
}