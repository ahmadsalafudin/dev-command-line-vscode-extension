import * as vscode from 'vscode';
import { StorageService } from '../services/storageService';
import { WorkflowTreeItem } from './workflowTreeItem';

export class WorkflowTreeProvider
  implements vscode.TreeDataProvider<WorkflowTreeItem> {

  constructor(
    private storage:
      StorageService
  ) { }

  getTreeItem(
    element: WorkflowTreeItem
  ): vscode.TreeItem {

    return element;
  }

  getChildren(
    element?: WorkflowTreeItem
  ): Thenable<WorkflowTreeItem[]> {

    if (!element) {

      return Promise.resolve([
        this.getFavoriteRoot(),
        ...this.getGroups()
      ]);

    }

    if (
      element.type ===
      'favorite-root'
    ) {

      return Promise.resolve(
        this.getFavorites()
      );

    }

    if (
      element.type ===
      'group'
    ) {
      return Promise.resolve(
        this.getWorkflows(
          element.idValue!
        )
      );
    }

    return Promise.resolve([]);
  }

  private getGroups():
    WorkflowTreeItem[] {

    return this.storage
      .getGroups()
      .map(group => {

        const item =
          new WorkflowTreeItem(
            group.name,
            vscode.TreeItemCollapsibleState
              .Expanded,
            'group',
            group.id
          );

        item.contextValue =
          'group';

        return item;
      });
  }

  private getWorkflows(
    groupId: string
  ): WorkflowTreeItem[] {

    return this.storage
      .getWorkflowsByGroup(
        groupId
      )
      .map(workflow => {

        const item =
          new WorkflowTreeItem(
            workflow.name,
            vscode.TreeItemCollapsibleState.None,
            'workflow',
            workflow.id
          );

        item.contextValue =
          'workflow';

        item.command = {
          command:
            'devWorkflow.runWorkflowFromTree',

          title:
            'Run Workflow',

          arguments:
            [
              workflow.id
            ]
        };

        return item;
      });
  }

  private getFavoriteRoot():
    WorkflowTreeItem {

    const item =
      new WorkflowTreeItem(
        '⭐ Favorites',
        vscode.TreeItemCollapsibleState.Expanded,
        'favorite-root'
      );


    item.contextValue =
      'favorite-root';


    return item;

  }

  private getFavorites():
    WorkflowTreeItem[] {

    return this.storage
      .getWorkflows()
      .filter(
        workflow =>
          workflow.favorite
      )
      .map(workflow => {

        const item =
          new WorkflowTreeItem(
            `⭐ ${workflow.name}`,
            vscode.TreeItemCollapsibleState.None,
            'workflow',
            workflow.id
          );

        item.command = {
          command:
            'devWorkflow.runWorkflowFromTree',

          title:
            'Run Workflow',

          arguments:
            [
              item
            ]
        };

        item.contextValue =
          'workflow';

        return item;
      });
  }

  private _onDidChangeTreeData =
    new vscode.EventEmitter<void>();

  readonly onDidChangeTreeData =
    this._onDidChangeTreeData.event;

  refresh() {

    this._onDidChangeTreeData.fire();
  }
}