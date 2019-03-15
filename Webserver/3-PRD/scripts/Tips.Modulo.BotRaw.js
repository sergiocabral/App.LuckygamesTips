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
                :host table.base input[number] {
                    max-width: 100px;
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
                        <td class="prediction"><input type="text" number number-min="1" number-max="98" number-digitos="0" number-padrao="89" value="89" /></td>
                        <td class="label"><label>Perdas</label></td>
                        <td class="perdas"><input type="text" number number-min="0" number-digitos="0" number-padrao="10" value="10" /></td>
                    </tr>
                    <tr>
                        <td class="label"><label>Multiplicador</label></td>
                        <td class="multiplicador"><input type="text" number number-min="1,1" number-digitos="1" number-padrao="10" value="10" /></td>
                        <td class="label"><label>Niveis</label></td>
                        <td class="niveis"><input type="text" number number-min="1" number-digitos="0" number-padrao="5" value="5" /></td>
                    </tr>
                </table>
                <table>
                    <tr>
                        <td class="label"><label>Sequência</label></td>
                        <td class="sequencia"><input type="text" value="3-8,15-20" /></td>
                    </tr>
                </table>
                <div class="divisor"></div>
                <table class="mitigar">
                    <tr>
                        <td>
                            <div class="checkbox continuarAoZerar">
                                <input type="checkbox" />
                                <span class="label">
                                    <label>Continuar mesmo após zerar.</label>
                                </span>
                            </div>
                        </td>
                    </tr>
                </table>
            `
            .replace('{componenteQuantoArriscar}', Instancia.BotConstrutor.ComponenteQuantoArriscar(Modulo, 'html')),

            js: (container, secaoId) => {
                const componenteQuantoArriscar = Instancia.BotConstrutor.ComponenteQuantoArriscar(Modulo, 'js');
                if (componenteQuantoArriscar instanceof Function) { componenteQuantoArriscar(container, secaoId); }

                Modulo.Objetos.prediction = container.find('.prediction input[type="text"]').get(0);
                Modulo.Objetos.perdas = container.find('.perdas input[type="text"]').get(0);
                Modulo.Objetos.multiplicador = container.find('.multiplicador input[type="text"]').get(0);
                Modulo.Objetos.niveis = container.find('.niveis input[type="text"]').get(0);

                Modulo.Objetos.$sequencia = container.find('.sequencia input[type="text"]');

                Modulo.Objetos.$mitigarContinuarAoZerarLabel = container.find('.mitigar .continuarAoZerar span.label');

                Modulo.Objetos.icheckbug_mitigarContinuarAoZerar = { };
                Instancia.LuckygamesIo.BugICheckEvent('.' + secaoId + ' .mitigar .continuarAoZerar input[type="checkbox"]', Modulo.Objetos.icheckbug_mitigarContinuarAoZerar, function() {
                    Modulo.Objetos.$mitigarContinuarAoZerarLabel.css('opacity', this.checked ? 1 : 0.5);
                    Modulo.Parametros.telaContinuarAoZerar = this.checked;
                }).trigger('ifChanged');

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
                                if (number) mask += (mask ? "," : "") + numbers[i];
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
                if (!Modulo.Componentes.LigaDesliga.executando) {
                    Modulo.Parametros.controleBotParado = true;
                }
            },
        };

        Modulo.Parametros = {
            //Parâmetros de tela.
            telaContinuarAoZerar: null,                     //Indica que mesmo ao zerar deve reiniciar.
            telaSequencia: null,                            //Sequência usadas para apostar.

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
            controleMensagem: "",                           //Mensagem de log.

            log: () => {
                let log = {
                    "Ligado":           Modulo.Componentes.LigaDesliga.executando ? "Sim" : "Não",
                    "Zerou":            Modulo.Parametros.controleZerado + "x",
                    "Nivel":            Modulo.Parametros.controleNivel,
                    "Perdas":           Modulo.Parametros.controlePerdas,
                    "Ganho: menor":    "% " + (Modulo.Parametros.controleGanhoMenor >= 0 ? "+" : "-") + Math.abs(100 * Modulo.Parametros.controleGanhoMenor).toFixed(8),
                    "Ganho: ATUAL":    "% " + (Modulo.Parametros.controleGanhoAtual >= 0 ? "+" : "-") + Math.abs(100 * Modulo.Parametros.controleGanhoAtual).toFixed(8),
                    "Ganho: maior":    "% " + (Modulo.Parametros.controleGanhoMaior >= 0 ? "+" : "-") + Math.abs(100 * Modulo.Parametros.controleGanhoMaior).toFixed(8),
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
                const ganho = Instancia.LuckygamesIo.Parametros.Balance() - Modulo.Parametros.controleSaldoInicialTotal;
                Modulo.Parametros.controleGanhoAtual = ganho / Modulo.Parametros.controleSaldoInicialArriscado;
                if (Modulo.Parametros.controleGanhoAtual < Modulo.Parametros.controleGanhoMenor) Modulo.Parametros.controleGanhoMenor = Modulo.Parametros.controleGanhoAtual;
                if (Modulo.Parametros.controleGanhoAtual > Modulo.Parametros.controleGanhoMaior) Modulo.Parametros.controleGanhoMaior = Modulo.Parametros.controleGanhoAtual;
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

            //Verifica os limites de saldo atingido.
            ValidarSaldoMinimoEMaximo: (aposta) => {
                if (Modulo.Parametros.andamentoUsuarioSaldoMaximo !== null && Instancia.LuckygamesIo.Parametros.Balance() >= Modulo.Parametros.andamentoUsuarioSaldoMaximo) {
                    Modulo.Parametros.controleMensagem = "Saldo máximo atingido";
                    return "max";
                } else if (Instancia.LuckygamesIo.Parametros.Balance() - aposta.valor < Modulo.Parametros.andamentoUsuarioSaldoMinimo) {
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

            Processar: () => {
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
                        });

                });
            },
        };

    })();
}