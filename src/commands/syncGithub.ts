import * as vscode from 'vscode';

import { GithubFileService } from '../services/githubFileService';
import { GithubService } from '../services/githubService';
import { StorageService } from '../services/storageService';

export async function syncGithub(
  storage: StorageService,
  token: string
) {


  const github =
    new GithubService(
      token
    );

  const file =
    new GithubFileService(
      github
    );

  await file.uploadWorkflowFile(
    storage.getBackupData()
  );

  vscode.window.showInformationMessage(
    'Workflow synced to GitHub ✓'
  );
}
