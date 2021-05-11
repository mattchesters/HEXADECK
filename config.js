(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', event => {
    let connectButton = document.querySelector("#connect");
    let statusDisplay = document.querySelector('#status');
    let buttonOne = document.querySelector('#one');
    let buttonTwo = document.querySelector('#two');
    let buttonThree = document.querySelector('#three');
    let buttonFour = document.querySelector('#four');
    let buttonRotary = document.querySelector('#rotary');
    let port;

    function connect() {
      port.connect().then(() => {
        statusDisplay.textContent = '';
        connectButton.textContent = 'Disconnect';

        port.onReceive = data => {
          let textDecoder = new TextDecoder();
          console.log(textDecoder.decode(data));
        }
        port.onReceiveError = error => {
          console.error(error);
        };
      }, error => {
        statusDisplay.textContent = error;
      });
    }

    function onUpdate() {
      if (!port) {
        return;
      }

      let view = new Uint8Array(3);
      view[0] = string(buttonOne.value);
      view[1] = string(buttonTwo.value);
      view[2] = string(buttonThree.value);
      view[3] = string(buttonFour.value);
      view[4] = string(buttonRotary.value);
      port.send(view);
    };

    buttonOne.addEventListener('input', onUpdate);
    buttonTwo.addEventListener('input', onUpdate);
    buttonThree.addEventListener('input', onUpdate);

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
      if (ports.length == 0) {
        statusDisplay.textContent = 'HEXA DECK not found.';
      } else {
        statusDisplay.textContent = 'Connecting...';
        port = ports[0];
        connect();
      }
    });
  });
})();
