var running = false;

onmessage = function (event) {
  // doesn't matter what the message is, just toggle the worker
  if (running == false) {
    running = true;
    run();
  } else {
    running = false;
  }
};

function run() {
    for (var i = 0; i <= 10000000; i ++)
    	postMessage(i);
 
}
