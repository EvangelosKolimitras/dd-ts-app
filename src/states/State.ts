import { Project, ProjectStatus } from "../models/Models"

// Project state
type Listener<T> = (items: T[]) => void

class BaseState<T> {
    protected listeners: Listener<T>[] = []

    addListener(fn: Listener<T>) {
        this.listeners.push(fn)
    }
}

class ProjectState extends BaseState<Project> {

    // Private Properties
    private projects: Project[] = []
    private static instance: ProjectState

    private constructor() {
        super()
    }

    static getInstance() {
        if (this.instance)
            return this.instance
        this.instance = new ProjectState
        return this.instance
    }

    // Singleton pattern
    public addProject({ title, description, members }: { title: string; description: string; members: number }) {
        const newProject = new Project(Math.random().toString(), title, description, members, ProjectStatus.Active)
        this.projects.push(newProject)
        this.updater()
    }

    public dragProject({ pid, status }: { pid: string; status: ProjectStatus }) {
        const p = this.projects!.find(p => p.id === pid);
        if (p && p.status !== status) {
            p.status = status
            this.updater()
        }
    }

    private updater() { for (const fn of this.listeners) fn(this.projects.slice()) }

}

export const State = ProjectState.getInstance()
