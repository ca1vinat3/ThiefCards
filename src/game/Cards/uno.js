export default class Uno {
    constructor(scene, x, y, cards, correctCardIndex, position = true, randomize = true) {
      this.scene = scene;
      this.x = x;
      this.y = y;
      this.cards = cards;
      this.correctCardIndex = correctCardIndex;
      this.position = position;
      this.randomize = randomize;
  
      if (randomize) {
        Phaser.Utils.Array.Shuffle(this.cards);
      }
  
      this.arrangeCards();
    }
  
    arrangeCards() {
      const radius = 80; // Semi-circle radius
      const angleStep = Math.PI / (this.cards.length - 1); // Equal spacing
  
      this.cards.forEach((card, index) => {
        const angle = -Math.PI / 1 + index * angleStep; // From left to right in a semi-circle
        const cardX = this.x + Math.cos(angle) * radius;
        const cardY = this.y + Math.sin(angle) * radius;
  
        // Position the existing card sprite
        card.setPosition(cardX, cardY);
        card.setInteractive();
        card.setDepth(index);
        
  
        // Store index for checking later
        card.cardIndex = index;
  
        // Add interaction
        card.on('pointerdown', () => {
          this.playCard(card);
        });
      });
    }
  
    playCard(card) {
      this.scene.tweens.add({
        targets: card,
        x: this.scene.cameras.main.centerX,
        y: this.scene.cameras.main.centerY,
        scale: 0.5,
        duration: 500,
        onComplete: () => {
          if (card.cardIndex === this.correctCardIndex) {
            console.log("Correct card played!");
          } else {
            console.log("Wrong card played.");
          }
        }
      });
    }
  }
  


  //in klikEngine 

  /*


// Keep Comment lines write your code in beetwen

// ### Variables: Start ###

let data = {

}



// ### Variables: End ###
// ### Create: Active Start ###

class Uno {
    constructor(scene, x, y, cards, correctCardIndex, opponent, deck, position = true, randomize = true) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.deck = deck
        this.opponent = opponent;
        this.cards = cards;
        this.correctCardIndex = correctCardIndex;
        this.position = position;
        this.randomize = randomize;
        this.scene.input.topOnly = false;
        this.isShowingFaces = true;
        this.playCount = 0;
        if (randomize) {
            Phaser.Utils.Array.Shuffle(this.cards);
        }

        this.arrangeCards();
    }

    arrangeCards() {


        let isOn = false;

      this.myUnoInterval =  setInterval(() => {
            if (this.isShowingFaces) {
                isOn = !isOn;

                if (isOn) {
                    data.targets[8].setVisible(false);
                    data.targets[7].setVisible(false);
                    data.targets[6].setVisible(false);
                    data.targets[5].setVisible(true);
                }
                if (!isOn) {
                    data.targets[8].setVisible(false);
                    data.targets[7].setVisible(false);
                    data.targets[6].setVisible(true);
                    data.targets[5].setVisible(false);
                }
            }
        
        }, 1000);



        const radius = 80; // Semi-circle radius
        const angleStep = Math.PI / (this.cards.length - 1); // Equal spacing

        this.cards.forEach((card, index) => {
            const angle = -Math.PI / 1 + index * angleStep; // From left to right in a semi-circle
            const cardX = this.x + Math.cos(angle) * radius;
            const cardY = this.y + Math.sin(angle) * radius;

            // Position the existing card sprite
            if (this.position) { card.setPosition(cardX, cardY); }
            card.setInteractive();
            //card.setDepth(index);


            // Store index for checking later
            card.cardIndex = index;

            // Add interaction
            this.scene.input.on('pointerdown', (pointer, gameObject) => {
                console.log("slkfjaslkfjakjakjflkajflka")
                if (gameObject[0]?.id == card?.id) {
               
                    console.log("zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz")
                    if(this.playCount<1){   this.playCard(card);}
                 
                }
            });
        });
    }

    playCard(card) {
         this.playCount++
         clearInterval(this.myUnoInterval);
        this.scene.tweens.add({
            targets: card,
            x: this.deck.x,
            y: this.deck.y,
            scale: 0.4,
            duration: 500,
            onComplete: () => {
               
                this.isShowingFaces = false;
                if (card.cardIndex === this.correctCardIndex) {
                    console.log("Correct card played!");
                    card.setDepth(100);
                    card.setVisible(false);
                    data.targets[8].setVisible(false);
                    data.targets[7].setVisible(true);
                    data.targets[6].setVisible(false);
                    data.targets[5].setVisible(false);
                    this.deck.setVisible(false)
                    this.scene.win();
                    //looking "5Tg4aC4jBWIdlPGiuER4s"

                    this.scene.sound.play("6669c4ce15dd740377f31485")
                    //    this.opponent.setTexture("5Tg4aC4jBWIdlPGiuER4s");
                    //   this.opponent.stop();
                } else {
                    this.scene.sound.play("66845b231da1d9037af80bf6")
                    data.targets[8].setVisible(true);
                    data.targets[7].setVisible(false);
                    data.targets[6].setVisible(false);
                    data.targets[5].setVisible(false);
                    console.log("Wrong card played.");
                    card.setDepth(100);
                    card.setVisible(false);
                    this.scene.lose();
                    //   this.opponent.setTexture("ZnKYb6Xn82paqIr8ZCRov");
                    // this.opponent.stop();
                }
            }
        });
    }
}


this.unoGame = new Uno(this, 400, 500, [data.targets[0], data.targets[1], data.targets[2], data.targets[3],], 3, data.targets[5], data.targets[4], false, false);

data.targets[7].setVisible(false);
data.targets[8].setVisible(false);
data.targets[6].setVisible(false);
data.targets[5].setVisible(true);



// ### Create: Active End ###
// ### Create: Deactivate Start ###



// ### Create: Deactivate End ###
// ### Update: Active Start ###



// ### Update : Active End ###
// ### Update : Deactivate Start ###



// ### Update: Deactivate End ###






  */