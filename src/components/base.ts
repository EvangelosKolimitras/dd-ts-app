// Base class component

export default abstract class Component<T extends HTMLElement, U extends HTMLElement>{

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
    abstract configure(): void
    abstract renderer(): void // renders content to the DOM
}
