/**
 Copyright 2014 Gordon Williams (gw@pur3.co.uk)

 This Source Code is subject to the terms of the Mozilla Public
 License, v2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.

 ------------------------------------------------------------------
  Blockly blocks for Espruino
 ------------------------------------------------------------------
**/

// --------------------------------- Blockly init code - see /js/core/editorBlockly.js
window.onload = function() {
  var toolbox = document.getElementById('toolbox');
  // Remove any stuff we don't want from the toolbox...
  for (var i=0;i<toolbox.children.length;i++) {
    var enable_if = toolbox.children[i].attributes["enable_if"];
    if (enable_if) {
      var keep = false;
      if (window.location.search && window.location.search.indexOf("%7C"+enable_if.value+"%7C")>=0)
        keep = true;
      if (!keep) {
        toolbox.removeChild(toolbox.children[i]);
        i--;
      }
    }
  }
  // Set up blockly from toolbox
  Blockly.inject(document.body,{path: '', toolbox: toolbox});
  // Set up initial code
  Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, document.getElementById('blocklyInitial'));
  // Notify parent
  window.parent.blocklyLoaded(Blockly, window); // see core/editorBlockly.js
};

/* TODO: Looks like we could use Blockly.JavaScript.indentLines(code, Blockly.JavaScript.INDENT)
to properly sort out the padding of all this stuff */

// When we have JSON from the board, use it to
// update our list of available pins
Blockly.setBoardJSON = function(info) {
  console.log("Blockly.setBoardJSON ", info);
  if (!("pins" in info)) return;
  if (!("devices" in info)) return;
  PINS = [];
  var i,s;
  for (i=1;i<8;i++) {
    s = "LED"+i;
    if (s in info.devices) PINS.push([s,s]);
  }
  for (i=1;i<8;i++) {
    s = "BTN"+i;
    if (s in info.devices) PINS.push([s,s]);
  }
  for (i in info.pins)
    PINS.push([info.pins[i].name, info.pins[i].name]);


};
// ---------------------------------

var ESPRUINO_COL = 190;

var PORTS = ["A","B","C"];
var PINS = [
      ["LED1", 'LED1'],
      ["LED2", 'LED2'],
      ["LED3", 'LED3'],
      ["BTN1", 'BTN1']];
for (var p in PORTS)
  for (var i=0;i<16;i++) {
    var pinname = PORTS[p]+i;
    PINS.push([pinname,pinname]);
  }

Blockly.Blocks.espruino_delay = {
  category: 'Espruino',
  init: function() {
      this.appendValueInput('SECONDS')
          .setCheck('Number')
          .appendField(Blockly.Msg.ESPRUINO_WAIT);
      this.appendDummyInput()
          .appendField(Blockly.Msg.ESPRUINO_SECONDS);

    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(ESPRUINO_COL);
    this.setInputsInline(true);
    this.setTooltip(Blockly.Msg.ESPRUINO_WAIT_TOOLTIP);
  }
};
Blockly.Blocks.espruino_timeout = {
  category: 'Espruino',
  init: function() {
      this.appendValueInput('SECONDS')
          .setCheck('Number')
          .appendField(Blockly.Msg.ESPRUINO_AFTER);
      this.appendDummyInput()
          .appendField(Blockly.Msg.ESPRUINO_SECONDS);
      this.appendStatementInput('DO')
          .appendField(Blockly.Msg.CONTROLS_REPEAT_INPUT_DO);


    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(ESPRUINO_COL);
    this.setInputsInline(true);
    this.setTooltip(Blockly.Msg.ESPRUINO_AFTER_TOOLTIP);
  }
};
Blockly.Blocks.espruino_interval = {
  category: 'Espruino',
  init: function() {
      this.appendValueInput('SECONDS')
          .setCheck('Number')
          .appendField(Blockly.Msg.ESPRUINO_EVERY);
      this.appendDummyInput()
          .appendField(Blockly.Msg.ESPRUINO_SECONDS);
      this.appendStatementInput('DO')
           .appendField(Blockly.Msg.CONTROLS_REPEAT_INPUT_DO);

    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(ESPRUINO_COL);
    this.setInputsInline(true);
    this.setTooltip(Blockly.Msg.ESPRUINO_EVERY_TOOLTIP );
  }
};

