class AbstractObserver {
    /**
     * @constructor
     */
    constructor() {
        /** @type {Object<string, (event: Event) => void>} */
        this.subscribes = {};
    }

    /**
     * @param {string} eventType
     * @param {(event: Event) => void} eventHandler
     * @returns {AbstractObserver}
     */
    on(eventType, eventHandler) {
        if (!(eventType in this.subscribes)) {
            this.subscribes[eventType] = [];
        }

        this.subscribes[eventType].push(eventHandler);

        return this;
    }

    destroy() {
        for (let key in this) {
            if (this.hasOwnProperty(key)) {
                this[key] = null;
            }
        }
    }

    /**
     * @param {string} eventType
     * @param {Event} event
     * @protected
     */
    _run(eventType, event) {
        if (this.subscribes[eventType]) {
            for (const eventHandler of this.subscribes[eventType]) {
                eventHandler(event);
            }
        }
    }
}

export default AbstractObserver;
