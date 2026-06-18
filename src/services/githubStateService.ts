import * as vscode from 'vscode';

export class GithubStateService {

  private KEY = 'githubConnected';

  constructor(
    private context: vscode.ExtensionContext
  ) { }

  async connect() {
    await this.context.globalState.update(
      this.KEY,
      true
    );
  }

  async disconnect() {
    await this.context.globalState.update(
      this.KEY,
      false
    );
  }

  isConnected() {
    return this.context.globalState.get<boolean>(
      this.KEY,
      false
    );
  }
}