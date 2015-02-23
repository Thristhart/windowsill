var Window = require('./window');

var Workspace = function() {
  this.windows = [];

  this.element = document.createElement("div");
  this.element.className = "windowsill workspace";
};

Workspace.prototype.addWindow = function(window) {
  this.windows.push(window);
  this.element.appendChild(window.element);
};
Workspace.prototype.removeWindow = function(window) {
  this.windows.splice(this.windows.indexOf(window), 1);
  this.element.removeChild(window.element);
};
Workspace.prototype.createWindow = function(opts) {
  var window = new Window(opts);
  this.addWindow(window);
  return window;
};

module.exports = Workspace;
