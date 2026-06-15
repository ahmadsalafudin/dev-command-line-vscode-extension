import * as vscode from 'vscode';
import { StorageService } from '../services/storageService';
import { initialSync } from './initialSync';


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

    const lastSync =
      storage.getLastSync();

    if (lastSync) {
      items.push({
        label:
          `$(clock) Last Sync: ${formatDate(lastSync)}`,
        action:
          'lastSync'
      });
    }

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

  function formatDate(
    date: string
  ) {

    return new Date(date)
      .toLocaleString(
        'id-ID',
        {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }
      );

  }
}