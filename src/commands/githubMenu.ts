import * as vscode from 'vscode';
import { GithubStateService } from '../services/githubStateService';
import { StorageService } from '../services/storageService';

export async function githubMenu(context: vscode.ExtensionContext, storage: StorageService) {
  const githubState =
    new GithubStateService(
      context
    );

  const session =
    await vscode.authentication
      .getSession(
        'github',
        ['repo'],
        {
          createIfNone: false
        }
      );

  const items:
    {
      label: string;
      action: string;
    }[] = [];

  if (!session || !githubState.isConnected()) {
    items.push({
      label: '$(github) Connect GitHub',
      action: 'connect'
    });
  } else {
    items.push({
      label: `$(account) ${session.account.label}`,
      action: 'account'
    });

    items.push({
      label:
        '$(sync) Auto Sync : ON',
      action: 'none'
    });

    const lastSync = storage.getLastSync();
    if (lastSync) {
      items.push({
        label: `$(clock) Last Sync: ${formatDate(lastSync)}`,
        action: 'lastSync'
      });
    }

    items.push({
      label: '$(sign-out) Disconnect',
      action: 'disconnect'
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

  switch (selected.action) {
    case 'connect':
      const newSession =
        await vscode.authentication
          .getSession(
            'github',
            ['repo'],
            {
              createIfNone: true
            }
          );

      if (newSession) {
        await githubState.connect();
        vscode.window.showInformationMessage(
          'GitHub connected ✓ Auto Sync enabled'
        );
      }

      refreshGithubMenu();
      break;

    case 'toggleSync':
      const currentSession =
        await vscode.authentication
          .getSession(
            'github',
            ['repo'],
            {
              createIfNone: false
            }
          );

      if (!currentSession) {
        vscode.window.showErrorMessage(
          'GitHub session not found'
        );

        break;
      }

    case 'disconnect':
      await disconnectGithub(
        storage
      );

      refreshGithubMenu();
      break;
  }

  async function disconnectGithub(storage: StorageService) {
    const confirm =
      await vscode.window.showWarningMessage(
        'Disconnect GitHub and disable Auto Sync?',
        {
          modal: true
        },
        'Disconnect'
      );

    if (confirm !== 'Disconnect') {
      return;
    }

    await githubState.disconnect();
    await storage.clearLastSync();

    vscode.window.showInformationMessage(
      'GitHub disconnected. Auto Sync disabled'
    );
  }

  function refreshGithubMenu() {
    vscode.commands.executeCommand(
      'setContext',
      'devCommand.github.refresh',
      Date.now()
    );
  }

  function formatDate(date: string) {
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