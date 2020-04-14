
enum ProjectStatus {
    Active,
    Ended
}

type Listener<T> = (items: T[]) => void

class BaseState<T> {
    protected listeners: Listener<T>[] = []

    addListener(fn: Listener<T>) {
        this.listeners.push(fn)
    }
}

class Project {
    constructor(
        public id: string,
        public title: string,
        public description: string,
        public members: number,
        public status: ProjectStatus
    ) { }
}

// Project state
class ProjectState extends BaseState<Project> {
    private projects: Project[] = []
    private static instance: ProjectState


    // Singleton pattern
    private constructor() {
        super()
    }

    static getInstance() {
        if (this.instance)
            return this.instance
        this.instance = new ProjectState
        return this.instance
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


// Base class component

abstract class Component<T extends HTMLElement, U extends HTMLElement>{
    template: HTMLTemplateElement
    placeholder: T
    element: U

    constructor(
        templateId: string,
        placholderId: string,
        insertAt: boolean,
        newElementId?: string
    ) {
        this.template = document.getElementById(templateId)! as HTMLTemplateElement
        this.placeholder = document.getElementById(placholderId)! as T

        const import_node = document.importNode(this.template.content, true)
        this.element = import_node.firstElementChild as U
        if (newElementId) this.element.id = newElementId

        this.attach(insertAt)
    }

    private attach(insertAt: boolean) {
        this.placeholder.insertAdjacentElement(insertAt ? "afterbegin" : "beforeend", this.element)
    }
    abstract configure?(): void
    abstract renderer?(): void // renders content to the DOM
}


// Individual item
class Item extends Component<HTMLUListElement, HTMLLIElement>{
    private project: Project

    constructor(placholderId: string, project: Project) {
        super("single-project", placholderId, false, project.id)

        this.project = project
        this.configure()
        this.renderer()
    }
    configure() { }
    renderer() {
        const { title, members, description } = this.project
        this.element.querySelector("h2")!.innerHTML = title
        this.element.querySelector("h3")!.innerHTML = `
        ${members.toString()} member${members.toString().length !== 1 ? "" : "s"} are assigned to this project.`
        this.element.querySelector("p")!.innerHTML = description
    }
}

// Project list class
class Items extends Component<HTMLDivElement, HTMLElement> {

    addedProjects: Project[]

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

        this.renderer()
    }

    public configure() { /* No implementation  */ }

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
        for (const item of this.addedProjects) new Item(this.element.querySelector("ul")!.id, item)
    }

}

class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
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

}

const new_p = new ProjectInput()
const a_list = new Items("active")
const e_list = new Items("ended")
