import * as vscode from 'vscode';

import { StorageService } from './services/storageService';

import { addWorkflow } from './commands/addWorkflow';
import { createGroup } from './commands/createGroup';
import { deleteGroup } from './commands/deleteGroup';
import { deleteWorkflow } from './commands/deleteWorkflow';
import { editGroup } from './commands/editGroup';
import { editWorkflow } from './commands/editWorkflow';
import { listWorkflows } from './commands/listWorkflows';
import { runWorkflow } from './commands/runWorkflow';
import { WorkflowTreeProvider } from './views/workflowTreeProvider';
import { addWorkflowToGroup } from './commands/addWorkflowToGroup';
import { WorkflowTreeItem } from './views/workflowTreeItem';

export function activate(
	context: vscode.ExtensionContext
) {

	// console.log(
	// 	'DEV WORKFLOW ACTIVATED'
	// );

	vscode.window.showInformationMessage(
		'DEV WORKFLOW ACTIVATED'
	);

	const storage =
		new StorageService(context);

	const addWorkflowCommand =
		vscode.commands.registerCommand(
			'devWorkflow.addWorkflow',
			() => addWorkflow(storage)
		);

	const runWorkflowCommand =
		vscode.commands.registerCommand(
			'devWorkflow.runWorkflow',
			() => runWorkflow(storage)
		);

	const listWorkflowCommand =
		vscode.commands.registerCommand(
			'devWorkflow.listWorkflows',
			() => listWorkflows(storage)
		);

	const deleteWorkflowCommand =
		vscode.commands.registerCommand(
			'devWorkflow.deleteWorkflow',
			() => deleteWorkflow(storage)
		);

	const editWorkflowCommand =
		vscode.commands.registerCommand(
			'devWorkflow.editWorkflow',
			() => editWorkflow(storage)
		);

	const createGroupCommand =
		vscode.commands.registerCommand(
			'devWorkflow.createGroup',
			() => createGroup(storage)
		);

	const editGroupCommand =
		vscode.commands.registerCommand(
			'devWorkflow.editGroup',
			() => editGroup(storage)
		);

	const deleteGroupCommand =
		vscode.commands.registerCommand(
			'devWorkflow.deleteGroup',
			() => deleteGroup(storage)
		);

	const treeProvider =
		new WorkflowTreeProvider(
			storage
		);

	vscode.window.createTreeView(
		'devWorkflowView',
		{
			treeDataProvider:
				treeProvider
		}
	);

	const runWorkflowFromTree =
		vscode.commands.registerCommand(
			'devWorkflow.runWorkflowFromTree',
			async (
				workflowId: string
			) => {

				const workflow =
					storage
						.getWorkflows()
						.find(
							workflow =>
								workflow.id ===
								workflowId
						);

				if (!workflow) {
					return;
				}
			}
		);

	const refreshCommand =
		vscode.commands.registerCommand(
			'devWorkflow.refresh',
			() => treeProvider.refresh()
		);

		const addWorkflowToGroupCommand =
    vscode.commands.registerCommand(
        'devWorkflow.addWorkflowToGroup',
        async (
            item: WorkflowTreeItem
        ) => {

            await addWorkflowToGroup(
                storage,
                item.idValue!
            );

            treeProvider.refresh();
        }
    );
		
	context.subscriptions.push(
		addWorkflowCommand,
		runWorkflowCommand,
		listWorkflowCommand,
		deleteWorkflowCommand,
		editWorkflowCommand,
		createGroupCommand,
		editGroupCommand,
		deleteGroupCommand,
		runWorkflowFromTree,
		refreshCommand,
		addWorkflowToGroupCommand,
	);
}

export function deactivate() { }