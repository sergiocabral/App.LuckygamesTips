window.ExchangeBTC = (function (params) {
  if (window.ExchangeBTC) return window.ExchangeBTC;

  this.ExchangeBTC = this;

  this.Inicializar = function () {
    ExchangeBTC.Carregar.JQuery(function () {
      ExchangeBTC.Carregar.JQueryUI(
        function () {
          ExchangeBTC.Carregar.JQueryToastPlugin(function () {
            ExchangeBTC.Carregar.Chartist(function () {
              ExchangeBTC.Carregar.AceEditor(function () {
                ExchangeBTC.Nucleo.CarregarParametrosIniciais();
                ExchangeBTC.Nucleo.PrepararControlesNaTela();
                ExchangeBTC.Nucleo.CarregarParametros();
              }, true);
            }, true);
          }, true);
        },
        true,
        "base"
      );
    }, true);
  };

  this.Definicoes = {
    ExchangeBTC: this,

    InicializacaoAutomatica: true,

    JanelaAberta: false,

    LoopAtivado: true,

    LoopIntervalo: 30000,

    ModoDebug: false,

    NomeDaAplicacao: "Exchange BTC ++",

    ClassCssIdentificadora: "ExBTC",

    Configuracoes: {},
  };

  this.Audios = {
    Tick: "http://info.cabral.br.com/ExchangeBTC/audio_tick.mp3",
    Sirene: "http://info.cabral.br.com/ExchangeBTC/audio_sirene.mp3",
  };

  this.Objetos = {
    ExchangeBTC: this,
  };

  this.Regras = {
    ExchangeBTC: this,

    Atual: function () {
      if (!ExchangeBTC.Definicoes.RegraAtual) {
        if (String(location.href).toLowerCase().indexOf("poloniex") >= 0) {
          ExchangeBTC.Definicoes.RegraAtual = ExchangeBTC.Regras.Poloniex;
        } else if (
          String(location.href).toLowerCase().indexOf("walltime") >= 0
        ) {
          ExchangeBTC.Definicoes.RegraAtual = ExchangeBTC.Regras.Walltime;
        } else if (
          String(location.href).toLowerCase().indexOf("flowbtc") >= 0
        ) {
          ExchangeBTC.Definicoes.RegraAtual = ExchangeBTC.Regras.FlowBTC;
        } else if (String(location.href).toLowerCase().indexOf("foxbit") >= 0) {
          ExchangeBTC.Definicoes.RegraAtual = ExchangeBTC.Regras.FoxBit;
        }
      }

      return ExchangeBTC.Definicoes.RegraAtual;
    },

    Formatar: function (num, casasDecimais, returnFloat) {
      var this_ = ExchangeBTC.Regras.Atual();
      num = num.trim();
      var separadorDecimalPadrao = this_.SeparadorDecimalPadrao();
      var separadorDecimal = this_.SeparadorDecimal();
      var numerico = isFinite(num)
        ? parseFloat(num)
        : parseFloat(
            ExchangeBTC.Extra.ReplaceAll(
              ExchangeBTC.Extra.ReplaceAll(
                String(num),
                separadorDecimalPadrao == "." ? "," : ".",
                ""
              ),
              ",",
              "."
            )
          );
      numerico = isFinite(numerico) ? numerico : 0;
      if (returnFloat) {
        return numerico;
      }
      var texto = String(numerico).replace(".", separadorDecimal);
      texto =
        texto.indexOf(separadorDecimal) >= 0 ? texto : texto + separadorDecimal;
      var casasDecimaisAtuais =
        texto.length - texto.indexOf(separadorDecimal) - 1;
      if (casasDecimaisAtuais > casasDecimais) {
        texto = String(
          Math.round(parseFloat(texto) * Math.pow(10, casasDecimais)) /
            Math.pow(10, casasDecimais)
        );
        texto =
          texto.indexOf(separadorDecimal) >= 0
            ? texto
            : texto + separadorDecimal;
        casasDecimaisAtuais =
          texto.length - texto.indexOf(separadorDecimal) - 1;
      }

      if (casasDecimaisAtuais < casasDecimais) {
        texto += Array(casasDecimais - casasDecimaisAtuais + 1).join("0");
      }

      if (texto.length && texto[texto.length - 1] == separadorDecimal) {
        texto = texto.substr(0, texto.length - 1);
      }

      return texto;
    },

    MoedaDecimais: function (id, text, separador, set) {
      var this_ = ExchangeBTC.Regras.Atual();

      id = "val" + id;
      if (set === undefined) {
        if (this_[id] === undefined) {
          var exemplo = text.trim() + separador;
          this_[id] =
            exemplo == separador
              ? 2
              : exemplo
                  .substr(exemplo.indexOf(separador) + 1)
                  .replace(separador, "").length;
        }
      } else {
        this_[id] = set;
      }

      return this_[id];
    },

    Poloniex: {
      AbrirPaginaExchange: function () {
        if (location.href.toLowerCase().indexOf("/exchange") < 0) {
          ExchangeBTC.Util.AtualizarPagina("https://poloniex.com/exchange");
          return true;
        }
        return false;
      },

      RequerLogin: function (usuario, senha) {
        var $ = jQuery;

        var loginNecessario = $('a[href="/login"]:first').is(":visible");
        if (loginNecessario && usuario && senha) {
          if ($("form .signUpButton").length) {
            $("input#username").val(usuario);
            $("input#password").val(senha);
            $("form .signUpButton").click();
          } else {
            ExchangeBTC.Util.AtualizarPagina(
              $('a[href="/login"]:first').attr("href")
            );
          }
        }

        return loginNecessario;
      },

      RequerAtualizarPagina: function () {
        return false;
      },

      MoedaPrimariaDecimais: function (set) {
        var this_ = ExchangeBTC.Regras.Atual();
        var $ = jQuery;
        return ExchangeBTC.Regras.MoedaDecimais(
          "MoedaPrimariaDecimais",
          $(".buyOrders table .orderRate:first").text(),
          ".",
          set
        );
      },

      MoedaNegociacaoDecimais: function (set) {
        var this_ = ExchangeBTC.Regras.Atual();
        var $ = jQuery;
        return ExchangeBTC.Regras.MoedaDecimais(
          "MoedaNegociacaoDecimais",
          $(".buyOrders table .orderAmount:first").text(),
          ".",
          set
        );
      },

      SeparadorDecimalPadrao: function (set) {
        return ".";
      },

      SeparadorDecimal: function (set) {
        var this_ = ExchangeBTC.Regras.Atual();

        if (set === undefined) {
          if (this_.valSeparadorDecimal === undefined) {
            this_.valSeparadorDecimal = this_.SeparadorDecimalPadrao();
          }
        } else {
          this_.valSeparadorDecimal = set;
        }

        return this_.valSeparadorDecimal;
      },

      MoedaPrimariaNome: function () {
        var $ = jQuery;
        return $(".currency.primaryCurrency:first").text();
      },

      MoedaNegociacaoNome: function () {
        var $ = jQuery;
        return $(".currency.secondaryCurrency:first").text();
      },

      MoedaPrimariaTotal: function (returnFloat) {
        var this_ = ExchangeBTC.Regras.Atual();

        var $ = jQuery;
        return ExchangeBTC.Regras.Formatar(
          $("#primaryBalance:first").text(),
          this_.MoedaPrimariaDecimais(),
          returnFloat
        );
      },

      MoedaNegociacaoTotal: function (returnFloat) {
        var this_ = ExchangeBTC.Regras.Atual();

        var $ = jQuery;
        return ExchangeBTC.Regras.Formatar(
          $("#secondaryBalance:first").text(),
          this_.MoedaNegociacaoDecimais(),
          returnFloat
        );
      },

      MoedaNegociacaoCompra: function (returnFloat) {
        var this_ = ExchangeBTC.Regras.Atual();

        var $ = jQuery;
        return ExchangeBTC.Regras.Formatar(
          $(".buyOrders table .orderRate:first").text(),
          this_.MoedaPrimariaDecimais(),
          returnFloat
        );
      },

      MoedaNegociacaoVenda: function (returnFloat) {
        var this_ = ExchangeBTC.Regras.Atual();

        var $ = jQuery;
        return ExchangeBTC.Regras.Formatar(
          $(".sellOrders table .orderRate:first").text(),
          this_.MoedaPrimariaDecimais(),
          returnFloat
        );
      },
    },

    FlowBTC: {
      AbrirPaginaExchange: function () {
        if (location.href.toLowerCase().indexOf("#/trade") < 0) {
          ExchangeBTC.Util.AtualizarPagina(
            "https://trader.flowbtc.com/app.html#/trade"
          );
          return true;
        }
        return false;
      },

      RequerLogin: function (usuario, senha) {
        var $ = jQuery;

        var loginNecessario = $("header .btn[ng-click='signIn()']").is(
          ":visible"
        );
        if (loginNecessario && usuario && senha) {
          $("header .btn[ng-click='signIn()']").click();
          setTimeout(function () {
            $("input#email").val(usuario);
            $("input#password").val(senha);
            $(".btn[ng-click='ok()']").click();
          }, 1000);
        }

        return loginNecessario;
      },

      RequerAtualizarPagina: function () {
        return false;
      },

      MoedaPrimariaDecimais: function (set) {
        var this_ = ExchangeBTC.Regras.Atual();

        var $ = jQuery;
        return ExchangeBTC.Regras.MoedaDecimais(
          "MoedaPrimariaDecimais",
          $(".block_buy_orders table tbody tr:first-child td:nth-child(2)")
            .text()
            .substr(2)
            .replace(".", ""),
          ",",
          set
        );
      },

      MoedaNegociacaoDecimais: function (set) {
        var this_ = ExchangeBTC.Regras.Atual();

        var $ = jQuery;
        return ExchangeBTC.Regras.MoedaDecimais(
          "MoedaNegociacaoDecimais",
          $(".block_buy_orders table tbody tr:first-child td:nth-child(1)")
            .text()
            .replace(".", ""),
          ",",
          set
        );
      },

      SeparadorDecimalPadrao: function (set) {
        return ",";
      },

      SeparadorDecimal: function (set) {
        var this_ = ExchangeBTC.Regras.Atual();

        if (set === undefined) {
          if (this_.valSeparadorDecimal === undefined) {
            this_.valSeparadorDecimal = this_.SeparadorDecimalPadrao();
          }
        } else {
          this_.valSeparadorDecimal = set;
        }

        return this_.valSeparadorDecimal;
      },

      MoedaPrimariaNome: function () {
        var $ = jQuery;

        return $(".sell_block_interior h3:first").text();
      },

      MoedaNegociacaoNome: function () {
        var $ = jQuery;

        return $(".buy_block_interior h3:first").text();
      },

      MoedaPrimariaTotal: function (returnFloat) {
        var this_ = ExchangeBTC.Regras.Atual();

        var $ = jQuery;
        return ExchangeBTC.Regras.Formatar(
          $("#primaryBalance:first").text(),
          this_.MoedaPrimariaDecimais(),
          returnFloat
        );
      },

      MoedaNegociacaoTotal: function (returnFloat) {
        var this_ = ExchangeBTC.Regras.Atual();

        var $ = jQuery;
        return ExchangeBTC.Regras.Formatar(
          $(".buy_block_interior span").text().replace(".", ""),
          this_.MoedaNegociacaoDecimais(),
          returnFloat
        );
      },

      MoedaNegociacaoCompra: function (returnFloat) {
        var this_ = ExchangeBTC.Regras.Atual();

        var $ = jQuery;
        return ExchangeBTC.Regras.Formatar(
          $(".block_buy_orders table tbody tr:first-child td:nth-child(2)")
            .text()
            .replace(".", "")
            .substr(2),
          this_.MoedaPrimariaDecimais(),
          returnFloat
        );
      },

      MoedaNegociacaoVenda: function (returnFloat) {
        var this_ = ExchangeBTC.Regras.Atual();

        var $ = jQuery;
        return ExchangeBTC.Regras.Formatar(
          $(".block_sell_orders table tbody tr:first-child td:nth-child(2)")
            .text()
            .replace(".", "")
            .substr(2),
          this_.MoedaPrimariaDecimais(),
          returnFloat
        );
      },
    },

    Walltime: {
      AbrirPaginaExchange: function () {
        if (location.href.toLowerCase().indexOf("/index_pt.html") < 0) {
          ExchangeBTC.Util.AtualizarPagina(
            "https://walltime.info/index_pt.html"
          );
          return true;
        }
        return false;
      },

      RequerLogin: function (usuario, senha) {
        var $ = jQuery;

        var loginNecessario = $("#login-button").is(":visible");
        if (loginNecessario && usuario && senha) {
          $("input#email").val(usuario);
          $("input#password").val(senha);
          $("#login-button").click();
        }
        return loginNecessario;
      },

      RequerAtualizarPagina: function () {
        var $ = jQuery;
        return $("#warn-session-will-expire").is(":visible");
      },

      MoedaPrimariaDecimais: function (set) {
        var this_ = ExchangeBTC.Regras.Atual();
        var $ = jQuery;
        return ExchangeBTC.Regras.MoedaDecimais(
          "MoedaPrimariaDecimais",
          $("#balance-brl span:not(.unit)").text(),
          ",",
          set
        );
      },

      MoedaNegociacaoDecimais: function (set) {
        var this_ = ExchangeBTC.Regras.Atual();
        var $ = jQuery;
        return ExchangeBTC.Regras.MoedaDecimais(
          "MoedaNegociacaoDecimais",
          $("#balance-xbt > span:not(.unit)").text(),
          ",",
          set
        );
      },

      SeparadorDecimalPadrao: function (set) {
        return ",";
      },

      SeparadorDecimal: function (set) {
        var this_ = ExchangeBTC.Regras.Atual();

        if (set === undefined) {
          if (this_.valSeparadorDecimal === undefined) {
            this_.valSeparadorDecimal = this_.SeparadorDecimalPadrao();
          }
        } else {
          this_.valSeparadorDecimal = set;
        }

        return this_.valSeparadorDecimal;
      },

      MoedaPrimariaNome: function () {
        var $ = jQuery;
        return $("#balance-brl span.unit").text();
      },

      MoedaNegociacaoNome: function () {
        var $ = jQuery;
        return $("#balance-xbt span.unit").text();
      },

      MoedaPrimariaTotal: function (returnFloat) {
        var this_ = ExchangeBTC.Regras.Atual();

        var $ = jQuery;
        return ExchangeBTC.Regras.Formatar(
          $("#balance-brl span:not(.unit)").text().replace(".", ""),
          this_.MoedaPrimariaDecimais(),
          returnFloat
        );
      },

      MoedaNegociacaoTotal: function (returnFloat) {
        var this_ = ExchangeBTC.Regras.Atual();

        var $ = jQuery;
        return ExchangeBTC.Regras.Formatar(
          $("#balance-xbt span:not(.unit)").text().replace(".", ""),
          this_.MoedaNegociacaoDecimais(),
          returnFloat
        );
      },

      MoedaNegociacaoCompra: function (returnFloat) {
        var this_ = ExchangeBTC.Regras.Atual();

        var $ = jQuery;
        return ExchangeBTC.Regras.Formatar(
          $("#market-buy tr:first-child span.unit-green")
            .siblings("span")
            .text()
            .replace(".", ""),
          this_.MoedaPrimariaDecimais(),
          returnFloat
        );
      },

      MoedaNegociacaoVenda: function (returnFloat) {
        var this_ = ExchangeBTC.Regras.Atual();

        var $ = jQuery;
        return ExchangeBTC.Regras.Formatar(
          $("#market-sell tr:first-child span.unit-red")
            .siblings("span")
            .text()
            .replace(".", ""),
          this_.MoedaPrimariaDecimais(),
          returnFloat
        );
      },
    },

    FoxBit: {
      AbrirPaginaExchange: function () {
        if (location.href.toLowerCase().indexOf("#offerbook") < 0) {
          ExchangeBTC.Util.AtualizarPagina(
            "https://foxbit.exchange/#offerbook"
          );
          return true;
        }
        return false;
      },

      RequerLogin: function (usuario, senha) {
        var $ = jQuery;

        var loginNecessario = $(".btn-signin").is(":visible");
        if (loginNecessario && usuario && senha) {
          $(".btn-signin").click();
          setTimeout(function () {
            $("#id_username").val(usuario);
            $("#id_password").val(senha);
            $(".btn-login").click();
          }, 500);
        }
        return loginNecessario;
      },

      RequerAtualizarPagina: function () {
        return false;
      },

      MoedaPrimariaDecimais: function (set) {
        var this_ = ExchangeBTC.Regras.Atual();

        var $ = jQuery;
        return ExchangeBTC.Regras.MoedaDecimais(
          "MoedaPrimariaDecimais",
          $(".order-form__balance:first strong")
            .text()
            .substr(2)
            .trim()
            .replace(".", ""),
          ",",
          set
        );
      },

      MoedaNegociacaoDecimais: function (set) {
        var this_ = ExchangeBTC.Regras.Atual();

        var $ = jQuery;
        return ExchangeBTC.Regras.MoedaDecimais(
          "MoedaNegociacaoDecimais",
          $(".order-form__balance:last strong")
            .text()
            .substr(1)
            .trim()
            .replace(".", ""),
          ",",
          set
        );
      },

      SeparadorDecimalPadrao: function (set) {
        return ",";
      },

      SeparadorDecimal: function (set) {
        var this_ = ExchangeBTC.Regras.Atual();

        if (set === undefined) {
          if (this_.valSeparadorDecimal === undefined) {
            this_.valSeparadorDecimal = this_.SeparadorDecimalPadrao();
          }
        } else {
          this_.valSeparadorDecimal = set;
        }

        return this_.valSeparadorDecimal;
      },

      MoedaPrimariaNome: function () {
        var $ = jQuery;

        var moeda = $(".order-form__balance:first strong").text();
        moeda = moeda.substr(0, moeda.indexOf(" ")).trim();

        return moeda;
      },

      MoedaNegociacaoNome: function () {
        var $ = jQuery;

        var moeda = $(".order-form__balance:last strong").text();
        moeda = moeda.substr(0, moeda.indexOf(" ")).trim();

        return moeda;
      },

      MoedaPrimariaTotal: function (returnFloat) {
        var this_ = ExchangeBTC.Regras.Atual();

        var $ = jQuery;
        return ExchangeBTC.Regras.Formatar(
          $(".order-form__balance:first strong")
            .text()
            .substr(2)
            .trim()
            .replace(".", ""),
          this_.MoedaPrimariaDecimais(),
          returnFloat
        );
      },

      MoedaNegociacaoTotal: function (returnFloat) {
        var this_ = ExchangeBTC.Regras.Atual();

        var $ = jQuery;
        return ExchangeBTC.Regras.Formatar(
          $(".order-form__balance:last strong")
            .text()
            .substr(1)
            .trim()
            .replace(".", ""),
          this_.MoedaNegociacaoDecimais(),
          returnFloat
        );
      },

      MoedaNegociacaoCompra: function (returnFloat) {
        var this_ = ExchangeBTC.Regras.Atual();

        var $ = jQuery;
        return ExchangeBTC.Regras.Formatar(
          $(
            "#id_order_book_bid_content table tbody tr:first-child .order-book-price"
          )
            .text()
            .substr(2)
            .replace(".", "")
            .trim(),
          this_.MoedaPrimariaDecimais(),
          returnFloat
        );
      },

      MoedaNegociacaoVenda: function (returnFloat) {
        var this_ = ExchangeBTC.Regras.Atual();

        var $ = jQuery;
        return ExchangeBTC.Regras.Formatar(
          $(
            "#id_order_book_ask_content table tbody tr:first-child .order-book-price"
          )
            .text()
            .substr(2)
            .replace(".", "")
            .trim(),
          this_.MoedaPrimariaDecimais(),
          returnFloat
        );
      },
    },
  };

  this.Extra = {
    ExchangeBTC: this,

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
                      ExchangeBTC.Extra.ToString(obj[key], (ident || 1) + 1)
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
      var milisegundo = this.ZeroEsquerda(date.getMilliseconds(), 4);

      var data = formato;
      data = this.ReplaceAll(data, "d", dia);
      data = this.ReplaceAll(data, "M", mes);
      data = this.ReplaceAll(data, "a", ano);
      data = this.ReplaceAll(data, "y", ano);
      data = this.ReplaceAll(data, "h", hora);
      data = this.ReplaceAll(data, "m", minuto);
      data = this.ReplaceAll(data, "s", segundo);
      data = this.ReplaceAll(data, "z", milisegundo);

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
        ExchangeBTC.Util.Log(
          "jQuery j&aacute; carregado {0}",
          jQuery.fn.jquery
        );
        if (typeof fAposCarregar === "function") fAposCarregar();
      } else {
        ExchangeBTC.Extra.CarregarScript(
          "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js",
          function () {
            jQuery.noConflict();
            ExchangeBTC.Util.Log("Carregado jQuery {0}", jQuery.fn.jquery);
            if (typeof fAposCarregar === "function") fAposCarregar();
          }
        );
      }
    },

    JQueryUI: function (fAposCarregar, forcarCarregamento, tema) {
      if (window.jQuery.ui && !forcarCarregamento) {
        ExchangeBTC.Util.Log("jQuery UI j&aacute; carregado.");
        if (typeof fAposCarregar === "function") fAposCarregar();
      } else {
        tema = tema ? tema : "base";
        ExchangeBTC.Extra.CarregarStylesheet(
          "https://code.jquery.com/ui/1.12.1/themes/" + tema + "/jquery-ui.css",
          function () {
            ExchangeBTC.Extra.CarregarScript(
              "https://code.jquery.com/ui/1.12.1/jquery-ui.min.js",
              function () {
                ExchangeBTC.Util.Log("Carregado jQuery UI.");
                if (typeof fAposCarregar === "function") fAposCarregar();
              }
            );
          }
        );
      }
    },

    JQueryToastPlugin: function (fAposCarregar, forcarCarregamento) {
      if (window.jQuery.toast && !forcarCarregamento) {
        ExchangeBTC.Util.Log("jQuery Toast Plugin j&aacute; carregado.");
        if (typeof fAposCarregar === "function") fAposCarregar();
      } else {
        ExchangeBTC.Extra.CarregarStylesheet(
          "https://cdnjs.cloudflare.com/ajax/libs/jquery-toast-plugin/1.3.2/jquery.toast.min.css",
          function () {
            ExchangeBTC.Extra.CarregarScript(
              "https://cdnjs.cloudflare.com/ajax/libs/jquery-toast-plugin/1.3.2/jquery.toast.min.js",
              function () {
                ExchangeBTC.Util.Log("Carregado jQuery Toast Plugin.");
                if (typeof fAposCarregar === "function") fAposCarregar();
              }
            );
          }
        );
      }
    },

    Chartist: function (fAposCarregar, forcarCarregamento) {
      if (window.Chartist && !forcarCarregamento) {
        ExchangeBTC.Util.Log("Chartist j&aacute; carregado.");
        if (typeof fAposCarregar === "function") fAposCarregar();
      } else {
        ExchangeBTC.Extra.CarregarStylesheet(
          "https://cdnjs.cloudflare.com/ajax/libs/chartist/0.11.0/chartist.min.css",
          function () {
            ExchangeBTC.Extra.CarregarScript(
              "https://cdnjs.cloudflare.com/ajax/libs/chartist/0.11.0/chartist.min.js",
              function () {
                ExchangeBTC.Util.Log("Carregado Chartist Plugin.");
                if (typeof fAposCarregar === "function") fAposCarregar();
              }
            );
          }
        );
      }
    },

    AceEditor: function (fAposCarregar, forcarCarregamento) {
      if (window.ace && !forcarCarregamento) {
        ExchangeBTC.Util.Log("Ace Editor j&aacute; carregado.");
        if (typeof fAposCarregar === "function") fAposCarregar();
      } else {
        ExchangeBTC.Extra.CarregarScript(
          "https://cdnjs.cloudflare.com/ajax/libs/ace/1.3.3/ace.js",
          function () {
            ExchangeBTC.Util.Log("Carregado Ace Editor.");
            if (typeof fAposCarregar === "function") fAposCarregar();
          }
        );
      }
    },
  };

  this.Util = {
    ExchangeBTC: this,

    Toast: function (toast) {
      if (toast.debug && !ExchangeBTC.Definicoes.ModoDebug) return;

      var intervaloEntreExibicoes = 1000;

      ExchangeBTC.Definicoes.MensagensToast = Array.isArray(
        ExchangeBTC.Definicoes.MensagensToast
      )
        ? ExchangeBTC.Definicoes.MensagensToast
        : [];
      ExchangeBTC.Definicoes.MensagensToast.push(toast);

      var fToast = function (exibir) {
        if (
          !exibir ||
          !jQuery.toast ||
          !ExchangeBTC.Definicoes.ParametrosInicializados
        ) {
          if (!ExchangeBTC.Definicoes.IdIntervalToast) {
            ExchangeBTC.Definicoes.IdIntervalToast = setInterval(function () {
              fToast(true);
            }, intervaloEntreExibicoes);
            fToast(true);
          }
        } else {
          var $ = jQuery;

          var toast_ = ExchangeBTC.Definicoes.MensagensToast.shift();
          if (toast_) {
            if (!toast_.debug || ExchangeBTC.Definicoes.ModoDebug) {
              jQuery.toast(
                $.extend(
                  {
                    loader: false,
                    hideAfter: intervaloEntreExibicoes * 5,
                  },
                  toast_
                )
              );
            }
          }
          if (!ExchangeBTC.Definicoes.MensagensToast.length) {
            setTimeout(function () {
              clearInterval(ExchangeBTC.Definicoes.IdIntervalToast);
              ExchangeBTC.Definicoes.IdIntervalToast = 0;
            }, intervaloEntreExibicoes);
          }
        }
      };

      fToast();
    },

    Log: function (msg) {
      ExchangeBTC.Util.Toast({
        heading: "Log " + ExchangeBTC.Extra.FormatarData(),
        text: ExchangeBTC.Extra.FormatarString(arguments),
        debug: true,
      });
    },

    Erro: function (msg) {
      ExchangeBTC.Util.Toast({
        text: ExchangeBTC.Extra.FormatarString(arguments),
        icon: "error",
      });
    },

    Info: function (msg) {
      ExchangeBTC.Util.Toast({
        heading: "",
        text: ExchangeBTC.Extra.FormatarString(arguments),
        icon: "info",
      });
    },

    Audio: function (audio, volume, pausarQuandoTocando) {
      if (!audio) return;

      var id;
      var url;

      if (ExchangeBTC.Audios.hasOwnProperty(audio)) {
        id = audio;
        url = ExchangeBTC.Audios[audio];
      } else {
        id = "";
        url = audio;
      }

      var audio = ExchangeBTC.Objetos["Audio_" + id];
      if (!audio) {
        audio = new Audio(url);
        if (id) {
          ExchangeBTC.Objetos["Audio_" + id] = audio;
        }
      } else if (pausarQuandoTocando && audio.currentTime > 0 && !audio.ended) {
        audio.pause();
        audio.currentTime = 0;
        return;
      } else {
        audio.load();
      }
      audio.volume = isFinite(volume) ? volume / 100 : 1;
      if (audio.volume > 0) audio.play();
    },

    AudioHtmlSelect: function (id, className, selecionado, labelNenhum) {
      var htmlMaskOption = '<option value="{0}" {2}>{1}</option>';
      var html = "";
      html += ExchangeBTC.Extra.FormatarString(
        "<select {0} {1}>",
        id ? 'id="' + id + '"' : "",
        className ? 'class="' + className + '"' : ""
      );
      html += ExchangeBTC.Extra.FormatarString(
        htmlMaskOption,
        "",
        labelNenhum ? labelNenhum : ""
      );
      for (key in ExchangeBTC.Audios) {
        html += ExchangeBTC.Extra.FormatarString(
          htmlMaskOption,
          key,
          key,
          key == selecionado ? "selected" : ""
        );
      }
      html += ExchangeBTC.Extra.FormatarString("</select>");

      return html;
    },

    EventoSliderVolume: function (e) {
      var $ = jQuery;
      var jSlider = $(this);
      var volume = jSlider.slider("value");
      var jLabel = jSlider.siblings('label[for="' + jSlider.attr("id") + '"]');
      var text = jLabel.text();
      text = text.substr(0, text.indexOf(":") + 1) + " " + volume + "%";
      jLabel.text(text);
    },

    RegistraEventoSpinnerChange: function (jObj) {
      jObj.siblings(".ui-spinner-button").on("click", function () {
        jObj.trigger("change", ["spinner"]);
      });
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
          ExchangeBTC.Util.Info("Conte&uacute;do copiado (CTRL+C).");
        } catch (ex) {
          ExchangeBTC.Util.Erro(
            "N&atilde;o foi poss&iacute;vel copiar o conteudo. Fa&ccedil;a manualmente com CTRL+C"
          );
        }
      });
    },

    AtualizarPagina: function (url) {
      window.onbeforeunload = null;

      var href = url ? url : location.href;

      do {
        var configuracoes = /ExBTC=.*?(?=([#&]|$))/.exec(href);
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
        ExchangeBTC.Definicoes.ClassCssIdentificadora +
        "=" +
        ExchangeBTC.Nucleo.ModulosDeControle.Configuracoes().Base64();

      var url = urlPagina + configuracoes + urlParametros;

      location.href = url;
    },
  };

  this.Nucleo = {
    ExchangeBTC: this,

    CarregarParametros: function () {
      var parametros = /(?<=ExBTC=).*?(?=([#&]|$))/.exec(
        document.location.href
      );
      parametros = parametros && parametros.length ? parametros[0] : "";
      if (parametros) {
        try {
          ExchangeBTC.Nucleo.ModulosDeControle.Configuracoes().Base64(
            parametros
          );
        } catch (ex) {}
      }
    },

    ModulosDeControle: {
      Loop: function () {
        if (ExchangeBTC.Definicoes.LoopInstancia)
          return ExchangeBTC.Definicoes.LoopInstancia;

        var $ = jQuery;

        ExchangeBTC.Definicoes.LoopInstancia = {
          aberto: false,

          titulo: "Loop de processamento",

          html:
            ExchangeBTC.Extra.FormatarString(
              '<label for="loopAtivado">Ativado</label>'
            ) +
            ExchangeBTC.Extra.FormatarString(
              '<input type="radio" name="loopModo" id="loopAtivado">'
            ) +
            ExchangeBTC.Extra.FormatarString(
              '<label for="loopDesativado">Desativado</label>'
            ) +
            ExchangeBTC.Extra.FormatarString(
              '<input type="radio" name="loopModo" id="loopDesativado">'
            ) +
            ExchangeBTC.Definicoes.HtmlDivisor +
            ExchangeBTC.Extra.FormatarString(
              '<label style="display: inline-block; width: 120px;" for="audioLoop">Notifica&ccedil;&atilde;o em &aacute;udio: </label>'
            ) +
            ExchangeBTC.Util.AudioHtmlSelect(
              "audioLoop",
              "",
              "Tick",
              "Nenhum"
            ) +
            ExchangeBTC.Extra.FormatarString("<br />") +
            ExchangeBTC.Extra.FormatarString(
              '<label style="display: inline-block; width: 120px;" for="volumeAudioLoop">Volume: </label>'
            ) +
            ExchangeBTC.Extra.FormatarString(
              '<div id="volumeAudioLoop" style="width: 183px; display: inline-block; margin: 6px 0 -2px 6px;"></div>'
            ) +
            ExchangeBTC.Definicoes.HtmlDivisor +
            ExchangeBTC.Extra.FormatarString(
              '<label for="loopVelocidade">Tempo do loop: </label>'
            ) +
            ExchangeBTC.Extra.FormatarString(
              '<input type="text" id="loopVelocidade" name="loopVelocidade" style="width: 30px; padding: .222em 0; height: auto;" value="{0}" min="{1}" max="{2}" maxlength="{3}"> segundos',
              ExchangeBTC.Definicoes.LoopIntervalo / 1000,
              1,
              999,
              3
            ),

          onLoad: function () {
            ExchangeBTC.Objetos.LoopVelocidade = $(
              "#loopVelocidade",
              "." + ExchangeBTC.Definicoes.ClassCssIdentificadora
            ).spinner();

            $(
              'input[name="loopModo"]',
              "." + ExchangeBTC.Definicoes.ClassCssIdentificadora
            ).checkboxradio();

            ExchangeBTC.Objetos.LoopAtivado = $(
              "#loopAtivado",
              "." + ExchangeBTC.Definicoes.ClassCssIdentificadora
            )
              .prop("checked", !!ExchangeBTC.Definicoes.LoopAtivado)
              .button("refresh");
            ExchangeBTC.Objetos.LoopDesativado = $(
              "#loopDesativado",
              "." + ExchangeBTC.Definicoes.ClassCssIdentificadora
            )
              .prop("checked", !ExchangeBTC.Definicoes.LoopAtivado)
              .button("refresh");
            var fToggleLoopModo = function () {
              ExchangeBTC.Nucleo.Loop(
                $(
                  "#loopAtivado",
                  "." + ExchangeBTC.Definicoes.ClassCssIdentificadora
                ).prop("checked")
              );
              $(
                "#loopAtivado",
                "." + ExchangeBTC.Definicoes.ClassCssIdentificadora
              ).prop("checked", !!ExchangeBTC.Definicoes.LoopAtivado);
              $(
                "#loopDesativado",
                "." + ExchangeBTC.Definicoes.ClassCssIdentificadora
              ).prop("checked", !ExchangeBTC.Definicoes.LoopAtivado);
            };
            ExchangeBTC.Objetos.LoopAtivado.on("change", fToggleLoopModo);
            ExchangeBTC.Objetos.LoopDesativado.on("change", fToggleLoopModo);

            var idTimeoutChange;
            ExchangeBTC.Objetos.LoopVelocidade.on(
              "change",
              function (e, slider) {
                var val = parseInt($(this).val());
                var min = parseInt($(this).attr("min"));
                var max = parseInt($(this).attr("max"));
                if (val < min) val = min;
                if (val > max) val = max;
                if (isNaN(val))
                  val = ExchangeBTC.Definicoes.LoopIntervalo / 1000;
                $(this).val(val);

                var fChange = function () {
                  ExchangeBTC.Definicoes.LoopIntervalo = val * 1000;
                  ExchangeBTC.Nucleo.Loop(
                    $(
                      "#loopAtivado",
                      "." + ExchangeBTC.Definicoes.ClassCssIdentificadora
                    ).prop("checked")
                  );
                };
                clearTimeout(idTimeoutChange);
                if (slider) {
                  idTimeoutChange = setTimeout(fChange, 1000);
                } else {
                  fChange();
                }
              }
            );
            ExchangeBTC.Util.RegistraEventoSpinnerChange(
              ExchangeBTC.Objetos.LoopVelocidade
            );

            ExchangeBTC.Objetos.AudioLoop = $(
              "#audioLoop",
              "." + ExchangeBTC.Definicoes.ClassCssIdentificadora
            ).selectmenu({
              width: "200px",
            });
            ExchangeBTC.Objetos.VolumeAudioLoop = $(
              "#volumeAudioLoop",
              "." + ExchangeBTC.Definicoes.ClassCssIdentificadora
            ).slider({ value: 50 });
            ExchangeBTC.Objetos.VolumeAudioLoop.on(
              "slidechange",
              ExchangeBTC.Util.EventoSliderVolume
            );
            ExchangeBTC.Objetos.VolumeAudioLoop.trigger("slidechange");
          },

          onLoop: function () {
            var audio = ExchangeBTC.Objetos.AudioLoop.val();
            var volume =
              ExchangeBTC.Objetos.VolumeAudioLoop.slider("value") / 100;
            ExchangeBTC.Util.Audio(audio, volume);
          },

          getConfiguracoes: function () {
            return {
              Ativado: $(
                "#loopAtivado",
                "." + ExchangeBTC.Definicoes.ClassCssIdentificadora
              ).prop("checked"),
              Intervalo: parseInt(ExchangeBTC.Definicoes.LoopIntervalo / 1000),
              Audio: ExchangeBTC.Objetos.AudioLoop.val(),
              Volume: ExchangeBTC.Objetos.VolumeAudioLoop.slider("value"),
            };
          },

          setConfiguracoes: function (configuracoes) {
            if (!configuracoes) return;

            if (configuracoes.hasOwnProperty("Ativado")) {
              ExchangeBTC.Objetos.LoopAtivado.prop(
                "checked",
                !!configuracoes.Ativado
              );
              ExchangeBTC.Objetos.LoopDesativado.prop(
                "checked",
                !configuracoes.Ativado
              );

              ExchangeBTC.Objetos.LoopAtivado.trigger("change");

              ExchangeBTC.Objetos.LoopAtivado.button("refresh");
              ExchangeBTC.Objetos.LoopDesativado.button("refresh");
            }

            if (
              configuracoes.hasOwnProperty("Intervalo") &&
              isFinite(configuracoes.Intervalo)
            ) {
              ExchangeBTC.Objetos.LoopVelocidade.val(
                parseInt(configuracoes.Intervalo)
              ).trigger("change");
            }

            if (configuracoes.hasOwnProperty("Audio")) {
              ExchangeBTC.Objetos.AudioLoop.val(
                ExchangeBTC.Audios.hasOwnProperty(configuracoes.Audio)
                  ? configuracoes.Audio
                  : ""
              );
              ExchangeBTC.Objetos.AudioLoop.selectmenu("refresh").trigger(
                "slidechange"
              );
            }

            if (
              configuracoes.hasOwnProperty("Volume") &&
              isFinite(configuracoes.Volume)
            ) {
              ExchangeBTC.Objetos.VolumeAudioLoop.slider(
                "value",
                parseInt(configuracoes.Volume)
              ).trigger("slidechange");
            }
          },
        };

        return ExchangeBTC.Definicoes.LoopInstancia;
      },

      Valores: function () {
        if (ExchangeBTC.Definicoes.ValoresInstancia)
          return ExchangeBTC.Definicoes.ValoresInstancia;

        var $ = jQuery;

        var styleTitulo =
          "text-transform: uppercase; border-radius: 5px; background-color: silver; color: white; padding: 5px 0 3px; text-align: center; font-weight: bold; color: black;";
        var styleSubTitulo =
          "padding: 5px 20px; text-align: center; width: 50%";
        var styleValor =
          "position: relative; padding: 0 5px; text-align: center;";
        var styleInput =
          "height: auto; width: 90%; text-align: center; font-size: 1.5em; padding: 5px; font-weight: bold;";
        var fHtmlIndicador = function (corInvetida) {
          return ExchangeBTC.Extra.FormatarString(
            '<span class="indicador {0}" style="position: absolute; font-size: 1.5em; margin: 5px 0 0 5px;"></span>',
            corInvetida ? "invertido" : "padrao"
          );
        };

        ExchangeBTC.Definicoes.EventosValoresChange = Array.isArray(
          ExchangeBTC.Definicoes.EventosValoresChange
        )
          ? ExchangeBTC.Definicoes.EventosValoresChange
          : [];

        ExchangeBTC.Definicoes.ValoresInstancia = {
          aberto: true,

          titulo: "Valores na tela",

          html:
            ExchangeBTC.Extra.FormatarString(
              '<table style="width: 100%; margin-bottom: -5px;">'
            ) +
            ExchangeBTC.Extra.FormatarString("<tr>") +
            ExchangeBTC.Extra.FormatarString(
              '<td style="{0}">Formato decimal</td>',
              styleTitulo
            ) +
            ExchangeBTC.Extra.FormatarString("</tr>") +
            ExchangeBTC.Extra.FormatarString("<tr>") +
            ExchangeBTC.Extra.FormatarString(
              '<td style="padding: 5px 0; text-align: center; width: 50%">'
            ) +
            ExchangeBTC.Extra.FormatarString(
              '<label for="separadorDecimalVirgula">V&iacute;rgula</label>'
            ) +
            ExchangeBTC.Extra.FormatarString(
              '<input type="radio" name="separadorDecimal" id="separadorDecimalVirgula" value=",">'
            ) +
            ExchangeBTC.Extra.FormatarString(
              '<label for="separadorDecimalPonto">Ponto</label>'
            ) +
            ExchangeBTC.Extra.FormatarString(
              '<input type="radio" name="separadorDecimal" id="separadorDecimalPonto" value=".">'
            ) +
            ExchangeBTC.Extra.FormatarString("</td>") +
            ExchangeBTC.Extra.FormatarString("</tr>") +
            ExchangeBTC.Extra.FormatarString("</table>") +
            ExchangeBTC.Definicoes.HtmlDivisor +
            ExchangeBTC.Extra.FormatarString('<table style="width: 100%">') +
            ExchangeBTC.Extra.FormatarString("<tr>") +
            ExchangeBTC.Extra.FormatarString(
              '<td colspan="2" style="{0}">Moedas</td>',
              styleTitulo
            ) +
            ExchangeBTC.Extra.FormatarString("</tr>") +
            ExchangeBTC.Extra.FormatarString("<tr>") +
            ExchangeBTC.Extra.FormatarString(
              '<td style="{0}">Prim&aacute;ria</td>',
              styleSubTitulo
            ) +
            ExchangeBTC.Extra.FormatarString(
              '<td style="{0}">Negocia&ccedil;&atilde;o</td>',
              styleSubTitulo
            ) +
            ExchangeBTC.Extra.FormatarString("</tr>") +
            ExchangeBTC.Extra.FormatarString("<tr>") +
            ExchangeBTC.Extra.FormatarString(
              '<td style="{0}"><input type="text" id="moedaPrimariaNome" readonly style="{1}" /></td>',
              styleValor,
              styleInput
            ) +
            ExchangeBTC.Extra.FormatarString(
              '<td style="{0}"><input type="text" id="moedaNegociacaoNome" readonly style="{1}" /></td>',
              styleValor,
              styleInput
            ) +
            ExchangeBTC.Extra.FormatarString("</tr>") +
            ExchangeBTC.Extra.FormatarString("<tr>") +
            ExchangeBTC.Extra.FormatarString(
              '<td style="padding: 5px 0; text-align: center; width: 50%">'
            ) +
            ExchangeBTC.Extra.FormatarString(
              '<label for="moedaPrimariaDecimais">Decimais: </label>'
            ) +
            ExchangeBTC.Extra.FormatarString(
              '<input type="text" id="moedaPrimariaDecimais" style="width: 30px; padding: .222em 0; height: auto;" min="0" max="20" maxlength="2">'
            ) +
            ExchangeBTC.Extra.FormatarString("</td>") +
            ExchangeBTC.Extra.FormatarString(
              '<td style="padding: 5px 0; text-align: center; width: 50%">'
            ) +
            ExchangeBTC.Extra.FormatarString(
              '<label for="moedaNegociacaoDecimais">Decimais: </label>'
            ) +
            ExchangeBTC.Extra.FormatarString(
              '<input type="text" id="moedaNegociacaoDecimais" style="width: 30px; padding: .222em 0; height: auto;" min="0" max="20" maxlength="2">'
            ) +
            ExchangeBTC.Extra.FormatarString("</td>") +
            ExchangeBTC.Extra.FormatarString("</tr>") +
            ExchangeBTC.Extra.FormatarString("</table>") +
            ExchangeBTC.Definicoes.HtmlDivisor +
            ExchangeBTC.Extra.FormatarString('<table style="width: 100%">') +
            ExchangeBTC.Extra.FormatarString("<tr>") +
            ExchangeBTC.Extra.FormatarString(
              '<td colspan="2"style="{0}">Quanto voc&ecirc; tem</td>',
              styleTitulo
            ) +
            ExchangeBTC.Extra.FormatarString("</tr>") +
            ExchangeBTC.Extra.FormatarString("<tr>") +
            ExchangeBTC.Extra.FormatarString(
              '<td style="{0}">Moeda Prim&aacute;ria</td>',
              styleSubTitulo
            ) +
            ExchangeBTC.Extra.FormatarString(
              '<td style="{0}">Moeda de Negocia&ccedil;&atilde;o</td>',
              styleSubTitulo
            ) +
            ExchangeBTC.Extra.FormatarString("</tr>") +
            ExchangeBTC.Extra.FormatarString("<tr>") +
            ExchangeBTC.Extra.FormatarString(
              '<td style="{0}">{2}<input type="text" id="moedaPrimariaTotal" readonly style="{1} color: blue;" /></td>',
              styleValor,
              styleInput,
              fHtmlIndicador()
            ) +
            ExchangeBTC.Extra.FormatarString(
              '<td style="{0}">{2}<input type="text" id="moedaNegociacaoTotal" readonly style="{1} color: blue;" /></td>',
              styleValor,
              styleInput,
              fHtmlIndicador()
            ) +
            ExchangeBTC.Extra.FormatarString("</tr>") +
            ExchangeBTC.Extra.FormatarString("</table>") +
            ExchangeBTC.Definicoes.HtmlDivisor +
            ExchangeBTC.Extra.FormatarString('<table style="width: 100%">') +
            ExchangeBTC.Extra.FormatarString("<tr>") +
            ExchangeBTC.Extra.FormatarString(
              '<td colspan="2"style="{0}">Moeda de Negocia&ccedil;&atilde;o <span class="labelMoeda negociacao"></span></td>',
              styleTitulo
            ) +
            ExchangeBTC.Extra.FormatarString("</tr>") +
            ExchangeBTC.Extra.FormatarString("<tr>") +
            ExchangeBTC.Extra.FormatarString(
              '<td style="{0}"><label>Est&atilde;o <span style="font-weight: bold; color: #199359;">COMPRANDO</span> a...</label></td>',
              styleSubTitulo
            ) +
            ExchangeBTC.Extra.FormatarString(
              '<td style="{0}"><label>Est&atilde;o <span style="font-weight: bold; color: #c2154e;">VENDENDO</span> a...</td>',
              styleSubTitulo
            ) +
            ExchangeBTC.Extra.FormatarString("</tr>") +
            ExchangeBTC.Extra.FormatarString("<tr>") +
            ExchangeBTC.Extra.FormatarString(
              '<td style="{0}">{2}<input type="text" id="moedaNegociacaoCompra" readonly style="{1} color: #199359;" /></td>',
              styleValor,
              styleInput,
              fHtmlIndicador()
            ) +
            ExchangeBTC.Extra.FormatarString(
              '<td style="{0}">{2}<input type="text" id="moedaNegociacaoVenda" readonly style="{1} color: #c2154e" /></td>',
              styleValor,
              styleInput,
              fHtmlIndicador(true)
            ) +
            ExchangeBTC.Extra.FormatarString("</tr>") +
            ExchangeBTC.Extra.FormatarString("<tr>") +
            ExchangeBTC.Extra.FormatarString('<td colspan="2">') +
            ExchangeBTC.Extra.FormatarString(
              '<div id="moedaNegociacaoCompraVendaGrafico" style="width: 100%; margin: 10px 0 -5px 0;"></div>'
            ) +
            ExchangeBTC.Definicoes.HtmlDivisor +
            ExchangeBTC.Extra.FormatarString(
              '<button id="moedaNegociacaoCompraVendaGraficoReset">Reiniciar o gr&aacute;fico.</button>'
            ) +
            ExchangeBTC.Extra.FormatarString("</td>") +
            ExchangeBTC.Extra.FormatarString("</tr>") +
            ExchangeBTC.Extra.FormatarString("</table>"),

          onLoad: function () {
            var fCarregarValores = function () {
              ExchangeBTC.Nucleo.ModulosDeControle.Valores().setConfiguracoes(
                ExchangeBTC.Nucleo.ModulosDeControle.Valores().getConfiguracoes()
              );
            };

            $(
              'input[name="separadorDecimal"]',
              "." + ExchangeBTC.Definicoes.ClassCssIdentificadora
            ).checkboxradio();
            var fToggleSeparadorDecimalModo = function () {
              ExchangeBTC.Regras.Atual().SeparadorDecimal($(this).val());
              fCarregarValores();
            };
            ExchangeBTC.Objetos.SeparadorDecimalVirgula = $(
              "#separadorDecimalVirgula",
              "." + ExchangeBTC.Definicoes.ClassCssIdentificadora
            );
            ExchangeBTC.Objetos.SeparadorDecimalVirgula.on(
              "change",
              fToggleSeparadorDecimalModo
            );
            ExchangeBTC.Objetos.SeparadorDecimalPonto = $(
              "#separadorDecimalPonto",
              "." + ExchangeBTC.Definicoes.ClassCssIdentificadora
            );
            ExchangeBTC.Objetos.SeparadorDecimalPonto.on(
              "change",
              fToggleSeparadorDecimalModo
            );

            ExchangeBTC.Objetos.MoedaPrimariaNome = $(
              "#moedaPrimariaNome",
              "." + ExchangeBTC.Definicoes.ClassCssIdentificadora
            );
            ExchangeBTC.Objetos.MoedaNegociacaoNome = $(
              "#moedaNegociacaoNome",
              "." + ExchangeBTC.Definicoes.ClassCssIdentificadora
            );

            var fMoedaDecimaisChange = function () {
              var fDecimais =
                $(this).attr("id").indexOf("Primaria") >= 0
                  ? ExchangeBTC.Regras.Atual().MoedaPrimariaDecimais
                  : $(this).attr("id").indexOf("Negociacao") >= 0
                  ? ExchangeBTC.Regras.Atual().MoedaNegociacaoDecimais
                  : null;

              if (!fDecimais) return;

              var val = parseInt($(this).val());
              var min = parseInt($(this).attr("min"));
              var max = parseInt($(this).attr("max"));
              if (val < min) val = min;
              if (val > max) val = max;
              if (isNaN(val)) val = fDecimais();
              $(this).val(val);
              fDecimais(val);
              fCarregarValores();
            };

            ExchangeBTC.Objetos.MoedaPrimariaDecimais = $(
              "#moedaPrimariaDecimais",
              "." + ExchangeBTC.Definicoes.ClassCssIdentificadora
            ).spinner();
            ExchangeBTC.Objetos.MoedaPrimariaDecimais.on(
              "change",
              fMoedaDecimaisChange
            );
            ExchangeBTC.Util.RegistraEventoSpinnerChange(
              ExchangeBTC.Objetos.MoedaPrimariaDecimais
            );

            ExchangeBTC.Objetos.MoedaNegociacaoDecimais = $(
              "#moedaNegociacaoDecimais",
              "." + ExchangeBTC.Definicoes.ClassCssIdentificadora
            ).spinner();
            ExchangeBTC.Objetos.MoedaNegociacaoDecimais.on(
              "change",
              fMoedaDecimaisChange
            );
            ExchangeBTC.Util.RegistraEventoSpinnerChange(
              ExchangeBTC.Objetos.MoedaNegociacaoDecimais
            );

            ExchangeBTC.Objetos.MoedaPrimariaTotal = $(
              "#moedaPrimariaTotal",
              "." + ExchangeBTC.Definicoes.ClassCssIdentificadora
            );
            ExchangeBTC.Objetos.MoedaNegociacaoTotal = $(
              "#moedaNegociacaoTotal",
              "." + ExchangeBTC.Definicoes.ClassCssIdentificadora
            );

            ExchangeBTC.Objetos.MoedaNegociacaoCompra = $(
              "#moedaNegociacaoCompra",
              "." + ExchangeBTC.Definicoes.ClassCssIdentificadora
            );
            ExchangeBTC.Objetos.MoedaNegociacaoVenda = $(
              "#moedaNegociacaoVenda",
              "." + ExchangeBTC.Definicoes.ClassCssIdentificadora
            );

            var fIndicador = function (e) {
              var jInput = $(this);
              var jIndicador = jInput.siblings(".indicador");
              var indicadorInvertido = jIndicador.hasClass("invertido");

              var historicoTotal = 5;
              var valores = jInput.attr("historico");
              valores = !valores
                ? []
                : valores.split("|").filter(function (el) {
                    return el.length != 0;
                  });
              valores.splice(0, 0, jInput.val());
              if (valores.length > historicoTotal + 1) valores.pop();
              jInput.attr("historico", valores.join("|"));

              var htmlIndicadorMask = '<span style="color: {1};">{0}</span>';
              var html = "";
              for (var i = 1; i < valores.length; i++) {
                var valor2 = parseFloat(valores[i - 1].replace(",", "."));
                var valor1 = parseFloat(valores[i].replace(",", "."));

                html +=
                  valor2 - valor1 < 0
                    ? ExchangeBTC.Extra.FormatarString(
                        htmlIndicadorMask,
                        "&darr;",
                        !indicadorInvertido ? "red" : "blue"
                      )
                    : valor2 - valor1 > 0
                    ? ExchangeBTC.Extra.FormatarString(
                        htmlIndicadorMask,
                        "&uarr;",
                        !indicadorInvertido ? "blue" : "red"
                      )
                    : ExchangeBTC.Extra.FormatarString(
                        htmlIndicadorMask,
                        "&diams;",
                        "lightgray"
                      );
              }
              jIndicador.html(html);
            };

            ExchangeBTC.Objetos.MoedaPrimariaTotal.on("change", fIndicador);
            ExchangeBTC.Objetos.MoedaNegociacaoTotal.on("change", fIndicador);
            ExchangeBTC.Objetos.MoedaNegociacaoCompra.on("change", fIndicador);
            ExchangeBTC.Objetos.MoedaNegociacaoVenda.on("change", fIndicador);

            ExchangeBTC.Objetos.MoedaNegociacaoCompraVendaGraficoReset = $(
              "#moedaNegociacaoCompraVendaGraficoReset",
              "." + ExchangeBTC.Definicoes.ClassCssIdentificadora
            ).button();
            ExchangeBTC.Objetos.MoedaNegociacaoCompraVendaGraficoReset.on(
              "click",
              function () {
                ExchangeBTC.Objetos.MoedaNegociacaoCompraVendaGraficoChartistData =
                  { labels: [], series: [[], []] };
                fCarregarValores();
              }
            );

            ExchangeBTC.Objetos.MoedaNegociacaoCompraVendaGrafico = $(
              "#moedaNegociacaoCompraVendaGrafico",
              "." + ExchangeBTC.Definicoes.ClassCssIdentificadora
            );

            var fGrafico = function () {
              var jInput = $(this);
              var valor = parseFloat(jInput.val().replace(",", "."));
              var indexSeries =
                jInput.attr("id").indexOf("Compra") >= 0 ? 0 : 1;

              if (isNaN(valor) || valor == 0) return;

              if (
                !ExchangeBTC.Objetos.MoedaNegociacaoCompraVendaGraficoChartist
              ) {
                ExchangeBTC.Objetos.MoedaNegociacaoCompraVendaGraficoChartistData =
                  { labels: [], series: [[], []] };
                ExchangeBTC.Objetos.MoedaNegociacaoCompraVendaGraficoChartistOptions =
                  {
                    width: "100%",
                    height: "100px",
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
                    chartPadding: 3,
                  };

                ExchangeBTC.Extra.CarregarStylesheetCode(
                  " .ct-series-a .ct-line, .ct-series-a .ct-point { stroke: #199359; }" +
                    " .ct-series-b .ct-line, .ct-series-b .ct-point { stroke: #c2154e; }" +
                    " .ct-line { stroke-width: 2px; }" +
                    " .ct-point { stroke-width: 6px; }" +
                    " .ct-label { font-size: 0.8em; } "
                );

                ExchangeBTC.Objetos.MoedaNegociacaoCompraVendaGraficoChartist =
                  new Chartist.Line(
                    ExchangeBTC.Objetos.MoedaNegociacaoCompraVendaGrafico.get(
                      0
                    ),
                    ExchangeBTC.Objetos.MoedaNegociacaoCompraVendaGraficoChartistData,
                    ExchangeBTC.Objetos.MoedaNegociacaoCompraVendaGraficoChartistOptions
                  );
              }

              ExchangeBTC.Objetos.MoedaNegociacaoCompraVendaGraficoChartistData.series[
                indexSeries
              ].push(valor);

              if (
                ExchangeBTC.Objetos
                  .MoedaNegociacaoCompraVendaGraficoChartistData.series[
                  indexSeries
                ].length >
                ExchangeBTC.Objetos
                  .MoedaNegociacaoCompraVendaGraficoChartistData.labels.length
              ) {
                ExchangeBTC.Objetos.MoedaNegociacaoCompraVendaGraficoChartistData.labels.push(
                  ExchangeBTC.Extra.FormatarData(new Date(), "h:m:s")
                );
              }

              var limitePontos = 1440; //12 horas para 30 segs.
              if (limitePontos > 0) {
                if (
                  ExchangeBTC.Objetos
                    .MoedaNegociacaoCompraVendaGraficoChartistData.series[0]
                    .length ==
                  ExchangeBTC.Objetos
                    .MoedaNegociacaoCompraVendaGraficoChartistData.series[1]
                    .length
                ) {
                  if (
                    ExchangeBTC.Objetos
                      .MoedaNegociacaoCompraVendaGraficoChartistData.series[
                      indexSeries
                    ].length > limitePontos
                  ) {
                    ExchangeBTC.Objetos.MoedaNegociacaoCompraVendaGraficoChartistData.labels.shift();
                    ExchangeBTC.Objetos.MoedaNegociacaoCompraVendaGraficoChartistData.series[0].shift();
                    ExchangeBTC.Objetos.MoedaNegociacaoCompraVendaGraficoChartistData.series[1].shift();
                  }
                }
              }

              if (
                ExchangeBTC.Objetos
                  .MoedaNegociacaoCompraVendaGraficoChartistOptions.low ==
                  undefined ||
                valor <
                  ExchangeBTC.Objetos
                    .MoedaNegociacaoCompraVendaGraficoChartistOptions.low
              ) {
                ExchangeBTC.Objetos.MoedaNegociacaoCompraVendaGraficoChartistOptions.low =
                  valor;
              }

              if (
                ExchangeBTC.Objetos
                  .MoedaNegociacaoCompraVendaGraficoChartistOptions.high ==
                  undefined ||
                valor >
                  ExchangeBTC.Objetos
                    .MoedaNegociacaoCompraVendaGraficoChartistOptions.high
              ) {
                ExchangeBTC.Objetos.MoedaNegociacaoCompraVendaGraficoChartistOptions.high =
                  valor;
              }

              if (
                ExchangeBTC.Objetos.ModalDeControles &&
                ExchangeBTC.Objetos.ModalDeControles.is(":visible")
              ) {
                delete ExchangeBTC.Objetos
                  .MoedaNegociacaoCompraVendaGraficoChartistOptions.high;
                delete ExchangeBTC.Objetos
                  .MoedaNegociacaoCompraVendaGraficoChartistOptions.low;

                ExchangeBTC.Objetos.MoedaNegociacaoCompraVendaGraficoChartist.update(
                  ExchangeBTC.Objetos
                    .MoedaNegociacaoCompraVendaGraficoChartistData,
                  ExchangeBTC.Objetos
                    .MoedaNegociacaoCompraVendaGraficoChartistOptions
                );
              }
            };

            ExchangeBTC.Objetos.MoedaNegociacaoCompra.on("change", fGrafico);
            ExchangeBTC.Objetos.MoedaNegociacaoVenda.on("change", fGrafico);

            ExchangeBTC.Util.RegistraEventoSelectInput(
              ExchangeBTC.Objetos.MoedaPrimariaNome
            );
            ExchangeBTC.Util.RegistraEventoSelectInput(
              ExchangeBTC.Objetos.MoedaNegociacaoNome
            );
            ExchangeBTC.Util.RegistraEventoSelectInput(
              ExchangeBTC.Objetos.MoedaPrimariaTotal
            );
            ExchangeBTC.Util.RegistraEventoSelectInput(
              ExchangeBTC.Objetos.MoedaNegociacaoTotal
            );
            ExchangeBTC.Util.RegistraEventoSelectInput(
              ExchangeBTC.Objetos.MoedaNegociacaoCompra
            );
            ExchangeBTC.Util.RegistraEventoSelectInput(
              ExchangeBTC.Objetos.MoedaNegociacaoVenda
            );

            fCarregarValores();
          },

          onLoop: function () {
            ExchangeBTC.Nucleo.ModulosDeControle.Valores().setConfiguracoes(
              ExchangeBTC.Nucleo.ModulosDeControle.Valores().getConfiguracoes()
            );
          },

          getConfiguracoes: function () {
            return {
              SeparadorDecimal: ExchangeBTC.Regras.Atual().SeparadorDecimal(),
              MoedaPrimariaDecimais:
                ExchangeBTC.Regras.Atual().MoedaPrimariaDecimais(),
              MoedaNegociacaoDecimais:
                ExchangeBTC.Regras.Atual().MoedaNegociacaoDecimais(),
            };
          },

          setConfiguracoes: function (configuracoes) {
            if (!configuracoes) return;

            if (configuracoes.hasOwnProperty("SeparadorDecimal")) {
              if (
                configuracoes.SeparadorDecimal == "." ||
                configuracoes.SeparadorDecimal == ","
              ) {
                ExchangeBTC.Regras.Atual().SeparadorDecimal(
                  configuracoes.SeparadorDecimal
                );
              }
            }
            ExchangeBTC.Objetos.SeparadorDecimalVirgula.prop(
              "checked",
              ExchangeBTC.Regras.Atual().SeparadorDecimal() == ","
            ).button("refresh");
            ExchangeBTC.Objetos.SeparadorDecimalPonto.prop(
              "checked",
              ExchangeBTC.Regras.Atual().SeparadorDecimal() == "."
            ).button("refresh");

            ExchangeBTC.Objetos.MoedaPrimariaNome.val(
              ExchangeBTC.Regras.Atual().MoedaPrimariaNome()
            );
            ExchangeBTC.Objetos.MoedaNegociacaoNome.val(
              ExchangeBTC.Regras.Atual().MoedaNegociacaoNome()
            );

            if (configuracoes.hasOwnProperty("MoedaPrimariaDecimais")) {
              var maxMoedaPrimariaDecimais = parseInt(
                ExchangeBTC.Objetos.MoedaPrimariaDecimais.attr("max")
              );
              if (configuracoes.MoedaPrimariaDecimais < 0)
                configuracoes.MoedaPrimariaDecimais = 0;
              if (
                configuracoes.MoedaPrimariaDecimais > maxMoedaPrimariaDecimais
              )
                configuracoes.MoedaPrimariaDecimais = maxMoedaPrimariaDecimais;

              ExchangeBTC.Regras.Atual().MoedaPrimariaDecimais(
                configuracoes.MoedaPrimariaDecimais
              );
            }
            ExchangeBTC.Objetos.MoedaPrimariaDecimais.val(
              ExchangeBTC.Regras.Atual().MoedaPrimariaDecimais()
            );

            if (configuracoes.hasOwnProperty("MoedaNegociacaoDecimais")) {
              var maxMoedaNegociacaoDecimais = parseInt(
                ExchangeBTC.Objetos.MoedaNegociacaoDecimais.attr("max")
              );
              if (configuracoes.MoedaNegociacaoDecimais < 0)
                configuracoes.MoedaNegociacaoDecimais = 0;
              if (
                configuracoes.MoedaNegociacaoDecimais >
                maxMoedaNegociacaoDecimais
              )
                configuracoes.MoedaNegociacaoDecimais =
                  maxMoedaNegociacaoDecimais;

              ExchangeBTC.Regras.Atual().MoedaNegociacaoDecimais(
                configuracoes.MoedaNegociacaoDecimais
              );
            }
            ExchangeBTC.Objetos.MoedaNegociacaoDecimais.val(
              ExchangeBTC.Regras.Atual().MoedaNegociacaoDecimais()
            );

            ExchangeBTC.Objetos.MoedaPrimariaTotal.val(
              ExchangeBTC.Regras.Atual().MoedaPrimariaTotal()
            ).change();
            ExchangeBTC.Objetos.MoedaNegociacaoTotal.val(
              ExchangeBTC.Regras.Atual().MoedaNegociacaoTotal()
            ).change();

            ExchangeBTC.Objetos.MoedaNegociacaoCompra.val(
              ExchangeBTC.Regras.Atual().MoedaNegociacaoCompra()
            ).change();
            ExchangeBTC.Objetos.MoedaNegociacaoVenda.val(
              ExchangeBTC.Regras.Atual().MoedaNegociacaoVenda()
            ).change();

            for (
              var i = 0;
              Array.isArray(ExchangeBTC.Definicoes.EventosValoresChange) &&
              i < ExchangeBTC.Definicoes.EventosValoresChange.length;
              i++
            ) {
              if (
                typeof ExchangeBTC.Definicoes.EventosValoresChange[i] ===
                "function"
              )
                ExchangeBTC.Definicoes.EventosValoresChange[i]();
            }
          },
        };

        return ExchangeBTC.Definicoes.ValoresInstancia;
      },

      Alertas: function () {
        if (ExchangeBTC.Definicoes.Alertas)
          return ExchangeBTC.Definicoes.Alertas;

        var $ = jQuery;

        if (!ExchangeBTC.Objetos.AlertasControle) {
          ExchangeBTC.Objetos.AlertasControle = {};

          ExchangeBTC.Objetos.AlertasControle.Alertar = function (index, modo) {
            index = isFinite(index) ? "alerta_" + index : index;

            var alerta = ExchangeBTC.Objetos.Alertas[index];
            alerta.Container.css(
              "background-color",
              modo ? "lightsalmon" : "transparent"
            );
            if (modo) {
              alerta.Desmarcar.show();
            } else {
              alerta.Desmarcar.hide();
            }
          };

          ExchangeBTC.Objetos.AlertasControle.Dados = function (index) {
            index = isFinite(index) ? "alerta_" + index : index;

            var alerta = ExchangeBTC.Objetos.Alertas[index];
            var dados = {};

            dados.Origem = alerta.Origem.val();

            dados.OrigemValor = parseFloat(
              alerta.OrigemValor.val().replace(",", ".")
            );
            dados.OrigemValor = isNaN(dados.OrigemValor)
              ? ""
              : dados.OrigemValor;

            dados.Condicao = alerta.Condicao.val();

            dados.CondicaoValor = parseFloat(
              alerta.CondicaoValor.val().replace(",", ".")
            );
            dados.CondicaoValor = isNaN(dados.CondicaoValor)
              ? ""
              : dados.CondicaoValor;

            dados.Audio = alerta.Audio.val();

            dados.AudioVolume = alerta.AudioVolume.slider("value");

            dados.Ativo = alerta.AtivoSim.prop("checked");

            return dados;
          };

          ExchangeBTC.Objetos.AlertasControle.ValidarJson = function (dados) {
            try {
              return Boolean(
                dados.Origem &&
                  isFinite(
                    parseFloat(String(dados.OrigemValor).replace(",", "."))
                  ) &&
                  dados.Condicao &&
                  isFinite(
                    parseFloat(String(dados.CondicaoValor).replace(",", "."))
                  ) &&
                  dados.Audio &&
                  dados.AudioVolume >= 0 &&
                  dados.AudioVolume <= 100
              );
            } catch (ex) {
              return false;
            }
          };

          ExchangeBTC.Objetos.AlertasControle.Validar = function (
            index,
            comMensagem
          ) {
            index = isFinite(index) ? "alerta_" + index : index;
            var alerta = ExchangeBTC.Objetos.Alertas[index];
            var dados = ExchangeBTC.Objetos.AlertasControle.Dados(index);
            var validado =
              ExchangeBTC.Objetos.AlertasControle.ValidarJson(dados);
            alerta.Dados.UltimosValores = [];
            if (!validado) {
              if (alerta.AtivoSim.prop("checked")) {
                alerta.AtivoNao.prop("checked", true).button("refresh");
                alerta.AtivoNao.change();
                if (comMensagem == undefined || comMensagem) {
                  ExchangeBTC.Util.Info(
                    "O {0} foi desabilitado. Verifique o preenchimento dos par&acirc;metros.",
                    alerta.Titulo.text()
                  );
                }
              }
            }
            return validado;
          };

          ExchangeBTC.Objetos.AlertasControle.Adicionar = function (dados) {
            ExchangeBTC.Objetos.AlertaAdicionar.click();
            var index = parseInt(
              ExchangeBTC.Objetos.ListaAlertas.children(":last").attr(
                "data-index"
              )
            );
            var objetos = ExchangeBTC.Objetos.Alertas["alerta_" + index];

            objetos.Origem.val(dados.Origem).selectmenu("refresh");
            objetos.OrigemValor.val(dados.OrigemValor);
            objetos.Condicao.val(dados.Condicao).selectmenu("refresh");
            objetos.CondicaoValor.val(dados.CondicaoValor);
            objetos.Audio.val(dados.Audio).selectmenu("refresh");
            objetos.AudioVolume.slider("value", dados.AudioVolume);
            if (dados.Ativo) {
              objetos.AtivoSim.prop("checked", true).button("refresh");
              objetos.AtivoSim.trigger("change", [false]);
            }
          };

          ExchangeBTC.Objetos.AlertasControle.Remover = function (
            index,
            imediato
          ) {
            index = isFinite(index) ? "alerta_" + index : index;
            var alerta = ExchangeBTC.Objetos.Alertas[index];
            var fRemover = function () {
              alerta.Container.remove();
              delete ExchangeBTC.Objetos.Alertas[index];
              delete alerta;
            };
            if (imediato) {
              fRemover();
            } else {
              alerta.Container.slideToggle(fRemover);
            }
          };

          ExchangeBTC.Definicoes.EventosValoresChange[
            ExchangeBTC.Definicoes.EventosValoresChange.length
          ] = function () {
            for (key in ExchangeBTC.Objetos.Alertas) {
              if (ExchangeBTC.Objetos.Alertas[key].OrigemValor)
                ExchangeBTC.Objetos.Alertas[key].OrigemValor.change();
              if (ExchangeBTC.Objetos.Alertas[key].CondicaoValor)
                ExchangeBTC.Objetos.Alertas[key].CondicaoValor.change();
            }
          };
        }

        ExchangeBTC.Definicoes.Alertas = {
          aberto: true,

          titulo: "Alertas",

          html: function (index) {
            index = index ? index : 0;

            var html;

            if (index > 0) {
              var htmlSelectOrigem =
                ExchangeBTC.Extra.FormatarString(
                  '<select id="origem_{index}" class="origem" style="width: 100%">'
                ) +
                ExchangeBTC.Extra.FormatarString(
                  '<option value="{0}">{1}</option>',
                  "",
                  ""
                ) +
                ExchangeBTC.Extra.FormatarString(
                  '<option value="{0}">{1}</option>',
                  "primaria",
                  "Moeda prim&aacute;ria"
                ) +
                ExchangeBTC.Extra.FormatarString(
                  '<option value="{0}">{1}</option>',
                  "negociacao",
                  "Moeda de negocia&ccedil;&atilde;o"
                ) +
                ExchangeBTC.Extra.FormatarString(
                  '<option value="{0}">{1}</option>',
                  "compra",
                  "Cota&ccedil;&atilde;o de compra"
                ) +
                ExchangeBTC.Extra.FormatarString(
                  '<option value="{0}">{1}</option>',
                  "venda",
                  "Cota&ccedil;&atilde;o de venda"
                ) +
                ExchangeBTC.Extra.FormatarString("</select>");

              var htmlSelectCondicoes =
                ExchangeBTC.Extra.FormatarString(
                  '<select id="condicao_{index}" class="condicao" style="width: 100%">'
                ) +
                ExchangeBTC.Extra.FormatarString(
                  '<option value="{0}">{1}</option>',
                  "",
                  ""
                ) +
                ExchangeBTC.Extra.FormatarString(
                  '<option value="{0}">{1}</option>',
                  "subir-valor",
                  "Subir mais X"
                ) +
                ExchangeBTC.Extra.FormatarString(
                  '<option value="{0}">{1}</option>',
                  "subir-percentual",
                  "Subir mais X%"
                ) +
                ExchangeBTC.Extra.FormatarString(
                  '<option value="{0}">{1}</option>',
                  "descer-valor",
                  "Descer menos X"
                ) +
                ExchangeBTC.Extra.FormatarString(
                  '<option value="{0}">{1}</option>',
                  "descer-percentual",
                  "Descer menos X%"
                ) +
                ExchangeBTC.Extra.FormatarString(
                  '<option value="{0}">{1}</option>',
                  "alteracao-valor",
                  "Variar em mais ou menos X"
                ) +
                ExchangeBTC.Extra.FormatarString(
                  '<option value="{0}">{1}</option>',
                  "alteracao-percentual",
                  "Variar em mais ou menos X%"
                ) +
                ExchangeBTC.Extra.FormatarString(
                  '<option value="{0}">{1}</option>',
                  "maiorigual-valor",
                  "Maior igual a X"
                ) +
                ExchangeBTC.Extra.FormatarString(
                  '<option value="{0}">{1}</option>',
                  "menorigual-valor",
                  "Menor igual a X"
                ) +
                ExchangeBTC.Extra.FormatarString(
                  '<option value="{0}">{1}</option>',
                  "subidas-seguidas",
                  "Aumentar por X vezes"
                ) +
                ExchangeBTC.Extra.FormatarString(
                  '<option value="{0}">{1}</option>',
                  "quedas-seguidas",
                  "Diminuir por X vezes"
                ) +
                ExchangeBTC.Extra.FormatarString("</select>");

              var htmlAlerta =
                ExchangeBTC.Extra.FormatarString(
                  '<div id="alerta_{index}" class="alerta" data-index="{index}" style="margin: 0 0 2em -3%;border: 2px solid silver;padding: 0 2%;width: 106%;border-radius: 5px;">'
                ) +
                ExchangeBTC.Extra.FormatarString(
                  '<h4 id="titulo_{index}" class="titulo" style="cursor: pointer;margin: 0;padding: 2%;background-color: lightgrey;margin: 0 0 0 -2%;width: 104%;">Alerta #{index}</h4>'
                ) +
                ExchangeBTC.Extra.FormatarString(
                  '<div style="margin: 2% 0px;">'
                ) +
                ExchangeBTC.Extra.FormatarString(
                  '<div style="display: inline-block; width: 40%; margin-right: 10%;"><label for="origem_{index}">Or&iacute;gem: </label> {0}</div>',
                  htmlSelectOrigem
                ) +
                ExchangeBTC.Extra.FormatarString(
                  '<div style="display: inline-block; width: 30%;"><label for="origem_valor_{index}" id="origem_valor_reset_{index}" style="cursor: pointer; color: blue; text-decoration: underline;">Valor base: </label> <input type="text" id="origem_valor_{index}" style="height: auto; width: 90%; text-align: center; font-size: 1em; padding: 5px; font-weight: bold;" /></div>',
                  htmlSelectOrigem
                ) +
                ExchangeBTC.Definicoes.HtmlDivisor +
                ExchangeBTC.Extra.FormatarString(
                  '<div style="display: inline-block; width: 40%; margin-right: 10%;"><label for="condicao_{index}">Condi&ccedil;&atilde;o: </label> {0}</div>',
                  htmlSelectCondicoes
                ) +
                ExchangeBTC.Extra.FormatarString(
                  '<div style="display: inline-block; width: 30%;"><label for="condicao_valor_{index}">X: </label> <input type="text" id="condicao_valor_{index}" style="height: auto; width: 90%; text-align: center; font-size: 1em; padding: 5px; font-weight: bold;" /></div>',
                  htmlSelectOrigem
                ) +
                ExchangeBTC.Definicoes.HtmlDivisor +
                ExchangeBTC.Extra.FormatarString(
                  '<div style="display: inline-block; width: 40%; margin-right: 10%;"><label for="audio_{index}">Toque: </label> {0}</div>',
                  ExchangeBTC.Util.AudioHtmlSelect(
                    "audio_{index}",
                    "audio",
                    "Sirene"
                  )
                ) +
                ExchangeBTC.Extra.FormatarString(
                  '<div style="display: inline-block; width: 30%; position: relative; top: -26px;"><label for="audio_volume_{index}">Volume: </label> <div id="audio_volume_{index}"></div></div>'
                ) +
                ExchangeBTC.Definicoes.HtmlDivisor +
                ExchangeBTC.Extra.FormatarString(
                  '<label for="ativo_{index}_Sim">Ativo</label>'
                ) +
                ExchangeBTC.Extra.FormatarString(
                  '<input type="radio" name="ativo_{index}" id="ativo_{index}_Sim">'
                ) +
                ExchangeBTC.Extra.FormatarString(
                  '<label for="ativo_{index}_Nao">Inativo</label>'
                ) +
                ExchangeBTC.Extra.FormatarString(
                  '<input type="radio" name="ativo_{index}" id="ativo_{index}_Nao"> '
                ) +
                ExchangeBTC.Extra.FormatarString(
                  '<button id="apagar_{index}" style="margin-top: -0.5em;">Apagar este alerta</button> '
                ) +
                ExchangeBTC.Extra.FormatarString(
                  '<button id="desmarcar_{index}" style="margin-top: -0.5em;">Reset</button>'
                ) +
                ExchangeBTC.Extra.FormatarString("</div>") +
                ExchangeBTC.Extra.FormatarString("</div>");

              html = ExchangeBTC.Extra.ReplaceAll(htmlAlerta, "{index}", index);
            } else {
              html =
                ExchangeBTC.Extra.FormatarString(
                  '<div id="alertas-lista"></div>'
                ) +
                ExchangeBTC.Extra.FormatarString(
                  '<button id="adicionarAlerta">Adicionar novo alerta</button>'
                );
            }

            return html;
          },

          onLoad: function (index) {
            index = index ? index : 0;

            if (index > 0) {
              ExchangeBTC.Objetos.Alertas = ExchangeBTC.Objetos.Alertas
                ? ExchangeBTC.Objetos.Alertas
                : {};
              ExchangeBTC.Objetos.Alertas["alerta_" + index] = {};
              var alerta = ExchangeBTC.Objetos.Alertas["alerta_" + index];

              alerta.Dados = {
                UltimosValores: [],
              };

              alerta.Container = $(
                "#alerta_" + index,
                "." + ExchangeBTC.Definicoes.ClassCssIdentificadora
              );
              alerta.index = alerta.Container.attr("data-index");

              alerta.Titulo = $(
                "#titulo_" + index,
                "." + ExchangeBTC.Definicoes.ClassCssIdentificadora
              );
              alerta.Titulo.on("click", function () {
                $(this).next().slideToggle();
              });

              alerta.Origem = $(
                "#origem_" + index,
                "." + ExchangeBTC.Definicoes.ClassCssIdentificadora
              ).selectmenu();
              alerta.Origem.on("selectmenuchange", function () {
                if (alerta.OrigemValor.attr("data-usuario") != 1) {
                  alerta.OrigemValorReset.trigger("click", [false]);
                }
                ExchangeBTC.Objetos.AlertasControle.Validar(alerta.index);
              });

              alerta.OrigemValor = $(
                "#origem_valor_" + index,
                "." + ExchangeBTC.Definicoes.ClassCssIdentificadora
              );
              alerta.OrigemValor.change(function () {
                alerta.OrigemValor.attr("data-usuario", 1);
                ExchangeBTC.Objetos.AlertasControle.Validar(alerta.index);
              });

              alerta.OrigemValorReset = $(
                "#origem_valor_reset_" + index,
                "." + ExchangeBTC.Definicoes.ClassCssIdentificadora
              );
              alerta.OrigemValorReset.click(function (e, comMensagem) {
                var separador = ExchangeBTC.Regras.Atual().SeparadorDecimal();
                var origem = alerta.Origem.val();
                var valor;
                switch (origem) {
                  case "primaria":
                    valor = ExchangeBTC.Regras.Atual().MoedaPrimariaTotal(true);
                    break;
                  case "negociacao":
                    valor =
                      ExchangeBTC.Regras.Atual().MoedaNegociacaoTotal(true);
                    break;
                  case "compra":
                    valor =
                      ExchangeBTC.Regras.Atual().MoedaNegociacaoCompra(true);
                    break;
                  case "venda":
                    valor =
                      ExchangeBTC.Regras.Atual().MoedaNegociacaoVenda(true);
                    break;
                  default:
                    if (comMensagem == undefined || comMensagem) {
                      ExchangeBTC.Util.Info(
                        "Selecione a or&iacute;gem do valor."
                      );
                    }
                    return;
                }
                alerta.OrigemValor.val(String(valor).replace(".", separador));
                alerta.OrigemValor.attr("data-usuario", 0);
                ExchangeBTC.Objetos.AlertasControle.Validar(alerta.index);
              });

              alerta.Condicao = $(
                "#condicao_" + index,
                "." + ExchangeBTC.Definicoes.ClassCssIdentificadora
              ).selectmenu();
              alerta.Condicao.on("selectmenuchange", function () {
                ExchangeBTC.Objetos.AlertasControle.Validar(alerta.index);
              });

              alerta.CondicaoValor = $(
                "#condicao_valor_" + index,
                "." + ExchangeBTC.Definicoes.ClassCssIdentificadora
              );
              alerta.CondicaoValor.change(function () {
                ExchangeBTC.Objetos.AlertasControle.Validar(alerta.index);
              });

              var fEdicaoNumerica = function () {
                var separador = ExchangeBTC.Regras.Atual().SeparadorDecimal();
                var valor = $(this).val();
                var valor = parseFloat($(this).val().replace(",", "."));
                if (isNaN(valor)) {
                  valor = "";
                  $(this).attr("data-usuario", 0);
                }
                $(this).val(String(valor).replace(".", separador));
              };
              alerta.OrigemValor.change(fEdicaoNumerica);
              alerta.CondicaoValor.change(fEdicaoNumerica);

              alerta.Audio = $(
                "#audio_" + index,
                "." + ExchangeBTC.Definicoes.ClassCssIdentificadora
              ).selectmenu();
              alerta.Audio.on("selectmenuchange", function () {
                ExchangeBTC.Objetos.AlertasControle.Validar(alerta.index);
              });

              alerta.AudioVolume = $(
                "#audio_volume_" + index,
                "." + ExchangeBTC.Definicoes.ClassCssIdentificadora
              ).slider({ value: 50 });
              alerta.AudioVolume.on(
                "slidechange",
                ExchangeBTC.Util.EventoSliderVolume
              );
              alerta.AudioVolume.trigger("slidechange");

              alerta.Gravar = $(
                "#controle_" + index + " .gravar",
                "." + ExchangeBTC.Definicoes.ClassCssIdentificadora
              ).button();

              $(
                'input[name="ativo_' + index + '"]',
                "." + ExchangeBTC.Definicoes.ClassCssIdentificadora
              ).checkboxradio();
              var fAtivoChange = function (e, comMensagem) {
                if (alerta.AtivoSim.prop("checked")) {
                  if (
                    !ExchangeBTC.Objetos.AlertasControle.Validar(
                      alerta.index,
                      false
                    )
                  ) {
                    alerta.AtivoSim.prop("checked", false).button("refresh");
                    alerta.AtivoNao.prop("checked", true).button("refresh");
                    if (comMensagem == undefined || comMensagem) {
                      ExchangeBTC.Util.Erro(
                        "{0} inv&aacute;lido. Preencha todos os par&acirc;metros.",
                        alerta.Titulo.text()
                      );
                    }
                  } else {
                    $(this)
                      .closest(".alerta")
                      .find(".titulo")
                      .css("background-color", "lightgreen");
                  }
                } else {
                  $(this)
                    .closest(".alerta")
                    .find(".titulo")
                    .css("background-color", "lightgray");
                }
              };
              alerta.AtivoNao = $(
                "#ativo_" + index + "_Nao",
                "." + ExchangeBTC.Definicoes.ClassCssIdentificadora
              )
                .prop("checked", true)
                .button("refresh");
              alerta.AtivoSim = $(
                "#ativo_" + index + "_Sim",
                "." + ExchangeBTC.Definicoes.ClassCssIdentificadora
              )
                .prop("checked", false)
                .button("refresh");
              alerta.AtivoNao.change(fAtivoChange);
              alerta.AtivoSim.change(fAtivoChange);
              alerta.AtivoNao.change();

              alerta.Apagar = $(
                "#apagar_" + index,
                "." + ExchangeBTC.Definicoes.ClassCssIdentificadora
              ).button();
              alerta.Apagar.on("click", function () {
                ExchangeBTC.Objetos.AlertasControle.Remover(alerta.index);
              });

              alerta.Desmarcar = $(
                "#desmarcar_" + index,
                "." + ExchangeBTC.Definicoes.ClassCssIdentificadora
              ).button();
              alerta.Desmarcar.on("click", function () {
                ExchangeBTC.Objetos.AlertasControle.Alertar(index, false);
              });
              alerta.Desmarcar.click();
            } else {
              ExchangeBTC.Objetos.ListaAlertas = $(
                "#alertas-lista",
                "." + ExchangeBTC.Definicoes.ClassCssIdentificadora
              );
              ExchangeBTC.Objetos.AlertaAdicionar = $(
                "#adicionarAlerta",
                "." + ExchangeBTC.Definicoes.ClassCssIdentificadora
              ).button();
              ExchangeBTC.Objetos.AlertaAdicionar.on("click", function () {
                var indexAtual =
                  ExchangeBTC.Objetos.ListaAlertas.children().length == 0
                    ? ""
                    : ExchangeBTC.Objetos.ListaAlertas.attr("data-index");
                indexAtual = isFinite(parseInt(indexAtual))
                  ? parseInt(indexAtual)
                  : 0;
                ExchangeBTC.Objetos.ListaAlertas.attr(
                  "data-index",
                  ++indexAtual
                );

                ExchangeBTC.Objetos.ListaAlertas.append(
                  ExchangeBTC.Nucleo.ModulosDeControle.Alertas().html(
                    indexAtual
                  )
                );
                ExchangeBTC.Nucleo.ModulosDeControle.Alertas().onLoad(
                  indexAtual
                );
              });
            }
          },

          onLoop: function () {
            var fFalha = function (key) {
              ExchangeBTC.Util.Erro(
                "O {0} apresenta problemas na execu&ccedil;&atilde;o. Verifique os par&acirc;metros.",
                ExchangeBTC.Objetos.Alertas[key].Titulo.text()
              );
            };

            if (ExchangeBTC.Objetos.Alertas) {
              for (key in ExchangeBTC.Objetos.Alertas) {
                var oAlerta = ExchangeBTC.Objetos.Alertas[key];
                var alerta = ExchangeBTC.Objetos.AlertasControle.Dados(key);
                if (!alerta.Ativo) continue;

                var valorBase = parseFloat(alerta.OrigemValor);
                if (isNaN(valorBase)) {
                  fFalha(key);
                  continue;
                }

                var valor;
                switch (alerta.Origem) {
                  case "primaria":
                    valor = ExchangeBTC.Regras.Atual().MoedaPrimariaTotal(true);
                    break;
                  case "negociacao":
                    valor =
                      ExchangeBTC.Regras.Atual().MoedaNegociacaoTotal(true);
                    break;
                  case "compra":
                    valor =
                      ExchangeBTC.Regras.Atual().MoedaNegociacaoCompra(true);
                    break;
                  case "venda":
                    valor =
                      ExchangeBTC.Regras.Atual().MoedaNegociacaoVenda(true);
                    break;
                  default:
                    fFalha(key);
                    continue;
                }

                var valorCondicao = parseFloat(alerta.CondicaoValor);
                if (isNaN(valorCondicao)) {
                  fFalha(key);
                  continue;
                }

                var condicao;
                switch (alerta.Condicao) {
                  case "subir-valor":
                    condicao = valor >= valorBase + valorCondicao;
                    break;
                  case "subir-percentual":
                    condicao =
                      valor >= valorBase + (valorBase * valorCondicao) / 100;
                    break;
                  case "descer-valor":
                    condicao = valor <= valorBase - valorCondicao;
                    break;
                  case "descer-percentual":
                    condicao =
                      valor <= valorBase - (valorBase * valorCondicao) / 100;
                    break;
                  case "alteracao-valor":
                    condicao =
                      valor >= valorBase + valorCondicao ||
                      valor <= valorBase - valorCondicao;
                    break;
                  case "alteracao-percentual":
                    condicao =
                      valor >= valorBase + (valorBase * valorCondicao) / 100 ||
                      valor <= valorBase - (valorBase * valorCondicao) / 100;
                    break;
                  case "maiorigual-valor":
                    condicao = valor >= valorCondicao;
                    break;
                  case "menorigual-valor":
                    condicao = valor <= valorCondicao;
                    break;
                  case "subidas-seguidas":
                    if (
                      (oAlerta.Dados.UltimosValores.length == 0 &&
                        valor > valorBase) ||
                      valor >
                        oAlerta.Dados.UltimosValores[
                          oAlerta.Dados.UltimosValores.length - 1
                        ]
                    ) {
                      oAlerta.Dados.UltimosValores.push(valor);
                    }
                    condicao =
                      oAlerta.Dados.UltimosValores.length >= valorCondicao;
                    break;
                  case "quedas-seguidas":
                    if (
                      (oAlerta.Dados.UltimosValores.length == 0 &&
                        valor < valorBase) ||
                      valor <
                        oAlerta.Dados.UltimosValores[
                          oAlerta.Dados.UltimosValores.length - 1
                        ]
                    ) {
                      oAlerta.Dados.UltimosValores.push(valor);
                    }
                    condicao =
                      oAlerta.Dados.UltimosValores.length >= valorCondicao;
                    break;
                  default:
                    fFalha(key);
                    continue;
                }

                var audioVolume = parseInt(alerta.AudioVolume);
                if (isNaN(audioVolume) || !alerta.Audio) {
                  fFalha(key);
                  continue;
                }

                if (condicao) {
                  ExchangeBTC.Objetos.AlertasControle.Alertar(key, true);
                  ExchangeBTC.Util.Audio(alerta.Audio, audioVolume / 100);
                }
              }
            }
          },

          getConfiguracoes: function () {
            var alertas = {};
            if (ExchangeBTC.Objetos.Alertas) {
              for (key in ExchangeBTC.Objetos.Alertas) {
                alertas[key] = ExchangeBTC.Objetos.AlertasControle.Dados(key);
              }
            }
            return alertas;
          },

          setConfiguracoes: function (configuracoes) {
            if (!configuracoes) return;

            if (ExchangeBTC.Objetos.Alertas) {
              for (key in ExchangeBTC.Objetos.Alertas) {
                ExchangeBTC.Objetos.AlertasControle.Remover(key, true);
              }
            }

            for (key in configuracoes) {
              var dados = configuracoes[key];
              dados.Ativo =
                ExchangeBTC.Objetos.AlertasControle.ValidarJson(dados);
              ExchangeBTC.Objetos.AlertasControle.Adicionar(dados);
            }
          },
        };

        return ExchangeBTC.Definicoes.Alertas;
      },

      ControleDePagina: function () {
        if (ExchangeBTC.Definicoes.ControleDePagina)
          return ExchangeBTC.Definicoes.ControleDePagina;

        var $ = jQuery;

        ExchangeBTC.Definicoes.ControleDePagina = {
          aberto: false,

          titulo: "Controle da p&aacute;gina",

          html:
            ExchangeBTC.Extra.FormatarString(
              '<label for="atualizarPaginaSeNecessarioSim">Atualizar p&aacute;gina quando necess&aacute;rio</label>'
            ) +
            ExchangeBTC.Extra.FormatarString(
              '<input type="radio" name="atualizarPaginaSeNecessario" id="atualizarPaginaSeNecessarioSim" />'
            ) +
            ExchangeBTC.Extra.FormatarString(
              '<label for="atualizarPaginaSeNecessarioNao">N&atilde;o atualizar</label>'
            ) +
            ExchangeBTC.Extra.FormatarString(
              '<input type="radio" name="atualizarPaginaSeNecessario" id="atualizarPaginaSeNecessarioNao" />'
            ) +
            ExchangeBTC.Definicoes.HtmlDivisor +
            ExchangeBTC.Extra.FormatarString('<hr style="margin: 0" />') +
            ExchangeBTC.Definicoes.HtmlDivisor +
            ExchangeBTC.Extra.FormatarString(
              '<label for="atualizarPaginaPeriodicamenteSim">Atualizar periodicamente</label>'
            ) +
            ExchangeBTC.Extra.FormatarString(
              '<input type="radio" name="atualizarPaginaPeriodicamente" id="atualizarPaginaPeriodicamenteSim" />'
            ) +
            ExchangeBTC.Extra.FormatarString(
              '<label for="atualizarPaginaPeriodicamenteNao">N&atilde;o atualizar</label>'
            ) +
            ExchangeBTC.Extra.FormatarString(
              '<input type="radio" name="atualizarPaginaPeriodicamente" id="atualizarPaginaPeriodicamenteNao" />'
            ) +
            ExchangeBTC.Extra.FormatarString(
              '<div id="atualizarPaginaPeriodicamenteSimExtra">'
            ) +
            ExchangeBTC.Definicoes.HtmlDivisor +
            ExchangeBTC.Extra.FormatarString(
              '<label for="atualizarPaginaPeriodicamenteTempo">Periodicidade da atualiza&ccedil;&atilde;o: &nbsp; </label>'
            ) +
            ExchangeBTC.Extra.FormatarString(
              '<input type="text" id="atualizarPaginaPeriodicamenteTempo" style="width: 30px; padding: .222em 0; height: auto;" value="{0}" min="{1}" max="{2}" maxlength="{3}" /> minutos',
              10,
              1,
              999,
              3
            ) +
            ExchangeBTC.Extra.FormatarString("</div>") +
            ExchangeBTC.Definicoes.HtmlDivisor +
            ExchangeBTC.Extra.FormatarString('<hr style="margin: 0" />') +
            ExchangeBTC.Definicoes.HtmlDivisor +
            ExchangeBTC.Extra.FormatarString(
              '<label for="loginAutomaticoSim">Fazer login se necess&aacute;rio</label>'
            ) +
            ExchangeBTC.Extra.FormatarString(
              '<input type="radio" name="loginAutomatico" id="loginAutomaticoSim" />'
            ) +
            ExchangeBTC.Extra.FormatarString(
              '<label for="loginAutomaticoNao">N&atilde;o fazer</label>'
            ) +
            ExchangeBTC.Extra.FormatarString(
              '<input type="radio" name="loginAutomatico" id="loginAutomaticoNao" />'
            ) +
            ExchangeBTC.Extra.FormatarString(
              '<div id="loginAutomaticoSimExtra">'
            ) +
            ExchangeBTC.Definicoes.HtmlDivisor +
            ExchangeBTC.Extra.FormatarString(
              '<label for="loginAutomaticoUsuario" style="display: inline-block; width: 100px;">Nome de usu&aacute;rio: </label>'
            ) +
            ExchangeBTC.Extra.FormatarString(
              '<input type="text" id="loginAutomaticoUsuario" style="height: auto; font-size: 1.5em; padding: 5px; font-weight: bold;" />'
            ) +
            ExchangeBTC.Definicoes.HtmlDivisor +
            ExchangeBTC.Extra.FormatarString(
              '<label for="loginAutomaticoSenha" style="display: inline-block; width: 100px;">Senha: </label>'
            ) +
            ExchangeBTC.Extra.FormatarString(
              '<input type="password" id="loginAutomaticoSenha" style="height: auto; font-size: 1.5em; padding: 5px; font-weight: bold;" />'
            ) +
            ExchangeBTC.Extra.FormatarString("</div>") +
            ExchangeBTC.Definicoes.HtmlDivisor +
            ExchangeBTC.Extra.FormatarString('<hr style="margin: 0" />') +
            ExchangeBTC.Definicoes.HtmlDivisor +
            ExchangeBTC.Extra.FormatarString(
              '<label for="abrirPaginaExchangeSim">Sempre ir para p&aacute;gina de Exchange.</label>'
            ) +
            ExchangeBTC.Extra.FormatarString(
              '<input type="radio" name="abrirPaginaExchange" id="abrirPaginaExchangeSim" />'
            ) +
            ExchangeBTC.Extra.FormatarString(
              '<label for="abrirPaginaExchangeNao">N&atilde;o ir</label>'
            ) +
            ExchangeBTC.Extra.FormatarString(
              '<input type="radio" name="abrirPaginaExchange" id="abrirPaginaExchangeNao" />'
            ) +
            ExchangeBTC.Definicoes.HtmlDivisor +
            ExchangeBTC.Extra.FormatarString('<hr style="margin: 0" />') +
            ExchangeBTC.Definicoes.HtmlDivisor +
            ExchangeBTC.Extra.FormatarString(
              '<button id="atualizarPagina">Gravar configura&ccedil;&otilde;es na url da p&aacute;gina.</button>'
            ),

          onLoad: function () {
            var fCarregarValores = function () {
              ExchangeBTC.Nucleo.ModulosDeControle.ControleDePagina().setConfiguracoes(
                ExchangeBTC.Nucleo.ModulosDeControle.ControleDePagina().getConfiguracoes()
              );
            };

            $(
              'input[name="atualizarPaginaSeNecessario"]',
              "." + ExchangeBTC.Definicoes.ClassCssIdentificadora
            ).checkboxradio();
            ExchangeBTC.Objetos.AtualizarPaginaSeNecessarioSim = $(
              "#atualizarPaginaSeNecessarioSim",
              "." + ExchangeBTC.Definicoes.ClassCssIdentificadora
            );
            ExchangeBTC.Objetos.AtualizarPaginaSeNecessarioNao = $(
              "#atualizarPaginaSeNecessarioNao",
              "." + ExchangeBTC.Definicoes.ClassCssIdentificadora
            );

            $(
              'input[name="atualizarPaginaPeriodicamente"]',
              "." + ExchangeBTC.Definicoes.ClassCssIdentificadora
            ).checkboxradio();
            ExchangeBTC.Objetos.AtualizarPaginaPeriodicamenteSim = $(
              "#atualizarPaginaPeriodicamenteSim",
              "." + ExchangeBTC.Definicoes.ClassCssIdentificadora
            );
            ExchangeBTC.Objetos.AtualizarPaginaPeriodicamenteNao = $(
              "#atualizarPaginaPeriodicamenteNao",
              "." + ExchangeBTC.Definicoes.ClassCssIdentificadora
            );

            var fAtualizarPaginaPeriodicamenteChange = function () {
              if (
                ExchangeBTC.Objetos.AtualizarPaginaPeriodicamenteSim.prop(
                  "checked"
                )
              ) {
                ExchangeBTC.Definicoes.AtualizarPaginaMomento = new Date();
              } else {
                ExchangeBTC.Definicoes.AtualizarPaginaMomento = null;
              }
            };
            ExchangeBTC.Objetos.AtualizarPaginaPeriodicamenteSim.on(
              "change",
              fAtualizarPaginaPeriodicamenteChange
            );
            ExchangeBTC.Objetos.AtualizarPaginaPeriodicamenteNao.on(
              "change",
              fAtualizarPaginaPeriodicamenteChange
            );

            ExchangeBTC.Objetos.AtualizarPaginaPeriodicamenteTempo = $(
              "#atualizarPaginaPeriodicamenteTempo",
              "." + ExchangeBTC.Definicoes.ClassCssIdentificadora
            ).spinner();
            ExchangeBTC.Objetos.AtualizarPaginaPeriodicamenteTempo.on(
              "change",
              function () {
                fAtualizarPaginaPeriodicamenteChange();
              }
            );
            ExchangeBTC.Util.RegistraEventoSpinnerChange(
              ExchangeBTC.Objetos.AtualizarPaginaPeriodicamenteTempo
            );

            $(
              'input[name="loginAutomatico"]',
              "." + ExchangeBTC.Definicoes.ClassCssIdentificadora
            ).checkboxradio();
            ExchangeBTC.Objetos.LoginAutomaticoSim = $(
              "#loginAutomaticoSim",
              "." + ExchangeBTC.Definicoes.ClassCssIdentificadora
            );
            ExchangeBTC.Objetos.LoginAutomaticoNao = $(
              "#loginAutomaticoNao",
              "." + ExchangeBTC.Definicoes.ClassCssIdentificadora
            );

            ExchangeBTC.Objetos.LoginAutomaticoUsuario = $(
              "#loginAutomaticoUsuario",
              "." + ExchangeBTC.Definicoes.ClassCssIdentificadora
            );
            ExchangeBTC.Objetos.LoginAutomaticoSenha = $(
              "#loginAutomaticoSenha",
              "." + ExchangeBTC.Definicoes.ClassCssIdentificadora
            );

            $(
              'input[name="abrirPaginaExchange"]',
              "." + ExchangeBTC.Definicoes.ClassCssIdentificadora
            ).checkboxradio();
            ExchangeBTC.Objetos.AbrirPaginaExchangeSim = $(
              "#abrirPaginaExchangeSim",
              "." + ExchangeBTC.Definicoes.ClassCssIdentificadora
            );
            ExchangeBTC.Objetos.AbrirPaginaExchangeNao = $(
              "#abrirPaginaExchangeNao",
              "." + ExchangeBTC.Definicoes.ClassCssIdentificadora
            );

            ExchangeBTC.Objetos.AtualizarPagina = $(
              "#atualizarPagina",
              "." + ExchangeBTC.Definicoes.ClassCssIdentificadora
            ).button();
            ExchangeBTC.Objetos.AtualizarPagina.on("click", function () {
              ExchangeBTC.Util.AtualizarPagina();
            });

            fCarregarValores();
          },

          onLoop: function () {
            var fAtualizarSeNecessario = function () {
              if (
                !ExchangeBTC.Objetos.AtualizarPaginaSeNecessarioSim.prop(
                  "checked"
                )
              )
                return;

              if (ExchangeBTC.Regras.Atual().RequerAtualizarPagina()) {
                ExchangeBTC.Util.AtualizarPagina();
                return true;
              }
              return false;
            };

            var fAtualizarPagina = function () {
              if (
                !ExchangeBTC.Objetos.AtualizarPaginaPeriodicamenteSim.prop(
                  "checked"
                )
              )
                return;

              if (ExchangeBTC.Definicoes.AtualizarPaginaMomento) {
                var tempoMaximo =
                  parseInt(
                    ExchangeBTC.Objetos.AtualizarPaginaPeriodicamenteTempo.val()
                  ) *
                  60 *
                  1000;
                if (isFinite(tempoMaximo)) {
                  var tempoCorrido =
                    new Date() - ExchangeBTC.Definicoes.AtualizarPaginaMomento;
                  if (tempoCorrido >= tempoMaximo) {
                    ExchangeBTC.Util.AtualizarPagina();
                    return true;
                  }
                }
              }
              return false;
            };

            var fLoginSeNecessario = function () {
              if (!ExchangeBTC.Objetos.LoginAutomaticoSim.prop("checked"))
                return;

              if (
                ExchangeBTC.Regras.Atual().RequerLogin(
                  ExchangeBTC.Objetos.LoginAutomaticoUsuario.val(),
                  ExchangeBTC.Objetos.LoginAutomaticoSenha.val()
                )
              ) {
                return true;
              }
              return false;
            };

            var fAbrirPaginaExchange = function () {
              if (!ExchangeBTC.Objetos.AbrirPaginaExchangeSim.prop("checked"))
                return;

              if (ExchangeBTC.Regras.Atual().AbrirPaginaExchange()) {
                return true;
              }
              return false;
            };

            return (
              fAtualizarSeNecessario() ||
              fAtualizarPagina() ||
              fLoginSeNecessario() ||
              fAbrirPaginaExchange()
            );
          },

          getConfiguracoes: function () {
            var atualizarPaginaSeNecessarioSim =
              ExchangeBTC.Objetos.AtualizarPaginaSeNecessarioSim.prop("checked")
                ? true
                : ExchangeBTC.Objetos.AtualizarPaginaSeNecessarioNao.prop(
                    "checked"
                  )
                ? false
                : true;

            var atualizarPaginaPeriodicamente =
              ExchangeBTC.Objetos.AtualizarPaginaPeriodicamenteSim.prop(
                "checked"
              )
                ? true
                : ExchangeBTC.Objetos.AtualizarPaginaPeriodicamenteNao.prop(
                    "checked"
                  )
                ? false
                : false;

            var loginAutomatico = ExchangeBTC.Objetos.LoginAutomaticoSim.prop(
              "checked"
            )
              ? true
              : ExchangeBTC.Objetos.LoginAutomaticoNao.prop("checked")
              ? false
              : true;

            var abrirPaginaExchangeSim =
              ExchangeBTC.Objetos.AbrirPaginaExchangeSim.prop("checked")
                ? true
                : ExchangeBTC.Objetos.AbrirPaginaExchangeNao.prop("checked")
                ? false
                : false;

            return {
              AtualizarPaginaSeNecessario: atualizarPaginaSeNecessarioSim,
              AtualizarPaginaPeriodicamente: atualizarPaginaPeriodicamente,
              AtualizarPaginaPeriodicamenteTempo: parseInt(
                ExchangeBTC.Objetos.AtualizarPaginaPeriodicamenteTempo.val()
              ),
              LoginAutomatico: loginAutomatico,
              LoginAutomaticoUsuario:
                ExchangeBTC.Objetos.LoginAutomaticoUsuario.val(),
              LoginAutomaticoSenha:
                ExchangeBTC.Objetos.LoginAutomaticoSenha.val(),
              AbrirPaginaExchange: abrirPaginaExchangeSim,
            };
          },

          setConfiguracoes: function (configuracoes) {
            if (!configuracoes) return;

            if (configuracoes.hasOwnProperty("AtualizarPaginaSeNecessario")) {
              ExchangeBTC.Objetos.AtualizarPaginaSeNecessarioSim.prop(
                "checked",
                !!configuracoes.AtualizarPaginaSeNecessario
              );
              ExchangeBTC.Objetos.AtualizarPaginaSeNecessarioNao.prop(
                "checked",
                !configuracoes.AtualizarPaginaSeNecessario
              ).change();

              ExchangeBTC.Objetos.AtualizarPaginaSeNecessarioSim.button(
                "refresh"
              );
              ExchangeBTC.Objetos.AtualizarPaginaSeNecessarioNao.button(
                "refresh"
              );
            }

            if (configuracoes.hasOwnProperty("AtualizarPaginaPeriodicamente")) {
              ExchangeBTC.Objetos.AtualizarPaginaPeriodicamenteSim.prop(
                "checked",
                !!configuracoes.AtualizarPaginaPeriodicamente
              );
              ExchangeBTC.Objetos.AtualizarPaginaPeriodicamenteNao.prop(
                "checked",
                !configuracoes.AtualizarPaginaPeriodicamente
              ).change();

              ExchangeBTC.Objetos.AtualizarPaginaPeriodicamenteSim.prop(
                "checked",
                !!configuracoes.AtualizarPaginaPeriodicamente
              ).button("refresh");
              ExchangeBTC.Objetos.AtualizarPaginaPeriodicamenteNao.prop(
                "checked",
                !configuracoes.AtualizarPaginaPeriodicamente
              ).button("refresh");
            }

            if (
              configuracoes.hasOwnProperty("AtualizarPaginaPeriodicamenteTempo")
            ) {
              var maxAtualizarPaginaPeriodicamenteTempo = parseInt(
                ExchangeBTC.Objetos.AtualizarPaginaPeriodicamenteTempo.attr(
                  "max"
                )
              );
              if (configuracoes.AtualizarPaginaPeriodicamenteTempo < 0)
                configuracoes.AtualizarPaginaPeriodicamenteTempo = 0;
              if (
                configuracoes.AtualizarPaginaPeriodicamenteTempo >
                maxAtualizarPaginaPeriodicamenteTempo
              )
                configuracoes.AtualizarPaginaPeriodicamenteTempo =
                  maxAtualizarPaginaPeriodicamenteTempo;

              ExchangeBTC.Objetos.AtualizarPaginaPeriodicamenteTempo.val(
                configuracoes.AtualizarPaginaPeriodicamenteTempo
              );
            }

            if (configuracoes.hasOwnProperty("LoginAutomatico")) {
              ExchangeBTC.Objetos.LoginAutomaticoSim.prop(
                "checked",
                !!configuracoes.LoginAutomatico
              );
              ExchangeBTC.Objetos.LoginAutomaticoNao.prop(
                "checked",
                !configuracoes.LoginAutomatico
              ).change();

              ExchangeBTC.Objetos.LoginAutomaticoSim.prop(
                "checked",
                !!configuracoes.LoginAutomatico
              ).button("refresh");
              ExchangeBTC.Objetos.LoginAutomaticoNao.prop(
                "checked",
                !configuracoes.LoginAutomatico
              ).button("refresh");
            }

            if (configuracoes.hasOwnProperty("LoginAutomaticoUsuario")) {
              ExchangeBTC.Objetos.LoginAutomaticoUsuario.val(
                configuracoes.LoginAutomaticoUsuario
              );
            }

            if (configuracoes.hasOwnProperty("LoginAutomaticoSenha")) {
              ExchangeBTC.Objetos.LoginAutomaticoSenha.val(
                configuracoes.LoginAutomaticoSenha
              );
            }

            if (configuracoes.hasOwnProperty("AbrirPaginaExchange")) {
              ExchangeBTC.Objetos.AbrirPaginaExchangeSim.prop(
                "checked",
                !!configuracoes.AbrirPaginaExchange
              );
              ExchangeBTC.Objetos.AbrirPaginaExchangeNao.prop(
                "checked",
                !configuracoes.AbrirPaginaExchange
              ).change();

              ExchangeBTC.Objetos.AbrirPaginaExchangeSim.button("refresh");
              ExchangeBTC.Objetos.AbrirPaginaExchangeNao.button("refresh");
            }
          },
        };

        return ExchangeBTC.Definicoes.ControleDePagina;
      },

      GaleriaDeAudio: function () {
        if (ExchangeBTC.Definicoes.GaleriaDeAudioInstancia)
          return ExchangeBTC.Definicoes.GaleriaDeAudioInstancia;

        var $ = jQuery;

        ExchangeBTC.Definicoes.GaleriaDeAudioInstancia = {
          aberto: false,

          titulo: "Galeria de &aacute;udios",

          html: function () {
            if (ExchangeBTC.Definicoes.HtmlGaleriaDeAudio)
              return ExchangeBTC.Definicoes.HtmlGaleriaDeAudio;

            var htmlMask =
              '<button id="play{0}" class="audioPlay" >Teste</button> {0}';
            var html = "";
            for (key in ExchangeBTC.Audios) {
              if (html) {
                html += ExchangeBTC.Definicoes.HtmlDivisor;
              }
              html += ExchangeBTC.Extra.FormatarString(htmlMask, key);
            }

            ExchangeBTC.Definicoes.HtmlGaleriaDeAudio = html;

            return html;
          },

          onLoad: function () {
            $(".audioPlay", "." + ExchangeBTC.Definicoes.ClassCssIdentificadora)
              .button()
              .on("click", function () {
                var audio = $(this).attr("id").replace("play", "");
                ExchangeBTC.Util.Audio(audio, 1, true);
              });
          },

          onLoop: null,

          getConfiguracoes: null,

          setConfiguracoes: null,
        };

        return ExchangeBTC.Definicoes.GaleriaDeAudioInstancia;
      },

      Configuracoes: function () {
        if (ExchangeBTC.Definicoes.ConfiguracoesInstancia)
          return ExchangeBTC.Definicoes.ConfiguracoesInstancia;

        var $ = jQuery;

        ExchangeBTC.Definicoes.ConfiguracoesInstancia = {
          aberto: false,

          titulo: "Configura&ccedil;&otilde;es",

          html:
            ExchangeBTC.Extra.FormatarString(
              '<label for="configuracoesJson" style="display: block;">Grave as configura&ccedil;&otilde;es abaixo para poder reconfigurar as op&ccedil;&otilde;es caso seja necess&aacute;rio recarregar a p&aacute;gina. Depois, basta &lt;strong&gt;colar (CTRL+V) e Aplicar.</strong></label>'
            ) +
            ExchangeBTC.Definicoes.HtmlDivisor +
            ExchangeBTC.Extra.FormatarString(
              '<div id="configuracoesJson" style="height: 150px;"></div>'
            ) +
            ExchangeBTC.Definicoes.HtmlDivisor +
            ExchangeBTC.Extra.FormatarString(
              '<button id="configuracoesCopiar">Copiar conte&uacute;do (CTRL+C)</button> '
            ) +
            ExchangeBTC.Extra.FormatarString(
              '<button id="configuracoesRecarregar">Recarregar</button> '
            ) +
            ExchangeBTC.Extra.FormatarString(
              '<button id="configuracoesAplicar">Aplicar</button>'
            ),

          onLoad: function () {
            ExchangeBTC.Objetos.ConfiguracoesCopiar = $(
              "#configuracoesCopiar",
              "." + ExchangeBTC.Definicoes.ClassCssIdentificadora
            ).button();
            ExchangeBTC.Objetos.ConfiguracoesCopiar.on("click", function () {
              var backupSelection =
                ExchangeBTC.Objetos.ConfiguracoesJsonEditor.selection.toJSON();
              ExchangeBTC.Objetos.ConfiguracoesJsonEditor.selectAll();
              ExchangeBTC.Objetos.ConfiguracoesJsonEditor.focus();
              try {
                document.execCommand("copy");
                ExchangeBTC.Util.Info("Conte&uacute;do copiado (CTRL+C).");
              } catch (ex) {
                ExchangeBTC.Util.Erro(
                  "N&atilde;o foi poss&iacute;vel copiar o conteudo. Fa&ccedil;a manualmente com CTRL+C"
                );
              }
              ExchangeBTC.Objetos.ConfiguracoesJsonEditor.selection.fromJSON(
                backupSelection
              );
            });

            ExchangeBTC.Objetos.ConfiguracoesRecarregar = $(
              "#configuracoesRecarregar",
              "." + ExchangeBTC.Definicoes.ClassCssIdentificadora
            ).button();
            ExchangeBTC.Objetos.ConfiguracoesRecarregar.on(
              "click",
              function () {
                var configuracoes =
                  ExchangeBTC.Nucleo.ModulosDeControle.Configuracoes().Atual();
                ExchangeBTC.Objetos.ConfiguracoesJsonEditor.setValue(
                  ExchangeBTC.Extra.ToString(configuracoes)
                );
                ExchangeBTC.Objetos.ConfiguracoesJsonEditor.selection.clearSelection();
              }
            );

            ExchangeBTC.Objetos.ConfiguracoesAplicar = $(
              "#configuracoesAplicar",
              "." + ExchangeBTC.Definicoes.ClassCssIdentificadora
            ).button();
            ExchangeBTC.Objetos.ConfiguracoesAplicar.on("click", function () {
              var json = ExchangeBTC.Objetos.ConfiguracoesJsonEditor.getValue();
              try {
                jsonParse = JSON.parse(json);
                ExchangeBTC.Nucleo.ModulosDeControle.Configuracoes().Atual(
                  jsonParse
                );
                ExchangeBTC.Util.Info("Configura&ccedil;&otilde;es aplicadas.");
              } catch (ex) {
                ExchangeBTC.Util.Erro(
                  "Configura&ccedil;&otilde;es inv&aacute;lidas. {0}",
                  ex
                );
              }
            });

            ExchangeBTC.Objetos.ConfiguracoesJson = $(
              "#configuracoesJson",
              "." + ExchangeBTC.Definicoes.ClassCssIdentificadora
            );
            ExchangeBTC.Objetos.ConfiguracoesJsonEditor =
              ace.edit("configuracoesJson");
            ExchangeBTC.Objetos.ConfiguracoesJsonEditor.setTheme(
              "ace/theme/twilight"
            );
            ExchangeBTC.Objetos.ConfiguracoesJsonEditor.session.setMode(
              "ace/mode/json"
            );
            ExchangeBTC.Objetos.ConfiguracoesJsonEditor.session.setTabSize(2);
            ExchangeBTC.Objetos.ConfiguracoesJsonEditor.session.setUseWrapMode(
              true
            );
            ExchangeBTC.Objetos.ConfiguracoesRecarregar.click();
          },

          onLoop: null,

          getConfiguracoes: null,

          setConfiguracoes: null,

          Atual: function (configuracoes) {
            if (configuracoes) {
              for (var key in ExchangeBTC.Nucleo.ModulosDeControle) {
                var setConfiguracoes =
                  ExchangeBTC.Nucleo.ModulosDeControle[key]().setConfiguracoes;
                if (
                  typeof setConfiguracoes === "function" &&
                  configuracoes.hasOwnProperty(key)
                ) {
                  setConfiguracoes(configuracoes[key]);
                }
              }
              ExchangeBTC.Objetos.ConfiguracoesRecarregar.click();
            }

            var configuracoes = {};
            for (var key in ExchangeBTC.Nucleo.ModulosDeControle) {
              var getConfiguracoes =
                ExchangeBTC.Nucleo.ModulosDeControle[key]().getConfiguracoes;
              if (typeof getConfiguracoes === "function") {
                configuracoes[key] = getConfiguracoes();
              }
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
              ExchangeBTC.Nucleo.ModulosDeControle.Configuracoes().Atual(
                jsonBase64 ? jsonBase64 : undefined
              );
            if (enderecoUnico) configuracoes.id = Date.now();
            return btoa(JSON.stringify(configuracoes));
          },
        };

        return ExchangeBTC.Definicoes.ConfiguracoesInstancia;
      },
    },

    CarregarParametrosIniciais: function () {
      var $ = jQuery;

      ExchangeBTC.Definicoes = $.extend(ExchangeBTC.Definicoes, params, {
        ParametrosInicializados: true,
      });
    },

    PrepararControlesNaTela: function () {
      var $ = jQuery;

      $("body").append(
        ExchangeBTC.Extra.FormatarString(
          '<button id="ativador" class="{1}">{0}</button>',
          ExchangeBTC.Definicoes.NomeDaAplicacao,
          ExchangeBTC.Definicoes.ClassCssIdentificadora
        )
      );
      $("#ativador." + ExchangeBTC.Definicoes.ClassCssIdentificadora)
        .button()
        .css({
          position: "fixed",
          bottom: "10px",
          right: "10px",
          "z-index": "10000002",
        })
        .click(function () {
          ExchangeBTC.Nucleo.JanelaDeControles();
        });
      ExchangeBTC.Nucleo.JanelaDeControles(ExchangeBTC.Definicoes.JanelaAberta);
    },

    JanelaDeControles: function (modo) {
      var $ = jQuery;

      if (!this.ExchangeBTC.Objetos.ModalDeControles) {
        var modulosOnLoad = [];

        ExchangeBTC.Definicoes.HtmlDivisor =
          '<div style="height: 15px;"></div>';

        var htmlModal = "";
        htmlModal += ExchangeBTC.Extra.FormatarString(
          '<div id="controlador" class="{0}" title="{1}">',
          ExchangeBTC.Definicoes.ClassCssIdentificadora,
          ExchangeBTC.Definicoes.NomeDaAplicacao
        );
        htmlModal += ExchangeBTC.Extra.FormatarString('<div class="conteudo">');
        var indexModulo = -1;
        for (var key in ExchangeBTC.Nucleo.ModulosDeControle) {
          indexModulo++;
          var modulo = $.extend(
            { exibir: true, titulo: "", html: "", onLoad: null },
            ExchangeBTC.Nucleo.ModulosDeControle[key]()
          );
          var html =
            typeof modulo.html === "function" ? modulo.html() : modulo.html;
          htmlModal += ExchangeBTC.Extra.FormatarString(
            '<h3 style="text-align: left;">{2}</h3><div id="{1}" class="modulo modulo{0} {4}">{3}</div>',
            indexModulo + 1,
            key,
            modulo.titulo ? modulo.titulo : key,
            html,
            modulo.aberto ? "padraoAberto" : ""
          );
          if (typeof modulo.onLoad === "function") {
            modulosOnLoad.push(modulo.onLoad);
          }

          ExchangeBTC.Util.Log("Carregado m&oacute;dulo {0}.", key);
        }
        htmlModal += ExchangeBTC.Extra.FormatarString("</div>");
        htmlModal += ExchangeBTC.Extra.FormatarString("</div>");

        ExchangeBTC.Objetos.ModalDeControles = $(htmlModal).dialog({
          position: { my: "center top", at: "center top+5%", of: window },
          width: window.innerWidth * 0.4,
          height: window.innerHeight * 0.8,
          minWidth: 477,
          open: function () {
            var dialog = $(this).closest(".ui-dialog");

            if (!ExchangeBTC.Objetos.ModalDeControles) {
              dialog.css({
                "font-size": "12px",
                "z-index": "10000001",
              });

              var htmlModalTitle = "";
              htmlModalTitle += ExchangeBTC.Extra.FormatarString(
                '<div class="loop" style="position: absolute; right: 110px; width: 140px; height: 11px; top: 8px;" data-style="width: 100%; margin: 0px; background-color: silver; border-width: 0px;"></div>'
              );
              htmlModalTitle += ExchangeBTC.Extra.FormatarString(
                '<button id="executarAgora" style="position: absolute; right: 28px; height: 19px; padding: 2px; width: 75px; top: 4px;">Processar</button>'
              );
              $(".ui-dialog-titlebar", dialog).append(htmlModalTitle);

              ExchangeBTC.Objetos.IndicadorDeLoop = $(
                ".loop",
                dialog
              ).progressbar({ value: 100 });
              ExchangeBTC.Objetos.IndicadorDeLoop.find(
                ".ui-widget-header"
              ).attr(
                "style",
                ExchangeBTC.Objetos.IndicadorDeLoop.attr("data-style")
              );

              ExchangeBTC.Objetos.ExecutarAgora = $(
                "#executarAgora",
                dialog
              ).button();
              ExchangeBTC.Objetos.ExecutarAgora.on("click", function () {
                ExchangeBTC.Nucleo.Loop();
              });

              ExchangeBTC.Objetos.ConteudoDeControle = $(
                ".conteudo",
                dialog
              ).accordion({
                collapsible: true,
                active: false,
                heightStyle: "content",
              });
              $("h3", ExchangeBTC.Objetos.ConteudoDeControle)
                .addClass("ui-state-active")
                .off("click")
                .click(function () {
                  $(this).next().slideToggle("fast");
                });
              $(
                ".ui-accordion-content.padraoAberto",
                ExchangeBTC.Objetos.ConteudoDeControle
              ).show();

              for (var i = 0; i < modulosOnLoad.length; i++) {
                modulosOnLoad[i]();
              }

              ExchangeBTC.Objetos.ModalControle = $("#controlador", dialog);
              dialog.resize(function () {
                setTimeout(function () {
                  ExchangeBTC.Objetos.ModalControle.width(
                    dialog.width() - 24 + "px"
                  );
                }, 100);
              });
            }
          },
        });

        modo = modo === undefined ? true : modo;
      } else {
        modo =
          arguments.length > 0
            ? modo
            : !ExchangeBTC.Objetos.ModalDeControles.is(":visible");
      }

      if (modo) {
        ExchangeBTC.Objetos.ModalDeControles.dialog();
      } else {
        ExchangeBTC.Objetos.ModalDeControles.dialog("close");
      }

      if (ExchangeBTC.Definicoes.LoopAtivado) {
        ExchangeBTC.Nucleo.Loop(
          ExchangeBTC.Nucleo.ModulosDeControle.Loop().getConfiguracoes().Ativado
        );
      }
    },

    LoopProgresso: function (progressoAtual, cancelar) {
      clearTimeout(ExchangeBTC.Definicoes.IdTimeoutLoopProgresso);

      var velocidadeDoIndicador = 100;

      if (progressoAtual !== undefined) {
        ExchangeBTC.Definicoes.IndicadorProgressoAtual = progressoAtual;
      } else {
        ExchangeBTC.Definicoes.IndicadorProgressoAtual += 1;
      }

      var percentual =
        (100 / (ExchangeBTC.Definicoes.LoopIntervalo / velocidadeDoIndicador)) *
        ExchangeBTC.Definicoes.IndicadorProgressoAtual;

      if (ExchangeBTC.Objetos.ModalDeControles.is(":visible")) {
        ExchangeBTC.Objetos.IndicadorDeLoop.progressbar({
          value: 100 - percentual * 1.05,
        });
      }

      if (percentual <= 100 && !cancelar) {
        ExchangeBTC.Definicoes.IdTimeoutLoopProgresso = setTimeout(
          ExchangeBTC.Nucleo.LoopProgresso,
          velocidadeDoIndicador
        );
      }
    },

    Loop: function (modo) {
      clearTimeout(ExchangeBTC.Definicoes.IdTimeoutLoop);

      var $ = jQuery;

      ExchangeBTC.Definicoes.LoopAtivado =
        modo !== undefined ? !!modo : ExchangeBTC.Definicoes.LoopAtivado;

      if (modo === undefined || modo) {
        for (var key in ExchangeBTC.Nucleo.ModulosDeControle) {
          var onLoop = ExchangeBTC.Nucleo.ModulosDeControle[key]().onLoop;
          if (typeof onLoop === "function") onLoop();
        }

        ExchangeBTC.Nucleo.LoopRegrasDeNegocio();

        ExchangeBTC.Nucleo.LoopProgresso(
          0,
          !ExchangeBTC.Definicoes.LoopAtivado
        );

        if (ExchangeBTC.Definicoes.LoopAtivado) {
          ExchangeBTC.Definicoes.IdTimeoutLoop = setTimeout(
            ExchangeBTC.Nucleo.Loop,
            ExchangeBTC.Definicoes.LoopIntervalo
          );
        }
      } else {
        ExchangeBTC.Nucleo.LoopProgresso(0, true);
      }
    },

    LoopRegrasDeNegocio: function () {
      ExchangeBTC.Util.Log("loop");
    },
  };

  if (ExchangeBTC.Definicoes.InicializacaoAutomatica) this.Inicializar();

  return this;
})();
//var script = document.createElement('script'); script.src = 'https://cdn.awsli.com.br/640/640398/arquivos/ExchangeBTC.js'; document.head.appendChild(script);
