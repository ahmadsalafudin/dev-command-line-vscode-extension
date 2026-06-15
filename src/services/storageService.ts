import * as vscode from 'vscode';
import { Command } from '../models/command';
import { CommandGroup } from '../models/commandGroup';

export interface CommandBackupData {
    version: number;
    updatedAt: string;
    groups: any[];
    Commands: any[];
}

export class StorageService {
    private readonly COMMAND_KEY = 'commands';
    private readonly GROUP_KEY = 'groups';
    private readonly LAST_SYNC_KEY = 'lastSync';

    constructor(
        private context: vscode.ExtensionContext,
        private onChange?: () => void
    ) { }
    private changed() {
        if (this.onChange) {
            this.onChange();
        }
    }

    getCommands(): Command[] {
        return this.context.globalState.get(
            this.COMMAND_KEY,
            []
        );
    }

    async saveCommands(
        Commands: Command[]
    ): Promise<void> {
        await this.context.globalState.update(
            this.COMMAND_KEY,
            Commands
        );
        this.changed();
    }

    async addCommand(
        Command: Command
    ): Promise<void> {
        const Commands = this.getCommands();
        Commands.push(Command);
        await this.saveCommands(
            Commands
        );
    }

    async deleteCommand(
        id: string
    ): Promise<void> {
        const Commands =
            this.getCommands()
                .filter(
                    Command =>
                        Command.id !== id
                );

        await this.saveCommands(
            Commands
        );
        this.changed();
    }

    async updateCommand(
        updatedCommand: Command
    ): Promise<void> {
        const Commands = this.getCommands();
        const index =
            Commands.findIndex(
                Command =>
                    Command.id ===
                    updatedCommand.id
            );

        if (index === -1) {
            return;
        }

        Commands[index] = updatedCommand;
        await this.saveCommands(
            Commands
        );
        this.changed();
    }

    getGroups(): CommandGroup[] {
        return this.context.globalState.get(
            this.GROUP_KEY,
            []
        );
    }

    async addGroup(
        group: CommandGroup
    ): Promise<void> {
        const groups = this.getGroups();
        groups.push(group);
        await this.saveGroups(
            groups
        );
        this.changed();
    }

    async saveGroups(
        groups: CommandGroup[]
    ): Promise<void> {
        await this.context.globalState.update(
            this.GROUP_KEY,
            groups
        );
        this.changed();
    }

    async updateGroup(
        updatedGroup: CommandGroup
    ): Promise<void> {
        const groups = this.getGroups();
        const index =
            groups.findIndex(
                group =>
                    group.id ===
                    updatedGroup.id
            );

        if (index === -1) {
            return;
        }

        groups[index] =
            updatedGroup;

        await this.saveGroups(
            groups
        );
        this.changed();
    }

    async deleteGroup(
        groupId: string
    ) {
        const groups =
            this.getGroups()
                .filter(
                    group =>
                        group.id !== groupId
                );

        await this.saveGroups(
            groups
        );
        this.changed();
    }

    getCommandsByGroup(
        groupId: string
    ) {
        return this.getCommands()
            .filter(
                Command =>
                    Command.groupId === groupId
            );
    }

    async deleteCommandsByGroup(
        groupId: string
    ): Promise<void> {
        const Commands = this.getCommands()
            .filter(
                Command =>
                    Command.groupId !== groupId
            );

        await this.saveCommands(
            Commands
        );
        this.changed();
    }

    async moveCommands(
        fromGroupId: string,
        toGroupId: string
    ): Promise<void> {

        const commands = this.getCommands();
        commands.forEach(
            command => {
                if (
                    command.groupId === fromGroupId
                ) {
                    command.groupId = toGroupId;
                }
            }
        );

        await this.saveCommands(
            commands
        );

        this.changed();
    }

    async toggleFavorite(
        CommandId: string
    ) {
        const Commands = this.getCommands();
        const Command =
            Commands.find(
                item =>
                    item.id === CommandId
            );

        if (!Command) {
            return;
        }

        Command.favorite =
            !Command.favorite;

        await this.saveCommands(
            Commands
        );
        this.changed();
    }

    async exportData() {
        return {
            version: 1,
            exportedAt:
                new Date()
                    .toISOString(),
            groups:
                this.getGroups(),
            Commands:
                this.getCommands()
        };
    }

    async importData(
        data: any
    ): Promise<void> {
        if (!data.groups || !data.Commands) {
            throw new Error(
                'Invalid Command JSON format'
            );
        }

        await this.saveGroups(
            data.groups
        );

        await this.saveCommands(
            data.Commands
        );
    }

    async moveCommand(
        CommandId: string,
        groupId: string
    ): Promise<void> {
        const Commands = this.getCommands();
        const Command =
            Commands.find(
                item =>
                    item.id === CommandId
            );


        if (!Command) {
            return;
        }

        Command.groupId =
            groupId;

        await this.saveCommands(
            Commands
        );
    }

    async replaceData(
        groups: CommandGroup[],
        Commands: Command[]
    ): Promise<void> {
        await this.saveGroups(
            groups
        );

        await this.saveCommands(
            Commands
        );
    }

    async mergeData(
        groups: CommandGroup[],
        Commands: Command[]
    ): Promise<void> {
        const currentGroups = this.getGroups();
        const currentCommands = this.getCommands();

        const newGroups =
            [
                ...currentGroups
            ];
        for (const group of groups) {
            const exists =
                currentGroups.some(
                    item =>
                        item.id === group.id
                );

            if (!exists) {
                newGroups.push(
                    group
                );
            }
        }

        const newCommands =
            [
                ...currentCommands
            ];

        for (
            const Command
            of Commands
        ) {
            const exists =
                currentCommands.some(
                    item =>
                        item.id === Command.id
                );

            if (!exists) {
                newCommands.push(
                    Command
                );
            }
        }

        await this.saveGroups(
            newGroups
        );

        await this.saveCommands(
            newCommands
        );
    }

    getBackupData()
        : CommandBackupData {
        return {
            version: 1,
            updatedAt:
                new Date()
                    .toISOString(),
            groups:
                this.getGroups(),
            Commands:
                this.getCommands()
        };
    }

    getLastSync():
        string | undefined {
        return this.context.globalState.get(
            this.LAST_SYNC_KEY
        );
    }

    async saveLastSync(): Promise<void> {
        await this.context.globalState.update(
            this.LAST_SYNC_KEY,
            new Date().toISOString()
        );
    }
}