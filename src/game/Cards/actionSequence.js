export default class actionSequence {
    constructor({scene,functions = [],sequence = "linear",timeBased = false,strictLinear = false,delay = 1000, }) {
        this.scene = scene;
      this.functions = functions;
      this.sequenceType = sequence;
      this.timeBased = timeBased;
      this.strictLinear = strictLinear;
      this.delay = delay;
  
      this.sequence = [];
      this.userSequence = [];
      this.currentIndex = 0;
      this.isRunning = false;
    }
  
    // Generate sequence based on linear or random order
    generateSequence() {
      this.sequence =
        this.sequenceType === "random"
          ? Phaser.Utils.Array.Shuffle([...Array(this.functions.length).keys()])
          : [...Array(this.functions.length).keys()];
    }
  
    // Run automatically
    async runSequence() {
      if (this.isRunning) return;
      this.isRunning = true;
      this.generateSequence();
  
      for (let i = 0; i < this.sequence.length; i++) {
        const funcIndex = this.sequence[i];
        await this.runFunction(funcIndex);
      }
  
      this.isRunning = false;
    }
  
    // Run a  function by index, optionally with delay
    runFunction(index) {
      return new Promise((resolve) => {
        const func = this.functions[index];
        if (func) {
          func(this.scene);
        }
  
        if (this.timeBased) {
          setTimeout(resolve, this.delay);
        } else {
          resolve();
        }
      });
    }
  
    // Allow user to run a specific action
    userRun(index) {
      if (this.strictLinear && index !== this.sequence[this.currentIndex]) {
        console.log("Invalid action! Follow the sequence strictly.");
        return false;
      }
  
      const func = this.functions[index];
      if (func) {
        func(this.scene);
        this.userSequence.push(index);
  
        if (this.strictLinear) {
          this.currentIndex++;
        }
  
        return true;
      }
      return false;
    }
  
    // Check if user's  match the generated sequence
    checkUserSequence() {
      return (
        this.userSequence.length === this.sequence.length &&
        this.userSequence.every((value, index) => value === this.sequence[index])
      );
    }
  
    // Reset 
    reset() {
      this.sequence = [];
      this.userSequence = [];
      this.currentIndex = 0;
      this.isRunning = false;
    }
  }
  