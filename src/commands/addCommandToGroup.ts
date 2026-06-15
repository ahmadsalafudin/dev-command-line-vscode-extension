import * as vscode from 'vscode';
import { StorageService } from '../services/storageService';

export async function addCommandToGroup(
  storage: StorageService,
  groupId: string
) {

  const name =
    await vscode.window.showInputBox({
      prompt: 'Command Name'
    });

  if (!name) {
    return;
  }

  const cleanName =
    name.trim();


  const exists =
    storage.getCommands()
      .some(
        Command =>
          Command.name
            .trim()
            .toLowerCase() ===
          cleanName
            .trim()
            .toLowerCase()
      );


  if (exists) {

    vscode.window.showWarningMessage(
      'Command name already exists'
    );

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

  await storage.addCommand({
    id: Date.now().toString(),
    name: cleanName,
    groupId,
    commands
  });
}