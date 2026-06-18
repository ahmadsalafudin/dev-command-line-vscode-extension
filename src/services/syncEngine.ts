export class SyncEngine {

  merge(
    local: any,
    remote: any
  ) {
    return {
      groups:
        this.mergeGroups(
          local.groups,
          remote.groups
        ),

      commands:
        this.mergeCommands(
          local.commands,
          remote.commands
        )
    };
  }

  private mergeGroups(
    local: any[],
    remote: any[]
  ) {
    const result = [...local];
    for (const remoteGroup of remote) {

      const sameId =
        result.find(
          item => item.id === remoteGroup.id
        );

      if (sameId) {
        if (sameId.updatedAt < remoteGroup.updatedAt) {
          Object.assign(sameId, remoteGroup);
        }

        continue;
      }

      const sameName =
        result.find(
          item => item.name.toLowerCase() === remoteGroup.name.toLowerCase()
        );

      if (!sameName) {
        result.push(remoteGroup);
      }
    }

    return result;
  }

  private mergeCommands(
    local: any[],
    remote: any[]
  ) {
    const result =
      [...local];

    for (const remoteCommand of remote) {
      const sameId =
        result.find(
          item =>
            item.id === remoteCommand.id
        );

      if (sameId) {
        if (sameId.updatedAt < remoteCommand.updatedAt) {
          Object.assign(
            sameId,
            remoteCommand
          );
        }

        continue;
      }

      const sameContent =
        result.find(
          item =>
            item.name
              .toLowerCase() === remoteCommand.name.toLowerCase()
            &&
            item.command === remoteCommand.command
        );

      if (sameContent) {
        continue;
      }

      const sameName =
        result.find(
          item => item.name.toLowerCase() === remoteCommand.name.toLowerCase()
        );

      if (sameName) {
        result.push({
          ...remoteCommand,
          id: Date.now().toString(),
          name: remoteCommand.name
            + ' (GitHub)'
        });
      } else {
        result.push(
          remoteCommand
        );
      }
    }

    return result;
  }
}