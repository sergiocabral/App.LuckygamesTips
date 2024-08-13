String.prototype.replaceAll = function (search, replacement) {
  var target = this;
  return target.split(search).join(replacement);
};

window.fInitControles = function () {
  if (!window.vInitControles) {
    window.vInitControles = true;

    jQuery("body").append(
      '<div class="sjcsj" style="position: fixed; top: 10px; right: 30px; color: white; background-color: rgba(0, 0, 0, 0.5); padding: 5px 10px; z-index: 1000000;"></div>'
    );
    jQuery(".sjcsj").append(
      '<div class="titulo" style="text-align: center; cursor: pointer;">PATCH SJCSJ</div>'
    );
    jQuery(".sjcsj .titulo").click(function () {
      jQuery(".sjcsj > *:not(.titulo)").each(function (i, o) {
        jQuery(o).toggle();
      });
    });
    jQuery(".sjcsj").append(
      '<input style="width: 177px;" type="button" id="btnCore" value="fCore()" />'
    );
    jQuery(".sjcsj #btnCore").click(function () {
      fCore();
    });
    jQuery(".sjcsj").append("<hr />");

    jQuery(".sjcsj").append(
      '<input style="width: 82px;" type="button" id="testAudioAlarme" value="Alarme" />'
    );
    jQuery(".sjcsj").append(
      '<input style="width: 77px;" type="button" id="testAudioTick" value="Tick" />'
    );
    jQuery(".sjcsj").append(
      '<input style="-webkit-appearance: checkbox; margin-left: 5px;" type="checkbox" checked="checked" id="enableAudioTick" />'
    );
    jQuery(".sjcsj #testAudioAlarme").click(function () {
      fAlarme();
    });
    jQuery(".sjcsj #testAudioTick").click(function () {
      fTick();
      fAlertaVisual(false);
    });
    jQuery(".sjcsj").append("<hr />");

    jQuery(".sjcsj").append(
      '<input style="width: 177px;" type="button" id="ignorarValores" value="Ignorar valores" />'
    );
    jQuery(".sjcsj").append("<br />");
    jQuery(".sjcsj").append(
      '<div><span style="display: inline-block; width: 48px;">BTC:</span> <input style="width: 125px; text-align: right;" type="text" id="valBTC" value="0" /></div>'
    );
    jQuery(".sjcsj").append(
      '<div><span style="display: inline-block; width: 48px;">R$:</span> <input style="width: 125px; text-align: right;" type="text" id="valBRL" value="0" /></div>'
    );
    jQuery(".sjcsj #ignorarValores").click(function () {
      fAlarme(false);
      fAlertaVisual(false);
      setValBRLIgnorar(getValBRL());
      setValBTCIgnorar(getValBTC());
    });
    jQuery(".sjcsj").append("<hr />");

    jQuery(".sjcsj").append(
      '<div><input type="button" value="Sell" style="width: 48px;" id="btnSell" /> <input style="width: 125px; text-align: right;" type="text" id="alertaSell" value="" /></div>'
    );
    jQuery(".sjcsj #btnSell").click(function () {
      var val = getValSellAlerta();
      if (val == 9999999) {
        val = getValSell();
      } else {
        val *= 1.001;
      }
      val = setCasasDecimais(val);
      setValSellAlerta(val);
      fAlarme(false);
      fAlertaVisual(false);
    });
    jQuery(".sjcsj").append(
      '<div><input type="button" value="Buy" style="width: 48px;" id="btnBuy" /> <input style="width: 125px; text-align: right;" type="text" id="alertaBuy" value="" /></div>'
    );
    jQuery(".sjcsj #btnBuy").click(function () {
      var val = getValBuyAlerta();
      if (val == 0) {
        val = getValBuy();
      } else {
        val *= 0.999;
      }
      val = setCasasDecimais(val);
      setValBuyAlerta(val);
      fAlarme(false);
      fAlertaVisual(false);
    });
    jQuery(".sjcsj").append(
      '<div><input type="button" value="Reset" style="width: 177px;" id="btnReset" /></div>'
    );
    jQuery(".sjcsj #btnReset").click(function () {
      setValBuyAlerta(null);
      setValSellAlerta(null);
      fAlarme(false);
      fAlertaVisual(false);
    });
    jQuery(".sjcsj").append("<hr />");

    jQuery(".sjcsj").append(
      '<div><input type="button" value="Sell" style="width: 48px;" id="btnSell2" /> <input style="width: 125px; text-align: right;" type="text" id="alertaSell2" value="" /></div>'
    );
    jQuery(".sjcsj #btnSell2").click(function () {
      var val = getValSell2Alerta();
      if (val == 0) {
        val = getValSell();
      } else {
        val *= 0.999;
      }
      val = setCasasDecimais(val);
      setValSell2Alerta(val);
      fAlarme(false);
      fAlertaVisual(false);
    });
    jQuery(".sjcsj").append(
      '<div><input type="button" value="Buy" style="width: 48px;" id="btnBuy2" /> <input style="width: 125px; text-align: right;" type="text" id="alertaBuy2" value="" /></div>'
    );
    jQuery(".sjcsj #btnBuy2").click(function () {
      var val = getValBuy2Alerta();
      if (val == 9999999) {
        val = getValBuy();
      } else {
        val *= 1.001;
      }
      val = setCasasDecimais(val);
      setValBuy2Alerta(val);
      fAlarme(false);
      fAlertaVisual(false);
    });
    jQuery(".sjcsj").append(
      '<div><input type="button" value="Reset" style="width: 177px;" id="btnReset2" /></div>'
    );
    jQuery(".sjcsj #btnReset2").click(function () {
      setValBuy2Alerta(null);
      setValSell2Alerta(null);
      fAlarme(false);
      fAlertaVisual(false);
    });
    jQuery(".sjcsj").append("<hr />");
  }
};

