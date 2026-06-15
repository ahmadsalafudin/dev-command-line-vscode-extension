import * as vscode from 'vscode';
import { StorageService } from '../services/storageService';

export async function runCommand(
    storage: StorageService,
    CommandId?: string
) {

    const Commands =
        storage.getCommands();


    if (!Commands.length) {

        vscode.window.showWarningMessage(
            'No Command found'
        );

        return;
    }


    let Command;


    /**
     * Jika dipanggil dari sidebar
     * langsung gunakan Command id
     */
    if (CommandId) {

        Command =
            Commands.find(
                item =>
                    item.id === CommandId
            );

    }
    /**
     * Jika dipanggil dari command palette
     * tampilkan picker
     */
    else {

        const groups =
            storage.getGroups();


        const selected =
            await vscode.window.showQuickPick(
                Commands.map(item => {

                    const group =
                        groups.find(
                            group =>
                                group.id ===
                                item.groupId
                        );


                    return {
                        label:
                            item.name,

                        description:
                            group?.name,

                        Command:
                            item
                    };

                }),
                {
                    placeHolder:
                        'Select Command'
                }
            );


        if (!selected) {
            return;
        }


        Command =
            selected.Command;
    }


    if (!Command) {

        vscode.window.showWarningMessage(
            'Command not found'
        );

        return;
    }



    /**
     * Ambil parameter dari command
     *
     * Contoh:
     * git checkout {branch}
     *
     * hasil:
     * ['branch']
     */
    const parameters =
        extractParameters(
            Command.commands
        );


    const values:
        Record<string, string> = {};



    /**
     * Input value parameter
     */
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
            'Dev Command'
        );


    terminal.show();



    /**
     * Replace parameter
     *
     * {branch}
     * menjadi
     * develop
     */
    for (
        const originalCommand
        of Command.commands
    ) {

        let command =
            originalCommand;


        for (
            const [
                key,
                value
            ]
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
            (
                match =
                regex.exec(command)
            ) !== null
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