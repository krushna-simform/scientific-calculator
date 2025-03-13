class History {
    constructor (history, key) {
        this.history = history || [];
        this.key = key;

        this.init();
    }

    init () {
        try {
            const storedHistory = JSON.parse(localStorage.getItem(this.key)) || [];
            if (Array.isArray(storedHistory)) {
                this.history.push(...storedHistory);
            }
        } catch (err) {
            this.history = [];
        }
    }

    // Save calculated value and input in local storage
    historySave () {
        localStorage.setItem(this.key, JSON.stringify(this.history));
    }   
}

export { History };