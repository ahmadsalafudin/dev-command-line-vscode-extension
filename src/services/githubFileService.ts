import { GithubService } from './githubService';

export class GithubFileService {
  constructor(
    private github: GithubService
  ) { }

  async uploadCommandFile(
    data: any
  ) {
    const user = await this.github.getUser();
    const repo = 'dev-command-sync';
    const exists =
      await this.github.repositoryExists(
        repo
      );

    if (!exists) {
      await this.github.createRepository(
        repo
      );
    }

    const content =
      Buffer.from(
        JSON.stringify(
          data,
          null,
          2
        )
      )
        .toString(
          'base64'
        );

    await this.github.createOrUpdateFile({
      owner: user.login,
      repo,
      path: 'commands.json',
      content,
      message: 'Sync Command data'
    });
  }
}