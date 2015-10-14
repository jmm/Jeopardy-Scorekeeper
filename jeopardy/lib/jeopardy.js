import {init} from 'jeopardy/lib/init';
import Model_Game from 'jeopardy/lib/model/game';

export {default as event_publisher} from 'jeopardy/lib/event-publisher';

/**
 * Initialize state for new instance and return.
 * @param object cfg Configuration.
 * @return object Game instance.
 */
export default function (cfg = {}) {
  init();
  return new Model_Game(cfg);
}
