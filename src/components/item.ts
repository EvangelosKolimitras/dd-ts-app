import { AutobindDecorator } from '../decorators/Decorators'
import { Draggable } from '../interfaces/Interfaces'
import { Project } from '../models/Models'
import Component from './base'

// Individual item

export class Item extends Component<HTMLUListElement, HTMLLIElement> implements Draggable {

    // Private Properties
    private project: Project

    constructor({ placholderId, project }: { placholderId: string; project: Project }) {
        super("single-project", placholderId, false, project.id)

        this.project = project
        this.configure()
        this.renderer()
    }

    @AutobindDecorator
    dragStartHandler(e: DragEvent) {
        e.dataTransfer!.setData("text/plain", this.project.id)
        e.dataTransfer!.effectAllowed = "move"
    }

    dragEndHandler(_: DragEvent) {
        // TODO
    }


    configure() {
        this.element.addEventListener("dragstart", this.dragStartHandler)
    }

    renderer() {
        const { title, members, description } = this.project
        this.element.querySelector("h2")!.innerHTML = title
        this.element.querySelector("h3")!.innerHTML = `
            ${members.toString()} member${members.toString().length !== 1 ? "" : "s"} are assigned to this project.`
        this.element.querySelector("p")!.innerHTML = description
    }
}
