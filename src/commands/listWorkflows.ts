import * as vscode from 'vscode';
import { StorageService } from '../services/storageService';

export async function listWorkflows(
    storage: StorageService
) {

    const workflows =
        storage.getWorkflows();

    if (!workflows.length) {

        vscode.window.showInformationMessage(
            'No workflow found'
        );

        return;
    }

    const groups =
        storage.getGroups();
    await vscode.window.showQuickPick(
        workflows.map(workflow => {

            const group =
                groups.find(
                    group =>
                        group.id ===
                        workflow.groupId
                );

            return {
                label:
                    workflow.name,
                description:
                    `[${group?.name ?? 'Unknown'}]`,
                detail:
                    `${workflow.commands.length} command(s)`
            };
        }),
        {
            placeHolder:
                'Available Workflows'
        }
    );
}