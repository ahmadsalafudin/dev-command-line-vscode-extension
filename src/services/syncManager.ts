import * as vscode from 'vscode';

import { GithubFileService } from './githubFileService';
import { GithubService } from './githubService';
import { GithubStateService } from './githubStateService';
import { StorageService } from './storageService';

export class SyncManager {

  private timer: NodeJS.Timeout | undefined;
  private githubState: GithubStateService;

  constructor(
    private storage: StorageService,
    private context: vscode.ExtensionContext,
    private onStatusChange?: (
      status: string
    ) => void
  ) {

    this.githubState =
      new GithubStateService(
        context
      );
  }

  triggerSync() {
    if (this.timer) {
      clearTimeout(
        this.timer
      );
    }

    this.timer =
      setTimeout(
        async () => {
          await this.sync();
        },
        3000
      );
  }

  private async sync() {
    if (!this.githubState.isConnected()) {
      console.log('Auto sync skipped: GitHub disconnected');
      return;
    }

    this.onStatusChange?.(
      'syncing'
    );

    try {
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

      if (!session) {
        this.onStatusChange?.(
          'error'
        );

        return;
      }

      const github = new GithubService(session.accessToken);
      const file = new GithubFileService(github);

      await file.uploadCommandFile(
        this.storage.getBackupData()
      );

      await this.storage.saveLastSync();
      this.onStatusChange?.('success');

    } catch (error) {
      this.onStatusChange?.(
        'error'
      );

      console.error(error);
    }
  }
}