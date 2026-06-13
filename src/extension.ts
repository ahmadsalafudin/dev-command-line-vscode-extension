import * as vscode from 'vscode';

import { StorageService } from './services/storageService';

import { addWorkflow } from './commands/addWorkflow';
import { addWorkflowToGroup } from './commands/addWorkflowToGroup';
import { createGroup } from './commands/createGroup';
import { deleteGroup } from './commands/deleteGroup';
import { deleteWorkflow } from './commands/deleteWorkflow';
import { editGroup } from './commands/editGroup';
import { editWorkflow } from './commands/editWorkflow';
import { exportWorkflow } from './commands/exportWorkflow';
import { importWorkflow } from './commands/importWorkflow';
import { listWorkflows } from './commands/listWorkflows';
import { runWorkflow } from './commands/runWorkflow';
import { WorkflowTreeItem } from './views/workflowTreeItem';
import { WorkflowTreeProvider } from './views/workflowTreeProvider';

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
				treeProvider,

			dragAndDropController:
				treeProvider
		}
	);

	const runWorkflowFromTree =
		vscode.commands.registerCommand(
			'devWorkflow.runWorkflowFromTree',
			async (
				item: WorkflowTreeItem
			) => {

				if (!item) {
					return;
				}


				const workflow =
					storage
						.getWorkflows()
						.find(
							workflow =>
								workflow.id ===
								item.idValue
						);


				if (!workflow) {
					return;
				}


				const parameters =
					extractParameters(
						workflow.commands
					);


				const values:
					Record<string, string> = {};


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
		);

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

	const toggleFavoriteCommand =
		vscode.commands.registerCommand(
			'devWorkflow.toggleFavorite',
			async (
				item: WorkflowTreeItem
			) => {

				await storage.toggleFavorite(
					item.idValue!
				);

				treeProvider.refresh();
			}
		);

	const importWorkflowCommand =
		vscode.commands.registerCommand(
			'devWorkflow.importWorkflow',
			() =>
				importWorkflow(
					storage,
					treeProvider
				)
		);


	const exportWorkflowCommand =
		vscode.commands.registerCommand(
			'devWorkflow.exportWorkflow',
			() =>
				exportWorkflow(
					storage
				)
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
		toggleFavoriteCommand,
		importWorkflowCommand,
		exportWorkflowCommand
	);
}

export function deactivate() { }