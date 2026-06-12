import * as vscode from 'vscode';
import { StorageService } from '../services/storageService';

export async function deleteGroup(
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

  const workflows =
    storage.getWorkflowsByGroup(
      selected.group.id
    );

  // Jika group kosong
  if (!workflows.length) {

    await storage.deleteGroup(
      selected.group.id
    );

    vscode.window.showInformationMessage(
      'Group deleted'
    );

    return;
  }

  const action =
    await vscode.window.showQuickPick(
      [
        'Delete workflows',
        'Move workflows',
        'Cancel'
      ],
      {
        placeHolder:
          `Group contains ${workflows.length} workflow(s)`
      }
    );

  if (
    !action ||
    action === 'Cancel'
  ) {
    return;
  }

  // Delete workflows
  if (
    action ===
    'Delete workflows'
  ) {

    await storage.deleteWorkflowsByGroup(
      selected.group.id
    );

    await storage.deleteGroup(
      selected.group.id
    );

    vscode.window.showInformationMessage(
      'Group and workflows deleted'
    );

    return;
  }

  // Move workflows
  const availableGroups =
    groups.filter(
      group =>
        group.id !==
        selected.group.id
    );

  if (!availableGroups.length) {

    vscode.window.showWarningMessage(
      'No destination group available'
    );

    return;
  }

  const targetGroup =
    await vscode.window.showQuickPick(
      availableGroups.map(group => ({
        label: group.name,
        group
      })),
      {
        placeHolder:
          'Select Destination Group'
      }
    );

  if (!targetGroup) {
    return;
  }

  await storage.moveWorkflows(
    selected.group.id,
    targetGroup.group.id
  );

  await storage.deleteGroup(
    selected.group.id
  );

  vscode.window.showInformationMessage(
    `Group deleted and workflows moved to ${targetGroup.group.name}`
  );
}