window.Glasgow = new (function () {
  if (window.Glasgow) {
    console.logg("Inicializacao cancelada porque ja foi feita anteriormente.");
    return window.Glasgow;
  }

  const Instancia = this;

  Instancia.Definicoes = {
    Nome: "Glasgow",
    Contato: "https://glasgow.splitz.com.br/",
    CssClass: "glasgow",
    Debug: false,
    DigitosDecimais: 8,
    SeparadorDecimal: ",",
  };

  Instancia.Modulos = {};

  Instancia.Objetos = {};

  Instancia.Inicializar = () => {
    Instancia.Geral.PrepararAmbiente();

    Instancia.LuckygamesIo.EsperarAmbiente().then(() => {
      Instancia.Geral.CarregarBibliotecas([
        "https://www.googletagmanager.com/gtag/js?id=UA-101018897-6",
        "https://fonts.googleapis.com/css?family=Bangers|Bowlby+One+SC|Titillium+Web|Cousine",
        "https://cdnjs.cloudflare.com/ajax/libs/bowser/1.9.3/bowser.min.js",
        "https://cdnjs.cloudflare.com/ajax/libs/jBox/0.4.9/jBox.min.css",
        "https://cdnjs.cloudflare.com/ajax/libs/jBox/0.4.9/jBox.min.js",
        "https://cdnjs.cloudflare.com/ajax/libs/jquery-toast-plugin/1.3.2/jquery.toast.min.css",
        "https://cdnjs.cloudflare.com/ajax/libs/jquery-toast-plugin/1.3.2/jquery.toast.min.js",
      ]).then(() => {
        Instancia.Api.ContabilizarAcesso();
        Instancia.Layout.Carregar();
      });
    });
  };

  Instancia.Api = {
    Url: (comando) => {
      return "https://glasgow.splitz.com.br/exec/" + comando + "/";
    },

    CarregarLicencas: (email) => {
      if (email === undefined) {
        email = Instancia.Api.EmailLicenciado();
      }
      return new Promise((resolve, reject) => {
        Instancia.Api.Comando("Licenca/Listar", {
          data: {
            id: Instancia.Api.Identificador(),
            email: email,
          },
        }).then((data) => {
          console.logg("Carregando licencas de: " + (email ? email : ""), data);
          resolve(
            data.sucesso && data.response.resultado
              ? data.response.resultado.scripts
              : null
          );
          if (data.sucesso && data.response.resultado) {
            if (data.response.resultado.mensagem) {
              Instancia.Geral.Toast(data.response.resultado.mensagem, "info");
            }
            if (data.response.resultado.licenca) {
              Instancia.Api.EmailLicenciado(data.response.resultado.licenca);
              Instancia.Layout.SolicitarLicenca(false);
            }
          }
        });
      });
    },

    EmailLicenciado: (valor) => {
      return Instancia.Geral.Cache("glasgow-licenca", valor);
    },

    Identificador: (valor) => {
      return Instancia.Geral.Cache("glasgow-id", valor);
    },

    Comando: (comando, dados) => {
      return new Promise((resolve, reject) => {
        dados = $.extend(
          {
            url: Instancia.Api.Url(comando),
            type: "POST",
            dataType: "json",
            data: {},
            crossDomain: true,
            async: true,
          },
          dados
        );

        $.ajax(dados)
          .done(function (response) {
            resolve({ sucesso: true, response: response });
          })
          .fail(function () {
            resolve({ sucesso: false, response: null });
          });
      });
    },

    ContabilizarAcesso: () => {
      let localizacao = null;
      $.ajax({
        url: "https://ipinfo.io",
        type: "GET",
        dataType: "jsonp",
        crossDomain: true,
        async: true,
      })
        .done((response) => {
          console.logg("Obtido localizacao.", response);
          localizacao = response;
        })
        .always(() => {
          console.logg("Contabilizando acesso em Glasgow e Firebase.");
          Instancia.Api.Comando("Acesso/Registrar", {
            data: {
              id: Instancia.Api.Identificador(),
              provedor: !localizacao ? "" : localizacao.org,
              latlng: !localizacao ? "" : localizacao.loc,
              regiao: !localizacao
                ? ""
                : localizacao.city +
                  ", " +
                  localizacao.region +
                  ", " +
                  localizacao.country,
              idioma: navigator.language,
              navegador: bowser.name + " " + bowser.version,
              plataforma: bowser.osname + " " + bowser.osversion,
            },
          }).then((data) => {
            console.logg("Acesso contabilizado em Glasgow.", data);
            if (data.sucesso && data.response.resultado) {
              Instancia.Api.Identificador(
                data.response.resultado.identificador
              );
            }
          });

          window.dataLayer = window.dataLayer || [];
          function gtag() {
            dataLayer.push(arguments);
          }
          gtag("js", new Date());
          gtag("config", "UA-101018897-6");
        });
    },
  };

  Instancia.InterceptadorAjax = {
    Implementar: () => {
      if (XMLHttpRequest.prototype.send$bkp) {
        return;
      }
      XMLHttpRequest.prototype.send$bkp = XMLHttpRequest.prototype.send;
      XMLHttpRequest.prototype.send =
        Instancia.InterceptadorAjax.XMLHttpRequestSend;
    },

    XMLHttpRequestSend: function (queryString) {
      this.queryString = Instancia.Geral.QueryString(queryString, "json");

      let autorizado = true;
      for (const i in Instancia.InterceptadorAjax.ListaInterceptadores) {
        if (
          Instancia.InterceptadorAjax.ListaInterceptadores[i].modo !== "request"
        ) {
          continue;
        }
        autorizado &=
          Instancia.InterceptadorAjax.ListaInterceptadores[i].processar(
            this.queryString,
            this
          ) !== false;
        if (!autorizado) {
          break;
        }
      }

      if (autorizado) {
        this.addEventListener(
          "abort",
          Instancia.InterceptadorAjax.XMLHttpRequestResultado
        );
        this.addEventListener(
          "load",
          Instancia.InterceptadorAjax.XMLHttpRequestResultado
        );
        this.addEventListener(
          "error",
          Instancia.InterceptadorAjax.XMLHttpRequestResultado
        );
        this.addEventListener(
          "loadend",
          Instancia.InterceptadorAjax.XMLHttpRequestFinalizado
        );
        console.logg(
          "InterceptadorAjax",
          "evento:",
          "send",
          "queryString:",
          this.queryString,
          "xhr:",
          this
        );
        return this.send$bkp(
          Instancia.Geral.QueryString(this.queryString, "string")
        );
      }
    },

    XMLHttpRequestResultado: function (e) {
      e.currentTarget.resultado = e.type;
      console.logg("InterceptadorAjax", "evento:", e.type, "e:", e);
    },

    XMLHttpRequestFinalizado: function (e) {
      let response;
      try {
        response = JSON.parse(e.currentTarget.responseText);
      } catch (er) {
        response = e.currentTarget.responseText;
      }

      for (const i in Instancia.InterceptadorAjax.ListaInterceptadores) {
        if (
          Instancia.InterceptadorAjax.ListaInterceptadores[i].modo !==
          "response"
        ) {
          continue;
        }
        Instancia.InterceptadorAjax.ListaInterceptadores[i].processar(
          e.currentTarget.resultado,
          response,
          this.queryString,
          this
        );
      }
      console.logg(
        "InterceptadorAjax",
        "evento:",
        e.type,
        "response:",
        response,
        "e:",
        e
      );
    },

    ListaInterceptadores: [],

    Anexar: (id, modo, prioridade, fnc) => {
      const filter = Instancia.InterceptadorAjax.ListaInterceptadores.filter(
        (val) => val.id === id && val.modo === modo
      );
      if (filter.length) {
        filter[0].prioridade = prioridade;
        filter[0].processar = fnc;
      } else {
        Instancia.InterceptadorAjax.ListaInterceptadores.push({
          id: id,
          modo: modo,
          prioridade: prioridade,
          processar: fnc,
        });
      }
      Instancia.InterceptadorAjax.ListaInterceptadores.sort(
        (a, b) => a.prioridade - b.prioridade
      );
    },
  };

  Instancia.Geral = {
    PrepararAmbiente: () => {
      console.logg = Instancia.Definicoes.Debug ? console.log : () => {};

      String.prototype.replaceAll = function (search, replacement) {
        return this.replace(
          new RegExp(RegExp.escape(search), "g"),
          replacement
        );
      };

      RegExp.escape = (str) => {
        return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      };

      Date.prototype.formatado = function (formato) {
        if (typeof formato !== "string") {
          formato = "{dia}/{mes}/{ano} {hora}:{minuto}:{segundo}";
        } else {
          switch (formato) {
            case "corrido":
              formato = "{dias} {hora}:{minuto}:{segundo}";
              break;
          }
        }
        const data = this.toISOString();
        const ano = data.substr(0, 4);
        const mes = data.substr(5, 2);
        const dia = data.substr(8, 2);
        const hor = data.substr(11, 2);
        const min = data.substr(14, 2);
        const seg = data.substr(17, 2);
        const mil = data.substr(20, 3);
        let dias = "0";
        if (formato.indexOf("{dias}") >= 0) {
          dias =
            (new Date(ano + "-" + mes + "-" + dia) - new Date("1970-01-01")) /
            1000 /
            60 /
            60 /
            24;
          if (dias === 0) {
            dias = "";
          } else if (Math.abs(dias) === 1) {
            dias = dias + " dia";
          } else {
            dias = dias + " dias";
          }
        }
        return formato
          .replaceAll("{ano}", ano)
          .replaceAll("{mes}", mes)
          .replaceAll("{dia}", dia)
          .replaceAll("{dias}", dias)
          .replaceAll("{hora}", hor)
          .replaceAll("{minuto}", min)
          .replaceAll("{segundo}", seg)
          .replaceAll("{milisegundo}", mil)
          .trim();
      };

      Number.prototype.formatado = function (dados) {
        if (typeof dados !== "object") {
          dados = {};
        }
        if (typeof dados.digitos !== "number" || dados.digitos < 0) {
          dados.digitos = Instancia.Definicoes.DigitosDecimais;
        }
        if (
          typeof dados.separador !== "string" ||
          dados.separador.length != 1
        ) {
          dados.separador = Instancia.Definicoes.SeparadorDecimal;
        }
        if (typeof dados.sufixo !== "string") {
          dados.sufixo = "";
        }

        let result = this.toFixed(dados.digitos);
        if (dados.separador !== ".") {
          result = result.replace(".", dados.separador);
        }
        if (dados.sinal && this >= 0) {
          result = "+" + result;
        }
        return result + dados.sufixo;
      };
    },

    toastUltimo: null,
    Toast: (text, icon) => {
      if (Instancia.Geral.toastUltimo === text) {
        return;
      }
      Instancia.Geral.toastUltimo = text;
      setTimeout(() => {
        Instancia.Geral.toastUltimo = null;
      }, 4500);

      jQuery.toast({
        loader: false,
        hideAfter: 5000,
        allowToastClose: false,
        text: text,
        icon: icon,
      });
    },

    Cache: (key, valor) => {
      if (valor !== undefined) {
        if (valor !== null) {
          localStorage.setItem(key, valor);
        } else {
          localStorage.removeItem(key);
        }
      }
      const result = localStorage.getItem(key);
      return result === null ? "" : result;
    },

    QueryString: (queryString, modo) => {
      if (queryString === null) {
        return null;
      }
      switch (modo) {
        case "json":
          return queryString.split("&").reduce((a, v) => {
            const par = v.split("=");
            if (par[0]) {
              a[par[0]] = par[1];
            }
            return a;
          }, {});
        case "string":
          return Object.keys(queryString)
            .reduce((a, v) => {
              return a + "&" + v + "=" + queryString[v];
            }, "")
            .substr(1);
      }
    },

    CarregarScript: (src, onLoad) => {
      const element = document.createElement("SCRIPT");
      element.type = "text/javascript";
      element.src = src;
      element.onload = onLoad;
      document.getElementsByTagName("head")[0].appendChild(element);
    },

    CarregarStylesheet: (href, onLoad) => {
      const element = document.createElement("link");
      element.rel = "stylesheet";
      element.type = "text/css";
      element.href = href;
      element.media = "all";
      element.onload = onLoad;
      document.getElementsByTagName("head")[0].appendChild(element);
    },

    CarregarStylesheetCode: (code) => {
      const element = document.createElement("style");
      element.innerHTML = code;
      document.getElementsByTagName("head")[0].appendChild(element);
    },

    CarregarBibliotecas: (bibliotecas) => {
      return new Promise((resolve, reject) => {
        const fCarregar = (bibliotecas, index) => {
          if (index < bibliotecas.length) {
            const fCarregarUrl =
              bibliotecas[index].indexOf(".js") >= 0 ||
              bibliotecas[index].indexOf("/js") >= 0
                ? Instancia.Geral.CarregarScript
                : Instancia.Geral.CarregarStylesheet;
            console.logg("Carregando biblioteca", bibliotecas[index]);
            fCarregarUrl(bibliotecas[index], () => {
              fCarregar(bibliotecas, ++index);
            });
          } else {
            resolve();
          }
        };
        fCarregar(bibliotecas, 0);
      });
    },

    FormatarString: function (msg) {
      if (arguments.length < 2) {
        return msg;
      }

      msg = String(msg);
      for (let i = 1; i < arguments.length; i++) {
        msg = msg.replaceAll("{" + (i - 1) + "}", String(arguments[i]));
      }
      return msg;
    },

    InputNumber: (selector) => {
      const objs = $(selector);
      objs.click(function (e) {
        if (!e.shiftKey && !e.ctrlKey && !e.altKey) {
          return;
        }

        const $inputText = $(this);
        const inputText = $inputText.get(0);

        if (e.altKey) {
          inputText.value = "";
          $inputText.blur();
        } else {
          let valor = inputText.number();
          if (valor === null) {
            const valorInicial = inputText.valor_inicial
              ? inputText.valor_inicial()
              : 1;
            inputText.number(valorInicial);
          } else {
            let novoValor;
            if (e.shiftKey) {
              novoValor = valor + valor * 0.1;
            } else {
              novoValor = valor - valor * 0.1;
            }
            inputText.number(novoValor);
            novoValor = inputText.number();
            if (valor === novoValor) {
              if (e.shiftKey) {
                novoValor = valor * 2;
              } else {
                novoValor = valor / 2;
              }
              inputText.number(novoValor);
            }
          }
        }
      });
      objs.blur(function () {
        let inputText = $(this);

        const data = {};

        data.padrao = parseFloat(
          String(inputText.attr("number-padrao")).replace(",", ".")
        );
        data.padrao = isFinite(data.padrao) ? data.padrao : "";

        data.digitos = parseInt(inputText.attr("number-digitos"));
        data.digitos = isFinite(data.digitos) ? data.digitos : undefined;

        data.min = parseFloat(
          String(inputText.attr("number-min")).replace(",", ".")
        );
        data.min = isFinite(data.min) ? data.min : undefined;

        data.max = parseFloat(
          String(inputText.attr("number-max")).replace(",", ".")
        );
        data.max = isFinite(data.max) ? data.max : undefined;

        data.valor = parseFloat(inputText.val().trim().replace(",", "."));
        data.valor = isFinite(data.valor) ? data.valor : data.padrao;

        if (typeof data.valor === "number") {
          if (data.min !== undefined && data.valor < data.min) {
            data.valor = data.min;
          } else if (data.max !== undefined && data.valor > data.max) {
            data.valor = data.max;
          }
          data.valor = data.valor.formatado({ digitos: data.digitos });
        }

        inputText.val(data.valor);

        inputText = inputText.get(0);
        inputText.valor = data.valor;
        inputText.valor_number = parseFloat(data.valor.replace(",", "."));
        if (typeof inputText.number === "undefined") {
          inputText.number = function (valor) {
            if (arguments.length) {
              inputText.value = valor;
              $(inputText).blur();
            }
            return isFinite(inputText.valor_number)
              ? inputText.valor_number
              : null;
          };
        }
      });
      objs.blur();

      objs.each((i, o) => {
        const cssClass = "c" + btoa(Math.random()).substr(5, 10);
        $(o).addClass(cssClass);
        $(o).attr(
          "title",
          "Clique com SHIFT para aumentar, com CTRL para diminuir e com ALT para redefinir."
        );
        new jBox("Tooltip", { attach: "." + cssClass, delayOpen: 800 });
      });
    },
  };

  Instancia.Layout = {
    Carregar: (email) => {
      return new Promise((resolve, reject) => {
        Instancia.Api.CarregarLicencas(email).then((licencas) => {
          Instancia.Layout.CarregarLicencas(licencas);
          resolve();
        });
      });
    },

    CarregarLicencas: (licencas) => {
      const jaCarregadoAnteriormente = !!Instancia.Objetos.$botaoAtivador;

      if (!jaCarregadoAnteriormente) {
        Instancia.Layout.Montar();
        Instancia.LuckygamesIo.Implementar();
        Instancia.InterceptadorAjax.Implementar();
        Instancia.Estatisticas.Implementar();
        console.logg("Finalizado carregamento da infraestrutura.");
      }

      if (Array.isArray(licencas) && licencas.length) {
        console.logg("Carregando modulos das licencas", licencas);
        Instancia.Geral.CarregarBibliotecas(licencas);
      } else if (!jaCarregadoAnteriormente) {
        Instancia.Layout.SolicitarLicenca();
      }
    },

    Montar: () => {
      Instancia.Geral.CarregarStylesheetCode(
        `
                .jq-toast-wrap { 
                    z-index: 10000000 !important; 
                }
                .jBox-Tooltip {
                    z-index: 10000001 !important; 
                }
                :host.btn, :host .btn {
                    width: auto;
                    padding: 0px 10px;
                    float: none;
                    font-size: 12px;
                    line-height: 25px;
                    position: relative;
                    top: -2px;
                }
                :host input[type="text"] {
                    font-family: 'Cousine', monospace;
                    font-size: 20px;
                    background-color: #f0f0f0;
                    border: 1px solid gainsboro;
                    width: 100%;
                }
                :host a {
                    color: darkgreen
                }
                :host a:hover {
                    color: forestgreen
                }
                :host label {
                    font-size: 16px;
                    white-space: nowrap;
                    padding: 0 2px;
                }
                :host .nice-select {
                    width: 100%;
                    padding: 3px 0 4px 0;
                }
                :host .nice-select .current {
                    padding: 0 10px;
                }
                :host .nice-select, 
                :host .nice-select .list,
                :host .nice-select .option {
                    background-color: #F0F0F0;
                    color: black;
                    border-color: silver;
                    margin: 0;
                    font-size: 15px;
                }
                :host .nice-select .option {
                    border-width: 0;
                    line-height: 29px;
                    min-height: 29px;
                }
                :host .nice-select .option:hover,
                :host .nice-select .option.selected.focus {
                    background-color: #999;
                }
                :host input[type="text"] {
                    text-align: center;
                }
                :host div.divisor {
                    border-bottom: 2px solid gainsboro;
                    margin: 2px 0;
                }
                :host article table {
                    margin: 10px 0;
                }
                :host .info, :host .info * {
                    text-align: justify;
                    color: lightseagreen;
                    margin: 0;
                    padding: 0;
                }
                :host .info ul {
                    padding: 5px 0 5px 20px;
                }
                :host .bg-ativo {
                    background-color: steelblue !important;
                    color: white !important;
                }
                :host .bg-alerta {
                    background-color: indianred !important;
                }
            `.replaceAll(":host", "." + Instancia.Definicoes.CssClass)
      );

      Instancia.Layout.BotaoAtivador();
      Instancia.Layout.Janela();
      Instancia.Layout.AdicionarSecao({
        css: `
                    :host > div {
                        background-image: url('https://glasgow.splitz.com.br/r2d2.jpg');
                        background-position: 20px 0;
                        background-repeat: no-repeat;
                        background-size: contain;
                        padding-left: 155px;
                        padding-left: 155px;
                        height: 100px;
                        border-bottom: 1px solid gainsboro
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

        html:
          Instancia.Geral.FormatarString("<div>") +
          Instancia.Geral.FormatarString(
            "<h1>{0}</h1>",
            Instancia.Definicoes.Nome
          ) +
          Instancia.Geral.FormatarString(
            "<h2>Seu ex&eacute;rcito de rob&ocirc;s que faz suas apostas valerem</h2>"
          ) +
          Instancia.Geral.FormatarString(
            '<div><a target="_blank" href="https://luckygames.io/">https://luckygames.io/</a></div>'
          ) +
          Instancia.Geral.FormatarString("</div>"),
      });
    },

    BotaoAtivador: () => {
      Instancia.Geral.CarregarStylesheetCode(
        `
                #ativador:host {
                    z-index: 2147483647;
                    position: fixed;
                    bottom: 10px;
                    right: 10px;
                    left: auto;
                    top: auto;
                    font-family: 'Bowlby One SC', cursive;
                    font-size: 20px;
                    padding: 5px 10px;
                }
            `.replaceAll(":host", "." + Instancia.Definicoes.CssClass)
      );
      $("body").append(
        Instancia.Geral.FormatarString(
          '<button id="ativador" class="{0} btn blue">{1}</button>',
          Instancia.Definicoes.CssClass,
          Instancia.Definicoes.Nome
        )
      );
      Instancia.Objetos.$botaoAtivador = $(
        "#ativador" + "." + Instancia.Definicoes.CssClass
      );
    },

    Janela: () => {
      Instancia.Geral.CarregarStylesheetCode(
        `
                body > #janela {
                    display: none;
                }
            `.replaceAll(":host", "." + Instancia.Definicoes.CssClass)
      );
      $("body").append(
        Instancia.Geral.FormatarString(
          '<div id="janela" class="{0}"></div>',
          Instancia.Definicoes.CssClass
        )
      );
      Instancia.Objetos.$janela = $("#janela." + Instancia.Definicoes.CssClass);
      Instancia.Objetos.$janelaModal = new jBox("Modal", {
        title: Instancia.Definicoes.Nome,
        content: Instancia.Objetos.$janela,
        attach: Instancia.Objetos.$botaoAtivador,
        width: 450,
        height: 400,
        maxHeight: window.innerHeight * 0.8,
        overlay: false,
        draggable: "title",
        repositionOnOpen: false,
        repositionOnContent: false,
        animation: "zoomIn", //animation: zoomIn, zoomOut, pulse, move, slide, flip, tada
        blockScroll: false,
      });
    },

    SolicitarLicenca: (modo) => {
      if ((modo === undefined || modo) && !Instancia.Objetos.$secaoLicenca) {
        Instancia.Layout.AdicionarSecao({
          css: `
                        em {
                            color: #307DAC;
                            font-style: normal;
                        }
                    `,

          html: `
                        <div>
                        <h1>Nenhum licença ativada</h1>
                        <p>Caso n&atilde;o tenha uma licen&ccedil;a, compre uma <a href="https://glasgow.splitz.com.br/" target="_blank">aqui</a>.</p>
                        <p>Se tiver, infome o e-mail de cadastro para ativ&aacute;-la.</p>
                        <p>Ou ainda, use o e-mail <em>glasgow@splitz.com.br</em> para acesso gratuito aos m&oacute;dulos b&aacute;sicos.</p>
                        <input type="text" placeholder="Qual o seu e-mail?" />
                        <button class="btn red">Ativar licen&ccedil;a</button>
                        </div>
                    `,

          js: (container) => {
            Instancia.Objetos.$secaoLicenca = container;

            let ativandoLicensa = false;

            container.find("button").click(() => {
              if (!ativandoLicensa) {
                ativandoLicensa = true;
                Instancia.Layout.Carregar(container.find("input").val()).then(
                  () => {
                    ativandoLicensa = false;
                  }
                );
              } else {
                Instancia.Geral.Toast(
                  "Uma tentativa de ativa&ccedil;&atilde;o est&aacute; em curso. Aguarde.",
                  "info"
                );
              }
            });
          },
        });
      } else if (Instancia.Objetos.$secaoLicenca) {
        if (modo) {
          Instancia.Objetos.$secaoLicenca.show();
        } else {
          Instancia.Objetos.$secaoLicenca.hide();
        }
      }
    },

    AdicionarSecao: (secao) => {
      if (typeof secao !== "object") {
        return;
      }

      if (!Instancia.Objetos.$janela.children().length) {
        Instancia.Objetos.$janela.append(
          Instancia.Geral.FormatarString(
            '<div class="secoes"></div><footer><a href="{0}" target="_blank">{0}</a></footer>',
            Instancia.Definicoes.Contato
          )
        );
        Instancia.Objetos.$janelaSecoes =
          Instancia.Objetos.$janela.find(".secoes");
        Instancia.Geral.CarregarStylesheetCode(
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
                `.replaceAll(":host", "." + Instancia.Definicoes.CssClass)
        );
      }

      const secaoId =
        "id" + Instancia.Objetos.$janelaSecoes.find("article").length + 1;

      Instancia.Geral.CarregarStylesheetCode(
        secao.css.replaceAll(
          ":host",
          "." + Instancia.Definicoes.CssClass + " article." + secaoId
        )
      );

      const titulo = secao.titulo
        ? Instancia.Geral.FormatarString("<h1>{0}</h1>", secao.titulo)
        : "";
      const html = Instancia.Geral.FormatarString(
        '{1}<article class="{0}">{2}</article>',
        secaoId,
        titulo,
        secao.html
      );

      Instancia.Objetos.$janelaSecoes.append(html);

      Instancia.Objetos.$janela.find(".secoes > h1:last").click(function () {
        $(this).next().slideToggle();
      });

      const container = Instancia.Objetos.$janela.find(
        ".secoes > article:last"
      );
      Instancia.Geral.InputNumber(container.find("input[number]"));
      container.find("*[title]").each((i, o) => {
        const delay = ["BUTTON", "INPUT"];
        const cssClass = "c" + btoa(Math.random()).substr(5, 10);
        $(o).addClass(cssClass);
        new jBox("Tooltip", {
          attach: "." + cssClass,
          delayOpen: delay.indexOf(o.tagName) < 0 ? 100 : 800,
        });
      });

      if (secao.js instanceof Function) {
        secao.js(container);
      }
    },
  };

  Instancia.LuckygamesIo = {
    EsperarAmbiente: () => {
      return new Promise((resolve, reject) => {
        const fAmbienteOk = () => {
          if (window.Game && window.Game.runDice && $("#balance").length) {
            console.logg("Ambiente Luckygames.io pronto para uso.");
            resolve();
          } else {
            console.logg("Esperando ambiente Luckygames.io estar pronto.");
            setTimeout(fAmbienteOk, 1000);
          }
        };
        fAmbienteOk();
      });
    },

    Implementar: () => {
      Instancia.LuckygamesIo.ReferenciarObjetos();
      Instancia.LuckygamesIo.CarregarValoresMultiplicadores();
    },

    ReferenciarObjetos: () => {
      Instancia.LuckygamesIo.Objetos.clientSeed = $("#clientSeed").get(0);
      Instancia.LuckygamesIo.Objetos.$rollOver = $("#rollOver");
      Instancia.LuckygamesIo.Objetos.prediction = $("#prediction").get(0);
      Instancia.LuckygamesIo.Objetos.balance = $("#balance").get(0);
      Instancia.LuckygamesIo.Objetos.betAmount = $("#betAmount").get(0);
      Instancia.LuckygamesIo.Objetos.profitOnWin = $("#profitOnWin").get(0);
    },

    ValoresMultiplicadores: "0"
      .repeat(98)
      .split("")
      .map((o, i) => parseInt(i) + 1)
      .reduce((a, c) => {
        a["_" + c] = 0;
        return a;
      }, {}),

    CarregarValoresMultiplicadores: () => {
      const bkp = {
        betAmount: Instancia.LuckygamesIo.Objetos.betAmount.value,
        prediction: Instancia.LuckygamesIo.Objetos.prediction.value,
      };
      Instancia.LuckygamesIo.Objetos.$rollOver.click();
      Instancia.LuckygamesIo.Objetos.betAmount.value = 1;
      Object.keys(Glasgow.LuckygamesIo.ValoresMultiplicadores).forEach(
        (o, i, a) => {
          Instancia.LuckygamesIo.Objetos.prediction.value = o.substr(1);
          Game.calculate();
          Glasgow.LuckygamesIo.ValoresMultiplicadores[o] = parseFloat(
            Instancia.LuckygamesIo.Objetos.profitOnWin.value
          );
        }
      );
      Instancia.LuckygamesIo.Objetos.betAmount.value = bkp.betAmount;
      Instancia.LuckygamesIo.Objetos.prediction.value = bkp.prediction;
      Game.calculate();
    },

    PararApostas: () => {
      Game.stopAutoplay();
      Game.playFlag = false;
    },

    Parametros: {
      ClientSeed: (valor) => {
        if (!Instancia.LuckygamesIo.Objetos.clientSeed) {
          return null;
        }
        if (valor !== undefined) {
          Instancia.LuckygamesIo.Objetos.clientSeed.value = valor;
        }
        return Instancia.LuckygamesIo.Objetos.clientSeed.value;
      },
      Balance: (valor) => {
        if (!Instancia.LuckygamesIo.Objetos.balance) {
          return null;
        }
        if (typeof valor === "number") {
          Instancia.LuckygamesIo.Objetos.balance.value = valor.toFixed(8);
        }
        return parseFloat(Instancia.LuckygamesIo.Objetos.balance.value);
      },
    },

    Objetos: {},
  };

  Instancia.Estatisticas = {
    Implementar: () => {
      setTimeout(Instancia.Estatisticas.Reiniciar, 500);
      Instancia.InterceptadorAjax.Anexar(
        "EstatisticasBase",
        "response",
        0,
        Instancia.Estatisticas.Contabilizar
      );
    },

    Parametros: {
      LimiteListaSaldoHistorico: 72000,
    },

    Contabilizar: (resultado, response, request) => {
      if (
        resultado !== "load" ||
        !request ||
        !response ||
        request.game !== "dice" ||
        !response.result
      ) {
        return;
      }

      const balance = parseFloat(response.balance);
      const profit = parseFloat(response.profit);
      const betAmount = parseFloat(request.betAmount);
      const resultNumber = parseFloat(response.resultNumber);

      Instancia.Estatisticas.Dados.tempoFinal = new Date();
      if (Instancia.Estatisticas.Dados.tempoInicio === null) {
        Instancia.Estatisticas.Dados.tempoInicio =
          Instancia.Estatisticas.Dados.tempoFinal;
      }

      Instancia.Estatisticas.Dados.saldoHistorico.push(balance);
      while (
        Instancia.Estatisticas.Dados.saldoHistorico.length >
        Instancia.Estatisticas.Parametros.LimiteListaSaldoHistorico
      ) {
        Instancia.Estatisticas.Dados.saldoHistorico.shift();
      }

      if (balance < Instancia.Estatisticas.Dados.saldoMenor) {
        Instancia.Estatisticas.Dados.saldoMenor = balance;
      }
      if (balance > Instancia.Estatisticas.Dados.saldoMaior) {
        Instancia.Estatisticas.Dados.saldoMaior = balance;
      }

      Instancia.Estatisticas.Dados.apostaQuantidade++;

      if (response.gameResult === "lose") {
        Instancia.Estatisticas.Dados.apostaQuantidadePerdida++;
        Instancia.Estatisticas.Dados.sequenciaPerdendo++;
        if (
          Instancia.Estatisticas.Dados.sequenciaPerdendo >
          Instancia.Estatisticas.Dados.sequenciaPerdendoMaxima
        ) {
          Instancia.Estatisticas.Dados.sequenciaPerdendoMaxima =
            Instancia.Estatisticas.Dados.sequenciaPerdendo;
        }
        if (Instancia.Estatisticas.Dados.sequenciaVencendo > 0) {
          if (
            Instancia.Estatisticas.Dados.sequenciaVencendoRecorrente[
              Instancia.Estatisticas.Dados.sequenciaVencendo - 1
            ] === undefined
          ) {
            Instancia.Estatisticas.Dados.sequenciaVencendoRecorrente[
              Instancia.Estatisticas.Dados.sequenciaVencendo - 1
            ] = 1;
          } else {
            Instancia.Estatisticas.Dados.sequenciaVencendoRecorrente[
              Instancia.Estatisticas.Dados.sequenciaVencendo - 1
            ]++;
          }
          Instancia.Estatisticas.Dados.sequenciaVencendo = 0;
        }
      }
      if (response.gameResult === "win") {
        Instancia.Estatisticas.Dados.apostaQuantidadeVencida++;
        Instancia.Estatisticas.Dados.sequenciaVencendo++;
        if (
          Instancia.Estatisticas.Dados.sequenciaVencendo >
          Instancia.Estatisticas.Dados.sequenciaVencendoMaxima
        ) {
          Instancia.Estatisticas.Dados.sequenciaVencendoMaxima =
            Instancia.Estatisticas.Dados.sequenciaVencendo;
        }
        if (Instancia.Estatisticas.Dados.sequenciaPerdendo > 0) {
          if (
            Instancia.Estatisticas.Dados.sequenciaPerdendoRecorrente[
              Instancia.Estatisticas.Dados.sequenciaPerdendo - 1
            ] === undefined
          ) {
            Instancia.Estatisticas.Dados.sequenciaPerdendoRecorrente[
              Instancia.Estatisticas.Dados.sequenciaPerdendo - 1
            ] = 1;
          } else {
            Instancia.Estatisticas.Dados.sequenciaPerdendoRecorrente[
              Instancia.Estatisticas.Dados.sequenciaPerdendo - 1
            ]++;
          }
          Instancia.Estatisticas.Dados.sequenciaPerdendo = 0;
        }
      }

      Instancia.Estatisticas.Dados.sequencias.push(
        response.gameResult === "win" ? 1 : -1
      );
      const limiteListaSequencias =
        10 +
        (Instancia.Estatisticas.Dados.sequenciaPerdendoMaxima +
          Instancia.Estatisticas.Dados.sequenciaVencendoMaxima);
      while (
        Instancia.Estatisticas.Dados.sequencias.length > 40 ||
        Instancia.Estatisticas.Dados.sequencias.length > limiteListaSequencias
      ) {
        Instancia.Estatisticas.Dados.sequencias.shift();
      }

      if (
        response.gameResult === "win" &&
        (Instancia.Estatisticas.Dados.apostaMelhores.length === 0 ||
          profit > Instancia.Estatisticas.Dados.apostaMelhores[0].profit)
      ) {
        Instancia.Estatisticas.Dados.apostaMelhores.push({
          id: response.id,
          betAmount: betAmount,
          profit: profit,
        });
        while (Instancia.Estatisticas.Dados.apostaMelhores.length > 10) {
          Instancia.Estatisticas.Dados.apostaMelhores.shift();
        }
        Instancia.Estatisticas.Dados.apostaMelhores.sort(
          (a, b) => a.profit - b.profit
        );
      }

      Instancia.Estatisticas.Dados.apostaLucro += profit;

      if (
        Instancia.Estatisticas.Dados.apostaMenor === null ||
        betAmount < Instancia.Estatisticas.Dados.apostaMenor
      ) {
        Instancia.Estatisticas.Dados.apostaMenor = betAmount;
      }
      if (
        Instancia.Estatisticas.Dados.apostaMaior === null ||
        betAmount > Instancia.Estatisticas.Dados.apostaMaior
      ) {
        Instancia.Estatisticas.Dados.apostaMaior = betAmount;
      }

      Instancia.Estatisticas.Dados.apostaUltima = betAmount;
      Instancia.Estatisticas.Dados.apostaTotal += betAmount;

      Instancia.Estatisticas.Dados.sorteados[resultNumber]++;
    },

    Reiniciar: () => {
      Instancia.Estatisticas.Dados.tempoInicio = null;
      Instancia.Estatisticas.Dados.tempoFinal = null;
      if (Instancia.Estatisticas.Dados.saldoHistorico === undefined) {
        Instancia.Estatisticas.Dados.saldoHistorico = [];
      } else {
        Instancia.Estatisticas.Dados.saldoHistorico.length = 0;
      }
      Instancia.Estatisticas.Dados.saldoInicial =
        Instancia.LuckygamesIo.Parametros.Balance();
      Instancia.Estatisticas.Dados.saldoMenor =
        Instancia.Estatisticas.Dados.saldoInicial;
      Instancia.Estatisticas.Dados.saldoMaior =
        Instancia.Estatisticas.Dados.saldoInicial;
      Instancia.Estatisticas.Dados.apostaQuantidade = 0;
      Instancia.Estatisticas.Dados.apostaMenor = null;
      Instancia.Estatisticas.Dados.apostaMaior = null;
      Instancia.Estatisticas.Dados.apostaUltima = null;
      Instancia.Estatisticas.Dados.apostaTotal = 0;
      Instancia.Estatisticas.Dados.apostaQuantidadePerdida = 0;
      Instancia.Estatisticas.Dados.apostaQuantidadeVencida = 0;
      Instancia.Estatisticas.Dados.apostaLucro = 0;
      if (Instancia.Estatisticas.Dados.apostaMelhores === undefined) {
        Instancia.Estatisticas.Dados.apostaMelhores = [];
      } else {
        Instancia.Estatisticas.Dados.apostaMelhores.length = 0;
      }
      if (Instancia.Estatisticas.Dados.sequencias === undefined) {
        Instancia.Estatisticas.Dados.sequencias = [];
      } else {
        Instancia.Estatisticas.Dados.sequencias.length = 0;
      }
      Instancia.Estatisticas.Dados.sequenciaPerdendo = 0;
      Instancia.Estatisticas.Dados.sequenciaPerdendoMaxima = 0;
      if (
        Instancia.Estatisticas.Dados.sequenciaPerdendoRecorrente === undefined
      ) {
        Instancia.Estatisticas.Dados.sequenciaPerdendoRecorrente = [];
      } else {
        Instancia.Estatisticas.Dados.sequenciaPerdendoRecorrente.length = 0;
      }
      Instancia.Estatisticas.Dados.sequenciaVencendo = 0;
      Instancia.Estatisticas.Dados.sequenciaVencendoMaxima = 0;
      if (
        Instancia.Estatisticas.Dados.sequenciaVencendoRecorrente === undefined
      ) {
        Instancia.Estatisticas.Dados.sequenciaVencendoRecorrente = [];
      } else {
        Instancia.Estatisticas.Dados.sequenciaVencendoRecorrente.length = 0;
      }
      if (Instancia.Estatisticas.Dados.sorteados === undefined) {
        Instancia.Estatisticas.Dados.sorteados = Array(100);
      }
      Instancia.Estatisticas.Dados.sorteados.fill(0);
    },

    Dados: {
      Calculo: {
        saldoAtual: () => {
          return Instancia.LuckygamesIo.Parametros.Balance();
        },
        lucro: () => {
          const saldoInicial = Instancia.Estatisticas.Dados.saldoInicial;
          const saldoAtual = Instancia.Estatisticas.Dados.Calculo.saldoAtual();
          return saldoAtual - saldoInicial;
        },
        lucroPercentual: () => {
          const saldoInicial = Instancia.Estatisticas.Dados.saldoInicial;
          const saldoAtual = Instancia.Estatisticas.Dados.Calculo.saldoAtual();
          return (saldoAtual / saldoInicial - 1) * 100;
        },
        tempoCorrido: () => {
          if (
            Instancia.Estatisticas.Dados.tempoFinal === null ||
            Instancia.Estatisticas.Dados.tempoInicio === null
          ) {
            return new Date(0);
          } else {
            return new Date(
              Instancia.Estatisticas.Dados.tempoFinal -
                Instancia.Estatisticas.Dados.tempoInicio
            );
          }
        },
        velocidade: () => {
          const tempoCorrido =
            Instancia.Estatisticas.Dados.Calculo.tempoCorrido().getTime();
          if (tempoCorrido === 0) {
            return 0;
          } else {
            return (
              Instancia.Estatisticas.Dados.apostaQuantidade /
              (tempoCorrido / 1000 / 60)
            );
          }
        },
      },
      Formatado: {
        SaldoHistorico: () => {
          const result = Instancia.Estatisticas.Dados.saldoHistorico;
          while (result.length < 2) {
            result.unshift(Instancia.Estatisticas.Dados.Calculo.saldoAtual());
          }
          return result;
        },
        SaldoInicial: () => {
          return Instancia.Estatisticas.Dados.saldoInicial.formatado();
        },
        SaldoAtual: () => {
          return Instancia.Estatisticas.Dados.Calculo.saldoAtual().formatado();
        },
        SaldoMenor: () => {
          return Instancia.Estatisticas.Dados.saldoMenor.formatado();
        },
        SaldoMaior: () => {
          return Instancia.Estatisticas.Dados.saldoMaior.formatado();
        },
        Lucro: () => {
          return Instancia.Estatisticas.Dados.Calculo.lucro().formatado({
            sinal: true,
          });
        },
        LucroPercentual: () => {
          return Instancia.Estatisticas.Dados.Calculo.lucroPercentual().formatado(
            { digitos: 2, sufixo: "%", sinal: true }
          );
        },
        TempoInicio: () => {
          const result = Instancia.Estatisticas.Dados.tempoInicio;
          return result === null ? "—" : result.formatado();
        },
        TempoFinal: () => {
          const result = Instancia.Estatisticas.Dados.tempoFinal;
          return result === null ? "—" : result.formatado();
        },
        TempoCorrido: () => {
          return Instancia.Estatisticas.Dados.Calculo.tempoCorrido().formatado(
            "corrido"
          );
        },
        ApostaMelhores: () => {
          const result = [];
          Instancia.Estatisticas.Dados.apostaMelhores.forEach((val) => {
            result.unshift({
              id: val.id,
              url: "https://luckygames.io/bet/" + val.id + "/",
              aposta: val.betAmount.formatado(),
              ganho: val.profit.formatado(),
            });
          });
          return result;
        },
        Velocidade: () => {
          return Instancia.Estatisticas.Dados.Calculo.velocidade().formatado({
            digitos: 2,
            sufixo: " apostas/min.",
          });
        },
        ApostaQuantidade: () => {
          return Instancia.Estatisticas.Dados.apostaQuantidade.formatado({
            digitos: 0,
          });
        },
        ApostaMenor: () => {
          const result = Instancia.Estatisticas.Dados.apostaMenor;
          return result === null ? "—" : result.formatado();
        },
        ApostaMaior: () => {
          const result = Instancia.Estatisticas.Dados.apostaMaior;
          return result === null ? "—" : result.formatado();
        },
        ApostaUltima: () => {
          return Instancia.Estatisticas.Dados.apostaUltima.formatado();
        },
        ApostaTotal: () => {
          return Instancia.Estatisticas.Dados.apostaTotal.formatado();
        },
        ApostaLucro: () => {
          return Instancia.Estatisticas.Dados.apostaLucro.formatado({
            sinal: true,
          });
        },
        EstatisticaPerdidasVencidas: () => {
          const result = [
            Instancia.Estatisticas.Dados.apostaQuantidadePerdida,
            Instancia.Estatisticas.Dados.apostaQuantidadeVencida,
          ];
          if (result[0] === 0 && result[1] === 0) {
            result[0] = result[1] = 1;
          }
          return result;
        },
        ApostaQuantidadePerdida: () => {
          return Instancia.Estatisticas.Dados.apostaQuantidadePerdida.formatado(
            { digitos: 0 }
          );
        },
        ApostaQuantidadeVencida: () => {
          return Instancia.Estatisticas.Dados.apostaQuantidadeVencida.formatado(
            { digitos: 0 }
          );
        },
        Sequencias: () => {
          return Instancia.Estatisticas.Dados.sequencias;
        },
        SequenciaPerdendo: () => {
          return Instancia.Estatisticas.Dados.sequenciaPerdendo.formatado({
            digitos: 0,
          });
        },
        SequenciaPerdendoMaxima: () => {
          return Instancia.Estatisticas.Dados.sequenciaPerdendoMaxima.formatado(
            { digitos: 0 }
          );
        },
        SequenciaPerdendoRecorrente: () => {
          for (
            var i = 0;
            i < Instancia.Estatisticas.Dados.sequenciaPerdendoRecorrente.length;
            i++
          ) {
            if (
              Instancia.Estatisticas.Dados.sequenciaPerdendoRecorrente[i] ===
              undefined
            ) {
              Instancia.Estatisticas.Dados.sequenciaPerdendoRecorrente[i] = 0;
            }
          }
          return Instancia.Estatisticas.Dados.sequenciaPerdendoRecorrente;
        },
        SequenciaVencendo: () => {
          return Instancia.Estatisticas.Dados.sequenciaVencendo.formatado({
            digitos: 0,
          });
        },
        SequenciaVencendoMaxima: () => {
          return Instancia.Estatisticas.Dados.sequenciaVencendoMaxima.formatado(
            { digitos: 0 }
          );
        },
        SequenciaVencendoRecorrente: () => {
          for (
            var i = 0;
            i < Instancia.Estatisticas.Dados.sequenciaVencendoRecorrente.length;
            i++
          ) {
            if (
              Instancia.Estatisticas.Dados.sequenciaVencendoRecorrente[i] ===
              undefined
            ) {
              Instancia.Estatisticas.Dados.sequenciaVencendoRecorrente[i] = 0;
            }
          }
          return Instancia.Estatisticas.Dados.sequenciaVencendoRecorrente;
        },
        Sorteados: () => {
          return Instancia.Estatisticas.Dados.sorteados;
        },
      },
    },
  };

  Instancia.Inicializar();

  return Instancia;
})();
