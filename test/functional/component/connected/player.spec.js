"use strict";

var Component = require("app/component/connected/player");
var createStore = require("app/store/game");
var React = require("react");
var ReactTestUtils = require("react-addons-test-utils");
var test = require("tape");

var suiteDesc = "functional/component/connected/player : ";
var desc;

function createTestStore () {
  var store = createStore();
  ensurePlayer(store);
  return store;
}

function ensurePlayer (store) {
  if (!store.getState().players.length) {
    store.dispatch({
      type: "ADD_PLAYERS",
      payload: {
        players: [
          {score: 0},
          {score: 0},
        ]
      }
    });
  }
}

desc = suiteDesc + "updates score";
test(desc, function (t) {
  var store = createTestStore();

  var index = 0;

  var componentNode;

  ReactTestUtils.renderIntoDocument(
    <div ref={ref => componentNode = ref}>
      <Component store={store} index={index} />
    </div>
  );

  function getScoreEl () {
    return componentNode.children[0].querySelector(".score input");
  }

  t.equal(
    Number(getScoreEl().value),
    0,
    "Score should be initialized to 0"
  );

  var newScore = 1234;
  getScoreEl().value = String(newScore);
  ReactTestUtils.Simulate.change(getScoreEl());

  t.equal(
    Number(getScoreEl().value),
    newScore,
    "Score should be updated in document"
  );

  t.equal(
    Number(getScoreEl().value),
    store.getState().players[index].score,
    "Score should be updated in store"
  );

  t.end();
});

desc = suiteDesc + "updates name";
test(desc, function (t) {
  var store = createTestStore();

  var componentNode;

  var index = 0;

  ReactTestUtils.renderIntoDocument(
    <div ref={ref => componentNode = ref}>
      <Component store={store} index={index} />
    </div>
  );

  function getNameEl () {
    return componentNode.children[0].querySelector(".name input");
  }

  var newName = "Howdy Doody";
  getNameEl().value = newName;

  ReactTestUtils.Simulate.change(getNameEl());

  t.equal(
    getNameEl().value,
    newName,
    "Name should be updated in document"
  );

  t.equal(
    getNameEl().value,
    store.getState().players[index].name,
    "Name should be updated in store"
  );

  t.end();
});

desc = suiteDesc + "updates current player";
test(desc, function (t) {
  var store = createTestStore();

  var componentNode;

  var index = 0;

  ReactTestUtils.renderIntoDocument(
    <div ref={ref => componentNode = ref}>
      <Component store={store} index={index} />
    </div>
  );

  // Make sure current player is null
  store.dispatch({
    type: "SET_CURRENT_PLAYER",
    payload: {
      index: null,
    }
  });

  t.equal(
    store.getState().current_player,
    null,
    "Current player is null in store"
  );

  t.ok(
    !componentNode.children[index].classList.contains("has-control"),
    "Player doesn't have control in the document"
  );

  ReactTestUtils.Simulate.click(
    componentNode.children[index].querySelector(".set-has-control a")
  );

  t.equal(
    store.getState().current_player,
    index,
    "Player is current in the store"
  );

  t.ok(
    componentNode.children[index].classList.contains("has-control"),
    "Player has control in the document"
  );

  t.end();
});

desc = suiteDesc + "deletes player";
test(desc, function (t) {
  var store = createTestStore();

  var componentNode;

  var index = 0;
  var state = store.getState();

  ReactTestUtils.renderIntoDocument(
    <div ref={ref => componentNode = ref}>
      <Component store={store} index={index} />
    </div>
  );

  ReactTestUtils.Simulate.click(
    componentNode.children[index].querySelector(".delete a")
  );

  t.equal(
    store.getState().players.length,
    state.players.length - 1,
    "A player was deleted from the store"
  );

  t.equal(
    componentNode.children.length,
    state.players.length - 1,
    "A player was deleted from the document"
  );

  t.notEqual(
    store.getState().players[index],
    state.players[index],
    "Correct player was deleted from store"
  );

  t.end();
});
