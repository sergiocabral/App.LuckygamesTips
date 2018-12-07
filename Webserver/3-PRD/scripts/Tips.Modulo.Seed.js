window.Tips = window.Tips || {};
if (window.Tips.Modulos) {
    window.Tips.Modulos.Seed = window.Tips.Modulos.Seed || new (function() {

        const Instancia = window.Tips;
        const Modulo = this;

        Modulo.Inicializar = () => {
            Instancia.Layout.AdicionarSecao(Modulo.Secao);
            Instancia.InterceptadorAjax.Anexar('ModuloSeed', 'request', 10, Modulo.AntesDaAposta);
            Instancia.InterceptadorAjax.Anexar('ModuloSeed', 'response', 10, Modulo.DepoisDaAposta);
        };

        Modulo.Objetos = {};

        Modulo.AntesDaAposta = (queryString) => {
            if (!queryString || queryString.betAmount === undefined || !Modulo.ObterSeed) { return; }

            let trocaSeed = false;
            if (Modulo.Estatisticas.apostas >= parseInt(Modulo.Parametros.apostas)) {
                trocaSeed = true;
                Modulo.Estatisticas.apostas = 0;
            }
            if (Modulo.Estatisticas.sequenciaPerdendo >= parseInt(Modulo.Parametros.sequenciaPerdendo)) {
                trocaSeed = true;
                Modulo.Estatisticas.sequenciaPerdendo = 0;
            }
            if (Modulo.Estatisticas.sequenciaVencendo >= parseInt(Modulo.Parametros.sequenciaVencendo)) {
                trocaSeed = true;
                Modulo.Estatisticas.sequenciaVencendo = 0;
            }

            if (trocaSeed) {
                const seed = Modulo.ObterSeed(true);
                if (seed) {
                    queryString.clientSeed = seed;
                }
            }
        }

        Modulo.DepoisDaAposta = (resultado, response, request) => {
            if (resultado !== 'load' || 
                !response || 
                !request) { return; }
            
            if (request.action === 'randomizeSeed' && response.clientSeed) {
                Modulo.Objetos.seed.value = response.clientSeed;
            }

            if (request.betAmount !== undefined) {
                Modulo.Estatisticas.apostas++;
                if (response.gameResult === 'lose') {
                    Modulo.Estatisticas.sequenciaVencendo = 0;
                    Modulo.Estatisticas.sequenciaPerdendo++;
                }
                else if (response.gameResult === 'win') {
                    Modulo.Estatisticas.sequenciaPerdendo = 0;
                    Modulo.Estatisticas.sequenciaVencendo++;
                }
            }
        }

        Modulo.Secao = {
            versao: 'v3',

            titulo: 'Seed',
    
            css: `
                :host .seed input {
                    color: royalblue;
                    font-weight: bold;
                    font-size: 15px;
                    padding: 6px 0 3px 0;
                }
                :host table.parametros td {
                    padding-bottom: 2px;
                }
                :host table.parametros td:nth-child(1) {
                    width: 80%;
                    text-align: right;
                }
                :host table.configuracao td:nth-child(1) {
                    width: 20%;
                }
                :host button.limpar {
                    margin-bottom: 10px;
                }
            `,
            
            html: `
                <p class="info">
                    O Seed é um valor usado para gerar um número aleatório.
                    Trocar o Seed de tempos em tempos torna o processo mais aleatório.
                    Entenda melhor aqui: <a href="https://luckygames.io/page/fair/" target="_blank">https://luckygames.io/page/fair/</a>
                    <br /><br />
                    Determine abaixo as condições para trocar o Seed: 
                </p>
                <table class="parametros">
                    <tr class="tempo">
                        <td><label title="A troca do seed é feita&lt;br/&gt;a cada ciclo de tempo.">Em quandos segundos:</label></td>
                        <td><input type="text" number number-min="1" number-digitos="0" /></td>
                    </tr>
                    <tr class="apostas">
                        <td><label title="A troca do Seed acontece&lt;br/&gt;na aposta indicada nesta vez.">Em quantas apostas:</label></td>
                        <td><input type="text" number number-min="1" number-digitos="0" value="1" /></td>
                    </tr>
                    <tr class="sequenciaPerdendo">
                        <td><label title="Se perder consecutivamente&lt;br/&gt;por tantas vezes troca o Seed.">Numa sequência perdendo em:</label></td>
                        <td><input type="text" number number-min="1" number-digitos="0" /></td>
                    </tr>
                    <tr class="sequenciaVencendo">
                        <td><label title="Se vencer consecutivamente&lt;br/&gt;por tantas vezes troca o Seed.">Numa sequência vencendo em:</label></td>
                        <td><input type="text" number number-min="1" number-digitos="0" /></td>
                    </tr>
                </table>
                <div class="controles"><button class="btn grey limpar" title="Para de trocar o seed automaticamente&lt;br/&gt;por limpar os valores acima.">Limpar</button></div>
                <div class="divisor"></div>
                <table class="configuracao">
                    <tr class="modo">
                        <td><label title="Determina o modo de gerar o Seed.">Modo:</label></td>
                        <td>
                            <select>
                                <option value="servidor">Servidor</option>
                                <option value="cliente">Cliente</option>
                                <option value="criptografico" selected>Criptografico</option>
                                <option value="customizado">Customizado</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td>&nbsp;</td>
                        <td class="info">
                            <ul>
                                <li>
                                    <strong>Servidor:</strong>
                                    Modo tradicional do próprio site. Uma requisição é enviada ao servidor
                                    e um Seed é recebido da própria Luckygames.io
                                </li>
                                <li>
                                    <strong>Cliente:</strong>
                                    Um valor de Seed, seguindo o mesmo formato do original, é gerado
                                    localmente sem precisar recorrer a Luckygames.io. Dessa forma
                                    se aumenta a certeza de ausência de manipulação de resultados.
                                </li>
                                <li>
                                    <strong>Criptografico:</strong>
                                    Um valor de Seed, seguindo o mesmo formato do original, é gerado
                                    no servidor do ` + Instancia.Definicoes.Nome + ` usando criptografia para tornar bem mais difícil
                                    de ser descoberto.
                                </li>
                                <li>
                                    <strong>Customizado:</strong>
                                    Você escreve abaixo o valor do Seed. <u>Nesse modo o Seed 
                                    fica fixo</u>.
                                </li>
                            </ul>
                        </td>
                    </tr>
                    <tr class="seed">
                        <td><label title="Este é o valor do Seed que&lt;br/&gt;será usado na próxima aposta.">Seed atual:</label></td>
                        <td><input type="text" maxlength="32" /></td>
                    </tr>
                </table>
                <div class="controles"><button class="btn grey gerar" title="Clique para trocar o Seed imediatamente.">Trocar Seed</button></div>
            `,

            js: (container) => {
                container.find('button.limpar').click(() => {
                    container.find('table.parametros input').val('').blur();
                });

                Modulo.Objetos.$tempo = container.find('table.parametros .tempo input');
                Modulo.Objetos.$apostas = container.find('table.parametros .apostas input');
                Modulo.Objetos.$sequenciaPerdendo = container.find('table.parametros .sequenciaPerdendo input');
                Modulo.Objetos.$sequenciaVencendo = container.find('table.parametros .sequenciaVencendo input');                

                container.find('table.parametros input').blur(function() {
                    const input = $(this);
                    if (this.value) { input.addClass('bg-ativo'); }
                    else { input.removeClass('bg-ativo'); }

                    const parametro = input.closest('tr').attr('class');
                    const valor = this.number();
                    Modulo.Parametros[parametro] = valor;
                    if (parametro === 'tempo') {
                        clearTimeout(Modulo.Estatisticas[parametro]);
                        if (Number.isFinite(valor)) {
                            Modulo.Estatisticas[parametro] = setInterval(() => {
                                Modulo.ObterSeed(true);
                            }, valor * 1000);
                        }
                    }
                    else {
                        Modulo.Estatisticas[parametro] = 0;
                    }
                });
                container.find('table.parametros input').blur();

                Modulo.Objetos.$modo = container.find('select');
                Modulo.Objetos.$modo.change(function() {
                    const modo = $(this).val();
                    if (Modulo.ObterSeed) {
                        Modulo.TrocaSeed(modo);
                    }
                    Modulo.ObterSeed = Modulo.ObterSeedFunction(modo);
                });
                Modulo.Objetos.$modo.change();

                Modulo.Objetos.$seed = container.find('.seed input');
                Modulo.Objetos.seed = Modulo.Objetos.$seed.get(0);
                Modulo.Objetos.$seed.val(Instancia.LuckygamesIo.Parametros.ClientSeed());
                Modulo.Objetos.$seed.change(function() {
                    const modo = 'customizado';
                    Modulo.ObterSeed = Modulo.ObterSeedFunction(modo);
                    Modulo.Objetos.$modo.val(modo).niceSelect('update');
                    Modulo.DefinirSeed(this.value);
                });

                Modulo.Objetos.$gerar = container.find('button.gerar');
                Modulo.Objetos.$gerar.click(() => {
                    Modulo.TrocaSeed(Modulo.Objetos.$modo.val());
                });
                Modulo.Objetos.$gerar.click();
            }
        };

        Modulo.Estatisticas = {
            apostas: 0,
            sequenciaPerdendo: 0,
            sequenciaVencendo: 0,
        }

        Modulo.Parametros = {
            tempo: null,
            apostas: null,
            sequenciaPerdendo: null,
            sequenciaVencendo: null,
        }

        Modulo.DefinirSeed = (seed) => {
            Instancia.LuckygamesIo.Objetos.clientSeed.value = 
            Modulo.Objetos.seed.value = 
            seed;
        };

        Modulo.TrocaSeed = (modo) => {
            return new Promise((resolve) => {
                Modulo.ObterSeedFunction(modo)().then((seed) => {
                    Modulo.DefinirSeed(seed);
                    resolve(seed);
                });
            });
        };

        Modulo.ObterSeedFunction = (modo) => {
            switch(modo) {
                case 'servidor': return Modulo.ObterSeedServidor;
                case 'cliente': return Modulo.ObterSeedCliente;
                case 'customizado': return Modulo.ObterSeedCustomizado;
                case 'criptografico': return Modulo.ObterSeedCriptografico;
            }
        };

        Modulo.ObterSeed = null;

        Modulo.ObterSeedServidor = (notPromise) => {
            const fObterSeed = (resolve) => {
                if (Modulo.Params.ObterSeedServidor.executando) {
                    resolve(Instancia.LuckygamesIo.Objetos.clientSeed.value);
                    return; 
                }
                Modulo.Params.ObterSeedServidor.executando = true;

                Instancia.LuckygamesIo.Ajax({
                    action: "randomizeSeed",
                    hash: Instancia.LuckygamesIo.Parametros.UserHash()
                })
                .done((response) => {
                    resolve(response.clientSeed);
                })
                .fail(() => {
                    Instancia.Geral.Toast('Ops! Ocorreu um erro ao solicitar um novo Seed ao servidor. Tente novamente.', 'warning');
                })
                .always(() => {
                    Modulo.Params.ObterSeedServidor.executando = false;
                });
            };

            if (notPromise) {
                fObterSeed(Modulo.DefinirSeed);
                return null;
            }
            else {
                return new Promise((resolve) => fObterSeed(resolve));
            }
        };

        Modulo.ObterSeedCliente = (notPromise) => {
            const seed = (parseInt(Math.random() * Math.pow(10, 15)).toString(16) + parseInt(Math.random() * Math.pow(10, 15)).toString(16) + parseInt(Math.random() * Math.pow(10, 15)).toString(16)).substr(0, 32);
            const fObterSeed = (resolve) => {
                resolve(seed);
            };

            if (notPromise) {
                fObterSeed(Modulo.DefinirSeed);
                return seed;
            }
            else {
                return new Promise((resolve) => fObterSeed(resolve));
            }
        };

        Modulo.ObterSeedCustomizado = (notPromise) => {
            const fObterSeed = (resolve) => {
                if (Modulo.Params.ObterSeedCustomizado.executando) {
                    resolve(Instancia.LuckygamesIo.Objetos.clientSeed.value);
                    return; 
                }
                Modulo.Params.ObterSeedCustomizado.executando = true;

                $.ajax({
                    url: "https://baconipsum.com/api/?type=all-meat&sentences=1&format=text",
                    type: "GET",
                    dataType: "text",
                    async: true,
                    crossDomain: true,
                })
                .done(function(response) {
                    resolve(response.split(' ').slice(0, 3).join(' ').replaceAll(',', '').replaceAll('.', ''));
                    Instancia.Geral.Toast('Se quiser você pode escrever qualquer coisa como valor do Seed.', 'info');
                })
                .fail(() => {
                    Instancia.Geral.Toast('Ops! Não deu pra gerar um Seed customizado aleatório. Escreva você mesmo o seu.', 'warning');
                })
                .always(() => {
                    Modulo.Params.ObterSeedCustomizado.executando = false;
                });
            };

            if (notPromise) {
                return Modulo.Objetos.seed.value;
            }
            else {
                return new Promise((resolve) => fObterSeed(resolve));
            }
        };

        Modulo.ObterSeedCriptografico = (notPromise) => {
            const fObterSeed = (resolve) => {

                if (Modulo.Params.ObterSeedCriptografico.executando || Modulo.Params.ObterSeedCriptografico.seeds.length > Modulo.Params.ObterSeedCriptografico.quantidadeMinima) {
                    let seed = Modulo.Params.ObterSeedCriptografico.seeds.shift();
                    if (seed === undefined) {
                        Instancia.Geral.Toast('Ops! Esperando o servidor do ' + Instancia.Definicoes.Nome + ' enviar mais seeds criptografados. Por enquanto, usando seed no modo Cliente.', 'warning');    
                        seed = Modulo.ObterSeedCliente(true);
                    }
                    resolve(seed);
                    return; 
                }
                Modulo.Params.ObterSeedCriptografico.executando = true;

                Instancia.Api.Comando('Util/Seed', { data: { total: Modulo.Params.ObterSeedCriptografico.quantidade } })
                .then((data) => {
                    Modulo.Params.ObterSeedCriptografico.executando = false;
                    if (!data || !data.sucesso) {
                        Instancia.Geral.Toast('Ops! Ocorreu um erro ao solicitar novos Seeds criptografados ao servidor do ' + Instancia.Definicoes.Nome + '. Tente novamente.', 'warning');    
                    } else {
                        Modulo.Params.ObterSeedCriptografico.seeds = Modulo.Params.ObterSeedCriptografico.seeds.concat(data.response.resultado);
                        resolve(Modulo.Params.ObterSeedCriptografico.seeds.shift());
                    }
                });
            };

            if (notPromise) {
                fObterSeed(Modulo.DefinirSeed);
                return null;
            }
            else {
                return new Promise((resolve) => fObterSeed(resolve));
            }
        };

        Modulo.Params = {
            ObterSeedCliente: { 
                executando: false, 
            },
            ObterSeedServidor: { 
                executando: false, 
            },
            ObterSeedCustomizado: { 
                executando: false, 
            },
            ObterSeedCriptografico: {
                executando: false,
                quantidade: 10000,
                quantidadeMinima: 1000,
                seeds: [],
            }
        };
    })();
}