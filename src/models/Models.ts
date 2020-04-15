
export enum ProjectStatus {
    Active,
    Ended
}
export class Project {
    constructor(
        public id: string,
        public title: string,
        public description: string,
        public members: number,
        public status: ProjectStatus
    ) { }
}
