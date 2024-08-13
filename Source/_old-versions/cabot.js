window.Cabot = new (function () {
  if (window.Cabot) {
    return window.Cabot;
  }

  this.Instancia = this;

  this.Inicializar = function () {
    const _this = this;

    this.Instancia.Configuracao.CarregarBibliotecas().then(function () {
      _this.Instancia.InterceptadorAjax.Ativar(true);
      _this.Instancia.Layout.Montar();
      _this.Instancia.Regras.CarregarModulos();

      _this.Instancia.Configuracao.Log("Inicializado.");
    });
  };

  this.Definicoes = {
    Nome: "Cabot",
    ContatoDoSuporte: "cabot@splitz.com.br",
    ClassCss: "cabot",
    SeparadorDecimal: ",",
    DigitosDecimais: 8,
    Debug: false,
  };

  this.Objetos = {};

  this.LuckygamesIo = new (function (instancia) {
    this.Instancia = instancia;
    const _this = this;

    this.Multiplicadores = [];
    this.Multiplicadores[1] = 0.01;
    this.Multiplicadores[2] = 0.02;
    this.Multiplicadores[3] = 0.03;
    this.Multiplicadores[4] = 0.04;
    this.Multiplicadores[5] = 0.05;
    this.Multiplicadores[6] = 0.06;
    this.Multiplicadores[7] = 0.08;
    this.Multiplicadores[8] = 0.09;
    this.Multiplicadores[9] = 0.1;
    this.Multiplicadores[10] = 0.11;
    this.Multiplicadores[11] = 0.13;
    this.Multiplicadores[12] = 0.14;
    this.Multiplicadores[13] = 0.15;
    this.Multiplicadores[14] = 0.16;
    this.Multiplicadores[15] = 0.18;
    this.Multiplicadores[16] = 0.19;
    this.Multiplicadores[17] = 0.21;
    this.Multiplicadores[18] = 0.22;
    this.Multiplicadores[19] = 0.24;
    this.Multiplicadores[20] = 0.25;
    this.Multiplicadores[21] = 0.27;
    this.Multiplicadores[22] = 0.29;
    this.Multiplicadores[23] = 0.3;
    this.Multiplicadores[24] = 0.32;
    this.Multiplicadores[25] = 0.34;
    this.Multiplicadores[26] = 0.36;
    this.Multiplicadores[27] = 0.38;
    this.Multiplicadores[28] = 0.39;
    this.Multiplicadores[29] = 0.41;
    this.Multiplicadores[30] = 0.43;
    this.Multiplicadores[31] = 0.46;
    this.Multiplicadores[32] = 0.48;
    this.Multiplicadores[33] = 0.5;
    this.Multiplicadores[34] = 0.52;
    this.Multiplicadores[35] = 0.55;
    this.Multiplicadores[36] = 0.57;
    this.Multiplicadores[37] = 0.6;
    this.Multiplicadores[38] = 0.62;
    this.Multiplicadores[39] = 0.65;
    this.Multiplicadores[40] = 0.68;
    this.Multiplicadores[41] = 0.71;
    this.Multiplicadores[42] = 0.74;
    this.Multiplicadores[43] = 0.77;
    this.Multiplicadores[44] = 0.8;
    this.Multiplicadores[45] = 0.83;
    this.Multiplicadores[46] = 0.87;
    this.Multiplicadores[47] = 0.9;
    this.Multiplicadores[48] = 0.94;
    this.Multiplicadores[49] = 0.98;
    this.Multiplicadores[50] = 1.02;
    this.Multiplicadores[51] = 1.06;
    this.Multiplicadores[52] = 1.11;
    this.Multiplicadores[53] = 1.15;
    this.Multiplicadores[54] = 1.2;
    this.Multiplicadores[55] = 1.25;
    this.Multiplicadores[56] = 1.3;
    this.Multiplicadores[57] = 1.36;
    this.Multiplicadores[58] = 1.41;
    this.Multiplicadores[59] = 1.48;
    this.Multiplicadores[60] = 1.54;
    this.Multiplicadores[61] = 1.61;
    this.Multiplicadores[62] = 1.68;
    this.Multiplicadores[63] = 1.75;
    this.Multiplicadores[64] = 1.83;
    this.Multiplicadores[65] = 1.91;
    this.Multiplicadores[66] = 2.0;
    this.Multiplicadores[67] = 2.09;
    this.Multiplicadores[68] = 2.19;
    this.Multiplicadores[69] = 2.3;
    this.Multiplicadores[70] = 2.41;
    this.Multiplicadores[71] = 2.54;
    this.Multiplicadores[72] = 2.67;
    this.Multiplicadores[73] = 2.81;
    this.Multiplicadores[74] = 2.96;
    this.Multiplicadores[75] = 3.13;
    this.Multiplicadores[76] = 3.3;
    this.Multiplicadores[77] = 3.5;
    this.Multiplicadores[78] = 3.71;
    this.Multiplicadores[79] = 3.95;
    this.Multiplicadores[80] = 4.21;
    this.Multiplicadores[81] = 4.5;
    this.Multiplicadores[82] = 4.82;
    this.Multiplicadores[83] = 5.19;
    this.Multiplicadores[84] = 5.6;
    this.Multiplicadores[85] = 6.07;
    this.Multiplicadores[86] = 6.62;
    this.Multiplicadores[87] = 7.25;
    this.Multiplicadores[88] = 8.0;
    this.Multiplicadores[89] = 8.9;
    this.Multiplicadores[90] = 10.0;
    this.Multiplicadores[91] = 11.38;
    this.Multiplicadores[92] = 13.14;
    this.Multiplicadores[93] = 15.5;
    this.Multiplicadores[94] = 18.8;
    this.Multiplicadores[95] = 23.75;
    this.Multiplicadores[96] = 32.0;
    this.Multiplicadores[97] = 48.5;
    this.Multiplicadores[98] = 98.0;

    this.ValorSaldo = function () {
      return parseFloat($("#balance").val());
    };

    this.ValorAposta = function () {
      return parseFloat($("#betAmount").val());
    };

    this.Definir = function (dados) {
      const fInputText = function (selector, valor, digitosDecimais) {
        if (isNaN(parseFloat(valor))) {
          return;
        }

        if (valor === "") {
          $(selector).val("");
        } else {
          $(selector).val(
            _this.Instancia.Geral.NumericoTexto(valor, digitosDecimais, ".")
          );
        }
      };

      const fSelect = function (selector, valor) {
        if (valor === undefined) {
          return;
        }

        let val = null;
        $(selector + " option").each(function (i, o) {
          const option = $(o);
          if (option.text() === valor) {
            val = option.val();
          }
        });
        if (val !== null) {
          $(selector).val(val);
        }
        $(selector).niceSelect("update");
      };

      const fInputRadio = function (selector, valor) {
        if (valor === undefined) {
          return;
        }

        $(selector).each(function (i, o) {
          const inputRadio = $(o);
          const text = inputRadio.parent().parent().find("span").text();
          inputRadio.prop("checked", text === valor);
        });

        $(selector).iCheck("update");
      };

      const fInputCheckbox = function (selector, valor) {
        if (valor === undefined) {
          return;
        }

        $(selector).prop("checked", !!valor).iCheck("update");
      };

      const fSlider = function (selector, valor) {
        if (valor === undefined) {
          return;
        }

        $(selector).jRange("setValue", String(valor));
      };

      dados = $.extend(
        {
          predicao: undefined,
          aposta: undefined,
          aoPerderTipo: undefined,
          aoPerderVezes: undefined,
          aoPerderModo: undefined,
          aoPerderIncrementar: undefined,
          aoPerderDecrementar: undefined,
          aoPerderReverter: undefined,
          aoPerderParar: undefined,
          aoVencerTipo: undefined,
          aoVencerVezes: undefined,
          aoVencerModo: undefined,
          aoVencerIncrementar: undefined,
          aoVencerDecrementar: undefined,
          aoVencerReverter: undefined,
          aoVencerParar: undefined,
          velocidade: undefined,
          apostaTotal: undefined,
          saldoMinimo: undefined,
          saldoMaximo: undefined,
          apostaMaxima: undefined,
        },
        dados
      );

      fInputText("#prediction", dados.predicao, 0);

      fInputText("#betAmount", dados.aposta, 8);

      fSelect('select[name="on-loss-term"]', dados.aoPerderTipo);
      fInputText('input[name="on-loss-bets"]', dados.aoPerderVezes, 0);
      fInputRadio('.radioBox.left input[type="radio"]', dados.aoPerderModo);
      fInputText('input[name="on-loss-inc"]', dados.aoPerderIncrementar, 0);
      fInputText('input[name="on-loss-dec"]', dados.aoPerderDecrementar, 0);
      fInputCheckbox('input[name="on-loss-rev"]', dados.aoPerderReverter);
      fInputCheckbox('input[name="on-loss-stop"]', dados.aoPerderParar);

      fSelect('select[name="on-win-term"]', dados.aoVencerTipo);
      fInputText('input[name="on-win-bets"]', dados.aoVencerVezes, 0);
      fInputRadio('.radioBox.right input[type="radio"]', dados.aoVencerModo);
      fInputText('input[name="on-win-inc"]', dados.aoVencerIncrementar, 0);
      fInputText('input[name="on-win-dec"]', dados.aoVencerDecrementar, 0);
      fInputCheckbox('input[name="on-win-rev"]', dados.aoVencerReverter);
      fInputCheckbox('input[name="on-win-stop"]', dados.aoVencerParar);

      fSlider('input[name="acceleration"]', dados.velocidade);

      fInputText('input[name="bets-limit"]', dados.apostaTotal, 0);
      fInputText('input[name="balance-under-limit"]', dados.saldoMinimo, 8);
      fInputText('input[name="balance-over-limit"]', dados.saldoMaximo, 8);
      fInputText('input[name="bet-over-limit"]', dados.apostaMaxima, 8);
    };

    this.Apostar = function () {
      Game.play();
    };

    this.PararApostas = function () {
      Game.stopAutoplay();
      Game.playFlag = false;
    };

    this.ApostaEmExecucao = function () {
      return Game.playFlag || Game.autoPlayFlag;
    };

    this.Animacao = function (modo) {
      if (modo !== undefined) {
        Game.animation = !!modo ? "on" : "off";
      }
      return Game.animation === "on";
    };

    this.interceptadorClientSeed = null;
    this.ClientSeed = function (trocar, customizado) {
      if (trocar) {
        if (!customizado) {
          if (this.interceptadorClientSeed === null) {
            this.interceptadorClientSeed = false;
            this.Instancia.InterceptadorAjax.Anexar(
              "request",
              "ClientSeed",
              function (request) {
                if (request.action === "randomizeSeed") {
                  _this.interceptadorClientSeed = true;
                  _this.Instancia.Geral.Toast(
                    "Solicitando novo Client Seed ao servidor."
                  );
                }
              }
            );
            this.Instancia.InterceptadorAjax.Anexar(
              "response",
              "ClientSeed",
              function (response, request) {
                if (request.action === "randomizeSeed") {
                  _this.interceptadorClientSeed = false;
                  if (response === null || !response.result) {
                    _this.Instancia.Geral.Toast(
                      "error",
                      "O Client Seed não foi trocado no modo normal. Ocorreu um erro de comunicação com o servidor."
                    );
                  } else {
                    _this.Instancia.Geral.Toast(
                      "Client Seed trocado. Modo normal."
                    );
                  }
                }
              }
            );
          }
          if (_this.interceptadorClientSeed !== true) {
            window.randomizeSeed();
          } else {
            _this.Instancia.Geral.Toast(
              "Um novo Client Seed j&aacute; foi solicitado ao servidor, mas ainda n&atilde;o houve resposta."
            );
          }
        } else {
          const seed = "0"
            .repeat(3)
            .split("")
            .map((x) => Math.random().toString(15).substr(2))
            .join("")
            .substr(0, 32);
          $("#clientSeed").val(seed);
          this.Instancia.Geral.Toast("Client Seed trocado. Modo customizado.");
        }
      }
      return $("#clientSeed").val();
    };
  })(this);

  this.Geral = new (function (instancia) {
    this.Instancia = instancia;

    this.Toast = function (toast, param2, param3) {
      if (typeof toast === "string") {
        if (typeof param2 !== "string") {
          toast = { icon: "info", text: toast };
        } else {
          toast = { icon: toast, text: param2 };
        }
      }

      if (
        arguments.length &&
        typeof arguments[arguments.length - 1] === "boolean"
      ) {
        const exibirSempre = arguments[arguments.length - 1];
        if (
          !exibirSempre &&
          (!this.Instancia.Objetos.JanelaModal ||
            !this.Instancia.Objetos.JanelaModal.isOpen)
        ) {
          return;
        }
      }

      jQuery.toast(
        $.extend(
          {
            loader: false,
            hideAfter: 5000,
            allowToastClose: false,
          },
          toast
        )
      );
    };

    this.Numerico = function (valor, valorPadrao) {
      valorPadrao = valorPadrao !== undefined ? valorPadrao : 0;
      var valorFloat = parseFloat(
        typeof valor === "number" ? valor : String(valor).replace(",", ".")
      );
      var result = isNaN(valorFloat) ? valorPadrao : valorFloat;
      return result;
    };

    this.NumericoTexto = function (valor, digitosDecimais, separadorDecimal) {
      digitosDecimais =
        digitosDecimais !== undefined
          ? digitosDecimais
          : this.Instancia.Definicoes.DigitosDecimais;
      separadorDecimal =
        separadorDecimal !== undefined
          ? separadorDecimal
          : this.Instancia.Definicoes.SeparadorDecimal;

      var valorFloat = parseFloat(
        typeof valor === "number" ? valor : String(valor).replace(",", ".")
      );
      var result = isNaN(valorFloat)
        ? ""
        : valorFloat
            .toFixed(digitosDecimais + 1)
            .replace(".", separadorDecimal);
      if (result.length) {
        result = result.substr(0, result.length - 1);
        if (result[result.length - 1] == separadorDecimal) {
          result = result.substr(0, result.length - 1);
        }
      }
      return result;
    };

    this.CarregarScript = function (src, onLoad) {
      const element = document.createElement("SCRIPT");
      element.type = "text/javascript";
      element.src = src;
      element.onload = onLoad;
      document.getElementsByTagName("head")[0].appendChild(element);
    };

    this.CarregarStylesheet = function (href, onLoad) {
      const element = document.createElement("link");
      element.rel = "stylesheet";
      element.type = "text/css";
      element.href = href;
      element.media = "all";
      element.onload = onLoad;
      document.getElementsByTagName("head")[0].appendChild(element);
    };

    this.CarregarStylesheetCode = function (code) {
      const element = document.createElement("style");
      element.innerHTML = code;
      document.getElementsByTagName("head")[0].appendChild(element);
    };

    this.ReplaceAll = function (target, search, replacement) {
      return String(target).split(search).join(replacement);
    };

    this.ZeroEsquerda = function (num, len) {
      var num = String(Array(len + 1).join("0") + num);
      num = num.substring(num.length - len, num.length);
      return num;
    };

    this.FormatarData = function (date, formato) {
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
    };

    this.FormatarString = function (msg) {
      var params =
        typeof msg !== "string" && isFinite(msg.length) ? msg : arguments;

      if (params.length === 0) return "";
      else {
        msg = params[0];
        for (let i = 1; i < params.length; i++) {
          msg = this.ReplaceAll(msg, "{" + (i - 1) + "}", params[i]);
        }
        return msg;
      }
    };
  })(this);

  this.InterceptadorAjax = new (function (instancia) {
    this.Instancia = instancia;

    this.Ativado = false;

    this.Ativar = function (modo) {
      if (
        modo &&
        !(XMLHttpRequest.prototype.sendOriginal instanceof Function)
      ) {
        XMLHttpRequest.prototype.sendOriginal = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send =
          this.Instancia.InterceptadorAjax.XMLHttpRequestSend;

        this.Instancia.Configuracao.Log("Interceptador Ajax ativado.");
      }

      this.Ativado = modo;
    };

    this.Lista = {};

    this.Anexar = function (direcao, nome, fInterceptador) {
      this.Lista[nome + (direcao === "request" ? "_request" : "_response")] =
        fInterceptador;
    };

    this.XMLHttpRequestSend = function (queryString) {
      const _this = window.Cabot;

      const queryStringArray = queryString.split("&").map((x) => x.split("="));
      const queryStringJson = {};
      for (let i = 0; i < queryStringArray.length; i++) {
        queryStringJson[queryStringArray[i][0]] = queryStringArray[i][1];
      }

      let processarAjax = true;

      if (_this.Instancia.InterceptadorAjax.Ativado) {
        const lista = _this.Instancia.InterceptadorAjax.Lista;
        for (let key in lista) {
          if (key.indexOf("_request") >= 0 && lista[key] instanceof Function) {
            let result = lista[key](queryStringJson);
            processarAjax &= result === undefined || !!result;
          }
        }
        this.dataRequest = queryStringJson;
        this.addEventListener(
          "load",
          _this.Instancia.InterceptadorAjax.XMLHttpRequestLoad
        );
        this.addEventListener(
          "error",
          _this.Instancia.InterceptadorAjax.XMLHttpRequestLoad
        );
      }

      if (processarAjax) {
        queryStringArray.length = 0;
        for (key in queryStringJson) {
          queryStringArray[queryStringArray.length] = [
            key,
            queryStringJson[key],
          ];
        }
        this.sendOriginal(queryStringArray.map((x) => x.join("=")).join("&"));
      } else {
        _this.Instancia.LuckygamesIo.PararApostas();
      }

      _this.Instancia.Configuracao.Log(
        _this.Instancia.Geral.FormatarString(
          "Interceptacao Ajax. Ativado: {0}. Processamento autorizado: {1}",
          _this.Instancia.InterceptadorAjax.Ativado,
          !!processarAjax
        ),
        queryStringJson
      );
    };

    this.XMLHttpRequestLoad = function (e) {
      const _this = window.Cabot;

      const xhr = e.currentTarget;
      const request = xhr.dataRequest;
      let response;
      try {
        response = JSON.parse(xhr.responseText);
      } catch (ex) {
        response = null;
      }

      if (_this.Instancia.InterceptadorAjax.Ativado) {
        const lista = _this.Instancia.InterceptadorAjax.Lista;
        for (let key in lista) {
          if (key.indexOf("_response") >= 0 && lista[key] instanceof Function) {
            lista[key](response, request, xhr, e);
          }
        }
      }

      _this.Instancia.Configuracao.Log(
        _this.Instancia.Geral.FormatarString(
          "Interceptacao Ajax finalizada. Resposta recebida do servidor."
        ),
        request,
        response
      );
    };
  })(this);

  this.Layout = new (function (instancia) {
    this.Instancia = instancia;
    const _this = this.Instancia;

    this.OnAbrirJanela = [];

    this.Montar = function () {
      const cssBase = this.Instancia.Geral.ReplaceAll(
        `
                .jq-toast-wrap { 
                    z-index: 10000000!important; 
                }
                #ativador {
                    line-height: 40px;
                }
                :host a {
                    color: darkgreen
                }
                :host a:hover {
                    color: forestgreen
                }
                :host.btn, :host .btn {
                    width: auto;
                    padding: 0px 10px;
                    float: none;
                    font-size: 12px;
                    line-height: 25px;
                }
                :host .botoes .btn {
                    margin: 0;
                }
                :host input[type="text"] {
                    font-family: 'Cousine', monospace;
                    font-size: 20px;
                    background-color: #f0f0f0;
                    border: 1px solid gainsboro;
                    width: 100%;
                }
                :host article h1, :host article h2, :host article h3, :host article h4, :host article h5, :host article h6 {
                    margin: 3px 0 6px 0;
                    padding: 0;
                    text-align: center;
                    font-size: 13px;
                    font-weight: normal;
                    text-transform: uppercase;
                    text-decoration: underline;
                }
                :host .grafico {
                    min-height: 50px;
                    background: #f8f8f8;
                    margin: 5px 0;
                    padding: 5px;
                    text-align: center;
                    border: 1px solid lightgray;
                    border-radius: 4px;
                }
                :host span.info {
                    display: block;
                    margin: 0 0 10px 0;
                    font-size: 12px;
                    text-align: justify;
                }
                :host .divisor {
                    border-bottom: 2px solid gainsboro;
                    font-size: 0;
                    margin: 5px 0;
                }
            `,
        ":host",
        "." + this.Instancia.Definicoes.ClassCss
      );
      this.Instancia.Geral.CarregarStylesheetCode(cssBase);

      this.BotaoAtivador();
      this.Janela();
      this.AdicionarSecao(this.SecoesPadrao.Cabecalho);
    };

    this.SecoesPadrao = {
      Cabecalho: {
        Titulo: "",

        Css: `
                    :host > div {
                        background-image: url('http://info.cabral.srv.br/GameBot/r2d2.jpg');
                        background-position: 20px 0;
                        background-repeat: no-repeat;
                        background-size: contain;
                        padding-left: 155px;
                        padding-left: 155px;
                        height: 100px;
                        border-bottom: 1px solid #f0f0f0
                    }
                    :host > div h1 {
                        font-family: 'Bowlby One SC', cursive;
                        margin: 0;
                        font-size: 25px;
                        font-weight: normal;
                        color: #307DAC;
                        text-decoration: none;
                        text-align: left;
                    }
                    :host > div h2 {
                        font-family: 'Bangers', cursive;
                        margin: 0;
                        font-size: 18px;
                        font-weight: normal;
                        color: #222222;
                        text-decoration: none;
                        text-align: left;
                    }
                    :host > div div {
                        font-size: 10px;
                        margin-top: 5px;
                    }
                `,

        Html:
          this.Instancia.Geral.FormatarString("<div>") +
          this.Instancia.Geral.FormatarString(
            "<h1>{0}</h1>",
            this.Instancia.Definicoes.Nome
          ) +
          this.Instancia.Geral.FormatarString(
            "<h2>Seu ex&eacute;rcito de rob&ocirc;s que fazem suas apostas valer</h2>"
          ) +
          this.Instancia.Geral.FormatarString(
            '<div><a target="_blank" href="https://luckygames.io/">https://luckygames.io/</a></div>'
          ) +
          this.Instancia.Geral.FormatarString("</div>"),
      },
    };

    this.AdicionarSecao = function (secao) {
      if (typeof secao !== "object") {
        return;
      }

      if (
        !$("." + this.Instancia.Definicoes.ClassCss + "#janela").children()
          .length
      ) {
        this.Instancia.Objetos.Janela.append(
          this.Instancia.Geral.FormatarString(
            '<div class="secoes"></div><footer>{0}</footer>',
            this.Instancia.Definicoes.ContatoDoSuporte
          )
        );
        this.Instancia.Objetos.JanelaSecoes = $(
          ".secoes",
          this.Instancia.Objetos.Janela
        );
        const cssGeral = this.Instancia.Geral.ReplaceAll(
          `
                    :host footer {
                        text-align: center;
                        color: gray;
                        margin-top: 15px;
                        padding-top: 10px;
                        border-top: 1px solid gainsboro;
                    }
                    :host .secoes article {
                        margin: 5px 0 15px 0;
                    }
                    :host .secoes > h1 {
                        background-color: #307DAC;
                        color: white;
                        box-shadow: 0 0 15px grey;
                        font-family: 'Titillium Web', sans-serif;
                        font-weight: normal;
                        margin: 0 0 10px 0;
                        padding: 5px 10px;
                        border: 1px solid gainsboro;
                        border-radius: 8px;
                        cursor: pointer;
                    }
                `,
          ":host",
          "." + this.Instancia.Definicoes.ClassCss
        );
        this.Instancia.Geral.CarregarStylesheetCode(cssGeral);
      }

      const cssId =
        "id" + this.Instancia.Objetos.JanelaSecoes.find("article").length + 1;

      this.Instancia.Geral.CarregarStylesheetCode(
        this.Instancia.Geral.ReplaceAll(
          secao.Css,
          ":host",
          "." + this.Instancia.Definicoes.ClassCss + " article." + cssId
        )
      );

      let html = "";

      if (Array.isArray(secao.Botoes)) {
        html += '<div class="divisor">&nbsp;</div><div class="botoes">';
        for (let i = 0; i < secao.Botoes.length; i++) {
          html += this.Instancia.Geral.FormatarString(
            '<button class="btn {0}">{1}</button> ',
            secao.Botoes[i].id,
            secao.Botoes[i].nome
          );
        }
        html += "</div>";
      }

      html = this.Instancia.Geral.FormatarString(
        '<article class="{2}">{0}{1}</article>',
        secao.Html instanceof Function ? secao.Html() : secao.Html,
        html,
        cssId
      );
      if (secao.Titulo) {
        html =
          this.Instancia.Geral.FormatarString("<h1>{0}</h1>", secao.Titulo) +
          html;
      }
      this.Instancia.Objetos.JanelaSecoes.append(html);
      $(".secoes > h1:last", "." + this.Instancia.Definicoes.ClassCss).click(
        function () {
          $(this).next().slideToggle();
        }
      );
      secao.Container = $(
        ".secoes > article:last",
        "." + this.Instancia.Definicoes.ClassCss
      );

      this.Configurador.InputNumber(
        $('input[data-tipo="number"]', secao.Container)
      );

      if (secao.Js instanceof Function) {
        secao.Js();
      }

      if (Array.isArray(secao.Botoes)) {
        for (let i = 0; i < secao.Botoes.length; i++) {
          $(".botoes .btn." + secao.Botoes[i].id, secao.Container).click(
            function () {
              const btn = $(this);
              if (btn.hasClass("ativo")) {
                return;
              }
              btn.siblings(".btn").removeClass("red").removeClass("ativo");
              btn.addClass("red").addClass("ativo");
              if (secao.BotoesFunction instanceof Function) {
                secao.BotoesFunction(secao.Botoes[i].id, secao.Botoes[i]);
              }
            }
          );
        }
        $(".botoes .btn:first-child", secao.Container).click();
      }
    };

    this.BotaoAtivador = function () {
      const _this = this;

      $("body").append(
        this.Instancia.Geral.FormatarString(
          '<button id="ativador" class="{1} btn blue">{0}</button>',
          this.Instancia.Definicoes.Nome,
          this.Instancia.Definicoes.ClassCss
        )
      );
      this.Instancia.Objetos.BotaoAtivador = $(
        "#ativador." + this.Instancia.Definicoes.ClassCss
      ).css({
        position: "fixed",
        bottom: "10px",
        right: "10px",
        "z-index": "10000002",
        "font-weight": "bold",
        "font-size": "20px",
      });
    };

    this.Janela = function () {
      const _this = this;
      $("body").append(
        this.Instancia.Geral.FormatarString(
          '<div id="janela" class="{0}"></div>',
          this.Instancia.Definicoes.ClassCss
        )
      );
      this.Instancia.Objetos.Janela = $(
        "#janela." + this.Instancia.Definicoes.ClassCss
      );
      this.Instancia.Objetos.JanelaModal = new jBox("Modal", {
        title: this.Instancia.Definicoes.Nome,
        content: this.Instancia.Objetos.Janela,
        attach: this.Instancia.Objetos.BotaoAtivador,
        width: 450,
        maxHeight: window.innerHeight * 0.85,
        overlay: false,
        draggable: "title",
        repositionOnOpen: false,
        repositionOnContent: false,
        animation: "flip",
        blockScroll: false,
        onOpen: function () {
          setTimeout(function () {
            const listaEventos = Array.isArray(
              _this.Instancia.Layout.OnAbrirJanela
            )
              ? _this.Instancia.Layout.OnAbrirJanela
              : [];
            for (let i = 0; i < listaEventos.length; i++) {
              if (listaEventos[i] instanceof Function) {
                listaEventos[i]();
              }
            }
          }, 1000);
        },
      });
    };

    this.Configurador = {
      InputNumber: function (selector) {
        const objs = $(selector);
        objs.blur(function () {
          let inputText = $(this);

          const data = {};

          data.padrao = parseFloat(
            String(inputText.attr("data-padrao")).replace(",", ".")
          );
          data.padrao = isFinite(data.padrao) ? data.padrao : "";

          data.digitos = parseInt(inputText.attr("data-digitos"));
          data.digitos = isFinite(data.digitos) ? data.digitos : undefined;

          data.min = parseFloat(
            String(inputText.attr("data-min")).replace(",", ".")
          );
          data.min = isFinite(data.min) ? data.min : undefined;

          data.max = parseFloat(
            String(inputText.attr("data-max")).replace(",", ".")
          );
          data.max = isFinite(data.max) ? data.max : undefined;

          data.valor = inputText.val().trim();
          data.valor = _this.Instancia.Geral.Numerico(data.valor, data.padrao);

          if (typeof data.valor === "number") {
            if (data.min !== undefined && data.valor < data.min) {
              data.valor = data.min;
            } else if (data.max !== undefined && data.valor > data.max) {
              data.valor = data.max;
            }
            data.valor = _this.Instancia.Geral.NumericoTexto(
              data.valor,
              data.digitos
            );
          }

          inputText.val(data.valor);

          inputText = inputText.get(0);
          inputText.valor = data.valor;
          if (typeof inputText.number === "undefined") {
            inputText.number = function (valor) {
              if (arguments.length) {
                inputText.value = valor;
                $(inputText).blur();
              }
              return _this.Instancia.Geral.Numerico(inputText.valor, null);
            };
          }
        });
        objs.blur();
      },
    };
  })(this);

  this.Configuracao = new (function (instancia) {
    this.Instancia = instancia;

    this.Log = function () {
      if (!this.Instancia.Definicoes.Debug) {
        return;
      }
      const dataHora = this.Instancia.Geral.FormatarData(new Date());
      let code =
        'console.log("' + this.Instancia.Definicoes.Nome + ': " + dataHora';
      for (let i = 0; i < arguments.length; i++) {
        code += ", arguments[" + i + "]";
      }
      code += ");";
      eval(code);
    };

    this.CarregarBibliotecas = function () {
      const bibliotecas = [
        {
          tipo: "css",
          url: "https://fonts.googleapis.com/css?family=Bangers|Bowlby+One+SC|Titillium+Web|Cousine",
          precisaCarregar: true,
        },
        {
          tipo: "js",
          url: "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js",
          precisaCarregar: function () {
            return !window.jQuery;
          },
        },
        {
          tipo: "css",
          url: "https://cdnjs.cloudflare.com/ajax/libs/jBox/0.4.9/jBox.min.css",
          precisaCarregar: function () {
            return !window.jBox;
          },
        },
        {
          tipo: "js",
          url: "https://cdnjs.cloudflare.com/ajax/libs/jBox/0.4.9/jBox.min.js",
          precisaCarregar: function () {
            return !window.jBox;
          },
        },
        {
          tipo: "css",
          url: "https://cdnjs.cloudflare.com/ajax/libs/jquery-toast-plugin/1.3.2/jquery.toast.min.css",
          precisaCarregar: function () {
            return !jQuery.toast;
          },
        },
        {
          tipo: "js",
          url: "https://cdnjs.cloudflare.com/ajax/libs/jquery-toast-plugin/1.3.2/jquery.toast.min.js",
          precisaCarregar: function () {
            return !jQuery.toast;
          },
        },
        {
          tipo: "css",
          url: "https://cdnjs.cloudflare.com/ajax/libs/chartist/0.11.0/chartist.min.css",
          precisaCarregar: function () {
            return !window.Chartist;
          },
        },
        {
          tipo: "js",
          url: "https://cdnjs.cloudflare.com/ajax/libs/chartist/0.11.0/chartist.min.js",
          precisaCarregar: function () {
            return !window.Chartist;
          },
        },
      ];

      const _this = this;
      const promise = new Promise(function (resolve, reject) {
        const fProcessarCarregamentos = function (index) {
          if (index === undefined) {
            index = 0;
          }
          if (index < bibliotecas.length) {
            var fRecursivo = function () {
              fProcessarCarregamentos(++index);
            };
            if (
              (bibliotecas[index].precisaCarregar instanceof Function &&
                bibliotecas[index].precisaCarregar()) ||
              (!(bibliotecas[index].precisaCarregar instanceof Function) &&
                bibliotecas[index])
            ) {
              var fCarregarUrl =
                bibliotecas[index].tipo === "css"
                  ? _this.Instancia.Geral.CarregarStylesheet
                  : bibliotecas[index].tipo === "js"
                  ? _this.Instancia.Geral.CarregarScript
                  : null;
              _this.Instancia.Configuracao.Log(
                "Carregando: " + bibliotecas[index].url
              );
              fCarregarUrl(bibliotecas[index].url, fRecursivo);
            } else {
              fRecursivo();
            }
          } else {
            resolve();
          }
        };
        fProcessarCarregamentos();
      });

      return promise;
    };
  })(this);

  this.Regras = new (function (instancia) {
    this.Instancia = instancia;
    const _this = this;

    this.CarregarModulos = function () {
      for (let i = 0; i < this.Lista.length; i++) {
        this.Instancia.Layout.AdicionarSecao(this.Lista[i]);
        if (this.Lista[i].OnAjaxRequest instanceof Function) {
          this.Instancia.InterceptadorAjax.Anexar(
            "request",
            "RegraModulo" + this.Instancia.Geral.ZeroEsquerda(i, 3),
            this.Lista[i].OnAjaxRequest
          );
        }
        if (this.Lista[i].OnAjaxResponse instanceof Function) {
          this.Instancia.InterceptadorAjax.Anexar(
            "response",
            "RegraModulo" + this.Instancia.Geral.ZeroEsquerda(i, 3),
            this.Lista[i].OnAjaxResponse
          );
        }
      }
    };

    this.Estatisticas = function () {
      return this.Lista[0].Dados;
    };

    this.Lista = [
      new (function (instancia) {
        this.Instancia = instancia;
        const _this = this;

        this.Titulo = "Estat&iacute;sticas";

        this.Container;

        this.Css = `
                    :host table {
                        width: 100%;
                    }
                    :host table td {
                        font-size: 11px;
                        vertical-align: middle;
                        white-space: nowrap;
                    }
                    :host table td:nth-child(1), :host table td:nth-child(3) {
                        text-align: right;
                        padding: 3px 5px 3px 0;
                    }
                    :host table td:nth-child(2), :host table td:nth-child(4) {
                        text-align: left;
                        color: black;
                        padding: 3px 0 3px 5px;
                        border-left: 2px solid gainsboro;
                    }
                    :host table td[colspan] {
                        text-align: left;
                        border-width: 0;
                        padding: 0;
                    }
                    :host .saldo .pontos {
                        text-align: right;
                        margin: 4px 0 0 0;
                    }
                    :host .saldo .pontos input {
                        width: 80px;
                        text-align: center;
                    }
                    :host table .sorteados .grafico {
                        overflow: overlay;
                        height: 115px;
                        width: 379px;
                    }
                `;

        this.Html = this.Instancia.Geral.FormatarString(`
                        <table>
                            <tr>
                                <td>Tempo corrido</td>
                                <td class="tempoCorrido">?</td>
                                <td>Velocidade</td>
                                <td class="velocidade">?</td>
                            </tr>
                            <tr><td colspan="4"><div class='divisor'>&nbsp;</div></td></tr>
                            <tr>
                                <td>Apostas feitas</td>
                                <td class="apostasFeitas">?</td>
                                <td>Maior aposta</td>
                                <td class="maiorAposta">?</td>
                            </tr>
                            <tr>
                                <td>Total apostado</td>
                                <td class="totalApostado">?</td>
                                <td>Lucro</td>
                                <td class="lucro">?</td>
                            </tr>
                            <tr>
                                <td>Saldo inicial</td>
                                <td class="saldoInicial">?</td>
                                <td>Saldo final</td>
                                <td class="saldoFinal">?</td>
                            </tr>
                            <tr><td colspan="4"><div class='divisor'>&nbsp;</div></td></tr>
                            <tr>
                                <td>Apostas vencidas</td>
                                <td class="apostasVencidas">?</td>
                                <td>Apostas perdidas</td>
                                <td class="apostasPerdidas">?</td>
                            </tr>
                            <tr>
                                <td>Sequ&ecirc;ncia vencendo</td>
                                <td class="sequenciaVencendo">?</td>
                                <td>Sequ&ecirc;ncia perdendo</td>
                                <td class="sequenciaPerdendo">?</td>
                            </tr>
                            <tr>
                                <td>Maior sequ&ecirc;ncia</td>
                                <td class="maiorSequenciaVencendo">?</td>
                                <td>Maior sequ&ecirc;ncia</td>
                                <td class="maiorSequenciaPerdendo">?</td>
                            </tr>
                            <tr><td colspan="4"><div class='divisor'>&nbsp;</div></td></tr>
                            <tr>
                                <td colspan="4" class="saldo">
                                    <h2>Progress&atilde;o do saldo</h2>
                                    <div class="pontos">Limite de pontos no gr&aacute;fico:
                                        <input type="text" data-tipo="number" data-digitos="0" data-min="10" maxlength="6" value="1000" />
                                    </div>
                                    <div class="grafico">Carregando gr&aacute;fico...</div>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="1" class="predicao">
                                    <h2>Estat&iacute;sica</h2>
                                    <div class="grafico">Carregando gr&aacute;fico...</div>
                                </td>
                                <td colspan="3" class="sequencias">
                                    <h2>Vis&atilde;o de <span></span> Sequ&ecirc;ncias</h2>
                                    <div class="grafico">Carregando gr&aacute;fico...</div>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="4" class="sequenciasRecorrentes">
                                    <h2>Sequ&ecirc;ncias mais recorrentes</h2>
                                    <div class="grafico">Carregando gr&aacute;fico...</div>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="4" class="sorteados">
                                    <h2>N&uacute;meros mais sorteados</h2>
                                    <div class="grafico">Carregando gr&aacute;fico...</div>
                                </td>
                            </tr>
                        </table>
                        <button class="reiniciar btn grey">Reiniciar contadores</button>
                    `);

        this.Js = function () {
          _this.Grafico.Saldo.Inicializar();
          _this.Grafico.Predicao.Inicializar();
          _this.Grafico.Sequencias.Inicializar();
          _this.Grafico.SequenciasRecorrentes.Inicializar();
          _this.Grafico.Sorteados.Inicializar();

          _this.Instancia.Objetos.SecaoEstatisticasBtnReiniciar =
            this.Container.find(".reiniciar");
          _this.Instancia.Objetos.SecaoEstatisticasBtnReiniciar.click(
            function () {
              _this.Dados.ReiniciarValores();
              _this.Dados.AtualizarCamposDaTela();

              _this.Instancia.Geral.Toast(
                "Estat&iacute;sticas reiniciadas.",
                false
              );
            }
          );
          _this.Instancia.Objetos.SecaoEstatisticasBtnReiniciar.click();
        };

        this.Grafico = {
          Saldo: {
            Inicializar: function () {
              const css = _this.Instancia.Geral.ReplaceAll(
                `
                                :host .saldo .grafico .ct-series-a .ct-line {
                                    stroke: #333;
                                    stroke-width: 2px;
                                }
                            `,
                ":host",
                "." + _this.Instancia.Definicoes.ClassCss
              );
              _this.Instancia.Geral.CarregarStylesheetCode(css);

              _this.Instancia.Objetos.SecaoEstatisticasGraficoSaldoPontosInput =
                _this.Container.find(".saldo .pontos input");

              _this.Instancia.Objetos.SecaoEstatisticasGraficoSaldoDiv =
                _this.Container.find(".saldo .grafico");
              _this.Instancia.Objetos.SecaoEstatisticasGraficoSaldoDiv.html("");
              _this.Instancia.Objetos.SecaoEstatisticasGraficoSaldoData = {
                series: [[]],
              };
              _this.Instancia.Objetos.SecaoEstatisticasGraficoSaldoChartist =
                new Chartist.Line(
                  _this.Instancia.Objetos.SecaoEstatisticasGraficoSaldoDiv.get(
                    0
                  ),
                  _this.Instancia.Objetos.SecaoEstatisticasGraficoSaldoData,
                  {
                    width: "100%",
                    height: "100px",
                    fullWidth: true,
                    chartPadding: 0,
                    showLine: true,
                    showPoint: false,
                    showArea: false,
                    showLabel: false,
                    axisX: { showGrid: false, showLabel: false, offset: 0 },
                    axisY: { showGrid: true, showLabel: true, offset: 40 },
                    lineSmooth: Chartist.Interpolation.step() /* .simple()*/,
                  }
                );

              _this.Instancia.Layout.OnAbrirJanela.push(function () {
                _this.Instancia.Objetos.SecaoEstatisticasGraficoSaldoChartist.update();
              });
            },

            Reiniciar: function (valorInicial) {
              _this.Instancia.Objetos.SecaoEstatisticasGraficoSaldoData.series[0].length = 0;
              _this.Grafico.Saldo.Adicionar(valorInicial);
              _this.Grafico.Saldo.Adicionar(valorInicial);
              _this.Instancia.Objetos.SecaoEstatisticasGraficoSaldoChartist.update();
            },

            Adicionar: function (valor) {
              if (isNaN(parseFloat(valor))) {
                return;
              }

              const limiteDeBarras =
                _this.Instancia.Objetos.SecaoEstatisticasGraficoSaldoPontosInput.get(
                  0
                ).number();
              while (
                limiteDeBarras > 0 &&
                _this.Instancia.Objetos.SecaoEstatisticasGraficoSaldoData
                  .series[0].length > limiteDeBarras
              ) {
                _this.Instancia.Objetos.SecaoEstatisticasGraficoSaldoData.series[0].shift();
              }

              _this.Instancia.Objetos.SecaoEstatisticasGraficoSaldoData.series[0].push(
                valor
              );
              _this.Instancia.Objetos.SecaoEstatisticasGraficoSaldoChartist.update();
            },
          },

          Sequencias: {
            Inicializar: function () {
              const css = _this.Instancia.Geral.ReplaceAll(
                `
                                :host .sequencias .grafico .ct-series-a .ct-bar {
                                    stroke: #2EAB5B;
                                    stroke-width: 10px; 
                                }
                                :host .sequencias .grafico .ct-series-b .ct-bar {
                                    stroke: #AB2E40;
                                    stroke-width: 10px; 
                                }
                            `,
                ":host",
                "." + _this.Instancia.Definicoes.ClassCss
              );
              _this.Instancia.Geral.CarregarStylesheetCode(css);

              _this.Instancia.Objetos.SecaoEstatisticasGraficoSequenciasContador =
                _this.Container.find(".sequencias h2 span");

              _this.Instancia.Objetos.SecaoEstatisticasGraficoSequenciasDiv =
                _this.Container.find(".sequencias .grafico");
              _this.Instancia.Objetos.SecaoEstatisticasGraficoSequenciasDiv.html(
                ""
              );
              _this.Instancia.Objetos.SecaoEstatisticasGraficoSequenciasData = {
                series: [[], []],
              };
              _this.Instancia.Objetos.SecaoEstatisticasGraficoSequenciasChartist =
                new Chartist.Bar(
                  _this.Instancia.Objetos.SecaoEstatisticasGraficoSequenciasDiv.get(
                    0
                  ),
                  _this.Instancia.Objetos.SecaoEstatisticasGraficoSequenciasData,
                  {
                    width: "100%",
                    height: "100px",
                    stackBars: true,
                    fullWidth: true,
                    chartPadding: 0,
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
                  }
                );

              _this.Instancia.Layout.OnAbrirJanela.push(function () {
                _this.Instancia.Objetos.SecaoEstatisticasGraficoSequenciasChartist.update();
              });
            },

            Reiniciar: function (valorInicial) {
              _this.Instancia.Objetos.SecaoEstatisticasGraficoSequenciasData.series[0].length = 0;
              _this.Instancia.Objetos.SecaoEstatisticasGraficoSequenciasData.series[1].length = 0;
              _this.Instancia.Objetos.SecaoEstatisticasGraficoSequenciasContador.text(
                ""
              );
              _this.Instancia.Objetos.SecaoEstatisticasGraficoSequenciasChartist.update();
            },

            Adicionar: function (valor) {
              if (isNaN(parseFloat(valor))) {
                return;
              }
              if (valor >= 0) {
                _this.Instancia.Objetos.SecaoEstatisticasGraficoSequenciasData.series[0].push(
                  1
                );
                _this.Instancia.Objetos.SecaoEstatisticasGraficoSequenciasData.series[1].push(
                  0
                );
              } else {
                _this.Instancia.Objetos.SecaoEstatisticasGraficoSequenciasData.series[0].push(
                  0
                );
                _this.Instancia.Objetos.SecaoEstatisticasGraficoSequenciasData.series[1].push(
                  1
                );
              }

              let limiteDeBarras =
                10 +
                (_this.Dados.MaiorSequenciaVencendo() +
                  _this.Dados.MaiorSequenciaPerdendo());
              limiteDeBarras = limiteDeBarras < 40 ? limiteDeBarras : 40;
              if (
                _this.Instancia.Objetos.SecaoEstatisticasGraficoSequenciasData
                  .series[0].length > limiteDeBarras
              ) {
                _this.Instancia.Objetos.SecaoEstatisticasGraficoSequenciasData.series[0].shift();
                _this.Instancia.Objetos.SecaoEstatisticasGraficoSequenciasData.series[1].shift();
              }
              _this.Instancia.Objetos.SecaoEstatisticasGraficoSequenciasContador.text(
                _this.Instancia.Objetos.SecaoEstatisticasGraficoSequenciasData
                  .series[0].length
              );

              _this.Instancia.Objetos.SecaoEstatisticasGraficoSequenciasChartist.update();
            },
          },

          Sorteados: {
            Inicializar: function () {
              const css = _this.Instancia.Geral.ReplaceAll(
                `
                                :host .sorteados .grafico .ct-series-a .ct-bar {
                                    stroke: #333;
                                    stroke-width: 18px; 
                                }
                                :host .sorteados .grafico {
                                    overflow: auto;
                                    height: 100px;
                                }
                            `,
                ":host",
                "." + _this.Instancia.Definicoes.ClassCss
              );
              _this.Instancia.Geral.CarregarStylesheetCode(css);

              _this.Instancia.Objetos.SecaoEstatisticasGraficoSorteadosDiv =
                _this.Container.find(".sorteados .grafico");
              _this.Instancia.Objetos.SecaoEstatisticasGraficoSorteadosDiv.html(
                ""
              );
              _this.Instancia.Objetos.SecaoEstatisticasGraficoSorteadosData = {
                labels: "0"
                  .repeat(100)
                  .split("")
                  .map(function (x, i) {
                    return String(i);
                  }),
                series: [
                  "0"
                    .repeat(100)
                    .split("")
                    .map((x) => parseInt(x)),
                ],
              };
              _this.Instancia.Objetos.SecaoEstatisticasGraficoSorteadosChartist =
                new Chartist.Bar(
                  _this.Instancia.Objetos.SecaoEstatisticasGraficoSorteadosDiv.get(
                    0
                  ),
                  _this.Instancia.Objetos.SecaoEstatisticasGraficoSorteadosData,
                  {
                    width: "2500px",
                    height: "100px",
                    horizontalBars: false,
                    fullWidth: true,
                    chartPadding: 0,
                    axisX: {
                      showGrid: false,
                      showLabel: true,
                      offset: 30,
                    },
                    axisY: {
                      showGrid: true,
                      showLabel: true,
                      offset: 30,
                    },
                  }
                );

              _this.Instancia.Layout.OnAbrirJanela.push(function () {
                _this.Instancia.Objetos.SecaoEstatisticasGraficoSequenciasChartist.update();
              });
            },

            Reiniciar: function (valorInicial) {
              for (
                let i = 0;
                i <
                _this.Instancia.Objetos.SecaoEstatisticasGraficoSorteadosData
                  .series[0].length;
                i++
              ) {
                _this.Instancia.Objetos.SecaoEstatisticasGraficoSorteadosData.series[0][
                  i
                ] = 0;
              }
              _this.Instancia.Objetos.SecaoEstatisticasGraficoSorteadosChartist.update();
            },

            Adicionar: function (valor) {
              if (isNaN(parseFloat(valor))) {
                return;
              }
              _this.Instancia.Objetos.SecaoEstatisticasGraficoSorteadosData
                .series[0][valor]++;
              _this.Instancia.Objetos.SecaoEstatisticasGraficoSorteadosChartist.update();
            },
          },

          SequenciasRecorrentes: {
            Inicializar: function () {
              const css = _this.Instancia.Geral.ReplaceAll(
                `
                                :host .sequenciasRecorrentes .grafico {
                                    overflow: auto;
                                    height: 115px;
                                    width: 100%;
                                }
                                :host .sequenciasRecorrentes .grafico > span:first-child {
                                    display: none;
                                }
                                :host .sequenciasRecorrentes .grafico > span:last-child {
                                    display: block;
                                }
                                :host .sequenciasRecorrentes .valor.sequencia {
                                    display: inline-block;
                                    width: 10%;
                                    background-color: #ccc;
                                    border-radius: 5px;
                                    margin: 1px 0;
                                    color: black;
                                }
                                :host .sequenciasRecorrentes .lose, 
                                :host .sequenciasRecorrentes .win {
                                    display: inline-block;
                                    width: 44%;
                                }
                                :host .sequenciasRecorrentes .lose .percentual {
                                    text-align: left;
                                }
                                :host .sequenciasRecorrentes .win .percentual {
                                    text-align: right;
                                }
                                :host .sequenciasRecorrentes .valor.total,
                                :host .sequenciasRecorrentes .valor.percentual {
                                    display: inline-block;
                                    width: 25%;
                                    text-align: center;
                                }
                                :host .sequenciasRecorrentes .percentual {
                                    display: inline-block;
                                    width: 45%;
                                }
                                :host .sequenciasRecorrentes .percentual .barra {
                                    display: inline-block;
                                    min-width: 3px;
                                }
                                :host .sequenciasRecorrentes .win .barra {
                                    background-color: #2EAB5B;
                                }
                                :host .sequenciasRecorrentes .lose .barra {
                                    background-color: #AB2E40;
                                }
                            `,
                ":host",
                "." + _this.Instancia.Definicoes.ClassCss
              );
              _this.Instancia.Geral.CarregarStylesheetCode(css);

              _this.Instancia.Objetos.SecaoEstatisticasGraficoSequenciasRecorrentesDiv =
                _this.Container.find(".sequenciasRecorrentes .grafico");
              _this.Instancia.Objetos.SecaoEstatisticasGraficoSequenciasRecorrentesDiv.html(
                ""
              );
            },

            Reiniciar: function (valorInicial) {
              _this.Instancia.Objetos.SecaoEstatisticasGraficoSequenciasRecorrentesDiv.html(
                "<span>Sem dados para contabilizar</span>"
              );
              if (
                !_this.Instancia.Objetos
                  .SecaoEstatisticasGraficoSequenciasRecorrentesSequencias
              ) {
                _this.Instancia.Objetos.SecaoEstatisticasGraficoSequenciasRecorrentesSequencias =
                  {};
              }
              _this.Instancia.Objetos.SecaoEstatisticasGraficoSequenciasRecorrentesSequencias.contagem = 0;
              _this.Instancia.Objetos.SecaoEstatisticasGraficoSequenciasRecorrentesSequencias.win =
                [];
              _this.Instancia.Objetos.SecaoEstatisticasGraficoSequenciasRecorrentesSequencias.lose =
                [];
              _this.Instancia.Objetos.SecaoEstatisticasGraficoSequenciasRecorrentesSequencias.winTotal = 0;
              _this.Instancia.Objetos.SecaoEstatisticasGraficoSequenciasRecorrentesSequencias.loseTotal = 0;
            },

            Adicionar: function (resultado, sequencia) {
              const fAdicionarBloco = function () {
                const html = _this.Instancia.Geral.ReplaceAll(
                  `
                                    <div class="sequencia sequencia{seq}">
                                        <span class="lose">
                                            <span class="valor total">0</span>
                                            <span class="valor percentual">0</span>
                                            <span class="percentual">
                                                <span class="barra">&nbsp;</span>
                                            </span>
                                        </span>
                                        <span class="valor sequencia">{seq}</span>
                                        <span class="win">
                                            <span class="percentual">
                                                <span class="barra">&nbsp;</span>
                                            </span>
                                            <span class="valor percentual">0</span>
                                            <span class="valor total">0</span>
                                        </span>
                                    </div>`,
                  "{seq}",
                  ++_this.Instancia.Objetos
                    .SecaoEstatisticasGraficoSequenciasRecorrentesSequencias
                    .contagem
                );
                _this.Instancia.Objetos.SecaoEstatisticasGraficoSequenciasRecorrentesDiv.append(
                  html
                );
                return _this.Instancia.Objetos
                  .SecaoEstatisticasGraficoSequenciasRecorrentesSequencias
                  .contagem;
              };
              const fIncrementar = function (resultado, sequencia) {
                _this.Instancia.Objetos.SecaoEstatisticasGraficoSequenciasRecorrentesSequencias.winTotal +=
                  resultado === "win" ? 1 : 0;
                _this.Instancia.Objetos.SecaoEstatisticasGraficoSequenciasRecorrentesSequencias.loseTotal +=
                  resultado === "lose" ? 1 : 0;
                const dados =
                  resultado === "win"
                    ? _this.Instancia.Objetos
                        .SecaoEstatisticasGraficoSequenciasRecorrentesSequencias
                        .win
                    : resultado === "lose"
                    ? _this.Instancia.Objetos
                        .SecaoEstatisticasGraficoSequenciasRecorrentesSequencias
                        .lose
                    : null;
                dados[sequencia - 1] =
                  dados[sequencia - 1] === undefined
                    ? 1
                    : dados[sequencia - 1] + 1;
                $(
                  ".sequencia" + sequencia + " ." + resultado + " .valor.total",
                  _this.Instancia.Objetos
                    .SecaoEstatisticasGraficoSequenciasRecorrentesDiv
                ).html(dados[sequencia - 1]);
              };
              const fAtualizar = function () {
                const divs = $(
                  ".sequencia",
                  _this.Instancia.Objetos
                    .SecaoEstatisticasGraficoSequenciasRecorrentesDiv
                );
                for (var i = 0; i < divs.length; i++) {
                  const win =
                    _this.Instancia.Objetos
                      .SecaoEstatisticasGraficoSequenciasRecorrentesSequencias
                      .win[i] !== undefined
                      ? _this.Instancia.Objetos
                          .SecaoEstatisticasGraficoSequenciasRecorrentesSequencias
                          .win[i]
                      : 0;
                  let winPorcento =
                    (100 * win) /
                    _this.Instancia.Objetos
                      .SecaoEstatisticasGraficoSequenciasRecorrentesSequencias
                      .winTotal;
                  winPorcento =
                    (isNaN(winPorcento) ? 0 : winPorcento).toFixed(2) + "%";

                  $(
                    ".sequencia" + (i + 1) + " .win .valor.percentual",
                    _this.Instancia.Objetos
                      .SecaoEstatisticasGraficoSequenciasRecorrentesDiv
                  ).html(winPorcento);
                  $(
                    ".sequencia" + (i + 1) + " .win .barra",
                    _this.Instancia.Objetos
                      .SecaoEstatisticasGraficoSequenciasRecorrentesDiv
                  ).css("width", winPorcento);

                  const lose =
                    _this.Instancia.Objetos
                      .SecaoEstatisticasGraficoSequenciasRecorrentesSequencias
                      .lose[i] !== undefined
                      ? _this.Instancia.Objetos
                          .SecaoEstatisticasGraficoSequenciasRecorrentesSequencias
                          .lose[i]
                      : 0;
                  let losePorcento =
                    (100 * lose) /
                    _this.Instancia.Objetos
                      .SecaoEstatisticasGraficoSequenciasRecorrentesSequencias
                      .loseTotal;
                  losePorcento =
                    (isNaN(losePorcento) ? 0 : losePorcento).toFixed(2) + "%";

                  $(
                    ".sequencia" + (i + 1) + " .lose .valor.percentual",
                    _this.Instancia.Objetos
                      .SecaoEstatisticasGraficoSequenciasRecorrentesDiv
                  ).html(losePorcento);
                  $(
                    ".sequencia" + (i + 1) + " .lose .barra",
                    _this.Instancia.Objetos
                      .SecaoEstatisticasGraficoSequenciasRecorrentesDiv
                  ).css("width", losePorcento);
                }
              };
              if (
                sequencia >
                _this.Instancia.Objetos
                  .SecaoEstatisticasGraficoSequenciasRecorrentesSequencias
                  .contagem
              ) {
                while (sequencia > fAdicionarBloco());
              }
              fIncrementar(resultado, sequencia);
              fAtualizar();
            },
          },

          Predicao: {
            Inicializar: function () {
              const css = _this.Instancia.Geral.ReplaceAll(
                `
                                :host .predicao .grafico .ct-series-a .ct-slice-pie { 
                                    fill: #2EAB5B; 
                                }
                                :host .predicao .grafico .ct-series-b .ct-slice-pie { 
                                    fill: #AB2E40; 
                                }
                                :host .predicao .grafico .ct-label { 
                                    font-size: 1.3em;
                                    fill: white;
                                }
                            `,
                ":host",
                "." + _this.Instancia.Definicoes.ClassCss
              );
              _this.Instancia.Geral.CarregarStylesheetCode(css);

              _this.Instancia.Objetos.SecaoEstatisticasGraficoPredicaoDiv =
                _this.Container.find(".predicao .grafico");
              _this.Instancia.Objetos.SecaoEstatisticasGraficoPredicaoDiv.html(
                ""
              );
              _this.Instancia.Objetos.SecaoEstatisticasGraficoPredicaoData = {
                series: [0, 0],
              };
              _this.Instancia.Objetos.SecaoEstatisticasGraficoPredicaoChartist =
                new Chartist.Pie(
                  _this.Instancia.Objetos.SecaoEstatisticasGraficoPredicaoDiv.get(
                    0
                  ),
                  _this.Instancia.Objetos.SecaoEstatisticasGraficoPredicaoData,
                  {
                    width: "100%",
                    height: "100px",
                    fullWidth: true,
                    chartPadding: 0,
                    labelInterpolationFnc: function (value, serie) {
                      var total =
                        _this.Instancia.Objetos
                          .SecaoEstatisticasGraficoPredicaoData.series[0] +
                        _this.Instancia.Objetos
                          .SecaoEstatisticasGraficoPredicaoData.series[1];
                      var valor = parseInt(
                        (_this.Instancia.Objetos
                          .SecaoEstatisticasGraficoPredicaoData.series[serie] /
                          total) *
                          100
                      );
                      return valor + "%";
                    },
                  }
                );

              _this.Instancia.Layout.OnAbrirJanela.push(function () {
                _this.Instancia.Objetos.SecaoEstatisticasGraficoPredicaoChartist.update();
              });
            },

            Reiniciar: function () {
              _this.Instancia.Objetos.SecaoEstatisticasGraficoPredicaoData.series[0] = 1;
              _this.Instancia.Objetos.SecaoEstatisticasGraficoPredicaoData.series[1] = 1;
              _this.Instancia.Objetos.SecaoEstatisticasGraficoPredicaoData.Reiniciado = true;
              _this.Instancia.Objetos.SecaoEstatisticasGraficoPredicaoChartist.update();
            },

            Adicionar: function (valor) {
              if (
                _this.Instancia.Objetos.SecaoEstatisticasGraficoPredicaoData
                  .Reiniciado
              ) {
                _this.Instancia.Objetos.SecaoEstatisticasGraficoPredicaoData.Reiniciado = false;
                _this.Instancia.Objetos.SecaoEstatisticasGraficoPredicaoData.series[0] = 0;
                _this.Instancia.Objetos.SecaoEstatisticasGraficoPredicaoData.series[1] = 0;
              }
              _this.Instancia.Objetos.SecaoEstatisticasGraficoPredicaoData.series[0] +=
                valor > 0 ? 1 : 0;
              _this.Instancia.Objetos.SecaoEstatisticasGraficoPredicaoData.series[1] +=
                valor < 0 ? 1 : 0;
              _this.Instancia.Objetos.SecaoEstatisticasGraficoPredicaoChartist.update();
            },
          },
        };

        this.OnAjaxRequest = function (request) {
          if (request.game !== "dice") {
            return;
          }
        };

        this.OnAjaxResponse = function (response, request) {
          if (request.game !== "dice") {
            return;
          }
          if (response === null || !response.result) {
            return;
          }

          _this.Dados.tempoCorrido =
            _this.Dados.tempoCorrido === null
              ? new Date()
              : _this.Dados.tempoCorrido;
          let horasCorridas =
            new Date().getTime() - _this.Dados.tempoCorrido.getTime();
          horasCorridas = horasCorridas / 1000 / 60;

          const sequenciaVencendo = _this.Dados.sequenciaVencendo;
          const sequenciaPerdendo = _this.Dados.sequenciaPerdendo;

          _this.Dados.saldoInicial =
            _this.Dados.saldoInicial !== null
              ? _this.Dados.saldoInicial
              : parseFloat(response.balance) - parseFloat(response.profit);
          _this.Dados.saldoFinal = parseFloat(response.balance);
          _this.Dados.apostasFeitas++;
          _this.Dados.lucro += parseFloat(response.profit);
          _this.Dados.totalApostado += parseFloat(request.betAmount);
          _this.Dados.maiorAposta =
            parseFloat(request.betAmount) > _this.Dados.maiorAposta
              ? parseFloat(request.betAmount)
              : _this.Dados.maiorAposta;
          _this.Dados.apostasVencidas += response.gameResult === "win" ? 1 : 0;
          _this.Dados.apostasPerdidas += response.gameResult === "lose" ? 1 : 0;
          _this.Dados.sequenciaVencendo =
            response.gameResult === "win"
              ? _this.Dados.sequenciaVencendo + 1
              : 0;
          _this.Dados.sequenciaPerdendo =
            response.gameResult === "lose"
              ? _this.Dados.sequenciaPerdendo + 1
              : 0;
          _this.Dados.maiorSequenciaVencendo =
            _this.Dados.sequenciaVencendo > _this.Dados.maiorSequenciaVencendo
              ? _this.Dados.sequenciaVencendo
              : _this.Dados.maiorSequenciaVencendo;
          _this.Dados.maiorSequenciaPerdendo =
            _this.Dados.sequenciaPerdendo > _this.Dados.maiorSequenciaPerdendo
              ? _this.Dados.sequenciaPerdendo
              : _this.Dados.maiorSequenciaPerdendo;
          _this.Dados.velocidade = _this.Dados.apostasFeitas / horasCorridas;

          _this.Dados.AtualizarCamposDaTela();

          _this.Grafico.Saldo.Adicionar(_this.Dados.saldoFinal);
          _this.Grafico.Sequencias.Adicionar(parseFloat(response.profit));
          _this.Grafico.Predicao.Adicionar(parseFloat(response.profit));
          _this.Grafico.Sorteados.Adicionar(parseFloat(response.resultNumber));

          if (sequenciaPerdendo > 0 && _this.Dados.sequenciaPerdendo === 0) {
            _this.Grafico.SequenciasRecorrentes.Adicionar(
              "lose",
              sequenciaPerdendo
            );
          }
          if (sequenciaVencendo > 0 && _this.Dados.sequenciaVencendo === 0) {
            _this.Grafico.SequenciasRecorrentes.Adicionar(
              "win",
              sequenciaVencendo
            );
          }
        };

        this.Dados = {
          AtualizarCamposDaTela: function () {
            _this.Dados.SaldoInicial(_this.Dados.saldoInicial);
            _this.Dados.SaldoFinal(_this.Dados.saldoFinal);
            _this.Dados.TempoCorrido(_this.Dados.tempoCorrido);
            _this.Dados.Velocidade(_this.Dados.velocidade);
            _this.Dados.ApostasFeitas(_this.Dados.apostasFeitas);
            _this.Dados.Lucro(_this.Dados.lucro);
            _this.Dados.TotalApostado(_this.Dados.totalApostado);
            _this.Dados.MaiorAposta(_this.Dados.maiorAposta);
            _this.Dados.ApostasVencidas(_this.Dados.apostasVencidas);
            _this.Dados.ApostasPerdidas(_this.Dados.apostasPerdidas);
            _this.Dados.SequenciaVencendo(_this.Dados.sequenciaVencendo);
            _this.Dados.SequenciaPerdendo(_this.Dados.sequenciaPerdendo);
            _this.Dados.MaiorSequenciaVencendo(
              _this.Dados.maiorSequenciaVencendo
            );
            _this.Dados.MaiorSequenciaPerdendo(
              _this.Dados.maiorSequenciaPerdendo
            );
          },

          ReiniciarValores: function () {
            _this.Dados.saldoInicial = null;
            _this.Dados.saldoFinal = null;
            _this.Dados.tempoCorrido = null;
            _this.Dados.velocidade = 0;
            _this.Dados.apostasFeitas = 0;
            _this.Dados.lucro = 0;
            _this.Dados.totalApostado = 0;
            _this.Dados.maiorAposta = 0;
            _this.Dados.apostasVencidas = 0;
            _this.Dados.apostasPerdidas = 0;
            _this.Dados.sequenciaVencendo = 0;
            _this.Dados.sequenciaPerdendo = 0;
            _this.Dados.maiorSequenciaVencendo = 0;
            _this.Dados.maiorSequenciaPerdendo = 0;

            _this.Grafico.Saldo.Reiniciar(_this.Dados.SaldoInicial());
            _this.Grafico.Sequencias.Reiniciar();
            _this.Grafico.Predicao.Reiniciar();
            _this.Grafico.SequenciasRecorrentes.Reiniciar();
            _this.Grafico.Sorteados.Reiniciar();
          },

          tempoCorrido: undefined,
          TempoCorrido: function (valor) {
            if (valor !== undefined) {
              if (valor instanceof Date) {
                valor = new Date(new Date().getTime() - valor.getTime());
                valor = new RegExp("(?<=T).*?(?=\\.)").exec(
                  valor.toISOString()
                )[0];
              } else {
                valor = "&dash;";
              }
              _this.Container.find(".tempoCorrido").html(valor);
            }

            const conteudo = _this.Container.find(".tempoCorrido").html();
            if (isFinite(parseInt(conteudo))) {
              const horaString = conteudo.replace(" ", ":").split(":");
              const horaDate =
                new Date().getTime() -
                new Date(
                  1969,
                  11,
                  2,
                  parseInt(horaString[0]),
                  parseInt(horaString[1]),
                  parseInt(horaString[2])
                ).getTime();
              return new Date(horaDate + 1000 * 60 * 60 * 2);
            } else {
              return null;
            }
          },
          velocidade: undefined,
          Velocidade: function (valor) {
            if (valor !== undefined) {
              _this.Container.find(".velocidade").html(
                _this.Instancia.Geral.NumericoTexto(valor, 2) + " apostas/min."
              );
            }
            return _this.Instancia.Geral.Numerico(
              _this.Container.find(".velocidade").text()
            );
          },
          apostasFeitas: undefined,
          ApostasFeitas: function (valor) {
            if (valor !== undefined) {
              _this.Container.find(".apostasFeitas").html(
                _this.Instancia.Geral.NumericoTexto(valor, 0)
              );
            }
            return _this.Instancia.Geral.Numerico(
              _this.Container.find(".apostasFeitas").text()
            );
          },
          lucro: undefined,
          Lucro: function (valor) {
            if (valor !== undefined) {
              valor = _this.Instancia.Geral.Numerico(valor);
              _this.Container.find(".lucro").html(
                _this.Instancia.Geral.FormatarString(
                  '<span style="color: {2};"><span style="font-size: 20px; position: relative; top: 2px; left: -2px; display: inline-block; margin: -10px -3px -2px 0;">{0}</span> {1}</span>',
                  valor < 0 ? "- " : valor > 0 ? "+ " : "",
                  _this.Instancia.Geral.NumericoTexto(Math.abs(valor)),
                  valor < 0 ? "red" : valor > 0 ? "blue" : "black"
                )
              );
            }
            return _this.Instancia.Geral.Numerico(
              _this.Instancia.Geral.ReplaceAll(
                _this.Container.find(".apostasFeitas").text(),
                " ",
                ""
              )
            );
          },
          totalApostado: undefined,
          TotalApostado: function (valor) {
            if (valor !== undefined) {
              _this.Container.find(".totalApostado").html(
                _this.Instancia.Geral.NumericoTexto(valor)
              );
            }
            return _this.Instancia.Geral.Numerico(
              _this.Container.find(".totalApostado").text()
            );
          },
          maiorAposta: undefined,
          MaiorAposta: function (valor) {
            if (valor !== undefined) {
              _this.Container.find(".maiorAposta").html(
                _this.Instancia.Geral.NumericoTexto(valor)
              );
            }
            return _this.Instancia.Geral.Numerico(
              _this.Container.find(".maiorAposta").text()
            );
          },
          saldoInicial: undefined,
          SaldoInicial: function (valor) {
            const saldoAtual = _this.Instancia.LuckygamesIo.ValorSaldo();

            if (valor !== undefined) {
              if (valor === null) {
                valor = saldoAtual;
              }
              _this.Container.find(".saldoInicial").html(
                _this.Instancia.Geral.NumericoTexto(valor)
              );
            }

            const result = _this.Container.find(".saldoInicial").text();
            return _this.Instancia.Geral.Numerico(
              isFinite(parseFloat(result)) ? result : saldoAtual
            );
          },
          saldoFinal: undefined,
          SaldoFinal: function (valor) {
            const saldoAtual = _this.Instancia.LuckygamesIo.ValorSaldo();

            if (valor !== undefined) {
              valor = saldoAtual;
              const saldoInicial = _this.Dados.SaldoInicial();
              _this.Container.find(".saldoFinal").html(
                _this.Instancia.Geral.FormatarString(
                  '<span style="color: {1}">{0}</span>',
                  _this.Instancia.Geral.NumericoTexto(valor),
                  valor > saldoInicial
                    ? "blue"
                    : valor < saldoInicial
                    ? "red"
                    : "black"
                )
              );
            }

            const result = _this.Container.find(".saldoFinal").text();
            return _this.Instancia.Geral.Numerico(
              isFinite(parseFloat(result)) ? result : saldoAtual
            );
          },
          apostasVencidas: undefined,
          ApostasVencidas: function (valor) {
            if (valor !== undefined) {
              _this.Container.find(".apostasVencidas").html(
                _this.Instancia.Geral.NumericoTexto(valor, 0)
              );
            }
            return _this.Instancia.Geral.Numerico(
              _this.Container.find(".apostasVencidas").text()
            );
          },
          apostasPerdidas: undefined,
          ApostasPerdidas: function (valor) {
            if (valor !== undefined) {
              _this.Container.find(".apostasPerdidas").html(
                _this.Instancia.Geral.NumericoTexto(valor, 0)
              );
            }
            return _this.Instancia.Geral.Numerico(
              _this.Container.find(".apostasPerdidas").text()
            );
          },
          sequenciaVencendo: undefined,
          SequenciaVencendo: function (valor) {
            if (valor !== undefined) {
              _this.Container.find(".sequenciaVencendo").html(
                _this.Instancia.Geral.NumericoTexto(valor, 0)
              );
            }
            return _this.Instancia.Geral.Numerico(
              _this.Container.find(".sequenciaVencendo").text()
            );
          },
          sequenciaPerdendo: undefined,
          SequenciaPerdendo: function (valor) {
            if (valor !== undefined) {
              _this.Container.find(".sequenciaPerdendo").html(
                _this.Instancia.Geral.NumericoTexto(valor, 0)
              );
            }
            return _this.Instancia.Geral.Numerico(
              _this.Container.find(".sequenciaPerdendo").text()
            );
          },
          maiorSequenciaVencendo: undefined,
          MaiorSequenciaVencendo: function (valor) {
            if (valor !== undefined) {
              _this.Container.find(".maiorSequenciaVencendo").html(
                _this.Instancia.Geral.NumericoTexto(valor, 0)
              );
            }
            return _this.Instancia.Geral.Numerico(
              _this.Container.find(".maiorSequenciaVencendo").text()
            );
          },
          maiorSequenciaPerdendo: undefined,
          MaiorSequenciaPerdendo: function (valor) {
            if (valor !== undefined) {
              _this.Container.find(".maiorSequenciaPerdendo").html(
                _this.Instancia.Geral.NumericoTexto(valor, 0)
              );
            }
            return _this.Instancia.Geral.Numerico(
              _this.Container.find(".maiorSequenciaPerdendo").text()
            );
          },
        };
      })(this.Instancia),

      new (function (instancia) {
        this.Instancia = instancia;
        const _this = this;

        this.Titulo = "Limites";

        this.Container;

        this.Css = `
                    :host table td {
                        font-size: 15px;
                        vertical-align: middle;
                        white-space: nowrap;
                        text-align: right;
                        padding: 1px 5px;
                    }
                    :host table td:last-child {
                        text-align: left;
                        padding-left: 2px;
                        width: 60%;
                    }
                    :host td[rowspan] {
                        border-right: 2px solid gainsboro;
                        padding-right: 10px;
                    }
                    :host table td input[type="text"].ativo {
                        background-color: steelblue;
                        color: white;
                    }
                    :host table td input[type="text"].disparado {
                        background-color: indianred;
                    }
                    :host input {
                        text-align: right;
                    }
                `;

        this.Html = this.Instancia.Geral.FormatarString(`
                        <span class="info">
                            Define limites para evitar perdas.
                            Se um limite for atingido toda a comunica&ccedil;&atilde;o
                            com o servidor &eacute; bloqueada.
                            <hr />
                            Os limites ativos s&atilde;o indicados em azul.
                            Os limites atingidos s&atilde;o indicados em vermelho.
                        </span>
                        <table>
                            <tr>
                                <td rowspan="2">Saldo</td>
                                <td>M&iacute;nimo</td>
                                <td class="saldoMinimo">
                                    <input type="text" data-tipo="number" data-min="0" />
                                </td>
                            </tr>
                            <tr>
                                <td>M&aacute;ximo</td>
                                <td class="saldoMaximo">
                                    <input type="text" data-tipo="number" data-min="0" />
                                </td>
                            </tr>
                            <tr><td colspan="4"><div class='divisor'>&nbsp;</div></td></tr>
                            <tr>
                                <td rowspan="2">Aposta</td>
                                <td>M&iacute;nima</td>
                                <td class="apostaMinima">
                                    <input type="text" data-tipo="number" data-min="0" />
                                </td>
                            </tr>
                            <tr>
                                <td>M&aacute;xima</td>
                                <td class="apostaMaxima">
                                    <input type="text" data-tipo="number" data-min="0" />
                                </td>
                            </tr>
                            <tr><td colspan="4"><div class='divisor'>&nbsp;</div></td></tr>
                            <tr>
                                <td rowspan="2">Sequ&ecirc;ncia</td>
                                <td>Vencendo</td>
                                <td class="sequenciaVencendo">
                                    <input type="text" data-tipo="number" data-min="0" data-digitos="0" />
                                </td>
                            </tr>
                            <tr>
                                <td>Perdendo</td>
                                <td class="sequenciaPerdendo">
                                    <input type="text" data-tipo="number" data-min="0" data-digitos="0" />
                                </td>
                            </tr>
                        </table>
                        <button class="reiniciar btn grey">Remover todos os limites</button>
                    `);

        this.Js = function () {
          _this.Instancia.Objetos.SecaoLimitesBtnReiniciar =
            this.Container.find(".reiniciar");
          _this.Instancia.Objetos.SecaoLimitesBtnReiniciar.click(function () {
            _this.Container.find('input[type="text"]').val("").blur();
            _this.Instancia.Geral.Toast(
              "Todos os limites foram removidos.",
              false
            );
          });
          _this.Instancia.Objetos.SecaoLimitesBtnReiniciar.click();

          const inputsText = this.Container.find('input[type="text"]');
          inputsText.blur(function () {
            const inputText = $(this);

            if (inputText.get(0).number() !== null) {
              inputText.addClass("ativo").removeClass("disparado");
            } else {
              inputText.removeClass("ativo").removeClass("disparado");
            }
          });
          inputsText.blur();
        };

        this.OnAjaxRequest = function (request) {
          if (request.game !== "dice") {
            return;
          }

          let result = true;

          result &= _this.Validar.SaldoMinimo();
          result &= _this.Validar.SaldoMaximo();
          result &= _this.Validar.ApostaMinima();
          result &= _this.Validar.ApostaMaxima();
          result &= _this.Validar.SequenciaPerdendo();
          result &= _this.Validar.SequenciaVencendo();

          if (!result) {
            _this.Instancia.Geral.Toast(
              "error",
              "Um ou mais limites foram atingidos. A comunica&ccedil;&atilde;o com o servidor foi interrompida."
            );
            _this.Instancia.LuckygamesIo.PararApostas();
          }

          return result;
        };

        this.OnAjaxResponse = null;

        this.Validar = {
          Generico: function (valorTeste, teste, selectorInput) {
            const input = _this.Container.find(selectorInput);
            const valor = input.get(0).number();
            if (valor !== null) {
              valorTeste = _this.Instancia.Geral.Numerico(valorTeste);
              if (eval("valorTeste " + teste + " valor")) {
                input.addClass("disparado");
                return false;
              }
            }
            input.removeClass("disparado");
            return true;
          },
          SaldoMinimo: function () {
            return _this.Validar.Generico(
              _this.Instancia.LuckygamesIo.ValorSaldo(),
              "<=",
              ".saldoMinimo input"
            );
          },
          SaldoMaximo: function () {
            return _this.Validar.Generico(
              _this.Instancia.LuckygamesIo.ValorSaldo(),
              ">=",
              ".saldoMaximo input"
            );
          },
          ApostaMinima: function () {
            return _this.Validar.Generico(
              _this.Instancia.LuckygamesIo.ValorAposta(),
              "<=",
              ".apostaMinima input"
            );
          },
          ApostaMaxima: function () {
            return _this.Validar.Generico(
              _this.Instancia.LuckygamesIo.ValorAposta(),
              ">=",
              ".apostaMaxima input"
            );
          },
          SequenciaPerdendo: function () {
            const estatisticas = _this.Instancia.Regras.Estatisticas();
            return _this.Validar.Generico(
              estatisticas.sequenciaPerdendo,
              ">=",
              ".sequenciaPerdendo input"
            );
          },
          SequenciaVencendo: function () {
            const estatisticas = _this.Instancia.Regras.Estatisticas();
            return _this.Validar.Generico(
              estatisticas.sequenciaVencendo,
              ">=",
              ".sequenciaVencendo input"
            );
          },
        };
      })(this.Instancia),

      new (function (instancia) {
        this.Instancia = instancia;
        const _this = this;

        this.Titulo = "BOT SeedRandomize";

        this.Container;

        this.Botoes = [
          { id: "desativar", nome: "Desativado" },
          { id: "trocar", nome: "Trocar Seed" },
          { id: "trocarCustomizado", nome: "Trocar Seed Customizado" },
        ];

        this.BotoesFunction = function (id, data) {
          switch (id) {
            case "desativar":
              break;
            case "trocar":
            case "trocarCustomizado":
              _this.Instancia.Objetos.SecaoSeedRandomizeInputTempo.change();
              if (!_this.ValidarParametros(true)) {
                _this.Container.find(".btn.desativar").click();
                return;
              }
              break;
          }
        };

        this.Css = `
                    :host input {
                        text-align: center;
                    }
                    :host input[readonly] {
                        color: red;
                    }
                    :host table td[colspan] {
                        text-align: center;
                    }
                    :host table td:last-child:not([colspan]) {
                        width: 20%;
                    }
                `;

        this.Html = this.Instancia.Geral.FormatarString(`
                        <span class="info">
                            A geração de um número aleatório depende de um valor inicial
                            chamado Seed. Trocar o Seed contribui para tornar o processo
                            mais aleatório.
                            <hr />
                            Saiba mais sobre como o Luckygames trabalha com isso em:
                            <a target="_blank" href="https://luckygames.io/page/fair/">https://luckygames.io/page/fair/</a>
                        </span>
                        <table>
                            <tr class="seed">
                                <td colspan="2">
                                    <h1>Client Seed</h1>
                                    <input type="text" readonly />
                                    <button class="trocar btn grey">Trocar Seed</button>
                                    <button class="trocarCustomizado btn grey">Trocar Seed Customizado</button>
                                    <span class="info">
                                        <br />
                                        A troca do seed no modo comum solicita ao servidor um novo Seed.
                                        Usando o modo Customizado o Seed &eacute; gerado localmente sem recorrer ao servidor.
                                        Isso contribui mais para que n&atilde;o haja manipula&ccedil;&atilde;o de resultados.
                                    </span>
                                </td>
                            </tr>
                            <tr><td colspan="4"><div class='divisor'>&nbsp;</div></td></tr>
                            <tr class="tempo">
                                <td>Trocar o Seed depois de quantos segundos</td>
                                <td><input type="text" data-tipo="number" data-min="1" data-digitos="0" value="60" /></td>
                            </tr>
                            <tr><td colspan="4"><div class='divisor'>&nbsp;</div></td></tr>
                            <tr class="apostas">
                                <td>Trocar o Seed depois de quantas apostas</td>
                                <td><input type="text" data-tipo="number" data-min="1" data-digitos="0" /></td>
                            </tr>
                            <tr><td colspan="4"><div class='divisor'>&nbsp;</div></td></tr>
                            <tr class="apostasPerdidas">
                                <td>Trocar o Seed depois de quantas apostas perdidas</td>
                                <td><input type="text" data-tipo="number" data-min="1" data-digitos="0" /></td>
                            </tr>
                            <tr><td colspan="4"><div class='divisor'>&nbsp;</div></td></tr>
                            <tr class="apostasVencidas">
                                <td>Trocar o Seed depois de quantas apostas vencidas</td>
                                <td><input type="text" data-tipo="number" data-min="1" data-digitos="0" /></td>
                            </tr>
                        </table>
                    `);

        this.Js = function () {
          _this.Instancia.Objetos.SecaoSeedRandomizeInput =
            this.Container.find(".seed input");
          _this.Instancia.Objetos.SecaoSeedRandomizeInput.val(
            _this.Instancia.LuckygamesIo.ClientSeed()
          );

          _this.Instancia.Objetos.SecaoSeedRandomizeInputTempo =
            this.Container.find(".tempo input");
          _this.Instancia.Objetos.SecaoSeedRandomizeInputApostas =
            this.Container.find(".apostas input");
          _this.Instancia.Objetos.SecaoSeedRandomizeInputApostasPerdidas =
            this.Container.find(".apostasPerdidas input");
          _this.Instancia.Objetos.SecaoSeedRandomizeInputApostasVencidas =
            this.Container.find(".apostasVencidas input");

          _this.Instancia.Objetos.SecaoSeedRandomizeInterval = null;
          _this.Instancia.Objetos.SecaoSeedRandomizeInputTempo.change(
            function () {
              const __this = this;
              setTimeout(function () {
                const tempo = $(__this).get(0).number();
                clearInterval(
                  _this.Instancia.Objetos.SecaoSeedRandomizeInterval
                );
                if (tempo !== null) {
                  _this.Instancia.Objetos.SecaoSeedRandomizeInterval =
                    setInterval(function () {
                      if (
                        _this.Container.find(".botoes .btn.desativar").hasClass(
                          "ativo"
                        )
                      ) {
                        return;
                      }
                      const customizado =
                        _this.Container.find(".botoes .btn.ativo").hasClass(
                          "trocarCustomizado"
                        );
                      _this.Instancia.Objetos.SecaoSeedRandomizeInput.val(
                        _this.Instancia.LuckygamesIo.ClientSeed(
                          true,
                          customizado
                        )
                      );
                    }, tempo * 1000);
                }
              }, 100);
            }
          );

          this.Container.find(".seed .trocar, .seed .trocarCustomizado").click(
            function () {
              const customizado = $(this).hasClass("trocarCustomizado");
              _this.Instancia.Objetos.SecaoSeedRandomizeInput.val(
                _this.Instancia.LuckygamesIo.ClientSeed(true, customizado)
              );
            }
          );

          this.Container.find("input:not([readonly])").blur(function () {
            if (!_this.Container.find(".btn.desativar").hasClass("ativo")) {
              if (!_this.ValidarParametros(true)) {
                _this.Container.find(".botoes .btn.desativar").click();
                return;
              }
            }
          });
        };

        this.OnAjaxRequest = null;

        this.OnAjaxResponse = function (response, request) {
          _this.Instancia.Objetos.SecaoSeedRandomizeInput.val(
            _this.Instancia.LuckygamesIo.ClientSeed()
          );

          if (request.game !== "dice") {
            return;
          }
          if (response === null || !response.result) {
            return;
          }
          if (
            _this.Container.find(".botoes .btn.desativar").hasClass("ativo")
          ) {
            return;
          }

          _this.Dados.apostas++;
          _this.Dados.apostasPerdidas =
            response.gameResult === "lose"
              ? _this.Dados.apostasPerdidas + 1
              : 0;
          _this.Dados.apostasVencidas =
            response.gameResult === "win" ? _this.Dados.apostasVencidas + 1 : 0;

          const apostas =
            _this.Instancia.Objetos.SecaoSeedRandomizeInputApostas.get(
              0
            ).number();
          const apostasPerdidas =
            _this.Instancia.Objetos.SecaoSeedRandomizeInputApostasPerdidas.get(
              0
            ).number();
          const apostasVencidas =
            _this.Instancia.Objetos.SecaoSeedRandomizeInputApostasVencidas.get(
              0
            ).number();

          let trocar = false;

          if (apostas !== null && _this.Dados.apostas >= apostas) {
            _this.Dados.apostas = 0;
            trocar = true;
          }
          if (
            apostasPerdidas !== null &&
            _this.Dados.apostasPerdidas >= apostasPerdidas
          ) {
            _this.Dados.apostasPerdidas = 0;
            trocar = true;
          }
          if (
            apostasVencidas !== null &&
            _this.Dados.apostasVencidas >= apostasVencidas
          ) {
            _this.Dados.apostasVencidas = 0;
            trocar = true;
          }

          if (trocar) {
            const customizado =
              _this.Container.find(".botoes .btn.ativo").hasClass(
                "trocarCustomizado"
              );
            _this.Instancia.Objetos.SecaoSeedRandomizeInput.val(
              _this.Instancia.LuckygamesIo.ClientSeed(true, customizado)
            );
          }
        };

        this.Dados = {
          apostas: 0,
          apostasPerdidas: 0,
          apostasVencidas: 0,
        };

        this.validarParametrosEmExibicao = false;
        this.ValidarParametros = function (exibirAlerta) {
          const tempo =
            _this.Instancia.Objetos.SecaoSeedRandomizeInputTempo.get(
              0
            ).number();
          const apostas =
            _this.Instancia.Objetos.SecaoSeedRandomizeInputApostas.get(
              0
            ).number();
          const apostasPerdidas =
            _this.Instancia.Objetos.SecaoSeedRandomizeInputApostasPerdidas.get(
              0
            ).number();
          const apostasVencidas =
            _this.Instancia.Objetos.SecaoSeedRandomizeInputApostasVencidas.get(
              0
            ).number();

          const result =
            tempo !== null ||
            apostas !== null ||
            apostasPerdidas !== null ||
            apostasVencidas !== null;

          if (!result && exibirAlerta && !_this.validarParametrosEmExibicao) {
            _this.validarParametrosEmExibicao = true;
            _this.Instancia.Geral.Toast(
              "error",
              _this.Instancia.Geral.FormatarString(
                "O {0} tem um ou mais par&acirc;metros inv&aacute;lidos.",
                _this.Titulo
              )
            );
            setTimeout(function () {
              _this.validarParametrosEmExibicao = false;
            }, 1000);
          }
          return result;
        };
      })(this.Instancia),

      new (function (instancia) {
        this.Instancia = instancia;
        const _this = this;

        this.Titulo = "BOT Martingale";

        this.Container;

        this.Botoes = [
          { id: "desativar", nome: "Desativado" },
          { id: "ativar", nome: "Ativado" },
        ];

        this.ultimaAposta = null;

        this.BotoesFunction = function (id, data) {
          switch (id) {
            case "desativar":
              break;
            case "ativar":
              _this.ultimaAposta = null;

              let apostaAtual = null;

              const interval = 10;

              const fProximoPasso = function (resolve, index) {
                index = index !== undefined ? index : 0;
                setTimeout(function () {
                  if (index < passos.length) {
                    passos[index](index).then(resolve);
                  } else {
                    resolve();
                  }
                }, interval);
              };

              const passos = [
                function DefinirParametros(index) {
                  return new Promise(function (resolve, reject) {
                    const dados = {
                      predicao: 50,
                      aposta: 0.00000001,
                      aoPerderTipo: "Streak of",
                      aoPerderVezes: 1,
                      aoPerderModo: "Increase bet by",
                      aoPerderIncrementar: 100,
                      aoPerderDecrementar: "",
                      aoPerderReverter: false,
                      aoPerderParar: false,
                      aoVencerTipo: "Streak of",
                      aoVencerVezes: 1,
                      aoVencerModo: "Return to base",
                      aoVencerIncrementar: "",
                      aoVencerDecrementar: "",
                      aoVencerReverter: false,
                      aoVencerParar: false,
                      velocidade: 0,
                      apostaTotal: "",
                      saldoMinimo: "",
                      saldoMaximo: "",
                      apostaMaxima: "",
                    };

                    if (_this.ultimaAposta) {
                      if (_this.ultimaAposta.response.gameResult === "lose") {
                        if (
                          _this.ultimaAposta.estatisticas.sequenciaPerdendo <=
                          _this.Instancia.Objetos.SecaoBotMartingaleInputSequenciasPerdendo.get(
                            0
                          ).number()
                        ) {
                          apostaAtual *= 2;
                        }
                      } else if (
                        _this.ultimaAposta.response.gameResult === "win" &&
                        parseFloat(_this.ultimaAposta.request.betAmount) >
                          dados.aposta
                      ) {
                        apostaAtual = null;
                      }
                    }

                    if (apostaAtual === null) {
                      apostaAtual =
                        _this.Instancia.Objetos.SecaoBotMartingaleInputApostaInicial.get(
                          0
                        ).number();
                    }

                    if (
                      !_this.ultimaAposta ||
                      _this.ultimaAposta.estatisticas.sequenciaPerdendo <
                        _this.Instancia.Objetos.SecaoBotMartingaleInputSequenciasPerdendo.get(
                          0
                        ).number()
                    ) {
                      dados.aposta = apostaAtual;
                    }

                    _this.Instancia.LuckygamesIo.Definir(dados);

                    fProximoPasso(resolve, index + 1);
                  });
                },
                function EnviarAposta(index) {
                  return new Promise(function Executar(resolve, reject) {
                    _this.ultimaAposta = null;
                    _this.Instancia.LuckygamesIo.Apostar();

                    const fAguardarAposta = function () {
                      if (
                        _this.ultimaAposta === null ||
                        _this.Instancia.LuckygamesIo.ApostaEmExecucao()
                      ) {
                        setTimeout(fAguardarAposta, interval);
                      } else {
                        fProximoPasso(resolve, index + 1);
                      }
                    };
                    fAguardarAposta();
                  });
                },
              ];

              _this.Instancia.LuckygamesIo.Animacao(false);
              const fComecar = function () {
                fProximoPasso(function () {
                  const saldoInsuficiente =
                    _this.Instancia.LuckygamesIo.ValorSaldo() <
                    _this.Instancia.LuckygamesIo.ValorAposta();
                  if (
                    !saldoInsuficiente &&
                    !_this.Container.find(".botoes .btn.desativar").hasClass(
                      "ativo"
                    )
                  ) {
                    setTimeout(fComecar, interval);
                  } else {
                    _this.Instancia.LuckygamesIo.Animacao(true);
                    if (saldoInsuficiente) {
                      _this.Instancia.Geral.Toast(
                        "error",
                        _this.Instancia.Geral.FormatarString(
                          "Seu saldo é insuficiente para prosseguir. O {0} foi interrompido.",
                          _this.Titulo
                        )
                      );
                    }
                  }
                });
              };
              fComecar();

              break;
          }
        };

        this.Css = `
                    :host input {
                        text-align: center;
                    }
                    :host td:last-child {
                        width: 55%;
                    }
                    :host td div span {
                        color: red;
                    }
                `;

        this.Html = this.Instancia.Geral.FormatarString(`
                        <span class="info">
                            A estrat&eacute;gia Martingale consiste em dobrar a aposta sempre que perder.
                            Dessa forma, quando ganhar se recupera todas as perdas e ganha mais um pouco.
                            Mas &eacute; conhecido que se a sequ&ecirc;ncia perdendo for muito grande voc&ecirc; vai a fal&ecirc;ncia.
                            <hr />
                            Este BOT apenas aplica a t&eacute;cnica Martingale quando a sequ&ecirc;ncia perdendo
                            n&atilde;o for muito grande. Isso reduz a chance de zerar seu saldo.
                        </span>
                        <table>
                            <tr class="apostaInicial">
                                <td>Aposta inicial</td>
                                <td>
                                    <input type="text" data-tipo="number" data-min="0,00000002" data-padrao="0,00000002" />
                                    <div>Com esta aposta inicial a sequ&ecirc;ncia perdendo m&aacute;xima antes de zerar o saldo &eacute; de: <span>708</span></div>
                                </td>
                            </tr>
                            <tr><td colspan="4"><div class='divisor'>&nbsp;</div></td></tr>
                            <tr class="sequenciasPerdendo">
                                <td>Aceitar sequ&ecirc;ncia perdendo</td>
                                <td>
                                    <input type="text" data-tipo="number" data-min="1" data-digitos="0" data-padrao="3" />
                                    <div>
                                        Aceita apostas apenas at&eacute; certo limite de sequ&ecirc;ncias perdendo.
                                        Depois desse limite passa a apostar o valor m&iacute;nimo (0,00000001) e
                                        n&atilde;o aplica a estrat&eacute;gia Martingale.
                                        Fica esperando vencer para voltar com a estrat&eacute;gia.
                                    </div>
                                </td>
                            </tr>
                        </table>
                    `);

        this.Js = function () {
          _this.Instancia.Objetos.SecaoBotMartingaleInputApostaInicial =
            this.Container.find(".apostaInicial input");
          _this.Instancia.Objetos.SecaoBotMartingaleInputSequenciasPerdendo =
            this.Container.find(".sequenciasPerdendo input");
          _this.Instancia.Objetos.SecaoBotMartingaleDivMaximoSequenciasPerdendo =
            this.Container.find(".apostaInicial div span");

          _this.Instancia.Objetos.SecaoBotMartingaleInputApostaInicial.blur(
            function () {
              const apostaInicial = $(this).get(0).number();
              const saldoInicial = _this.Instancia.LuckygamesIo.ValorSaldo();

              if (
                apostaInicial !== null &&
                apostaInicial > 0 &&
                saldoInicial !== null &&
                saldoInicial > 0
              ) {
                let sequencias = 0;
                let saldo = saldoInicial;
                let aposta = apostaInicial;
                while (saldo > 0 && aposta < saldo) {
                  saldo -= aposta;
                  aposta *= 2;
                  sequencias++;
                }
                _this.Instancia.Objetos.SecaoBotMartingaleDivMaximoSequenciasPerdendo.html(
                  sequencias
                );
              } else {
                _this.Instancia.Objetos.SecaoBotMartingaleDivMaximoSequenciasPerdendo.html(
                  "&dash; &dash; &dash;"
                );
              }
            }
          );
          _this.Instancia.Objetos.SecaoBotMartingaleInputApostaInicial.blur();
        };

        this.OnAjaxRequest = null;

        this.OnAjaxResponse = function (response, request) {
          if (request.game !== "dice") {
            return;
          }

          _this.ultimaAposta = {
            response: response,
            request: request,
            estatisticas: _this.Instancia.Regras.Estatisticas(),
          };
        };
      })(this.Instancia),
    ];
  })(this);

  this.Instancia.Inicializar();

  return this;
})();
