var interact = require('interact.js');
var merge = require('deepmerge');
var Window = function(opts) {
  this.opts = {
    x: 0,
    y: 0,
    width: 200,
    height: 100,
    elementType: "div",
    titleBar: "span",
    title: "Window",
    dragOpts: {
      inertia: true,
      restrict: {restriction: ".windowsill.workspace"}
    },
    resizeOpts: {
    }
  };

  if(!opts) opts = {};
  merge(this.opts, opts);

  this.createDomElement();

  this.move(this.opts.x, this.opts.y);

  this.resize(this.opts.width, this.opts.height);

  this.setTitle(this.opts.title);
};

Window.prototype.createDomElement = function() {
  var element = document.createElement(this.opts.elementType);
  this.element = element;
  this.element.className = "windowsill window";

  if(this.opts.titleBar) {
    var titleBar = document.createElement(this.opts.titleBar);
    titleBar.innerHTML = this.opts.title;
    titleBar.className = "windowsill titlebar";
    this.element.appendChild(titleBar);
    this.titleBarElement = titleBar;
    interact(this.titleBarElement)
      .draggable(this.opts.dragOpts)
      .on("dragmove", function(event) {
        this.move(this.x + event.dx, this.y + event.dy);
      }.bind(this));
  }
  interact(this.element)
    .resizable(this.opts.resizeOpts)
    .on("resizemove", function(event) {
      this.resize(this.width + event.dx, this.height + event.dy);
    }.bind(this));

  return this.element;
};

Window.prototype.move = function(x, y) {
  this.x = x;
  this.y = y;
  this.element.style.transform = "translate(" + x + "px, " + y + "px)";
};

Window.prototype.resize = function(width, height) {
  this.width = width;
  this.height = height;
  this.element.style.width = width;
  this.element.style.height = height;
};

Window.prototype.setTitle = function(newTitle) {
  if(this.titleBarElement) {
    this.titleBarElement.innerHTML = newTitle;
  }
  this.title = newTitle;
};


module.exports = Window;
