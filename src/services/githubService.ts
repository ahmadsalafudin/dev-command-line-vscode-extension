export class GithubService {

  private octokit: any;


  constructor(
    private token: string
  ) { }



  private async getOctokit() {

    if (this.octokit) {
      return this.octokit;
    }


    const module =
      await import(
        '@octokit/rest'
      );


    const Octokit =
      module.Octokit;


    this.octokit =
      new Octokit({
        auth:
          this.token
      });


    return this.octokit;
  }




  async getUser() {

    const octokit =
      await this.getOctokit();


    const response =
      await octokit.rest.users
        .getAuthenticated();


    return response.data;
  }




  async repositoryExists(
    repoName: string
  ): Promise<boolean> {


    const octokit =
      await this.getOctokit();


    const user =
      await this.getUser();



    try {

      await octokit.rest.repos.get({

        owner:
          user.login,

        repo:
          repoName

      });


      return true;


    } catch {

      return false;

    }

  }





  async createRepository(
    repoName: string
  ) {


    const octokit =
      await this.getOctokit();



    const response =
      await octokit.rest.repos
        .createForAuthenticatedUser({

          name:
            repoName,

          private:
            true,

          description:
            'Dev Workflow Manager sync repository'

        });



    return response.data;
  }

  async createOrUpdateFile(
    params: any
  ) {

    const octokit =
      await this.getOctokit();


    let sha;


    try {

      const existing =
        await octokit.rest.repos
          .getContent({

            owner:
              params.owner,

            repo:
              params.repo,

            path:
              params.path

          });


      if (
        !Array.isArray(
          existing.data
        )
      ) {

        sha =
          existing.data.sha;

      }


    } catch {

      // file belum ada

    }



    await octokit.rest.repos
      .createOrUpdateFileContents({

        owner:
          params.owner,

        repo:
          params.repo,

        path:
          params.path,

        message:
          params.message,

        content:
          params.content,

        sha

      });

  }

}