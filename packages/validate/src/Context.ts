class ValidationContext {
    private _subjectStack: string[];
    private _objectFieldStack: [any, any][];

    public constructor() {
        this._subjectStack = ["Value"];
        this._objectFieldStack = [];
    }

    public pushSubject(subject: string) {
        this._subjectStack.push(subject);
    }

    public popSubject() {
        this._subjectStack.pop();
        if (this._subjectStack.length == 0) {
            throw new Error("Validation subject stack is empty");
        }
    }

    public pushObjectField<T>(key: keyof T, target: T) {
        this._objectFieldStack.push([key, target]);
    }

    public popObjectField() {
        this._objectFieldStack.pop();
        if (this._objectFieldStack.length == 0) {
            throw new Error("Validation object key stack is empty");
        }
    }

    public get subject(): string {
        return this._subjectStack[this._subjectStack.length - 1];
    }

    public get objectField(): [any, any] {
        return this._objectFieldStack[this._objectFieldStack.length - 1];
    }
}

export const context = new ValidationContext();
