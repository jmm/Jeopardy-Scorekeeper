/**
 * Test object for resemblance to a Backbone instance.
 */
export default function is_bb_obj (val) {
  return (
    val &&
    (typeof val) === 'object' &&
    (typeof val.listenTo) === 'function'
  );
}
// is_bb_obj
