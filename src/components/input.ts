// Project input

import { AutobindDecorator } from "../decorators/Decorators"
import { State } from "../states/State"
import { InputValidator } from "../utils/Validator"
import Component from "./base"

export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
    title_el: HTMLInputElement
    descr_el: HTMLInputElement
    peopl_el: HTMLInputElement

    constructor() {
        super("project-input", "app", true, "user-input")

        this.title_el = this.element.querySelector("#title")! as HTMLInputElement
        this.descr_el = this.element.querySelector("#description")! as HTMLInputElement
        this.peopl_el = this.element.querySelector("#people")! as HTMLInputElement

        this.configure()
        this.renderer()
    }

    public renderer() { /* No implementation  */ }

    public configure() {
        this.element.addEventListener("submit", this.submitHandler)
    }

    private getAllUsersInput(): [string, string, number] | void {
        const t = this.title_el.value
        const d = this.descr_el.value
        const p = this.peopl_el.value

        const v_title = new InputValidator(t, true)
        const v_descr = new InputValidator(d, true, 10)
        const v_peopl = new InputValidator(+p, true, 1, 5)

        if (!v_title.validate() || !v_descr.validate() || !v_peopl.validate()) {
            console.log('Invalid input')
            return
        }
        return [t, d, +p]

    }

    @AutobindDecorator
    private submitHandler(e: Event) {
        e.preventDefault();
        const input = this.getAllUsersInput()
        if (Array.isArray(input)) {
            const [title, description, people] = input
            State.addProject({ title, description, members: people })
        }
    }

}
