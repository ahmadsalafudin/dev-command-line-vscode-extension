import * as vscode from 'vscode';
import { StorageService } from '../services/storageService';
import { pickGroup } from '../utils/groupPicker';

export async function editWorkflow(
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

  const selected =
    await vscode.window.showQuickPick(
      workflows.map(workflow => ({
        label: workflow.name,
        workflow
      })),
      {
        placeHolder:
          'Select Workflow'
      }
    );

  if (!selected) {
    return;
  }

  const workflow =
    selected.workflow;

  const newName =
    await vscode.window.showInputBox({
      prompt: 'Workflow Name',
      value: workflow.name
    });

  if (!newName) {
    return;
  }

  const newGroup =
    await pickGroup(
      storage
    );

  if (!newGroup) {
    return;
  }

  const commands: string[] = [];

  for (
    const command
    of workflow.commands
  ) {

    const editedCommand =
      await vscode.window.showInputBox({
        prompt: 'Edit Command',
        value: command
      });

    if (editedCommand === undefined) {
      return;
    }

    if (editedCommand.trim() !== '') {

      commands.push(
        editedCommand
      );
    }
  }

  let addMore = true;

  while (addMore) {

    const answer =
      await vscode.window.showQuickPick(
        [
          'Yes',
          'No'
        ],
        {
          placeHolder:
            'Add new command?'
        }
      );

    addMore =
      answer === 'Yes';

    if (!addMore) {
      break;
    }

    const command =
      await vscode.window.showInputBox({
        prompt: 'New Command'
      });

    if (!command) {
      continue;
    }

    commands.push(
      command
    );
  }

  if (commands.length === 0) {

    vscode.window.showWarningMessage(
      'Workflow must contain at least one command'
    );

    return;
  }

  await storage.updateWorkflow({
    ...workflow,
    name: newName,
    groupId: newGroup.id,
    commands
  });

  vscode.window.showInformationMessage(
    'Workflow updated'
  );
}