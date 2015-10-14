import Model from 'jeopardy/lib/model/clue';
import Collection from 'jeopardy/lib/collection/collection';
var Super_Klass = Collection;

var Klass = Super_Klass.extend({
  model: Model,
  comparator: 'value',
});

export default Klass;
