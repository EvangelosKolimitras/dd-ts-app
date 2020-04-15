// Project list class

import { AutobindDecorator } from "../decorators/Decorators"
import { Project, ProjectStatus } from "../models/Models"
import { State } from "../states/State"
import Component from "./base"
import { Item } from "./item"

export class Items extends Component<HTMLDivElement, HTMLElement> {

    // Private Properties
    addedProjects: Project[]
    element: any

    constructor(private type: 'active' | 'ended') {
        super("project-list", "app", false, `${type} -projects`)
        this.addedProjects = []

        // Register a listener
        State.addListener((projects: Project[]) => {

            // check if he project is active or ended
            this.addedProjects = projects.filter(p => {
                if (this.type === "active") return p.status === ProjectStatus.Active
                return p.status === ProjectStatus.Ended

            })
            this.renderProjects()
        })

        this.configure()
        this.renderer()
    }

    @AutobindDecorator
    dragOverHandler(e: DragEvent) {
        e.dataTransfer!.types[0] === "text/plain"
        e.preventDefault()
        const ul = this.element.querySelector("ul")!
        ul.classList.add("droppable")
    }

    @AutobindDecorator
    dropHandler(e: DragEvent) {
        const d_project = e.dataTransfer!.getData('text/plain')
        State.dragProject({ pid: d_project, status: this.type === "active" ? ProjectStatus.Active : ProjectStatus.Ended })
    }

    @AutobindDecorator
    dragLeaveHandler(_: DragEvent) {
        const ul = this.element.querySelector("ul")!
        ul.classList.remove("droppable")
    }

    public configure() {
        this.element.addEventListener("dragover", this.dragOverHandler)
        this.element.addEventListener("drop", this.dropHandler)
        this.element.addEventListener("dragleave", this.dragLeaveHandler)
    }

    // !! I used public for the renderer method because we ca not have private implementation
    //    of abstract methods or properties
    public renderer() {
        const listId = `${this.type} -projects - list`
        this.element.querySelector("ul")!.id = listId
        this.element.querySelector("h2")!.innerHTML = `${this.type.toUpperCase()} + Projects`
    }

    private renderProjects() {
        const listEl = document.getElementById(`${this.type} -projects - list`)! as HTMLUListElement
        listEl.innerHTML = ""
        for (const item of this.addedProjects) new Item({ placholderId: this.element.querySelector("ul")!.id, project: item })
    }

}
