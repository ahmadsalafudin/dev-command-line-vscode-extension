import * as vscode from 'vscode';
import { StorageService } from '../services/storageService';
import { CommandTreeProvider } from '../views/commandTreeProvider';
import { pickGroup } from '../utils/groupPicker';

export async function deleteGroup(
    storage: StorageService,
    treeProvider: CommandTreeProvider,
    groupId: string
) {
    const group =
        storage
            .getGroups()
            .find(
                item =>
                    item.id === groupId
            );

    if (!group) {
        return;
    }

    const Commands =
        storage.getCommandsByGroup(
            groupId
        );

    const confirm =
        await vscode.window.showWarningMessage(
            `Delete group "${group.name}"?`,
            {
                modal: true
            },
            'Delete'
        );

    if (confirm !== 'Delete') {
        return;
    }


    if (Commands.length) {
        const action =
            await vscode.window.showQuickPick(
                [
                    'Delete Commands',
                    'Move Commands',
                    'Cancel'
                ],
                {
                    placeHolder: `Group contains ${Commands.length} Commands`
                }
            );


        if (!action || action === 'Cancel') {
            return;
        }

        if (action === 'Delete Commands') {
            await storage.deleteCommandsByGroup(
                groupId
            );
        }

        if (action === 'Move Commands') {
            const target =
                await pickGroup(
                    storage,
                    groupId
                );

            if (!target) {
                return;
            }

            await storage.moveCommands(
                groupId,
                target.id
            );
        }
    }

    await storage.deleteGroup(
        groupId
    );


    treeProvider.refresh();

    vscode.window.showInformationMessage(
        'Group deleted'
    );
}