Blockly.Blocks.espruino_pin = {
//      category: 'Espruino',
  init: function() {

    var start = 0;
    var incrementStep = 10;
    var originalPin = undefined;
    var listGen = function() {
      originalPin = this.value_;
      var list = PINS.slice(start, start+incrementStep);
      if (start>0) list.unshift([Blockly.Msg.ESPRUINO_BACK+"...", Blockly.Msg.ESPRUINO_BACK]);
      if (start+incrementStep<PINS.length) list.push([Blockly.Msg.ESPRUINO_MORE + '...', Blockly.Msg.ESPRUINO_MORE]);
      return list;
    };

    var pinSelector = new Blockly.FieldDropdown(listGen, function(selection){
      var ret = undefined;

      if (selection == Blockly.Msg.ESPRUINO_MORE || selection == Blockly.Msg.ESPRUINO_BACK) {
        if (selection == Blockly.Msg.ESPRUINO_MORE)
          start += incrementStep;
        else
          start -= incrementStep;

        var t = this;
        setTimeout(function(){t.showEditor_();},1);

        return originalPin;
      }
    });

    this.setColour(ESPRUINO_COL);
    this.setOutput(true, 'Pin');
    this.appendDummyInput().appendField(pinSelector, 'PIN');
    this.setTooltip(Blockly.Msg.ESPRUINO_PIN_NAME);
  },
};


Blockly.Blocks.espruino_watch = {
  category: 'Espruino',
  init: function() {
      this.appendValueInput('PIN')
          .setCheck('Pin')
          .appendField(Blockly.Msg.ESPRUINO_WATCH);
      this.appendDummyInput()
           .appendField(new Blockly.FieldDropdown(this.EDGES), 'EDGE').appendField('edge');;
      this.appendStatementInput('DO')
           .appendField(Blockly.Msg.CONTROLS_REPEAT_INPUT_DO);

    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(ESPRUINO_COL);
    this.setInputsInline(true);
    this.setTooltip(Blockly.Msg.ESPRUINO_WATCH_TOOLTIP);
  },
EDGES: [
["both", 'both'],
["rising", 'rising'],
["falling", 'falling']]
};


Blockly.Blocks.espruino_getTime = {
    category: 'Espruino',
    init: function() {
      this.appendDummyInput().appendField(Blockly.Msg.ESPRUINO_TIME);
      this.setOutput(true, 'Number');
      this.setColour(230/*Number*/);
      this.setInputsInline(true);
      this.setTooltip(Blockly.Msg.ESPRUINO_TIME_TOOLTIP);
    }
  };


Blockly.Blocks.espruino_digitalWrite = {
  category: 'Espruino',
  init: function() {
      this.appendValueInput('PIN')
          .setCheck('Pin')
          .appendField(Blockly.Msg.ESPRUINO_DIGITALWRITE);
      this.appendValueInput('VAL')
          .setCheck(['Number','Boolean'])
          .appendField(Blockly.Msg.ESPRUINO_VALUE);

    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(ESPRUINO_COL);
    this.setInputsInline(true);
    this.setTooltip(Blockly.Msg.ESPRUINO_DIGITALWRITE_TOOLTIP);
  }
};
Blockly.Blocks.espruino_digitalPulse = {
    category: 'Espruino',
    init: function() {
        this.appendValueInput('PIN')
            .setCheck('Pin')
            .appendField(Blockly.Msg.ESPRUINO_DIGITALPULSE);
        this.appendValueInput('VAL')
            .setCheck(['Boolean']);
        this.appendValueInput('TIME')
            .setCheck(['Number'])
            .appendField(Blockly.Msg.ESPRUINO_MILLISECONDS);

      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setColour(ESPRUINO_COL);
      this.setInputsInline(true);
      this.setTooltip(Blockly.Msg.ESPRUINO_DIGITALPULSE_TOOLTIP);
    }
  };
Blockly.Blocks.espruino_digitalRead = {
  category: 'Espruino',
  init: function() {
      this.appendValueInput('PIN')
          .setCheck('Pin')
          .appendField(Blockly.Msg.ESPRUINO_DIGITALREAD);

    this.setOutput(true, 'Boolean');
    this.setColour(ESPRUINO_COL);
    this.setInputsInline(true);
    this.setTooltip(Blockly.Msg.ESPRUINO_DIGITALREAD_TOOLTIP);
  }
};

Blockly.Blocks.espruino_analogWrite = {
    category: 'Espruino',
    init: function() {
        this.appendValueInput('PIN')
            .setCheck('Pin')
            .appendField(Blockly.Msg.ESPRUINO_ANALOGWRITE);
        this.appendValueInput('VAL')
            .setCheck(['Number','Boolean'])
            .appendField(Blockly.Msg.ESPRUINO_VALUE);

      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setColour(ESPRUINO_COL);
      this.setInputsInline(true);
      this.setTooltip(Blockly.Msg.ESPRUINO_ANALOGWRITE_TOOLTIP);
    }
  };
