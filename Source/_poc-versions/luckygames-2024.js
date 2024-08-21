class LuckygamesTips {
  _running = false;

  _requestHistory = [];

  _betState = {};

  _captured = {
    clientSeed: undefined,
    serverSeedHash: undefined,
    paymentMethod: undefined,
    token: undefined,
  };

  _statistics = {
    startedTime: 0,
    requestsCount: 0,
    requestsPerMinute: 0,
    requestError: 0,
    maxBet: 0,
    minBalance: -1,
  };

  _betRequestTimeout;

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
      balance: parseFloat(document.querySelector("input[name=balance]")?.value),
      betAmount: parseFloat(document.querySelector("input[name=bet]")?.value),
    };
    console.debug(`Reading native fields.`, fields);
    return fields;
  }

  _setNativeFields(fields) {
    if (fields.balance !== undefined) {
      document.querySelector("input[name=balance]").value = parseFloat(
        fields.balance
      ).toFixed(8);
    }
    if (fields.betAmount !== undefined) {
      document.querySelector("input[name=bet]").value = parseFloat(
        fields.betAmount
      ).toFixed(8);
    }
    console.debug(`Setting native fields.`, fields);
    return fields;
  }

  _interceptRequests(enable = true) {
    const _this = () => this;

    const originalXMLHttpRequest = (window.originalXMLHttpRequest =
      window.originalXMLHttpRequest ?? window.XMLHttpRequest);

    window.XMLHttpRequest = !enable
      ? originalXMLHttpRequest
      : function () {
          const request = {};
          while (_this()._requestHistory.length >= 100)
            _this()._requestHistory.shift();
          _this()._requestHistory.push(request);

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
              request.responseHeaders = {};
              this.getAllResponseHeaders()
                .split(/\n|\r/)
                .filter((line) => line)
                .forEach((header) => {
                  const divider = header.indexOf(":");
                  const name = header.substring(0, divider);
                  const value = header.substring(divider + 2);
                  request.responseHeaders[name] = value;
                });
            } catch (o_O) {
              request.responseHeaders = null;
            }

            console.debug("HTTP Request done.", request);

            _this()._response(request);
          });

          const originalOpen = instance.open;
          instance.open = function (method, url) {
            request.method = method;
            request.url = url;
            return originalOpen.apply(this, arguments);
          };

          const originalSetRequestHeader = instance.setRequestHeader;
          instance.setRequestHeader = function (header, value) {
            request.requestHeaders = request.requestHeaders ?? {};
            request.requestHeaders[header] = value;
            if (header === "Authorization") {
              _this()._captured.token = value;
            }
            return originalSetRequestHeader.apply(this, arguments);
          };

          const originalSend = instance.send;
          instance.send = function (body) {
            try {
              request.body = JSON.parse(body);
            } catch (o_O) {
              request.body = body;
            }
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
          <input type="text" id="prediction" value="-50" />
        </div>
        <div>
          <label for="initialAmount">Initial Amount:</label>
          <input type="text" id="initialAmount" value="+0.00000001" />
        </div>
        <div>
          <label for="lossMultiplier">After Loss, Multiply by:</label>
          <input type="text" id="lossMultiplier" value="+2.00" />
        </div>
        <div>
          <label for="winMultiplier">After Win, Multiply by:</label>
          <input type="text" id="winMultiplier" value="+2.00" />
        </div>
        <div>
          <label for="limitSequence">Limit Sequence to Reset:</label>
          <input type="text" id="limitSequence" value="+5" />
        </div>
        <div>
          <label for="limitBalance">Limit Balance (%):</label>
          <input type="text" id="limitBalance" value="+90" />
        </div>
        <div>
          <button id="runBot">Start</button>
        </div>
        <div>
          <label for="maxBet">Max Bet:</label>
          <input type="text" id="maxBet" readonly />
        </div>
        <div>
          <label for="minBalance">Minimum Balance:</label>
          <input type="text" id="minBalance" readonly />
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
      this._adjustInterfaceForInputNumber("#lossMultiplier", 2);
      this._adjustInterfaceForInputNumber("#winMultiplier", 2);
      this._adjustInterfaceForInputNumber("#limitSequence");
      this._adjustInterfaceForInputNumber("#limitBalance");
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
      limitSequence: parseFloat(
        this._getParent.querySelector("#limitSequence").value
      ),
      limitBalance: parseFloat(
        this._getParent.querySelector("#limitBalance").value
      ),
      maxBet: parseFloat(
        this._getParent.querySelector("#maxBet").value
      ),
      minBalance: parseFloat(
        this._getParent.querySelector("#minBalance").value
      ),
      requestsPerMinute: parseFloat(
        this._getParent.querySelector("#requestsPerMinute").value
      ),
    };
    console.debug(`Reading custom fields.`, fields);
    return fields;
  }

  _setCustomFields(fields) {
    if (fields.prediction !== undefined) {
      this._getParent.querySelector("#prediction").value = parseFloat(
        fields.prediction
      ).toFixed(0);
    }
    if (fields.initialAmount !== undefined) {
      this._getParent.querySelector("#initialAmount").value = parseFloat(
        fields.initialAmount
      ).toFixed(8);
    }
    if (fields.lossMultiplier !== undefined) {
      this._getParent.querySelector("#lossMultiplier").value = parseFloat(
        fields.lossMultiplier
      ).toFixed(2);
    }
    if (fields.winMultiplier !== undefined) {
      this._getParent.querySelector("#winMultiplier").value = parseFloat(
        fields.winMultiplier
      ).toFixed(2);
    }
    if (fields.limitSequence !== undefined) {
      this._getParent.querySelector("#limitSequence").value = isNaN(
        fields.limitSequence
      )
        ? ""
        : parseFloat(fields.limitSequence).toFixed(8);
    }
    if (fields.limitBalance !== undefined) {
      this._getParent.querySelector("#limitBalance").value = isNaN(
        fields.limitBalance
      )
        ? ""
        : parseFloat(fields.limitBalance).toFixed(8);
    }
    if (fields.maxBet !== undefined) {
      this._getParent.querySelector("#maxBet").value = isNaN(
        fields.maxBet
      )
        ? ""
        : parseFloat(fields.maxBet).toFixed(8);
    }
    if (fields.minBalance !== undefined) {
      this._getParent.querySelector("#minBalance").value = isNaN(
        fields.minBalance
      )
        ? ""
        : parseFloat(fields.minBalance).toFixed(8);
    }
    if (fields.requestsPerMinute !== undefined) {
      this._getParent.querySelector("#requestsPerMinute").value = isNaN(
        fields.requestsPerMinute
      )
        ? ""
        : parseFloat(fields.requestsPerMinute).toFixed(2);
    }
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
        delete _this()._betState.fields;
        console.debug(`_betRequest() #2`);
        if (!_this()._betRequest()) {
          console.debug("Rollback the Bot.");
          this.click();
        } else {
          _this()._statistics = {
            startedTime: Date.now(),
            requestsCount: 0,
            maxBet: 0,
            minBalance: -1,
          };
        }
      }
    });
  }

  _interfaceFieldsIsValid() {
    const fields = this._getCustomFields();
    const isValid =
      Math.abs(fields.prediction) >= 2 &&
      Math.abs(fields.prediction) <= 98 &&
      fields.initialAmount >= 0.00000001 &&
      fields.lossMultiplier > 0 &&
      fields.winMultiplier > 0 &&
      (isNaN(fields.limitSequence) || fields.limitSequence > 0) &&
      (isNaN(fields.limitBalance) || fields.limitBalance > 0);
    console.debug(`Checking if fields is valid: ${isValid}`);
    if (!isValid) {
      alert("Invalid fields.");
    }
    return isValid;
  }

  _interfaceFieldsLock(lock) {
    const fields = [
      "#prediction",
      "#initialAmount",
      "#lossMultiplier",
      "#winMultiplier",
      "#limitSequence",
      "#limitBalance",
    ];
    fields.forEach((fieldSelector) => {
      const element = this._getParent.querySelector(fieldSelector);
      if (lock) {
        element.setAttribute("readonly", true);
      } else {
        element.removeAttribute("readonly");
      }
    });
    console.debug(`Locking fields mode: ${lock}`);
  }

  _response(data) {
    if (data?.body?.paymentMethod !== undefined) {
      this._captured.clientSeed =
        this._captured.clientSeed ?? data.body.clientSeed;
      this._captured.serverSeedHash =
        this._captured.serverSeedHash ?? data.body.serverSeedHash;
      this._captured.paymentMethod = data.body.paymentMethod;
      console.debug(
        `Payment method and others captured: ${this._captured.paymentMethod}`,
        this._captured
      );
      if (data.url.includes("/dices")) {
        if (data.status >= 400) {
          console.error("Bet request error. Stopping bot.", data);
          this._betResponse(undefined, undefined);
        } else {
          this._betResponse(data.response, data.body);
        }
      }
    } else if (data.url) {
      const paymentMethodRegex = /paymentMethod=(\d+)/;
      const paymentMethodMatch = data.url.match(paymentMethodRegex);
      if (paymentMethodMatch?.length > 0 && isFinite(paymentMethodMatch[1])) {
        this._captured.paymentMethod = parseFloat(paymentMethodMatch[1]);
        console.debug(
          `Payment method captured: ${this._captured.paymentMethod}`
        );
      }
    }
  }

  _betRequest() {
    if (!this._running) {
      return false;
    }
    if (
      this._captured.clientSeed === undefined ||
      this._captured.serverSeedHash === undefined ||
      this._captured.paymentMethod === undefined ||
      this._captured.token === undefined
    ) {
      alert("Cannot find the payment method and others params. Do one bet.");
      console.debug(`Missing params.`, this._captured);
      return false;
    }
    if (!this._betState.fields) {
      this._betState.fields = {
        native: this._getNativeFields(),
        custom: this._getCustomFields(),
        consoleLog: console.info,
      };
    }
    this._betState.balance =
      this._betState.balance ?? this._betState.fields.native.balance;
    this._betState.amount =
      this._betState.amount ?? this._betState.fields.custom.initialAmount;


    if (this._betState.limitBalance === undefined && this._betState.fields.custom.limitBalance !== undefined) {
      this._betState.limitBalance = this._betState.balance * (this._betState.fields.custom.limitBalance / 100)
    } else {
      this._betState.limitBalance = undefined
    }

    if (this._betState.limitBalance !== undefined) {
      if (this._betState.balance - this._betState.amount < this._betState.limitBalance) {
        console.info(`LIMIT BALANCE!`)
        this._betState.amount = this._betState.fields.custom.initialAmount
      }
    }

    this._betState.fields.consoleLog(
      `[${this._betState.balance.toFixed(
        8
      )}] Bet: ${this._betState.amount.toFixed(8)}`
    );
    this._betState.request = {
      bet: this._betState.amount.toFixed(8),
      clientSeed: this._captured.clientSeed,
      isActiveStatistic: true,
      paymentMethod: this._captured.paymentMethod,
      serverSeedHash: this._captured.serverSeedHash,
      sign: this._betState.fields.custom.prediction > 0 ? 0 : 1,
      suggestedNumbers: Math.abs(
        this._betState.fields.custom.prediction
      ).toFixed(0),
    };
    this._setNativeFields({
      betAmount: this._betState.request.bet,
    });
    this._sendRequest(this._betState.request, this._captured.token);
    return true;
  }

  _betResponse(response, request) {
    clearTimeout(this._betRequestTimeout);
    this._betRequestTimeout = setTimeout(() => {
      console.info(`Ops! The response never came back. Trying again.`);
      console.debug(`_betRequest() #1`);
      this._betRequest();
    }, 120000);

    if (!response) {
      if (++this._statistics.requestError <= 3) {
        console.debug(`_betRequest() #3`);
        setTimeout(() => this._betRequest(), 5000);
        console.debug(`Request error: ${this._statistics.requestError}. Waiting...`);
      } else {
        console.debug(`Multiple request errors: ${this._statistics.requestError}. Bot stopped.`);
        this._running = false;
      }
      return;
    }
    this._statistics.requestError = 0;

    console.debug(`Updating fields from response`);

    if (this._running) {
      const maxBet = parseFloat(request.bet)
      if (maxBet > this._statistics.maxBet) {
        this._statistics.maxBet = maxBet;
      }
      const minBalance = parseFloat(response.balance)
      if (this._statistics.minBalance < 0 || minBalance < this._statistics.minBalance) {
        this._statistics.minBalance = minBalance;
      }
      this._statistics.requestsCount++;
      this._statistics.requestsPerMinute =
        this._statistics.requestsCount /
        ((Date.now() - this._statistics.startedTime) / 1000 / 60);

      this._setNativeFields({
        balance: response.balance,
      });
      this._setCustomFields({
        maxBet: this._statistics.maxBet,
        minBalance: this._statistics.minBalance,
        requestsPerMinute: this._statistics.requestsPerMinute,
      });

      this._betState.swap =
        this._betState.lastBetWin === undefined ||
        (this._betState.lastBetWin && response.lose > 0) ||
        (!this._betState.lastBetWin && response.win > 0) ||
        this._betState.sequence >= this._betState.fields.custom.limitSequence;

      const isLimitSequence = this._betState.sequence >= this._betState.fields.custom.limitSequence;
      if (isLimitSequence) {
        this._betState.fields.consoleLog(`LIMIT SEQUENCE!`);
        if (!this._betState.lastBetWin && response.lose > 0) {
          // TODO: Este bloqueio impede zerar o saldo, mas com ele o saldo não sobe.
          // this._betState.amount = this._betState.fields.custom.initialAmount / this._betState.fields.custom.lossMultiplier;
        }
      }

      this._betState.lastBetWin = response.win > 0;
      this._betState.fields.consoleLog = this._betState.lastBetWin
        ? console.info
        : console.warn;

        this._betState.balance = !isNaN(response.balance) ? parseFloat(response.balance) : this._betState.balance;

      if (this._betState.swap) {
        if (this._betState.lastBetWin) {
          this._betState.amount = this._betState.fields.custom.initialAmount;
          this._betState.limitBalance = undefined;
        }
        this._betState.sequence = 1;
        this._betState.fields.consoleLog(
          `[${parseFloat(this._betState.balance).toFixed(8)}] Swap to ${
            response.win > 0 ? "WIN" : "LOSE"
          }`
        );
      } else {
        this._betState.sequence++;
      }

      if (this._betState.sequence > 1 || !this._betState.lastBetWin) {
        if (response.win > 0) {
          this._betState.amount *= this._betState.fields.custom.winMultiplier;
          this._betState.fields.consoleLog(
            `[${parseFloat(this._betState.balance).toFixed(8)}] Sequence ${
              this._betState.sequence
            } WIN. Multiply x${this._betState.fields.custom.winMultiplier.toFixed(
              2
            )}: ${this._betState.amount.toFixed(8)}`
          );
        } else if (response.lose > 0) {
          this._betState.amount *= this._betState.fields.custom.lossMultiplier;
          this._betState.fields.consoleLog(
            `[${parseFloat(this._betState.balance).toFixed(8)}] Sequence ${
              this._betState.sequence
            } LOSE. Multiply x${this._betState.fields.custom.lossMultiplier.toFixed(
              2
            )}: ${this._betState.amount.toFixed(8)}`
          );
        }
      }

      console.debug(`_betRequest() #4`);
      this._betRequest();
    }
  }

  _sendRequest(body, token) {
    console.debug(`Sending a bet`);

    const xhr = new XMLHttpRequest();
    const url = "/api/dices";

    xhr.open("POST", url, true);

    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Authorization", token);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send(JSON.stringify(body));
  }
}

new LuckygamesTips();
