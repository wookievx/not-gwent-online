var Field = (function(){
  var Field = function(side, hasHornField){
    if(!(this instanceof Field)){
      return (new Field(side, hasHornField));
    }
    /**
     * constructor here
     */

    this._hasHornField = hasHornField || false;
    this._cards = [];
    this.side = side;
  };
  var r = Field.prototype;
  /**
   * methods && properties here
   * r.property = null;
   * r.getProperty = function() {...}
   */

  r._cards = null;
  r._score = 0;
  r._hasHornField = null;
  r._hornCard = null;
  r.side = null;

  r.add = function(card, isHorn){
    /*if(card.hasAbility("commanders_horn")) {
      this.setHorn(card);
      return;
    }*/
    if(isHorn && this._hasHornField) {
      this.setHorn(card);
      return;
    }
    this._cards.push(card);
    this.updateScore();
  }

  r.get = function(){
    return this._cards;
  }

  r.getScore = function(){
    this.updateScore();
    return this._score;
  }

  r.updateScore = function(){
    this._score = 0;
    for(var i = 0; i < this._cards.length; i++) {
      var card = this._cards[i];
      this._score += card.getPower();
    }
  }

  r.getPosition = function(card){
    for(var i = 0; i < this._cards.length; i++) {
      if(this._cards[i].getID() === card.getID()) return i;
    }
    return -1;
  }

  r.isOnField = function(card){
    if(this._hasHornField && this.getHorn() && card.getID() === this.getHorn().getID()){
      return true;
    }
    return this.getPosition(card) >= 0;
  }

  r.replaceWith = function(oldCard, newCard){
    var index = this.getPosition(oldCard);
    this._cards[index] = newCard;
    oldCard.reset();
    return oldCard;
  }

  r.getCard = function(id){
    for(var i = 0; i < this._cards.length; i++) {
      var card = this._cards[i];
      if(card.getID() == id) return card;
    }
    return -1;
  }

  r.removeAll = function(){
    var tmp = this._cards.slice();
    var self = this;
    tmp.forEach(function(card){
      card.reset();
      for(var event in card._uidEvents) {
        self.side.off(event, card.getUidEvents(event));
      }
    })
    this._cards = [];
    if(this.getHorn()) {
      var card = this.getHorn();
      card.reset();
      this.setHorn(null);
      for(var event in card._uidEvents) {
        self.side.off(event, card.getUidEvents(event));
      }
      tmp.push(card);
    }
    return tmp;
  }

  r.getInfo = function() {
    var self = this;
    return {
      cards: self._cards,
      horn: self.getHorn(),
      score: self._score
    }
  }

  r.getHorn = function() {
    if(!this._hasHornField) return null;
    return this._hornCard;
  }

  r.setHorn = function(card) {
    if(!this._hasHornField) return null;
    this._hornCard = card;
  }

  return Field;
})();

module.exports = Field;