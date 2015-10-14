import _ from 'underscore';
import Backbone from 'backbone';
import event_publisher, {init as event_init} from 'jeopardy/lib/event-publisher';

var base_klass = {};

/**
 * Modify base classes (subclasses of Backbone).
 * For example, mix in properties to prototypes.
 */
export default function (klass) {
  base_klass.event_publisher = event_publisher;
  _.extend(klass.prototype, base_klass);
};

/**
 * Initialize application state.
 */
export function init () {
  event_init();
}
