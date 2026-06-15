import * as vscode from 'vscode';
import { StorageService } from '../services/storageService';
import { CommandTreeItem } from './commandTreeItem';

export class CommandTreeProvider
  implements
  vscode.TreeDataProvider<CommandTreeItem>,
  vscode.TreeDragAndDropController<CommandTreeItem> {

  readonly dragMimeTypes = [
    'application/vnd.code.tree.devCommandView'
  ];

  readonly dropMimeTypes = [
    'application/vnd.code.tree.devCommandView'
  ];

  handleDrag(
    source: readonly CommandTreeItem[],
    dataTransfer: vscode.DataTransfer
  ) {

    dataTransfer.set(
      'application/vnd.code.tree.devCommandView',
      new vscode.DataTransferItem(
        source[0]
      )
    );

  }

  async handleDrop(
    target: CommandTreeItem | undefined,
    dataTransfer: vscode.DataTransfer
  ) {
    if (!target) {
      return;
    }

    if (target.type !== 'group') {
      return;
    }

    const item =
      dataTransfer.get(
        'application/vnd.code.tree.devCommandView'
      );

    if (!item) {
      return;
    }

    const source =
      item.value as CommandTreeItem;

    if (
      source.type !== 'Command'
    ) {
      return;
    }

    await this.storage.moveCommand(
      source.idValue!,
      target.idValue!
    );

    this.refresh();

    vscode.window.showInformationMessage(
      'Command moved'
    );
  }

  constructor(
    private storage:
      StorageService
  ) { }

  getTreeItem(
    element: CommandTreeItem
  ): vscode.TreeItem {

    return element;
  }

  getChildren(
    element?: CommandTreeItem
  ): Thenable<CommandTreeItem[]> {

    if (!element) {
      return Promise.resolve([
        this.getFavoriteRoot(),
        ...this.getGroups()
      ]);
    }

    if (element.type === 'favorite-root') {
      return Promise.resolve(
        this.getFavorites()
      );
    }

    if (element.type === 'group') {
      return Promise.resolve(
        this.getCommands(
          element.idValue!
        )
      );
    }

    return Promise.resolve([]);
  }

  private getGroups():
    CommandTreeItem[] {

    return this.storage
      .getGroups()
      .map(group => {

        const item =
          new CommandTreeItem(
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

  private getCommands(
    groupId: string
  ): CommandTreeItem[] {

    return this.storage
      .getCommandsByGroup(
        groupId
      )
      .map(Command => {

        const item =
          new CommandTreeItem(
            Command.name,
            vscode.TreeItemCollapsibleState.None,
            'Command',
            Command.id
          );

        item.contextValue =
          'Command';

        item.command = {
          command:
            'devCommand.runCommandFromTree',

          title:
            'Run Command',

          arguments:
            [
              Command.id
            ]
        };

        return item;
      });
  }

  private getFavoriteRoot():
    CommandTreeItem {
    const item =
      new CommandTreeItem(
        '⭐ Favorites',
        vscode.TreeItemCollapsibleState.Expanded,
        'favorite-root'
      );

    item.contextValue =
      'favorite-root';

    return item;
  }

  private getFavorites():
    CommandTreeItem[] {

    return this.storage
      .getCommands()
      .filter(
        Command =>
          Command.favorite
      )
      .map(Command => {

        const item =
          new CommandTreeItem(
            `⭐ ${Command.name}`,
            vscode.TreeItemCollapsibleState.None,
            'Command',
            Command.id
          );

        item.command = {
          command:
            'devCommand.runCommandFromTree',

          title:
            'Run Command',

          arguments:
            [
              item
            ]
        };

        item.contextValue =
          'Command';

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