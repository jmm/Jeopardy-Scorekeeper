import Model from 'jeopardy/lib/model/round';
import Collection from 'jeopardy/lib/collection/collection';
var Super_Klass = Collection;

var Klass = Super_Klass.extend({
  model: Model,

  /**
   * Return current round.
   */
  current () {
    return this.slice(-1)[0];
  },
  // current
});

export default Klass;
