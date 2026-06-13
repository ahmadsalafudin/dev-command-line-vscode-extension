import * as vscode from 'vscode';
import { StorageService } from '../services/storageService';

export async function editWorkflow(
  storage: StorageService,
  treeProvider: any,
  workflowId: string
) {

  const workflow =
    storage.getWorkflows()
      .find(
        workflow =>
          workflow.id === workflowId
      );


  if (!workflow) {
    return;
  }


  const newName =
    await vscode.window.showInputBox({
      prompt: 'Workflow Name',
      value: workflow.name
    });


  if (!newName) {
    return;
  }


  const commands: string[] = [];


  for (
    const command
    of workflow.commands
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


    commands.push(
      edited
    );
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
        prompt:
          'New Command'
      });


    if (command) {

      commands.push(
        command
      );
    }
  }


  await storage.updateWorkflow({
    ...workflow,
    name:
      newName,
    commands
  });


  vscode.window.showInformationMessage(
    'Workflow updated'
  );


  treeProvider.refresh();
}