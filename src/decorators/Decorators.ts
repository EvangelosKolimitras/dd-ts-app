// Generator

export const AutobindDecorator = (_: any, __: string, { value }: PropertyDescriptor) => ({
    get() {
        return value.bind(this)
    }
})
