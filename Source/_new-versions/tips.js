class LuckygamesTips {
  _running = false;

  _requestHistory = [];

  constructor() {
    console.debug(`New instance.`, this);
    this._interceptRequests();
    this._adjustInterface();
  }

  get _classKey() {
    return `_${this.constructor.name}`;
  }

  dispose() {
    console.debug(`Disposing.`, this);
    this._interceptRequests(false);
    this._requestHistory.length = 0;
  }

  _interceptRequests(enable = true) {
    const requestHistory = this._requestHistory;

    const originalXMLHttpRequest = (window.originalXMLHttpRequest =
      window.originalXMLHttpRequest ?? window.XMLHttpRequest);

    window.XMLHttpRequest = !enable
      ? originalXMLHttpRequest
      : function () {
          const request = {};
          while (requestHistory.length >= 100) requestHistory.shift();
          requestHistory.push(request);

          const instance = new originalXMLHttpRequest(...Array.from(arguments));
          instance._request = request;

          instance.addEventListener("readystatechange", function () {
            if (this.readyState !== 4) return;

            request.responseURL = this.responseURL;
            request.status = this.status;
            request.statusText = this.statusText;
            request.responseType = this.responseType;
            request.response = this.response.toString();
            try {
              request.response = JSON.parse(request.response);
            } catch (o_O) {}
            try {
              request.headers = this.getAllResponseHeaders()
                .split("\n")
                .filter((line) => line);
            } catch (o_O) {
              request.headers = null;
            }

            console.log("request", this, request);
          });

          const originalOpen = instance.open;
          instance.open = function (method, url) {
            instance._request = {
              ...instance._request,
              method,
              url,
            };
            return originalOpen.apply(this, arguments);
          };

          const originalSend = instance.send;
          instance.send = function (body) {
            instance._request = {
              ...instance._request,
              body,
            };
            return originalSend.apply(this, arguments);
          };

          return instance;
        };

    console.debug(
      `Intercepting requests mode:`,
      window.originalXMLHttpRequest !== window.XMLHttpRequest
    );
  }

  _adjustInterface(enable = true) {
    console.debug(`Adjusting interface mode:`, enable);
    this._adjustInterfaceForStyle(enable);
    this._adjustInterfaceForElements(enable);
  }

  _adjustInterfaceForStyle(enable = true) {
    let element = document.querySelector(`style.${this._classKey}`);
    if (element) {
      element.remove();
      console.debug(`Removed element for style.`, element);
    }
    if (enable) {
      const width = 300;
      element = document.createElement("style");
      element.className = this._classKey;
      element.innerHTML = `
        ._LuckygamesTips {
          font-size: 12px;
          position: absolute;
          top: 1em;
          left: calc(${document.body.clientWidth - width}px - 5em);
          width: calc(${parseInt(width)}px + 4em);
          background-color: white;
          padding: 1em;
          border: 1px solid #ccc;
          z-index: 1000;
          display: flex;
          flex-direction: column;
        }

        ._LuckygamesTips > div {
          margin: 0.25em 0;
          display: flex;
        }

        ._LuckygamesTips > div > * {
          flex-grow: 1;
        }

        ._LuckygamesTips > div > label {
          display: inline-block;
          width: ${parseInt(width / 2)}px;
          text-align: right;
          margin-right: 1em;
        }

        ._LuckygamesTips > div > input {
          border: 1px solid #ccc;
        }

        ._LuckygamesTips > div > button {
          border: 1px solid #777;
          background-color: #b3dfb3;
        }

        ._LuckygamesTips.running > div > button {
          background-color: #dfb3b3;
        }
      `;
      document.head.appendChild(element);
      console.debug(`Added element for style.`, element);
    }
  }

  _adjustInterfaceForElements(enable = true) {
    let element = document.querySelector(`div.${this._classKey}`);
    if (element) {
      element.remove();
      console.debug(`Removed element for custom fields.`, element);
    }
    if (enable) {
      element = document.createElement("div");
      element.className = this._classKey;
      element.innerHTML = `
        <div>
          <label for="prediction">Prediction:</label>
          <input type="text" id="prediction" />
        </div>
        <div>
          <label for="initialAmount">Initial Amount:</label>
          <input type="text" id="initialAmount" />
        </div>
        <div>
          <label for="lossMultiplier">After Loss, Multiply by:</label>
          <input type="text" id="lossMultiplier" />
        </div>
        <div>
          <label for="winMultiplier">After Win, Multiply by:</label>
          <input type="text" id="winMultiplier" />
        </div>
        <div>
          <label for="limitAmount">Limit Amount to Quit:</label>
          <input type="text" id="limitAmount" />
        </div>
        <div>
          <button id="runBot">Start</button>
        </div>
        <div>
          <label for="limitAmount">Requests per Minute:</label>
          <input type="text" id="requestsPerMinute" readonly />
        </div>
      `;
      document.body.appendChild(element);
      this._adjustInterfaceForDrag(element);
      console.debug(`Added element for custom fields.`, element);
    }
  }

  _adjustInterfaceForDrag(element) {
    element.style.position = "absolute";
    let offsetX, offsetY;

    element.addEventListener("mousedown", function (e) {
      offsetX = e.clientX - element.getBoundingClientRect().left;
      offsetY = e.clientY - element.getBoundingClientRect().top;

      function mouseMoveHandler(e) {
        element.style.left = `${e.clientX - offsetX}px`;
        element.style.top = `${e.clientY - offsetY}px`;
      }

      function mouseUpHandler() {
        document.removeEventListener("mousemove", mouseMoveHandler);
        document.removeEventListener("mouseup", mouseUpHandler);
      }

      document.addEventListener("mousemove", mouseMoveHandler);
      document.addEventListener("mouseup", mouseUpHandler);
    });
  }
}

new LuckygamesTips();
