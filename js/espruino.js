/**
 Copyright 2014 Gordon Williams (gw@pur3.co.uk)

 This Source Code is subject to the terms of the Mozilla Public
 License, v2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
 
 ------------------------------------------------------------------
  Initialisation code
 ------------------------------------------------------------------
**/
"use strict";

var Espruino;

(function() {
  
  /** List of functions to call when an event happens */
  var eventHandlers = [];
  /** List of processors. These are functions that are called one
   * after the other with the data received from the last one.
   * 
   * Common processors are:
   * 
   *   transformForEspruino - transform code ready to be sent to Espruino
   **/  
  var processors = {};
  
  function init() {    
    // Initialise all modules
    
    function initModule(modName, mod) {      
      console.log("Initialising "+modName);
      if (mod.init !== undefined)
        Espruino.Core[module].init();
      if (mod.eventHandler !== undefined)
        eventHandlers.push(mod.eventHandler);
    }
    
    var module;
    for (module in Espruino.Core) initModule(module, Espruino.Core[module]);
    for (module in Espruino.Plugins) initModule(module, Espruino.Plugins[module]);
  }
  
  // workaround for broken chrome on Mac
  if (navigator.userAgent.indexOf("Mac OS X")>=0 &&
      navigator.userAgent.indexOf("Chrome/33.0.1750")>=0) {
    $(document).ready(function() { window.setTimeout(init,100); });
  } else {
    $(document).ready(init);
  }
  
  /** EVENTS:
   *  connected
   *  disconnected
   *  sending
   */
  function sendEvent(eventType) {
    for (var i in eventHandlers)
      eventHandlers[i](eventType);
  }
  
  /** Add a processor function of type function(data,callback) */
  function addProcessor(eventType, processor) {
    if (processors[eventType]===undefined)
      processors[eventType] = [];
    processors[eventType].push(processor);
  }
  
  /** Call a processor function */
  function callProcessor(eventType, data, callback) {
    var p = processors[eventType];
    // no processors
    if (p===undefined || p.length==0) {
      callback(data);
      return;
    }
    // now go through all processors
    var n = 0;
    var cb = function(inData) {
      if (n < p.length) {
        p[n++](inData, cb);
      } else {
        callback(inData);
      }        
    };
    cb(data);
  }  
  
  // -----------------------------------
  Espruino = { 
    Core : { }, 
    Plugins : { },
    sendEvent : sendEvent,
    addProcessor : addProcessor,
    callProcessor : callProcessor,
  };

})();