Blockly.Blocks.espruino_analogRead = {
    category: 'Espruino',
    init: function() {
        this.appendValueInput('PIN')
            .setCheck('Pin')
            .appendField(Blockly.Msg.ESPRUINO_ANALOGREAD);

      this.setOutput(true, 'Number');
      this.setColour(ESPRUINO_COL);
      this.setInputsInline(true);
      this.setTooltip(Blockly.Msg.ESPRUINO_ANALOGREAD_TOOLTIP);
    }
  };

Blockly.Blocks.espruino_code = {
    category: 'Espruino',
    init: function() {
      this.appendDummyInput().appendField(new Blockly.FieldTextArea("// Enter JavaScript Statements Here"),"CODE");

      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setColour(ESPRUINO_COL);
      this.setInputsInline(true);
      this.setTooltip(Blockly.Msg.ESPRUINO_JS_TOOLTIP);
    }
  };

  Blockly.Blocks.espruino_jsexpression = {
      category: 'Espruino',
      init: function() {
        this.appendDummyInput().appendField(new Blockly.FieldTextInput('"A JavaScript "+"Expression"'),"EXPR");
        this.setOutput(true, 'String');
        this.setColour(ESPRUINO_COL);
        this.setInputsInline(true);
        this.setTooltip(Blockly.Msg.ESPRUINO_JSEXPR_TOOLTIP);
      }
    };
// -----------------------------------------------------------------------------------
Blockly.Blocks.hw_servoMove = {
  category: 'Espruino',
  init: function() {
    this.appendValueInput('PIN')
        .setCheck('Pin')
        .appendField(Blockly.Msg.ESPRUINO_MOVE_SERVO);
    this.appendValueInput('VAL')
        .setCheck(['Number','Boolean'])
        .appendField(Blockly.Msg.ESPRUINO_TO);

    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(ESPRUINO_COL);
    this.setInputsInline(true);
    this.setTooltip(Blockly.Msg.ESPRUINO_MOVE_SERVO_TOOLTIP);
  }
};
Blockly.Blocks.hw_servoStop = {
  category: 'Espruino',
  init: function() {
    this.appendValueInput('PIN')
        .setCheck('Pin')
        .appendField(Blockly.Msg.ESPRUINO_STOP_SERVO);

    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(ESPRUINO_COL);
    this.setInputsInline(true);
    this.setTooltip(Blockly.Msg.ESPRUINO_STOP_SERVO_TOOLTIP);

  }
};
Blockly.Blocks.hw_ultrasonic = {
    category: 'Espruino',
    init: function() {
      this.appendValueInput('TRIG')
          .setCheck('Pin')
          .appendField(Blockly.Msg.ESPRUINO_ULTRASONIC_GET_TRIG);
      this.appendValueInput('ECHO')
          .setCheck('Pin')
          .appendField(Blockly.Msg.ESPRUINO_ULTRASONIC_ECHO);
      this.setOutput(true, 'Number');
      this.setColour(ESPRUINO_COL);
      this.setInputsInline(true);
      this.setTooltip(Blockly.Msg.ESPRUINO_ULTRASONIC_TOOLTIP);
    }
  };

// -----------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------

