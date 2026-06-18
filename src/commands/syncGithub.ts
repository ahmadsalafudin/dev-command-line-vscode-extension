import * as vscode from 'vscode';

import { GithubFileService } from '../services/githubFileService';
import { GithubService } from '../services/githubService';
import { StorageService } from '../services/storageService';

export async function syncGithub(storage: StorageService, token: string) {
  try {
    const github = new GithubService(token);
    const file = new GithubFileService(github);
    const remote = await file.downloadCommandFile();

    if (remote) {
      await storage.mergeData(
        remote.groups,
        remote.Commands
      );
    }

    await file.uploadCommandFile(
      storage.getBackupData()
    );

    await storage.saveLastSync();
    vscode.window.showInformationMessage(
      'Command synced to GitHub ✓'
    );
  } catch (error) {
    console.error(
      error
    );

    vscode.window.showErrorMessage(
      'GitHub sync failed'
    );
  }
}