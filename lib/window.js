var interact = require('interact.js');
var merge = require('deepmerge');
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var Window = function(opts) {
  this.opts = {
    x: 0,
    y: 0,
    width: 200,
    height: 100,
    elementType: "div",
    titleBar: "span",
    title: "",
    buttons: {
      minimize: "fa fa-minus",
      maximize: "fa fa-square-o",
      close: "fa fa-times"
    },
    dragOpts: {
      restrict: {
        restriction: ".windowsill.workspace",
        elementRect: {left: 0, right: 1, top: 0, bottom: 1}
      }
    },
    resizeOpts: {
      restrict: {
        restriction: ".windowsill.workspace"
      },
      /* enable resize from all edges except top
       * top edge doesn't work because the body doesn't go all the way to the top of the element*/
      edges: { top: false, left: true, right: true, bottom: true} 
    }
  };

  if(!opts) opts = {};
  this.opts = merge(this.opts, opts);
  this.createDomElement();

  this.move(this.opts.x, this.opts.y);

  this.resize(this.opts.width, this.opts.height);

  this.setTitle(this.opts.title);
};

util.inherits(Window, EventEmitter);

Window.prototype.createDomElement = function() {
  var element = document.createElement(this.opts.elementType);
  this.element = element;
  this.element.className = "windowsill window";

  this.element.addEventListener("click", function(event) {
    this.emit("click", event);
  }.bind(this));

  if(this.opts.titleBar) {
    var titleBar = document.createElement(this.opts.titleBar);
    var titleText = document.createElement("span");
    titleText.textContent = this.opts.title;
    titleBar.className = "windowsill titlebar";
    titleBar.appendChild(titleText);
    this.element.appendChild(titleBar);
    this.titleBarElement = titleBar;
    this.titleTextElement = titleText;
    if(this.opts.buttons) {
      this.buttonContainer = document.createElement("ul");
      this.buttonContainer.className = "windowsill buttonContainer";
      this.titleBarElement.appendChild(this.buttonContainer);
      for(var buttonName in this.opts.buttons) {
        this.addTitlebarButton(buttonName, this.opts.buttons[buttonName]);
      }
    }
    this.dragInteraction = 
      interact(this.element)
      .draggable(this.opts.dragOpts)
      .allowFrom(this.titleBarElement)
      .on("dragstart", function(event) {
        this.dragging = true;
        this.emit("dragstart", event);
      }.bind(this))
      .on("dragmove", function(event) {
        this.move(this.x + event.dx, this.y + event.dy);
        this.emit("dragmove", event);
      }.bind(this))
      .on("dragend", function(event) {
        this.dragging = false;
        this.emit("dragend", event);
      }.bind(this));
  }
  
  this.body = document.createElement("div");
  this.body.className = "windowsill body";
  this.element.appendChild(this.body);

  this.resizeInteraction =
    interact(this.body)
    .resizable(this.opts.resizeOpts)
    .on("resizestart", function(event) {
      this.resizing = true;
      this.emit("resizestart", event);
    }.bind(this))
    .on("resizemove", function(event) {
      var dRect = event.deltaRect;
      this.resize(this.width + dRect.width, this.height + dRect.height);
      /* add the left movement so that the window will move with the resize as one expects
       * not required for other directions because in the other directions it should remain
       * in place */
      this.move(this.x + dRect.left, this.y + dRect.top);
      this.emit("resizemove", event);
    }.bind(this))
    .on("resizeend", function(event) {
      this.resizing = false;
      this.emit("resizeend", event);
    }.bind(this));

  return this.element;
};

Window.prototype.addTitlebarButton = function(buttonName, buttonClass) {
  if(!buttonClass)
    return;
  var buttonElement = document.createElement("button");
  buttonElement.className = buttonName + " " + buttonClass;
  buttonElement.addEventListener("click", function() {
    this.emit(buttonName + "click");
  }.bind(this));
  this.buttonContainer.appendChild(buttonElement);
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
  if(this.titleTextElement) {
    this.titleTextElement.textContent = newTitle;
  }
  this.emit("titleChange", this.title, newTitle);
  this.title = newTitle;
};


module.exports = Window;
