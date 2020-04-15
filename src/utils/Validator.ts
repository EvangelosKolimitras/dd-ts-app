// Validates user's input

export class InputValidator {

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
        if (this.required) isValid = isValid && this.value.toString().trim().length !== 0
        if (this.minLen != null && typeof this.value === "string") isValid = isValid && this.value.length > this.minLen
        if (this.maxLen != null && typeof this.value === "string") isValid = isValid && this.value.length < this.maxLen
        if (this.min != null && typeof this.min === "number") isValid = isValid && this.value > this.min
        if (this.max != null && typeof this.max === "number") isValid = isValid && this.value < this.max
        return isValid;
    }
}