import * as vscode from 'vscode';
import { StorageService } from '../services/storageService';

export async function runWorkflow(
    storage: StorageService
) {

    const workflows =
        storage.getWorkflows();

    if (!workflows.length) {

        vscode.window.showWarningMessage(
            'No workflow found'
        );

        return;
    }

    const groups =
        storage.getGroups();

    const selected =
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
                        group?.name,
                    workflow
                };
            }),
            {
                placeHolder:
                    'Select Workflow'
            }
        );

    if (!selected) {
        return;
    }

    const workflow =
        selected.workflow;

    // Ambil semua parameter dari command
    const parameters =
        extractParameters(
            workflow.commands
        );

    const values:
        Record<string, string> = {};

    // Minta value untuk setiap parameter
    for (
        const parameter
        of parameters
    ) {

        const value =
            await vscode.window.showInputBox({
                prompt:
                    `Value for ${parameter}`
            });

        if (
            value === undefined
        ) {
            return;
        }

        values[parameter] =
            value;
    }

    const terminal =
        vscode.window.createTerminal(
            'Dev Workflow'
        );

    terminal.show();

    for (
        const originalCommand
        of workflow.commands
    ) {

        let command =
            originalCommand;

        for (
            const [key, value]
            of Object.entries(values)
        ) {

            command =
                command.replaceAll(
                    `{${key}}`,
                    value
                );
        }

        terminal.sendText(
            command
        );
    }
}

function extractParameters(
    commands: string[]
): string[] {

    const parameters =
        new Set<string>();

    const regex =
        /{([^}]+)}/g;

    for (
        const command
        of commands
    ) {

        let match;

        while (
            (match =
                regex.exec(command))
            !== null
        ) {

            parameters.add(
                match[1]
            );
        }
    }

    return [
        ...parameters
    ];
}