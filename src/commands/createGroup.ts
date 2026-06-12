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

    await storage.addGroup({
        id: Date.now().toString(),
        name
    });

    vscode.window.showInformationMessage(
        'Group created'
    );
}