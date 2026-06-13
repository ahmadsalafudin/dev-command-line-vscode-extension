import * as vscode from 'vscode';
import { StorageService } from '../services/storageService';
import { WorkflowTreeProvider } from '../views/workflowTreeProvider';

export async function deleteGroup(
    storage: StorageService,
    treeProvider: WorkflowTreeProvider,
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


    const workflows =
        storage.getWorkflowsByGroup(
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


    if (workflows.length) {

        const action =
            await vscode.window.showQuickPick(
                [
                    'Delete workflows',
                    'Move workflows',
                    'Cancel'
                ],
                {
                    placeHolder:
                        `Group contains ${workflows.length} workflows`
                }
            );


        if (!action ||
            action === 'Cancel'
        ) {
            return;
        }


        if (
            action ===
            'Delete workflows'
        ) {

            await storage.deleteWorkflowsByGroup(
                groupId
            );

        }


        if (
            action ===
            'Move workflows'
        ) {

            vscode.window.showWarningMessage(
                'Move workflow not implemented'
            );

            return;
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