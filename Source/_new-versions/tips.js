class LuckygamesTips {
  _requestHistory = [];

  constructor() {
    console.debug(`New instance.`, this);
    this._interceptRequests();
    this._adjustInterface();
  }

  dispose() {
    console.debug(`Disposing.`, this);
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
}

new LuckygamesTips();
