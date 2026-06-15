import * as vscode from 'vscode';
import { StorageService } from '../services/storageService';

export async function createGroup(
    storage: StorageService
) {
    const name =
        await vscode.window.showInputBox({
            prompt: 'Group Name'
        });

    if (!name) {
        return;
    }

    const cleanName = name.trim();
    const exists =
        storage.getGroups()
            .some(
                group =>
                    group.name
                        .toLowerCase() ===
                    cleanName.toLowerCase()
            );

    if (exists) {
        vscode.window.showWarningMessage(
            'Group name already exists'
        );

        return;
    }


    await storage.addGroup({
        id:
            Date.now()
                .toString(),
        name:
            cleanName
    });

    vscode.window.showInformationMessage(
        'Group created'
    );
}