Blockly.JavaScript.text_print = function() {
  var argument0 = Blockly.JavaScript.valueToCode(this, 'TEXT',
      Blockly.JavaScript.ORDER_NONE) || '\'\'';
  return 'print(' + argument0 + ');\n';
};
Blockly.JavaScript.espruino_delay = function() {
  var seconds = Blockly.JavaScript.valueToCode(this, 'SECONDS',
      Blockly.JavaScript.ORDER_ASSIGNMENT) || '1';
  return "var t=getTime()+"+seconds+";while(getTime()<t);\n"
};
Blockly.JavaScript.espruino_timeout = function() {
  var seconds = Blockly.JavaScript.valueToCode(this, 'SECONDS',
      Blockly.JavaScript.ORDER_ASSIGNMENT) || '1';
  var branch = Blockly.JavaScript.statementToCode(this, 'DO');
  return "setTimeout(function() {\n"+branch+" }, "+seconds+"*1000.0);\n";
};
Blockly.JavaScript.espruino_getTime = function() {
  return ["getTime()\n", Blockly.JavaScript.ORDER_ATOMIC];
};
Blockly.JavaScript.espruino_interval = function() {
  var seconds = Blockly.JavaScript.valueToCode(this, 'SECONDS',
      Blockly.JavaScript.ORDER_ASSIGNMENT) || '1';
  var branch = Blockly.JavaScript.statementToCode(this, 'DO');
  return "setInterval(function() {\n"+branch+" }, "+seconds+"*1000.0);\n";
};
Blockly.JavaScript.espruino_pin = function() {
  var code = this.getTitleValue('PIN');
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};
Blockly.JavaScript.espruino_watch = function() {
  var pin = Blockly.JavaScript.valueToCode(this, 'PIN', Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
  var edge = this.getTitleValue('EDGE');
  var branch = Blockly.JavaScript.statementToCode(this, 'DO');
  var json = { repeat : true, edge : edge };
  if (pin=="BTN1") json.debounce = 10;
  return "setWatch(function() {\n"+branch+" }, "+pin+", "+JSON.stringify(json)+");\n";
};
Blockly.JavaScript.espruino_digitalWrite = function() {
  var pin = Blockly.JavaScript.valueToCode(this, 'PIN', Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
  var val = Blockly.JavaScript.valueToCode(this, 'VAL', Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
  return "digitalWrite("+pin+", "+val+");\n";
};
Blockly.JavaScript.espruino_digitalPulse = function() {
  var pin = Blockly.JavaScript.valueToCode(this, 'PIN', Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
  var val = Blockly.JavaScript.valueToCode(this, 'VAL', Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
  var tim = Blockly.JavaScript.valueToCode(this, 'TIME', Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
  return "digitalPulse("+pin+", "+val+", "+tim+");\n";
};
Blockly.JavaScript.espruino_digitalRead = function() {
  var pin = Blockly.JavaScript.valueToCode(this, 'PIN', Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
  return ["digitalRead("+pin+")\n", Blockly.JavaScript.ORDER_ATOMIC];
};
Blockly.JavaScript.espruino_analogWrite = function() {
  var pin = Blockly.JavaScript.valueToCode(this, 'PIN', Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
  var val = Blockly.JavaScript.valueToCode(this, 'VAL', Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
  return "analogWrite("+pin+", "+val+");\n";
};
Blockly.JavaScript.espruino_analogRead = function() {
  var pin = Blockly.JavaScript.valueToCode(this, 'PIN', Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
  return ["analogRead("+pin+")\n", Blockly.JavaScript.ORDER_ATOMIC];
};
Blockly.JavaScript.espruino_code = function() {
  var code = JSON.stringify(this.getFieldValue("CODE"));
  return "eval("+code+");\n";
};
Blockly.JavaScript.espruino_jsexpression = function() {
  var code = this.getFieldValue("EXPR");
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};
// -----------------------------------------------------------------------------------
Blockly.JavaScript.hw_servoMove = function() {
  var pin = Blockly.JavaScript.valueToCode(this, 'PIN', Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
  var val = Blockly.JavaScript.valueToCode(this, 'VAL', Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
  return "analogWrite("+pin+", (1.5+0.7*("+val+"))/20, {freq:50});\n";
};
Blockly.JavaScript.hw_servoStop = function() {
  var pin = Blockly.JavaScript.valueToCode(this, 'PIN', Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
  return "digitalWrite("+pin+", 0);\n";
};
Blockly.JavaScript.hw_ultrasonic = function() {
  var trig = Blockly.JavaScript.valueToCode(this, 'TRIG', Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
  var echo = Blockly.JavaScript.valueToCode(this, 'ECHO', Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
  var funcVar = "ultrasonic"+trig+echo;
  var distanceVar = "dist"+trig+echo;
  var watchVar = "isListening"+trig+echo;
  var functionName = Blockly.JavaScript.provideFunction_(
    funcVar,
    [ "function " + Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_ + "() {",
      "  if (!global."+distanceVar+") {",
      "    "+distanceVar+"=[0];",
      "    setWatch(",
      "      function(e) {",
      "        "+distanceVar+"="+distanceVar+".slice(-4);",
      "        "+distanceVar+".push((e.time-e.lastTime)*17544); },",
      "      "+echo+", {repeat:true, edge:'falling'});",
      "    setInterval(",
      "      function(e) { digitalPulse("+trig+", 1, 0.01/*10uS*/); }, 50);",
      "  }",
      "  var d = "+distanceVar+".slice(0).sort();",
      "  return d[d.length>>1];",
      "}"]);
  return [funcVar+"()", Blockly.JavaScript.ORDER_ATOMIC];
};
