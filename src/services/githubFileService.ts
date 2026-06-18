
import { GithubService } from './githubService';
import * as vscode from 'vscode';

export class GithubFileService {
  constructor(private github: GithubService) { }
  private readonly repo = 'dev-command-sync';

  async uploadCommandFile(data: any) {
    const user = await this.github.getUser();
    const exists =
      await this.github.repositoryExists(
        this.repo
      );

    if (!exists) {
      await this.github.createRepository(
        this.repo
      );
    }

    const content =
      Buffer.from(
        JSON.stringify(
          data,
          null,
          2
        )
      ).toString('base64');

    await this.github.createOrUpdateFile({
      owner: user.login,
      repo: this.repo,
      path: 'commands.json',
      content,
      message: 'Sync Command data'
    });
  }

  async downloadCommandFile() {
    const user = await this.github.getUser();
    try {
      const file =
        await this.github.getFile({
          owner: user.login,
          repo: this.repo,
          path: 'commands.json'
        });

      const content = Buffer.from(file.content, 'base64').toString();

      return JSON.parse(content);
    } catch (error) {
      return null;
    }
  }
}