import base_class, {init as bc_init} from 'jeopardy/lib/util/base-class';
import Collection from 'jeopardy/lib/collection/collection';
import Model from 'jeopardy/lib/model/model';

var klasses = {
  Collection,
  Model,
};

/**
 * Initialize application state.
 */
export function init () {
  bc_init();
  Object.keys(klasses).forEach(function (key) {
    var klass = klasses[key];
    base_class(klass);
  });
}
