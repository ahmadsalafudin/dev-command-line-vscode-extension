import * as vscode from 'vscode';
import { Workflow } from '../models/workflow';
import { WorkflowGroup } from '../models/workflowGroup';

export class StorageService {

    private readonly WORKFLOW_KEY = 'workflows';
    private readonly GROUP_KEY = 'groups';

    constructor(
        private context: vscode.ExtensionContext
    ) { }

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
    }

    async addWorkflow(
        workflow: Workflow
    ): Promise<void> {

        const workflows =
            this.getWorkflows();

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
    }

    async updateWorkflow(
        updatedWorkflow: Workflow
    ): Promise<void> {

        const workflows =
            this.getWorkflows();

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

        const groups =
            this.getGroups();

        groups.push(group);

        await this.saveGroups(
            groups
        );
    }

    async saveGroups(
        groups: WorkflowGroup[]
    ): Promise<void> {

        await this.context.globalState.update(
            this.GROUP_KEY,
            groups
        );
    }

    async updateGroup(
        updatedGroup: WorkflowGroup
    ): Promise<void> {

        const groups =
            this.getGroups();

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


        await this.context
            .globalState
            .update(
                'groups',
                groups
            );
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

        const workflows =
            this.getWorkflows()
                .filter(
                    workflow =>
                        workflow.groupId !== groupId
                );

        await this.saveWorkflows(
            workflows
        );
    }

    async moveWorkflows(
        fromGroupId: string,
        toGroupId: string
    ): Promise<void> {

        const workflows =
            this.getWorkflows();

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
    }

    async toggleFavorite(
        workflowId: string
    ) {

        const workflows =
            this.getWorkflows();

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
    }
}