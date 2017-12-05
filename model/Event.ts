function isFunction(functionToCheck: any) {
    const getType = {}
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]'
}

export interface Subscriber<T>{
    dataAvailable(data?: T) : void
}

export class Event<T> { 
    private handlers: Subscriber<T>[] = []

    public on(handler: Subscriber<T>) {
        if (!isFunction(handler.dataAvailable)) {
            throw new Error("Handler is not a function")
        }
        this.handlers.push(handler)
    }

    public off(handler: Subscriber<T>) {
        this.handlers = this.handlers.filter(h => h !== handler)
    }

    public allOff() {
        this.handlers = []
    }

    public trigger(data?: T) {
        if (this.handlers) {
            this.handlers.slice(0).forEach(h => h.dataAvailable(data))
        }
    }

    public hasListener(): boolean {
        return this.handlers.length !== 0
    }
}