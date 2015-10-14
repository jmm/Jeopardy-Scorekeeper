This is a JS API for [Jeopardy](https://www.jeopardy.com/) games. It has no UI. It's designed to run in Node and standards-compliant browsers. It powers [JeopardyScoreKeeper.com](http://jeopardyscorekeeper.com/). See http://software.jessemccarthy.net/projects/jeopardy-scorekeeper.

Known issues:

* Currently relies on an implicitly global event bus, which prevents multiple instances from co-existing. This is a tricky problem to solve within current module systems.

* Needs to be generalized more to support both standard and DVR Jeopardy logic.