window.fAlertaVisual = function (modo) {
  if (!window.vBkpAlertaVisual) {
    window.vBkpAlertaVisual = jQuery(".sjcsj").css("background-color");
  }
  if (modo) {
    jQuery(".sjcsj").css("background-color", "red");
  } else if (window.vBkpAlertaVisual) {
    jQuery(".sjcsj").css("background-color", window.vBkpAlertaVisual);
  }
};

window.setCasasDecimais = function (val, decimalPadrao) {
  if (decimalPadrao === undefined) {
    decimalPadrao = getCasasDecimais();
  }
  val = String(
    parseInt(val * Math.pow(10, decimalPadrao)) / Math.pow(10, decimalPadrao)
  );
  if (val.indexOf(".") < 0) {
    val += ".";
  }
  var decimalFaltou = decimalPadrao - (val.length - val.indexOf(".") - 1);
  while (decimalFaltou > 0) {
    val += "0";
    decimalFaltou--;
  }
  return val;
};

window.getCasasDecimais = function () {
  var exemplo = jQuery(
    ".block_sell_orders table tr:nth-child(1) td:nth-child(2)"
  )
    .text()
    .replaceAll(".", "")
    .replaceAll(",", ".");
  while (exemplo.indexOf(".") >= 0) {
    exemplo = exemplo.substr(1);
  }
  return exemplo.length;
};

window.getValBuy = function () {
  var val = jQuery(".block_buy_orders table tr:nth-child(1) td:nth-child(2)")
    .text()
    .replaceAll("R$", "")
    .replaceAll(" ", "")
    .replaceAll(".", "")
    .replaceAll(",", ".");
  val = parseFloat(val);
  return isNaN(val) ? 0 : val;
};

window.getValSell = function () {
  var val = jQuery(".block_sell_orders table tr:nth-child(1) td:nth-child(2)")
    .text()
    .replaceAll("R$", "")
    .replaceAll(" ", "")
    .replaceAll(".", "")
    .replaceAll(",", ".");
  val = parseFloat(val);
  return isNaN(val) ? 0 : val;
};

window.getValBuyAlerta = function () {
  var val = jQuery(".sjcsj #alertaBuy").val().replaceAll(",", ".");
  val = parseFloat(val);
  return isNaN(val) ? 0 : val;
};

window.getValSellAlerta = function () {
  var val = jQuery(".sjcsj #alertaSell").val().replaceAll(",", ".");
  val = parseFloat(val);
  return isNaN(val) ? 9999999 : val;
};

window.setValBuyAlerta = function (val) {
  jQuery(".sjcsj #alertaBuy").val(
    val == null ? "" : String(val).replaceAll(".", ",")
  );
};

window.setValSellAlerta = function (val) {
  jQuery(".sjcsj #alertaSell").val(
    val == null ? "" : String(val).replaceAll(".", ",")
  );
};

window.getValBuy2Alerta = function () {
  var val = jQuery(".sjcsj #alertaBuy2").val().replaceAll(",", ".");
  val = parseFloat(val);
  return isNaN(val) ? 9999999 : val;
};

window.getValSell2Alerta = function () {
  var val = jQuery(".sjcsj #alertaSell2").val().replaceAll(",", ".");
  val = parseFloat(val);
  return isNaN(val) ? 0 : val;
};

window.setValBuy2Alerta = function (val) {
  jQuery(".sjcsj #alertaBuy2").val(
    val == null ? "" : String(val).replaceAll(".", ",")
  );
};

window.setValSell2Alerta = function (val) {
  jQuery(".sjcsj #alertaSell2").val(
    val == null ? "" : String(val).replaceAll(".", ",")
  );
};

window.getVal = function (selector) {
  var jObj = jQuery(selector);
  var val =
    jObj.get(0) && jObj.get(0).tagName == "INPUT" ? jObj.val() : jObj.text();
  val = parseFloat(
    val
      .replaceAll("R$", "")
      .replaceAll(" ", "")
      .replaceAll(".", "")
      .replaceAll(",", ".")
  );
  return isNaN(val) ? 0 : val;
};

window.setVal = function (selector, val) {
  var jObj = jQuery(selector);
  val =
    val == parseFloat(val)
      ? String(val).replaceAll(".", ",")
      : String(
          parseFloat(val.replaceAll(".", "").replaceAll(",", "."))
        ).replaceAll(".", ",");
  if (jObj.get(0) && jObj.get(0).tagName == "INPUT") {
    jObj.val(val);
  } else {
    jObj.text(val);
  }
};

