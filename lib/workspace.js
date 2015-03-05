var Window = require('./window');
var merge = require('deepmerge');

var Workspace = function() {
  this.windows = [];

  this.element = document.createElement("div");
  this.element.className = "windowsill workspace";
  this.cursorX = 0;
  this.cursorY = 0;
  this.focusedWindow = null;
  this.element.addEventListener('mousemove', function(event) {
    var rect    = this.element.getBoundingClientRect();

    this.cursorX = event.clientX - rect.left;
    this.cursorY = event.clientY - rect.top;
  }.bind(this));
};

Workspace.prototype.addWindow = function(window) {
  this.windows.push(window);
  this.element.appendChild(window.element);
  this.focus(window);
};
Workspace.prototype.removeWindow = function(window) {
  this.windows.splice(this.windows.indexOf(window), 1);
  this.element.removeChild(window.element);
};
Workspace.prototype.createWindow = function(opts) {
  var defaultOpts = {
    x: this.element.clientWidth / 3,
    y: this.element.clientHeight / 3
  }
  opts = merge(defaultOpts, opts);
  var window = new Window(opts);
  this.addWindow(window);
  return window;
};

Workspace.prototype.focus = function(window) {
  if(this.focusedWindow) {
    this.focusedWindow.element.style.zIndex = 1;
  }
  this.focusedWindow = window;
  this.focusedWindow.element.style.zIndex = 2;
};

Workspace.prototype.getCursorQuadrant = function() {
  var thisRect = this.element.getBoundingClientRect();
  var slope = thisRect.height / thisRect.width;
  var potentialQuadrants = [
    ['left', 'bottom'],
    ['top', 'right']
  ];
  var corner;
  if(this.cursorY > slope * this.cursorX) {
    corner = potentialQuadrants[0];
  }
  else {
    corner = potentialQuadrants[1];
  }

  if(this.cursorY < -slope * this.cursorX + thisRect.height) {
    return corner[0];
  }
  else {
    return corner[1];
  }
};

module.exports = Workspace;
