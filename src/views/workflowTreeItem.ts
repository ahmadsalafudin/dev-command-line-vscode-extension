import * as vscode from 'vscode';

export class WorkflowTreeItem
  extends vscode.TreeItem {

  constructor(
    label: string,
    collapsibleState:
      vscode.TreeItemCollapsibleState,
    public readonly type:
      'group' | 'workflow',
    public readonly idValue?: string
  ) {

    super(
      label,
      collapsibleState
    );
  }
}