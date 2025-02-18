export default class match {
    constructor(scene, x, y, items, position = true, randomize = true) {
      this.scene = scene;
      this.x = x;
      this.y = y;
      this.items = items;
      this.position = position;
      this.randomize = randomize;
      
      if (this.items.length < 4 || this.items.length % 4 !== 0) {
        console.error("Items array must have a minimum of 4 elements and be a multiple of 4.");
        return;
      }
  
      this.pairs = this.createPairs();
      if (this.randomize) {
        this.shufflePairs();
      }
      this.quadPairs = this.createQuadPairs();
      this.setupGame();
    }
  
    createPairs() {
      let pairs = [];
      for (let i = 0; i < this.items.length; i += 2) {
        let id = Math.floor(i / 4) + 1; // Ensuring each two pairs get the same ID
        pairs.push({
          cover: this.items[i],
          bug: this.items[i + 1],
          matched: false,
          id: id
        });
      }
      return pairs;
    }
    
  
    shufflePairs() {
      let shuffled = [...this.pairs];
      do {
        shuffled.sort(() => Math.random() - 0.5);
      } while (this.arePairsAdjacent(shuffled));
      this.pairs = shuffled;
    }
  
    arePairsAdjacent(pairs) {
      for (let i = 0; i < pairs.length - 1; i++) {
        if (pairs[i].id === pairs[i + 1].id) {
          return true;
        }
      }
      return false;
    }
  
    createQuadPairs() {
      let quadPairs = [];
      for (let i = 0; i < this.items.length; i += 4) {
        let id = i / 4;
        quadPairs.push({
          cover1: this.items[i],
          bug1: this.items[i + 1],
          cover2: this.items[i + 2],
          bug2: this.items[i + 3],
          matched: false,
          id: id
        });
      }
      return quadPairs;
    }
  
    setupGame() {
      let cols = 4;
      let rows = Math.ceil(this.pairs.length / cols);
      
      this.pairs.forEach((pair, i) => {
        let posX = this.position ? this.x + (i % cols) * 100 : pair.cover.x;
        let posY = this.position ? this.y + Math.floor(i / cols) * 100 : pair.cover.y;
        
        pair.cover.setPosition(posX, posY).setInteractive().setData('pairId', pair.id);
        pair.bug.setPosition(posX, posY).setVisible(false);
  
        this.addInteractivity(pair.cover, pair.bug);
      });
    }
  
    addInteractivity(cover, bug) {
      cover.isFlipped = false;
      
      cover.on('pointerdown', () => {
        if (!cover.isFlipped) {
          cover.setVisible(false);
          bug.setVisible(true);
          cover.isFlipped = true;
          this.checkMatch();
        }
      });
    }
  
    checkMatch() {
      let flipped = this.pairs.filter(pair => pair.cover.isFlipped);
      
      if (flipped.length === 2) {
        if (flipped[0].id === flipped[1].id) {
          console.log("Match!");
          flipped.forEach(pair => {
            pair.cover.setVisible(false);
            pair.bug.setVisible(false);
            pair.cover.isFlipped = false;
          });
          
        } else {
          setTimeout(() => {
            flipped.forEach(pair => {
              pair.cover.setVisible(true);
              pair.bug.setVisible(false);
              pair.cover.isFlipped = false;
            });
          }, 1000);
        }
      }
    }
  }
  