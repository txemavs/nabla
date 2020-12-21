//    "./extra/jshint",


// Lint not working, using global scripts instead

define([
    "./codemirror",
    "./extra/htmlhint",
    "./extra/beautify",
    "./extra/beautify-html",
    "./mode/javascript/javascript",
    "./mode/xml/xml",
    "./mode/htmlembedded/htmlembedded",
    "./mode/htmlmixed/htmlmixed",
    "./addon/lint/lint",
    "./addon/lint/javascript-lint",
    "./addon/hint/javascript-hint",
    "./addon/lint/html-lint",
    "./addon/hint/html-hint",
  "./addon/fold/foldcode",
  ], function (codemirror) {
    console.log("Loading CODEMIRROR ---------------------------");
  return codemirror;
 });