window.getValBRL = function () {
  return getVal(".sell_block_interior span");
};

window.getValBTC = function () {
  return getVal(".buy_block_interior span");
};

window.getValBRLIgnorar = function () {
  return getVal(".sjcsj #valBRL");
};

window.getValBTCIgnorar = function () {
  return getVal(".sjcsj #valBTC");
};

window.setValBRLIgnorar = function (val) {
  return setVal(".sjcsj #valBRL", val);
};

window.setValBTCIgnorar = function (val) {
  return setVal(".sjcsj #valBTC", val);
};

window.isLogado = function () {
  return !jQuery("header .btn[ng-click*='signIn']").is(":visible");
};

window.fEfetuarLogin = function () {
  var jBtnLogin = jQuery("header .btn[ng-click='signIn()']");
  if (jBtnLogin.is(":visible")) {
    jBtnLogin.click();
    setTimeout(function () {
      jQuery("input#email").val("sergio@cabral.br.com");
      jQuery("input#password").val("e2005SRc$");
      jQuery(".btn[ng-click='ok()']").click();
    }, 1000);
    return true;
  }
  return false;
};

window.getUrlParam = function (campo) {
  var regex = "(?<=" + campo + "=).*?(?=[#&])";
  var val = new RegExp("(?<=" + campo + "=).*?(?=[#&])").exec(location.href);
  return val ? val[0] : null;
};

window.fConfigParams = function () {
  if (!window.vConfigParams) {
    window.vConfigParams = true;

    setValBRLIgnorar(parseFloat(getUrlParam("vBRL")));
    setValBTCIgnorar(parseFloat(getUrlParam("vBTC")));
    setValBuyAlerta(getUrlParam("vBuy"));
    setValSellAlerta(getUrlParam("vSell"));
    setValBuy2Alerta(getUrlParam("vBuy2"));
    setValSell2Alerta(getUrlParam("vSell2"));
    isTick(getUrlParam("vIsTick"));
  }
};

window.fRecarregar = function (force) {
  window.vRecarregar = window.vRecarregar ? window.vRecarregar : 0;
  window.vRecarregar++;

  if (window.vRecarregar >= 40 || force) {
    window.onbeforeunload = null;
    location.href =
      "https://trader.flowbtc.com/app.html?sjcsj=" +
      Date.now() +
      "&vIsTick=" +
      isTick() +
      "&vBuy=" +
      getValBuyAlerta() +
      "&vSell=" +
      getValSellAlerta() +
      "&vBuy2=" +
      getValBuy2Alerta() +
      "&vSell2=" +
      getValSell2Alerta() +
      "&vBRL=" +
      getValBRLIgnorar() +
      "&vBTC=" +
      getValBTCIgnorar() +
      "#/trade";
    return true;
  }

  return false;
};

window.fAlarme = function (modo) {
  if (!window.vAudioAlarme) {
    window.vAudioAlarme = new Audio(
      "http://debug.splitz.com.br/notify_alarme.mp3"
    );
  }

  if (modo === true) {
    window.vAudioAlarme.play();
  } else if (modo === false) {
    window.vAudioAlarme.pause();
  } else if (window.vAudioAlarme.paused) {
    window.vAudioAlarme.play();
  } else {
    window.vAudioAlarme.pause();
  }
};

window.fTick = function () {
  if (!window.vAudioTick) {
    window.vAudioTick = new Audio(
      "http://debug.splitz.com.br/notify_intervalo_flowbtc.mp3"
    );
  }

  window.vAudioTick.volume = 0.1;
  if (isTick()) {
    window.vAudioTick.play();
  }
};

window.isTick = function (modo) {
  if (modo && modo != "false") {
    jQuery(".sjcsj #enableAudioTick").prop("checked", true);
  } else if (modo != undefined) {
    jQuery(".sjcsj #enableAudioTick").prop("checked", false);
  }
  return Boolean(jQuery(".sjcsj #enableAudioTick").is(":checked"));
};

window.isTrade = function () {
  return this.location.href.indexOf("#/trade") >= 0;
};

window.fCore = function () {
  fInitControles();
  fConfigParams();

  if (isLogado() && isTrade() && window.vLoops >= 1) {
    fRecarregar();

    if (
      (getValBuy() > 0 &&
        getValSell() > 0 &&
        (getValBuy() <= getValBuyAlerta() ||
          getValSell() >= getValSellAlerta())) ||
      (getValBuy() > 0 &&
        getValSell() > 0 &&
        (getValBuy() >= getValBuy2Alerta() ||
          getValSell() <= getValSell2Alerta())) ||
      getValBRL() != getValBRLIgnorar() ||
      getValBTC() != getValBTCIgnorar()
    ) {
      fTick();
      fAlarme();
      fAlertaVisual(true);
    } else {
      fTick();
    }
  }

  window.vLoops = window.vLoops ? window.vLoops++ : 1;

  if (!window.vCoreInterval) {
    window.vCoreInterval = setInterval(fCore, 30000);
    return;
  }

  fEfetuarLogin();
};

fCore();
