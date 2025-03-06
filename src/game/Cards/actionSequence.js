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
  

  // IN klikGame ENGINE 

  /*
  
  
  /* Keep Comment lines write your code in beetwen

// ### Variables: Start ###

let data = {

}

// ### Variables: End ###
// ### Create: Active Start ###

    class actionSequence {
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
      this.scene.input.topOnly = false;
      this.userCountIndex = 0;
    }
  
    // Generate sequence based on linear or random order
    generateSequence() {
      let baseSequence =
        this.sequenceType === "random"
          ? Phaser.Utils.Array.Shuffle([...Array(this.functions.length).keys()])
          : [...Array(this.functions.length).keys()];

      // Pick a random function from the base sequence to repeat at the end
      let randomFunctionIndex =
        baseSequence[Math.floor(Math.random() * baseSequence.length)];

      this.sequence = [...baseSequence, randomFunctionIndex]; // Append random function
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
        this.userCountIndex++;
        if (this.userCountIndex == 5) {
          if (this.checkUserSequence()) {
            this.scene.win();
          
          } else {

            setAllBandAngry();
            this.scene.lose();
           }
        }
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

   

      

              this.input.on('pointerdown', (pointer, gameObject) => {
            
                if (gameObject[0]?.id == data.targets[0]?.id) {
               
                
                  this.myActionSequence.userRun(0);
                 
                }

                 if (gameObject[0]?.id == data.targets[3]?.id) {
               
                
                    this.myActionSequence.userRun(1);
                }

                if (gameObject[0]?.id == data.targets[6]?.id) {
               
                 
                           this.myActionSequence.userRun(2);
                }

               if (gameObject[0]?.id == data.targets[9]?.id) {
               
              
                     this.myActionSequence.userRun(3);
                 
                }


              });


            
 


function setAllBandNormal()
{

  data.targets[0].setVisible(true);
  data.targets[1].setVisible(false);
  data.targets[2].setVisible(false);

  data.targets[3].setVisible(true);
  data.targets[4].setVisible(false);
  data.targets[5].setVisible(false);

  data.targets[6].setVisible(true);
  data.targets[7].setVisible(false);
  data.targets[8].setVisible(false);

  data.targets[9].setVisible(true);
  data.targets[10].setVisible(false);
  data.targets[11].setVisible(false);
  
}

function setAllBandAngry() {

 data.targets[0].setVisible(false);
  data.targets[1].setVisible(false);
  data.targets[2].setVisible(true);

  data.targets[3].setVisible(false);
  data.targets[4].setVisible(false);
  data.targets[5].setVisible(true);

  data.targets[6].setVisible(false);
  data.targets[7].setVisible(false);
  data.targets[8].setVisible(true);

  data.targets[9].setVisible(false);
  data.targets[10].setVisible(false);
  data.targets[11].setVisible(true);

  
}



function playBandMemberOne()
{
  setAllBandNormal();
  data.targets[0].setVisible(false);
  data.targets[1].setVisible(true);
  data.targets[2].setVisible(false);

  setTimeout(() => {  data.targets[0].setVisible(true);
  data.targets[1].setVisible(false);}, 1400);
   
     }
function playBandMemberTwo()
{ 
  setAllBandNormal();
  data.targets[3].setVisible(false);
  data.targets[4].setVisible(true);
  data.targets[5].setVisible(false);

    setTimeout(() => {  data.targets[3].setVisible(true);
  data.targets[4].setVisible(false);}, 1400);
     }
function playBandMemberThree()
{
  setAllBandNormal();
  data.targets[6].setVisible(false);
  data.targets[7].setVisible(true);
  data.targets[8].setVisible(false);

      setTimeout(() => {  data.targets[6].setVisible(true);
  data.targets[7].setVisible(false);}, 1400);
      
      }
function playBandMemberFour()
{
  setAllBandNormal();
 data.targets[9].setVisible(false);
  data.targets[10].setVisible(true);
  data.targets[11].setVisible(false);
  
      setTimeout(() => {  data.targets[9].setVisible(true);
  data.targets[10].setVisible(false);}, 1400);
}

setAllBandNormal();

   
    this.myActionSequence =  new actionSequence({
      scene: this,
      functions: [playBandMemberOne, playBandMemberTwo, playBandMemberThree, playBandMemberFour],
      sequence: "random",
      timeBased: true,
      strictLinear: false,
      delay: 1500,
    });

// setTimeout(() => {

//        this.myActionSequence.reset();

     
//     }, 3000);
  
       this.myActionSequence.runSequence();
// ### Create: Active End ###
// ### Create: Deactivate Start ###



// ### Create: Deactivate End ###
// ### Update: Active Start ###

// if (this.myActionSequence.checkUserSequence())
// {

//   setAllBandAngry()
//   // setTimeout(() => {

// //        this.myActionSequence.reset();

     
// //     }, 3000);

//  }


// ### Update : Active End ###
// ### Update : Deactivate Start ###



// ### Update: Deactivate End ###
  
  
  
  
  
  
  
  
  
  
  
  
  */