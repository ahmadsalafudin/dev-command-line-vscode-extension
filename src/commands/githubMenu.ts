import * as vscode from 'vscode';
import { initialSync } from './initialSync';
import { StorageService } from '../services/storageService';


export async function githubMenu(
  context: vscode.ExtensionContext,
  storage: StorageService
) {
  const session =
    await vscode.authentication
      .getSession(
        'github',
        [
          'repo'
        ],
        {
          createIfNone: false
        }
      );


  const items = [];

  if (!session) {
    items.push({

      label:
        '$(github) Connect GitHub',

      action:
        'connect'
    });
  } else {
    items.push({
      label:
        `$(account) ${session.account.label}`,
      action:
        'account'
    });


    items.push({
      label:
        '$(sync) Sync Data',

      action:
        'sync'
    });

    items.push({
      label:
        '$(sign-out) Disconnect',
      action:
        'disconnect'
    });
  }

  const selected =
    await vscode.window.showQuickPick(
      items,
      {
        placeHolder:
          'GitHub'
      }
    );

  if (!selected) {
    return;
  }

  switch (
  selected.action
  ) {
    case 'connect':
      await vscode.authentication
        .getSession(
          'github',
          [
            'repo'
          ],
          {
            createIfNone: true
          }
        );
      break;

    case 'sync':
      if (session) {
        await initialSync(
          storage,
          session.accessToken
        );
      }
      break;

    case 'disconnect':
      vscode.window.showInformationMessage(
        'Please sign out from GitHub Authentication'
      );

      break;

  }

}