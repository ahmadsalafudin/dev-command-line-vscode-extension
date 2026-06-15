import * as vscode from 'vscode';
import { Workflow } from '../models/workflow';
import { WorkflowGroup } from '../models/workflowGroup';

export interface WorkflowBackupData {

    version: number;

    updatedAt: string;

    groups: any[];

    workflows: any[];
}

export class StorageService {
    private readonly WORKFLOW_KEY = 'workflows';
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

    getWorkflows(): Workflow[] {
        return this.context.globalState.get(
            this.WORKFLOW_KEY,
            []
        );
    }

    async saveWorkflows(
        workflows: Workflow[]
    ): Promise<void> {
        await this.context.globalState.update(
            this.WORKFLOW_KEY,
            workflows
        );
        this.changed();
    }

    async addWorkflow(
        workflow: Workflow
    ): Promise<void> {
        const workflows = this.getWorkflows();
        workflows.push(workflow);
        await this.saveWorkflows(
            workflows
        );
    }

    async deleteWorkflow(
        id: string
    ): Promise<void> {
        const workflows =
            this.getWorkflows()
                .filter(
                    workflow =>
                        workflow.id !== id
                );

        await this.saveWorkflows(
            workflows
        );
        this.changed();
    }

    async updateWorkflow(
        updatedWorkflow: Workflow
    ): Promise<void> {
        const workflows = this.getWorkflows();
        const index =
            workflows.findIndex(
                workflow =>
                    workflow.id ===
                    updatedWorkflow.id
            );

        if (index === -1) {
            return;
        }

        workflows[index] =
            updatedWorkflow;

        await this.saveWorkflows(
            workflows
        );
        this.changed();
    }

    getGroups(): WorkflowGroup[] {
        return this.context.globalState.get(
            this.GROUP_KEY,
            []
        );
    }

    async addGroup(
        group: WorkflowGroup
    ): Promise<void> {
        const groups = this.getGroups();
        groups.push(group);
        await this.saveGroups(
            groups
        );
        this.changed();
    }

    async saveGroups(
        groups: WorkflowGroup[]
    ): Promise<void> {
        await this.context.globalState.update(
            this.GROUP_KEY,
            groups
        );
        this.changed();
    }

    async updateGroup(
        updatedGroup: WorkflowGroup
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

    getWorkflowsByGroup(
        groupId: string
    ) {
        return this.getWorkflows()
            .filter(
                workflow =>
                    workflow.groupId === groupId
            );
    }

    async deleteWorkflowsByGroup(
        groupId: string
    ): Promise<void> {
        const workflows = this.getWorkflows()
            .filter(
                workflow =>
                    workflow.groupId !== groupId
            );

        await this.saveWorkflows(
            workflows
        );
        this.changed();
    }

    async moveWorkflows(
        fromGroupId: string,
        toGroupId: string
    ): Promise<void> {
        const workflows = this.getWorkflows();
        workflows.forEach(
            workflow => {
                if (
                    workflow.groupId ===
                    fromGroupId
                ) {
                    workflow.groupId =
                        toGroupId;
                }
            }
        );

        await this.saveWorkflows(
            workflows
        );
        this.changed();
    }

    async toggleFavorite(
        workflowId: string
    ) {
        const workflows = this.getWorkflows();
        const workflow =
            workflows.find(
                item =>
                    item.id === workflowId
            );

        if (!workflow) {
            return;
        }

        workflow.favorite =
            !workflow.favorite;

        await this.saveWorkflows(
            workflows
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
            workflows:
                this.getWorkflows()
        };
    }

    async importData(
        data: any
    ): Promise<void> {
        if (!data.groups || !data.workflows) {
            throw new Error(
                'Invalid workflow JSON format'
            );
        }

        await this.saveGroups(
            data.groups
        );

        await this.saveWorkflows(
            data.workflows
        );
    }

    async moveWorkflow(
        workflowId: string,
        groupId: string
    ): Promise<void> {
        const workflows = this.getWorkflows();
        const workflow =
            workflows.find(
                item =>
                    item.id === workflowId
            );


        if (!workflow) {
            return;
        }

        workflow.groupId =
            groupId;

        await this.saveWorkflows(
            workflows
        );
    }

    async replaceData(
        groups: WorkflowGroup[],
        workflows: Workflow[]
    ): Promise<void> {
        await this.saveGroups(
            groups
        );

        await this.saveWorkflows(
            workflows
        );
    }

    async mergeData(
        groups: WorkflowGroup[],
        workflows: Workflow[]
    ): Promise<void> {
        const currentGroups = this.getGroups();
        const currentWorkflows = this.getWorkflows();

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

        const newWorkflows =
            [
                ...currentWorkflows
            ];

        for (
            const workflow
            of workflows
        ) {
            const exists =
                currentWorkflows.some(
                    item =>
                        item.id === workflow.id
                );

            if (!exists) {
                newWorkflows.push(
                    workflow
                );
            }
        }

        await this.saveGroups(
            newGroups
        );

        await this.saveWorkflows(
            newWorkflows
        );
    }

    getBackupData()
        : WorkflowBackupData {
        return {
            version: 1,
            updatedAt:
                new Date()
                    .toISOString(),
            groups:
                this.getGroups(),
            workflows:
                this.getWorkflows()
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