import * as vscode from 'vscode';

import { GithubAuth } from '../auth/githubAuth';

import { GithubService } from '../services/githubService';



export async function connectGithub(
  auth: GithubAuth
) {


  const session =
    await auth.login();



  if (!session) {
    return;
  }



  const token =
    session.accessToken;



  const github =
    new GithubService(
      token
    );



  const repoName =
    'dev-command-sync';



  const exists =
    await github.repositoryExists(
      repoName
    );



  if (exists) {

    vscode.window.showInformationMessage(
      'Command repository connected ✓'
    );


    return;

  }



  const create =
    await vscode.window.showInformationMessage(

      'Repository dev-command-sync not found. Create private repository?',

      'Create',

      'Cancel'

    );



  if (create !== 'Create') {
    return;
  }



  await github.createRepository(
    repoName
  );



  vscode.window.showInformationMessage(
    'Private repository created ✓'
  );

}