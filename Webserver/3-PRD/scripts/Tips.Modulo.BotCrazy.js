window.Tips = window.Tips || {};
if (window.Tips.Modulos) {
    window.Tips.Modulos.CrazyBot = window.Tips.Modulos.CrazyBot || new (function() {

        const Instancia = window.Tips;
        const Modulo = this;

        Modulo.Inicializar = () => {
            Instancia.Layout.AdicionarSecao(Modulo.Secao);
        };

        Modulo.Objetos = { };

        Modulo.Secao = {
            versao: 'v1',

            titulo: 'BOT Crazy',

            css: `
                :host .params input[type="text"] {
                    width: 80%;
                }
                :host .controles .info:before {
                    content: "Estado: ";
                }
                :host .controles .info {
                    float: left;
                    font-size: 15px;
                    color: steelblue;
                    font-weight: bold;
                    margin-top: 6px;
                }
                :host .log {
                    display: none;
                    background-color: #82B1CD;
                    color: darkslateblue;
                    font-family: monospace;
                    font-size: 15px;
                    margin-top: 15px;
                    padding: 7px 10px;
                    border: 1px solid darkslateblue;
                    white-space: pre;
                    overflow: auto;
                    position: relative;
                    min-height: 80px;
                }
                :host .log button {
                    position: absolute;
                    right: 4px;
                    top: 4px;
                    background-color: rgba(0,0,0,0.5);
                    padding: 0 6px;
                    font-size: 20px;
                    line-height: normal;
                }
                :host input.alvo { width: 188px; }
                :host .controles .btn { width: 75px; }
            `,
    
            html: `
                <p class="info">
                    Este BOT é louco. Dependendo do humor você ganha o perde, mas em geral você ganha.
                    Use com moderação.
                </p>
                <table class="params">
                    <tr>
                        <td class="center width50">
                            <div class="radio prediction">
                                <input type="radio" name="prediction" value="50" checked />
                                <label title="A lógica se baseia&lt;br&gt;em prediction 50.">Risco moderado</label>
                            </div>
                        </td>
                        <td class="center width50">
                            <div class="radio prediction">
                                <input type="radio" name="prediction" value="81" />
                                <label title="A lógica se baseia&lt;br&gt;em prediction 81.">Risco alto</label>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td class="arriscado center">
                            <label title="Quanto do seu saldo você vai arriscar.&lt;br&gt;Depois de cada execução do BOT este valor é&lt;br&gt;atualizado para o lucro ou perda final.">Valor arriscado:</label>
                            <input type="text" number number-min="0,00000001" />
                        </td>
                        <td class="lucro center">
                            <label title="CUIDADO! Quanto maior, mais risco.&lt;br&gt;Indica o alvo de lucro sobre o valor arriscado a ser alcançado.&lt;br&gt;Depois de alcançado o BOT para.">Lucro mínimo %:</label>
                            <input type="text" number number-min="0,01" number-max="5" number-digitos="2" number-padrao="1" maxlength="6" />
                        </td>
                    </tr>
                </table>
                <div class="divisor"></div>
                <table>
                    <tr>
                        <td>
                            <div class="checkbox loop">
                                <input type="checkbox" />
                                <span class="label">
                                    <label title="Continua executando o BOT até&lt;br&gt;obter o saldo final desejado.">Continuar até alcançar o saldo de</label>
                                    <input class="alvo" type="text" number />
                                </span>
                            </div>
                        </td>
                    </tr>
                </table>
                <div class="controles">
                    <span class="info">Desligado</span>
                    &nbsp;
                    <button class="btn blue" title="Liga/Desliga.">Ligar</button>
                </div>
                <div class="log"><button class="btn" title="Fechar este quadro.">&times;</button><div></div></div>
            `,

            js: (container, secaoId) => {

                Instancia.Params.QuandoLimiteAtingido.push(Modulo.QuandoLimiteAtingido);

                Modulo.Objetos.$arriscado = container.find('.arriscado input[type="text"]');
                Modulo.Objetos.$lucro = container.find('.lucro input[type="text"]');
                Modulo.Objetos.$loopLabel = container.find('.loop span.label');
                Modulo.Objetos.$loopAlvo = container.find('.loop input[type="text"].alvo');
                Modulo.Objetos.$btnLigar = container.find('.controles .btn');
                Modulo.Objetos.info = container.find('.controles .info').get(0);
                Modulo.Objetos.$log = container.find('.log');
                Modulo.Objetos.$logFechar = container.find('.log button');
                Modulo.Objetos.$logConteudo = container.find('.log div');

                Modulo.Objetos.$logFechar.click(() => {
                    Modulo.Objetos.$log.hide();
                });

                Modulo.Objetos.icheckbug_prediction = {};
                Instancia.LuckygamesIo.BugICheckEvent('.' + secaoId + ' .prediction input[type="radio"]', Modulo.Objetos.icheckbug_prediction, function() { });
                $(Modulo.Objetos.icheckbug_prediction.o[0]).trigger('ifChanged');

                Modulo.Objetos.icheckbug_loop = {};
                Instancia.LuckygamesIo.BugICheckEvent('.' + secaoId + ' .loop input[type="checkbox"]', Modulo.Objetos.icheckbug_loop, function() {
                    Modulo.Objetos.$loopLabel.css('opacity', this.checked ? 1 : 0.5);
                    Modulo.Params.tela.loop = !this.checked ? null : {
                        alvo: Modulo.Objetos.$loopAlvo.get(0).number()
                    };
                }).trigger('ifChanged');                

                Modulo.Objetos.$btnLigar.click(function() {
                    Modulo.Params.controle.ligado = Modulo.Params.controle.ligado === null ? false : !Modulo.Params.controle.ligado;
                    this.innerHTML = Modulo.Params.controle.ligado ? 'Desligar' : 'Ligar';
                    Modulo.Objetos.info.innerHTML = Modulo.Params.controle.ligado ? 'Ligado' : 'Desligado';
                    if (Modulo.Params.controle.ligado) {
                        Modulo.Objetos.$log.show();
                        Modulo.Objetos.$logFechar.hide();
                        Modulo.Processar();
                    } else {
                        clearTimeout(Modulo.Params.controle.idTimeout);
                        Instancia.Layout.AtualizarExibicao.Executar();
                        Modulo.Params.andamento = null;
                        Modulo.Objetos.$logFechar.show();
                    }
                });
                Modulo.Objetos.$btnLigar.click();

                Modulo.Objetos.$loopAlvo.blur(function() {
                    const saldo = this.valor_inicial();
                    const alvo = this.number();
                    if (!Number.isFinite(alvo) || alvo < saldo) {
                        $(this).val(saldo).blur();
                    }
                    if (Modulo.Params.tela.loop !== null) {
                        Modulo.Params.tela.loop.alvo = this.number();
                    }
                });
                Modulo.Objetos.$loopAlvo.get(0).valor_inicial = Instancia.LuckygamesIo.Parametros.Balance;
                Modulo.Objetos.$loopAlvo.val((Instancia.LuckygamesIo.Parametros.Balance() * 1.1).toFixed(8)).blur();

                Modulo.Objetos.$arriscado.blur(function() {
                    if (this.blurAtivo) { return; }
                    this.blurAtivo = true;
                    const saldo = this.valor_inicial();
                    let val = this.number();
                    if (!Number.isFinite(val)) {
                        val = saldo * 0.01;
                        $(this).val(val.toFixed(8)).blur();
                    } else if (val > saldo) {
                        val = saldo;
                        $(this).val(val).blur();
                    }
                    Modulo.Params.tela.arriscado = val;
                    delete this.blurAtivo;
                });
                Modulo.Objetos.$arriscado.get(0).valor_inicial = Instancia.LuckygamesIo.Parametros.Balance;
                Modulo.Objetos.$arriscado.blur();

                Modulo.Objetos.$lucro.blur(function() {
                    Modulo.Params.tela.lucro = this.number();
                });
                Modulo.Objetos.$lucro.blur();
            },

            atualizarExibicao: () => {
                    
                if (Modulo.Params.andamento) {
                    const params = Object.assign({}, Modulo.Params.andamento);
                    params.prediction = 'maior que ' + Modulo.Params.andamento.prediction;
                    params.arriscado = Modulo.Params.andamento.arriscado.toFixed(8);
                    params.alvo = Modulo.Params.andamento.alvo.toFixed(8);
                    params.lucro = Modulo.Params.andamento.lucro.toFixed(8);
                    params.porcento = ((((Modulo.Params.andamento.arriscado + Modulo.Params.andamento.lucro) / Modulo.Params.andamento.arriscado) - 1) * 100).toFixed(2) + '%     ';
                    params.aposta = Modulo.Params.andamento.aposta.toFixed(8);
                    params.saldo = (Modulo.Params.andamento.arriscado + Modulo.Params.andamento.lucro).toFixed(8);
                    params.venceu = Modulo.Params.andamento.venceu + 'x        ';
                    params.perdeu = Modulo.Params.andamento.perdeu + 'x        ';
                    const keys = Object.keys(params);
                    let length = 0;
                    for (let i = 0; i < keys.length; i++) {
                        if (String(params[keys[i]]).length > length) {
                            length = String(params[keys[i]]).length;
                        }
                    }
                    for (let i = 0; i < keys.length; i++) {
                        params[keys[i]] = (' '.repeat(length) + String(params[keys[i]])).substr(-length);
                    }
                    Modulo.Objetos.$logConteudo.html(
                        '                     Prediction: ' + params.prediction + '\n' +
                        'Limite de perda (Valor inicial): ' + params.arriscado + '\n' +
                        '                  Meta de ganho: ' + params.alvo + '\n' +
                        '                    Lucro/Perda: ' + params.lucro + '\n' +
                        '                                 ' + params.porcento + '\n' +
                        '                  Última Aposta: ' + params.aposta + '\n' +
                        '                   Saldo obtido: ' + params.saldo + '\n' +
                        '                         Venceu: ' + params.venceu + '\n' +
                        '                         Perdeu: ' + params.perdeu + '\n'
                    );
                }

            },
        };

        Modulo.QuandoLimiteAtingido =() => {
            if (Modulo.Params.controle.ligado) {
                Modulo.Objetos.$btnLigar.click();
            }
        };

        Modulo.Processar = () => {

            if (Modulo.Params.andamento === null) {
                Modulo.Params.andamento = {
                    arriscado: Modulo.Params.tela.arriscado,
                    alvo: Modulo.Params.tela.arriscado + Modulo.Params.tela.arriscado * (Modulo.Params.tela.lucro / 100),
                    aposta: 0.00000001,
                    prediction: parseInt(Modulo.Objetos.icheckbug_prediction.o[1].checked ? Modulo.Objetos.icheckbug_prediction.o[1].value : Modulo.Objetos.icheckbug_prediction.o[0].value),
                    lucro: 0,
                    venceu: 0,
                    perdeu: 0,
                };
                Modulo.Params.andamento.multiplicador = Instancia.LuckygamesIo.ValoresMultiplicadores["_" + Modulo.Params.andamento.prediction] >= 1 ? Instancia.LuckygamesIo.ValoresMultiplicadores["_" + Modulo.Params.andamento.prediction] : Instancia.LuckygamesIo.ValoresMultiplicadores["_" + (99 - Modulo.Params.andamento.prediction)];
            }

            Instancia.LuckygamesIo.Apostar(Modulo.Params.andamento.aposta.toFixed(8), 'over', Modulo.Params.andamento.prediction)
                .then((response) => {
                    if (!Modulo.Params.andamento) { return; }

                    Modulo.Params.andamento.lucro += parseFloat(response.profit);
                    const proximaAposta = Modulo.Params.andamento.aposta * (response.gameResult === "win" ? 2 : 1.5);

                    if (Modulo.Params.andamento.arriscado + Modulo.Params.andamento.lucro - proximaAposta > 0 &&
                        Modulo.Params.tela.arriscado + Modulo.Params.andamento.lucro < Modulo.Params.andamento.alvo) {
                        Modulo.Params.andamento.aposta = proximaAposta;
                        Modulo.Params.controle.idTimeout = setTimeout(Modulo.Processar, 10);
                    } else {
                        if (Modulo.Params.andamento.lucro < 0) {
                            Instancia.Geral.Audio('warning');
                        }
                        const venceu = Modulo.Params.andamento.venceu += Modulo.Params.andamento.lucro >= 0 ? 1 : 0;
                        const perdeu = Modulo.Params.andamento.perdeu += Modulo.Params.andamento.lucro < 0 ? 1 : 0;
                        Modulo.Objetos.$arriscado.val((Modulo.Params.tela.arriscado + Modulo.Params.andamento.lucro).toFixed(8)).blur();
                        if (Modulo.Params.controle.ligado) {
                            Modulo.Objetos.$btnLigar.click();
                        }
                        if (Modulo.Params.tela.loop) {
                            if (Instancia.LuckygamesIo.Parametros.Balance() < Modulo.Params.tela.loop.alvo) {
                                setTimeout(() => { 
                                    if (!Modulo.Params.controle.ligado) {
                                        Modulo.Objetos.$btnLigar.click();
                                        Modulo.Params.andamento.venceu = venceu;
                                        Modulo.Params.andamento.perdeu = perdeu;
                                    }
                                }, 500 * (Instancia.Geral.Randomico() + 0.5));
                            } else {
                                Instancia.Geral.Audio('limit-good');
                            }
                        }
                    }
                })
                .catch((erro) => {
                    Instancia.Geral.Toast('Ops! Ocorreu um erro no envio da aposta. ' + erro);
                    if (Modulo.Params.controle.ligado) {
                        Modulo.Objetos.$btnLigar.click();
                    }
                });
        },
        
        Modulo.Params = {
            controle: {
                ligado: null,
                idTimeout: null,
            },
            tela: {
                arriscado: null,
                lucro: null,
                loop: {
                    alvo: null,
                },
            },
            andamento: {
                arriscado: null,
                alvo: null,
                aposta: null,
                prediction: null,
                lucro: null,
                multiplicador: null,
            },
        };

    })();
}