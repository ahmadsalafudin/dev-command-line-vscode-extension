import * as vscode from 'vscode';

import { StorageService } from './services/storageService';

import { addWorkflow } from './commands/addWorkflow';
import { addWorkflowToGroup } from './commands/addWorkflowToGroup';
import { createGroup } from './commands/createGroup';
import { deleteGroup } from './commands/deleteGroup';
import { deleteWorkflow } from './commands/deleteWorkflow';
import { editGroup } from './commands/editGroup';
import { editWorkflow } from './commands/editWorkflow';
import { listWorkflows } from './commands/listWorkflows';
import { WorkflowTreeItem } from './views/workflowTreeItem';
import { WorkflowTreeProvider } from './views/workflowTreeProvider';
import { runWorkflow } from './commands/runWorkflow';

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
			async (item: WorkflowTreeItem) => {

				await deleteWorkflow(
					storage,
					treeProvider,
					item.idValue!
				);
			}
		);

	const editWorkflowCommand =
		vscode.commands.registerCommand(
			'devWorkflow.editWorkflow',
			async (
				item: WorkflowTreeItem
			) => {

				await editWorkflow(
					storage,
					treeProvider,
					item.idValue!
				);
			}
		);

	const createGroupCommand =
		vscode.commands.registerCommand(
			'devWorkflow.createGroup',
			async () => {

				await createGroup(
					storage
				);

				treeProvider.refresh();
			}
		);

	const editGroupCommand =
		vscode.commands.registerCommand(
			'devWorkflow.editGroup',
			async (item: WorkflowTreeItem) => {

				await editGroup(
					storage,
					treeProvider,
					item.idValue!
				);
			}
		);

	const deleteGroupCommand =
		vscode.commands.registerCommand(
			'devWorkflow.deleteGroup',
			async (item: WorkflowTreeItem) => {

				await deleteGroup(
					storage,
					treeProvider,
					item.idValue!
				);
			}
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

				await runWorkflow(
					storage,
					workflowId
				);

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