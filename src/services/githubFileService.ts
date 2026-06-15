import { GithubService } from './githubService';


export class GithubFileService {


  constructor(
    private github:
      GithubService
  ) { }




  async uploadWorkflowFile(
    data: any
  ) {


    const user =
      await this.github.getUser();



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

      owner:
        user.login,

      repo:
        'dev-workflow-sync',

      path:
        'workflows.json',

      content,

      message:
        'Sync workflow data'

    });

  }

}