class Memory {
    constructor(key = "memory") {
        this.key = key;
        this.memoryValue = this.loadMemory();
    }

    loadMemory() {
        try {
            return parseFloat(localStorage.getItem(this.key)) || 0;
        } catch (err) {
            return 0;
        }
    }

    // Store a new value in memory
    storeMemory(value) {
        if (Number.isFinite(value)) {
            this.memoryValue = value;
            localStorage.setItem(this.key, this.memoryValue);
        }
    }

    // Recall the stored value
    recallMemory() {
        return this.memoryValue;
    }

    // Add a value to the stored memory
    addToMemory(value) {
        if (Number.isFinite(value)) {
            this.memoryValue += value;
            localStorage.setItem(this.key, this.memoryValue);
        }
    }

    // Subtract a value from the stored memory
    subtractFromMemory(value) {
        if (Number.isFinite(value)) {
            this.memoryValue -= value;
            localStorage.setItem(this.key, this.memoryValue);
        }
    }

    // Clear memory storage
    clearMemory() {
        this.memoryValue = 0;
        localStorage.removeItem(this.key);
    }
}

export { Memory };