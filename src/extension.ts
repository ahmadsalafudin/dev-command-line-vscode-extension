import * as vscode from 'vscode';
import { GithubAuth } from './auth/githubAuth';
import { addCommand } from './commands/addCommand';
import { addCommandToGroup } from './commands/addCommandToGroup';
import { connectGithub } from './commands/connectGithub';
import { createGroup } from './commands/createGroup';
import { deleteCommand } from './commands/deleteCommand';
import { deleteGroup } from './commands/deleteGroup';
import { editCommand } from './commands/editCommand';
import { editGroup } from './commands/editGroup';
import { exportCommand } from './commands/exportCommand';
import { githubMenu } from './commands/githubMenu';
import { importCommand } from './commands/importCommand';
import { listCommands } from './commands/listCommands';
import { runCommand } from './commands/runCommand';
import { syncGithub } from './commands/syncGithub';
import { StorageService } from './services/storageService';
import { SyncManager } from './services/syncManager';
import { CommandTreeItem } from './views/commandTreeItem';
import { CommandTreeProvider } from './views/commandTreeProvider';

export function activate(
	context: vscode.ExtensionContext
) {

	vscode.window.showInformationMessage(
		'Dev Command Activated ✓'
	);

	let syncManager: SyncManager;


	const githubSyncStatus =
		vscode.window.createStatusBarItem(
			vscode.StatusBarAlignment.Right,
			100
		);

	githubSyncStatus.text = "$(github)";
	githubSyncStatus.tooltip = "Dev Command GitHub Sync";
	githubSyncStatus.show();
	context.subscriptions.push(githubSyncStatus);

	const storage =
		new StorageService(
			context,
			() => {
				syncManager
					?.triggerSync();
			}
		);

	syncManager =
		new SyncManager(
			storage,
			context,
			(status) => {
				console.log(
					'SYNC STATUS:',
					status
				);

				switch (status) {
					case 'syncing':
						githubSyncStatus.text = "$(sync~spin)";
						githubSyncStatus.tooltip = "Syncing Command to GitHub...";
						break;
					case 'success':
						githubSyncStatus.text = "$(github)";
						githubSyncStatus.tooltip = "Command synced";
						break;
					case 'error':
						githubSyncStatus.text = "$(error)";
						githubSyncStatus.tooltip =
							"GitHub sync failed";
						break;
				}
			}
		);

	const githubAuth =
		new GithubAuth(context);

	const connectGithubCommand =
		vscode.commands.registerCommand(
			'devCommand.connectGithub',
			() =>
				connectGithub(
					githubAuth
				)
		);

	const addCommandCommand =
		vscode.commands.registerCommand(
			'devCommand.addCommand',
			() => addCommand(storage)
		);

	const runCommandCommand =
		vscode.commands.registerCommand(
			'devCommand.runCommand',
			() => runCommand(storage)
		);

	const listCommandCommand =
		vscode.commands.registerCommand(
			'devCommand.listCommands',
			() => listCommands(storage)
		);

	const deleteCommandCommand =
		vscode.commands.registerCommand(
			'devCommand.deleteCommand',
			async (item: CommandTreeItem) => {

				await deleteCommand(
					storage,
					treeProvider,
					item.idValue!
				);
			}
		);

	const editCommandCommand =
		vscode.commands.registerCommand(
			'devCommand.editCommand',
			async (
				item: CommandTreeItem
			) => {

				await editCommand(
					storage,
					treeProvider,
					item.idValue!
				);
			}
		);

	const createGroupCommand =
		vscode.commands.registerCommand(
			'devCommand.createGroup',
			async () => {

				await createGroup(
					storage
				);

				treeProvider.refresh();
			}
		);

	const editGroupCommand =
		vscode.commands.registerCommand(
			'devCommand.editGroup',
			async (item: CommandTreeItem) => {

				await editGroup(
					storage,
					treeProvider,
					item.idValue!
				);
			}
		);

	const deleteGroupCommand =
		vscode.commands.registerCommand(
			'devCommand.deleteGroup',
			async (item: CommandTreeItem) => {

				await deleteGroup(
					storage,
					treeProvider,
					item.idValue!
				);
			}
		);

	const treeProvider =
		new CommandTreeProvider(
			storage
		);

	vscode.window.createTreeView(
		'devCommandView',
		{
			treeDataProvider:
				treeProvider,

			dragAndDropController:
				treeProvider
		}
	);

	const runCommandFromTree =
		vscode.commands.registerCommand(
			'devCommand.runCommandFromTree',
			async (
				item: CommandTreeItem
			) => {

				if (!item) {
					return;
				}


				const Command =
					storage
						.getCommands()
						.find(
							Command =>
								Command.id ===
								item.idValue
						);


				if (!Command) {
					return;
				}


				const parameters =
					extractParameters(
						Command.commands
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
						'Dev Command'
					);


				terminal.show();



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
			'devCommand.refresh',
			() => treeProvider.refresh()
		);

	const addCommandToGroupCommand =
		vscode.commands.registerCommand(
			'devCommand.addCommandToGroup',
			async (
				item: CommandTreeItem
			) => {
				await addCommandToGroup(
					storage,
					item.idValue!
				);

				treeProvider.refresh();
			}
		);

	const toggleFavoriteCommand =
		vscode.commands.registerCommand(
			'devCommand.toggleFavorite',
			async (
				item: CommandTreeItem
			) => {
				await storage.toggleFavorite(
					item.idValue!
				);

				treeProvider.refresh();
			}
		);

	const importCommandCommand =
		vscode.commands.registerCommand(
			'devCommand.importCommand',
			() =>
				importCommand(
					storage,
					treeProvider
				)
		);


	const exportCommandCommand =
		vscode.commands.registerCommand(
			'devCommand.exportCommand',
			() =>
				exportCommand(
					storage
				)
		);

	const syncGithubCommand =
		vscode.commands.registerCommand(
			'devCommand.syncGithub',
			async () => {
				const session =
					await vscode.authentication
						.getSession(
							'github',
							[
								'repo'
							],
							{
								createIfNone: true
							}
						);

				if (!session) {
					return;
				}

				await syncGithub(
					storage,
					session.accessToken
				);
			}
		);

	const githubMenuCommand =
		vscode.commands.registerCommand(
			'devCommand.githubMenu',
			() =>
				githubMenu(
					context,
					storage
				)
		);

	context.subscriptions.push(
		addCommandCommand,
		runCommandCommand,
		listCommandCommand,
		deleteCommandCommand,
		editCommandCommand,
		createGroupCommand,
		editGroupCommand,
		deleteGroupCommand,
		runCommandFromTree,
		refreshCommand,
		addCommandToGroupCommand,
		toggleFavoriteCommand,
		importCommandCommand,
		exportCommandCommand,
		connectGithubCommand,
		syncGithubCommand,
		githubMenuCommand
	);
}

export function deactivate() { }