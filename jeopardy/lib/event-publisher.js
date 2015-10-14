export {event_publisher as default};

import _ from 'underscore';
import Backbone from 'backbone';

var event_publisher;

export function init () {
  event_publisher = _.clone(Backbone.Events);
}
