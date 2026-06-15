import * as vscode from 'vscode';

export class CommandTreeItem
  extends vscode.TreeItem {

  constructor(
    label: string,
    collapsibleState:
      vscode.TreeItemCollapsibleState,
    public readonly type:
      'group' | 'Command' | 'favorite-root',
    public readonly idValue?: string
  ) {

    super(
      label,
      collapsibleState
    );
  }
}