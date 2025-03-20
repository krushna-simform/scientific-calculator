class History {
    constructor (key) {
        this.history = [];
        this.key = key;

        this.appendHistory();
    }

    appendHistory () {
        try {
            const storedHistory = JSON.parse(localStorage.getItem(this.key)) || [];
            if (Array.isArray(storedHistory)) {
                this.history.push(...storedHistory);
            }
        } catch (err) {
            this.history = [];
        }
    }

    dataPush (data) {
        this.history.push(data);
        this.historySave();
    }

    // Save calculated value and input in local storage
    historySave () {
        localStorage.setItem(this.key, JSON.stringify(this.history));
    }   

    // Get history from localStorage
    getHistory() {
        const storedData = JSON.parse(localStorage.getItem(this.key)) || [];
        return storedData.map(entry => `${entry.question} = ${entry.answer}`);
    }

    // Clear history and reset Array
    clearHistory() {
        localStorage.removeItem(this.key);
        this.history = [];  
        this.historySave();  
    }
}

export { History };