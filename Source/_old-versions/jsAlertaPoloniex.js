String.prototype.replaceAll = function (search, replacement) {
  var target = this;
  return target.split(search).join(replacement);
};

window.fInitControles = function () {
  if (!window.vInitControles) {
    window.vInitControles = true;

    jQuery("body").append(
      '<div class="sjcsj" style="position: fixed; bottom: 10px; right: 10px; color: black; background-color: rgba(0, 255, 255, 0.3); padding: 5px 10px; z-index: 1000000;"></div>'
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
      '<input style="margin-left: 5px;" type="checkbox" checked="checked" id="enableAudioTick" />'
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
      '<div><span style="display: inline-block; width: 45px;"><span class="labelMoeda1">$1</span>:</span> <input style="width: 119px; text-align: right;" type="text" id="valMoeda1" value="0" /></div>'
    );
    jQuery(".sjcsj").append(
      '<div><span style="display: inline-block; width: 45px;"><span class="labelMoeda2">$2</span>:</span> <input style="width: 119px; text-align: right;" type="text" id="valMoeda2" value="0" /></div>'
    );
    jQuery(".sjcsj #ignorarValores").click(function () {
      fAlarme(false);
      fAlertaVisual(false);
      setValMoeda1Ignorar(getValMoeda1());
      setValMoeda2Ignorar(getValMoeda2());
    });
    jQuery(".sjcsj").append("<hr />");

    jQuery(".sjcsj").append(
      '<div><input type="button" value="Sell" style="width: 39px;" id="btnSell" /> <input style="width: 125px; text-align: right;" type="text" id="alertaSell" value="" /></div>'
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
      '<div><input type="button" value="Buy" style="width: 39px;" id="btnBuy" /> <input style="width: 125px; text-align: right;" type="text" id="alertaBuy" value="" /></div>'
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
      '<div><input type="button" value="Sell" style="width: 39px;" id="btnSell2" /> <input style="width: 125px; text-align: right;" type="text" id="alertaSell2" value="" /></div>'
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
      '<div><input type="button" value="Buy" style="width: 39px;" id="btnBuy2" /> <input style="width: 125px; text-align: right;" type="text" id="alertaBuy2" value="" /></div>'
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

    setLabelMoeda();
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
    ".buyOrders table tr:nth-child(1) td:nth-child(1)"
  ).text();
  while (exemplo.indexOf(".") >= 0) {
    exemplo = exemplo.substr(1);
  }
  return exemplo.length;
};

window.setLabelMoeda = function () {
  var labelMoeda1 = jQuery(".currency.primaryCurrency:first").text();
  var labelMoeda2 = jQuery(".currency.secondaryCurrency:first").text();
  if (labelMoeda1.trim() && labelMoeda2.trim()) {
    jQuery(".labelMoeda1").text(labelMoeda1);
    jQuery(".labelMoeda2").text(labelMoeda2);
  } else {
    setTimeout(setLabelMoeda, 1000);
  }
};

window.getVal = function (selector) {
  var jObj = jQuery(selector);
  var val =
    jObj.get(0) && jObj.get(0).tagName == "INPUT" ? jObj.val() : jObj.text();
  val = parseFloat(val);
  return isNaN(val) ? 0 : val;
};

window.setVal = function (selector, val) {
  var jObj = jQuery(selector);
  val = parseFloat(val);
  val = isNaN(val) ? "" : val;
  if (jObj.get(0) && jObj.get(0).tagName == "INPUT") {
    jObj.val(val);
  } else {
    jObj.text(val);
  }
};

window.getValMoeda1 = function () {
  return getVal("#primaryBalance");
};

window.getValMoeda2 = function () {
  return getVal("#secondaryBalance");
};

window.getValMoeda1Ignorar = function () {
  return getVal(".sjcsj #valMoeda1");
};

window.getValMoeda2Ignorar = function () {
  return getVal(".sjcsj #valMoeda2");
};

window.setValMoeda1Ignorar = function (val) {
  return setVal(".sjcsj #valMoeda1", val);
};

window.setValMoeda2Ignorar = function (val) {
  return setVal(".sjcsj #valMoeda2", val);
};

window.getValBuy = function () {
  var val = jQuery(".buyOrders table tr:nth-child(1) td:nth-child(1)").text();
  val = parseFloat(val);
  return isNaN(val) ? 0 : val;
};

window.getValSell = function () {
  var val = jQuery(".sellOrders table tr:nth-child(1) td:nth-child(1)").text();
  val = parseFloat(val);
  return isNaN(val) ? 0 : val;
};

window.getValBuyAlerta = function () {
  var val = jQuery(".sjcsj #alertaBuy").val();
  val = parseFloat(val);
  return isNaN(val) ? 0 : val;
};

window.getValSellAlerta = function () {
  var val = jQuery(".sjcsj #alertaSell").val();
  val = parseFloat(val);
  return isNaN(val) ? 9999999 : val;
};

window.setValBuyAlerta = function (val) {
  jQuery(".sjcsj #alertaBuy").val(val == null ? "" : val);
};

window.setValSellAlerta = function (val) {
  jQuery(".sjcsj #alertaSell").val(val == null ? "" : val);
};

window.getValBuy2Alerta = function () {
  var val = jQuery(".sjcsj #alertaBuy2").val();
  val = parseFloat(val);
  return isNaN(val) ? 9999999 : val;
};

window.getValSell2Alerta = function () {
  var val = jQuery(".sjcsj #alertaSell2").val();
  val = parseFloat(val);
  return isNaN(val) ? 0 : val;
};

window.setValBuy2Alerta = function (val) {
  jQuery(".sjcsj #alertaBuy2").val(val == null ? "" : val);
};

window.setValSell2Alerta = function (val) {
  jQuery(".sjcsj #alertaSell2").val(val == null ? "" : val);
};

window.getUrlParam = function (campo) {
  var regex = "(?<=" + campo + "=).*?(?=[#&])";
  var val = new RegExp("(?<=" + campo + "=).*?(?=[#&])").exec(location.href);
  return val ? val[0] : null;
};

window.fConfigParams = function () {
  if (!window.vConfigParams) {
    window.vConfigParams = true;

    setValBuyAlerta(getUrlParam("vBuy"));
    setValSellAlerta(getUrlParam("vSell"));
    setValBuy2Alerta(getUrlParam("vBuy2"));
    setValSell2Alerta(getUrlParam("vSell2"));
    setValMoeda1Ignorar(getUrlParam("vMoeda1"));
    setValMoeda2Ignorar(getUrlParam("vMoeda2"));
    isTick(getUrlParam("vIsTick"));
  }
};

window.fRecarregar = function (force) {
  window.vRecarregar = window.vRecarregar ? window.vRecarregar : 0;
  window.vRecarregar++;

  if (window.vRecarregar >= 20 || force) {
    window.onbeforeunload = null;
    location.href =
      "https://poloniex.com/exchange?sjcsj=" +
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
      "&vMoeda1=" +
      getValMoeda1Ignorar() +
      "&vMoeda2=" +
      getValMoeda2Ignorar() +
      "#usdt_btc";
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
      "http://debug.splitz.com.br/notify_intervalo_poloniex.mp3"
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

window.isTelaTrade = function () {
  return this.location.href.indexOf("/exchange") >= 0;
};

window.fCore = function () {
  if (!isTelaTrade()) {
    return;
  }

  fInitControles();
  fConfigParams();

  if (fRecarregar()) {
    return;
  }

  if (window.vLoops >= 1) {
    if (
      (getValBuy() > 0 &&
        getValSell() > 0 &&
        (getValBuy() <= getValBuyAlerta() ||
          getValSell() >= getValSellAlerta())) ||
      (getValBuy() > 0 &&
        getValSell() > 0 &&
        (getValBuy() >= getValBuy2Alerta() ||
          getValSell() <= getValSell2Alerta())) ||
      getValMoeda1() != getValMoeda1Ignorar() ||
      getValMoeda2() != getValMoeda2Ignorar()
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
};

fCore();
