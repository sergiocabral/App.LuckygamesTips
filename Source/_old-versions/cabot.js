//Inverter WIN e LOSE
//Randomize Seed custom seed
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

  this.Geral = new (function (instancia) {
    this.Instancia = instancia;

    this.Toast = function (toast) {
      if (typeof toast === "string") {
        if (arguments.length === 1) {
          toast = { icon: "info", text: toast };
        } else {
          toast = { icon: arguments[0], text: arguments[1] };
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

  this.LuckygamesIo = new (function (instancia) {
    this.Instancia = instancia;

    this.PararApostas = function () {
      try {
        Game.stopAutoplay();
      } catch (e) {}
    };

    this.TrocarSeed = function () {
      try {
        window.randomizeSeed();
      } catch (e) {}
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
        Game.playFlag = false;
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
      const response = JSON.parse(xhr.responseText);

      if (_this.Instancia.InterceptadorAjax.Ativado) {
        const lista = _this.Instancia.InterceptadorAjax.Lista;
        for (let key in lista) {
          if (key.indexOf("_response") >= 0 && lista[key] instanceof Function) {
            lista[key](response, request, xhr, e);
          }
        }
        this.addEventListener(
          "load",
          _this.Instancia.InterceptadorAjax.XMLHttpRequestLoad
        );
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

    this.OnAbrirJanela = [];

    this.Montar = function () {
      const cssBase = this.Instancia.Geral.ReplaceAll(
        `
                .jq-toast-wrap { 
                    z-index: 10000000!important; 
                }
                :host a {
                    color: darkgreen
                }
                :host a:hover {
                    color: forestgreen
                }
                :host.btn, :host .btn {
                    width: auto;
                    padding: 0 10px;
                    float: none;
                }                
                :host input[type="text"] {
                    font-family: 'Cousine', monospace;
                    font-size: 20px;
                    background-color: #f0f0f0;
                    border: 1px solid gainsboro;
                }
                :host article h1, :host article h2, :host article h3, :host article h4, :host article h5, :host article h6 {
                    margin: 0;
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

      let html = this.Instancia.Geral.FormatarString(
        '<article class="{1}">{0}</article>',
        secao.Html instanceof Function ? secao.Html() : secao.Html,
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
      if (secao.Js instanceof Function) {
        secao.Js();
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
                    :host .divisor {
                        background-color: gainsboro;
                        font-size: 0;
                        height: 2px;
                        margin: 3px 0;
                    }
                    :host table td[colspan] {
                        text-align: left;
                        border-width: 0;
                        padding: 0;
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
          _this.Grafico.Sorteados.Inicializar();

          _this.Instancia.Objetos.BtnEstatisticasReiniciar =
            this.Container.find(".reiniciar");
          _this.Instancia.Objetos.BtnEstatisticasReiniciar.click(function () {
            _this.Dados.ReiniciarValores();
            _this.Dados.AtualizarCamposDaTela();

            if (_this.Instancia.Objetos.JanelaModal.isOpen) {
              _this.Instancia.Geral.Toast("Estat&iacute;sticas reiniciadas.");
            }
          });
          _this.Instancia.Objetos.BtnEstatisticasReiniciar.click();
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

              _this.Instancia.Objetos.GraficoEstatisticasSaldoDiv =
                _this.Container.find(".saldo .grafico");
              _this.Instancia.Objetos.GraficoEstatisticasSaldoDiv.html("");
              _this.Instancia.Objetos.GraficoEstatisticasSaldoData = {
                series: [[]],
              };
              _this.Instancia.Objetos.GraficoEstatisticasSaldoChartist =
                new Chartist.Line(
                  _this.Instancia.Objetos.GraficoEstatisticasSaldoDiv.get(0),
                  _this.Instancia.Objetos.GraficoEstatisticasSaldoData,
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
                _this.Instancia.Objetos.GraficoEstatisticasSaldoChartist.update();
              });
            },

            Reiniciar: function (valorInicial) {
              _this.Instancia.Objetos.GraficoEstatisticasSaldoData.series[0].length = 0;
              _this.Grafico.Saldo.Adicionar(valorInicial);
              _this.Grafico.Saldo.Adicionar(valorInicial);
              _this.Instancia.Objetos.GraficoEstatisticasSaldoChartist.update();
            },

            Adicionar: function (valor) {
              if (isNaN(parseFloat(valor))) {
                return;
              }
              _this.Instancia.Objetos.GraficoEstatisticasSaldoData.series[0].push(
                valor
              );
              _this.Instancia.Objetos.GraficoEstatisticasSaldoChartist.update();
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

              _this.Instancia.Objetos.GraficoEstatisticasSequenciasContador =
                _this.Container.find(".sequencias h2 span");

              _this.Instancia.Objetos.GraficoEstatisticasSequenciasDiv =
                _this.Container.find(".sequencias .grafico");
              _this.Instancia.Objetos.GraficoEstatisticasSequenciasDiv.html("");
              _this.Instancia.Objetos.GraficoEstatisticasSequenciasData = {
                series: [[], []],
              };
              _this.Instancia.Objetos.GraficoEstatisticasSequenciasChartist =
                new Chartist.Bar(
                  _this.Instancia.Objetos.GraficoEstatisticasSequenciasDiv.get(
                    0
                  ),
                  _this.Instancia.Objetos.GraficoEstatisticasSequenciasData,
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
                _this.Instancia.Objetos.GraficoEstatisticasSequenciasChartist.update();
              });
            },

            Reiniciar: function (valorInicial) {
              _this.Instancia.Objetos.GraficoEstatisticasSequenciasData.series[0].length = 0;
              _this.Instancia.Objetos.GraficoEstatisticasSequenciasData.series[1].length = 0;
              _this.Instancia.Objetos.GraficoEstatisticasSequenciasContador.text(
                ""
              );
              _this.Instancia.Objetos.GraficoEstatisticasSequenciasChartist.update();
            },

            Adicionar: function (valor) {
              if (isNaN(parseFloat(valor))) {
                return;
              }
              if (valor >= 0) {
                _this.Instancia.Objetos.GraficoEstatisticasSequenciasData.series[0].push(
                  1
                );
                _this.Instancia.Objetos.GraficoEstatisticasSequenciasData.series[1].push(
                  0
                );
              } else {
                _this.Instancia.Objetos.GraficoEstatisticasSequenciasData.series[0].push(
                  0
                );
                _this.Instancia.Objetos.GraficoEstatisticasSequenciasData.series[1].push(
                  1
                );
              }

              let limiteDeBarras =
                10 +
                (_this.Dados.MaiorSequenciaVencendo() +
                  _this.Dados.MaiorSequenciaPerdendo());
              limiteDeBarras = limiteDeBarras < 40 ? limiteDeBarras : 40;
              if (
                _this.Instancia.Objetos.GraficoEstatisticasSequenciasData
                  .series[0].length > limiteDeBarras
              ) {
                _this.Instancia.Objetos.GraficoEstatisticasSequenciasData.series[0].shift();
                _this.Instancia.Objetos.GraficoEstatisticasSequenciasData.series[1].shift();
              }
              _this.Instancia.Objetos.GraficoEstatisticasSequenciasContador.text(
                _this.Instancia.Objetos.GraficoEstatisticasSequenciasData
                  .series[0].length
              );

              _this.Instancia.Objetos.GraficoEstatisticasSequenciasChartist.update();
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

              _this.Instancia.Objetos.GraficoEstatisticasSorteadosDiv =
                _this.Container.find(".sorteados .grafico");
              _this.Instancia.Objetos.GraficoEstatisticasSorteadosDiv.html("");
              _this.Instancia.Objetos.GraficoEstatisticasSorteadosData = {
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
              _this.Instancia.Objetos.GraficoEstatisticasSorteadosChartist =
                new Chartist.Bar(
                  _this.Instancia.Objetos.GraficoEstatisticasSorteadosDiv.get(
                    0
                  ),
                  _this.Instancia.Objetos.GraficoEstatisticasSorteadosData,
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
              //_this.Instancia.Objetos.GraficoEstatisticasSorteadosChartist.on('draw', function() {
              //    $('foreignObject[y="-15.299999999999955"').attr('y', '-6');
              //});

              _this.Instancia.Layout.OnAbrirJanela.push(function () {
                _this.Instancia.Objetos.GraficoEstatisticasSequenciasChartist.update();
              });
            },

            Reiniciar: function (valorInicial) {
              for (
                let i = 0;
                i <
                _this.Instancia.Objetos.GraficoEstatisticasSorteadosData
                  .series[0].length;
                i++
              ) {
                _this.Instancia.Objetos.GraficoEstatisticasSorteadosData.series[0][
                  i
                ] = 0;
              }
              _this.Instancia.Objetos.GraficoEstatisticasSorteadosChartist.update();
            },

            Adicionar: function (valor) {
              if (isNaN(parseFloat(valor))) {
                return;
              }
              _this.Instancia.Objetos.GraficoEstatisticasSorteadosData
                .series[0][valor]++;
              _this.Instancia.Objetos.GraficoEstatisticasSorteadosChartist.update();
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

              _this.Instancia.Objetos.GraficoEstatisticasPredicaoDiv =
                _this.Container.find(".predicao .grafico");
              _this.Instancia.Objetos.GraficoEstatisticasPredicaoDiv.html("");
              _this.Instancia.Objetos.GraficoEstatisticasPredicaoData = {
                series: [0, 0],
              };
              _this.Instancia.Objetos.GraficoEstatisticasPredicaoChartist =
                new Chartist.Pie(
                  _this.Instancia.Objetos.GraficoEstatisticasPredicaoDiv.get(0),
                  _this.Instancia.Objetos.GraficoEstatisticasPredicaoData,
                  {
                    width: "100%",
                    height: "100px",
                    fullWidth: true,
                    chartPadding: 0,
                    labelInterpolationFnc: function (value, serie) {
                      var total =
                        _this.Instancia.Objetos.GraficoEstatisticasPredicaoData
                          .series[0] +
                        _this.Instancia.Objetos.GraficoEstatisticasPredicaoData
                          .series[1];
                      var valor = parseInt(
                        (_this.Instancia.Objetos.GraficoEstatisticasPredicaoData
                          .series[serie] /
                          total) *
                          100
                      );
                      return valor + "%";
                    },
                  }
                );

              _this.Instancia.Layout.OnAbrirJanela.push(function () {
                _this.Instancia.Objetos.GraficoEstatisticasPredicaoChartist.update();
              });
            },

            Reiniciar: function () {
              _this.Instancia.Objetos.GraficoEstatisticasPredicaoData.series[0] = 1;
              _this.Instancia.Objetos.GraficoEstatisticasPredicaoData.series[1] = 1;
              _this.Instancia.Objetos.GraficoEstatisticasPredicaoData.Reiniciado = true;
              _this.Instancia.Objetos.GraficoEstatisticasPredicaoChartist.update();
            },

            Adicionar: function (valor) {
              if (
                _this.Instancia.Objetos.GraficoEstatisticasPredicaoData
                  .Reiniciado
              ) {
                _this.Instancia.Objetos.GraficoEstatisticasPredicaoData.Reiniciado = false;
                _this.Instancia.Objetos.GraficoEstatisticasPredicaoData.series[0] = 0;
                _this.Instancia.Objetos.GraficoEstatisticasPredicaoData.series[1] = 0;
              }
              _this.Instancia.Objetos.GraficoEstatisticasPredicaoData.series[0] +=
                valor > 0 ? 1 : 0;
              _this.Instancia.Objetos.GraficoEstatisticasPredicaoData.series[1] +=
                valor < 0 ? 1 : 0;
              _this.Instancia.Objetos.GraficoEstatisticasPredicaoChartist.update();
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
          if (!response.result) {
            return;
          }

          _this.Dados.tempoCorrido =
            _this.Dados.tempoCorrido === null
              ? new Date()
              : _this.Dados.tempoCorrido;
          let horasCorridas =
            new Date().getTime() - _this.Dados.tempoCorrido.getTime();
          horasCorridas = horasCorridas / 1000 / 60;

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
            _this.Grafico.Sorteados.Reiniciar();
          },

          tempoCorrido: undefined,
          TempoCorrido: function (valor) {
            if (valor !== undefined) {
              if (valor instanceof Date) {
                valor = new Date(
                  new Date().getTime() - valor.getTime() + 1000 * 60 * 60 * 2
                );
                valor = _this.Instancia.Geral.FormatarData(valor, "h:m:s");
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
            const saldoAtual = parseFloat($("#balance").val());

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
            const saldoAtual = parseFloat($("#balance").val());

            if (valor !== undefined) {
              valor = parseFloat($("#balance").val());
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
                    :host table td input[type="text"] {
                        text-align: right;
                        width: 83%;
                        padding: 2px 10px 0 0;
                    }
                    :host table td input[type="text"].ativo {
                        background-color: steelblue;
                        color: white;
                    }
                    :host table td input[type="text"].disparado {
                        background-color: indianred;
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
                `;

        this.Html = this.Instancia.Geral.FormatarString(`
                        <span class="info">
                            Para ativar um limite basta informar o valor desejado.
                            Quando um limite &eacute; atingido o site n&atilde;o consegue mais se
                            comunicar com o servidor impossibilitando qualquer aposta.
                            Ajuste ou remova o limite em quest&atilde;o para que
                            o site retorne ao seu funcionamento normal.
                            <hr />
                            Os limites ativos s&atilde;o indicados em azul.
                            Os limites atingidos s&atilde;o indicados em vermelho.
                        </span>
                        <table>
                            <tr>
                                <td rowspan="2">Saldo</td>
                                <td>M&iacute;nimo</td>
                                <td class="saldoMinimo"><input type="text" /></td>
                            </tr>
                            <tr>
                                <td>M&aacute;ximo</td>
                                <td class="saldoMaximo"><input type="text" /></td>
                            </tr>
                            <tr><td colspan="4"><div class='divisor'>&nbsp;</div></td></tr>
                            <tr>
                                <td rowspan="2">Aposta</td>
                                <td>M&iacute;nima</td>
                                <td class="apostaMinima"><input type="text" /></td>
                            </tr>
                            <tr>
                                <td>M&aacute;xima</td>
                                <td class="apostaMaxima"><input type="text" /></td>
                            </tr>
                            <tr><td colspan="4"><div class='divisor'>&nbsp;</div></td></tr>
                            <tr>
                                <td rowspan="2">Sequ&ecirc;ncia</td>
                                <td>Vencendo</td>
                                <td class="sequenciaVencendo"><input type="text" data-digitos="0" /></td>
                            </tr>
                            <tr>
                                <td>Perdendo</td>
                                <td class="sequenciaPerdendo"><input type="text" data-digitos="0" /></td>
                            </tr>
                        </table>
                        <button class="reiniciar btn grey">Remover todos os limites</button>
                    `);

        this.Js = function () {
          _this.Instancia.Objetos.BtnLimitesReiniciar =
            this.Container.find(".reiniciar");
          _this.Instancia.Objetos.BtnLimitesReiniciar.click(function () {
            _this.Container.find('input[type="text"]').val("").blur();

            if (_this.Instancia.Objetos.JanelaModal.isOpen) {
              _this.Instancia.Geral.Toast("Todos os limites foram removidos.");
            }
          });
          _this.Instancia.Objetos.BtnLimitesReiniciar.click();

          const inputsText = this.Container.find('input[type="text"]');
          inputsText.blur(function () {
            const inputText = $(this);
            let valor = inputText.val();

            let digitosDecimais = parseInt(inputText.attr("data-digitos"));
            digitosDecimais = isFinite(digitosDecimais)
              ? digitosDecimais
              : undefined;

            valor = _this.Instancia.Geral.NumericoTexto(valor, digitosDecimais);
            if (valor !== "") {
              inputText.addClass("ativo").removeClass("disparado");
            } else {
              inputText.removeClass("ativo").removeClass("disparado");
            }

            inputText.val(valor);
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

        this.OnAjaxResponse = function (response, request) {
          if (request.game !== "dice") {
            return;
          }
          if (!response.result) {
            return;
          }

          _this.Dados.sequenciaVencendo =
            response.gameResult === "win"
              ? _this.Dados.sequenciaVencendo + 1
              : 0;
          _this.Dados.sequenciaPerdendo =
            response.gameResult === "lose"
              ? _this.Dados.sequenciaPerdendo + 1
              : 0;
        };

        this.Dados = {
          sequenciaPerdendo: 0,
          sequenciaVencendo: 0,
        };

        this.Validar = {
          SaldoMinimo: function () {
            const input = _this.Container.find(
              '.saldoMinimo input[type="text"]'
            );
            let valor = input.val();
            if (valor !== "") {
              valor = _this.Instancia.Geral.Numerico(valor);
              const valorTeste = _this.Instancia.Geral.Numerico(
                $("#balance").val()
              );
              if (valorTeste <= valor) {
                input.addClass("disparado");
                return false;
              }
            }
            input.removeClass("disparado");
            return true;
          },
          SaldoMaximo: function () {
            const input = _this.Container.find(
              '.saldoMaximo input[type="text"]'
            );
            let valor = input.val();
            if (valor !== "") {
              valor = _this.Instancia.Geral.Numerico(valor);
              const valorTeste = _this.Instancia.Geral.Numerico(
                $("#balance").val()
              );
              if (valorTeste >= valor) {
                input.addClass("disparado");
                return false;
              }
            }
            input.removeClass("disparado");
            return true;
          },
          ApostaMinima: function () {
            const input = _this.Container.find(
              '.apostaMinima input[type="text"]'
            );
            let valor = input.val();
            if (valor !== "") {
              valor = _this.Instancia.Geral.Numerico(valor);
              const valorTeste = _this.Instancia.Geral.Numerico(
                $("#betAmount").val()
              );
              if (valorTeste <= valor) {
                input.addClass("disparado");
                return false;
              }
            }
            input.removeClass("disparado");
            return true;
          },
          ApostaMaxima: function () {
            const input = _this.Container.find(
              '.apostaMaxima input[type="text"]'
            );
            let valor = input.val();
            if (valor !== "") {
              valor = _this.Instancia.Geral.Numerico(valor);
              const valorTeste = _this.Instancia.Geral.Numerico(
                $("#betAmount").val()
              );
              if (valorTeste >= valor) {
                input.addClass("disparado");
                return false;
              }
            }
            input.removeClass("disparado");
            return true;
          },
          SequenciaPerdendo: function () {
            const input = _this.Container.find(
              '.sequenciaPerdendo input[type="text"]'
            );
            let valor = input.val();
            if (valor !== "") {
              valor = _this.Instancia.Geral.Numerico(valor);
              const valorTeste = _this.Dados.sequenciaPerdendo;
              if (valorTeste >= valor) {
                input.addClass("disparado");
                return false;
              }
            }
            input.removeClass("disparado");
            return true;
          },
          SequenciaVencendo: function () {
            const input = _this.Container.find(
              '.sequenciaVencendo input[type="text"]'
            );
            let valor = input.val();
            if (valor !== "") {
              valor = _this.Instancia.Geral.Numerico(valor);
              const valorTeste = _this.Dados.sequenciaVencendo;
              if (valorTeste >= valor) {
                input.addClass("disparado");
                return false;
              }
            }
            input.removeClass("disparado");
            return true;
          },
        };
      })(this.Instancia),

      new (function (instancia) {
        this.Instancia = instancia;
        const _this = this;

        this.Titulo = "BOT ForceRandomize";

        this.Container;

        this.Css = `
                    :host table td {
                        font-size: 13px;
                        vertical-align: middle;
                        text-align: right;
                        padding: 1px 5px;
                    }
                    :host table td:first-child {
                        position: relative;
                        top: -2px;
                    }
                    :host table td:last-child {
                        text-align: left;
                        padding-left: 2px;
                        width: 20%;
                    }
                    :host table td input[type="text"] {
                        text-align: center;
                        width: 100%;
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
                    :host .btn {
                        float: none;
                    }
                    :host .estado {
                        display: inline-block;
                        padding: 0 15px;
                        font-size: 18px;
                        position: relative;
                        top: 1px;
                        font-weight: bold;
                        color: darkgrey;
                    }
                    :host .estado.ativado {
                        color: darkcyan;
                    }
                    :host .seed input[type="text"] {
                        font-size: 18px;
                        background-color: transparent;
                        color: red;
                        border-width: 0;
                        margin-top: 10px;
                    }
                    :host .seed.server input[type="text"] {
                        font-size: 9px;
                        color: darkred;
                    }
                `;

        this.Html = this.Instancia.Geral.FormatarString(`
                        <span class="info">
                            O processo de obter um n&uacute;mero aleat&oacute;rio depende da defini&ccedil;&atilde;o do Seed,
                            que por sua vez &eacute; um valor qualquer que serve para inicializar o gerador.
                            Alterando o valor do Seed isso torna o processo ainda mais aleat&oacute;rio.
                            Saiba mais sobre como o Luckygames trabalha com isso em:
                            <a target="_blank" href="https://luckygames.io/page/fair/">https://luckygames.io/page/fair/</a>
                            <hr />
                            Este BOT for&ccedil;a a troca do valor do Seed.
                            N&atilde;o &eacute; poss&iacute;vel alterar o Seed do servidor.
                            Somente o Seed do seu navegador.
                            <hr />
                            Use valores maiores que zero.
                        </span>
                        <table>
                            <tr>
                                <td colspan="2" class="seed client">
                                    <h1>Valor atual do Seed</h1>
                                    <input type="text" readonly />
                                </td>
                            </tr>
                            <tr>
                                <td colspan="2" class="seed server">
                                    <h1>Seed no Servidor (hash)</h1>
                                    <input type="text" readonly />
                                </td>
                            </tr>
                            <tr><td colspan="4"><div class='divisor'>&nbsp;</div></td></tr>
                            <tr>
                                <td>Trocar o Seed depois de quantas apostas</td>
                                <td class="rodadas"><input type="text" value="600" /></td>
                            </tr>
                            <tr><td colspan="4"><div class='divisor'>&nbsp;</div></td></tr>
                            <tr>
                                <td>Trocar o Seed depois de quantas apostas perdidas</td>
                                <td class="apostasPerdidas"><input type="text" value="" /></td>
                            </tr>
                            <tr><td colspan="4"><div class='divisor'>&nbsp;</div></td></tr>
                            <tr>
                                <td>Trocar o Seed depois de quantas apostas vencidas</td>
                                <td class="apostasVencidas"><input type="text" value="" /></td>
                            </tr>
                        </table>
                        <button class="trocarSeed btn red">Trocar Seed</button>
                        <button class="desativar btn">Desativar</button>
                        <button class="ativar btn">Ativar</button>
                        <div class="estado"></div>
                    `);

        this.Js = function () {
          _this.Instancia.Objetos.DivBotForceRandomizeSeedClient =
            this.Container.find(".seed.client input");
          _this.Instancia.Objetos.DivBotForceRandomizeSeedServer =
            this.Container.find(".seed.server input");

          _this.Instancia.Objetos.DivBotForceRandomizeEstado =
            this.Container.find(".estado");

          _this.Instancia.Objetos.BtnBotForceRandomizeTrocarSeed =
            this.Container.find(".trocarSeed");
          _this.Instancia.Objetos.BtnBotForceRandomizeTrocarSeed.click(
            function () {
              _this.AtualizarSeed(true);
            }
          );

          _this.Instancia.Objetos.BtnBotForceRandomizeAtivar =
            this.Container.find(".ativar");
          _this.Instancia.Objetos.BtnBotForceRandomizeAtivar.click(function () {
            if (_this.Ativo()) {
              return;
            }

            if (!_this.Parametros.Validar(true)) {
              return;
            }

            _this.Ativo(true);
          });

          _this.Instancia.Objetos.BtnBotForceRandomizeDesativar =
            this.Container.find(".desativar");
          _this.Instancia.Objetos.BtnBotForceRandomizeDesativar.click(
            function () {
              if (!_this.Ativo()) {
                return;
              }

              _this.Ativo(false);
            }
          );

          _this.Ativo(false);

          const inputsText = this.Container.find(
            'input[type="text"]:not([readonly])'
          );
          inputsText.change(function () {
            if (_this.Ativo() && !_this.Parametros.Validar(true)) {
              _this.Ativo(false);
            } else {
              _this.Reiniciar();
            }
          });
          inputsText.blur(function () {
            const inputText = $(this);
            const valor = _this.Instancia.Geral.NumericoTexto(
              inputText.val(),
              0
            );
            inputText.val(valor);
          });
          inputsText.blur();

          _this.AtualizarSeed();
        };

        this.OnAjaxRequest = function (request) {
          if (request.game !== "dice") {
            return;
          }
          if (!_this.Ativo()) {
            return;
          }

          return true;
        };

        this.OnAjaxResponse = function (response, request) {
          _this.AtualizarSeed(
            false,
            response.clientSeed,
            response.serverSeedHash
          );

          if (request.game !== "dice") {
            return;
          }
          if (!response.result) {
            return;
          }
          if (!_this.Ativo()) {
            return;
          }

          _this.Dados.rodadas++;
          _this.Dados.sequenciaPerdendo =
            response.gameResult === "lose"
              ? _this.Dados.sequenciaPerdendo + 1
              : 0;
          _this.Dados.sequenciaVencendo =
            response.gameResult === "win"
              ? _this.Dados.sequenciaVencendo + 1
              : 0;

          const valorRodadas = _this.Parametros.ValorRodadas();
          const valorApostasPerdidas = _this.Parametros.ValorApostasPerdidas();
          const valorApostasVencidas = _this.Parametros.ValorApostasVencidas();

          if (
            (valorRodadas > 0 && _this.Dados.rodadas >= valorRodadas) ||
            (valorApostasPerdidas > 0 &&
              _this.Dados.sequenciaPerdendo >= valorApostasPerdidas) ||
            (valorApostasVencidas > 0 &&
              _this.Dados.sequenciaVencendo >= valorApostasVencidas)
          ) {
            _this.AtualizarSeed(true);
          }
        };

        this.Reiniciar = function () {
          _this.Dados.rodadas = 0;
          _this.Dados.sequenciaPerdendo = 0;
          _this.Dados.sequenciaVencendo = 0;
        };

        this.AtualizarSeed = function (atualizar, clientSeed, serverSeedHash) {
          if (atualizar) {
            _this.Instancia.LuckygamesIo.TrocarSeed();
            _this.Reiniciar();
            _this.Instancia.Geral.Toast("O Seed foi trocado.");
          } else {
            clientSeed = clientSeed ? clientSeed : $("#clientSeed").val();
            serverSeedHash = serverSeedHash
              ? serverSeedHash
              : $("#serverSeedHash").html();
            _this.Instancia.Objetos.DivBotForceRandomizeSeedClient.val(
              clientSeed
            );
            _this.Instancia.Objetos.DivBotForceRandomizeSeedServer.val(
              serverSeedHash
            );
          }
        };

        this.Ativo = function (modo) {
          const cssClass = "grey";

          if (modo !== undefined) {
            if (modo) {
              _this.Instancia.Objetos.BtnBotForceRandomizeDesativar.addClass(
                cssClass
              );
              _this.Instancia.Objetos.BtnBotForceRandomizeAtivar.removeClass(
                cssClass
              );
              _this.Instancia.Objetos.DivBotForceRandomizeEstado.addClass(
                "ativado"
              ).html("Ativado");
            } else {
              _this.Instancia.Objetos.BtnBotForceRandomizeDesativar.removeClass(
                cssClass
              );
              _this.Instancia.Objetos.BtnBotForceRandomizeAtivar.addClass(
                cssClass
              );
              _this.Instancia.Objetos.DivBotForceRandomizeEstado.removeClass(
                "ativado"
              ).html("Desativado");
            }
            if (_this.Instancia.Objetos.JanelaModal.isOpen) {
              _this.Instancia.Geral.Toast(
                _this.Instancia.Geral.FormatarString(
                  "O {0} foi {1}.",
                  _this.Titulo,
                  modo ? "ativado" : "desativado"
                )
              );
            }
          }

          return _this.Instancia.Objetos.DivBotForceRandomizeEstado.hasClass(
            "ativado"
          );
        };

        this.Dados = {
          rodadas: 0,
          sequenciaPerdendo: 0,
          sequenciaVencendo: 0,
        };

        this.Parametros = {
          Validar: function (exibirAlerta) {
            const result =
              _this.Parametros.ValorRodadas() > 0 ||
              _this.Parametros.ValorApostasPerdidas() > 0 ||
              _this.Parametros.ValorApostasVencidas() > 0;

            if (!result && exibirAlerta) {
              if (_this.Instancia.Objetos.JanelaModal.isOpen) {
                _this.Instancia.Geral.Toast(
                  "error",
                  _this.Instancia.Geral.FormatarString(
                    "O {0} tem um ou mais par&acirc;metros inv&aacute;lidos.",
                    _this.Titulo
                  )
                );
              }
            }
            return result;
          },

          ValorRodadas: function () {
            return _this.Instancia.Geral.Numerico(
              _this.Container.find(".rodadas input").val()
            );
          },

          ValorApostasPerdidas: function () {
            return _this.Instancia.Geral.Numerico(
              _this.Container.find(".apostasPerdidas input").val()
            );
          },

          ValorApostasVencidas: function () {
            return _this.Instancia.Geral.Numerico(
              _this.Container.find(".apostasVencidas input").val()
            );
          },
        };
      })(this.Instancia),

      new (function (instancia) {
        this.Instancia = instancia;
        const _this = this;

        this.Titulo = "BOT EverGain";

        this.Container;

        this.Css = `
                    :host table td {
                        font-size: 13px;
                        vertical-align: middle;
                        text-align: right;
                        padding: 1px 5px;
                    }
                    :host table td:first-child {
                        position: relative;
                        top: -2px;
                    }
                    :host table td:last-child {
                        text-align: left;
                        padding-left: 2px;
                        width: 50%;
                    }
                    :host table td input[type="text"] {
                        text-align: center;
                        width: 100%;
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
                    :host .btn {
                        float: none;
                    }
                    :host .estado {
                        display: inline-block;
                        padding: 0 15px;
                        font-size: 18px;
                        position: relative;
                        top: 1px;
                        font-weight: bold;
                        color: darkgrey;
                    }
                    :host .estado.ativado {
                        color: darkcyan;
                    }
                `;

        this.Html = this.Instancia.Geral.FormatarString(`
                        <span class="info">
                            Esse BOT sempre ganha. De pouco em pouco, mas de forma constante.
                        </span>
                        <table>
                            <tr class="saldo">
                                <td>Saldo inicial</td>
                                <td><input type="text" value="600" /></td>
                            </tr>
                            <tr><td colspan="2"><div class='divisor'>&nbsp;</div></td></tr>
                            <tr class="aposta">
                                <td>Aposta inicial</td>
                                <td><input type="text" value="" /></td>
                            </tr>
                            <tr><td colspan="2"><div class='divisor'>&nbsp;</div></td></tr>
                            <tr class="multiplicador">
                                <td>Multiplicador</td>
                                <td><input type="text" value="98" data-digitos="0" /></td>
                            </tr>
                        </table>
                        <button class="desativar btn">Desativar</button>
                        <button class="ativar btn">Ativar</button>
                        <div class="estado"></div>
                    `);

        this.Js = function () {
          _this.Instancia.Objetos.InputBotEverGainSaldo =
            this.Container.find(".saldo input");
          _this.Instancia.Objetos.InputBotEverGainAposta =
            this.Container.find(".aposta input");
          _this.Instancia.Objetos.InputBotEverGainMultiplicador =
            this.Container.find(".multiplicador input");

          _this.Instancia.Objetos.DivBotEverGainEstado =
            this.Container.find(".estado");

          _this.Instancia.Objetos.BtnBotEverGainAtivar =
            this.Container.find(".ativar");
          _this.Instancia.Objetos.BtnBotEverGainAtivar.click(function () {
            if (_this.Ativo()) {
              return;
            }

            if (!_this.Parametros.Validar(true)) {
              return;
            }

            _this.Ativo(true);
          });

          _this.Instancia.Objetos.BtnBotEverGainDesativar =
            this.Container.find(".desativar");
          _this.Instancia.Objetos.BtnBotEverGainDesativar.click(function () {
            if (!_this.Ativo()) {
              return;
            }

            _this.Ativo(false);
          });

          _this.Ativo(false);

          const inputsText = this.Container.find(
            'input[type="text"]:not([readonly])'
          );
          inputsText.change(function () {
            if (_this.Ativo() && !_this.Parametros.Validar(true)) {
              _this.Ativo(false);
            } else {
              _this.Reiniciar();
            }
          });
          inputsText.blur(function () {
            const inputText = $(this);

            let digitosDecimais = parseInt(inputText.attr("data-digitos"));
            digitosDecimais = isFinite(digitosDecimais)
              ? digitosDecimais
              : undefined;

            const valor = _this.Instancia.Geral.NumericoTexto(
              inputText.val(),
              digitosDecimais
            );

            inputText.val(valor);
          });
          inputsText.blur();
        };

        this.OnAjaxRequest = function (request) {
          if (request.game !== "dice") {
            return;
          }
          if (!_this.Ativo()) {
            return;
          }

          _this.Dados.saldoInicial =
            _this.Dados.saldoInicial === null
              ? _this.Parametros.ValorSaldo()
              : _this.Dados.saldoInicial;
          const valorSaldoAtual = _this.Instancia.Geral.Numerico(
            $("#balance").val()
          );
          const valorAposta = _this.Parametros.ValorAposta();
          const valorMultiplicador = _this.Parametros.ValorMultiplicador();

          if (_this.Dados.rodadas == 0) {
            _this.Dados.saldoInicial =
              _this.Dados.saldoInicial < valorSaldoAtual
                ? valorSaldoAtual
                : _this.Dados.saldoInicial;
          }

          let alvo =
            _this.Dados.saldoInicial + valorAposta * valorMultiplicador;
          let apostaNecessaria = (alvo - valorSaldoAtual) / valorMultiplicador;

          apostaNecessaria =
            Math.round(apostaNecessaria * 100000000) / 100000000;

          request.betAmount = apostaNecessaria.toFixed(8);

          //console.log('rodada: ' + _this.Dados.rodadas, 'apostaNecessaria: ' + apostaNecessaria.toFixed(9), 'valorSaldoAtual: ' + valorSaldoAtual.toFixed(9), '_this.Dados.saldoInicial: ' + _this.Dados.saldoInicial.toFixed(9));

          return true;
        };

        this.OnAjaxResponse = function (response, request) {
          if (request.game !== "dice") {
            return;
          }
          if (!response.result) {
            return;
          }
          if (!_this.Ativo()) {
            return;
          }

          _this.Dados.sequenciaPerdendo =
            response.gameResult === "lose"
              ? _this.Dados.sequenciaPerdendo + 1
              : 0;
          _this.Dados.sequenciaVencendo =
            response.gameResult === "win"
              ? _this.Dados.sequenciaVencendo + 1
              : 0;

          _this.Dados.rodadas =
            response.gameResult === "win" ? 0 : _this.Dados.rodadas + 1;
        };

        this.Reiniciar = function () {
          _this.Dados.saldoInicial = null;
          _this.Dados.rodadas = 0;
          _this.Dados.sequenciaPerdendo = 0;
          _this.Dados.sequenciaVencendo = 0;
        };

        this.Ativo = function (modo) {
          const cssClass = "grey";

          if (modo !== undefined) {
            if (modo) {
              _this.Instancia.Objetos.BtnBotEverGainDesativar.addClass(
                cssClass
              );
              _this.Instancia.Objetos.BtnBotEverGainAtivar.removeClass(
                cssClass
              );
              _this.Instancia.Objetos.DivBotEverGainEstado.addClass(
                "ativado"
              ).html("Ativado");
            } else {
              _this.Instancia.Objetos.BtnBotEverGainDesativar.removeClass(
                cssClass
              );
              _this.Instancia.Objetos.BtnBotEverGainAtivar.addClass(cssClass);
              _this.Instancia.Objetos.DivBotEverGainEstado.removeClass(
                "ativado"
              ).html("Desativado");
            }
            if (_this.Instancia.Objetos.JanelaModal.isOpen) {
              _this.Instancia.Geral.Toast(
                _this.Instancia.Geral.FormatarString(
                  "O {0} foi {1}.",
                  _this.Titulo,
                  modo ? "ativado" : "desativado"
                )
              );
            }
          }

          return _this.Instancia.Objetos.DivBotEverGainEstado.hasClass(
            "ativado"
          );
        };

        this.Dados = {
          rodadas: 0,
          sequenciaPerdendo: 0,
          sequenciaVencendo: 0,
        };

        this.Parametros = {
          Validar: function (exibirAlerta) {
            const result =
              _this.Parametros.ValorSaldo() > 0 ||
              _this.Parametros.ValorAposta() > 0 ||
              _this.Parametros.ValorMultiplicador() > 0;

            if (!result && exibirAlerta) {
              if (_this.Instancia.Objetos.JanelaModal.isOpen) {
                _this.Instancia.Geral.Toast(
                  "error",
                  _this.Instancia.Geral.FormatarString(
                    "O {0} tem um ou mais par&acirc;metros inv&aacute;lidos.",
                    _this.Titulo
                  )
                );
              }
            }
            return result;
          },

          ValorSaldo: function () {
            return _this.Instancia.Geral.Numerico(
              _this.Container.find(".saldo input").val()
            );
          },

          ValorAposta: function () {
            return _this.Instancia.Geral.Numerico(
              _this.Container.find(".aposta input").val()
            );
          },

          ValorMultiplicador: function () {
            return _this.Instancia.Geral.Numerico(
              _this.Container.find(".multiplicador input").val()
            );
          },
        };
      })(this.Instancia),

      new (function (instancia) {
        this.Instancia = instancia;
        const _this = this;

        this.Titulo = "BOT PlusChance";

        this.Container;

        this.Css = `
                    :host table td {
                        font-size: 13px;
                        vertical-align: middle;
                        text-align: right;
                        padding: 1px 5px;
                    }
                    :host table td:first-child {
                        position: relative;
                        top: -2px;
                    }
                    :host table td:last-child {
                        text-align: left;
                        padding-left: 2px;
                        width: 20%;
                    }
                    :host table td input[type="text"] {
                        text-align: center;
                        width: 100%;
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
                    :host .btn {
                        float: none;
                    }
                    :host .estado {
                        display: inline-block;
                        padding: 0 15px;
                        font-size: 18px;
                        position: relative;
                        top: 1px;
                        font-weight: bold;
                        color: darkgrey;
                    }
                    :host .estado.ativado {
                        color: darkcyan;
                    }
                    :host .indicadores {
                        margin: 10px 0;
                        display: none;
                    }
                    :host .indicador {
                        background-color: #CB9BA0;
                        display: inline-block;
                        width: 10px;
                        height: 10px;
                        margin: 2px;
                        border: 2px solid #CB9BA0;
                    }
                    :host .indicador.atual {
                        background-color: #AB2E40;
                        border-color: #AB2E40;
                    }
                    :host .indicador.atual.aposta {
                        border-radius: 8px;
                    }
                    :host .indicadores span.info {
                        display: block;
                        margin: 0 0 5px 0;
                    }
                    :host .frequentes .grafico .seq {
                        text-align: left;
                    }
                    :host .frequentes .grafico .key,
                    :host .frequentes .grafico .value,
                    :host .frequentes .grafico .value-percent,
                    :host .frequentes .grafico .percentual .barra {
                        display: inline-block;
                        margin: 1px;
                        padding: 2px 5px;
                        text-align: right;
                    }
                    :host .frequentes .grafico .percentual .barra {
                        text-align: left;
                    }
                    :host .frequentes .grafico .percentual .barra .momento {
                        white-space: nowrap;
                        color: black;
                        text-shadow: 0 0 5px white, 0 0 5px white, 0 0 5px white;
                    }
                    :host .frequentes .grafico {
                        height: 150px;
                        overflow: auto;
                    }
                    :host .frequentes .grafico .percentual {
                        width: 190px;
                        display: inline-block;
                    }
                    :host .frequentes .grafico .key {
                        width: 30px;
                        background-color: gainsboro;
                    }
                    :host .frequentes .grafico .value { 
                        width: 40px;
                    }
                    :host .frequentes .grafico .value-percent {
                        width: 50px;
                    }
                    :host .frequentes .grafico .percentual .barra {
                        background-color: darkgray;
                        min-width: 2px;
                    }
                    :host .frequentes .grafico .percentual .barra[ocorrido] {
                        background-color: #333;
                    }
                    :host .ultimaVencida {
                        max-height: 112px;
                        overflow: auto;
                        display: block;
                        padding: 0 5px 0 0;
                        border: 1px solid #f0f0f0;
                    }
                    :host .ultimaVencida span {
                        display: block;
                        margin: 4px;
                    }
                    :host .ultimaVencida span:not(.vazio) {
                        color: forestgreen;
                    }
                    :host .ultimaVencida span:not(.vazio):before {
                        content: "●";
                        position: relative;
                        top: -1px;
                    }
                `;

        this.Html = this.Instancia.Geral.FormatarString(`
                        <span class="info">
                            Este BOT garante que sua aposta s&oacute; ser&aacute; submetida depois que
                            uma sequ&ecirc;ncia de perdas seja atingida. Por exemplo, se o
                            valor de Prediction for 81, em geral sua aposta vence
                            com muito mais chance depois de perder consecutivamente 16 vezes.
                            Enquanto a sequ&ecirc;ncia perdendo n&atilde;o &eacute; atingida o valor da aposta
                            que &eacute; enviado &eacute; de 0.00000001 independente do valor que voc&ecirc; definiu.
                            <hr />
                            Depois de ativar este BOT basta iniciar normalmente as
                            apostas autom&aacute;ticas pelo pr&oacute;prio site.
                        </span>
                        <table>
                            <tr>
                                <td>Esperar quantas rodadas antes de come&ccedil;ar a apostar</td>
                                <td class="espera"><input type="text" value="50" /></td>
                            </tr>
                            <tr><td colspan="4"><div class='divisor'>&nbsp;</div></td></tr>
                            <tr>
                                <td>Apostar depois de quantas sequ&ecirc;ncias perdendo</td>
                                <td class="sequencias"><input type="text" value="16" /></td>
                            </tr>
                            <tr><td colspan="4"><div class='divisor'>&nbsp;</div></td></tr>
                            <tr>
                                <td>Apostar por quantas vezes consecutivas</td>
                                <td class="tentativas"><input type="text" value="4" /></td>
                            </tr>
                        </table>
                        <div class="indicadores"><span class="info">&Uacute;ltima vez que venceu: <span class="ultimaVencida"></span><br />Sequ&ecirc;ncias perdendo: <span class="contagem">0</span>/<span class="total">0</span></span><div class="indicador atual"></div><div class="indicador atual"></div><div class="indicador"></div><div class="indicador"></div><div class="indicador"></div><div class="indicador"></div><div class="indicador"></div><div class="indicador"></div><div class="indicador"></div><div class="indicador"></div><div class="indicador"></div><div class="indicador"></div><div class="indicador"></div><div class="indicador"></div><div class="indicador"></div><div class="indicador"></div><div class="indicador"></div><div class="indicador"></div><div class="indicador"></div><div class="indicador"></div><div class="indicador"></div><div class="indicador"></div><div class="indicador"></div><div class="indicador"></div><div class="indicador"></div><div class="indicador"></div><div class="indicador"></div><div class="indicador"></div><div class="indicador"></div><div class="indicador"></div><div class="indicador"></div><div class="indicador"></div><div class="indicador"></div><div class="indicador"></div><div class="indicador"></div><div class="indicador"></div><div class="indicador"></div><div class="indicador"></div><div class="indicador"></div><div class="indicador"></div><div class="indicador"></div><div class="indicador"></div><div class="indicador"></div><div class="indicador"></div><div class="indicador"></div><div class="indicador"></div><div class="indicador"></div><div class="indicador"></div><div class="indicador"></div><div class="indicador"></div><div class="indicador"></div><div class="indicador"></div><div class="indicador"></div><div class="indicador"></div><div class="indicador"></div><div class="indicador"></div><div class="indicador"></div><div class="indicador"></div><div class="indicador"></div><div class="indicador"></div><div class="indicador"></div><div class="indicador"></div><div class="indicador"></div><div class="indicador"></div><div class="indicador"></div><div class="indicador"></div><div class="indicador"></div><div class="indicador"></div><div class="indicador"></div><div class="indicador"></div><div class="indicador"></div><div class="indicador"></div><div class="indicador"></div><div class="indicador"></div><div class="indicador"></div><div class="indicador"></div><div class="indicador"></div><div class="indicador"></div><div class="indicador"></div><div class="indicador"></div><div class="indicador"></div><div class="indicador"></div><div class="indicador"></div><div class="indicador"></div><div class="indicador"></div></div>
                        <div class="frequentes">
                            <h2>Sequ&ecirc;ncias mais frequentes</h2>
                            <div class="grafico"></div>
                            <span class="info">
                                No primeiro gr&aacute;fico, cada ponto quadrado indica uma aposta perdida.
                                Se a cor for mais forte indica que acabou de acontecer e foi inclu&iacute;da
                                na sequ&ecirc;ncia perdendo.
                                Se o ponto for um c&iacute;rculo indica que sua aposta foi enviada nesse momento,
                                mas perdeu.
                                <h1 />
                                No segundo gr&aacute;fico acima cada linha representa uma sequ&ecirc;ncia perdendo.
                                Ao lado &eacute; informado quantas vezes ela aconteceu, numericamente e
                                percentualente. Tamb&eacute;m mostra a &uacute;ltima vez que ela ocorreu.
                            </span>
                        </div>
                        <button class="desativar btn">Desativar</button>
                        <button class="ativar btn">Ativar</button>
                        <div class="estado"></div>
                    `);

        this.Js = function () {
          _this.Instancia.Objetos.DivBotPlusChanceUltimaVencida =
            this.Container.find(".ultimaVencida");

          _this.Instancia.Objetos.DivBotPlusChanceIndicadores =
            this.Container.find(".indicadores");

          _this.Instancia.Objetos.DivBotPlusChanceFrequentes =
            this.Container.find(".frequentes");
          _this.Instancia.Objetos.DivBotPlusChanceFrequentesGrafico =
            this.Container.find(".frequentes .grafico");

          _this.Instancia.Objetos.DivBotPlusChanceEstado =
            this.Container.find(".estado");

          _this.Instancia.Objetos.BtnBotPlusChanceAtivar =
            this.Container.find(".ativar");
          _this.Instancia.Objetos.BtnBotPlusChanceAtivar.click(function () {
            if (_this.Ativo()) {
              return;
            }

            if (!_this.Parametros.Validar(true)) {
              return;
            }

            _this.Ativo(true);
          });

          _this.Instancia.Objetos.BtnBotPlusChanceDesativar =
            this.Container.find(".desativar");
          _this.Instancia.Objetos.BtnBotPlusChanceDesativar.click(function () {
            if (!_this.Ativo()) {
              return;
            }

            _this.Ativo(false);
          });

          _this.Ativo(false);

          const inputsText = this.Container.find('input[type="text"]');
          inputsText.change(function () {
            if (_this.Ativo() && !_this.Parametros.Validar(true)) {
              _this.Ativo(false);
            }
          });
          inputsText.blur(function () {
            const inputText = $(this);
            const valor = _this.Instancia.Geral.NumericoTexto(
              inputText.val(),
              0
            );
            inputText.val(valor);
          });
          inputsText.blur();
        };

        this.OnAjaxRequest = function (request) {
          if (request.game !== "dice") {
            return;
          }
          if (!_this.Ativo()) {
            return;
          }

          const valorMinimo = "0.00000001";

          if (
            _this.Dados.rodadas < _this.Parametros.ValorEspera() ||
            _this.Dados.sequenciaPerdendo < _this.Parametros.ValorSequencias()
          ) {
            request.betAmount = valorMinimo;

            if (
              !_this.Dados.rodadasRealizadas &&
              _this.Dados.rodadas == _this.Parametros.ValorEspera()
            ) {
              _this.Dados.rodadasRealizadas = true;
              _this.Dados.sequenciaVencendo = 0;
              _this.Dados.sequenciaPerdendo = 0;
              _this.Dados.tentativas = 0;
            }
          } else {
            if (_this.Dados.tentativas >= _this.Parametros.ValorTentativas()) {
              request.betAmount = valorMinimo;
            }
            _this.Dados.tentativas++;
          }

          _this.Dados.rodadas++;

          return true;
        };

        this.OnAjaxResponse = function (response, request) {
          if (request.game !== "dice") {
            return;
          }
          if (!response.result) {
            return;
          }
          if (!_this.Ativo()) {
            return;
          }

          if (
            _this.Dados.sequenciaPerdendo > 0 &&
            response.gameResult === "win"
          ) {
            _this.Sequencias.Registrar(_this.Dados.sequenciaPerdendo);
          }

          if (
            response.gameResult === "win" &&
            parseFloat(request.betAmount) > 0.00000001
          ) {
            _this.Venceu(
              _this.Dados.sequenciaPerdendo,
              _this.Dados.tentativas - 1,
              _this.Instancia.Geral.Numerico(request.betAmount),
              _this.Instancia.Geral.Numerico(response.profit)
            );
          }

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
          _this.Dados.tentativas =
            response.gameResult === "win" ? 0 : _this.Dados.tentativas;

          _this.IndicarPerda(
            _this.Dados.sequenciaPerdendo > 0,
            parseFloat(request.betAmount) > 0.00000001
          );
        };

        this.Venceu = function (sequencia, tentativas, aposta, lucro) {
          if (sequencia === false) {
            _this.Instancia.Objetos.DivBotPlusChanceUltimaVencida.html(
              '<span class="vazio">Nenhuma vez ainda.</span>'
            );
          } else {
            const apostaFinal = aposta + (aposta + tentativas);
            const lucroFinal = lucro - apostaFinal;
            const html = _this.Instancia.Geral.FormatarString(
              "<span>Depois de {0} sequ&ecirc;ncia(s) perdendo, {1} tentativa(s) sem sucesso, apostou {2} e {5} {3} &agrave;s {4}.</span> ",
              sequencia,
              tentativas,
              _this.Instancia.Geral.NumericoTexto(apostaFinal),
              _this.Instancia.Geral.NumericoTexto(lucroFinal),
              _this.Instancia.Geral.FormatarData(new Date(), "d/M/y h:m:s"),
              lucroFinal >= 0 ? "ganhou" : "perdeu"
            );
            _this.Instancia.Objetos.DivBotPlusChanceUltimaVencida.find(
              ".vazio"
            ).remove();
            _this.Instancia.Objetos.DivBotPlusChanceUltimaVencida.prepend(html);
          }
        };

        this.Sequencias = {
          Reiniciar: function () {
            _this.Venceu(false);
            _this.Instancia.Objetos.DivBotPlusChanceFrequentesGrafico.html(
              "Nenhuma sequ&ecirc;ncia definida ainda."
            );
            _this.Sequencias.Contagem = 0;
            _this.Dados.rodadasRealizadas = false;
          },

          Registrar: function (sequencia) {
            if (
              !_this.Instancia.Objetos.DivBotPlusChanceFrequentesGrafico.find(
                "div"
              ).length
            ) {
              _this.Instancia.Objetos.DivBotPlusChanceFrequentesGrafico.html(
                ""
              );
            }
            let divSequencia =
              _this.Instancia.Objetos.DivBotPlusChanceFrequentesGrafico.find(
                "div.seq" + sequencia
              );
            if (!divSequencia.length) {
              let htmlSequencias = "";
              let i = 0;
              while (
                _this.Instancia.Objetos.DivBotPlusChanceFrequentesGrafico.find(
                  "div.seq" + (i + 1)
                ).length
              ) {
                i++;
              }
              for (i = i; i < sequencia; i++) {
                htmlSequencias +=
                  '<div class="seq seq' +
                  (i + 1) +
                  '"><span class="key">' +
                  (i + 1) +
                  '</span> <span class="value">0</span> <span class="value-percent">0%</span> <span class="percentual"><span class="barra">&nbsp;<span class="momento"></span></span></span></div>';
              }
              _this.Instancia.Objetos.DivBotPlusChanceFrequentesGrafico.append(
                htmlSequencias
              );
              divSequencia =
                _this.Instancia.Objetos.DivBotPlusChanceFrequentesGrafico.find(
                  "div.seq" + sequencia
                );
            }
            const contagemSequencia =
              parseInt(divSequencia.find(".value").html()) + 1;
            divSequencia.find(".value").html(contagemSequencia);
            divSequencia
              .find(".momento")
              .html(
                _this.Instancia.Geral.FormatarData(new Date(), "d/M/y h:m:s")
              );
            _this.Sequencias.Contagem++;

            const listaValores =
              _this.Instancia.Objetos.DivBotPlusChanceFrequentesGrafico.find(
                ".value"
              );
            for (var i = 0; i < listaValores.length; i++) {
              const valorAtual = parseInt(listaValores[i].innerText);
              const percentual = (valorAtual / _this.Sequencias.Contagem) * 100;
              const percentualTexto = percentual.toFixed(2) + "%";

              const spanContainer = $(listaValores[i]).parent();
              const spanPercentualValue = spanContainer.find(".value-percent");
              const spanPercentualGrafico =
                spanContainer.find(".percentual .barra");
              spanPercentualValue.html(percentualTexto);
              spanPercentualGrafico.css("width", percentualTexto);
              if (percentual) {
                spanPercentualGrafico.attr("ocorrido", true);
              }
            }
          },

          Contagem: 0,
        };

        this.IndicarPerda = function (incrementarPerda, aposta) {
          if (incrementarPerda === null) {
            _this.Sequencias.Reiniciar();
            _this.Instancia.Objetos.DivBotPlusChanceFrequentes.hide();
            _this.Instancia.Objetos.DivBotPlusChanceIndicadores.hide();
            _this.Instancia.Objetos.DivBotPlusChanceIndicadores.find(
              ".info span.contagem, .info span.total"
            ).html("0");
            _this.Instancia.Objetos.DivBotPlusChanceIndicadores.find(
              ".indicador"
            ).remove();
            _this.Dados.tentativas = 0;
            _this.Dados.rodadas = 0;
            _this.Dados.sequenciaVencendo = 0;
            _this.Dados.sequenciaPerdendo = 0;
            _this.Dados.maiorSequenciaVencendo = 0;
            _this.Dados.maiorSequenciaPerdendo = 0;
          } else {
            _this.Instancia.Objetos.DivBotPlusChanceFrequentes.show();
            _this.Instancia.Objetos.DivBotPlusChanceIndicadores.show();
            _this.Instancia.Objetos.DivBotPlusChanceIndicadores.find(
              ".info span.total"
            ).html(_this.Dados.maiorSequenciaPerdendo);
            if (!incrementarPerda) {
              _this.Instancia.Objetos.DivBotPlusChanceIndicadores.find(
                ".indicador.atual"
              )
                .removeClass("aposta")
                .removeClass("atual");
              _this.Instancia.Objetos.DivBotPlusChanceIndicadores.find(
                ".info span.contagem"
              ).html(0);
            } else {
              _this.Instancia.Objetos.DivBotPlusChanceIndicadores.find(
                ".info span.contagem"
              ).html(
                parseInt(
                  _this.Instancia.Objetos.DivBotPlusChanceIndicadores.find(
                    ".info span.contagem"
                  ).html()
                ) + 1
              );
              const listaIndicador =
                _this.Instancia.Objetos.DivBotPlusChanceIndicadores.find(
                  ".indicador"
                );
              for (let i = 0; i < listaIndicador.length; i++) {
                const jIndicador = $(listaIndicador[i]);
                if (!jIndicador.hasClass("atual")) {
                  jIndicador.addClass("atual " + (aposta ? "aposta" : ""));
                  return;
                }
              }
              _this.Instancia.Objetos.DivBotPlusChanceIndicadores.append(
                '<div class="indicador atual ' +
                  (aposta ? "aposta" : "") +
                  '"></div>'
              );
            }
          }
        };

        this.Ativo = function (modo) {
          const cssClass = "grey";

          if (modo !== undefined) {
            if (modo) {
              _this.Instancia.Objetos.BtnBotPlusChanceDesativar.addClass(
                cssClass
              );
              _this.Instancia.Objetos.BtnBotPlusChanceAtivar.removeClass(
                cssClass
              );
              _this.Instancia.Objetos.DivBotPlusChanceEstado.addClass(
                "ativado"
              ).html("Ativado");
            } else {
              _this.Instancia.Objetos.BtnBotPlusChanceDesativar.removeClass(
                cssClass
              );
              _this.Instancia.Objetos.BtnBotPlusChanceAtivar.addClass(cssClass);
              _this.Instancia.Objetos.DivBotPlusChanceEstado.removeClass(
                "ativado"
              ).html("Desativado");
              _this.Instancia.LuckygamesIo.PararApostas();
              _this.IndicarPerda(null);
            }
            if (_this.Instancia.Objetos.JanelaModal.isOpen) {
              _this.Instancia.Geral.Toast(
                _this.Instancia.Geral.FormatarString(
                  "O {0} foi {1}.",
                  _this.Titulo,
                  modo ? "ativado" : "desativado"
                )
              );
            }
          }

          return _this.Instancia.Objetos.DivBotPlusChanceEstado.hasClass(
            "ativado"
          );
        };

        this.Dados = {
          tentativas: 0,
          rodadas: 0,
          sequenciaPerdendo: 0,
          sequenciaVencendo: 0,
          maiorSequenciaVencendo: 0,
          maiorSequenciaPerdendo: 0,
          rodadasRealizadas: false,
        };

        this.Parametros = {
          Validar: function (exibirAlerta) {
            const result =
              _this.Parametros.ValorEspera() >= 0 &&
              _this.Parametros.ValorSequencias() >= 0 &&
              _this.Parametros.ValorTentativas() >= 0;

            if (!result && exibirAlerta) {
              if (_this.Instancia.Objetos.JanelaModal.isOpen) {
                _this.Instancia.Geral.Toast(
                  "error",
                  _this.Instancia.Geral.FormatarString(
                    "O {0} tem um ou mais par&acirc;metros inv&aacute;lidos.",
                    _this.Titulo
                  )
                );
              }
            }
            return result;
          },

          ValorEspera: function () {
            return _this.Instancia.Geral.Numerico(
              _this.Container.find(".espera input").val(),
              -1
            );
          },

          ValorSequencias: function () {
            return _this.Instancia.Geral.Numerico(
              _this.Container.find(".sequencias input").val(),
              -1
            );
          },

          ValorTentativas: function () {
            return _this.Instancia.Geral.Numerico(
              _this.Container.find(".tentativas input").val(),
              -1
            );
          },
        };
      })(this.Instancia),

      new (function (instancia) {
        this.Instancia = instancia;
        const _this = this;

        this.Titulo = "BOT StepUp";

        this.Container;

        this.Css = `
                    :host table td {
                        font-size: 13px;
                        vertical-align: middle;
                        text-align: right;
                        padding: 1px 5px;
                    }
                    :host table td:first-child {
                        position: relative;
                        top: -2px;
                    }
                    :host table td:last-child {
                        text-align: left;
                        padding-left: 2px;
                        width: 50%;
                        white-space: nowrap;
                    }
                    :host table td input[type="text"] {
                        text-align: center;
                        width: 100%;
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
                    :host .estado {
                        display: inline-block;
                        padding: 0 15px;
                        font-size: 18px;
                        position: relative;
                        top: 1px;
                        font-weight: bold;
                        color: darkgrey;
                    }
                    :host .estado.ativado {
                        color: darkcyan;
                    }
                `;

        this.Html = this.Instancia.Geral.FormatarString(`
                        <span class="info">
                            Este BOT usa um m&eacute;todo de apostas que sempre ganha,
                            desde que voc&ecirc; tenha recursos para apostar. Ou seja,
                            Use valores baixos porque do contr&aacute;rio vai zerar seu saldo.
                        </span>
                        <table>
                            <tr class="prediction">
                                <td>Valor do Prediction, entre 0 e 98</td>
                                <td><input type="text" value="81" data-digitos="0" /></td>
                            </tr>
                            <tr><td colspan="4"><div class='divisor'>&nbsp;</div></td></tr>
                            <tr class="aposta">
                                <td>Fazer da aposta inicial quantos porcento do saldo atual. Deixe em branco para usar o menor valor de 0,00000001</td>
                                <td><input type="text" value="0,00200000" />%</td>
                            </tr>
                            <tr><td colspan="4"><div class='divisor'>&nbsp;</div></td></tr>
                            <tr class="alvo">
                                <td>Percentual de ganho em rela&ccedil;&atilde;o ao saldo atual para cada rodada</td>
                                <td><input type="text" value="0,001" />%</td>
                            </tr>
                            <tr><td colspan="4"><div class='divisor'>&nbsp;</div></td></tr>
                            <tr class="incrementoAoPerder">
                                <td>Aumenta a aposta em quantos porcento após <u>perder</u>. Entre 0% e 9999%</td>
                                <td><input type="text" value="0" data-digitos="0" />%</td>
                            </tr>
                            <tr><td colspan="4"><div class='divisor'>&nbsp;</div></td></tr>
                            <tr class="incrementoAoVencer">
                                <td>Aumenta a aposta em quantos porcento após <u>vencer</u>. Entre 0% e 9999%</td>
                                <td><input type="text" value="100" data-digitos="0" />%</td>
                            </tr>
                            <tr><td colspan="4"><div class='divisor'>&nbsp;</div></td></tr>
                            <tr class="perda">
                                <td>Percentual de perda em relação ao saldo atual</td>
                                <td><input type="text" value="20" data-digitos="1" />%</td>
                            </tr>
                            <tr><td colspan="4"><div class='divisor'>&nbsp;</div></td></tr>
                        </table>
                        <span class="info">
                            Clica em Come&ccedil;ar vai iniciar as apostas imediatamente.
                        </span>
                        <button class="desativar btn">Parar</button>
                        <button class="ativar btn">Come&ccedil;ar</button>
                        <div class="estado"></div>
                    `);

        this.Js = function () {
          _this.Instancia.Objetos.BtnStepUpEstado =
            _this.Container.find(".estado");

          _this.Instancia.Objetos.BtnStepUpAtivar =
            _this.Container.find(".ativar");
          _this.Instancia.Objetos.BtnStepUpAtivar.click(function () {
            if (_this.Ativo()) {
              return;
            }

            if (!_this.Parametros.Validar(true)) {
              return;
            }

            _this.Ativo(true);
          });

          _this.Instancia.Objetos.BtnStepUpDesativar =
            _this.Container.find(".desativar");
          _this.Instancia.Objetos.BtnStepUpDesativar.click(function () {
            if (!_this.Ativo()) {
              return;
            }

            _this.Ativo(false);
          });

          _this.Ativo(false);

          const inputsText = this.Container.find('input[type="text"]');
          inputsText.change(function () {
            if (_this.Ativo() && !_this.Parametros.Validar(true)) {
              _this.Ativo(false);
            }
          });
          inputsText.blur(function () {
            const inputText = $(this);

            let digitosDecimais = parseInt(inputText.attr("data-digitos"));
            digitosDecimais = isFinite(digitosDecimais)
              ? digitosDecimais
              : undefined;

            const valor = _this.Instancia.Geral.NumericoTexto(
              inputText.val(),
              digitosDecimais
            );
            inputText.val(valor);
          });
          inputsText.blur();
        };

        this.Comecado = false;
        this.EmExecucao = false;
        this.Comecar = function (modo) {
          _this.Comecado = !!modo;
          if (!_this.Comecado) {
            _this.Instancia.LuckygamesIo.PararApostas();
            return;
          }

          const tempo = 1000;
          const etapas = [
            function AbrirJanelaDeApostaAutomatica(index) {
              return new Promise(function (resolve, reject) {
                if (!_this.Comecado) {
                  resolve();
                  return;
                }

                $(".betContainer .btn.popup-show").click();

                if (index < etapas.length - 1) {
                  setTimeout(function () {
                    etapas[index + 1](index + 1).then(resolve);
                  }, tempo);
                } else {
                  resolve();
                }
              });
            },
            function DefinirParametros(index) {
              return new Promise(function (resolve, reject) {
                if (!_this.Comecado) {
                  resolve();
                  return;
                }

                const prediction = _this.Parametros.ValorPrediction();
                const saldoAtual = _this.Instancia.Geral.Numerico(
                  $("#balance").val()
                );
                const alvoPercentual = _this.Parametros.ValorAlvo();
                const alvoSaldo =
                  saldoAtual + saldoAtual * (alvoPercentual / 100);
                const incrementoAoPerder =
                  _this.Parametros.ValorIncrementoAoPerder();
                const incrementoAoVencer =
                  _this.Parametros.ValorIncrementoAoVencer();
                const perdaPercentual = _this.Parametros.ValorPerda();
                const apostaPercentual = _this.Parametros.ValorAposta();

                let aposta = saldoAtual * (apostaPercentual / 100);
                aposta = aposta < 0.00000001 ? 0.00000001 : aposta;

                const perda = saldoAtual - saldoAtual * (perdaPercentual / 100);

                $("#prediction").val(prediction);
                $("#betAmount").val(aposta);

                $('select[name="on-loss-term"]').val(2);
                $('input[name="on-loss-bets"]').val("1");
                $(".radioBox.left.clearfix > ul li:nth-child(2) ins").click();
                $('input[name="on-loss-inc"]').val(
                  incrementoAoPerder.toFixed(0)
                );
                $('select[name="on-win-term"]').val(2);
                $('input[name="on-win-bets"]').val("1");
                $(".radioBox.right.clearfix > ul li:nth-child(2) ins").click();
                $('input[name="on-win-inc"]').val(
                  incrementoAoVencer.toFixed(0)
                );
                $('input[name="acceleration"]').val("3");
                $('input[name="bets-limit"]').val("");
                $('input[name="balance-under-limit"]').val(perda.toFixed(8));
                $('input[name="balance-over-limit"]').val(alvoSaldo.toFixed(8));
                $('input[name="bet-over-limit"]').val("");

                if (index < etapas.length - 1) {
                  setTimeout(function () {
                    etapas[index + 1](index + 1).then(resolve);
                  }, tempo);
                } else {
                  resolve();
                }
              });
            },
            function Rodar(index) {
              return new Promise(function (resolve, reject) {
                if (!_this.Comecado) {
                  resolve();
                  return;
                }

                $('button[onclick*="startAutoplay"]').click();

                const checkFinal = function () {
                  if (Game.autoPlayFlag) {
                    setTimeout(checkFinal, 500);
                    return;
                  }

                  if (index < etapas.length - 1) {
                    setTimeout(function () {
                      etapas[index + 1](index + 1).then(resolve);
                    }, tempo);
                  } else {
                    resolve();
                  }
                };
                checkFinal();
              });
            },
          ];

          if (!_this.EmExecucao) {
            _this.EmExecucao = true;
            etapas[0](0).then(function () {
              _this.EmExecucao = false;
              if (_this.Comecado) {
                _this.Comecar(true);
              }
            });
          }
        };

        this.OnAjaxRequest = null;

        this.OnAjaxResponse = null;

        this.Ativo = function (modo) {
          const cssClass = "grey";

          if (modo !== undefined) {
            if (modo) {
              _this.Instancia.Objetos.BtnStepUpDesativar.addClass(cssClass);
              _this.Instancia.Objetos.BtnStepUpAtivar.removeClass(cssClass);
              _this.Instancia.Objetos.BtnStepUpEstado.addClass("ativado").html(
                "Ativado"
              );
              _this.Comecar(true);
            } else {
              _this.Instancia.Objetos.BtnStepUpDesativar.removeClass(cssClass);
              _this.Instancia.Objetos.BtnStepUpAtivar.addClass(cssClass);
              _this.Instancia.Objetos.BtnStepUpEstado.removeClass(
                "ativado"
              ).html("Desativado");
              _this.Comecar(false);
            }
            if (_this.Instancia.Objetos.JanelaModal.isOpen) {
              _this.Instancia.Geral.Toast(
                _this.Instancia.Geral.FormatarString(
                  "O {0} foi {1}.",
                  _this.Titulo,
                  modo ? "ativado" : "desativado"
                )
              );
            }
          }

          return _this.Instancia.Objetos.BtnStepUpEstado.hasClass("ativado");
        };

        this.Parametros = {
          Validar: function (exibirAlerta) {
            const prediction = _this.Parametros.ValorPrediction();
            const incrementoAoPerder =
              _this.Parametros.ValorIncrementoAoPerder();
            const incrementoAoVencer =
              _this.Parametros.ValorIncrementoAoVencer();

            const result =
              prediction >= 0 &&
              prediction <= 98 &&
              _this.Parametros.ValorAlvo() > 0 &&
              _this.Parametros.ValorAposta() >= 0 &&
              _this.Parametros.ValorPerda() >= 0 &&
              incrementoAoPerder >= 0 &&
              incrementoAoPerder <= 9999 &&
              incrementoAoVencer >= 0 &&
              incrementoAoVencer <= 9999;

            if (!result && exibirAlerta) {
              if (_this.Instancia.Objetos.JanelaModal.isOpen) {
                _this.Instancia.Geral.Toast(
                  "error",
                  _this.Instancia.Geral.FormatarString(
                    "O {0} tem um ou mais par&acirc;metros inv&aacute;lidos.",
                    _this.Titulo
                  )
                );
              }
            }
            return result;
          },

          ValorPrediction: function () {
            return _this.Instancia.Geral.Numerico(
              _this.Container.find(".prediction input").val(),
              -1
            );
          },

          ValorAlvo: function () {
            return _this.Instancia.Geral.Numerico(
              _this.Container.find(".alvo input").val(),
              -1
            );
          },

          ValorIncrementoAoPerder: function () {
            return _this.Instancia.Geral.Numerico(
              _this.Container.find(".incrementoAoPerder input").val(),
              -1
            );
          },

          ValorIncrementoAoVencer: function () {
            return _this.Instancia.Geral.Numerico(
              _this.Container.find(".incrementoAoVencer input").val(),
              -1
            );
          },

          ValorAposta: function () {
            return _this.Instancia.Geral.Numerico(
              _this.Container.find(".aposta input").val(),
              0
            );
          },

          ValorPerda: function () {
            return _this.Instancia.Geral.Numerico(
              _this.Container.find(".perda input").val(),
              0
            );
          },
        };
      })(this.Instancia),
    ];
  })(this);

  this.Instancia.Inicializar();

  return this;
})();
