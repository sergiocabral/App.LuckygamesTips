window.Tips = window.Tips || {};
if (window.Tips.Modulos) {

    window.Tips.Modulos.RawBot = window.Tips.Modulos.RawBot || new (function() {

        const Instancia = window.Tips;
        const Modulo = this;

        Modulo.Inicializar = () => {
            Instancia.BotConstrutor.ImplementarLigaDesliga(Modulo, Modulo.Parametros.Processar);
            Instancia.Layout.AdicionarSecao(Modulo.Secao);
        };

        Modulo.Objetos = { };

        Modulo.Secao = { 
            versao: 'v2',

            titulo: 'BOT Raw',

            css: `
                :host .label label {
                    left: 0;
                }
                :host table.base input[number] {
                    max-width: 100px;
                }
                :host .mitigar .riscoTemporario input.risco,
                :host .turbo input.risco,
                :host .mitigar .turboAleatorio input,
                :host .turbo input.aleatorio {
                    width: 80px;
                }
                :host .mitigar .riscoTemporario input.tempo,
                :host .turbo input.tempo {
                    width: 50px;
                }
                :host .turbo {
                    text-align: left;
                }
                :host .turbo .label {
                    position: relative;
                    top: 2px;
                    left: 7px;
                }
                {componenteQuantoArriscar}
            `
            .replace('{componenteQuantoArriscar}', Instancia.BotConstrutor.ComponenteQuantoArriscar(Modulo, 'css')),

            html: `
                <p class="info">
                    Quanto mais perde mais ganha.
                    Mas se perder demais realmente perde todo o valor arriscado.
                    Os parâmetros são configurados pelo código-fonte.
                </p>
                {componenteQuantoArriscar}
                <div class="divisor"></div>
                <table class="base">
                    <tr>
                        <td class="label"><label>Prediction</label></td>
                        <td class="prediction"><input type="text" number number-min="1" number-max="98" number-digitos="0" number-padrao="50" value="50" /></td>
                        <td class="label"><label>Perdas</label></td>
                        <td class="perdas"><input type="text" number number-min="0" number-digitos="0" number-padrao="3" value="3" /></td>
                    </tr>
                    <tr>
                        <td class="label"><label>Multiplicador</label></td>
                        <td class="multiplicador"><input type="text" number number-min="1,1" number-digitos="1" number-padrao="10" value="10" /></td>
                        <td class="label"><label>Niveis</label></td>
                        <td class="niveis"><input type="text" number number-min="1" number-digitos="0" number-padrao="4" value="4" /></td>
                    </tr>
                </table>
                <table>
                    <tr>
                        <td class="label"><label>Sequência</label></td>
                        <td class="sequencia"><input type="text" value="0-1" /></td>
                    </tr>
                </table>
                <div class="divisor"></div>
                <table class="mitigar">
                    <tr>
                        <td>
                            <div class="checkbox riscoTemporario">
                                <input type="checkbox" checked />
                                <span class="label">
                                    <label>Após perda, risco em</label>
                                    <input class="risco" type="text" number number-digitos="1" number-min="0,1" number-max="100" number-padrao="10" value="10" />
                                    <label>por</label>
                                    <input class="tempo" type="text" number number-digitos="0" number-min="1" maxlength="3" number-padrao="10" value="10" />
                                    <label>segundos</label>
                                </span>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div class="checkbox continuarAoZerar">
                                <input type="checkbox" checked />
                                <span class="label">
                                    <label>Continuar mesmo após zerar.</label>
                                </span>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div class="checkbox turboAleatorio">
                                <input type="checkbox" checked />
                                <span class="label">
                                    <label>Usar o turbo aleatoriamente 1 a cada</label>
                                    <input class="aleatorio" type="text" number number-digitos="0" number-min="10" maxlength="5" number-padrao="1000" value="1000" />
                                    <label>apostas.</label>
                                </span>
                            </div>
                        </td>
                    </tr>
                </table>
                <div class="turbo">
                    <button class="btn turbo red">Turbo</button>
                    <span class="label">
                        <label>Definir risco em</label>
                        <input class="risco" type="text" number number-digitos="1" number-min="0,1" number-max="100" number-padrao="100" value="100" />
                        <label>por</label>
                        <input class="tempo" type="text" number number-digitos="0" number-min="1" maxlength="3" number-padrao="10" value="10" />
                        <label>segundos</label>
                    </span>
                </div>
            `
            .replace('{componenteQuantoArriscar}', Instancia.BotConstrutor.ComponenteQuantoArriscar(Modulo, 'html')),

            js: (container, secaoId) => {
                const componenteQuantoArriscar = Instancia.BotConstrutor.ComponenteQuantoArriscar(Modulo, 'js');
                if (componenteQuantoArriscar instanceof Function) { componenteQuantoArriscar(container, secaoId); }

                Modulo.Objetos.componenteQuantoArriscar$Arriscar.val("0").blur();

                Modulo.Objetos.$prediction = container.find('.prediction input[type="text"]');
                Modulo.Objetos.prediction = Modulo.Objetos.$prediction.get(0);
                Modulo.Objetos.$perdas = container.find('.perdas input[type="text"]');
                Modulo.Objetos.perdas = Modulo.Objetos.$perdas.get(0);
                Modulo.Objetos.$multiplicador = container.find('.multiplicador input[type="text"]');
                Modulo.Objetos.multiplicador = Modulo.Objetos.$multiplicador.get(0);
                Modulo.Objetos.$niveis = container.find('.niveis input[type="text"]');
                Modulo.Objetos.niveis = Modulo.Objetos.$niveis.get(0);

                Modulo.Objetos.$sequencia = container.find('.sequencia input[type="text"]');

                Modulo.Objetos.$mitigarContinuarAoZerarLabel = container.find('.mitigar .continuarAoZerar span.label');
                Modulo.Objetos.icheckbug_mitigarContinuarAoZerar = { };
                Instancia.LuckygamesIo.BugICheckEvent('.' + secaoId + ' .mitigar .continuarAoZerar input[type="checkbox"]', Modulo.Objetos.icheckbug_mitigarContinuarAoZerar, function() {
                    Modulo.Objetos.$mitigarContinuarAoZerarLabel.css('opacity', this.checked ? 1 : 0.5);
                    Modulo.Parametros.telaContinuarAoZerar = this.checked;
                }).trigger('ifChanged');

                Modulo.Objetos.$turboAleatorio = container.find('.turboAleatorio input[type="text"]');
                Modulo.Objetos.$turboAleatorio.blur(function() {
                    if (Modulo.Parametros.telaTurboAleatorio) {
                        Modulo.Parametros.telaTurboAleatorio.aleatorio = this.number();
                    }
                });

                Modulo.Objetos.$mitigarTurboAleatorioLabel = container.find('.mitigar .turboAleatorio span.label');
                Modulo.Objetos.icheckbug_mitigarTurboAleatorio = { };
                Instancia.LuckygamesIo.BugICheckEvent('.' + secaoId + ' .mitigar .turboAleatorio input[type="checkbox"]', Modulo.Objetos.icheckbug_mitigarTurboAleatorio, function() {
                    Modulo.Objetos.$mitigarTurboAleatorioLabel.css('opacity', this.checked ? 1 : 0.5);
                    Modulo.Parametros.telaTurboAleatorio = !this.checked ? null : { 
                        aleatorio: Modulo.Objetos.$turboAleatorio.get(0).number()
                    };
                }).trigger('ifChanged');

                Modulo.Objetos.$mitigarRiscoTemporarioRisco = container.find('.mitigar .riscoTemporario input[type="text"].risco');
                Modulo.Objetos.$mitigarRiscoTemporarioTempo = container.find('.mitigar .riscoTemporario input[type="text"].tempo');

                Modulo.Objetos.$mitigarRiscoTemporarioLabel = container.find('.mitigar .riscoTemporario span.label');
                Modulo.Objetos.icheckbug_mitigarRiscoTemporario = { };
                Instancia.LuckygamesIo.BugICheckEvent('.' + secaoId + ' .mitigar .riscoTemporario input[type="checkbox"]', Modulo.Objetos.icheckbug_mitigarRiscoTemporario, function() {
                    Modulo.Objetos.$mitigarRiscoTemporarioLabel.css('opacity', this.checked ? 1 : 0.5);
                    Modulo.Parametros.telaRiscoTemporario = !this.checked ? null : {
                        risco: Modulo.Objetos.$mitigarRiscoTemporarioRisco.get(0).number(),
                        tempo: Modulo.Objetos.$mitigarRiscoTemporarioTempo.get(0).number()
                    };
                    if (!Modulo.Parametros.telaRiscoTemporario) clearTimeout(Modulo.Parametros.controleRiscoTemporarioTimeout);
                }).trigger('ifChanged');
                Modulo.Objetos.$mitigarRiscoTemporarioRisco.blur(function() {
                    if (Modulo.Parametros.telaRiscoTemporario !== null) {
                        Modulo.Parametros.telaRiscoTemporario.risco = this.number();
                    }
                });
                Modulo.Objetos.$mitigarRiscoTemporarioTempo.blur(function() {
                    if (Modulo.Parametros.telaRiscoTemporario !== null) {
                        Modulo.Parametros.telaRiscoTemporario.tempo = this.number();
                    }
                });

                Modulo.Objetos.$turboRiscoTemporarioRisco = container.find('.turbo input[type="text"].risco');
                Modulo.Objetos.$turboRiscoTemporarioTempo = container.find('.turbo input[type="text"].tempo');
                Modulo.Objetos.$turboButton = container.find('.turbo button');
                Modulo.Objetos.$turboButton.click(() => {
                    Modulo.Parametros.RiscoTemporario(
                        Modulo.Objetos.$turboRiscoTemporarioRisco.get(0).number(),
                        Modulo.Objetos.$turboRiscoTemporarioTempo.get(0).number()
                    );
                });

                Modulo.Objetos.$sequencia.blur(function() {
                    let mask = this.value;
                    const numbers = [];

                    if (!/(^[^0-9]|[^0-9\,\-]|[^0-9]$|[^0-9][^0-9])/.test(mask)) {
                        let sinal = "";
                        while (mask.length) {
                            let number = mask.replace(/[^0-9]+.*/, "");
                            mask = mask.substr(number.length);
                            number = parseInt(number);
                            if (number > 9999) number = 9999;

                            if (numbers.length && numbers[numbers.length - 1] > number) {
                                numbers.length = 0;
                                break;
                            }
                            if (sinal == "-") {
                                for (let i = numbers[numbers.length - 1] + 1; i <= number; i++) {
                                    numbers.push(i);
                                }
                            } else if (numbers[numbers.length - 1] != number) {
                                numbers.push(number);
                            }

                            sinal = mask.substr(0, 1);
                            mask = mask.substr(sinal.length);
                        }
                    }

                    if (numbers.length == 0) this.value = "0-9999";
                    else {
                        mask = "";
                        let ultimo;
                        let aberto = false;
                        for (let i = 0; i <= numbers.length; i++) {
                            const number = i <= numbers.length ? numbers[i] : undefined;
                            if (ultimo == number - 1) {
                                aberto = true;
                            } else {
                                if (aberto) {
                                    aberto = false;
                                    mask += "-" + ultimo;
                                }
                                if (number >= 0) mask += (mask ? "," : "") + numbers[i];
                            }
                            ultimo = numbers[i];
                        }
                        this.value = mask;
                    }

                    Modulo.Parametros.telaSequencia = numbers;
                });
                Modulo.Objetos.$sequencia.blur();
            },

            atualizarExibicao: () => {
                const componenteQuantoArriscar = Instancia.BotConstrutor.ComponenteQuantoArriscar(Modulo, 'atualizarExibicao');
                if (componenteQuantoArriscar instanceof Function) { componenteQuantoArriscar(); }

                Modulo.Parametros.log();
                if (!Modulo.Componentes.LigaDesliga.executando && !Modulo.Componentes.LigaDesliga.pausado) {
                    Modulo.Parametros.controleBotParado = true;
                    clearTimeout(Modulo.Parametros.controleRiscoTemporarioTimeout);
                }
            },
        };

        Modulo.Parametros = {
            //Parâmetros de tela.
            telaContinuarAoZerar: null,                     //Indica que mesmo ao zerar deve reiniciar.
            telaSequencia: null,                            //Sequência usadas para apostar.
            telaRiscoTemporario: null,                      //Risco temporário.
            telaTurboAleatorio: null,                       //Usar o turbo de forma aleatória.

            //Informações do andamento da tentativa
            andamentoUsuarioSaldoMinimo: null,              //Parâmetros recebidos do usuário. Não pode mudar durante a tentativa.
            andamentoUsuarioSaldoMaximo: null,              //Parâmetros recebidos do usuário. Não pode mudar durante a tentativa.
            andamentoUsuarioSaldoInicial: null,             //Parâmetros recebidos do usuário. Não pode mudar durante a tentativa.
            andamentoUsuarioSaldoArriscado: null,           //Parâmetros recebidos do usuário. Não pode mudar durante a tentativa.
            andamentoUsuarioPrediction: null,               //Parâmetros recebidos do usuário. Não pode mudar durante a tentativa.
            andamentoUsuarioPredictionMultiplicador: null,  //Parâmetros recebidos do usuário. Não pode mudar durante a tentativa.
            andamentoUsuarioPerdas: null,                   //Parâmetros recebidos do usuário. Não pode mudar durante a tentativa.
            andamentoUsuarioMultiplicador: null,            //Parâmetros recebidos do usuário. Não pode mudar durante a tentativa.
            andamentoUsuarioNiveis: null,                   //Parâmetros recebidos do usuário. Não pode mudar durante a tentativa.
            andamentoApostaUltima: null,                    //Última aposta enviada.
            andamentoApostaProxima: null,                   //Próxima aposta a ser enviada.
            andamentoApostaRecalculo: null,                 //Informações do último recálculo da aposta.
            andamentoNivel: null,                           //Nivel em tentativa.
            andamentoPerdas: null,                          //Perdas no nível atual.
            andamentoSaldoEsperado: null,                   //Valor de saldo esperado para determinar ganho.
            andamento: false,                               //Informa se existe uma tentativa em andamento.

            controleBotParado: true,                        //Indica que o Bot está parado.
            controleSaldoInicialTotal: null,                //Saldo inicial total
            controleSaldoInicialArriscado: null,            //Saldo inicial arriscado
            controleGanhoMenor: 0,                          //Menor ganho
            controleGanhoMaior: 0,                          //Maior ganho
            controleGanhoAtual: 0,                          //Ganho atual
            controleZerado: 0,                              //Quantas vezes zerou.
            controleNivel: "—",                             //Último nível
            controlePerdas: "—",                            //Última contagem de perdas.
            controleTurbos: 0,                              //Turbos executados.
            controleMensagem: "",                           //Mensagem de log.

            //Controles do recurso de risco temporário.
            controleRiscoTemporarioTimeout: null,
            controleRiscoTemporarioRiscoOriginal: null,
            controleRiscoTemporarioCount: 0,

            log: () => {
                let log = {
                    "Ligado":           Modulo.Componentes.LigaDesliga.executando ? "Sim" : "Não",
                    "Zerou":            Modulo.Parametros.controleZerado + "x",
                    "Nivel":            Modulo.Parametros.controleNivel,
                    "Perdas":           Modulo.Parametros.controlePerdas,
                    "Ganho: menor":    "% " + (Modulo.Parametros.controleGanhoMenor >= 0 ? "+" : "-") + Math.abs(100 * Modulo.Parametros.controleGanhoMenor).toFixed(8),
                    "Ganho: ATUAL":    "% " + (Modulo.Parametros.controleGanhoAtual >= 0 ? "+" : "-") + Math.abs(100 * Modulo.Parametros.controleGanhoAtual).toFixed(8),
                    "Ganho: maior":    "% " + (Modulo.Parametros.controleGanhoMaior >= 0 ? "+" : "-") + Math.abs(100 * Modulo.Parametros.controleGanhoMaior).toFixed(8),
                    "Risco temporário": Modulo.Parametros.controleRiscoTemporarioCount,
                    "Turbos":           Modulo.Parametros.controleTurbos,
                    "Status":           Modulo.Parametros.controleMensagem,
                };
                Modulo.Componentes.LigaDesliga.Log(log);
            },

            InicializarBot: () => {
                Modulo.Parametros.ParametrosAndamentoInicializar(false);
                Modulo.Parametros.controleSaldoInicialTotal = Instancia.LuckygamesIo.Parametros.Balance();
                Modulo.Parametros.controleSaldoInicialArriscado = Modulo.Componentes.QuantoArriscar.arriscado;
                Modulo.Parametros.controleGanhoMenor = 0;
                Modulo.Parametros.controleGanhoMaior = 0;
                Modulo.Parametros.controleGanhoAtual = 0;
                Modulo.Parametros.controleZerado = 0;
                Modulo.Parametros.controleNivel = "—";
                Modulo.Parametros.controlePerdas = "—";
                Modulo.Parametros.controleMensagem = "";
                Modulo.Parametros.controleTurbos = 0;
            },

            //Inicializa os parâmetros da tentativa em andamento.
            ParametrosAndamentoInicializar: (inicializar = true) => {
                Modulo.Objetos.componenteQuantoArriscar$Arriscar.blur();

                Modulo.Parametros.andamento = inicializar;

                //Copia os parâmetros do usuário para fazer uma tentativa (andamento).
                Modulo.Parametros.andamentoUsuarioSaldoMinimo =                 !inicializar ? null : Instancia.LuckygamesIo.Parametros.Balance() - Modulo.Componentes.QuantoArriscar.arriscado;
                Modulo.Parametros.andamentoUsuarioSaldoMaximo =                 !inicializar ? null : Modulo.Componentes.QuantoArriscar.meta;
                Modulo.Parametros.andamentoUsuarioSaldoInicial =                !inicializar ? null : Instancia.LuckygamesIo.Parametros.Balance();
                Modulo.Parametros.andamentoUsuarioSaldoArriscado =              !inicializar ? null : Modulo.Componentes.QuantoArriscar.arriscado;
                Modulo.Parametros.andamentoUsuarioPrediction =                  !inicializar ? null : Modulo.Objetos.prediction.number();
                Modulo.Parametros.andamentoUsuarioPredictionMultiplicador =     !inicializar ? null : Instancia.LuckygamesIo.ValoresMultiplicadores['_' + Modulo.Parametros.andamentoUsuarioPrediction] >= 1 ? Instancia.LuckygamesIo.ValoresMultiplicadores['_' + Modulo.Parametros.andamentoUsuarioPrediction] : Instancia.LuckygamesIo.ValoresMultiplicadores['_' + (99 - Modulo.Parametros.andamentoUsuarioPrediction)];
                Modulo.Parametros.andamentoUsuarioPerdas =                      !inicializar ? null : Modulo.Objetos.perdas.number();
                Modulo.Parametros.andamentoUsuarioMultiplicador =               !inicializar ? null : Modulo.Objetos.multiplicador.number();
                Modulo.Parametros.andamentoUsuarioNiveis =                      !inicializar ? null : Modulo.Objetos.niveis.number();

                //Reiniciar para o nível 1.
                Modulo.Parametros.andamentoNivel = !inicializar ? null : 1;

                //Reiniciar para zero perdas.
                Modulo.Parametros.andamentoPerdas = !inicializar ? null : 0;

                //Não houve última aposta ainda.
                Modulo.Parametros.andamentoApostaUltima = null;

                //Primeira aposta: nivel1 = saldo_arriscado / (multiplicador ^ (niveis - nivel_atual))
                Modulo.Parametros.andamentoApostaProxima = !inicializar ? null : Modulo.Parametros.andamentoUsuarioSaldoArriscado / Math.pow(Modulo.Parametros.andamentoUsuarioMultiplicador, Modulo.Parametros.andamentoUsuarioNiveis - Modulo.Parametros.andamentoNivel);

                //Redefine as informações de último recálculo da aposta.
                Modulo.Parametros.andamentoApostaRecalculo = !inicializar ? null : { };

                //Define o valor de saldo esperado para determinar ganho: saldo + (aposta + multiplicador_luckygames)
                Modulo.Parametros.andamentoSaldoEsperado = !inicializar ? null : Modulo.Parametros.andamentoUsuarioSaldoInicial + (Modulo.Parametros.andamentoApostaProxima * Modulo.Parametros.andamentoUsuarioPredictionMultiplicador);
            },

            //Calcula os ganhos
            CalcularGanho: () => {
                Modulo.Parametros.controleGanhoAtual = Instancia.LuckygamesIo.Parametros.Balance() / Modulo.Parametros.controleSaldoInicialTotal - 1;
                if (Modulo.Parametros.controleGanhoAtual < Modulo.Parametros.controleGanhoMenor) Modulo.Parametros.controleGanhoMenor = Modulo.Parametros.controleGanhoAtual;
                if (Modulo.Parametros.controleGanhoAtual > Modulo.Parametros.controleGanhoMaior) Modulo.Parametros.controleGanhoMaior = Modulo.Parametros.controleGanhoAtual;

                if (Modulo.Parametros.controleGanhoAtual < -0.4) {
                    window.dispatchEvent(new Event("BotZerou"));
                }
            },

            //Sinaliza uma perda de aposta e recalcula a próxima
            RecalcularApostaAposPerder: () => {
                Modulo.Parametros.andamentoApostaUltima = Modulo.Parametros.andamentoApostaProxima;
                Modulo.Parametros.andamentoPerdas++;

                if (Modulo.Parametros.andamentoApostaRecalculo.nivelSubida = Modulo.Parametros.andamentoPerdas >= Modulo.Parametros.andamentoUsuarioPerdas) {
                    //Subiu de nível
                    Modulo.Parametros.andamentoNivel++;

                    //Reinicia perdas
                    Modulo.Parametros.andamentoPerdas = 0;

                    //Recalcula próxima aposta para a primeira do nível
                    Modulo.Parametros.andamentoApostaProxima = Modulo.Parametros.andamentoUsuarioSaldoArriscado / Math.pow(Modulo.Parametros.andamentoUsuarioMultiplicador, Modulo.Parametros.andamentoUsuarioNiveis - Modulo.Parametros.andamentoNivel);

                    //Redefine alvo de saldo esperado.
                    Modulo.Parametros.andamentoSaldoEsperado = Instancia.LuckygamesIo.Parametros.Balance() + (Modulo.Parametros.andamentoApostaProxima * Modulo.Parametros.andamentoUsuarioPredictionMultiplicador);

                    Modulo.Parametros.controleMensagem = "Subiu de nível";
                } else {
                    //Ajusta aposta para poder alcançar o saldo esperado: aposta = (saldo_esperado - saldo_atual) / multiplicador_luckygames
                    Modulo.Parametros.andamentoApostaProxima = (Modulo.Parametros.andamentoSaldoEsperado - Instancia.LuckygamesIo.Parametros.Balance()) / Modulo.Parametros.andamentoUsuarioPredictionMultiplicador;
                }

                if (Modulo.Parametros.andamentoApostaRecalculo.nivelEstouro = Modulo.Parametros.andamentoNivel > Modulo.Parametros.andamentoUsuarioNiveis) {
                    Modulo.Parametros.controleMensagem = "Perdeu em todos os níveis";
                }
            },

            //Prepara dados para exibir no log.
            PrepararDadosDoLog: () => {
                if (Modulo.Parametros.andamentoPerdas !== null) Modulo.Parametros.controlePerdas = Modulo.Parametros.andamentoPerdas;
                if (Modulo.Parametros.andamentoNivel !== null) Modulo.Parametros.controleNivel = Modulo.Parametros.andamentoNivel;
            },

            //Para o funcionamento do BOT.
            PararBot: () => {
                if (Modulo.Componentes.LigaDesliga.executando) {
                    Modulo.Parametros.controleBotParado = true;
                    Modulo.Objetos.$controleBtnLigar.click();
                }
            },

            //Habilita o risco temporário.
            RiscoTemporario: (risco = null, tempo = null) => {
                var random = () => (Math.floor(Math.random() * 10) + 1) * 1000;
                if (Modulo.Parametros.telaRiscoTemporario || risco) {

                    if (risco && (Modulo.Parametros.controleRiscoTemporarioCount != 0 || Modulo.Parametros.controleRiscoTemporarioTimeout)) {
                        Instancia.Geral.Toast('Turbo não é possível no momento. Espere o Risco Temporário zerar.', 'warning');
                        return;
                    } else if (risco) {
                        Instancia.Geral.Toast('Turbo ativado.', 'info');
                        Modulo.Parametros.controleTurbos++;
                    }

                    Modulo.Parametros.controleRiscoTemporarioCount++;

                    if (Modulo.Parametros.controleRiscoTemporarioTimeout) return;

                    if (Modulo.Parametros.controleRiscoTemporarioRiscoOriginal == null) Modulo.Parametros.controleRiscoTemporarioRiscoOriginal = Modulo.Objetos.componenteQuantoArriscar$Arriscar.get(0).number();

                    Modulo.Parametros.controleRiscoTemporarioTimeout = setTimeout(() => {
                        if (Modulo.Parametros.telaRiscoTemporario && Modulo.Componentes.LigaDesliga.executando) {
                            Modulo.Objetos.componenteQuantoArriscar$Arriscar.val(risco != null ? risco : Modulo.Parametros.telaRiscoTemporario.risco).blur();
                            Modulo.Parametros.controleRiscoTemporarioTimeout = setTimeout(() => {
                                Modulo.Objetos.componenteQuantoArriscar$Arriscar.val(Modulo.Parametros.controleRiscoTemporarioRiscoOriginal).blur();
                                if (--Modulo.Parametros.controleRiscoTemporarioCount == 0) {
                                    Modulo.Parametros.controleRiscoTemporarioRiscoOriginal = null;
                                    Modulo.Parametros.controleRiscoTemporarioTimeout = null;
                                } else {
                                    Modulo.Parametros.controleRiscoTemporarioTimeout = setTimeout(() => {
                                        Modulo.Parametros.controleRiscoTemporarioTimeout = null;
                                        Modulo.Parametros.controleRiscoTemporarioCount--;
                                        Modulo.Parametros.RiscoTemporario();
                                    }, random() * 5);
                                }

                            }, (tempo != null ? tempo : Modulo.Parametros.telaRiscoTemporario.tempo) * 1000);
                        } else {
                            Modulo.Parametros.controleRiscoTemporarioTimeout = null;
                        }
                    }, risco != null ? 1 : random());
                }
            },

            //Verifica os limites de saldo atingido.
            ValidarSaldoMinimoEMaximo: (aposta) => {
                if (Modulo.Parametros.andamentoUsuarioSaldoMaximo !== null && Instancia.LuckygamesIo.Parametros.Balance() >= Modulo.Parametros.andamentoUsuarioSaldoMaximo) {
                    Modulo.Parametros.controleMensagem = "Saldo máximo atingido";
                    return "max";
                } else if (Instancia.LuckygamesIo.Parametros.Balance() - aposta.valor < Modulo.Parametros.andamentoUsuarioSaldoMinimo) {
                    if (Modulo.Parametros.telaContinuarAoZerar) Modulo.Parametros.RiscoTemporario();
                    Modulo.Parametros.controleZerado++;
                    Modulo.Parametros.controleMensagem = "Saldo mínimo atingido";
                    return "min";
                }
                return false;
            },

            //Obtem o valor da próxima aposta
            ObterAposta: () => {
                if (!Modulo.Parametros.andamento) Modulo.Parametros.ParametrosAndamentoInicializar();
                const ignorar = Modulo.Parametros.telaSequencia.indexOf(Instancia.Estatisticas.Dados.sequenciaPerdendo) < 0;
                if (ignorar) Modulo.Parametros.controleMensagem = "Ignorando";
                return {
                    valor:      ignorar ? 0.00000001 : Modulo.Parametros.andamentoApostaProxima,
                    prediction: Modulo.Parametros.andamentoUsuarioPrediction,
                    direcao:    Instancia.LuckygamesIo.ValoresMultiplicadores['_' + Modulo.Parametros.andamentoUsuarioPrediction] >= 1 ? 'over' : 'under',
                    ignorar:    ignorar,
                };
            },

            //Responde se é hora do turbo aleatório.
            TurboAleatorio: () => {
                if (!Modulo.Parametros.telaTurboAleatorio) return;

                const random = (min, max) => {
                    return Math.floor(Math.random() * (max - min + 1) ) + min;
                }
                if (random(1, Modulo.Parametros.telaTurboAleatorio.aleatorio) == parseInt(Modulo.Parametros.telaTurboAleatorio.aleatorio / 2)) {
                    Modulo.Objetos.$turboButton.click();
                }
            },

            Processar: () => {
                Modulo.Parametros.TurboAleatorio();

                return new Promise(resolve => {
                    if (Modulo.Parametros.controleBotParado) {
                        Modulo.Parametros.controleBotParado = false;
                        Modulo.Parametros.InicializarBot();
                    }

                    let aposta = Modulo.Parametros.ObterAposta();
                    let limite;
                    if (limite = Modulo.Parametros.ValidarSaldoMinimoEMaximo(aposta)) {
                        if (limite == "min" && Modulo.Parametros.telaContinuarAoZerar) {
                            Modulo.Parametros.ParametrosAndamentoInicializar(false);
                            aposta = Modulo.Parametros.ObterAposta();
                        } else {
                            Modulo.Parametros.PararBot();
                            return resolve(true);
                        }
                    }

                    Instancia.LuckygamesIo.Apostar(aposta.valor, aposta.direcao, aposta.prediction)
                        .then((response) => {
                            if (aposta.ignorar) return resolve(false);

                            const venceu = response.gameResult == "win";
                            let estourou = false;

                            Modulo.Parametros.CalcularGanho();
                            if (venceu) {
                                Modulo.Parametros.ParametrosAndamentoInicializar(false);
                                Modulo.Parametros.controleMensagem = "Venceu";
                            } else {
                                Modulo.Parametros.RecalcularApostaAposPerder();
                                if (estourou = Modulo.Parametros.andamentoApostaRecalculo.nivelEstouro && !Modulo.Parametros.telaContinuarAoZerar) Modulo.Parametros.PararBot();
                            }
                            Modulo.Parametros.PrepararDadosDoLog();

                            resolve(venceu || estourou);
                            //Controle temporário. Usado para debug. Pode apagar depois.
                            // console.log("then", {
                            //     parametros: Modulo.Parametros,
                            //     aposta: aposta,
                            //     response: response,
                            // });
                            // //Controle temporário. Usado para debug. Bastaria: resolve(true);
                            // //Espera receber pelo console: window.go = true
                            // const wait = (first = true) => {
                            //     if (first) window.go = false;
                            //     else if (window.go || window.go2) return resolve(venceu || estourou);
                            //     setTimeout(() => wait(false), 100);
                            // };
                            // wait();
                        })
                        .catch((error) => {
                            //Controle temporário. Usado para debug. Pode apagar depois.
                            console.log("catch", {
                                parametros: Modulo.Parametros,
                                aposta: aposta,
                                error: error,
                            });
                            setTimeout(() => {
                                console.log("Recomeçando...");
                                Modulo.Objetos.$controleBtnPausar.click();
                            }, 10000);
                        });

                });
            },
        };

    })();
}