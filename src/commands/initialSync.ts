import * as vscode from 'vscode';
import { GithubFileService } from '../services/githubFileService';
import { GithubService } from '../services/githubService';
import { StorageService } from '../services/storageService';

export async function initialSync(
  storage: StorageService,
  token: string
) {
  try {
    const github =
      new GithubService(
        token
      );

    const file =
      new GithubFileService(
        github
      );

    await file.uploadCommandFile(
      storage.getBackupData()
    );

    vscode.window.showInformationMessage(
      'Initial sync completed ✓'
    );
  }  catch (error) {
    console.error(
        'Initial sync error:',
        error
    );

    vscode.window.showErrorMessage(
        `Initial sync failed: ${error}`
    );
}
}