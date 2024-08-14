window.licmod = "eyJ4IjoxNTI4NDAyNDcyMTQyfQ==";
window.GameBot = (function (params) {
  if (window.GameBot) return window.GameBot;

  this.GameBot = this;

  this.Inicializar = function () {
    this.Nucleo.InterceptarAjax();

    GameBot.Carregar.GoogleFonts(function () {
      GameBot.Carregar.JQuery(function () {
        GameBot.Carregar.JQueryUI(
          function () {
            GameBot.Carregar.JQueryToastPlugin(function () {
              GameBot.Carregar.Chartist(function () {
                GameBot.Carregar.AceEditor(function () {
                  var fIniciar = function () {
                    var $ = jQuery;

                    var websiteCarregado = !$("#loadingOverlay").length;

                    if (websiteCarregado) {
                      GameBot.Nucleo.ChkLicMod();
                      GameBot.Nucleo.CarregarParametrosIniciais();
                      GameBot.Nucleo.PrepararControlesNaTela();
                      GameBot.Nucleo.CarregarParametros();
                      GameBot.Nucleo.Eventos();
                    } else {
                      setTimeout(fIniciar, 1000);
                    }
                  };
                  fIniciar();
                }, true);
              }, true);
            }, true);
          },
          true,
          "base"
        );
      }, true);
    }, true);
  };

  this.Definicoes = {
    GameBot: this,

    InicializacaoAutomatica: true,

    JanelaAberta: false,

    LoopAtivado: false,

    LoopIntervalo: 100,

    ModoDebug: false,

    NomeDaAplicacao: "Game Bot",

    ContatoDoSuporte: "gamebot@splitz.com.br",

    ClassCssIdentificadora: "gbot",

    Configuracoes: {},
  };

  this.Audios = {
    Tick: "http://info.cabral.srv.br/GameBot/tick.ogg",
    Alerta: "http://info.cabral.srv.br/GameBot/alerta-baixa.ogg",
    Conquista: "http://info.cabral.srv.br/GameBot/alerta-alta.ogg",
  };

  this.Objetos = {
    GameBot: this,
  };

  this.Regras = {
    GameBot: this,

    Atual: function () {
      if (!GameBot.Definicoes.RegraAtual) {
        if (String(location.href).toLowerCase().indexOf("luckygames") >= 0) {
          GameBot.Definicoes.RegraAtual = GameBot.Regras.VerificacaoDeLicenca()
            ? GameBot.Regras.LuckygamesIo
            : GameBot.Regras.LuckygamesIoFake;
        }
      }

      return GameBot.Definicoes.RegraAtual;
    },

    VerificacaoDeLicenca: function () {
      return true;

      var dataExpiracao = null;
      if (GameBot.Definicoes.licmod) {
        try {
          dataExpiracao = new Date(
            JSON.parse(atob(GameBot.Definicoes.licmod)).x
          );
        } catch (e) {}
      }

      if (!dataExpiracao || dataExpiracao < new Date()) {
        var dataExpiracaoInfo = !dataExpiracao
          ? ""
          : GameBot.Extra.FormatarString(
              "<br /><br />Licença vencida em: <strong>{0}</strong>",
              GameBot.Extra.FormatarData(dataExpiracao, "d/M/y h:m:s")
            );
        GameBot.Util.Erro(
          GameBot.Extra.FormatarString(
            "<strong>{0}</strong> — Sua licença de uso terminou.<br />Nenhuma opera&ccedil;&atilde;o surtir&aacute; efeito; s&atilde;o apenas simula&ccedil;&otilde;es aleat&oacute;rias. Entre em contato com {1}" +
              dataExpiracaoInfo,
            GameBot.Definicoes.NomeDaAplicacao,
            GameBot.Definicoes.ContatoDoSuporte
          ),
          true
        );
        return false;
      } else {
        setTimeout(function () {
          GameBot.Util.Info(
            GameBot.Extra.FormatarString(
              "<strong>{0}</strong> — Parab&eacute;ns! Licença ativada.<br />Validade da licença: <strong>{2}</strong><br />Contato do suporte: {1}",
              GameBot.Definicoes.NomeDaAplicacao,
              GameBot.Definicoes.ContatoDoSuporte,
              GameBot.Extra.FormatarData(dataExpiracao, "d/M/y h:m:s")
            )
          );
        }, 10000);
        return true;
      }
    },

    LuckygamesIoFake: {
      estatisticas: null,

      Estatisticas: function (reset) {
        var regraAtual = GameBot.Regras.LuckygamesIoFake;

        if (reset || !regraAtual.estatisticas) {
          regraAtual.estatisticas = {
            TempoInicio: null,
            TempoFim: null,
            TempoCorrido: "00:00:00",
            Velocidade: 0,
            QuantidadeApostas: 0,
            TotalApostas: 0,
            MaiorAposta: 0,
            Ganhos: 0,
            ApostasGanhas: 0,
            Perdas: 0,
            ApostasPerdidas: 0,
            SequenciaUltima: 0,
            SequenciaGanhando: 0,
            SequenciaMaximaGanhando: 0,
            SequenciaPerdendo: 0,
            SequenciaMaximaPerdendo: 0,
            SaldoInicial: 0,
            Saldo: 0,
          };
        }
        return regraAtual.estatisticas;
      },

      SeparadorDecimal: function () {
        return ",";
      },

      CasasDecimais: function () {
        return 8;
      },

      SaldoAtual: function () {
        return GameBot.Util.Numerico($("#balance").val());
      },

      Jogar: function (onDepoisDeJogar) {
        var regraAtual = GameBot.Regras.LuckygamesIoFake;

        var fJogar = function () {
          var valorResultado =
            (parseInt(Math.random() * 100) % 2 == 0 ? -1 : 1) *
            (Math.random() * 10);
          var valorUltimo = GameBot.Objetos.GraficoSaldoUltimoValor;
          var valor = valorUltimo + valorResultado;
          if (parseInt(valor) % 2 == 0) {
            var estatisticas = regraAtual.estatisticas;

            if (!estatisticas.TempoInicio) {
              estatisticas.TempoInicio = new Date().getTime();
              estatisticas.SaldoInicial = regraAtual.SaldoAtual();
            }
            estatisticas.TempoFim = new Date().getTime();
            var tempoCorrido = new Date(0, 0, 0, 0, 0, 0);
            tempoCorrido.setMilliseconds(
              estatisticas.TempoFim - estatisticas.TempoInicio
            );
            estatisticas.TempoCorrido = GameBot.Extra.FormatarData(
              tempoCorrido,
              "h:m:s"
            );
            estatisticas.QuantidadeApostas++;
            estatisticas.TotalApostas += Math.abs(valorResultado * 0.01);
            estatisticas.Velocidade =
              estatisticas.QuantidadeApostas /
              ((estatisticas.TempoFim - estatisticas.TempoInicio) / 1000);
            estatisticas.Velocidade = isFinite(estatisticas.Velocidade)
              ? estatisticas.Velocidade
              : 0;
            estatisticas.MaiorAposta =
              Math.abs(valor - valorUltimo) <= estatisticas.MaiorAposta
                ? estatisticas.MaiorAposta
                : Math.abs(valor - valorUltimo);
            estatisticas.ApostasGanhas += valor - valorUltimo >= 0 ? 1 : 0;
            estatisticas.ApostasPerdidas += valor - valorUltimo < 0 ? 1 : 0;
            estatisticas.Ganhos =
              regraAtual.SaldoAtual() - estatisticas.SaldoInicial;
            estatisticas.SequenciaGanhando =
              valorResultado >= 0 && estatisticas.SequenciaUltima > 0
                ? estatisticas.SequenciaGanhando + 1
                : valorResultado >= 0
                ? 1
                : 0;
            estatisticas.SequenciaPerdendo =
              valorResultado < 0 && estatisticas.SequenciaUltima < 0
                ? estatisticas.SequenciaPerdendo + 1
                : valorResultado < 0
                ? 1
                : 0;
            estatisticas.SequenciaMaximaGanhando =
              estatisticas.SequenciaGanhando >
              estatisticas.SequenciaMaximaGanhando
                ? estatisticas.SequenciaGanhando
                : estatisticas.SequenciaMaximaGanhando;
            estatisticas.SequenciaMaximaPerdendo =
              estatisticas.SequenciaPerdendo >
              estatisticas.SequenciaMaximaPerdendo
                ? estatisticas.SequenciaPerdendo
                : estatisticas.SequenciaMaximaPerdendo;
            estatisticas.SequenciaUltima = valorResultado;
            estatisticas.Saldo = valor;

            $("#balance").val(GameBot.Util.NumericoTexto(estatisticas.Saldo));

            if (typeof onDepoisDeJogar === "function") {
              onDepoisDeJogar(valor);
            }
          } else {
            setTimeout(fJogar, 100);
          }
        };
        fJogar();
      },

      NomeDoServico: function () {
        return "https://luckygames.io/";
      },
    },

    LuckygamesIo: {
      estatisticas: null,

      Estatisticas: function (reset) {
        var regraAtual = GameBot.Regras.LuckygamesIo;

        if (reset || !regraAtual.estatisticas) {
          regraAtual.estatisticas = {
            TempoInicio: null,
            TempoFim: null,
            TempoCorrido: "00:00:00",
            Velocidade: 0,
            QuantidadeApostas: 0,
            TotalApostas: 0,
            MaiorAposta: 0,
            Ganhos: 0,
            ApostasGanhas: 0,
            Perdas: 0,
            ApostasPerdidas: 0,
            SequenciaUltima: 0,
            SequenciaGanhando: 0,
            SequenciaMaximaGanhando: 0,
            SequenciaPerdendo: 0,
            SequenciaMaximaPerdendo: 0,
            SaldoInicial: 0,
            Saldo: 0,
          };
        }
        return regraAtual.estatisticas;
      },

      SeparadorDecimal: function () {
        return ",";
      },

      CasasDecimais: function () {
        return 8;
      },

      SaldoAtual: function () {
        return GameBot.Util.Numerico($("#balance").val());
      },

      Jogar: function (onDepoisDeJogar, response) {
        var regraAtual = GameBot.Regras.LuckygamesIo;

        var fJogar = function (lucro, saldoFinal) {
          lucro = parseFloat(lucro);
          saldoFinal = parseFloat(saldoFinal);

          var valorResultado = lucro;
          var valorUltimo = saldoFinal - lucro;
          var valor = valorUltimo + valorResultado;

          var estatisticas = regraAtual.estatisticas;

          if (!estatisticas.TempoInicio) {
            estatisticas.TempoInicio = new Date().getTime();
            estatisticas.SaldoInicial = regraAtual.SaldoAtual();
          }
          estatisticas.TempoFim = new Date().getTime();
          var tempoCorrido = new Date(0, 0, 0, 0, 0, 0);
          tempoCorrido.setMilliseconds(
            estatisticas.TempoFim - estatisticas.TempoInicio
          );
          estatisticas.TempoCorrido = GameBot.Extra.FormatarData(
            tempoCorrido,
            "h:m:s"
          );
          estatisticas.QuantidadeApostas++;
          estatisticas.TotalApostas += Math.abs(valorResultado * 0.01);
          estatisticas.Velocidade =
            estatisticas.QuantidadeApostas /
            ((estatisticas.TempoFim - estatisticas.TempoInicio) / 1000);
          estatisticas.Velocidade = isFinite(estatisticas.Velocidade)
            ? estatisticas.Velocidade
            : 0;
          estatisticas.MaiorAposta =
            Math.abs(valor - valorUltimo) <= estatisticas.MaiorAposta
              ? estatisticas.MaiorAposta
              : Math.abs(valor - valorUltimo);
          estatisticas.ApostasGanhas += valor - valorUltimo >= 0 ? 1 : 0;
          estatisticas.ApostasPerdidas += valor - valorUltimo < 0 ? 1 : 0;
          estatisticas.Ganhos =
            regraAtual.SaldoAtual() - estatisticas.SaldoInicial;
          estatisticas.SequenciaGanhando =
            valorResultado >= 0 && estatisticas.SequenciaUltima > 0
              ? estatisticas.SequenciaGanhando + 1
              : valorResultado >= 0
              ? 1
              : 0;
          estatisticas.SequenciaPerdendo =
            valorResultado < 0 && estatisticas.SequenciaUltima < 0
              ? estatisticas.SequenciaPerdendo + 1
              : valorResultado < 0
              ? 1
              : 0;
          estatisticas.SequenciaMaximaGanhando =
            estatisticas.SequenciaGanhando >
            estatisticas.SequenciaMaximaGanhando
              ? estatisticas.SequenciaGanhando
              : estatisticas.SequenciaMaximaGanhando;
          estatisticas.SequenciaMaximaPerdendo =
            estatisticas.SequenciaPerdendo >
            estatisticas.SequenciaMaximaPerdendo
              ? estatisticas.SequenciaPerdendo
              : estatisticas.SequenciaMaximaPerdendo;
          estatisticas.SequenciaUltima = valorResultado;
          estatisticas.Saldo = valor;

          if (typeof onDepoisDeJogar === "function") {
            onDepoisDeJogar(valor);
          }
        };

        var saldoFinal = response
          ? response.balance
          : (parseInt(Math.random() * 100) % 2 == 0 ? -1 : 1) *
            (Math.random() * 10);
        var lucro = response
          ? response.profit
          : saldoFinal -
            (GameBot.Objetos.GraficoSaldoUltimoValor
              ? GameBot.Objetos.GraficoSaldoUltimoValor
              : saldoFinal);
        fJogar(lucro, saldoFinal);
      },

      NomeDoServico: function () {
        return "https://luckygames.io/";
      },
    },
  };

  this.Extra = {
    GameBot: this,

    ToString: function (obj) {
      clearTimeout(window.ToStringTimeout);

      var result;
      var ident = arguments.length >= 2 ? arguments[1] : undefined;

      if (obj == null) {
        result = String(obj);
      }

      if (!result) {
        window.ToStringRecursive = window.ToStringRecursive
          ? window.ToStringRecursive
          : [];
        if (ToStringRecursive.indexOf(obj) >= 0) {
          result = obj
            ? typeof obj == "string"
              ? '"' + obj + '"'
              : obj.toString()
            : obj;
        } else {
          ToStringRecursive.push(obj);
        }
        if (!result) {
          switch (typeof obj) {
            case "string":
              result = '"' + obj + '"';
              break;
            case "function":
              result = obj.name || obj.toString();
              break;
            case "object":
              var indent = Array(ident || 1).join("\t"),
                isArray = Array.isArray(obj);
              result =
                "{["[+isArray] +
                Object.keys(obj)
                  .map(function (key) {
                    return (
                      "\n\t" +
                      indent +
                      '"' +
                      key +
                      '": ' +
                      GameBot.Extra.ToString(obj[key], (ident || 1) + 1)
                    );
                  })
                  .join(",") +
                "\n" +
                indent +
                "}]"[+isArray];
              break;
            default:
              result = obj.toString();
              break;
          }
        }
      }

      window.ToStringTimeout = setTimeout(function () {
        delete window.ToStringTimeout;
        delete window.ToStringRecursive;
      }, 100);

      return result;
    },

    EventoTexto: function (texto, onCapturar) {
      if (!texto) return;

      window.document.evt1 = texto.toLowerCase();
      window.document.evt2 = "";

      var fKeyPress = function (e) {
        var key;
        var textoAlvo = window.document.evt1;
        var textoAgora = window.document.evt2;

        key = e.charCode;
        if (!key) key = e.keyCode;
        key = String.fromCharCode(key).toLowerCase();

        textoAgora += key;
        while (textoAgora.length > textoAlvo.length) {
          textoAgora = textoAgora.substring(1);
        }
        if (textoAgora == textoAlvo) {
          if (typeof onCapturar === "function") {
            onCapturar(textoAlvo);
          }
        }

        window.document.evt2 = textoAgora;
        return;
      };

      if (window.document.attachEvent) {
        window.document.attachEvent("onkeypress", fKeyPress);
      } else {
        window.document.addEventListener("keypress", fKeyPress, false);
      }
    },

    ReplaceAll: function (target, search, replacement) {
      return String(target).split(search).join(replacement);
    },

    ZeroEsquerda: function (num, len) {
      var num = String(Array(len + 1).join("0") + num);
      num = num.substring(num.length - len, num.length);
      return num;
    },

    FormatarData: function (date, formato) {
      if (date === undefined) {
        date = new Date();
      }
      if (!(date instanceof Date)) return;
      if (formato === undefined) {
        formato = "d/M/y h:m:s,z";
      }

      var dia = this.ZeroEsquerda(date.getDate(), 2);
      var mes = this.ZeroEsquerda(date.getMonth(), 2);
      var ano = this.ZeroEsquerda(date.getFullYear(), 4);
      var hora = this.ZeroEsquerda(date.getHours(), 2);
      var minuto = this.ZeroEsquerda(date.getMinutes(), 2);
      var segundo = this.ZeroEsquerda(date.getSeconds(), 2);
      var milesegundo = this.ZeroEsquerda(date.getMilliseconds(), 4);

      var data = formato;
      data = this.ReplaceAll(data, "d", dia);
      data = this.ReplaceAll(data, "M", mes);
      data = this.ReplaceAll(data, "a", ano);
      data = this.ReplaceAll(data, "y", ano);
      data = this.ReplaceAll(data, "h", hora);
      data = this.ReplaceAll(data, "m", minuto);
      data = this.ReplaceAll(data, "s", segundo);
      data = this.ReplaceAll(data, "z", milesegundo);

      return data;
    },

    FormatarString: function (msg) {
      var params =
        typeof msg !== "string" && isFinite(msg.length) ? msg : arguments;

      if (params.length === 0) return "";
      else {
        msg = params[0];
        for (var i = 1; i < params.length; i++) {
          msg = this.ReplaceAll(msg, "{" + (i - 1) + "}", params[i]);
        }
        return msg;
      }
    },

    CarregarScript: function (src, onLoad) {
      var element = document.createElement("SCRIPT");
      element.type = "text/javascript";
      element.src = src;
      element.onload = onLoad;
      document.getElementsByTagName("head")[0].appendChild(element);
    },

    CarregarStylesheet: function (href, onLoad) {
      var element = document.createElement("link");
      element.rel = "stylesheet";
      element.type = "text/css";
      element.href = href;
      element.media = "all";
      element.onload = onLoad;
      document.getElementsByTagName("head")[0].appendChild(element);
    },

    CarregarStylesheetCode: function (code) {
      var element = document.createElement("style");
      element.innerHTML = code;
      document.getElementsByTagName("head")[0].appendChild(element);
    },
  };

  this.Carregar = {
    JQuery: function (fAposCarregar, forcarCarregamento) {
      if (window.jQuery && !forcarCarregamento) {
        GameBot.Util.Log("jQuery j&aacute; carregado {0}", jQuery.fn.jquery);
        if (typeof fAposCarregar === "function") fAposCarregar();
      } else {
        GameBot.Extra.CarregarScript(
          "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js",
          function () {
            jQuery.noConflict();
            GameBot.Util.Log("Carregado jQuery {0}", jQuery.fn.jquery);
            if (typeof fAposCarregar === "function") fAposCarregar();
          }
        );
      }
    },

    JQueryUI: function (fAposCarregar, forcarCarregamento, tema) {
      if (window.jQuery.ui && !forcarCarregamento) {
        GameBot.Util.Log("jQuery UI j&aacute; carregado.");
        if (typeof fAposCarregar === "function") fAposCarregar();
      } else {
        tema = tema ? tema : "base";
        GameBot.Extra.CarregarStylesheet(
          "https://code.jquery.com/ui/1.12.1/themes/" + tema + "/jquery-ui.css",
          function () {
            GameBot.Extra.CarregarScript(
              "https://code.jquery.com/ui/1.12.1/jquery-ui.min.js",
              function () {
                GameBot.Util.Log("Carregado jQuery UI.");
                if (typeof fAposCarregar === "function") fAposCarregar();
              }
            );
          }
        );
      }
    },

    GoogleFonts: function (fAposCarregar) {
      GameBot.Extra.CarregarStylesheet(
        "https://fonts.googleapis.com/css?family=Bangers|Bowlby+One+SC",
        function () {
          GameBot.Util.Log("Carregado Google Fonts Plugin.");
          if (typeof fAposCarregar === "function") fAposCarregar();
        }
      );
    },

    JQueryToastPlugin: function (fAposCarregar, forcarCarregamento) {
      if (window.jQuery.toast && !forcarCarregamento) {
        GameBot.Util.Log("jQuery Toast Plugin j&aacute; carregado.");
        if (typeof fAposCarregar === "function") fAposCarregar();
      } else {
        GameBot.Extra.CarregarStylesheet(
          "https://cdnjs.cloudflare.com/ajax/libs/jquery-toast-plugin/1.3.2/jquery.toast.min.css",
          function () {
            GameBot.Extra.CarregarScript(
              "https://cdnjs.cloudflare.com/ajax/libs/jquery-toast-plugin/1.3.2/jquery.toast.min.js",
              function () {
                GameBot.Util.Log("Carregado jQuery Toast Plugin.");
                GameBot.Extra.CarregarStylesheetCode(
                  ".jq-toast-wrap { z-index: 10000004!important; }"
                );
                if (typeof fAposCarregar === "function") fAposCarregar();
              }
            );
          }
        );
      }
    },

    Chartist: function (fAposCarregar, forcarCarregamento) {
      if (window.Chartist && !forcarCarregamento) {
        GameBot.Util.Log("Chartist j&aacute; carregado.");
        if (typeof fAposCarregar === "function") fAposCarregar();
      } else {
        GameBot.Extra.CarregarStylesheet(
          "https://cdnjs.cloudflare.com/ajax/libs/chartist/0.11.0/chartist.min.css",
          function () {
            GameBot.Extra.CarregarScript(
              "https://cdnjs.cloudflare.com/ajax/libs/chartist/0.11.0/chartist.min.js",
              function () {
                GameBot.Util.Log("Carregado Chartist Plugin.");
                if (typeof fAposCarregar === "function") fAposCarregar();
              }
            );
          }
        );
      }
    },

    AceEditor: function (fAposCarregar, forcarCarregamento) {
      if (window.ace && !forcarCarregamento) {
        GameBot.Util.Log("Ace Editor j&aacute; carregado.");
        if (typeof fAposCarregar === "function") fAposCarregar();
      } else {
        GameBot.Extra.CarregarScript(
          "https://cdnjs.cloudflare.com/ajax/libs/ace/1.3.3/ace.js",
          function () {
            GameBot.Util.Log("Carregado Ace Editor.");
            if (typeof fAposCarregar === "function") fAposCarregar();
          }
        );
      }
    },
  };

  this.Util = {
    GameBot: this,

    Toast: function (toast) {
      if (toast.debug && !GameBot.Definicoes.ModoDebug) return;

      var intervaloEntreExibicoes = 1000;

      GameBot.Definicoes.MensagensToast = Array.isArray(
        GameBot.Definicoes.MensagensToast
      )
        ? GameBot.Definicoes.MensagensToast
        : [];
      GameBot.Definicoes.MensagensToast.push(toast);

      var fToast = function (exibir) {
        if (
          !exibir ||
          !jQuery.toast ||
          !GameBot.Definicoes.ParametrosInicializados
        ) {
          if (!GameBot.Definicoes.IdIntervalToast) {
            GameBot.Definicoes.IdIntervalToast = setInterval(function () {
              fToast(true);
            }, intervaloEntreExibicoes);
            fToast(true);
          }
        } else {
          var $ = jQuery;

          var toast_ = GameBot.Definicoes.MensagensToast.shift();
          if (toast_) {
            if (!toast_.debug || GameBot.Definicoes.ModoDebug) {
              jQuery.toast(
                $.extend(
                  {
                    loader: false,
                    hideAfter: intervaloEntreExibicoes * 5,
                    allowToastClose: false,
                  },
                  toast_
                )
              );
            }
          }
          if (!GameBot.Definicoes.MensagensToast.length) {
            setTimeout(function () {
              clearInterval(GameBot.Definicoes.IdIntervalToast);
              GameBot.Definicoes.IdIntervalToast = 0;
            }, intervaloEntreExibicoes);
          }
        }
      };

      fToast();
    },

    Log: function (msg) {
      GameBot.Util.Toast({
        heading: "Log " + GameBot.Extra.FormatarData(),
        text: GameBot.Extra.FormatarString(arguments),
        debug: true,
      });
    },

    Erro: function (msg, fixar) {
      var toast = {
        text: GameBot.Extra.FormatarString(arguments),
        icon: "error",
      };
      if (fixar) {
        toast.hideAfter = false;
      }
      GameBot.Util.Toast(toast);
    },

    Info: function (msg) {
      GameBot.Util.Toast({
        heading: "",
        text: GameBot.Extra.FormatarString(arguments),
        icon: "info",
      });
    },

    Audio: function (audio, volume, pausarQuandoTocando) {
      if (!audio) return;

      var id;
      var url;

      if (GameBot.Audios.hasOwnProperty(audio)) {
        id = audio;
        url = GameBot.Audios[audio];
      } else {
        id = "";
        url = audio;
      }

      var audio = GameBot.Objetos["Audio_" + id];
      if (!audio) {
        audio = new Audio(url);
        if (id) {
          GameBot.Objetos["Audio_" + id] = audio;
        }
      } else if (pausarQuandoTocando && audio.currentTime > 0 && !audio.ended) {
        try {
          audio.pause();
          audio.currentTime = 0;
        } catch (e) {}
        return;
      }
      if (audio.currentTime == 0 || audio.ended) {
        audio.volume = isFinite(volume) ? volume / 100 : 1;
        if (audio.volume > 0) {
          try {
            audio.play();
          } catch (e) {}
        }
      }
    },

    AudioHtmlSelect: function (id, className, selecionado, labelNenhum) {
      var htmlMaskOption = '<option value="{0}" {2}>{1}</option>';
      var html = "";
      html += GameBot.Extra.FormatarString(
        "<select {0} {1}>",
        id ? 'id="' + id + '"' : "",
        className ? 'class="' + className + '"' : ""
      );
      html += GameBot.Extra.FormatarString(
        htmlMaskOption,
        "",
        labelNenhum ? labelNenhum : ""
      );
      for (key in GameBot.Audios) {
        html += GameBot.Extra.FormatarString(
          htmlMaskOption,
          key,
          key,
          key == selecionado ? "selected" : ""
        );
      }
      html += GameBot.Extra.FormatarString("</select>");

      return html;
    },

    EventoSliderIndicador: function (e) {
      var $ = jQuery;
      var jSlider = $(this);
      var value = jSlider.slider("value");
      var jLabel = jSlider.siblings('label[for="' + jSlider.attr("id") + '"]');
      var text = jLabel.text();
      var mask = jLabel.attr("data-slider-mask");
      mask = mask ? mask : "{value}";
      text =
        text.substr(0, text.indexOf(":") + 1) +
        " " +
        mask.replace("{value}", value);
      jLabel.text(text);
    },

    RegistraEventoSpinnerChange: function (jObj) {
      jObj.siblings(".ui-spinner-button").on("click", function () {
        jObj.trigger("change", ["spinner"]);
      });
    },

    RegistraEventoInputNumericoPositivo: function (jObj) {
      var fEdicaoNumerica = function () {
        var separador = GameBot.Regras.Atual().SeparadorDecimal();
        var casasDecimais = GameBot.Regras.Atual().CasasDecimais();
        var valor = $(this).val();
        var valor = Math.abs(parseFloat($(this).val().replace(",", ".")));
        if (isNaN(valor)) {
          valor = "";
        }
        $(this).val(
          typeof valor === "string"
            ? valor
            : valor.toFixed(casasDecimais).replace(".", separador)
        );
      };
      jObj.change(fEdicaoNumerica);
    },

    RegistraEventoSelectInput: function (jObj) {
      var $ = jQuery;

      jObj.on("focus", function () {
        $(this).select();
      });

      jObj.on("dblclick", function () {
        $(this).select();
        try {
          document.execCommand("copy");
          GameBot.Util.Info("Conte&uacute;do copiado (CTRL+C).");
        } catch (ex) {
          GameBot.Util.Erro(
            "N&atilde;o foi poss&iacute;vel copiar o conteudo. Fa&ccedil;a manualmente com CTRL+C"
          );
        }
      });
    },

    AtualizarPagina: function (url) {
      window.onbeforeunload = null;

      var href = typeof url === "string" ? url : location.href;

      do {
        var configuracoes = new RegExp(
          GameBot.Definicoes.ClassCssIdentificadora + "=.*?(?=([#&]|$))"
        ).exec(href);
        configuracoes =
          configuracoes && configuracoes.length ? configuracoes[0] : "";
        if (configuracoes) href = href.replace(configuracoes, "");
      } while (configuracoes);

      var urlPagina = /(.*(?=#)|.*(?=$))/.exec(href);
      urlPagina = urlPagina.length ? urlPagina[0] : "";
      while (
        urlPagina.length &&
        (urlPagina[urlPagina.length - 1] == "?" ||
          urlPagina[urlPagina.length - 1] == "&")
      )
        urlPagina = urlPagina.substr(0, urlPagina.length - 1);

      var urlParametros = /#.*/.exec(href);
      urlParametros =
        urlParametros && urlParametros.length ? urlParametros[0] : "";

      var configuracoes =
        (urlPagina.indexOf("?") >= 0 ? "&" : "?") +
        GameBot.Definicoes.ClassCssIdentificadora +
        "=" +
        GameBot.Nucleo.ModulosDeControle.Configuracoes().Base64();

      var atualizarComParametros =
        !arguments.length || (typeof url === "boolean" && url);
      var url =
        urlPagina +
        (atualizarComParametros ? configuracoes : "") +
        urlParametros;

      location.href = url;
    },

    Numerico: function (valor) {
      var valorFloat = parseFloat(
        typeof valor === "number" ? valor : String(valor).replace(",", ".")
      );
      var result = isNaN(valorFloat) ? 0 : valorFloat;
      return result;
    },

    NumericoTexto: function (valor) {
      var valorFloat = parseFloat(
        (typeof valor === "number"
          ? valor.toFixed(GameBot.Regras.Atual().CasasDecimais() + 1)
          : String(valor)
        ).replace(",", ".")
      );
      var result = isNaN(valorFloat)
        ? ""
        : valorFloat
            .toFixed(GameBot.Regras.Atual().CasasDecimais() + 1)
            .replace(".", GameBot.Regras.Atual().SeparadorDecimal());
      if (result.length) {
        result = result.substr(0, result.length - 1);
        if (
          result[result.length - 1] == GameBot.Regras.Atual().SeparadorDecimal()
        ) {
          result = result.substr(0, result.length - 1);
        }
      }
      return result;
    },
  };

  this.Nucleo = {
    GameBot: this,

    ChkLicMod: function () {
      if (window.licmod) {
        GameBot.Definicoes.licmod = window.licmod;
        delete window.licmod;
      } else {
        try {
          var parametros = new RegExp(
            "(?<=" +
              GameBot.Definicoes.ClassCssIdentificadora +
              "=).*?(?=([#&]|$))"
          ).exec(document.location.href);
          parametros = parametros && parametros.length ? parametros[0] : "";
          GameBot.Definicoes.licmod = JSON.parse(atob(parametros)).l;
        } catch (e) {}
      }
    },

    Eventos: function () {
      var $ = jQuery;

      var fLicClick = function () {
        GameBot.Definicoes.licmod++;
      };

      GameBot.Objetos.Cabecalho = $(
        ".cabecalho",
        "." + GameBot.Definicoes.ClassCssIdentificadora
      );

      // set license
      GameBot.Extra.EventoTexto("set license", function () {
        if (!isFinite(GameBot.Definicoes.licmod)) {
          GameBot.Definicoes.licmod = 0;
          GameBot.Objetos.Cabecalho.on("click", fLicClick);
        } else {
          GameBot.Objetos.Cabecalho.off("click", fLicClick);
          if (GameBot.Definicoes.licmod > 0) {
            var expire = new Date();
            expire.setDate(expire.getDate() + GameBot.Definicoes.licmod);
            GameBot.Definicoes.licmod = btoa(
              JSON.stringify({ x: expire.getTime() })
            );
          } else {
            delete GameBot.Definicoes.licmod;
          }
        }
      });
    },

    CarregarParametros: function () {
      var parametros = new RegExp(
        "(?<=" + GameBot.Definicoes.ClassCssIdentificadora + "=).*?(?=([#&]|$))"
      ).exec(document.location.href);
      parametros = parametros && parametros.length ? parametros[0] : "";
      if (parametros) {
        try {
          GameBot.Nucleo.ModulosDeControle.Configuracoes().Base64(parametros);
        } catch (ex) {}
      }
    },

    ModulosDeControle: {
      Loop: function () {
        if (GameBot.Definicoes.LoopInstancia)
          return GameBot.Definicoes.LoopInstancia;

        var $ = jQuery;

        GameBot.Definicoes.LoopInstancia = {
          aberto: true,

          titulo: "Jogadas autom&aacute;ticas",

          html:
            GameBot.Extra.FormatarString("Modo: ") +
            GameBot.Extra.FormatarString(
              '<label for="loopAtivado">Autom&aacute;tico</label>'
            ) +
            GameBot.Extra.FormatarString(
              '<input type="radio" name="loopModo" id="loopAtivado">'
            ) +
            GameBot.Extra.FormatarString(
              '<label for="loopDesativado">Manual</label>'
            ) +
            GameBot.Extra.FormatarString(
              '<input type="radio" name="loopModo" id="loopDesativado">'
            ) +
            GameBot.Definicoes.HtmlDivisor +
            GameBot.Extra.FormatarString(
              '<label for="loopVelocidade">Tempo entre jogadas: </label>'
            ) +
            GameBot.Extra.FormatarString(
              '<input type="text" id="loopVelocidade" name="loopVelocidade" style="width: 35px; padding: .222em 0; height: auto;" value="{0}" min="{1}" max="{2}" maxlength="{3}"> milesegundos',
              GameBot.Definicoes.LoopIntervalo,
              1,
              99999,
              5
            ) +
            GameBot.Definicoes.HtmlDivisor +
            GameBot.Extra.FormatarString(
              '<label for="jogadasSimultaneas">Agressividade: </label>'
            ) +
            GameBot.Extra.FormatarString(
              '<input type="text" id="jogadasSimultaneas" name="jogadasSimultaneas" style="width: 35px; padding: .222em 0; height: auto;" value="{0}" min="{1}" max="{2}" maxlength="{3}"> jogadas simult&acirc;neas. <span class="simultaneoAgora"></span>',
              0,
              0,
              9,
              1
            ) +
            GameBot.Definicoes.HtmlDivisor +
            GameBot.Extra.FormatarString(
              '<label style="display: inline-block; width: 120px;" for="audioLoop">Notifica&ccedil;&atilde;o em &aacute;udio: </label>'
            ) +
            GameBot.Util.AudioHtmlSelect("audioLoop", "", "Tick", "Nenhum") +
            GameBot.Extra.FormatarString("<br />") +
            GameBot.Extra.FormatarString(
              '<label style="display: inline-block; width: 120px;" for="volumeAudioLoop" data-slider-mask="{value}%">Volume: </label>'
            ) +
            GameBot.Extra.FormatarString(
              '<div id="volumeAudioLoop" style="width: 183px; display: inline-block; margin: 6px 0 -2px 6px;"></div>'
            ) +
            GameBot.Definicoes.HtmlDivisor +
            GameBot.Extra.FormatarString(
              '<div style="font-weight: bold; background-color: aliceblue; padding: 0.5em; border: 1px solid silver; border-radius: 3px; opacity: 0.8;">Instru&ccedil;&otilde;es:'
            ) +
            GameBot.Extra.FormatarString(
              '<ul style="margin: 0; padding: 0.5em 0 0 2em; font-weight: normal;">'
            ) +
            GameBot.Extra.FormatarString(
              "<li>Voc&ecirc; pode jogar no modo autom&aacute;tico ou manual.</li>"
            ) +
            GameBot.Extra.FormatarString(
              "<li>Diminua o tempo entre as jogadas para um resultado mais r&aacute;pido. Mas fique de olho! Se voc&ecirc; estiver ganhando muito o site vai fazer voc&ecirc; perder seguidamente.</li>"
            ) +
            GameBot.Extra.FormatarString(
              "<li>Cuidado com as jogadas simult&acirc;neas! Elas ajudam a aumentar os ganhos, mas &agrave;s vezes podem reduzir drasticamente o seu saldo. N&atilde;o use se sua internet estiver lenta.</li>"
            ) +
            GameBot.Extra.FormatarString("</ul></div>"),

          onLoad: function () {
            $(
              'input[name="loopModo"]',
              "." + GameBot.Definicoes.ClassCssIdentificadora
            ).checkboxradio();

            GameBot.Objetos.LoopAtivado = $(
              "#loopAtivado",
              "." + GameBot.Definicoes.ClassCssIdentificadora
            )
              .prop("checked", !!GameBot.Definicoes.LoopAtivado)
              .button("refresh");
            GameBot.Objetos.LoopDesativado = $(
              "#loopDesativado",
              "." + GameBot.Definicoes.ClassCssIdentificadora
            )
              .prop("checked", !GameBot.Definicoes.LoopAtivado)
              .button("refresh");
            var fToggleLoopModo = function () {
              GameBot.Nucleo.Loop(
                $(
                  "#loopAtivado",
                  "." + GameBot.Definicoes.ClassCssIdentificadora
                ).prop("checked")
              );
              GameBot.Objetos.LoopAtivado.prop(
                "checked",
                !!GameBot.Definicoes.LoopAtivado
              );
              GameBot.Objetos.LoopDesativado.prop(
                "checked",
                !GameBot.Definicoes.LoopAtivado
              );
              GameBot.Objetos.ExecutarAgora.html(
                GameBot.Definicoes.LoopAtivado ? "Parar" : "Jogar"
              );
            };
            GameBot.Objetos.LoopAtivado.on("change", fToggleLoopModo);
            GameBot.Objetos.LoopDesativado.on("change", fToggleLoopModo);

            GameBot.Objetos.LoopVelocidade = $(
              "#loopVelocidade",
              "." + GameBot.Definicoes.ClassCssIdentificadora
            ).spinner();
            var idTimeoutChange;
            GameBot.Objetos.LoopVelocidade.on("change", function (e, slider) {
              var val = parseInt($(this).val());
              var min = parseInt($(this).attr("min"));
              var max = parseInt($(this).attr("max"));
              if (val < min) val = min;
              if (val > max) val = max;
              if (isNaN(val)) val = GameBot.Definicoes.LoopIntervalo;
              $(this).val(val);

              var fChange = function () {
                GameBot.Definicoes.LoopIntervalo = val;
                GameBot.Nucleo.Loop(
                  $(
                    "#loopAtivado",
                    "." + GameBot.Definicoes.ClassCssIdentificadora
                  ).prop("checked")
                );
              };
              clearTimeout(idTimeoutChange);
              if (slider) {
                idTimeoutChange = setTimeout(fChange, 1000);
              } else {
                fChange();
              }
            });
            GameBot.Util.RegistraEventoSpinnerChange(
              GameBot.Objetos.LoopVelocidade
            );

            GameBot.Objetos.JogadasSimultaneas = $(
              "#jogadasSimultaneas",
              "." + GameBot.Definicoes.ClassCssIdentificadora
            ).spinner();
            GameBot.Util.RegistraEventoSpinnerChange(
              GameBot.Objetos.JogadasSimultaneas
            );
            GameBot.Objetos.JogadasSimultaneasAgora = $(
              ".simultaneoAgora",
              "." + GameBot.Definicoes.ClassCssIdentificadora
            );

            GameBot.Objetos.AudioLoop = $(
              "#audioLoop",
              "." + GameBot.Definicoes.ClassCssIdentificadora
            ).selectmenu({
              width: "200px",
            });
            GameBot.Objetos.VolumeAudioLoop = $(
              "#volumeAudioLoop",
              "." + GameBot.Definicoes.ClassCssIdentificadora
            ).slider({ value: 50 });
            GameBot.Objetos.VolumeAudioLoop.on(
              "slidechange",
              GameBot.Util.EventoSliderIndicador
            );
            GameBot.Objetos.VolumeAudioLoop.trigger("slidechange");
          },

          onLoop: function () {
            var audio = GameBot.Objetos.AudioLoop.val();
            var volume = GameBot.Objetos.VolumeAudioLoop.slider("value") / 100;
            GameBot.Util.Audio(audio, volume);

            if (!GameBot.Objetos.setIntervalIdSimultaneoAgora) {
              GameBot.Objetos.setIntervalIdSimultaneoAgora = setInterval(
                function () {
                  var simultaneoAgora = 0;
                  for (
                    var i = 1;
                    Array.isArray(GameBot.Definicoes.ApostasEmAndamento) &&
                    i < GameBot.Definicoes.ApostasEmAndamento.length;
                    i++
                  ) {
                    simultaneoAgora += GameBot.Definicoes.ApostasEmAndamento[i]
                      ? 1
                      : 0;
                  }

                  if (simultaneoAgora) {
                    GameBot.Objetos.JogadasSimultaneasAgora.html(
                      GameBot.Extra.FormatarString(
                        "Agora: <strong>{0}</strong>",
                        simultaneoAgora
                      )
                    );
                  } else {
                    GameBot.Objetos.JogadasSimultaneasAgora.html("");
                    clearInterval(GameBot.Objetos.setIntervalIdSimultaneoAgora);
                    GameBot.Objetos.setIntervalIdSimultaneoAgora = null;
                  }
                },
                500
              );
            }
          },

          getConfiguracoes: function () {
            return {
              Ativado: GameBot.Objetos.LoopAtivado.prop("checked"),
              Intervalo: parseInt(GameBot.Definicoes.LoopIntervalo),
              JogadasSimultaneas: parseInt(
                GameBot.Objetos.JogadasSimultaneas.val()
              ),
              Audio: GameBot.Objetos.AudioLoop.val(),
              Volume: GameBot.Objetos.VolumeAudioLoop.slider("value"),
            };
          },

          setConfiguracoes: function (configuracoes) {
            if (!configuracoes) return;

            if (configuracoes.hasOwnProperty("Ativado")) {
              GameBot.Objetos.LoopAtivado.prop(
                "checked",
                !!configuracoes.Ativado
              );
              GameBot.Objetos.LoopDesativado.prop(
                "checked",
                !configuracoes.Ativado
              );

              GameBot.Objetos.LoopAtivado.trigger("change");

              GameBot.Objetos.LoopAtivado.button("refresh");
              GameBot.Objetos.LoopDesativado.button("refresh");
            }

            if (
              configuracoes.hasOwnProperty("Intervalo") &&
              isFinite(configuracoes.Intervalo)
            ) {
              GameBot.Objetos.LoopVelocidade.val(
                parseInt(configuracoes.Intervalo)
              ).trigger("change");
            }

            if (
              configuracoes.hasOwnProperty("JogadasSimultaneas") &&
              isFinite(configuracoes.JogadasSimultaneas)
            ) {
              GameBot.Objetos.JogadasSimultaneas.val(
                parseInt(configuracoes.JogadasSimultaneas)
              ).trigger("change");
            }

            if (configuracoes.hasOwnProperty("Audio")) {
              GameBot.Objetos.AudioLoop.val(
                GameBot.Audios.hasOwnProperty(configuracoes.Audio)
                  ? configuracoes.Audio
                  : ""
              );
              GameBot.Objetos.AudioLoop.selectmenu("refresh").trigger(
                "slidechange"
              );
            }

            if (
              configuracoes.hasOwnProperty("Volume") &&
              isFinite(configuracoes.Volume)
            ) {
              GameBot.Objetos.VolumeAudioLoop.slider(
                "value",
                parseInt(configuracoes.Volume)
              ).trigger("slidechange");
            }
          },
        };

        return GameBot.Definicoes.LoopInstancia;
      },

      Valores: function () {
        if (GameBot.Definicoes.ApostaInstancia)
          return GameBot.Definicoes.ApostaInstancia;

        var $ = jQuery;

        var styleTitulo = "padding: 5px 20px; text-align: center; width: 50%";
        var styleValor =
          "position: relative; padding: 0 5px; text-align: center;";
        var styleInput =
          "height: auto; width: 160px; text-align: center; font-size: 1.5em; padding: 5px; font-weight: bold;";
        var styleVolume =
          "width: 172px; display: inline-block; background-color: #f8f8f8; margin: -6px 10px 0 10px; border: 1px solid silver; padding: 4px 0 6px 0;";

        GameBot.Definicoes.ApostaInstancia = {
          aberto: true,

          titulo: "Seus valores",

          html:
            GameBot.Extra.FormatarString('<table style="width: 100%">') +
            GameBot.Extra.FormatarString("<tr>") +
            GameBot.Extra.FormatarString(
              '<td style="{0}">Saldo atual</td>',
              styleTitulo
            ) +
            GameBot.Extra.FormatarString(
              '<td style="{0}">Valor m&iacute;nimo das apostas</td>',
              styleTitulo
            ) +
            GameBot.Extra.FormatarString("</tr>") +
            GameBot.Extra.FormatarString("<tr>") +
            GameBot.Extra.FormatarString(
              '<td style="{0}"><input type="text" id="saldoAtual" readonly style="{1} color: black;" /></td>',
              styleValor,
              styleInput
            ) +
            GameBot.Extra.FormatarString(
              '<td style="{0}"><input type="text" id="apostaValor" style="{1} color: blue;" data-operacao-incremento="*2" data-operacao-incremento-descricao="Valor m&iacute;nimo das apostas dobrado." /></td>',
              styleValor,
              styleInput
            ) +
            GameBot.Extra.FormatarString("</tr>") +
            GameBot.Extra.FormatarString("<tr>") +
            GameBot.Extra.FormatarString(
              '<td style="{0}">Limite: Saldo m&iacute;nimo</td>',
              styleTitulo
            ) +
            GameBot.Extra.FormatarString(
              '<td style="{0}">Limite: Saldo m&aacute;ximo</td>',
              styleTitulo
            ) +
            GameBot.Extra.FormatarString("</tr>") +
            GameBot.Extra.FormatarString("<tr>") +
            GameBot.Extra.FormatarString(
              '<td style="{0}"><input type="text" id="saldoMinimo" style="{1} color: red;" data-operacao-incremento="*1.1" data-operacao-incremento-descricao="Limite m&iacute;nimo aumentado em 10%" data-operacao-saldo="/2" data-operacao-saldo-descricao="Limite m&iacute;nimo definido como a metade do saldo atual." /></td>',
              styleValor,
              styleInput
            ) +
            GameBot.Extra.FormatarString(
              '<td style="{0}"><input type="text" id="saldoMaximo" style="{1} color: green;" data-operacao-incremento="*1.1" data-operacao-incremento-descricao="Limite m&aacute;ximo aumentado em 10%" data-operacao-saldo="*2" data-operacao-saldo-descricao="Limite m&aacute;ximo definido como o dobro do saldo atual." /></td>',
              styleValor,
              styleInput
            ) +
            GameBot.Extra.FormatarString("</tr>") +
            GameBot.Extra.FormatarString("<tr>") +
            GameBot.Extra.FormatarString('<td style="text-align: center;">') +
            GameBot.Extra.FormatarString('<div style="{0}">', styleVolume) +
            GameBot.Extra.FormatarString(
              '<label style="display: block; padding: 5px 20px;" for="saldoMinimoAudio">Notifica&ccedil;&atilde;o em &aacute;udio: </label>'
            ) +
            GameBot.Util.AudioHtmlSelect(
              "saldoMinimoAudio",
              "",
              "Alerta",
              "Nenhum"
            ) +
            GameBot.Extra.FormatarString("<br />") +
            GameBot.Extra.FormatarString(
              '<label for="SaldoMinimoAudioVolume" data-slider-mask="{value}%">Volume: </label>'
            ) +
            GameBot.Extra.FormatarString(
              '<div id="saldoMinimoAudioVolume" style="width: 60px; display: inline-block; margin: 8px 0 -2px 15px;"></div>'
            ) +
            GameBot.Extra.FormatarString("</div>") +
            GameBot.Extra.FormatarString("</td>") +
            GameBot.Extra.FormatarString('<td style="text-align: center;">') +
            GameBot.Extra.FormatarString('<div style="{0}">', styleVolume) +
            GameBot.Extra.FormatarString(
              '<label style="display: block; padding: 5px 20px;" for="saldoMaximoAudio">Notifica&ccedil;&atilde;o em &aacute;udio: </label>'
            ) +
            GameBot.Util.AudioHtmlSelect(
              "saldoMaximoAudio",
              "",
              "Conquista",
              "Nenhum"
            ) +
            GameBot.Extra.FormatarString("<br />") +
            GameBot.Extra.FormatarString(
              '<label for="saldoMaximoAudioVolume" data-slider-mask="{value}%">Volume: </label>'
            ) +
            GameBot.Extra.FormatarString(
              '<div id="saldoMaximoAudioVolume" style="width: 60px; display: inline-block; margin: 8px 0 -2px 15px;"></div>'
            ) +
            GameBot.Extra.FormatarString("</div>") +
            GameBot.Extra.FormatarString("</td>") +
            GameBot.Extra.FormatarString("</tr>") +
            GameBot.Extra.FormatarString("<tr>") +
            GameBot.Extra.FormatarString('<td colspan="2" style="{0}"><br />') +
            GameBot.Extra.FormatarString(
              '<div style="font-weight: bold; background-color: aliceblue; padding: 0.5em; border: 1px solid silver; border-radius: 3px; opacity: 0.8;">Instru&ccedil;&otilde;es:'
            ) +
            GameBot.Extra.FormatarString(
              '<ul style="margin: 0; padding: 0.5em 0 0 2em; font-weight: normal;">'
            ) +
            GameBot.Extra.FormatarString(
              "<li>Qualquer ajuste nos valores s&atilde;o aplicados imediatamente.</li>"
            ) +
            GameBot.Extra.FormatarString(
              "<li>Para n&atilde;o definir os limites deixe o campo em branco.</li>"
            ) +
            GameBot.Extra.FormatarString(
              "<li>D&ecirc; dois cliques nos campos dos limites para aumentar ou diminuir.</li>"
            ) +
            GameBot.Extra.FormatarString("</ul></div>") +
            GameBot.Extra.FormatarString("</td>") +
            GameBot.Extra.FormatarString("</tr>") +
            GameBot.Extra.FormatarString("</table>"),

          onLoad: function () {
            var silencioso = true;

            GameBot.Extra.CarregarStylesheetCode(
              "." +
                GameBot.Definicoes.ClassCssIdentificadora +
                " #Valores .ui-selectmenu-button { width: 80% !important; }"
            );

            var eventoIncrementar = function () {
              var operacao = $(this).attr("data-operacao-incremento");
              var valor = GameBot.Util.Numerico($(this).val());
              valor = eval(valor + operacao);
              valor =
                valor === 0 || valor < 0.00000001
                  ? ""
                  : GameBot.Util.NumericoTexto(valor);
              $(this).val(valor).trigger("change");

              var descricao = $(this).attr(
                "data-operacao-incremento-descricao"
              );
              if (valor && descricao && !silencioso)
                GameBot.Util.Info(descricao);
            };
            var eventoValorPadrao = function () {
              if ($(this).val() === "") {
                var operacao = $(this).attr("data-operacao-saldo");
                var saldoAtual = GameBot.Regras.Atual().SaldoAtual();
                var valor = eval(saldoAtual + operacao);
                $(this)
                  .val(GameBot.Util.NumericoTexto(valor))
                  .trigger("change");

                var descricao = $(this).attr("data-operacao-saldo-descricao");
                if (valor && descricao && !silencioso)
                  GameBot.Util.Info(descricao);
              }
            };
            var eventoLimiteAudio = function () {
              var visibility = $(this).val() !== "" ? "visible" : "hidden";
              var cellIndex = $(this).closest("td").get(0).cellIndex;
              $($(this).closest("tr").next().find("td").get(cellIndex)).css(
                "visibility",
                visibility
              );
            };

            var saldoAtual = GameBot.Regras.Atual().SaldoAtual();

            GameBot.Objetos.SaldoAtual = $(
              "#saldoAtual",
              "." + GameBot.Definicoes.ClassCssIdentificadora
            );
            GameBot.Objetos.SaldoAtual.val(
              GameBot.Util.NumericoTexto(saldoAtual)
            );

            GameBot.Objetos.ApostaValor = $(
              "#apostaValor",
              "." + GameBot.Definicoes.ClassCssIdentificadora
            );
            var apostaValor =
              "0" +
              GameBot.Regras.Atual().SeparadorDecimal() +
              "0"
                .repeat(GameBot.Regras.Atual().CasasDecimais())
                .substr(0, GameBot.Regras.Atual().CasasDecimais() - 1) +
              "5";
            GameBot.Objetos.ApostaValor.val(apostaValor);
            GameBot.Util.RegistraEventoInputNumericoPositivo(
              GameBot.Objetos.ApostaValor
            );
            GameBot.Objetos.ApostaValor.change(function () {
              var valor = $(this).val();
              if (!valor || parseFloat(valor.replace(",", ".")) == 0) {
                $(this).val(apostaValor);
              }
            });
            GameBot.Objetos.ApostaValor.on("dblclick", eventoIncrementar);

            GameBot.Objetos.SaldoMinimo = $(
              "#saldoMinimo",
              "." + GameBot.Definicoes.ClassCssIdentificadora
            );
            GameBot.Util.RegistraEventoInputNumericoPositivo(
              GameBot.Objetos.SaldoMinimo
            );
            GameBot.Objetos.SaldoMinimo.on("dblclick", eventoIncrementar);
            GameBot.Objetos.SaldoMinimo.on("dblclick", eventoValorPadrao);
            GameBot.Objetos.SaldoMinimo.on("change", eventoLimiteAudio);
            GameBot.Objetos.SaldoMinimo.trigger("dblclick");
            GameBot.Objetos.SaldoMinimo.trigger("change");

            GameBot.Objetos.SaldoMaximo = $(
              "#saldoMaximo",
              "." + GameBot.Definicoes.ClassCssIdentificadora
            );
            GameBot.Util.RegistraEventoInputNumericoPositivo(
              GameBot.Objetos.SaldoMaximo
            );
            GameBot.Objetos.SaldoMaximo.on("dblclick", eventoIncrementar);
            GameBot.Objetos.SaldoMaximo.on("dblclick", eventoValorPadrao);
            GameBot.Objetos.SaldoMaximo.on("change", eventoLimiteAudio);
            GameBot.Objetos.SaldoMaximo.trigger("dblclick");
            GameBot.Objetos.SaldoMaximo.trigger("change");

            GameBot.Objetos.SaldoMinimoAudio = $(
              "#saldoMinimoAudio",
              "." + GameBot.Definicoes.ClassCssIdentificadora
            ).selectmenu({
              width: "200px",
            });
            GameBot.Objetos.SaldoMinimoAudioVolume = $(
              "#saldoMinimoAudioVolume",
              "." + GameBot.Definicoes.ClassCssIdentificadora
            ).slider({ value: 50 });
            GameBot.Objetos.SaldoMinimoAudioVolume.on(
              "slidechange",
              GameBot.Util.EventoSliderIndicador
            );
            GameBot.Objetos.SaldoMinimoAudioVolume.trigger("slidechange");

            GameBot.Objetos.SaldoMaximoAudio = $(
              "#saldoMaximoAudio",
              "." + GameBot.Definicoes.ClassCssIdentificadora
            ).selectmenu({
              width: "200px",
            });
            GameBot.Objetos.SaldoMaximoAudioVolume = $(
              "#saldoMaximoAudioVolume",
              "." + GameBot.Definicoes.ClassCssIdentificadora
            ).slider({ value: 50 });
            GameBot.Objetos.SaldoMaximoAudioVolume.on(
              "slidechange",
              GameBot.Util.EventoSliderIndicador
            );
            GameBot.Objetos.SaldoMaximoAudioVolume.trigger("slidechange");

            silencioso = false;
          },

          onLoop: function () {
            var saldoAtual = GameBot.Regras.Atual().SaldoAtual();
            var limiteMinimo = GameBot.Util.Numerico(
              GameBot.Objetos.SaldoMinimo.val()
            );
            var limiteMaximo = GameBot.Util.Numerico(
              GameBot.Objetos.SaldoMaximo.val()
            );

            GameBot.Objetos.SaldoAtual.val(
              GameBot.Util.NumericoTexto(saldoAtual)
            );

            if (limiteMinimo > 0 && saldoAtual <= limiteMinimo) {
              GameBot.Util.Erro(
                "Cuidado! Seu saldo atingiu o limite m&iacute;nimo."
              );
              GameBot.Nucleo.ModulosDeControle.Loop().setConfiguracoes({
                Ativado: false,
              });
              GameBot.Util.Audio(
                GameBot.Objetos.SaldoMinimoAudio.val(),
                GameBot.GameBot.Objetos.SaldoMinimoAudioVolume.slider("value") /
                  100
              );
            } else if (limiteMaximo > 0 && saldoAtual >= limiteMaximo) {
              GameBot.Util.Info(
                "Paranb&eacute;s! Seu saldo alcan&ccedil;ou o limite m&aacute;ximo."
              );
              GameBot.Nucleo.ModulosDeControle.Loop().setConfiguracoes({
                Ativado: false,
              });
              GameBot.Util.Audio(
                GameBot.Objetos.SaldoMaximoAudio.val(),
                GameBot.GameBot.Objetos.SaldoMaximoAudioVolume.slider("value") /
                  100
              );
            }
          },

          getConfiguracoes: function () {
            return {
              ApostaValor: GameBot.Util.NumericoTexto(
                GameBot.Objetos.ApostaValor.val()
              ),
              SaldoMinimo: GameBot.Util.NumericoTexto(
                GameBot.Objetos.SaldoMinimo.val()
              ),
              SaldoMinimoAudio: GameBot.Objetos.SaldoMinimoAudio.val(),
              SaldoMinimoAudioVolume:
                GameBot.Objetos.SaldoMinimoAudioVolume.slider("value"),
              SaldoMaximo: GameBot.Util.NumericoTexto(
                GameBot.Objetos.SaldoMaximo.val()
              ),
              SaldoMaximoAudio: GameBot.Objetos.SaldoMaximoAudio.val(),
              SaldoMaximoAudioVolume:
                GameBot.Objetos.SaldoMaximoAudioVolume.slider("value"),
            };
          },

          setConfiguracoes: function (configuracoes) {
            if (!configuracoes) return;
            window.configuracoes = configuracoes;

            if (
              configuracoes.hasOwnProperty("ApostaValor") &&
              isFinite(
                parseFloat(String(configuracoes.ApostaValor).replace(",", "."))
              )
            ) {
              GameBot.Objetos.ApostaValor.val(
                GameBot.Util.NumericoTexto(configuracoes.ApostaValor)
              );
            }

            if (
              configuracoes.hasOwnProperty("SaldoMinimo") &&
              isFinite(
                parseFloat(String(configuracoes.SaldoMinimo).replace(",", "."))
              )
            ) {
              GameBot.Objetos.SaldoMinimo.val(
                GameBot.Util.NumericoTexto(configuracoes.SaldoMinimo)
              );
            }

            if (configuracoes.hasOwnProperty("SaldoMinimoAudio")) {
              GameBot.Objetos.SaldoMinimoAudio.val(
                GameBot.Audios.hasOwnProperty(configuracoes.SaldoMinimoAudio)
                  ? configuracoes.SaldoMinimoAudio
                  : ""
              );
              GameBot.Objetos.SaldoMinimoAudio.selectmenu("refresh").trigger(
                "slidechange"
              );
            }

            if (
              configuracoes.hasOwnProperty("SaldoMinimoAudioVolume") &&
              isFinite(configuracoes.SaldoMinimoAudioVolume)
            ) {
              GameBot.Objetos.SaldoMinimoAudioVolume.slider(
                "value",
                parseInt(configuracoes.SaldoMinimoAudioVolume)
              ).trigger("slidechange");
            }

            if (
              configuracoes.hasOwnProperty("SaldoMaximo") &&
              isFinite(
                parseFloat(String(configuracoes.SaldoMaximo).replace(",", "."))
              )
            ) {
              GameBot.Objetos.SaldoMaximo.val(
                GameBot.Util.NumericoTexto(configuracoes.SaldoMaximo)
              );
            }

            if (configuracoes.hasOwnProperty("SaldoMaximoAudio")) {
              GameBot.Objetos.SaldoMaximoAudio.val(
                GameBot.Audios.hasOwnProperty(configuracoes.SaldoMaximoAudio)
                  ? configuracoes.SaldoMaximoAudio
                  : ""
              );
              GameBot.Objetos.SaldoMaximoAudio.selectmenu("refresh").trigger(
                "slidechange"
              );
            }

            if (
              configuracoes.hasOwnProperty("SaldoMaximoAudioVolume") &&
              isFinite(configuracoes.SaldoMaximoAudioVolume)
            ) {
              GameBot.Objetos.SaldoMaximoAudioVolume.slider(
                "value",
                parseInt(configuracoes.SaldoMaximoAudioVolume)
              ).trigger("slidechange");
            }
          },
        };

        return GameBot.Definicoes.ApostaInstancia;
      },

      Estatisticas: function () {
        if (GameBot.Definicoes.EstatisticasInstancia)
          return GameBot.Definicoes.EstatisticasInstancia;

        var $ = jQuery;

        var styleTableTdKey =
          "padding: 0 10px 0 0; border-right: 2px solid gainsboro; text-align: right; white-space: nowrap;";
        var styleTableTdValue =
          "padding: 0 0 0 10px; text-align: left; font-weight: bold; white-space: nowrap;";
        var styleDivisor = "border-bottom: 1px solid gainsboro; margin: 5px 0";

        GameBot.Definicoes.EstatisticasInstancia = {
          aberto: true,

          titulo: "Relat&oacute;rio e Estatisticas",

          html:
            GameBot.Extra.FormatarString(
              '<table class="estatisticas" style="font-size: 11px; width: 100%;">'
            ) +
            GameBot.Extra.FormatarString("<tr>") +
            GameBot.Extra.FormatarString(
              '<td colspan="4" style="padding: 0; vertical-align: middle; font-size: 15px;">Progress&atilde;o do seu saldo</td>'
            ) +
            GameBot.Extra.FormatarString("</tr>") +
            GameBot.Extra.FormatarString("<tr>") +
            GameBot.Extra.FormatarString('<td colspan="4">') +
            GameBot.Extra.FormatarString(
              '<div id="graficoSaldo" class="grafico"><div>Carregando...</div></div>'
            ) +
            GameBot.Extra.FormatarString("</td>") +
            GameBot.Extra.FormatarString("</tr>") +
            GameBot.Extra.FormatarString(
              '<tr><td colspan="4">{0}</td></tr>',
              GameBot.Definicoes.HtmlDivisor
            ) +
            GameBot.Extra.FormatarString("<tr>") +
            GameBot.Extra.FormatarString(
              '<td style="{0} width: 25%;">Tempo corrido</td>',
              styleTableTdKey
            ) +
            GameBot.Extra.FormatarString(
              '<td style="{0} width: 25%;" class="tempoCorrido">0:0:0</td>',
              styleTableTdValue
            ) +
            GameBot.Extra.FormatarString(
              '<td style="{0} width: 25%;">Velocidade</td>',
              styleTableTdKey
            ) +
            GameBot.Extra.FormatarString(
              '<td style="{0} width: 25%;" class="velocidade">2.5</td>',
              styleTableTdValue
            ) +
            GameBot.Extra.FormatarString("</tr>") +
            GameBot.Extra.FormatarString("<tr>") +
            GameBot.Extra.FormatarString(
              '<td colspan="4"><div style="{0}"></div></td>',
              styleDivisor
            ) +
            GameBot.Extra.FormatarString("</tr>") +
            GameBot.Extra.FormatarString("<tr>") +
            GameBot.Extra.FormatarString(
              '<td style="{0}">Apostas feitas</td>',
              styleTableTdKey
            ) +
            GameBot.Extra.FormatarString(
              '<td style="{0}" class="quantidadeApostas">0</td>',
              styleTableTdValue
            ) +
            GameBot.Extra.FormatarString(
              '<td style="{0}">Maior aposta</td>',
              styleTableTdKey
            ) +
            GameBot.Extra.FormatarString(
              '<td style="{0}" class="maiorAposta">0</td>',
              styleTableTdValue
            ) +
            GameBot.Extra.FormatarString("</tr>") +
            GameBot.Extra.FormatarString("<tr>") +
            GameBot.Extra.FormatarString(
              '<td style="{0}">Ganhos</td>',
              styleTableTdKey
            ) +
            GameBot.Extra.FormatarString(
              '<td style="{0}" class="ganhos">0,00000000</td>',
              styleTableTdValue
            ) +
            GameBot.Extra.FormatarString(
              '<td style="{0}">Total apostado</td>',
              styleTableTdKey
            ) +
            GameBot.Extra.FormatarString(
              '<td style="{0}" class="totalApostas">0</td>',
              styleTableTdValue
            ) +
            GameBot.Extra.FormatarString("</tr>") +
            GameBot.Extra.FormatarString("<tr>") +
            GameBot.Extra.FormatarString(
              '<td colspan="4"><div style="{0}"></div></td>',
              styleDivisor
            ) +
            GameBot.Extra.FormatarString("</tr>") +
            GameBot.Extra.FormatarString("<tr>") +
            GameBot.Extra.FormatarString(
              '<td style="{0}">Apostas ganhas</td>',
              styleTableTdKey
            ) +
            GameBot.Extra.FormatarString(
              '<td style="{0}" class="apostasGanhas">0</td>',
              styleTableTdValue
            ) +
            GameBot.Extra.FormatarString(
              '<td style="{0}">Apostas perdidas</td>',
              styleTableTdKey
            ) +
            GameBot.Extra.FormatarString(
              '<td style="{0}" class="apostasPerdidas">0</td>',
              styleTableTdValue
            ) +
            GameBot.Extra.FormatarString("</tr>") +
            GameBot.Extra.FormatarString("<tr>") +
            GameBot.Extra.FormatarString(
              '<td style="{0}">Em sequ&ecirc;ncia</td>',
              styleTableTdKey
            ) +
            GameBot.Extra.FormatarString(
              '<td style="{0}" class="sequenciaGanhando">0</td>',
              styleTableTdValue
            ) +
            GameBot.Extra.FormatarString(
              '<td style="{0}">Em sequ&ecirc;ncia</td>',
              styleTableTdKey
            ) +
            GameBot.Extra.FormatarString(
              '<td style="{0}" class="sequenciaPerdendo">0</td>',
              styleTableTdValue
            ) +
            GameBot.Extra.FormatarString("</tr>") +
            GameBot.Extra.FormatarString("<tr>") +
            GameBot.Extra.FormatarString(
              '<td style="{0}">Maior sequ&ecirc;ncia</td>',
              styleTableTdKey
            ) +
            GameBot.Extra.FormatarString(
              '<td style="{0}" class="sequenciaMaximaGanhando">0</td>',
              styleTableTdValue
            ) +
            GameBot.Extra.FormatarString(
              '<td style="{0}">Maior sequência</td>',
              styleTableTdKey
            ) +
            GameBot.Extra.FormatarString(
              '<td style="{0}" class="sequenciaMaximaPerdendo">0</td>',
              styleTableTdValue
            ) +
            GameBot.Extra.FormatarString("</tr>") +
            GameBot.Extra.FormatarString(
              '<tr><td colspan="4">{0}</td></tr>',
              GameBot.Definicoes.HtmlDivisor
            ) +
            GameBot.Extra.FormatarString("<tr>") +
            GameBot.Extra.FormatarString(
              '<td colspan="4" style="padding: 0; vertical-align: middle; font-size: 15px; text-align: center;">Ganhos e Perdas</td>'
            ) +
            GameBot.Extra.FormatarString("</tr>") +
            GameBot.Extra.FormatarString(
              '<tr><td colspan="4"><table class="ganhaPerde"><tr><td></td></tr></table></td></tr>'
            ) +
            GameBot.Extra.FormatarString("<tr>") +
            GameBot.Extra.FormatarString('<td colspan="1">') +
            GameBot.Extra.FormatarString(
              '<div id="graficoGanhaPerdePizza" class="grafico"><div>Carregando...</div></div>'
            ) +
            GameBot.Extra.FormatarString("</td>") +
            GameBot.Extra.FormatarString('<td colspan="3">') +
            GameBot.Extra.FormatarString(
              '<div id="graficoGanhaPerdeBarras" class="grafico"><div>Carregando...</div></div>'
            ) +
            GameBot.Extra.FormatarString("</td>") +
            GameBot.Extra.FormatarString("</tr>") +
            GameBot.Extra.FormatarString(
              '<tr><td colspan="4">{0}</td></tr>',
              GameBot.Definicoes.HtmlDivisor
            ) +
            GameBot.Extra.FormatarString("<tr>") +
            GameBot.Extra.FormatarString(
              '<td colspan="4" style="text-align: center;">'
            ) +
            GameBot.Extra.FormatarString(
              '<button id="reset">Limpar dados</button> '
            ) +
            GameBot.Extra.FormatarString(
              '<button id="atualizarPaginaSemParametros">Atualizar p&aacute;gina</button> '
            ) +
            GameBot.Extra.FormatarString(
              '<button id="atualizarPaginaComParametros">Atualizar com par&acirc;metros</button> '
            ) +
            GameBot.Extra.FormatarString("</td>") +
            GameBot.Extra.FormatarString("</tr>") +
            GameBot.Extra.FormatarString("</table>") +
            GameBot.Definicoes.HtmlDivisor +
            GameBot.Extra.FormatarString(
              '<div style="font-weight: bold; background-color: aliceblue; padding: 0.5em; border: 1px solid silver; border-radius: 3px; opacity: 0.8;">Instru&ccedil;&otilde;es:'
            ) +
            GameBot.Extra.FormatarString(
              '<ul style="margin: 0; padding: 0.5em 0 0 2em; font-weight: normal;">'
            ) +
            GameBot.Extra.FormatarString(
              "<li>Limpar os dados tem efeito apenas visual.</li>"
            ) +
            GameBot.Extra.FormatarString(
              "<li>Atualizar a p&aacute;gina faz com que os ajustes que voc&ecirc; definiu sejam perdidos. Mas atualizar com par&acirc;metros mant&eacute;m todos os ajustes quando o {0} for carregado novamente.</li>",
              GameBot.Definicoes.NomeDaAplicacao
            ) +
            GameBot.Extra.FormatarString("</ul></div>"),

          onLoad: function () {
            GameBot.Objetos.TempoCorrido = $(
              ".tempoCorrido",
              "." + GameBot.Definicoes.ClassCssIdentificadora
            );
            GameBot.Objetos.Velocidade = $(
              ".velocidade",
              "." + GameBot.Definicoes.ClassCssIdentificadora
            );
            GameBot.Objetos.QuantidadeApostas = $(
              ".quantidadeApostas",
              "." + GameBot.Definicoes.ClassCssIdentificadora
            );
            GameBot.Objetos.MaiorAposta = $(
              ".maiorAposta",
              "." + GameBot.Definicoes.ClassCssIdentificadora
            );
            GameBot.Objetos.TotalApostas = $(
              ".totalApostas",
              "." + GameBot.Definicoes.ClassCssIdentificadora
            );
            GameBot.Objetos.Ganhos = $(
              ".ganhos",
              "." + GameBot.Definicoes.ClassCssIdentificadora
            );
            GameBot.Objetos.ApostasGanhas = $(
              ".apostasGanhas",
              "." + GameBot.Definicoes.ClassCssIdentificadora
            );
            GameBot.Objetos.Perdas = $(
              ".perdas",
              "." + GameBot.Definicoes.ClassCssIdentificadora
            );
            GameBot.Objetos.ApostasPerdidas = $(
              ".apostasPerdidas",
              "." + GameBot.Definicoes.ClassCssIdentificadora
            );
            GameBot.Objetos.SequenciaGanhando = $(
              ".sequenciaGanhando",
              "." + GameBot.Definicoes.ClassCssIdentificadora
            );
            GameBot.Objetos.SequenciaMaximaGanhando = $(
              ".sequenciaMaximaGanhando",
              "." + GameBot.Definicoes.ClassCssIdentificadora
            );
            GameBot.Objetos.SequenciaPerdendo = $(
              ".sequenciaPerdendo",
              "." + GameBot.Definicoes.ClassCssIdentificadora
            );
            GameBot.Objetos.SequenciaMaximaPerdendo = $(
              ".sequenciaMaximaPerdendo",
              "." + GameBot.Definicoes.ClassCssIdentificadora
            );

            GameBot.Extra.CarregarStylesheetCode(
              "." +
                GameBot.Definicoes.ClassCssIdentificadora +
                " table .grafico { width: 100%; min-height: 100px; background-color: #f9f9f9; border: 1px solid gainsboro; text-align: center; }" +
                "." +
                GameBot.Definicoes.ClassCssIdentificadora +
                " table .grafico > div { margin-top: 20px; }" +
                "." +
                GameBot.Definicoes.ClassCssIdentificadora +
                " table.ganhaPerde { width: 100%; }" +
                "." +
                GameBot.Definicoes.ClassCssIdentificadora +
                " table.ganhaPerde td { background-color: silver; padding: 3px; text-align: center; font-size: 10px; }" +
                "." +
                GameBot.Definicoes.ClassCssIdentificadora +
                " table.ganhaPerde td.ganha { background-color: #95D85D; font-size: 0px; }" +
                "." +
                GameBot.Definicoes.ClassCssIdentificadora +
                " table.ganhaPerde td.perde { background-color: #f05b4f; font-size: 0px; }"
            );

            GameBot.Objetos.GraficoGanhaPerdeTr = $(
              ".ganhaPerde tr",
              "." + GameBot.Definicoes.ClassCssIdentificadora
            );
            GameBot.Objetos.GraficoGanhaPerdeTdNeutroHtml =
              GameBot.Objetos.GraficoGanhaPerdeTr.find("td").get(0).outerHTML;
            GameBot.Objetos.GraficoGanhaPerdeItens = 0;
            GameBot.Objetos.GraficoGanhaPerdeFunction = function (valor) {
              var limiteDePontos = 10;

              if (valor === null) {
                GameBot.Objetos.GraficoGanhaPerdeItens = 0;
                GameBot.Objetos.GraficoGanhaPerdeTr.html(
                  GameBot.Objetos.GraficoGanhaPerdeTdNeutroHtml
                );
              } else {
                var ganhaOuPerde = valor >= 0 ? "ganha" : "perde";
                var htmlTd = GameBot.Extra.FormatarString(
                  '<td class="{0}">&nbsp;</td>',
                  ganhaOuPerde
                );
                if (!GameBot.Objetos.GraficoGanhaPerdeItens) {
                  GameBot.Objetos.GraficoGanhaPerdeVazio = false;
                  GameBot.Objetos.GraficoGanhaPerdeTr.html(htmlTd);
                } else {
                  GameBot.Objetos.GraficoGanhaPerdeTr.append(htmlTd);
                  if (
                    limiteDePontos > 0 &&
                    GameBot.Objetos.GraficoGanhaPerdeItens >= limiteDePontos
                  ) {
                    GameBot.Objetos.GraficoGanhaPerdeTr.find(":first").remove();
                  }
                }
                GameBot.Objetos.GraficoGanhaPerdeItens++;
                GameBot.Objetos.GraficoGanhaPerdePizzaFunction(valor);
                GameBot.Objetos.GraficoGanhaPerdeBarrasFunction(valor);
              }
            };

            GameBot.Objetos.atualizarPaginaComParametros = $(
              "#atualizarPaginaComParametros",
              "." + GameBot.Definicoes.ClassCssIdentificadora
            ).button();
            GameBot.Objetos.atualizarPaginaComParametros.click(function () {
              GameBot.Util.Info(
                GameBot.Extra.FormatarString(
                  "Reiniciando... Ap&oacute;s a atualiza&ccedil;&atilde;o da p&aacute;gina verifique se o {0} foi carregado. Os par&acirc;metros ser&atilde;o carregados assim que o {0} for carregado.",
                  GameBot.Definicoes.NomeDaAplicacao
                )
              );
              setTimeout(function () {
                GameBot.Util.AtualizarPagina(true);
              }, 5000);
            });

            GameBot.Objetos.AtualizarPaginaSemParametros = $(
              "#atualizarPaginaSemParametros",
              "." + GameBot.Definicoes.ClassCssIdentificadora
            ).button();
            GameBot.Objetos.AtualizarPaginaSemParametros.click(function () {
              GameBot.Util.Info(
                GameBot.Extra.FormatarString(
                  "Reiniciando... Ap&oacute;s a atualiza&ccedil;&atilde;o da p&aacute;gina verifique se o {0} foi carregado. Quando o {0} for carregado os par&acirc;metros ser&atilde;o reiniciados para seus valores padr&atilde;o.",
                  GameBot.Definicoes.NomeDaAplicacao
                )
              );
              setTimeout(function () {
                GameBot.Util.AtualizarPagina(false);
              }, 5000);
            });

            GameBot.Objetos.GraficoSaldoReset = $(
              "#reset",
              "." + GameBot.Definicoes.ClassCssIdentificadora
            ).button();
            GameBot.Objetos.GraficoSaldoReset.click(function () {
              GameBot.Util.Info(
                GameBot.Extra.FormatarString(
                  "Os dados foram apagados.",
                  GameBot.Definicoes.NomeDaAplicacao
                )
              );
              GameBot.Objetos.CarregarEstatisticasFunction(true);
              GameBot.Objetos.GraficoSaldoFunction(null);
            });

            GameBot.Objetos.GraficoGanhaPerdePizza = $(
              "#graficoGanhaPerdePizza",
              "." + GameBot.Definicoes.ClassCssIdentificadora
            );
            GameBot.Objetos.GraficoGanhaPerdePizzaFunction = function (valor) {
              if (!GameBot.Objetos.GraficoGanhaPerdePizzaChartist) {
                GameBot.Objetos.GraficoGanhaPerdePizza.html("");

                GameBot.Objetos.GraficoGanhaPerdePizzaChartistData = {
                  series: [1, 1],
                };
                GameBot.Objetos.GraficoGanhaPerdePizzaChartistOptions = {
                  width: "100%",
                  height: "150px",
                  fullWidth: true,
                  chartPadding: 3,
                  labelInterpolationFnc: function (value, serie) {
                    var total =
                      GameBot.Objetos.GraficoGanhaPerdePizzaChartistData
                        .series[0] +
                      GameBot.Objetos.GraficoGanhaPerdePizzaChartistData
                        .series[1];
                    var valor = parseInt(
                      (GameBot.Objetos.GraficoGanhaPerdePizzaChartistData
                        .series[serie] /
                        total) *
                        100
                    );
                    return valor + "%";
                  },
                };

                GameBot.Extra.CarregarStylesheetCode(
                  "." +
                    GameBot.Definicoes.ClassCssIdentificadora +
                    " #graficoGanhaPerdePizza .ct-series-a .ct-slice-pie { fill: #95D85D; }" +
                    "." +
                    GameBot.Definicoes.ClassCssIdentificadora +
                    " #graficoGanhaPerdePizza .ct-series-b .ct-slice-pie { fill: #f05b4f; }" +
                    "." +
                    GameBot.Definicoes.ClassCssIdentificadora +
                    " #graficoGanhaPerdePizza .ct-label { font-size: 1.8em; }"
                );

                GameBot.Objetos.GraficoGanhaPerdePizzaChartist =
                  new Chartist.Pie(
                    GameBot.Objetos.GraficoGanhaPerdePizza.get(0),
                    GameBot.Objetos.GraficoGanhaPerdePizzaChartistData,
                    GameBot.Objetos.GraficoGanhaPerdePizzaChartistOptions
                  );
              }

              if (valor === null) {
                GameBot.Objetos.GraficoGanhaPerdePizzaChartistData.series[0] = 1;
                GameBot.Objetos.GraficoGanhaPerdePizzaChartistData.series[1] = 1;
                GameBot.Objetos.GraficoGanhaPerdePizzaChartist.update();
              }

              if (typeof valor !== "number") return;

              if (valor >= 0) {
                GameBot.Objetos.GraficoGanhaPerdePizzaChartistData.series[0]++;
              } else {
                GameBot.Objetos.GraficoGanhaPerdePizzaChartistData.series[1]++;
              }
              GameBot.Objetos.GraficoGanhaPerdePizzaChartist.update();
            };
            GameBot.Objetos.GraficoGanhaPerdePizzaFunction();

            GameBot.Objetos.GraficoGanhaPerdeBarras = $(
              "#graficoGanhaPerdeBarras",
              "." + GameBot.Definicoes.ClassCssIdentificadora
            );
            GameBot.Objetos.GraficoGanhaPerdeBarrasFunction = function (valor) {
              var limiteDePontos = 100;

              if (!GameBot.Objetos.GraficoGanhaPerdeBarrasChartist) {
                GameBot.Objetos.GraficoGanhaPerdeBarras.html("");

                GameBot.Objetos.GraficoGanhaPerdeBarrasChartistData = {
                  series: [[], []],
                };
                GameBot.Objetos.GraficoGanhaPerdeBarrasChartistOptions = {
                  width: "100%",
                  height: "150px",
                  fullWidth: true,
                  chartPadding: 3,
                  stackBars: true,
                  fullWidth: true,
                  showLabel: false,
                  axisX: {
                    showGrid: false,
                    showLabel: false,
                    offset: 0,
                  },
                  axisY: {
                    showGrid: false,
                    showLabel: false,
                    offset: 0,
                  },
                };

                GameBot.Extra.CarregarStylesheetCode(
                  "." +
                    GameBot.Definicoes.ClassCssIdentificadora +
                    " #graficoGanhaPerdeBarras .ct-series-b .ct-bar { stroke: #95D85D; stroke-width: 2px; }" +
                    "." +
                    GameBot.Definicoes.ClassCssIdentificadora +
                    " #graficoGanhaPerdeBarras .ct-series-a .ct-bar { stroke: #f05b4f; stroke-width: 2px; }"
                );

                GameBot.Objetos.GraficoGanhaPerdeBarrasChartist =
                  new Chartist.Bar(
                    GameBot.Objetos.GraficoGanhaPerdeBarras.get(0),
                    GameBot.Objetos.GraficoGanhaPerdeBarrasChartistData,
                    GameBot.Objetos.GraficoGanhaPerdeBarrasChartistOptions
                  );
              }

              if (valor === null) {
                GameBot.Objetos.GraficoGanhaPerdeBarrasChartistData.series[0].length = 0;
                GameBot.Objetos.GraficoGanhaPerdeBarrasChartistData.series[1].length = 0;
                GameBot.Objetos.GraficoGanhaPerdeBarrasChartist.update();
              }

              if (typeof valor !== "number") return;

              var enfase = 10;
              if (valor >= 0) {
                GameBot.Objetos.GraficoGanhaPerdeBarrasChartistData.series[0].push(
                  0
                );
                GameBot.Objetos.GraficoGanhaPerdeBarrasChartistData.series[1].push(
                  Math.abs(valor) + enfase
                );
              } else {
                GameBot.Objetos.GraficoGanhaPerdeBarrasChartistData.series[0].push(
                  Math.abs(valor) + enfase
                );
                GameBot.Objetos.GraficoGanhaPerdeBarrasChartistData.series[1].push(
                  0
                );
              }

              if (
                limiteDePontos > 0 &&
                GameBot.Objetos.GraficoGanhaPerdeBarrasChartistData.series[0]
                  .length > limiteDePontos
              ) {
                GameBot.Objetos.GraficoGanhaPerdeBarrasChartistData.labels.shift();
                GameBot.Objetos.GraficoGanhaPerdeBarrasChartistData.series[0].shift();
                GameBot.Objetos.GraficoGanhaPerdeBarrasChartistData.series[1].shift();
              }

              GameBot.Objetos.GraficoGanhaPerdeBarrasChartist.update();
            };
            GameBot.Objetos.GraficoGanhaPerdeBarrasFunction();

            GameBot.Objetos.GraficoSaldo = $(
              "#graficoSaldo",
              "." + GameBot.Definicoes.ClassCssIdentificadora
            );
            GameBot.Objetos.GraficoSaldoUltimoValor = null;
            GameBot.Objetos.GraficoSaldoFunction = function (valor) {
              var limiteDePontos = 2000;

              if (!GameBot.Objetos.GraficoSaldoChartist) {
                GameBot.Objetos.GraficoSaldo.html("");

                GameBot.Objetos.GraficoSaldoChartistData = {
                  labels: [],
                  series: [[]],
                };
                GameBot.Objetos.GraficoSaldoChartistOptions = {
                  width: "100%",
                  height: "150px",
                  showPoint: false,
                  showLine: true,
                  showArea: false,
                  fullWidth: true,
                  showLabel: false,
                  axisX: {
                    showGrid: false,
                    showLabel: false,
                    offset: 0,
                  },
                  axisY: {
                    showGrid: false,
                    showLabel: true,
                    offset: 40,
                  },
                  lineSmooth: Chartist.Interpolation.simple() /* .step()*/,
                  chartPadding: 3,
                };

                GameBot.Extra.CarregarStylesheetCode(
                  "." +
                    GameBot.Definicoes.ClassCssIdentificadora +
                    " #graficoSaldo .ct-series-a .ct-line, .ct-series-a .ct-point { stroke: darkcyan; }" +
                    "." +
                    GameBot.Definicoes.ClassCssIdentificadora +
                    " #graficoSaldo .ct-line { stroke-width: 2px; }" +
                    "." +
                    GameBot.Definicoes.ClassCssIdentificadora +
                    " #graficoSaldo .ct-point { stroke-width: 6px; }" +
                    "." +
                    GameBot.Definicoes.ClassCssIdentificadora +
                    " #graficoSaldo .ct-label { font-size: 0.8em; } "
                );

                GameBot.Objetos.GraficoSaldoChartist = new Chartist.Line(
                  GameBot.Objetos.GraficoSaldo.get(0),
                  GameBot.Objetos.GraficoSaldoChartistData,
                  GameBot.Objetos.GraficoSaldoChartistOptions
                );
              }

              if (valor === null) {
                GameBot.Objetos.GraficoSaldoUltimoValor = null;
                GameBot.Objetos.GraficoSaldoChartistData.labels.length = 0;
                GameBot.Objetos.GraficoSaldoChartistData.series[0].length = 0;
                GameBot.Objetos.GraficoSaldoChartist.update();
                valor = GameBot.Regras.Atual().SaldoAtual();

                GameBot.Objetos.GraficoGanhaPerdeFunction(null);
                GameBot.Objetos.GraficoGanhaPerdePizzaFunction(null);
                GameBot.Objetos.GraficoGanhaPerdeBarrasFunction(null);
              }

              if (typeof valor !== "number") return;

              GameBot.Objetos.GraficoSaldoChartistData.series[0].push(valor);

              if (
                limiteDePontos > 0 &&
                GameBot.Objetos.GraficoSaldoChartistData.series[0].length >
                  limiteDePontos
              ) {
                GameBot.Objetos.GraficoSaldoChartistData.labels.shift();
                GameBot.Objetos.GraficoSaldoChartistData.series[0].shift();
              }

              if (
                GameBot.Objetos.GraficoSaldoChartistOptions.low == undefined ||
                valor < GameBot.Objetos.GraficoSaldoChartistOptions.low
              ) {
                GameBot.Objetos.GraficoSaldoChartistOptions.low = valor;
              }

              if (
                GameBot.Objetos.GraficoSaldoChartistOptions.high == undefined ||
                valor > GameBot.Objetos.GraficoSaldoChartistOptions.high
              ) {
                GameBot.Objetos.GraficoSaldoChartistOptions.high = valor;
              }

              if (
                GameBot.Objetos.ModalDeControles &&
                GameBot.Objetos.ModalDeControles.is(":visible")
              ) {
                delete GameBot.Objetos.GraficoSaldoChartistOptions.high;
                delete GameBot.Objetos.GraficoSaldoChartistOptions.low;

                GameBot.Objetos.GraficoSaldoChartist.update(
                  GameBot.Objetos.GraficoSaldoChartistData,
                  GameBot.Objetos.GraficoSaldoChartistOptions
                );
              }

              if (
                GameBot.Objetos.GraficoSaldoChartistData.series[0].length == 1
              ) {
                GameBot.Objetos.GraficoSaldoFunction(valor);
              } else if (GameBot.Objetos.GraficoSaldoUltimoValor !== null) {
                GameBot.Objetos.GraficoGanhaPerdeFunction(
                  valor - GameBot.Objetos.GraficoSaldoUltimoValor
                );
              }
              GameBot.Objetos.GraficoSaldoUltimoValor = valor;
            };

            GameBot.Objetos.CarregarEstatisticasFunction = function (limpar) {
              var estatisticas = GameBot.Regras.Atual().Estatisticas(limpar);
              var separadorDecimal = GameBot.Regras.Atual().SeparadorDecimal();

              if (!limpar) {
                GameBot.Objetos.GraficoSaldoFunction(estatisticas.Saldo);
              }
              GameBot.Objetos.TempoCorrido.html(estatisticas.TempoCorrido);
              GameBot.Objetos.Velocidade.html(
                estatisticas.Velocidade.toFixed(2).replace(
                  ".",
                  separadorDecimal
                ) + " aposta/seg."
              );
              GameBot.Objetos.QuantidadeApostas.html(
                estatisticas.QuantidadeApostas
              );
              GameBot.Objetos.MaiorAposta.html(
                GameBot.Util.NumericoTexto(estatisticas.MaiorAposta)
              );
              GameBot.Objetos.TotalApostas.html(
                GameBot.Util.NumericoTexto(estatisticas.TotalApostas)
              );
              GameBot.Objetos.Ganhos.html(
                GameBot.Util.NumericoTexto(estatisticas.Ganhos)
              );
              GameBot.Objetos.ApostasGanhas.html(estatisticas.ApostasGanhas);
              GameBot.Objetos.Perdas.html(
                GameBot.Util.NumericoTexto(estatisticas.Perdas)
              );
              GameBot.Objetos.ApostasPerdidas.html(
                estatisticas.ApostasPerdidas
              );
              GameBot.Objetos.SequenciaGanhando.html(
                estatisticas.SequenciaGanhando
              );
              GameBot.Objetos.SequenciaMaximaGanhando.html(
                estatisticas.SequenciaMaximaGanhando
              );
              GameBot.Objetos.SequenciaPerdendo.html(
                estatisticas.SequenciaPerdendo
              );
              GameBot.Objetos.SequenciaMaximaPerdendo.html(
                estatisticas.SequenciaMaximaPerdendo
              );
            };

            setTimeout(function () {
              GameBot.Objetos.GraficoSaldoFunction(null);
              GameBot.Objetos.CarregarEstatisticasFunction(true);
            }, 1000);
          },

          onModalOpen: function () {
            if (GameBot.Objetos.GraficoSaldoChartist) {
              GameBot.Objetos.GraficoSaldoChartist.update();
            }
          },

          onLoop: function () {
            GameBot.Objetos.CarregarEstatisticasFunction();
          },

          getConfiguracoes: null,

          setConfiguracoes: null,
        };

        return GameBot.Definicoes.EstatisticasInstancia;
      },

      GaleriaDeAudio: function () {
        if (GameBot.Definicoes.GaleriaDeAudioInstancia)
          return GameBot.Definicoes.GaleriaDeAudioInstancia;

        var $ = jQuery;

        GameBot.Definicoes.GaleriaDeAudioInstancia = {
          aberto: false,

          titulo: "Galeria de &aacute;udios",

          html: function () {
            if (GameBot.Definicoes.HtmlGaleriaDeAudio)
              return GameBot.Definicoes.HtmlGaleriaDeAudio;

            var htmlMask =
              '<button id="play{0}" class="audioPlay" >Teste</button> {0}';
            var html = "";
            for (key in GameBot.Audios) {
              if (html) {
                html += GameBot.Definicoes.HtmlDivisor;
              }
              html += GameBot.Extra.FormatarString(htmlMask, key);
            }

            GameBot.Definicoes.HtmlGaleriaDeAudio = html;

            return html;
          },

          onLoad: function () {
            $(".audioPlay", "." + GameBot.Definicoes.ClassCssIdentificadora)
              .button()
              .on("click", function () {
                var audio = $(this).attr("id").replace("play", "");
                GameBot.Util.Audio(audio, 1, true);
              });
          },

          onLoop: null,

          getConfiguracoes: null,

          setConfiguracoes: null,
        };

        return GameBot.Definicoes.GaleriaDeAudioInstancia;
      },

      Configuracoes: function () {
        if (GameBot.Definicoes.ConfiguracoesInstancia)
          return GameBot.Definicoes.ConfiguracoesInstancia;

        var $ = jQuery;

        GameBot.Definicoes.ConfiguracoesInstancia = {
          aberto: false,

          titulo: "Configura&ccedil;&otilde;es",

          html:
            GameBot.Extra.FormatarString(
              '<label for="configuracoesJson" style="display: block;">Grave as configura&ccedil;&otilde;es abaixo para poder reconfigurar as op&ccedil;&otilde;es caso seja necess&aacute;rio recarregar a p&aacute;gina. Depois, basta &lt;strong&gt;colar (CTRL+V) e Aplicar.</strong></label>'
            ) +
            GameBot.Definicoes.HtmlDivisor +
            GameBot.Extra.FormatarString(
              '<div id="configuracoesJson" style="height: 150px;"></div>'
            ) +
            GameBot.Definicoes.HtmlDivisor +
            GameBot.Extra.FormatarString(
              '<button id="configuracoesCopiar">Copiar conte&uacute;do (CTRL+C)</button> '
            ) +
            GameBot.Extra.FormatarString(
              '<button id="configuracoesRecarregar">Recarregar</button> '
            ) +
            GameBot.Extra.FormatarString(
              '<button id="configuracoesAplicar">Aplicar</button>'
            ),

          onLoad: function () {
            GameBot.Objetos.ConfiguracoesCopiar = $(
              "#configuracoesCopiar",
              "." + GameBot.Definicoes.ClassCssIdentificadora
            ).button();
            GameBot.Objetos.ConfiguracoesCopiar.on("click", function () {
              var backupSelection =
                GameBot.Objetos.ConfiguracoesJsonEditor.selection.toJSON();
              GameBot.Objetos.ConfiguracoesJsonEditor.selectAll();
              GameBot.Objetos.ConfiguracoesJsonEditor.focus();
              try {
                document.execCommand("copy");
                GameBot.Util.Info("Conte&uacute;do copiado (CTRL+C).");
              } catch (ex) {
                GameBot.Util.Erro(
                  "N&atilde;o foi poss&iacute;vel copiar o conteudo. Fa&ccedil;a manualmente com CTRL+C"
                );
              }
              GameBot.Objetos.ConfiguracoesJsonEditor.selection.fromJSON(
                backupSelection
              );
            });

            GameBot.Objetos.ConfiguracoesRecarregar = $(
              "#configuracoesRecarregar",
              "." + GameBot.Definicoes.ClassCssIdentificadora
            ).button();
            var fRecarregar = function () {
              var configuracoes =
                GameBot.Nucleo.ModulosDeControle.Configuracoes().Atual();
              GameBot.Objetos.ConfiguracoesJsonEditor.setValue(
                GameBot.Extra.ToString(configuracoes)
              );
              GameBot.Objetos.ConfiguracoesJsonEditor.selection.clearSelection();
            };
            GameBot.Objetos.ConfiguracoesRecarregar.on("click", fRecarregar);
            $("#Configuracoes")
              .siblings("h3.Configuracoes")
              .on("click", fRecarregar);

            GameBot.Objetos.ConfiguracoesAplicar = $(
              "#configuracoesAplicar",
              "." + GameBot.Definicoes.ClassCssIdentificadora
            ).button();
            GameBot.Objetos.ConfiguracoesAplicar.on("click", function () {
              var json = GameBot.Objetos.ConfiguracoesJsonEditor.getValue();
              try {
                jsonParse = JSON.parse(json);
                GameBot.Nucleo.ModulosDeControle.Configuracoes().Atual(
                  jsonParse
                );
                GameBot.Util.Info("Configura&ccedil;&otilde;es aplicadas.");
              } catch (ex) {
                GameBot.Util.Erro(
                  "Configura&ccedil;&otilde;es inv&aacute;lidas. {0}",
                  ex
                );
              }
            });

            GameBot.Objetos.ConfiguracoesJson = $(
              "#configuracoesJson",
              "." + GameBot.Definicoes.ClassCssIdentificadora
            );
            GameBot.Objetos.ConfiguracoesJsonEditor =
              ace.edit("configuracoesJson");
            GameBot.Objetos.ConfiguracoesJsonEditor.setTheme(
              "ace/theme/twilight"
            );
            GameBot.Objetos.ConfiguracoesJsonEditor.session.setMode(
              "ace/mode/json"
            );
            GameBot.Objetos.ConfiguracoesJsonEditor.session.setTabSize(2);
            GameBot.Objetos.ConfiguracoesJsonEditor.session.setUseWrapMode(
              true
            );
            GameBot.Objetos.ConfiguracoesRecarregar.click();
          },

          onLoop: null,

          getConfiguracoes: null,

          setConfiguracoes: null,

          Atual: function (configuracoes) {
            if (configuracoes) {
              for (var key in GameBot.Nucleo.ModulosDeControle) {
                var setConfiguracoes =
                  GameBot.Nucleo.ModulosDeControle[key]().setConfiguracoes;
                if (
                  typeof setConfiguracoes === "function" &&
                  configuracoes.hasOwnProperty(key)
                ) {
                  setConfiguracoes(configuracoes[key]);
                }
              }

              if (configuracoes.hasOwnProperty("l")) {
                GameBot.Definicoes.licmod = configuracoes["l"];
              }

              GameBot.Objetos.ConfiguracoesRecarregar.click();
            }

            var configuracoes = {};
            for (var key in GameBot.Nucleo.ModulosDeControle) {
              var getConfiguracoes =
                GameBot.Nucleo.ModulosDeControle[key]().getConfiguracoes;
              if (typeof getConfiguracoes === "function") {
                configuracoes[key] = getConfiguracoes();
              }
            }

            if (
              GameBot.Definicoes.licmod &&
              GameBot.Definicoes.licmod.length &&
              !isFinite(GameBot.Definicoes.licmod)
            ) {
              configuracoes["l"] = GameBot.Definicoes.licmod;
            }

            return configuracoes;
          },

          Base64: function (base64, enderecoUnico) {
            var jsonBase64;
            if (base64) {
              try {
                jsonBase64 = JSON.parse(atob(base64));
                delete jsonBase64.id;
              } catch (ex) {
                jsonBase64 = null;
              }
            }

            var configuracoes =
              GameBot.Nucleo.ModulosDeControle.Configuracoes().Atual(
                jsonBase64 ? jsonBase64 : undefined
              );
            if (enderecoUnico) configuracoes.id = Date.now();
            return btoa(JSON.stringify(configuracoes));
          },
        };

        return GameBot.Definicoes.ConfiguracoesInstancia;
      },
    },

    CarregarParametrosIniciais: function () {
      var $ = jQuery;

      GameBot.Definicoes = $.extend(GameBot.Definicoes, params, {
        ParametrosInicializados: true,
      });
    },

    PrepararControlesNaTela: function () {
      var $ = jQuery;

      $("body").append(
        GameBot.Extra.FormatarString(
          '<button id="ativador" class="{1}">{0}</button>',
          GameBot.Definicoes.NomeDaAplicacao,
          GameBot.Definicoes.ClassCssIdentificadora
        )
      );
      $("#ativador." + GameBot.Definicoes.ClassCssIdentificadora)
        .button()
        .css({
          position: "fixed",
          bottom: "10px",
          right: "10px",
          "z-index": "10000002",
          "background-color": "dodgerblue",
          color: "white",
          "font-weight": "bold",
          "font-size": "1.2em",
        })
        .click(function () {
          GameBot.Nucleo.JanelaDeControles();
        });
      GameBot.Nucleo.JanelaDeControles(GameBot.Definicoes.JanelaAberta);
    },

    JanelaDeControles: function (modo) {
      var $ = jQuery;

      if (!this.GameBot.Objetos.ModalDeControles) {
        var modulosOnLoad = [];
        var modulosOnModalOpen = [];

        GameBot.Definicoes.HtmlDivisor = '<div style="height: 15px;"></div>';

        var website = GameBot.Regras.Atual().NomeDoServico();

        var htmlModal = "";
        htmlModal += GameBot.Extra.FormatarString(
          '<div id="controlador" class="{0}" title="{1}">',
          GameBot.Definicoes.ClassCssIdentificadora,
          GameBot.Definicoes.NomeDaAplicacao
        );
        htmlModal += GameBot.Extra.FormatarString(
          '<div class="cabecalho" style="background-image: url(\'http://info.cabral.srv.br/GameBot/r2d2.jpg\'); background-position: 20px 0; background-repeat: no-repeat; background-size: contain; margin-bottom: -2px; padding-left: 155px;padding-left: 155px; height: 100px;">'
        );
        htmlModal += GameBot.Extra.FormatarString(
          "<h1 style=\"font-family: 'Bowlby One SC', cursive; margin: 0; font-size: 25px; font-weight: normal; color: royalblue;\">{0}</h1>",
          GameBot.Definicoes.NomeDaAplicacao
        );
        htmlModal += GameBot.Extra.FormatarString(
          "<h2 style=\"font-family: 'Bangers', cursive; margin: 0; font-size: 14px; font-weight: normal; color: cornflowerblue;\">O seu rob&ocirc; para automatizar suas jogadas.</h2>"
        );
        htmlModal += GameBot.Extra.FormatarString(
          '<div style="margin-top: 7px; font-size: 13px;">Patch JavaScript para o website <span style="color: forestgreen; text-decoration: italic;">{0}</span></div>',
          website
        );
        htmlModal += GameBot.Extra.FormatarString("</div>");
        htmlModal += GameBot.Extra.FormatarString('<div class="conteudo">');
        var indexModulo = -1;
        for (var key in GameBot.Nucleo.ModulosDeControle) {
          indexModulo++;
          var modulo = $.extend(
            {
              exibir: true,
              titulo: "",
              html: "",
              onLoad: null,
              onModalOpen: null,
            },
            GameBot.Nucleo.ModulosDeControle[key]()
          );
          var html =
            typeof modulo.html === "function" ? modulo.html() : modulo.html;
          htmlModal += GameBot.Extra.FormatarString(
            '<h3 class="{1}" style="text-align: left;">{2}</h3><div id="{1}" class="modulo modulo{0} {4}">{3}</div>',
            indexModulo + 1,
            key,
            modulo.titulo ? modulo.titulo : key,
            html,
            modulo.aberto ? "padraoAberto" : ""
          );
          if (typeof modulo.onLoad === "function") {
            modulosOnLoad.push(modulo.onLoad);
          }
          if (typeof modulo.onModalOpen === "function") {
            modulosOnModalOpen.push(modulo.onModalOpen);
          }

          GameBot.Util.Log("Carregado m&oacute;dulo {0}.", key);
        }
        htmlModal += GameBot.Extra.FormatarString("</div>");
        htmlModal += GameBot.Extra.FormatarString("</div>");

        GameBot.Extra.CarregarStylesheetCode(
          "." +
            GameBot.Definicoes.ClassCssIdentificadora +
            " .ui-accordion .ui-accordion-content { padding: 10px; }"
        );

        GameBot.Objetos.ModalDeControles = $(htmlModal).dialog({
          position: { my: "center top", at: "center top+5%", of: window },
          width: 477,
          height: window.innerHeight * 0.9,
          minWidth: 477,
          open: function () {
            var dialog = $(this).closest(".ui-dialog");

            if (!GameBot.Objetos.ModalDeControles) {
              dialog.css({
                "font-size": "12px",
                "z-index": "10000001",
              });

              var htmlModalTitle = "";
              htmlModalTitle += GameBot.Extra.FormatarString(
                '<div class="loop" style="position: absolute; right: 110px; width: 140px; height: 11px; top: 8px;" data-style="width: 100%; margin: 0px; background-color: silver; border-width: 0px;"></div>'
              );
              htmlModalTitle += GameBot.Extra.FormatarString(
                '<button id="executarAgora" style="position: absolute; right: 28px; height: 19px; padding: 2px; width: 75px; top: 4px;">Jogar</button>'
              );
              $(".ui-dialog-titlebar", dialog).append(htmlModalTitle);

              GameBot.Objetos.IndicadorDeLoop = $(".loop", dialog).progressbar({
                value: 100,
              });
              GameBot.Objetos.IndicadorDeLoop.find(".ui-widget-header").attr(
                "style",
                GameBot.Objetos.IndicadorDeLoop.attr("data-style")
              );

              GameBot.Objetos.ExecutarAgora = $(
                "#executarAgora",
                dialog
              ).button();
              GameBot.Objetos.ExecutarAgora.on("click", function () {
                if (GameBot.Definicoes.LoopAtivado) {
                  GameBot.Nucleo.ModulosDeControle.Loop().setConfiguracoes({
                    Ativado: false,
                  });
                  GameBot.Util.Info(
                    "O modo autom&aacute;tico de jogadas foi desativado."
                  );
                } else {
                  GameBot.Nucleo.Loop(null, true);
                }
              });

              GameBot.Objetos.ConteudoDeControle = $(
                ".conteudo",
                dialog
              ).accordion({
                collapsible: true,
                active: false,
                heightStyle: "content",
              });
              $("h3", GameBot.Objetos.ConteudoDeControle)
                .addClass("ui-state-active")
                .off("click")
                .click(function () {
                  $(this).next().slideToggle("fast");
                });
              $(
                ".ui-accordion-content.padraoAberto",
                GameBot.Objetos.ConteudoDeControle
              ).show();

              for (var i = 0; i < modulosOnLoad.length; i++) {
                modulosOnLoad[i]();
              }

              GameBot.Objetos.ModalControle = $("#controlador", dialog);
              dialog.resize(function () {
                setTimeout(function () {
                  GameBot.Objetos.ModalControle.width(
                    dialog.width() - 24 + "px"
                  );
                }, 100);
              });
            }
            for (var i = 0; i < modulosOnModalOpen.length; i++) {
              modulosOnModalOpen[i]();
            }
          },
        });

        modo = modo === undefined ? true : modo;

        GameBot.Nucleo.Loop(
          GameBot.Nucleo.ModulosDeControle.Loop().getConfiguracoes().Ativado
        );
      } else {
        modo =
          arguments.length > 0
            ? modo
            : !GameBot.Objetos.ModalDeControles.is(":visible");
      }

      if (modo) {
        GameBot.Objetos.ModalDeControles.dialog();
      } else {
        GameBot.Objetos.ModalDeControles.dialog("close");
      }
    },

    LoopProgresso: function (progressoAtual, cancelar) {
      clearTimeout(GameBot.Definicoes.IdTimeoutLoopProgresso);

      var velocidadeDoIndicador = 100;

      if (progressoAtual !== undefined) {
        GameBot.Definicoes.IndicadorProgressoAtual = progressoAtual;
      } else {
        GameBot.Definicoes.IndicadorProgressoAtual += 1;
      }

      var percentual =
        (100 / (GameBot.Definicoes.LoopIntervalo / velocidadeDoIndicador)) *
        GameBot.Definicoes.IndicadorProgressoAtual;

      if (GameBot.Objetos.ModalDeControles.is(":visible")) {
        GameBot.Objetos.IndicadorDeLoop.progressbar({
          value: 100 - percentual * 1.05,
        });
      }

      if (percentual <= 100 && !cancelar) {
        GameBot.Definicoes.IdTimeoutLoopProgresso = setTimeout(
          GameBot.Nucleo.LoopProgresso,
          velocidadeDoIndicador
        );
      }
    },

    Loop: function (modo, verbose) {
      clearTimeout(GameBot.Definicoes.IdTimeoutLoop);

      var $ = jQuery;

      if (modo !== null) {
        GameBot.Definicoes.LoopAtivado =
          modo !== undefined ? !!modo : GameBot.Definicoes.LoopAtivado;
      }

      if (modo === undefined || modo === null || modo) {
        if (!GameBot.Definicoes.LoopEmAndamento) {
          GameBot.Definicoes.LoopTentativa = null;

          GameBot.Nucleo.LoopRegrasDeNegocio(function () {
            for (var key in GameBot.Nucleo.ModulosDeControle) {
              var onLoop = GameBot.Nucleo.ModulosDeControle[key]().onLoop;
              if (typeof onLoop === "function") onLoop();
            }
          });

          GameBot.Nucleo.LoopProgresso(0, !GameBot.Definicoes.LoopAtivado);

          if (GameBot.Definicoes.LoopAtivado) {
            GameBot.Definicoes.IdTimeoutLoop = setTimeout(
              GameBot.Nucleo.Loop,
              GameBot.Definicoes.LoopIntervalo
            );
          }
        } else {
          GameBot.Definicoes.LoopTentativa = isFinite(
            GameBot.Definicoes.LoopTentativa
          )
            ? GameBot.Definicoes.LoopTentativa + 1
            : 0;
          if (GameBot.Definicoes.LoopTentativa % 100 == 0 || verbose) {
            GameBot.Util.Erro(
              "A &uacute;ltima jogada ainda n&atilde;o obteve resposta do servidor. Aguardando... Enquanto isso verifique sua conex&atilde;o com a internet."
            );
          }
          GameBot.Definicoes.IdTimeoutLoop = setTimeout(
            GameBot.Nucleo.Loop,
            100
          );
        }
      } else {
        GameBot.Nucleo.LoopProgresso(0, true);
      }
    },

    LoopRegrasDeNegocio: function (onAposLoop) {
      GameBot.Util.Log("loop");

      GameBot.Definicoes.LoopEmAndamento = true;

      GameBot.Definicoes.ApostasEmAndamento = GameBot.Definicoes
        .ApostasEmAndamento
        ? GameBot.Definicoes.ApostasEmAndamento
        : [];

      var fApostar = function (indexSimultaneo) {
        if (
          GameBot.Definicoes.ApostasEmAndamento[
            !indexSimultaneo ? 0 : indexSimultaneo
          ]
        ) {
          return;
        }

        GameBot.Definicoes.ApostasEmAndamento[
          !indexSimultaneo ? 0 : indexSimultaneo
        ] = true;

        GameBot.Regras.Atual().Jogar(function () {
          GameBot.Definicoes.LoopEmAndamento = false;
          GameBot.Definicoes.ApostasEmAndamento[
            !indexSimultaneo ? 0 : indexSimultaneo
          ] = false;
          if (typeof onAposLoop === "function") {
            onAposLoop();
          }
        });
      };
      fApostar(0);

      if (typeof window.fApostar !== "function") {
        window.fApostar = fApostar;
      }
      var jogadasSimultaneas = parseInt(
        GameBot.Objetos.JogadasSimultaneas.val()
      );
      for (var i = 1; i <= jogadasSimultaneas; i++) {
        setTimeout("window.fApostar(" + i + ");", 1 * i);
      }
    },

    InterceptarAjax: function () {
      XMLHttpRequest.prototype.send2 = XMLHttpRequest.prototype.send;
      XMLHttpRequest.prototype.send = function (queryString) {
        this.addEventListener("load", function (e) {
          if (!GameBot.Objetos.LoopAtivado.prop("checked")) {
            var response = JSON.parse(this.response);
            GameBot.Regras.Atual().Jogar(null, response);
            GameBot.Objetos.CarregarEstatisticasFunction();
          }
        });
        this.send2(queryString);
      };
    },
  };

  if (GameBot.Definicoes.InicializacaoAutomatica) this.Inicializar();

  return this;
})();
//var script = document.createElement('script'); script.src = 'https://cdn.awsli.com.br/640/640398/arquivos/GameBot.js'; document.head.appendChild(script);
