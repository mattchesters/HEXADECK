(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', event => {
    let connectButton = document.querySelector("#connect");
    let statusDisplay = document.querySelector('#status');
    let saveButton = document.querySelector("#save");
    let port;

    let value1 = document.querySelector('#value1');
    let value2 = document.querySelector('#value2');
    let value3 = document.querySelector('#value3');
    let value4 = document.querySelector('#value4');
    let value5 = document.querySelector('#value5');

    function connect() {
      port.connect().then(() => {
        statusDisplay.textContent = '';
        connectButton.textContent = 'Disconnect';

        port.onReceive = data => {
          let textDecoder = new TextDecoder();
          console.log(textDecoder.decode(data));
          
        }
      });
    }

    saveButton.addEventListener('click', function() {
      var configArray = [ "newConfig",value1.value,value2.value,value3.value,value4.value,value5.value ];
      port.send(new TextEncoder('utf-8').encode(configArray));
      let textDecoder = new TextDecoder();
      
      port.onReceive = data => {
        let textDecoder = new TextDecoder();
        if ((textDecoder.decode(data)) == "y"){
          saveButton.textContent = 'Config Saved';
        } else {
          saveButton.textContent = 'Failed to saved';
        }
        
      }
    });

    function validateConfig() {
      
    }

    connectButton.addEventListener('click', function() {
      if (port) {
        port.disconnect();
        connectButton.textContent = 'Connect';
        statusDisplay.textContent = '';
        port = null;
      } else {
        serial.requestPort().then(selectedPort => {
          port = selectedPort;
          connect();
        }).catch(error => {
          statusDisplay.textContent = error;
        });
      }
    });

    serial.getPorts().then(ports => {
      if (ports.length === 0) {
        statusDisplay.textContent = 'DeftDeck not found.';
      } else {
        statusDisplay.textContent = 'Connecting...';
        port = ports[0];
        connect();
      }
    });


  });
})();
