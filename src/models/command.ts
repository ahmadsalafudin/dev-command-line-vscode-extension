export interface Command {
    id: string;
    name: string;
    groupId: string;
    commands: string[];
    favorite?: boolean;
}