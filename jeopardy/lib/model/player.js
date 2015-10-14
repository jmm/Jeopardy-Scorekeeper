import Model from 'jeopardy/lib/model/model';
var Super_Klass = Model;

export default Super_Klass.extend({
  defaults () {
    return {
      name: "",
      score: 0,
      has_control: false,
      live: true,
    };
  },
  // defaults

  initialize (attrs = {}) {
    if (attrs.id == null || ! String(attrs.id).length) {
      this.set('id', this.id = this.cid);
    }
  },
  // initialize

  /**
   * Retrieve a display name for the player.
   * If the player does not have a name set, a generic one will be generated.
   *
   * @return string
   */
  get_display_name () {
    return (
      this.get('name') ||

      "Contestant" + (
        this.collection ?
        " " + (this.collection.indexOf(this) + 1) :
        ""
      )
    );
  },
  // get_display_name

  /**
   * This method is to prevent an infinite loop since change of current player
   * can be initiated by setting `has_control` on the player or calling a
   * method on the game model, which in turn sets `has_control` on the player.
   * Maybe there's a better way.
   */
  set_has_control (has_control) {
    if (this.collection && has_control) {
      this.collection.set_current(this);
    }
    else this.set('has_control', has_control);
  },
  // set_has_control

  /**
   * Sum current score with `value`.
   * @param integer value Addend for current score.
   */
  update_score (value) {
    this.set('score', this.get('score') + this.sanitize_score(value));
  },
  // update_score

  /**
   * Sanitize and set score.
   * @param string score New score.
   */
  set_score (score) {
    this.set('score', this.sanitize_score(score));
  },
  // set_score

  /**
   * Sanitize score input to number.
   */
  sanitize_score (score) {
    if (typeof score === 'string') {
      score = score.replace(/[^0-9.-]/g, '');
    }

    score = Math.round(score);

    if (isNaN(score)) {
      score = 0;
    }
    // if

    return score;
  },
  // sanitize_score
});
