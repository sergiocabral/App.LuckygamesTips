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

  get _getParent() {
    return document.querySelector(`div.${this._classKey}`);
  }

  dispose() {
    console.debug(`Disposing.`, this);
    this._interceptRequests(false);
    this._requestHistory.length = 0;
  }

  _getNativeFields() {
    const fields = {
      clientSeed: document.querySelector("#clientSeed")?.value,
      serverSeedHash: document.querySelector("#serverSeedHash")?.value,
      balance: parseFloat(document.querySelector("input[name=balance]")?.value),
      betAmount: parseFloat(document.querySelector("input[name=bet]")?.value),
    };
    console.debug(`Reading native fields.`, fields);
    return fields;
  }

  _setNativeFields(fields) {
    document.querySelector("#clientSeed").value = fields.clientSeed;
    document.querySelector("#serverSeedHash").value = fields.serverSeedHash;
    document.querySelector("input[name=balance]").value =
      fields.balance.toFixed(8);
    document.querySelector("input[name=bet]").value =
      fields.betAmount.toFixed(8);
    console.debug(`Setting native fields.`, fields);
    return fields;
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

            console.debug("HTTP Request", request);
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
      `Intercepting requests mode: ${
        window.originalXMLHttpRequest !== window.XMLHttpRequest
      }`
    );
  }

  _adjustInterface(enable = true) {
    console.debug(`Adjusting interface mode: ${enable}`);
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
      const width = 350;
      element = document.createElement("style");
      element.className = this._classKey;
      element.innerHTML = `
        ._LuckygamesTips, ._LuckygamesTips * {
          font-family: monospace;
          font-size: 12px;
        }

        ._LuckygamesTips {
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
          <label for="requestsPerMinute">Requests per Minute:</label>
          <input type="text" id="requestsPerMinute" readonly />
        </div>
      `;
      document.body.appendChild(element);
      element
        .querySelectorAll("input")
        .forEach((input) => input.setAttribute("autocomplete", "off"));
      this._adjustInterfaceForDrag(element);
      this._adjustInterfaceForInputNumber("#prediction", 0);
      this._adjustInterfaceForInputNumber("#initialAmount");
      this._adjustInterfaceForInputNumber("#lossMultiplier");
      this._adjustInterfaceForInputNumber("#winMultiplier");
      this._adjustInterfaceForInputNumber("#limitAmount");
      this._adjustInterfaceForStartButton("#runBot");
      console.debug(`Added element for custom fields.`, element);
    }
  }

  _getCustomFields() {
    const fields = {
      prediction: parseFloat(
        this._getParent.querySelector("#prediction").value
      ),
      initialAmount: parseFloat(
        this._getParent.querySelector("#initialAmount").value
      ),
      lossMultiplier: parseFloat(
        this._getParent.querySelector("#lossMultiplier").value
      ),
      winMultiplier: parseFloat(
        this._getParent.querySelector("#winMultiplier").value
      ),
      limitAmount: parseFloat(
        this._getParent.querySelector("#limitAmount").value
      ),
      requestsPerMinute: parseFloat(
        this._getParent.querySelector("#requestsPerMinute").value
      ),
    };
    console.debug(`Reading custom fields.`, fields);
    return fields;
  }

  _setCustomFields(fields) {
    this._getParent.querySelector("#prediction").value = fields.prediction;
    this._getParent.querySelector("#initialAmount").value =
      fields.initialAmount;
    this._getParent.querySelector("#lossMultiplier").value =
      fields.lossMultiplier;
    this._getParent.querySelector("#winMultiplier").value =
      fields.winMultiplier;
    this._getParent.querySelector("#limitAmount").value = fields.limitAmount;
    this._getParent.querySelector("#requestsPerMinute").value =
      fields.requestsPerMinute;
    console.debug(`Setting native fields.`, fields);
    return fields;
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

  _adjustInterfaceForInputNumber(element, digits = 8) {
    if (typeof element === "string") {
      element = this._getParent.querySelector(element);
    }

    element?.addEventListener("blur", function () {
      let value = parseFloat(element.value);
      if (!isNaN(value)) {
        element.value = value.toFixed(digits);
        if (element.value[0] !== "-") {
          element.value = `+${element.value}`;
        }
      } else {
        element.value = "";
      }
    });
  }

  _adjustInterfaceForStartButton(element) {
    if (typeof element === "string") {
      element = this._getParent.querySelector(element);
    }

    const _this = () => this;
    element?.addEventListener("click", function () {
      const parentElement = _this()._getParent;
      if (_this()._running) {
        _this()._interfaceFieldsLock(false);
        console.debug("Stopping the Bot.");
        this.innerHTML = "Start";
        parentElement.classList.remove("running");
        _this()._running = false;
      } else if (_this()._interfaceFieldsIsValid()) {
        _this()._interfaceFieldsLock(true);
        console.debug("Starting the Bot.");
        this.innerHTML = "Stop";
        parentElement.classList.add("running");
        _this()._running = true;
      }
    });
  }

  _interfaceFieldsIsValid() {
    const fields = this._getCustomFields();
    const isValid =
      fields.prediction >= 2 &&
      fields.prediction <= 98 &&
      fields.limitAmount > 0 &&
      fields.lossMultiplier > 0 &&
      fields.winMultiplier > 0 &&
      fields.limitAmount > 0;
    console.debug(`Checking if fields is valid: ${isValid}`);
    return isValid;
  }

  _interfaceFieldsLock(lock) {
    const fields = [
      "#prediction",
      "#initialAmount",
      "#lossMultiplier",
      "#winMultiplier",
      "#limitAmount",
    ];
    fields.forEach(fieldSelector => {
      const element = this._getParent.querySelector(fieldSelector);
      if (lock) {
        element.setAttribute("readonly", true);
      } else {
        element.removeAttribute("readonly");
      }
    })
    console.debug(`Locking fields mode: ${lock}`);
  }
}

new LuckygamesTips();
