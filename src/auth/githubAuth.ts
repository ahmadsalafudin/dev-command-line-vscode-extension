import * as vscode from 'vscode';

export class GithubAuth {

  constructor(
    private context: vscode.ExtensionContext
  ) { }


  async login() {

    const session =
      await vscode.authentication.getSession(
        'github',
        [
          'repo'
        ],
        {
          createIfNone: true
        }
      );


    if (!session) {

      vscode.window.showErrorMessage(
        'GitHub authentication failed'
      );

      return undefined;
    }


    await this.context.secrets.store(
      'github.username',
      session.account.label
    );


    return session;
  }


  async getSession() {

    return await vscode.authentication.getSession(
      'github',
      [
        'repo'
      ],
      {
        createIfNone: false
      }
    );

  }


  async logout() {

    await this.context.secrets.delete(
      'github.username'
    );

  }

  async getToken() {

    const session =
      await this.getSession();


    if (!session) {
      return undefined;
    }


    return session.accessToken;
  }

}