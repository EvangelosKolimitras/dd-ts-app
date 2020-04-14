enum ProjectStatus {
    Active,
    Ended
}

class Project {
    constructor(
        public id: string,
        public title: string,
        public description: string,
        public people: number,
        public status: ProjectStatus
    ) { }
}

type Listener = (items: Project[]) => void

// Project state
class ProjectState {
    private projects: Project[] = []
    private static instance: ProjectState
    private listeners: Listener[] = []

    // Singleton pattern
    private constructor() { }

    static getInstance() {
        if (this.instance)
            return this.instance
        this.instance = new ProjectState
        return this.instance
    }

    addListener(fn: Listener) {
        this.listeners.push(fn)
    }

    public addProject(title: string, description: string, members: number) {
        const newProject = new Project(Math.random().toString(), title, description, members, ProjectStatus.Active)
        this.projects.push(newProject)
        for (const fn of this.listeners)
            fn(this.projects.slice())
    }
}

const State = ProjectState.getInstance()

// Validates user's input
class InputValidator {

    constructor(
        private value: string | number,
        private required?: boolean,
        private minLen?: number,
        private maxLen?: number,
        private min?: number,
        private max?: number
    ) { }

    public validate() {
        let isValid = true
        if (this.required)
            isValid = isValid && this.value.toString().trim().length !== 0
        if (this.minLen != null && typeof this.value === "string")
            isValid = isValid && this.value.length > this.minLen
        if (this.maxLen != null && typeof this.value === "string")
            isValid = isValid && this.value.length < this.maxLen
        if (this.min != null && typeof this.min === "number")
            isValid = isValid && this.value > this.min
        if (this.max != null && typeof this.max === "number")
            isValid = isValid && this.value < this.max
        return isValid;
    }
}

// Generator
function AutobindGenerator(_: any, __: string, PropertyDescriptor: PropertyDescriptor) {
    return {
        configurable: true,
        get() {
            return PropertyDescriptor.value.bind(this)
        }
    }
}

// Project list class

class Projects {
    template: HTMLTemplateElement
    placeHolder: HTMLDivElement
    el: HTMLElement
    addedProjects: Project[]

    constructor(private type: 'active' | 'ended') {
        this.template = document.getElementById("project-list")! as HTMLTemplateElement
        this.placeHolder = document.getElementById("app")! as HTMLDivElement
        this.addedProjects = []

        const import_node = document.importNode(this.template.content, true)
        this.el = import_node.firstElementChild as HTMLElement
        this.el.id = `${this.type}-projects`

        // Register a listener
        State.addListener((projects: Project[]) => {
            // check if he project is active or ended
            this.addedProjects = projects.filter(p => {
                if (this.type === "active") return p.status === ProjectStatus.Active
                return p.status === ProjectStatus.Ended

            })
            this.renderProjects()
        })

        this.attach()
        this.renderH2()
    }


    private renderProjects() {
        const listEl = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement
        listEl.innerHTML = ""
        for (const items of this.addedProjects) {
            const list_item = document.createElement("li")
            list_item.textContent = items.title
            listEl?.appendChild(list_item)
        }
    }

    private attach() {
        this.placeHolder.insertAdjacentElement("beforeend", this.el)
    }

    private renderH2() {
        const listId = `${this.type}-projects-list`
        this.el.querySelector("ul")!.id = listId
        this.el.querySelector("h2")!.innerHTML = `${this.type.toUpperCase()} + Projects`
    }
}

class ProjectInput {
    template: HTMLTemplateElement
    htmlPlaceholder: HTMLDivElement
    el: HTMLFormElement
    title_el: HTMLInputElement
    descr_el: HTMLInputElement
    peopl_el: HTMLInputElement

    constructor() {
        this.template = document.getElementById("project-input")! as HTMLTemplateElement
        this.htmlPlaceholder = document.getElementById("app")! as HTMLDivElement

        const node = document.importNode(this.template.content, true)
        this.el = node.firstElementChild as HTMLFormElement
        this.el.id = "user-input"

        this.title_el = this.el.querySelector("#title")! as HTMLInputElement
        this.descr_el = this.el.querySelector("#description")! as HTMLInputElement
        this.peopl_el = this.el.querySelector("#people")! as HTMLInputElement

        this.configure()
        this.attach()

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

    @AutobindGenerator
    private submitHandler(e: Event) {
        e.preventDefault();
        const input = this.getAllUsersInput()
        if (Array.isArray(input)) {
            const [title, description, people] = input
            State.addProject(title, description, people)
            console.log(title, description, people)
        }
    }

    private configure() {
        this.el.addEventListener("submit", this.submitHandler)
    }

    private attach() {
        this.htmlPlaceholder.insertAdjacentElement("afterbegin", this.el)
    }
}

const new_p = new ProjectInput()
const a_list = new Projects("active")
const e_list = new Projects("ended")