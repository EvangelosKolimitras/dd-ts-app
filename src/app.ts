class ProjectInput {
    template: HTMLTemplateElement
    app: HTMLDivElement
    el: HTMLFormElement
    title_el: HTMLInputElement
    descr_el: HTMLInputElement
    peopl_el: HTMLInputElement

    constructor() {
        this.template = document.getElementById("project-input")! as HTMLTemplateElement
        this.app = document.getElementById("app")! as HTMLDivElement

        const node = document.importNode(this.template.content, true)
        this.el = node.firstElementChild as HTMLFormElement
        this.el.id = "user-input"

        this.title_el = this.el.querySelector("#title")! as HTMLInputElement
        this.descr_el = this.el.querySelector("#description")! as HTMLInputElement
        this.peopl_el = this.el.querySelector("#people")! as HTMLInputElement

        this.configure()
        this.attach()

    }

    private submitHandler = (e: Event) => {
        e.preventDefault();
        console.log(this.title_el.value)
    }

    private configure() {
        this.el.addEventListener("click", this.submitHandler.bind(this))
    }

    private attach() {
        this.app.insertAdjacentElement("afterbegin", this.el)
    }
}

const new_p = new ProjectInput()
console.log(new_p)