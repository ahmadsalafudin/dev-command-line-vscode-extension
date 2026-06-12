import * as vscode from 'vscode';
import { StorageService } from '../services/storageService';
import { pickGroup } from '../utils/groupPicker';

export async function addWorkflow(
  storage: StorageService
) {

  const name =
    await vscode.window.showInputBox({
      prompt: 'Workflow Name'
    });

  if (!name) {
    return;
  }

  const group =
    await pickGroup(
      storage
    );

  if (!group) {
    return;
  }

  const commands: string[] = [];

  let addMore = true;

  while (addMore) {

    const command =
      await vscode.window.showInputBox({
        prompt: 'Command'
      });

    if (!command) {
      break;
    }

    commands.push(command);

    const answer =
      await vscode.window.showQuickPick(
        ['Yes', 'No'],
        {
          placeHolder:
            'Add another command?'
        }
      );

    addMore =
      answer === 'Yes';
  }

  await storage.addWorkflow({
    id: Date.now().toString(),
    name,
    groupId:
      group.id,
    commands
  });

  vscode.window.showInformationMessage(
    'Workflow saved'
  );
}