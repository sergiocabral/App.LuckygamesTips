String.prototype.replaceAll = function (search, replacement) {
  var target = this;
  return target.split(search).join(replacement);
};

window.fInitControles = function () {
  if (!window.vInitControles) {
    window.vInitControles = true;

    jQuery("body").append(
      '<div class="sjcsj" style="position: fixed; bottom: 10px; right: 10px; color: black; background-color: rgba(200, 152, 255, 0.8); padding: 5px 10px; z-index: 1000000;"></div>'
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
      '<input style="width: 173px;" type="button" id="btnCore" value="fCore()" />'
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
      '<input style="width: 173px;" type="button" id="definirTotais" value="Totais atuais" />'
    );
    jQuery(".sjcsj").append(
      '<div><span style="display: inline-block; width: 65px;">Compras:</span> <input style="width: 105px; text-align: right;" type="text" id="totalCompras" value="" /></div>'
    );
    jQuery(".sjcsj").append(
      '<div><span style="display: inline-block; width: 65px;">Vendas:</span> <input style="width: 105px; text-align: right;" type="text" id="totalVendas" value="" /></div>'
    );
    jQuery(".sjcsj #definirTotais").click(function () {
      fAlarme(false);
      fAlertaVisual(false);
      setTotalComprasIgnorar(getTotalCompras());
      setTotalVendasIgnorar(getTotalVendas());
    });

    jQuery(".sjcsj").append("<hr />");

    jQuery(".sjcsj").append(
      '<div><input type="button" value="Sell" style="width: 49px;" id="btnSell" /> <input style="width: 125px; text-align: right;" type="text" id="alertaSell" value="" /></div>'
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
      '<div><input type="button" value="Buy" style="width: 49px;" id="btnBuy" /> <input style="width: 125px; text-align: right;" type="text" id="alertaBuy" value="" /></div>'
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
    "#id_order_book_bid_content .order-book-row:nth-child(1) td:nth-child(3)"
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
  var val = jQuery(
    "#id_order_book_bid_content .order-book-row:nth-child(1) td:nth-child(3)"
  )
    .text()
    .replaceAll("R$", "")
    .replaceAll(" ", "")
    .replaceAll(".", "")
    .replaceAll(",", ".");
  val = parseFloat(val);
  return isNaN(val) ? 0 : val;
};

window.getValSell = function () {
  var val = jQuery(
    "#id_order_book_ask_content .order-book-row:nth-child(1) td:nth-child(1)"
  )
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

window.getTotalCompras = function () {
  return jQuery("#id_order_book_ask_content .btn-cancel-order").length;
};

window.getTotalVendas = function () {
  return jQuery("#id_order_book_bid_content .btn-cancel-order").length;
};

window.getTotalComprasIgnorar = function () {
  var val = jQuery(".sjcsj #totalCompras").val();
  val = parseInt(val);
  return isNaN(val) ? 0 : val;
};

window.getTotalVendasIgnorar = function () {
  var val = jQuery(".sjcsj #totalVendas").val();
  val = parseInt(val);
  return isNaN(val) ? 0 : val;
};

window.setTotalComprasIgnorar = function (val) {
  jQuery(".sjcsj #totalCompras").val(val);
};

window.setTotalVendasIgnorar = function (val) {
  jQuery(".sjcsj #totalVendas").val(val);
};

window.fLogin = function () {
  if (jQuery(".btn-signin").is(":visible")) {
    jQuery(".btn-signin").click();
    setTimeout(function () {
      jQuery("#id_username").val("sergio@cabral.br.com");
      jQuery("#id_password").val("e2005SRc$");
      jQuery(".btn-login").click();
    }, 500);
    setTimeout(function () {
      location.href =
        "https://foxbit.exchange/?vIsTick=" +
        isTick() +
        "&vBuy=" +
        getValBuyAlerta() +
        "&vSell=" +
        getValSellAlerta() +
        "&vBuy2=" +
        getValBuy2Alerta() +
        "&vSell2=" +
        getValSell2Alerta() +
        "&vCompras=" +
        getTotalComprasIgnorar() +
        "&vVendas=" +
        getTotalVendasIgnorar() +
        "#offerbook";
    }, 5000);
    return true;
  } else if (location.href.indexOf("#start") >= 0) {
    location.href =
      "https://foxbit.exchange/?vIsTick=" +
      isTick() +
      "&vBuy=" +
      getValBuyAlerta() +
      "&vSell=" +
      getValSellAlerta() +
      "&vBuy2=" +
      getValBuy2Alerta() +
      "&vSell2=" +
      getValSell2Alerta() +
      "&vCompras=" +
      getTotalComprasIgnorar() +
      "&vVendas=" +
      getTotalVendasIgnorar() +
      "#offerbook";
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

    setTotalComprasIgnorar(getUrlParam("vCompras"));
    setTotalVendasIgnorar(getUrlParam("vVendas"));
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
      "https://foxbit.exchange/?sjcsj=" +
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
      "&vCompras=" +
      getTotalComprasIgnorar() +
      "&vVendas=" +
      getTotalVendasIgnorar() +
      "#start";
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
      "http://debug.splitz.com.br/notify_intervalo_foxbit.mp3"
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

window.fCore = function () {
  fInitControles();
  fConfigParams();

  if (!fLogin() && !fRecarregar()) {
    if (
      (getValBuy() > 0 &&
        getValSell() > 0 &&
        (getValBuy() <= getValBuyAlerta() ||
          getValSell() >= getValSellAlerta())) ||
      (getValBuy() > 0 &&
        getValSell() > 0 &&
        (getValBuy() >= getValBuy2Alerta() ||
          getValSell() <= getValSell2Alerta())) ||
      getTotalCompras() != getTotalComprasIgnorar() ||
      getTotalVendas() != getTotalVendasIgnorar()
    ) {
      fTick();
      fAlarme();
      fAlertaVisual(true);
    } else {
      fTick();
    }
  }

  if (!window.vCoreInterval) {
    window.vCoreInterval = setInterval(fCore, 30000);
    return;
  }
};

fCore();
