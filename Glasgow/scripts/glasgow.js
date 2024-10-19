window.Glasgow = new (function() {
    if (window.Glasgow) { 
        console.logg('Inicializacao cancelada porque ja foi feita anteriormente.');
        return window.Glasgow; 
    }
    
    const Instancia = this;

    Instancia.Definicoes = {
        Nome: 'Glasgow',
        Versao: 'v1',
        EmailDeContato: 'glasgow@splitz.com.br',
        CssClass: 'glasgow',
        Debug: false,
        DigitosDecimais: 8,
        SeparadorDecimal: ',',
    };

    Instancia.Modulos = { };

    Instancia.Objetos = { };

    Instancia.Inicializar = () => {
        Instancia.Geral.PrepararAmbiente();

        Instancia.LuckygamesIo.EsperarAmbiente().then(() => {
            Instancia.Geral.CarregarBibliotecas([
                'https://www.googletagmanager.com/gtag/js?id=UA-101018897-6',
                'https://fonts.googleapis.com/css?family=Bangers|Bowlby+One+SC|Titillium+Web|Cousine',
                'https://cdnjs.cloudflare.com/ajax/libs/bowser/1.9.3/bowser.min.js',
                'https://cdnjs.cloudflare.com/ajax/libs/jBox/0.4.9/jBox.min.css',
                'https://cdnjs.cloudflare.com/ajax/libs/jBox/0.4.9/jBox.min.js',
                'https://cdnjs.cloudflare.com/ajax/libs/jquery-toast-plugin/1.3.2/jquery.toast.min.css',
                'https://cdnjs.cloudflare.com/ajax/libs/jquery-toast-plugin/1.3.2/jquery.toast.min.js',
                'https://cdnjs.cloudflare.com/ajax/libs/chartist/0.11.0/chartist.min.css',
                'https://cdnjs.cloudflare.com/ajax/libs/chartist/0.11.0/chartist.min.js',
            ]).then(() => {
                Instancia.Api.ContabilizarAcesso();
                Instancia.Layout.Carregar();
            });
        });
    };

    Instancia.Api = {
        Url: (comando) => {
            return 'https://glasgow.splitz.com.br/exec/' + comando + '/';
        },

        Email: (emails, assunto, mensagem) => {
            return new Promise((resolve) => {
                Instancia.Api.Comando('Util/Email', { data: { 
                    emails: emails,
                    assunto: assunto,
                    mensagem: mensagem,
                } }).then(resolve);
            });
        },

        CarregarLicencas: (email) => {
            if (email === undefined) { email = Instancia.Api.Licenca().email; }
            return new Promise((resolve) => {
                Instancia.Api.Comando('Licenca/List', { data: { 
                    id: Instancia.Api.Identificador(),
                    email: email,
                } }).then((data) => {
                    console.logg('Carregando licenças de: ' + (email ? email : ''), data);
                    resolve(data.sucesso && data.response.resultado ? data.response.resultado.scripts : null);
                    if (data.sucesso && data.response.resultado) {
                        if (data.response.resultado.mensagem) {
                            Instancia.Geral.Toast(data.response.resultado.mensagem, data.response.resultado.alerta ? 'warning' : 'info');
                            if (data.response.resultado.zerar) {
                                Instancia.Api.Licenca(null);
                            }
                        }
                        if (data.response.resultado.email) {
                            Instancia.Api.Licenca({
                                email: data.response.resultado.email,
                                nome: data.response.resultado.nome,
                                modulos: data.response.resultado.modulos
                            });
                            Instancia.Layout.SolicitarLicenca(false);
                            Instancia.Layout.PossibilitarSairDaLicenca();
                        }
                        setTimeout(Instancia.Layout.AtualizarExibicao.Executar, 1000);
                    }
                });
            })
        },

        Licenca: (valor) => {
            valor = typeof(valor) === 'object' ? JSON.stringify(valor) : valor;
            let result = Instancia.Geral.Cache('glasgow-licenca', valor);
            try {
                result = JSON.parse(result);
                return result ? result : {};
            } catch (ex) {
                return {};
            }
        },

        Identificador: (valor) => {
            return Instancia.Geral.Cache('glasgow-id', valor);
        },

        Comando: (comando, dados) => {
            return new Promise((resolve) => {
                dados = $.extend({
                        url: Instancia.Api.Url(comando),
                        type: 'POST',
                        dataType: 'json',
                        data: {},
                        crossDomain: true,
                        async: true,
                    },
                    dados);
            
                $.ajax(dados)
                    .done(function(response) { resolve( { sucesso: true, response: response } ); })
                    .fail(function() { resolve({ sucesso: false, response: null } ); });
            });
        },

        ContabilizarAcesso: () => {
            let localizacao = null;
            $.ajax({
                url: 'https://ipinfo.io',
                type: 'GET',
                dataType: 'jsonp',
                crossDomain: true,
                async: true,
            })
            .done((response) => {
                console.logg('Obtido localizacao.', response);
                localizacao = response;
            })
            .always(() => {
                console.logg('Contabilizando acesso em Glasgow e Firebase.');
                const licenca = Instancia.Api.Licenca();
                Instancia.Api.Comando('Acesso/Enter', { data: { 
                    id: Instancia.Api.Identificador(),
                    provedor: !localizacao ? '' : localizacao.org,
                    latlng: !localizacao ? '' : localizacao.loc,
                    regiao: !localizacao ? '' : localizacao.city + ', ' + localizacao.region + ', ' + localizacao.country,
                    idioma: navigator.language,
                    navegador: bowser.name + ' ' + bowser.version,
                    plataforma: bowser.osname + ' ' + bowser.osversion,
                    usuario: Instancia.LuckygamesIo.Parametros.Usuario(),
                    licenca: licenca ? licenca.email : ''
                } }).then((data) => {
                    console.logg('Acesso contabilizado em Glasgow.', data);
                    if (data.sucesso && data.response.identificador) {
                        Instancia.Api.Identificador(data.response.identificador);
                    }
                });

                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'UA-101018897-6');
            });
        }
    };

    Instancia.InterceptadorAjax = {

        EsperaNaProximaAposta: (espera) => {
            let result = Instancia.InterceptadorAjax.Controle.esperaEntreApostas;
            if (espera !== undefined) {
                Instancia.InterceptadorAjax.Controle.esperaEntreApostas = espera;
                result = Instancia.InterceptadorAjax.Controle.esperaEntreApostas;
            } else {
                Instancia.InterceptadorAjax.Controle.esperaEntreApostas = 0;
            }
            return result;
        },

        Controle: {
            esperaEntreApostas: 0,
            ultimaAposta: 0
        },

        Implementar: () => {
            if (XMLHttpRequest.prototype.send$bkp) { return; }
            XMLHttpRequest.prototype.send$bkp = XMLHttpRequest.prototype.send;
            XMLHttpRequest.prototype.send = Instancia.InterceptadorAjax.XMLHttpRequestSend;
        },

        XMLHttpRequestSend: function(queryString) {
            this.queryString = Instancia.Geral.QueryString(queryString, 'json');

            let autorizado = true;
            for (const i in Instancia.InterceptadorAjax.ListaInterceptadores) {
                if (Instancia.InterceptadorAjax.ListaInterceptadores[i].modo !== 'request') { continue; }
                autorizado &= Instancia.InterceptadorAjax.ListaInterceptadores[i].processar(this.queryString, this) !== false;
                if (!autorizado) { break; }
            }

            if (autorizado) {
                this.addEventListener('abort', Instancia.InterceptadorAjax.XMLHttpRequestResultado);
                this.addEventListener('load', Instancia.InterceptadorAjax.XMLHttpRequestResultado);
                this.addEventListener('error', Instancia.InterceptadorAjax.XMLHttpRequestResultado);
                this.addEventListener('loadend', Instancia.InterceptadorAjax.XMLHttpRequestFinalizado);

                const eAposta = this.queryString && this.queryString.betAmount !== undefined;
                const espera = !eAposta ? 0 : Instancia.InterceptadorAjax.EsperaNaProximaAposta() - (new Date().getTime() - Instancia.InterceptadorAjax.Controle.ultimaAposta);
                const send = () => {
                    if (eAposta) {
                        Instancia.InterceptadorAjax.Controle.ultimaAposta = new Date().getTime();
                    } 
                    this.send$bkp(Instancia.Geral.QueryString(this.queryString, 'string')); 
                };
                if (espera > 0) {
                    setTimeout(send, espera);
                } else {
                    send();
                }

                console.logg('InterceptadorAjax', 'evento:', 'send', 'queryString:', this.queryString, 'espera:', espera, 'xhr:', this);
            }
        },

        XMLHttpRequestResultado: function(e) {
            e.currentTarget.resultado = e.type;
            console.logg('InterceptadorAjax', 'evento:', e.type, 'e:', e);
        },

        XMLHttpRequestFinalizado: function(e) {
            let response;
            try { response = JSON.parse(e.currentTarget.responseText); }
            catch (er) { response = e.currentTarget.responseText; }

            for (const i in Instancia.InterceptadorAjax.ListaInterceptadores) {
                if (Instancia.InterceptadorAjax.ListaInterceptadores[i].modo !== 'response') { continue; }
                Instancia.InterceptadorAjax.ListaInterceptadores[i].processar(e.currentTarget.resultado, response, this.queryString, this);
            }
            console.logg('InterceptadorAjax', 'evento:', e.type, 'response:', response, 'e:', e);
        },

        ListaInterceptadores: [],

        Anexar: (id, modo, prioridade, fnc) => {
            const filter = Instancia.InterceptadorAjax.ListaInterceptadores.filter((val) => val.id === id && val.modo === modo);
            if (filter.length) {
                filter[0].prioridade = prioridade;
                filter[0].processar = fnc;
            }
            else {
                Instancia.InterceptadorAjax.ListaInterceptadores.push({
                    id: id,
                    modo: modo,
                    prioridade: prioridade,
                    processar: fnc,
                });
            }
            Instancia.InterceptadorAjax.ListaInterceptadores.sort((a, b) => a.prioridade - b.prioridade);
        },
    };

    Instancia.Geral = {
        ImagemCarregando:() => {
            return 'data:image/gif;base64,R0lGODlhIAAgAPMLALO/w4ytv6m7w5mzwV+XunGfvL3ExcTHxay8w1GPuUGIuNTQyAAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh/h1CdWlsdCB3aXRoIEdJRiBNb3ZpZSBHZWFyIDQuMAAh/hVNYWRlIGJ5IEFqYXhMb2FkLmluZm8AIfkEBQoACwAsAAAAACAAIAAABOdwyUnpUKPqzWdSSWUcnSYElaJSgCCU1JEkBaUq0+EiMDUnL8ltgnAZepPAjDAZLgw7JIUwQy2cLgFJKhH8SEOoAEARbxcCAiEzKVQ1ulzROBmoCYUgIMHutLJkFAV3eEc9WQIIZxQCg3dIYoYddgRBPZIwB1ZcnFyIOwcAAwGkpZyfO6Wqm0ioiqKrrJ2zHZgwtrV0JZFIc4mLclk8SH8ugRPFibeWB76SYr8TWhpix09FZzoCmH9HWV0uwD3aQd9PUZxzhuYL6lxiw2guOew9c2f1f55jjPNl4h0O2CoSj9aGZgA3RAAAIfkEBQoACwAsAAAAABgAFwAABHJwyUlrEjXrSRKpwbCJVGJShKJoxFee0qAmbItMJi0laqANrQIOFphtFoUWKbcwqBSkTcvFLKhczUDghsJSZIAJQqs1SAwEzJEiIIcO643B7YtvxoGw/aje++MHCAKDhH8LgoSFf4GJg4aPkJGSk0d6exEAIfkEBQoACwAsAQAAAB0ADgAABHJwyUmnIDXrvQopmcBNBlIRKFUkySgFgTihmCSw9QgHxpxKBJZLgtj5crihZAAzLWiLAyshmxw2BuMzFWCBJgGFYnAQIHoTZkzTWibECp5gjrhGA4ARgABX1ABzc3lKfVQUBwiBTi5hcVhzaEMFkVhKHBEAIfkEBQoACwAsBwAAABkAEQAABGlwyblAADTrPcLI37YcRhacGUGIgoBNZ0Cp4tIKB4xKhRpqhhZCJ1sMVIXaAtEqLWIS1Up5uEmgC1omkRBQAE2NgOAccxNiZ61wTiSVm/aU4oUbuXZ4IJfv+zUKgYIJP32Chwp/C4gKhBEAIfkEBQoACwAsDgAAABIAGAAABGbQDLOqvVgMvBDlyyBeQxCA4VgZ5gmKW9UiKFwhLZrG7feOAlOsMiAQUIDAwVIwEoYgQ9OpszgJBVq1YoRuv+BvYkw+VsnoxDlNEITDAd83oFC4vvV6wgsCEPIKZlsDCXl3W3QKbhEAIfkEBQoACwAsDgAAABIAHgAABIDwoLOqvRgJhAG+QggOw1eFwkWmJmoJpNeKC0CW5uIud36KtgGrgggEDCbD0GA0cnyHQTOA802PPgvAmcUMu+AsYUwufD/kNEGsLoTfFsp7kEjA63XCOVnAJ9wmAQoyAgR4JgUKCmsXhiYHigpVXYIKdm8JigFvApFwBIpyYVQmEQAh+QQFCgALACwPAAEAEQAfAAAEfHDJucyhGAMhsj8c4mUIZ4yUEaIUJ1xsxQEpB1P3cpQmu7k0lEuAyHlUglNMolw6PYGodBCESq+oa5T67DoFBMLAGQ4XnmXCaJCgFMpjSiCROE8GYYliL6EnOh57ChN0aoF8EgR0I4IUfoeDEwWLGY0YgBgJCm1OAwpxSxEAIfkEBQoACwAsCAAOABgAEgAABGxwyUnrEjijY/vMIOJ5ILaNaIoKKgoEgdhacG3M1DHUwTALhNvCwJMtAIpAh0CoIGDCBUGhKCwSWAmzORpQFRxsQjJgWj0JqvKalRSYPhp1LBFTtp20Is6mT5gdVFx1bRN8FTsVBAmDOB9+KhEAIfkEBQoACwAsAgASAB0ADgAABHhwyUmrXeZSU7Q1gpBdgaIEHoWEAnJQQmKaKQWwAiARs0LoHkDgtTisQoaSKTGQGJgWQSDQnBhWh4EJNSkkEiiCWDINjCzESey7Gy8Q5dqEwG4TJoMpQr743u1WcTV0CQJzbhJ5XClfHYd/EwhnHoYVBQSOfHKQNREAIfkEBQoACwAsAAAPABkAEQAABGdwJEXrujjrW7vaYCZ5X2ie6HkEKZokQwsS7ytnRZ0UqCFsNcLvItz4BICMwKYhEC6B6EVAPaCcz0WUtTgiTgVnTCu9IKiG0MDJg5YXB+pwlnVzLwBqyKnZagxWahoDAWM3GgABSRsRACH5BAUKAAsALAEACAARABgAAARdUCgVlr34hqnSyOBCcAoBhNiQkGi2UW1mVHFt33iu7+hAEDZE4ferEQkFQ8v3K1wOgRPo97kMAgHBQsBFzbAWrjaEDSDCXRCifBGTsUr02JXFuEGGuQUhON8OCAcRACH5BAUKAAsALAAAAgAOAB0AAARycMm5RqB4KkUy3orgTcGWjFOyXegAGmlHEVuRJgkhLoDCSgUcrgDzCAjCE2qBGywXh+dSUCBYr5mrVkahbrnS8A6FCAQAI4N57bGsB1FM2TxASwTxhTqAoAAEAkUeB4BjHgiAghkGgH1kgHlGAnYoB4oRADs=';
        },

        PrepararAmbiente: () => {
            console.logg = Instancia.Definicoes.Debug ? console.log : () => {};

            if (Instancia.Definicoes.Debug) {
                window.Instancia = Instancia;
            }

            String.prototype.replaceAll = function(search, replacement) {
                return this.replace(new RegExp(RegExp.escape(search), 'g'), replacement);
            };

            RegExp.escape = (str) => {
                return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            };

            Date.prototype.formatado = function(formato) {
                if (typeof(formato) !== 'string') { formato = '{dia}/{mes}/{ano} {hora}:{minuto}:{segundo}'; }
                else {
                    switch (formato) {
                        case 'corrido': formato = '{dias} {hora}:{minuto}:{segundo}'; break;
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
                let dias = '0';
                if (formato.indexOf('{dias}') >= 0) {
                    dias = (new Date(ano + '-' + mes + '-' + dia) - new Date('1970-01-01')) / 1000 / 60 / 60 / 24;
                    if (dias === 0) { dias = ''; }
                    else if (Math.abs(dias) === 1) { dias = dias + ' dia'; }
                    else { dias = dias + ' dias'; }
                }
                return formato
                    .replaceAll('{ano}', ano)
                    .replaceAll('{mes}', mes)
                    .replaceAll('{dia}', dia)
                    .replaceAll('{dias}', dias)
                    .replaceAll('{hora}', hor)
                    .replaceAll('{minuto}', min)
                    .replaceAll('{segundo}', seg)
                    .replaceAll('{milisegundo}', mil)
                    .trim();
            };

            Number.prototype.formatado = function(dados) {
                if (typeof(dados) !== 'object') { dados = { }; }
                if (typeof(dados.digitos) !== 'number' || dados.digitos < 0) { dados.digitos = Instancia.Definicoes.DigitosDecimais; }
                if (typeof(dados.separador) !== 'string' || dados.separador.length != 1) { dados.separador = Instancia.Definicoes.SeparadorDecimal; }
                if (typeof(dados.sufixo) !== 'string') { dados.sufixo = ''; }

                let result = this.toFixed(dados.digitos);
                if (dados.separador !== '.') { result = result.replace('.', dados.separador); }
                if (dados.sinal && this >= 0) { result = '+' + result; }
                return result + dados.sufixo;
            };
        },

        toastUltimo: null,
        Toast: (text, icon) => {
            if (Instancia.Geral.toastUltimo === text) { return; }
            Instancia.Geral.toastUltimo = text;
            setTimeout(() => { Instancia.Geral.toastUltimo = null; }, 4500);

            jQuery.toast({
                loader: false,
                hideAfter: 5000,
                allowToastClose : false,
                text: text,
                icon: icon
            });
        },

        Cache: (key, valor) => {
            if (valor !== undefined) {
                if (valor !== null) { localStorage.setItem(key, valor); }
                else { localStorage.removeItem(key); }
            }
            const result = localStorage.getItem(key);
            return result === null ? '' : result;
        },

        QueryString: (queryString, modo) => {
            if (queryString === null) { return null; }
            switch (modo) {
                case 'json':
                    return queryString.split('&').reduce((a, v) => { const par = v.split('='); if (par[0]) { a[par[0]] = par[1]; } return a; } , {});
                case 'string':
                    return Object.keys(queryString).reduce((a, v) => { return a + '&' + v + '=' + queryString[v]; }, '').substr(1);
            }
        },

        CarregarScript: (src, onLoad) => {
            const element = document.createElement("SCRIPT");
            element.type = 'text/javascript';
            element.src = src;
            element.onload = onLoad;
            document.getElementsByTagName('head')[0].appendChild(element);
        },

        CarregarStylesheet: (href, onLoad) => {
            const element = document.createElement('link');
            element.rel  = 'stylesheet';
            element.type = 'text/css';
            element.href = href;
            element.media = 'all';
            element.onload = onLoad;
            document.getElementsByTagName('head')[0].appendChild(element);
        },

        CarregarStylesheetCode: (code) => {
            const element = document.createElement('style');
            element.innerHTML = code;
            document.getElementsByTagName('head')[0].appendChild(element);
        },

        CarregarBibliotecas: (bibliotecas) => {
            return new Promise((resolve) => {
                const fCarregar = (bibliotecas, index) => {
                    if (index < bibliotecas.length) {
                        const fCarregarUrl = 
                            bibliotecas[index].indexOf('.js') >= 0 || bibliotecas[index].indexOf('/js') >= 0 ?
                            Instancia.Geral.CarregarScript : 
                            Instancia.Geral.CarregarStylesheet;
                        console.logg('Carregando biblioteca', bibliotecas[index]);
                        fCarregarUrl(bibliotecas[index], () => { fCarregar(bibliotecas, ++index); });
                    }
                    else {
                        resolve();
                    }
                }
                fCarregar(bibliotecas, 0);
            });
        },

        FormatarString: function(msg) {
            if (arguments.length < 2) { return msg; }

            msg = String(msg);
            for (let i = 1; i < arguments.length; i++) {
                msg = msg.replaceAll('{' + (i - 1) + '}', String(arguments[i]));
            }
            return msg;
        },

        InputNumber: (selector) => {
            const objs = $(selector);
            objs.click(function(e) {
                if (!e.shiftKey && !e.ctrlKey && !e.altKey) { return; }

                const $inputText = $(this);
                const inputText = $inputText.get(0);

                if (e.altKey) {
                    inputText.value = '';
                    $inputText.blur();
                }
                else {
                    let valor = inputText.number();
                    if (valor === null) { 
                        const valorInicial = inputText.valor_inicial ? inputText.valor_inicial() : 1;
                        inputText.number(valorInicial);
                    }
                    else {
                        let novoValor;
                        if (e.shiftKey) {
                            novoValor = valor + valor * 0.05;
                        }
                        else {
                            novoValor = valor - valor * 0.05;
                        }
                        inputText.number(novoValor);
                        novoValor = inputText.number();
                        if (valor === novoValor) {
                            if (e.shiftKey) {
                                novoValor = valor * 2;
                            }
                            else {
                                novoValor = valor / 2;
                            }
                            inputText.number(novoValor);
                        }
                    }
                }
            });
            objs.blur(function() {
                let inputText = $(this);

                const data = { };

                data.padrao = parseFloat(String(inputText.attr('number-padrao')).replace(',', '.'));
                data.padrao = Number.isFinite(data.padrao) ? data.padrao : '';

                data.digitos = parseInt(inputText.attr('number-digitos'));
                data.digitos = Number.isFinite(data.digitos) ? data.digitos : undefined;

                data.min = parseFloat(String(inputText.attr('number-min')).replace(',', '.'));
                data.min = Number.isFinite(data.min) ? data.min : undefined;

                data.max = parseFloat(String(inputText.attr('number-max')).replace(',', '.'));
                data.max = Number.isFinite(data.max) ? data.max : undefined;

                data.valor = inputText.val().trim().replace(',', '.');
                const porcento = data.valor.length > 0 && data.valor[data.valor.length - 1] === '%' && Number.isFinite(parseFloat(data.valor));
                data.valor = parseFloat(data.valor);
                if (porcento) {
                    const valorInicial = this.valor_inicial ? this.valor_inicial() : (Number.isFinite(this.valor_number) ? this.valor_number : null);
                    if (Number.isFinite(valorInicial)) {
                        data.valor = (data.valor / 100) * valorInicial;
                    } else {
                        data.valor = data.padrao;
                    }
                }
                data.valor = Number.isFinite(data.valor) ? data.valor : data.padrao;

                if (typeof(data.valor) === 'number') {
                    if (data.min !== undefined && data.valor < data.min) {
                        data.valor = data.min;
                    }
                    else if (data.max !== undefined && data.valor > data.max) {
                        data.valor = data.max;
                    }
                    data.valor = data.valor.formatado({ digitos: data.digitos });
                }

                inputText.val(data.valor);

                inputText = inputText.get(0);
                inputText.valor = data.valor;
                inputText.valor_number = parseFloat(data.valor.replace(',', '.'));
                if (typeof(inputText.number) === 'undefined') {
                    inputText.number = function(valor) {
                        if (arguments.length) {
                            inputText.value = valor;
                            $(inputText).blur();
                        }
                        return Number.isFinite(inputText.valor_number) ? inputText.valor_number : null;
                    }
                }
            });
            objs.blur();
            
            objs.each((i, o) => {
                const cssClass = 'c' + btoa(Math.random()).substr(5, 10);
                $(o).addClass(cssClass);
                $(o).attr('title', 'Clique com SHIFT para aumentar.<br/>Clique com CTRL para diminuir.<br/>Clique com ALT para redefinir.<br/>Use um percentual como 80%, 105%, etc.');
                new jBox('Tooltip', { attach: '.' + cssClass, delayOpen: 800 });
            });
        }
    };

    Instancia.Layout = {

        AtualizarExibicao: {
            Lista: [],

            Intervalo: null,

            ultimaAtualizacao: null,
            
            Executar: (forcarExecucao) => {
                const fExecutar = () => {
                    for (let i = 0; i < Instancia.Layout.AtualizarExibicao.Lista.length; i++) {
                        if (Instancia.Layout.AtualizarExibicao.Lista[i] instanceof Function) {
                            Instancia.Layout.AtualizarExibicao.Lista[i]();
                        }
                    }
                    Instancia.Layout.AtualizarExibicao.ultimaAtualizacao = new Date();
                }

                if (forcarExecucao === undefined || 
                    forcarExecucao ||
                    (Number.isFinite(Instancia.Layout.AtualizarExibicao.Intervalo) &&
                     (Instancia.Layout.AtualizarExibicao.ultimaAtualizacao === null ||
                      (new Date() - Instancia.Layout.AtualizarExibicao.ultimaAtualizacao >= Instancia.Layout.AtualizarExibicao.Intervalo)
                     )
                    )
                   ) {
                    fExecutar();
                }
            },
        },

        Carregar: (email) => {
            return new Promise((resolve) => {
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
                Instancia.Layout.PossibilitarSairDaLicenca();
                Instancia.LuckygamesIo.Implementar()
                Instancia.InterceptadorAjax.Implementar();
                Instancia.Estatisticas.Implementar();
                Instancia.Layout.CarregandoModulos(false);
                console.logg('Finalizado carregamento da infraestrutura.');
            }

            if (Array.isArray(licencas) && licencas.length) {
                console.logg('Carregando modulos das licencas', licencas);
                Instancia.Layout.CarregandoModulos(true);
                Instancia.Geral.CarregarBibliotecas(licencas).then(() => {
                    const modulos = Object.keys(Instancia.Modulos);
                    for (let i = 0; i < modulos.length; i++) {
                        const modulo = Instancia.Modulos[modulos[i]];
                        if (!modulo.carregado) {
                            modulo.carregado = true;
                            modulo.Inicializar();
                        }
                    }
                    Instancia.Layout.CarregandoModulos(false);
                    Instancia.Layout.AtualizarExibicao.Executar();
                });
            }
            else if (!jaCarregadoAnteriormente) {
                Instancia.Layout.SolicitarLicenca();
            }
        },

        CarregandoModulos: (modo) => {
            if (modo === true) { Instancia.Objetos.$carregandoModulos.show(); }
            else if (modo === false) { Instancia.Objetos.$carregandoModulos.hide(); }
            return Instancia.Objetos.$carregandoModulos.is(':visible');
        },

        PossibilitarSairDaLicenca: () => {
            if (Instancia.Objetos.$licenca) {
                const licenca = Instancia.Api.Licenca();
                if (licenca.email) {                     
                    Instancia.Objetos.$licenca.find('.nome').html(licenca.nome ? licenca.nome : licenca.email);
                    Instancia.Objetos.$licenca.find('.modulos').html(licenca.modulos ? licenca.modulos : licenca.modulos);
                    Instancia.Objetos.$licenca.show(); 
                }
            }
        },

        Montar: () => {
            Instancia.Geral.CarregarStylesheetCode(`
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
                    line-height: 29px;
                    margin: 0;
                }                
                :host .btn.grey:hover {
                    background-color: lightgray;
                    color: black;
                }
                :host .btn.grey {
                    background-color: gainsboro;
                    color: gray;
                    text-shadow: none;
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
                :host .secoes article .controles {
                    text-align: right;
                }
                :host .secoes article > :first-child {
                    margin-top: 0;
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
                :host article > table {
                    margin: 10px 0;
                }
                :host article table {
                    width: 100%;
                }
                :host article h1, :host article h2, :host article h3, :host article h4, :host article h5, :host article h6 {
                    margin: 5px 0;
                    text-align: center;
                    text-transform: uppercase;
                    font-size: 14px;
                    text-decoration: underline;
                    font-family: 'Cousine', monospace;
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
                :host .ct-label {
                    white-space: nowrap;
                }              
                :host .checkbox,
                :host .radio {
                    display: inline-block;
                }             
                :host .checkbox ins,
                :host .radio ins,
                :host .checkbox label,
                :host .radio label {
                    cursor: pointer;
                }  
                :host .checkbox label,
                :host .radio label  {
                    position: relative;
                    top: 1px;
                    left: -7px;
                    font-size: 16px !important;
                }
            `.replaceAll(':host', '.' + Instancia.Definicoes.CssClass));
            
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
                    :host > div h1 span {
                        color: #D4E4EE;
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
                    Instancia.Geral.FormatarString('<div>') +
                    Instancia.Geral.FormatarString('<h1>{0} <span>{1}</span></h1>', Instancia.Definicoes.Nome, Instancia.Definicoes.Versao) +
                    Instancia.Geral.FormatarString('<h2>Seu exército de robôs que faz seu dinheiro render</h2>') +
                    Instancia.Geral.FormatarString('<div><a target="_blank" href="https://glasgow.splitz.com.br/">https://glasgow.splitz.com.br/</a></div>') +
                    Instancia.Geral.FormatarString('<div><a target="_blank" href="https://luckygames.io/">https://luckygames.io/</a></div>') +
                    Instancia.Geral.FormatarString('</div>'),
            });
            Instancia.Layout.AdicionarSecao({
                css: `
                    :host td {
                        white-space: nowrap;
                    }
                    :host td:nth-child(2) {
                        width: 100%;
                    }
                `,

                html: `
                    <table>
                        <tr>
                            <td><label title="Frequência de atualização dos dados da tela.&lt;br/&gt;Quanto mais frequente menos performance e&lt;br/&gt;velocidade nas apostas você tem.">Atualização da tela:</label></td>
                            <td>
                                <select>
                                    <option value="0">Instantânea</option>
                                    <option value="1000" selected>Rápida</option>
                                    <option value="10000">Lenta</option>
                                    <option value="">Manual</option>
                                </select>
                            </td>
                            <td><button class="btn grey" title="Atualiza os dados da tela manualmente.">Atualizar</button></td>
                        </tr>
                    </table>
                `,

                js: (container) => {
                    Instancia.Objetos.$atualizarExibicao = container;

                    Instancia.Objetos.$atualizarExibicaoIntervalo = container.find('select');
                    Instancia.Objetos.$atualizarExibicaoIntervalo.change(function() {
                        Instancia.Layout.AtualizarExibicao.Intervalo = parseInt(this.value);
                    });
                    Instancia.Objetos.$atualizarExibicaoIntervalo.change();

                    container.find('button').click(() => {
                        Instancia.Layout.AtualizarExibicao.Executar();
                    });
                },
            });
        },

        BotaoAtivador: () => {
            Instancia.Geral.CarregarStylesheetCode(`
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
            `.replaceAll(':host', '.' + Instancia.Definicoes.CssClass));
            $('body').append(Instancia.Geral.FormatarString('<button id="ativador" class="{0} btn blue">{1}</button>', Instancia.Definicoes.CssClass, Instancia.Definicoes.Nome));
            Instancia.Objetos.$botaoAtivador = $('#ativador' + '.' + Instancia.Definicoes.CssClass);
        },

        Janela: () => {
            Instancia.Geral.CarregarStylesheetCode(`
                body > #janela {
                    display: none;
                }
            `.replaceAll(':host', '.' + Instancia.Definicoes.CssClass));
            $('body').append(Instancia.Geral.FormatarString('<div id="janela" class="{0}"></div>', Instancia.Definicoes.CssClass));
            Instancia.Objetos.$janela = $('#janela.' + Instancia.Definicoes.CssClass);
            Instancia.Objetos.$janelaModal = new jBox('Modal', {
                title: Instancia.Definicoes.Nome,
                content: Instancia.Objetos.$janela,
                attach: Instancia.Objetos.$botaoAtivador,
                width: 550,
                height: window.innerHeight * 0.8,
                overlay: false,
                draggable: 'title',
                repositionOnOpen: false,
                repositionOnContent: false,
                animation: 'zoomIn', //animation: zoomIn, zoomOut, pulse, move, slide, flip, tada
                blockScroll: false,
                onOpen: () => {
                    Instancia.Layout.AtualizarExibicao.Executar();
                    setTimeout(Instancia.Layout.AtualizarExibicao.Executar, 1000);
                }
            });
            if (Instancia.Definicoes.Debug) {
                Instancia.Objetos.$janelaModal.open();
            }
        },

        SolicitarLicenca: (modo) => {
            if ((modo === undefined || modo) && !Instancia.Objetos.$secaoLicenca) {
                Instancia.Layout.AdicionarSecao({
                    css: `
                        :host em {
                            color: #307DAC;
                            font-style: normal;
                        }
                        :host input {
                            margin-bottom: 15px;
                        }
                        :host .carregandoLicenca {
                            display: inline-block;
                            margin-left: 5px;
                            position: relative;
                            top: 1px;
                        }
                        :host .carregandoLicenca img {
                            height: 17px;
                            float: left;
                            margin-right: 5px;
                        }
                    `,

                    html: (`
                        <div>
                        <h1>Nenhum licença ativada</h1>
                        <p>Caso não tenha uma licença, compre uma <a href="https://glasgow.splitz.com.br/" target="_blank">aqui</a>.</p>
                        <p>Se tiver, infome o e-mail de cadastro para ativá-la.</p>
                        <p>Ou ainda, use o e-mail <em>{EmailDeContato}</em> para acesso gratuito aos módulos básicos.</p>
                        <input type="text" placeholder="Qual o seu e-mail?" />
                        <button class="btn red">Ativar licença</button>
                        <div class="carregandoLicenca"><img src='{img-carregando}'/> <span>Ativando licença...</span></div>
                        </div>
                    `).replaceAll('{EmailDeContato}', Instancia.Definicoes.EmailDeContato).replaceAll('{img-carregando}', Instancia.Geral.ImagemCarregando()),

                    js: (container) => {
                        Instancia.Objetos.$atualizarExibicao.before(container);
                        
                        Instancia.Objetos.$carregandoLicenca = container.find('.carregandoLicenca');
                        Instancia.Objetos.$carregandoLicenca.hide();

                        Instancia.Objetos.$secaoLicenca = container;

                        let ativandoLicenca = false;

                        container.find('button').click(() => {
                            if (!ativandoLicenca) {
                                ativandoLicenca = true;
                                Instancia.Objetos.$carregandoLicenca.show();
                                Instancia.Layout.Carregar(container.find('input').val()).then(() => {
                                    ativandoLicenca = false;
                                    Instancia.Objetos.$carregandoLicenca.hide();
                                    setTimeout(() => {
                                        if (Object.keys(Glasgow.Modulos).length) {
                                            Instancia.Objetos.$atualizarExibicao.show();
                                        }
                                    }, 1000);
                                });
                            }
                            else {
                                Instancia.Geral.Toast('Uma tentativa de ativação está em curso. Aguarde.', 'info');
                            }
                        })
                    }
                });
            } else if (Instancia.Objetos.$secaoLicenca) {
                if (modo) { Instancia.Objetos.$secaoLicenca.show(); }
                else { Instancia.Objetos.$secaoLicenca.hide(); }
            }
            if (Instancia.Objetos.$atualizarExibicao) {
                if (modo === undefined || modo) { Instancia.Objetos.$atualizarExibicao.hide(); }
                else { Instancia.Objetos.$atualizarExibicao.show(); }
            }
        },

        AdicionarSecao: (secao) => {
            if (typeof(secao) !== 'object') { return; }

            if (!Instancia.Objetos.$janela.children().length) {
                Instancia.Objetos.$janela.append(Instancia.Geral.FormatarString('<div class="secoes"></div><div class="carregandoModulos"><img src="{1}"/> Carregando módulos...</div><footer><div class="licenca"></div><a href="mailto:{0}" target="_blank">{0}</a></footer>', Instancia.Definicoes.EmailDeContato, Instancia.Geral.ImagemCarregando()));

                Instancia.Objetos.$janelaSecoes = Instancia.Objetos.$janela.find('.secoes');

                Instancia.Objetos.$carregandoModulos = Instancia.Objetos.$janela.find('.carregandoModulos');

                Instancia.Objetos.$licenca = Instancia.Objetos.$janela.find('.licenca');
                Instancia.Objetos.$licenca.html('Licenciado para <span class="nome"></span>. Clique <a class="sair" href="#">aqui</a> para sair. <div>Seus módulos: <span class="modulos"></span></div>');
                Instancia.Objetos.$licenca.find('a').click(function(e) {
                    Instancia.Api.Licenca(null);
                    Instancia.Geral.Toast('Você saiu! Atualize a página para efetivar.', 'warning');
                    e.preventDefault();
                });

                Instancia.Geral.CarregarStylesheetCode(`
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
                    :host .secoes > h1 span {
                        color: #5A97BC;
                    }
                    :host .carregandoModulos {
                        font-size: 20px;
                        text-align: center;
                        margin: 20px 0;
                        display: none;
                    }
                    :host .carregandoModulos img {
                        vertical-align: middle;
                        margin-right: 5px;
                        position: relative;
                        top: -1px;
                    }
                    :host .licenca {
                        margin-bottom: 10px;
                        padding-bottom: 10px;
                        border-bottom: 1px solid lightgray;
                        display: none;
                    }
                    :host .licenca .nome {
                        color: #307DAC;
                    }
                    :host .licenca .sair {
                        color: orangered;
                    }   
                    :host .licenca .modulos {
                        font-weight: bold;
                    }                    
                `.replaceAll(':host', '.' + Instancia.Definicoes.CssClass).replaceAll('{img-carregando}', Instancia.Geral.ImagemCarregando()));
            }

            const secaoId = 'id' + (Instancia.Objetos.$janelaSecoes.find('article').length + 1);

            Instancia.Geral.CarregarStylesheetCode(secao.css.replaceAll(':host', '.' + Instancia.Definicoes.CssClass + ' article.' + secaoId));

            const titulo = secao.titulo ? Instancia.Geral.FormatarString('<h1>{0} <span>{1}</span></h1>', secao.titulo, secao.versao ? secao.versao : '') : '';
            const html = Instancia.Geral.FormatarString('{1}<article class="{0}">{2}</article>', secaoId, titulo, secao.html);

            Instancia.Objetos.$janelaSecoes.append(html);

            Instancia.Objetos.$janela.find(".secoes > h1:last").click(function() {
                $(this).next().slideToggle();
            });

            const container = $(Instancia.Objetos.$janela.find(".secoes > article:last").get(0));
            Instancia.Geral.InputNumber(container.find('input[number]'));
            container.find('*[title]').each((i, o) => {
                const delay = [ 'BUTTON', 'INPUT' ];
                const cssClass = 'c' + btoa(Math.random()).substr(5, 10);
                $(o).addClass(cssClass);
                new jBox('Tooltip', { attach: '.' + cssClass, delayOpen: delay.indexOf(o.tagName) < 0 ? 500 : 1500 });
            });

            const fRadioCheckboxClick = function() {
                const $input = $(this).parent().find('input');
                if ($input.attr('type') === 'radio') {
                    const name = $input.attr('name');
                    if (name) {
                        $('input[type="radio"][name="' + name + '"]').prop('checked', false).iCheck('update');
                    }
                    $input.prop('checked', true).iCheck('update');
                }
                else {
                    $input.prop('checked', !$input.prop('checked')).iCheck('update');
                }
                $input.trigger('ifChanged');
            }
            container.find('.radio label, .checkbox label').click(fRadioCheckboxClick);
            const iCheck = container.find('.radio input[type="radio"], .checkbox input[type="checkbox"]');
            iCheck.iCheck();
            iCheck.on('ifChanged', function (event) { $(event.target).trigger('change'); });

            container.find('select').niceSelect();

            if (secao.js instanceof Function) { secao.js(container, secaoId); }

            if (secao.atualizarExibicao instanceof Function) { Instancia.Layout.AtualizarExibicao.Lista.push(secao.atualizarExibicao); }
        }
    };

    Instancia.LuckygamesIo = {
        EsperarAmbiente: () => {
            return new Promise((resolve) => {
                const fAmbienteOk = () => {
                    if (window.Game && window.Game.runDice && $('#balance').length) {
                        console.logg('Ambiente Luckygames.io pronto para uso.');
                        resolve();
                    }
                    else {
                        console.logg('Esperando ambiente Luckygames.io estar pronto.')
                        setTimeout(fAmbienteOk, 1000);
                    }
                }
                fAmbienteOk();
            });
        },

        Implementar: () => {
            Instancia.LuckygamesIo.ReferenciarObjetos();
            Instancia.LuckygamesIo.CarregarValoresMultiplicadores();

            Instancia.InterceptadorAjax.Anexar('BugICheckEvent', 'request', 0, () => { setTimeout(Instancia.LuckygamesIo.BugICheckEvent, 1000); });
        },
        
        BugICheckEventLista: [],
        BugICheckEvent: function (selector, obj, fnc) {
            if (arguments.length === 0) {
                for (let i = 0; i < Instancia.LuckygamesIo.BugICheckEventLista.length; i++) {
                    Instancia.LuckygamesIo.BugICheckEvent(Instancia.LuckygamesIo.BugICheckEventLista[i]);
                }
            }
            else {
                let data;
                if (typeof(selector) === 'string') {
                    data = { selector: selector, obj: obj, fnc: fnc };
                    Instancia.LuckygamesIo.BugICheckEventLista.push(data);
                }
                else {
                    data = selector;
                }
                data.obj.$ = $(data.selector);
                data.obj.$.off('ifChanged', data.fnc);
                data.obj.$.on('ifChanged', data.fnc);
                if (data.obj.$.length === 1) {
                    data.obj.o = data.obj.$.get(0);
                }
                else {
                    if (Array.isArray(data.obj.o)) { data.obj.o.length = 0; }
                    else { data.obj.o = []; }
                    for (let i = 0; i < data.obj.$.length; i++) {
                        data.obj.o.push(data.obj.$.get(i));
                    }
                }
                
                return data.obj.$;
            }
        },

        ReferenciarObjetos: () => {
            Instancia.LuckygamesIo.Objetos.clientSeed = $('#clientSeed').get(0);
            Instancia.LuckygamesIo.Objetos.$rollOver = $('#rollOver');
            Instancia.LuckygamesIo.Objetos.prediction = $('#prediction').get(0);
            Instancia.LuckygamesIo.Objetos.balance = $('#balance').get(0);
            Instancia.LuckygamesIo.Objetos.betAmount = $('#betAmount').get(0);
            Instancia.LuckygamesIo.Objetos.profitOnWin = $('#profitOnWin').get(0);
            Instancia.LuckygamesIo.Objetos.coinID = $('#coinID').get(0);
        },

        ValoresMultiplicadores: '0'.repeat(98).split('').map((o, i) => parseInt(i) + 1).reduce((a, c) => { a['_' + c] = 0; return a; }, { }),

        CarregarValoresMultiplicadores: () => {
            const bkp = {
                betAmount: Instancia.LuckygamesIo.Objetos.betAmount.value,
                prediction: Instancia.LuckygamesIo.Objetos.prediction.value
            }
            Instancia.LuckygamesIo.Objetos.$rollOver.click();
            Instancia.LuckygamesIo.Objetos.betAmount.value = 1;
            Object.keys(Glasgow.LuckygamesIo.ValoresMultiplicadores).forEach((o, i, a) => { 
                Instancia.LuckygamesIo.Objetos.prediction.value = o.substr(1);
                Game.calculate();
                Glasgow.LuckygamesIo.ValoresMultiplicadores[o] = parseFloat(Instancia.LuckygamesIo.Objetos.profitOnWin.value);
            });
            Instancia.LuckygamesIo.Objetos.betAmount.value = bkp.betAmount;
            Instancia.LuckygamesIo.Objetos.prediction.value = bkp.prediction;
            Game.calculate();
        },

        PararApostas: () => {
            Game.stopAutoplay();
            Game.playFlag = false;
        },

        Parametros: {
            UserHash: () => {
                return window.user ? window.user.hash : '';
            },
            ClientSeed: (valor) => {
                if (!Instancia.LuckygamesIo.Objetos.clientSeed) { return null; }
                if (valor !== undefined) {
                    Instancia.LuckygamesIo.Objetos.clientSeed.value = valor;
                }
                return Instancia.LuckygamesIo.Objetos.clientSeed.value;
            },
            Balance: (valor) => {
                if (!Instancia.LuckygamesIo.Objetos.balance) { return null; }
                if (typeof(valor) === 'number') {
                    Instancia.LuckygamesIo.Objetos.balance.value = valor.toFixed(8);
                }
                return parseFloat(Instancia.LuckygamesIo.Objetos.balance.value);
            },
            Usuario: () => {
                return window.user && window.user.name ? window.user.name : '';
            },
            Moeda: () => {
                return $('.name', '#coin' + $('#coinID').val()).text();
            },
        },

        Objetos: {},
    };

    Instancia.Estatisticas = {
        Implementar: () => {
            setTimeout(Instancia.Estatisticas.Reiniciar, 500);
            Instancia.InterceptadorAjax.Anexar('EstatisticasBase', 'response', 0, Instancia.Estatisticas.Contabilizar);
        },

        Parametros: {
            LimiteListaSaldoHistorico: 100,
            LimiteListaUltimasSequencias: 100,
        },

        Contabilizar: (resultado, response, request, xhr) => {
            if (xhr.responseURL.indexOf('coin=') >= 0 && xhr.responseURL.indexOf('action=AjaxContent') >= 0) {
                Instancia.Estatisticas.Reiniciar();
                Instancia.Layout.AtualizarExibicao.Executar();
                Instancia.Geral.Toast('Você trocou a moeda de operação. As estatísticas foram reiniciadas.', 'warning');
            }

            if (resultado !== 'load' || 
                !request || !response || 
                request.game !== 'dice' || 
                request.betAmount === undefined || 
                !response.result) { 
                Instancia.Layout.AtualizarExibicao.Executar();
                return; 
            }

            const balance = parseFloat(response.balance);
            const profit = parseFloat(response.profit);
            const betAmount = parseFloat(request.betAmount);
            const resultNumber = parseFloat(response.resultNumber);

            Instancia.Estatisticas.Dados.tempoFinal = new Date();
            if (Instancia.Estatisticas.Dados.tempoInicio === null) { Instancia.Estatisticas.Dados.tempoInicio = Instancia.Estatisticas.Dados.tempoFinal; }

            Instancia.Estatisticas.Dados.saldoHistorico.push(balance);
            while (Instancia.Estatisticas.Dados.saldoHistorico.length > Instancia.Estatisticas.Parametros.LimiteListaSaldoHistorico) {
                Instancia.Estatisticas.Dados.saldoHistorico.shift();
            }
            
            if (balance < Instancia.Estatisticas.Dados.saldoMenor) { Instancia.Estatisticas.Dados.saldoMenor = balance; }
            if (balance > Instancia.Estatisticas.Dados.saldoMaior) { Instancia.Estatisticas.Dados.saldoMaior = balance; }

            Instancia.Estatisticas.Dados.apostaQuantidade++;
            
            if (response.gameResult === 'lose') { 
                Instancia.Estatisticas.Dados.apostaQuantidadePerdida++;
                Instancia.Estatisticas.Dados.sequenciaPerdendo++;
                if (Instancia.Estatisticas.Dados.sequenciaPerdendo > Instancia.Estatisticas.Dados.sequenciaPerdendoMaxima) {
                    Instancia.Estatisticas.Dados.sequenciaPerdendoMaxima = Instancia.Estatisticas.Dados.sequenciaPerdendo;
                }
                if (Instancia.Estatisticas.Dados.sequenciaVencendo > 0) {
                    if (Instancia.Estatisticas.Dados.sequenciaVencendoRecorrente[Instancia.Estatisticas.Dados.sequenciaVencendo - 1] === undefined) {
                        Instancia.Estatisticas.Dados.sequenciaVencendoRecorrente[Instancia.Estatisticas.Dados.sequenciaVencendo - 1] = 1;
                    }
                    else {
                        Instancia.Estatisticas.Dados.sequenciaVencendoRecorrente[Instancia.Estatisticas.Dados.sequenciaVencendo - 1]++;
                    }
                    Instancia.Estatisticas.Dados.sequenciaHistorico.unshift(+Instancia.Estatisticas.Dados.sequenciaVencendo);
                    Instancia.Estatisticas.Dados.sequenciaVencendo = 0;
                }
                Instancia.Estatisticas.Dados.predicao[0]++;
            }
            if (response.gameResult === 'win') { 
                Instancia.Estatisticas.Dados.apostaQuantidadeVencida++;
                Instancia.Estatisticas.Dados.sequenciaVencendo++;
                if (Instancia.Estatisticas.Dados.sequenciaVencendo > Instancia.Estatisticas.Dados.sequenciaVencendoMaxima) {
                    Instancia.Estatisticas.Dados.sequenciaVencendoMaxima = Instancia.Estatisticas.Dados.sequenciaVencendo;
                }
                if (Instancia.Estatisticas.Dados.sequenciaPerdendo > 0) {
                    if (Instancia.Estatisticas.Dados.sequenciaPerdendoRecorrente[Instancia.Estatisticas.Dados.sequenciaPerdendo - 1] === undefined) {
                        Instancia.Estatisticas.Dados.sequenciaPerdendoRecorrente[Instancia.Estatisticas.Dados.sequenciaPerdendo - 1] = 1;
                    }
                    else {
                        Instancia.Estatisticas.Dados.sequenciaPerdendoRecorrente[Instancia.Estatisticas.Dados.sequenciaPerdendo - 1]++;
                    }
                    Instancia.Estatisticas.Dados.sequenciaHistorico.unshift(-Instancia.Estatisticas.Dados.sequenciaPerdendo);
                    Instancia.Estatisticas.Dados.sequenciaPerdendo = 0;
                }
                Instancia.Estatisticas.Dados.predicao[1]++;
            }
            if (Instancia.Estatisticas.Dados.sequenciaHistorico.length > Instancia.Estatisticas.Parametros.LimiteListaUltimasSequencias) {
                Instancia.Estatisticas.Dados.sequenciaHistorico.length = Instancia.Estatisticas.Parametros.LimiteListaUltimasSequencias;
            }

            Instancia.Estatisticas.Dados.sequencias.push(response.gameResult === 'win' ? 1 : -1);
            const limiteListaSequencias = 10 + (Instancia.Estatisticas.Dados.sequenciaPerdendoMaxima + Instancia.Estatisticas.Dados.sequenciaVencendoMaxima);
            while (Instancia.Estatisticas.Dados.sequencias.length > 40 || Instancia.Estatisticas.Dados.sequencias.length > limiteListaSequencias) {
                Instancia.Estatisticas.Dados.sequencias.shift();
            }

            if (response.gameResult === 'win' &&
                (Instancia.Estatisticas.Dados.apostaMelhores.length === 0 || profit > Instancia.Estatisticas.Dados.apostaMelhores[0].profit)) {
                Instancia.Estatisticas.Dados.apostaMelhores.push({
                    id: response.id,
                    betAmount: betAmount,
                    profit: profit,
                });
                while (Instancia.Estatisticas.Dados.apostaMelhores.length > 10) {
                    Instancia.Estatisticas.Dados.apostaMelhores.shift();
                }
                Instancia.Estatisticas.Dados.apostaMelhores.sort((a, b) => a.profit - b.profit);
            }

            Instancia.Estatisticas.Dados.apostaLucro += profit;

            if (Instancia.Estatisticas.Dados.apostaMenor === null || betAmount < Instancia.Estatisticas.Dados.apostaMenor) { Instancia.Estatisticas.Dados.apostaMenor = betAmount; }
            if (Instancia.Estatisticas.Dados.apostaMaior === null || betAmount > Instancia.Estatisticas.Dados.apostaMaior) { Instancia.Estatisticas.Dados.apostaMaior = betAmount; }

            Instancia.Estatisticas.Dados.apostaUltima = betAmount;
            Instancia.Estatisticas.Dados.apostaTotal += betAmount;

            Instancia.Estatisticas.Dados.sorteados[resultNumber]++;

            Instancia.Layout.AtualizarExibicao.Executar(false);
        },

        Reiniciar: () => {
            Instancia.LuckygamesIo.ReferenciarObjetos();

            Instancia.Estatisticas.Dados.tempoInicio = null;
            Instancia.Estatisticas.Dados.tempoFinal = null;
            if (Instancia.Estatisticas.Dados.saldoHistorico === undefined) { Instancia.Estatisticas.Dados.saldoHistorico = []; }
            else { Instancia.Estatisticas.Dados.saldoHistorico.length = 0; }
            Instancia.Estatisticas.Dados.saldoInicial = Instancia.LuckygamesIo.Parametros.Balance();
            Instancia.Estatisticas.Dados.saldoMenor = Instancia.Estatisticas.Dados.saldoInicial;
            Instancia.Estatisticas.Dados.saldoMaior = Instancia.Estatisticas.Dados.saldoInicial;
            Instancia.Estatisticas.Dados.apostaQuantidade = 0;
            Instancia.Estatisticas.Dados.apostaMenor = null;
            Instancia.Estatisticas.Dados.apostaMaior = null;
            Instancia.Estatisticas.Dados.apostaUltima = null;
            Instancia.Estatisticas.Dados.apostaTotal = 0;
            Instancia.Estatisticas.Dados.apostaQuantidadePerdida = 0;
            Instancia.Estatisticas.Dados.apostaQuantidadeVencida = 0;
            Instancia.Estatisticas.Dados.apostaLucro = 0;
            if (Instancia.Estatisticas.Dados.apostaMelhores === undefined) { Instancia.Estatisticas.Dados.apostaMelhores = []; }
            else { Instancia.Estatisticas.Dados.apostaMelhores.length = 0; }
            if (Instancia.Estatisticas.Dados.sequencias === undefined) { Instancia.Estatisticas.Dados.sequencias = []; }
            else { Instancia.Estatisticas.Dados.sequencias.length = 0; }
            Instancia.Estatisticas.Dados.sequenciaPerdendo = 0;
            Instancia.Estatisticas.Dados.sequenciaPerdendoMaxima = 0;
            if (Instancia.Estatisticas.Dados.sequenciaPerdendoRecorrente === undefined) { Instancia.Estatisticas.Dados.sequenciaPerdendoRecorrente = []; }
            else { Instancia.Estatisticas.Dados.sequenciaPerdendoRecorrente.length = 0; }
            Instancia.Estatisticas.Dados.sequenciaVencendo = 0;
            Instancia.Estatisticas.Dados.sequenciaVencendoMaxima = 0;
            if (Instancia.Estatisticas.Dados.sequenciaVencendoRecorrente === undefined) { Instancia.Estatisticas.Dados.sequenciaVencendoRecorrente = []; }
            else { Instancia.Estatisticas.Dados.sequenciaVencendoRecorrente.length = 0; }
            if (Instancia.Estatisticas.Dados.sequenciaHistorico === undefined) { Instancia.Estatisticas.Dados.sequenciaHistorico = []; }
            else { Instancia.Estatisticas.Dados.sequenciaHistorico.length = 0; }
            if (Instancia.Estatisticas.Dados.sorteados === undefined) { Instancia.Estatisticas.Dados.sorteados = Array(100); }
            Instancia.Estatisticas.Dados.sorteados.fill(0);
            Instancia.Estatisticas.Dados.predicao = [0, 0];
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
                apostaLucroPercentual: () => {
                    const saldoInicial = Instancia.Estatisticas.Dados.saldoInicial;
                    const saldoFinal = saldoInicial + Instancia.Estatisticas.Dados.apostaLucro;
                    return (saldoFinal / saldoInicial - 1) * 100;
                },
                tempoCorrido: () => {
                    if (Instancia.Estatisticas.Dados.tempoFinal === null || Instancia.Estatisticas.Dados.tempoInicio === null) {
                        return new Date(0);
                    }
                    else {
                        return new Date(Instancia.Estatisticas.Dados.tempoFinal - Instancia.Estatisticas.Dados.tempoInicio);
                    }
                },
                velocidade: () => {
                    const tempoCorrido = Instancia.Estatisticas.Dados.Calculo.tempoCorrido().getTime();
                    if (tempoCorrido === 0) {
                        return 0;
                    }
                    else {
                        return Instancia.Estatisticas.Dados.apostaQuantidade / (tempoCorrido / 1000 / 60);
                    }
                },
            },
            Formatado: {
                Predicao: () => {
                    const result = Instancia.Estatisticas.Dados.predicao;
                    if (result[0] === 0 && result[1] === 0) {
                        return [1, 1];
                    }
                    else {
                        return result;
                    }
                },
                SaldoHistorico: () => {
                    let result = Instancia.Estatisticas.Dados.saldoHistorico;
                    while (result.length < 2) {
                        result = result.slice();
                        result.unshift(Instancia.Estatisticas.Dados.Calculo.saldoAtual());
                    }
                    while (result.length > Instancia.Estatisticas.Parametros.LimiteListaSaldoHistorico) {
                        result.shift();
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
                    return Instancia.Estatisticas.Dados.Calculo.lucro().formatado({ sinal: true });
                },
                LucroPercentual: () => {
                    const result = Instancia.Estatisticas.Dados.Calculo.lucroPercentual();
                    return isNaN(result) ? '—' : result.formatado({ digitos:2, sufixo: '%', sinal: true });
                },
                TempoInicio: () => { 
                    const result = Instancia.Estatisticas.Dados.tempoInicio;
                    return result === null ? '—' : result.formatado();
                },
                TempoFinal: () => { 
                    const result = Instancia.Estatisticas.Dados.tempoFinal;
                    return result === null ? '—' : result.formatado();
                },
                TempoCorrido: () => { 
                    return Instancia.Estatisticas.Dados.Calculo.tempoCorrido().formatado('corrido');
                },
                ApostaMelhores: () => {
                    const result = [];
                    Instancia.Estatisticas.Dados.apostaMelhores.forEach((val) => {
                        result.unshift({
                            id: val.id,
                            url: 'https://luckygames.io/bet/' + val.id + '/',
                            aposta: val.betAmount.formatado(),
                            ganho: val.profit.formatado(),
                        });
                    });
                    return result;
                },
                Velocidade: () => { 
                    return Instancia.Estatisticas.Dados.Calculo.velocidade().formatado({ digitos: 2, sufixo: ' apostas/min.' });
                },
                ApostaQuantidade: () => { 
                    return Instancia.Estatisticas.Dados.apostaQuantidade.formatado({ digitos: 0 });
                },
                ApostaMenor: () => {
                    const result = Instancia.Estatisticas.Dados.apostaMenor;
                    return result === null ? '—' : result.formatado();
                },
                ApostaMaior: () => { 
                    const result = Instancia.Estatisticas.Dados.apostaMaior;
                    return result === null ? '—' : result.formatado();
                },
                ApostaUltima: () => { 
                    return Instancia.Estatisticas.Dados.apostaUltima !== null ? Instancia.Estatisticas.Dados.apostaUltima.formatado() : '—';
                },
                ApostaTotal: () => { 
                    return Instancia.Estatisticas.Dados.apostaTotal.formatado();
                },
                ApostaLucro: () => { 
                    return Instancia.Estatisticas.Dados.apostaLucro.formatado({ sinal: true });
                },
                ApostaLucroPercentual: () => { 
                    const result = Instancia.Estatisticas.Dados.Calculo.apostaLucroPercentual();
                    return isNaN(result) ? '—' : result.formatado({ digitos:2, sufixo: '%', sinal: true });
                },
                EstatisticaPerdidasVencidas: () => {
                    const result = [ Instancia.Estatisticas.Dados.apostaQuantidadePerdida, Instancia.Estatisticas.Dados.apostaQuantidadeVencida ];
                    if (result[0] === 0 && result[1] === 0) {
                        result[0] = result[1] = 1;
                    }
                    return result;
                },
                ApostaQuantidadePerdida: () => { 
                    return Instancia.Estatisticas.Dados.apostaQuantidadePerdida.formatado({ digitos: 0 });
                },
                ApostaQuantidadeVencida: () => { 
                    return Instancia.Estatisticas.Dados.apostaQuantidadeVencida.formatado({ digitos: 0 });
                },
                Sequencias: () => { 
                    return Instancia.Estatisticas.Dados.sequencias;
                },
                SequenciaPerdendo: () => { 
                    return Instancia.Estatisticas.Dados.sequenciaPerdendo.formatado({ digitos: 0 });
                },
                SequenciaPerdendoMaxima: () => { 
                    return Instancia.Estatisticas.Dados.sequenciaPerdendoMaxima.formatado({ digitos: 0 });
                },
                SequenciaPerdendoRecorrente: () => { 
                    for (var i = 0; i < Instancia.Estatisticas.Dados.sequenciaPerdendoRecorrente.length; i++) {
                        if (Instancia.Estatisticas.Dados.sequenciaPerdendoRecorrente[i] === undefined) {
                            Instancia.Estatisticas.Dados.sequenciaPerdendoRecorrente[i] = 0;
                        }
                    }
                    return Instancia.Estatisticas.Dados.sequenciaPerdendoRecorrente;
                },
                SequenciaVencendo: () => { 
                    return Instancia.Estatisticas.Dados.sequenciaVencendo.formatado({ digitos: 0 });
                },
                SequenciaVencendoMaxima: () => { 
                    return Instancia.Estatisticas.Dados.sequenciaVencendoMaxima.formatado({ digitos: 0 });
                },
                SequenciaVencendoRecorrente: () => { 
                    for (var i = 0; i < Instancia.Estatisticas.Dados.sequenciaVencendoRecorrente.length; i++) {
                        if (Instancia.Estatisticas.Dados.sequenciaVencendoRecorrente[i] === undefined) {
                            Instancia.Estatisticas.Dados.sequenciaVencendoRecorrente[i] = 0;
                        }
                    }
                    return Instancia.Estatisticas.Dados.sequenciaVencendoRecorrente;
                },
                Sorteados: () => {
                    return Instancia.Estatisticas.Dados.sorteados;
                },
                SorteadosPercentual: () => {
                    return Instancia.Estatisticas.Dados.sorteados.reduce((a, c, i, ar) => { if (c > 0) a.push({ numero: i, sorteios: c, percentual: ((c / ar.reduce((a2, c2) => a2 + c2)) * 100).toFixed(2).replace('.', Instancia.Definicoes.SeparadorDecimal) + '%' }); return a; } , []).sort((a, b) => { return b.sorteios !== a.sorteios ? b.sorteios - a.sorteios : a.numero - b.numero; });
                }
            }
        },
    };

    Instancia.Inicializar();

    return Instancia;
})();