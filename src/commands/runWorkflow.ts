import * as vscode from 'vscode';
import { StorageService } from '../services/storageService';

export async function runWorkflow(
    storage: StorageService,
    workflowId?: string
) {

    const workflows =
        storage.getWorkflows();


    if (!workflows.length) {

        vscode.window.showWarningMessage(
            'No workflow found'
        );

        return;
    }


    let workflow;


    /**
     * Jika dipanggil dari sidebar
     * langsung gunakan workflow id
     */
    if (workflowId) {

        workflow =
            workflows.find(
                item =>
                    item.id === workflowId
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
                workflows.map(item => {

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

                        workflow:
                            item
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


        workflow =
            selected.workflow;
    }


    if (!workflow) {

        vscode.window.showWarningMessage(
            'Workflow not found'
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
            workflow.commands
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
            'Dev Workflow'
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
        of workflow.commands
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