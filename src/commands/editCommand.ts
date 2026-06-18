import * as vscode from 'vscode';
import { StorageService } from '../services/storageService';

export async function editCommand(
  storage: StorageService,
  treeProvider: any,
  CommandId: string
) {

  const Command =
    storage.getCommands()
      .find(
        Command =>
          Command.id === CommandId
      );


  if (!Command) {
    return;
  }


  const newName =
    await vscode.window.showInputBox({
      prompt: 'Command Name',
      value: Command.name
    });


  if (!newName) {
    return;
  }

  const exists =
    storage.getCommands()
      .some(
        item =>
          item.id !== Command.id &&
          item.name
            .trim()
            .toLowerCase() ===
          newName
            .trim()
            .toLowerCase()
      );


  if (exists) {
    vscode.window.showWarningMessage(
      'Command name already exists'
    );

    return;
  }


  if (exists) {
    vscode.window.showWarningMessage(
      'Group name already exists'
    );
    return;
  }

  const commands: string[] = [];

  for (
    const command
    of Command.commands
  ) {

    const edited =
      await vscode.window.showInputBox({
        prompt:
          'Edit Command',
        value:
          command
      });

    if (edited === undefined) {
      return;
    }

    commands.push(edited);
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

    addMore = answer === 'Yes';

    if (!addMore) {
      break;
    }

    const command =
      await vscode.window.showInputBox({
        prompt:
          'New Command'
      });

    if (command) {
      commands.push(
        command
      );
    }
  }

  await storage.updateCommand({
    ...Command,
    name: newName,
    commands,
    updatedAt: new Date().toISOString()
  });

  vscode.window.showInformationMessage(
    'Command updated'
  );

  treeProvider.refresh();
}