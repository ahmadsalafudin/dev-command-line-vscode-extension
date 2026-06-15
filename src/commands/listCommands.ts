import * as vscode from 'vscode';
import { StorageService } from '../services/storageService';

export async function listCommands(
    storage: StorageService
) {

    const Commands =
        storage.getCommands();

    if (!Commands.length) {

        vscode.window.showInformationMessage(
            'No Command found'
        );

        return;
    }

    const groups =
        storage.getGroups();
    await vscode.window.showQuickPick(
        Commands.map(Command => {

            const group =
                groups.find(
                    group =>
                        group.id ===
                        Command.groupId
                );

            return {
                label:
                    Command.name,
                description:
                    `[${group?.name ?? 'Unknown'}]`,
                detail:
                    `${Command.commands.length} command(s)`
            };
        }),
        {
            placeHolder:
                'Available Commands'
        }
    );
}