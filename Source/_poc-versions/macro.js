var rodadasEspera = 20;
var sequencias = { win: 0, lose: 0 };

var records = { max: 0 };

var fBalancePro = function () {
  var balance = parseFloat($("#balance").val());
  var balancePro = (balance * 1.0002).toFixed(8);
  var balanceMin = (balance - balance * 0.0008).toFixed(8);
  $("#balancePro").val(balancePro);
  $("#balanceMin").val(balanceMin);
};
$("#balance").after(
  '<input id="balancePro" placeholder="balancePro" /><input id="balanceMin" placeholder="balanceMin" /><input id="balanceTarget" placeholder="balanceTarget" /><input id="sequenceLose" placeholder="sequenceLose" /><input id="sequences" readonly placeholder="sequences" />'
);
var vAjax = 0;
XMLHttpRequest.prototype.sendBkp = XMLHttpRequest.prototype.send;
XMLHttpRequest.prototype.send2 = function (queryString) {
  var chance = parseInt($("#sequenceLose").val()) <= sequencias.lose;

  console.log(
    "chance: " + chance,
    "sequenceLose: " + parseInt($("#sequenceLose").val()),
    "sequencias.lose: " + sequencias.lose
  );

  if (!chance) {
    queryStringList = queryString.split("&").map((x) => x.split("="));
    for (var i = 0; i < queryStringList.length; i++) {
      if (queryStringList[i][0] == "betAmount") {
        queryStringList[i][1] = "0.00000001";
        break;
      }
    }
    queryString = queryStringList.map((x) => x.join("=")).join("&");
  } else {
    sequencias = { win: 0, lose: 0 };
  }

  $("#sequences").val(sequencias.lose + " / " + records.max);

  vAjax++;
  this.addEventListener("load", function (e) {
    fBalancePro();
    vAjax--;

    var response = JSON.parse(e.currentTarget.response);

    if (response.gameResult == "lose") {
      sequencias.lose++;
      sequencias.win = 0;

      var recordsId = "lose-" + sequencias.lose;
      var record = records[recordsId];
      records[recordsId] = isFinite(record) ? record + 1 : 1;
      if (!isFinite(record)) {
        records.max = sequencias.lose;
      }
    } else {
      if (parseFloat(response.profit) > 0.00000098) {
        rodadasEspera = parseInt($("#sequenceLose").val());
        rodadasEspera = isFinite(rodadasEspera) ? rodadasEspera * 2 : 20;
      }
      sequencias.win++;
      sequencias.lose = 0;
    }

    //console.log(records, queryStringList, response);
  });
  this.sendBkp(queryString);
};
fBalancePro();
var fSelectAll = function () {
  $(this).select();
  try {
    document.execCommand("copy");
  } catch (ex) {}
};
$("#balance").click(fSelectAll);
$("#balancePro").click(fSelectAll);
$("#balanceMin").click(fSelectAll);
setInterval(function () {
  var fExecutando = function () {
    var divs = $(".animateBalance.animation");
    for (var i = 0; i < divs.length; i++) {
      if (parseFloat($(divs[i]).css("opacity")) > 0) {
        return true;
      }
    }
    return false;
  };
  clearTimeout(window.idTimeout);
  window.idTimeout = setTimeout(function () {
    var atual = parseFloat($("#balance").val());
    var alvo = parseFloat($("#balanceTarget").val());
    if (vAjax > 0 || atual <= alvo || fExecutando()) {
      $("#balancePro").css("background-color", "red").css("color", "white");
    } else {
      $("#balancePro").css("background-color", "white").css("color", "black");
    }
  }, 4000);
}, 5000);
