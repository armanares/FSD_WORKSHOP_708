const EventEmitter  = require("events");
const event =  new EventEmitter();

event.on("greet",()=>{
  console.log("this is event emitter");
})
event.emit("greet");



class Button extends EventEmitter{
  
  click() {
    console.log("/n call button click event");
    threadId.emit("click")
  }
  mouseover() {
    console.log("/n call button maouseover event");
    this.emit("mouseover")
  }

}
