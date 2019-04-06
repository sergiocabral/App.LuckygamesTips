window.Tips = window.Tips || {};
if (window.Tips.Modulos) {
    window.Tips.Modulos.MartinBot = window.Tips.Modulos.MartinBot || new (function() {

        const Instancia = window.Tips;
        const Modulo = this;

        Modulo.Inicializar = () => {
            Instancia.Layout.AdicionarSecao(Modulo.Secao);
        };

        Modulo.Objetos = { };

        Modulo.Secao = {
            versao: 'v4',

            titulo: 'BOT Martin',

            css: `
                :host td {
                    white-space: nowrap;
                }
                :host label {
                    font-weight: bold;
                }
                :host .label label {
                    color: #aaa;
                    font-weight: normal;
                }
                :host .prediction label {
                    font-weight: normal;
                    white-space: normal;
                    color: lightseagreen;
                }
                :host .prediction label span {
                    font-weight: bold;
                }
                :host .aposta input.ativo {
                    border-color: black;
                    border-style: dashed;
                }
                :host .aposta label {
                    font-size: 12px;
                    position: relative;
                    top: -1px;
                    left: 5px;
                }
                :host .aposta label span {
                    color: lightseagreen;
                }
                :host .mitigar input {
                    position: relative;
                    left: -7px;
                }
                :host .controles {
                    min-height: 29px;
                }
                :host .controles .btn {
                    width: 75px;
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
                :host .desistir .label {
                    white-space: normal;
                }
                :host .desistir .label span.tempo {
                    display: inline-block;
                    padding-left: 203px;
                    margin-top: 7px;
                }
                :host .desistir .nice-select {
                    display: inline-block;
                    width: 300px;
                    position: relative;
                    top: 1px;
                }
                :host .riscoNoMinimo .nice-select {
                    width: 200px;
                    position: relative;
                    top: 4px;
                    margin-left: 27px;
                }
                :host .saldoMeta input { width: 200px; }
                :host .arriscar input { width: 200px; }
                :host .prediction input { width: 100px; }
                :host .aposta input { width: 200px; }
                :host .aposta input.perdas { width: 80px; }                
                :host .mitigar input { width: 30px; }
                :host .mitigar input.perdas { width: 50px; }
                :host .mitigar input.tempo { width: 70px; }
                :host .mitigar input.zerar { width: 50px; }
                :host .mitigar .riscoMais input,
                :host .mitigar .riscoSeguro input { width: 100px; }
                :host .mitigar .riscoNoMinimo input { width: 100px; }
                :host .pulsar {
                    margin: 10px 0;
                }
                :host .pulsar label {
                    position: relative;
                    top: 2px;
                }
                :host .pulsar button {
                    width: 40px;
                    margin: 0 2px;
                }
                :host .pulsar input {
                    width: 140px;
                }
                :host .pulsar label {
                    margin-right: 2px;
                }
                :host .pulsar button.click {
                    box-shadow: 0 0 5px white, 0 0 15px black;
                }
            `,
    
            html: `
                <p class="info">
                    Este BOT usa a estratégia
                    <a href="https://pt.wikipedia.org/wiki/Martingale" target="_blank">Martingale</a>
                    para garantir ganhos sempre. Para cada perda sua aposta aumenta para recuperar
                    o que perdeu. Você deve determinar quantas vezes está disposto a perder.
                    Caso perca mais vezes do que se propôs a perder você perde tudo.
                </p>
                <table>
                    <tr>
                        <td class="label right"><label title="Meta de saldo. Uma vez atingido o BOT para.&lt;br&gt;Deixe em branco para o BOT continuar sempre.">Meta</label></td>
                        <td class="saldoMeta"><input type="text" number /></td>
                        <td class="label right"><label title="Total de moedas que&lt;br&gt;você tem nesse momento..">Saldo atual</label></td>
                        <td class="saldoAtual right"><label>—</label></td>
                    </tr>
                    <tr>
                        <td class="label right"><label title="Quantos porcentos do seu saldo&lt;br&gt;você quer arriscar">Arriscar %</label></td>
                        <td class="arriscar"><input type="text" number number-min="0,00000001" number-max="100" number-padrao="0,01" value="0,01" /></td>
                        <td class="label right"><label title="Cálculo do campo 'Arriscar %'.&lt;br&gt;Total que você está disposto a perder.&lt;br&gt;Você nunca perderá mais do que isso.">Arriscado</label></td>
                        <td class="arriscar right"><label>—</label></td>
                    </tr>
                </table>
                <div class="divisor"></div>
                <table>
                    <tr>
                        <td class="label center width100"><label title="Valor do Prediction na tela da Luckygames.io&lt;br&gt;Quanto mais longe de 50, maior a recompensa e maior o risco.">Prediction</label></td>
                        <td>&nbsp;</td>
                        <td class="label center"><label title="Primeiro valor apostado. Mas o valor vai aumentando&lt;br&gt;enquanto você perde para que quando ganhar&lt;br&gt;você recupere tudo o que perdeu.">Aposta inicial</label></td>
                    </tr>
                    <tr>
                        <td class="prediction center"><input type="text" number number-min="1" number-max="98" number-digitos="0" number-padrao="50" value="50" maxlength="2" /></td>
                        <td class="label right"><label title="Quantas apostas você pode perder&lt;br&gt;sem zerar o seu saldo.">Perdas</label></td>
                        <td class="aposta">
                            <input class="perdas" type="text" number number-min="0" number-digitos="0" />
                            <label title="Aceitar perdas menores que esta sugestão&lt;br&gt;acarreta num risco maior.">Mais seguro: <span>16</span></label>
                        </td>
                    </tr>
                    <tr>
                        <td rowspan="2" class="prediction center"><label>Você ganha <span class="multiplicador">1.2x</span><br />quando o sorteado é<br /><span class="regra">maior que 50</span></label></td>
                        <td class="label right"><label title="Quantos porcento do seu valor&lt;br&gt;arriscado você quer apostar.">%</label></td>
                        <td class="aposta"><input class="porcento" type="text" number number-min="0,00000001" number-max="100" /></td>
                    </tr>
                    <tr>
                        <td class="label right"><label title="Valor literal do quanto&lt;br&gt;você quer apostar.">Moeda</label></td>
                        <td class="aposta"><input class="valor" type="text" number number-min="0,00000001" value="0,00000001" /></td>
                    </tr>
                </table>
                <div class="divisor"></div>
                <table class="mitigar">
                    <tr>
                        <td>
                            <div class="checkbox evitar">
                                <input type="checkbox" />
                                <span class="label">
                                    <label title="Enquanto a sequência de perdas não alcança&lt;br&gt;esse valor continuar apostando o mínimo.">Esperar por</label>
                                    <input class="perdas" type="text" number number-digitos="0" number-min="1" maxlength="4" value="1" />
                                    <label title="Enquanto a sequência de perdas não alcança&lt;br&gt;esse valor continuar apostando o mínimo.">perdas antes de começar a apostar.</label>
                                </span>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div class="checkbox minimo">
                                <input type="checkbox" checked />
                                <span class="label">
                                    <label title="Caso a sequência de perdas alcance o&lt;br&gt;valor informado aqui, passa a apostar&lt;br&gt;o valor mínimo de 0,00000001 até vencer.">Após</label>
                                    <input class="perdas" type="text" number number-digitos="0" number-min="1" maxlength="4" value="1" />
                                    <label title="Caso a sequência de perdas alcance o&lt;br&gt;valor informado aqui, passa a apostar&lt;br&gt;o valor mínimo de 0,00000001 até vencer.">perdas, apostar o mínimo até vencer por</label>
                                    <input class="vezes" type="text" number number-digitos="0" number-min="1" maxlength="2" number-padrao="1" value="2" />
                                    <label title="Caso a sequência de perdas alcance o&lt;br&gt;valor informado aqui, passa a apostar&lt;br&gt;o valor mínimo de 0,00000001 até vencer.">vez(es).</label>
                                </span>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div class="checkbox espera">
                                <input type="checkbox" checked />
                                <span class="label">
                                    <label title="Caso a sequência de perdas alcance o&lt;br&gt;valor informado aqui, dá uma pausa&lt;br&gt;antes de continuar a apostar.">Após</label>
                                    <input class="perdas" type="text" number number-digitos="0" number-min="1" maxlength="4" value="1" />
                                    <label title="Caso a sequência de perdas alcance o&lt;br&gt;valor informado aqui, dá uma pausa&lt;br&gt;antes de continuar a apostar.">perdas, esperar</label>
                                    <input class="tempo" type="text" number number-digitos="0" number-min="1" maxlength="6" number-padrao="1000" value="1000" />
                                    <label title="Caso a sequência de perdas alcance o&lt;br&gt;valor informado aqui, dá uma pausa&lt;br&gt;antes de continuar a apostar.">milissegundos.</label>
                                </span>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div class="checkbox desistir">
                                <input type="checkbox" />
                                <span class="label">
                                    <label title="Quando alcança essa sequência de perdas aceita&lt;br&gt;as perdas e recomeça com a aposta inicial.">Após</label>
                                    <input class="perdas" type="text" number number-digitos="0" number-min="1" maxlength="4" value="1" />
                                    <label title="Quando alcança essa sequência de perdas aceita&lt;br&gt;as perdas e recomeça com a aposta inicial.">perdas,</label>
                                    <select>
                                        <option value="recomecar">desistir e recomeçar</option>
                                        <option value="parar">desistir e parar imediatamente</option>
                                    </select>
                                    <span class="tempo">
                                        <label title="Recomeça depois do tempo informado.">depois de</label>
                                        <input class="tempo" type="text" number number-digitos="0" number-min="0" maxlength="6" number-padrao="1000" value="1000" />
                                        <label title="Recomeça depois do tempo informado.">milissegundos.</label>
                                    </div>
                                </span>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div class="checkbox interromperZerar">
                                <input type="checkbox" checked />
                                <span class="label">
                                    <label title="Caso o saldo arriscado chegue&lt;br&gt;a zero interrompe o BOT.">Após</label>
                                    <input class="zerar" type="text" number number-digitos="0" number-min="1" number-padrao="1" maxlength="4" value="1" />
                                    <label title="Caso o saldo arriscado chegue&lt;br&gt;a zero interrompe o BOT.">vez(es) zerando, parar imediatamente</label>
                                </span>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div class="checkbox inverter">
                                <input type="checkbox" />
                                <span class="label">
                                    <label title="Caso a sequência de perdas alcance o&lt;br&gt;valor informado aqui, o prediction é ajustado para inverter de&lt;br&gt;'maior que' para 'menor que' (e vice-versa) mantendo&lt;br&gt;o mesmo fator de multiplicação.">Após</label>
                                    <input class="perdas" type="text" number number-digitos="0" number-min="1" maxlength="4" />
                                    <label title="Caso a sequência de perdas alcance o&lt;br&gt;valor informado aqui, o prediction é ajustado para inverter de&lt;br&gt;'maior que' para 'menor que' (e vice-versa) mantendo&lt;br&gt;o mesmo fator de multiplicação.">perdas, inverter o prediction.</label>
                                </span>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div class="checkbox continuar">
                                <input type="checkbox" />
                                <span class="label">
                                    <label title="Quando houver erro de rede e o BOT for interrompido, reinicia automaticamente.">Em caso de erro de rede, reinicia em </label>
                                    <input class="tempo" type="text" number number-digitos="0" number-min="1000" maxlength="6" number-padrao="10000" value="10000" />
                                    <label title="Quando houver erro de rede e o BOT for interrompido, reinicia automaticamente.">milissegundos.</label>
                                </span>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div class="checkbox riscoMais">
                                <input type="checkbox" />
                                <span class="label">
                                    <label>Multiplica o risco por </label>
                                    <input class="multiplicador" type="text" number number-digitos="0" number-min="1" maxlength="3" number-padrao="10" value="10" />
                                    <label> até o limite de </label>
                                    <input class="limite" type="text" number number-digitos="3" number-min="0,001" number-max="100" number-padrao="10" value="10" />
                                </span>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div class="checkbox riscoSeguro">
                                <input type="checkbox" />
                                <span class="label">
                                    <label>Se perder mais de </label>
                                    <input class="perdas" type="text" number number-digitos="0" number-min="1" maxlength="4" number-padrao="30" value="30" />
                                    <label> arrisca na próxima </label>
                                    <input class="risco" type="text" number number-digitos="3" number-min="0,001" number-max="100" number-padrao="10" value="10" />
                                </span>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div class="checkbox riscoNoMinimo">
                                <input type="checkbox" />
                                <span class="label">
                                    <label>Perda menor que</label>
                                    <input class="perdas" type="text" number number-digitos="0" number-min="1" maxlength="4" number-padrao="30" value="30" />
                                    <label> arrisca na próxima </label>
                                    <input class="risco" type="text" number number-digitos="3" number-min="0,001" number-max="100" number-padrao="10" value="10" />
                                    <select>
                                        <option value="nao-desistir">Não desistir</option>
                                        <option value="desistir">Desistir</option>
                                    </select>
                                </span>
                            </div>
                        </td>
                    </tr>
                </table>
                <div class="pulsar">
                    <label>Risco</label>
                    <button class="btn red">0,1</button>
                    <button class="btn red">1</button>
                    <button class="btn red">10</button>
                    <button class="btn red">50</button>
                    <button class="btn red">100</button>
                    <label>Limite</label>
                    <input type="text" number number-min="0.00000001" />
                </div>
                <div class="controles">
                    <span class="info">Nunca foi ligado</span>
                    &nbsp;
                    <button class="btn parar red" title="Para imediatamento o BOT.&lt;br&gt;Isso pode resultar em perdas.">Parar</button>
                    <button class="btn ligar blue" title="Liga/Desliga. O BOT é desligado&lt;br&gt;somente quando obtiver lucro.">Ligar</button>
                    <button class="btn pausar grey" title="Pausa/Reinicia o andamento do BOT.">Pausar</button>
                    <button class="btn pulsar green" title="Mantém o BOT ligado enquanto mantiver este&lt;br&gt;botão pressionando. Após soltar o botão o BOT&lt;br&gt;para assim que obtiver lucro.">Pulsar</button>
                </div>
                <div class="log"><button class="btn" title="Fechar este quadro.">&times;</button><div></div></div>
            `,

            js: (container, secaoId) => {
                Instancia.Params.QuandoLimiteAtingido.push(Modulo.QuandoLimiteAtingido);

                Modulo.Objetos.$saldoAtual = container.find('.saldoAtual label');
                Modulo.Objetos.$saldoMeta = container.find('.saldoMeta input[type="text"]');
                Modulo.Objetos.$arriscar = container.find('.arriscar input[type="text"]');
                Modulo.Objetos.$arriscado = container.find('.arriscar label');
                Modulo.Objetos.$prediction = container.find('.prediction input[type="text"]');
                Modulo.Objetos.$predictionMultiplicador = container.find('.prediction label .multiplicador');
                Modulo.Objetos.$predictionRegra = container.find('.prediction label .regra');
                Modulo.Objetos.$apostaInfo = container.find('.aposta label');
                Modulo.Objetos.apostaAtiva = () => { return container.find('.aposta input[type="text"].ativo'); };
                Modulo.Objetos.$aposta = container.find('.aposta input[type="text"]');
                Modulo.Objetos.$apostaPerdas = container.find('.aposta input[type="text"].perdas');
                Modulo.Objetos.$apostaPorcento = container.find('.aposta input[type="text"].porcento');
                Modulo.Objetos.$apostaValor = container.find('.aposta input[type="text"].valor');
                Modulo.Objetos.$mitigarEvitarLabel = container.find('.mitigar .evitar span.label');
                Modulo.Objetos.$mitigarEvitarPerdas = container.find('.mitigar .evitar input[type="text"].perdas');
                Modulo.Objetos.$mitigarMinimoLabel = container.find('.mitigar .minimo span.label');
                Modulo.Objetos.$mitigarMinimoPerdas = container.find('.mitigar .minimo input[type="text"].perdas');
                Modulo.Objetos.$mitigarMinimoVezes = container.find('.mitigar .minimo input[type="text"].vezes');
                Modulo.Objetos.$mitigarEsperaLabel = container.find('.mitigar .espera span.label');
                Modulo.Objetos.$mitigarEsperaPerdas = container.find('.mitigar .espera input[type="text"].perdas');
                Modulo.Objetos.$mitigarEsperaTempo = container.find('.mitigar .espera input[type="text"].tempo');
                Modulo.Objetos.$mitigarInterromperZerarLabel = container.find('.mitigar .interromperZerar span.label');
                Modulo.Objetos.$mitigarInterromperZerar = container.find('.mitigar .interromperZerar input[type="text"].zerar');
                Modulo.Objetos.$mitigarInverterLabel = container.find('.mitigar .inverter span.label');
                Modulo.Objetos.$mitigarInverterPerdas = container.find('.mitigar .inverter input[type="text"].perdas');
                Modulo.Objetos.$mitigarDesistirLabel = container.find('.mitigar .desistir span.label');
                Modulo.Objetos.$mitigarDesistirPerdas = container.find('.mitigar .desistir input[type="text"].perdas');
                Modulo.Objetos.$mitigarDesistirModo = container.find('.mitigar .desistir select');
                Modulo.Objetos.$mitigarDesistirTempoLabel = container.find('.mitigar .desistir span.label span.tempo');
                Modulo.Objetos.$mitigarDesistirTempo = container.find('.mitigar .desistir input[type="text"].tempo');
                Modulo.Objetos.$mitigarContinuarLabel = container.find('.mitigar .continuar span.label');
                Modulo.Objetos.$mitigarContinuarTempo = container.find('.mitigar .continuar input[type="text"].tempo');
                Modulo.Objetos.$mitigarRiscoMaisLabel = container.find('.mitigar .riscoMais span.label');
                Modulo.Objetos.$mitigarRiscoMaisMultiplicador = container.find('.mitigar .riscoMais input[type="text"].multiplicador');
                Modulo.Objetos.$mitigarRiscoMaisLimite = container.find('.mitigar .riscoMais input[type="text"].limite');
                Modulo.Objetos.$mitigarRiscoSeguroLabel = container.find('.mitigar .riscoSeguro span.label');
                Modulo.Objetos.$mitigarRiscoSeguroPerdas = container.find('.mitigar .riscoSeguro input[type="text"].perdas');
                Modulo.Objetos.$mitigarRiscoSeguroRisco = container.find('.mitigar .riscoSeguro input[type="text"].risco');
                Modulo.Objetos.$mitigarRiscoNoMinimoLabel = container.find('.mitigar .riscoNoMinimo span.label');
                Modulo.Objetos.$mitigarRiscoNoMinimoPerdas = container.find('.mitigar .riscoNoMinimo input[type="text"].perdas');
                Modulo.Objetos.$mitigarRiscoNoMinimoRisco = container.find('.mitigar .riscoNoMinimo input[type="text"].risco');
                Modulo.Objetos.$mitigarRiscoNoMinimoModo = container.find('.mitigar .riscoNoMinimo select');
                Modulo.Objetos.$info = container.find('.controles .info');
                Modulo.Objetos.$btns = container.find('.controles .btn');
                Modulo.Objetos.$btnParar = container.find('.controles .parar');
                Modulo.Objetos.$btnPausar = container.find('.controles .pausar');
                Modulo.Objetos.$btnLigar = container.find('.controles .ligar');
                Modulo.Objetos.$btnPulsar = container.find('.controles .pulsar');
                Modulo.Objetos.$log = container.find('.log');
                Modulo.Objetos.$logFechar = container.find('.log button');
                Modulo.Objetos.$logConteudo = container.find('.log div');

                Modulo.Objetos.$logFechar.click(() => {
                    Modulo.Objetos.$log.hide();
                });

                Modulo.Objetos.saldoAtual = Modulo.Objetos.$saldoAtual.get(0);

                Modulo.Objetos.$mitigarEvitarPerdas.blur(function() {
                    if (Modulo.Params.tela.mitigarEvitar !== null) {
                        Modulo.Params.tela.mitigarEvitar.perdas = this.number();
                    }
                });

                Modulo.Objetos.icheckbug_mitigarEvitar = {};
                Instancia.LuckygamesIo.BugICheckEvent('.' + secaoId + ' .mitigar .evitar input[type="checkbox"]', Modulo.Objetos.icheckbug_mitigarEvitar, function() {
                    Modulo.Objetos.$mitigarEvitarLabel.css('opacity', this.checked ? 1 : 0.5);
                    Modulo.Params.tela.mitigarEvitar = !this.checked ? null : {
                        perdas: Modulo.Objetos.$mitigarEvitarPerdas.get(0).number()
                    };
                }).trigger('ifChanged');

                Modulo.Objetos.$mitigarMinimoPerdas.blur(function() {
                    if (Modulo.Params.tela.mitigarMinimo !== null) {
                        Modulo.Params.tela.mitigarMinimo.perdas = this.number();
                    }
                });

                Modulo.Objetos.$mitigarMinimoVezes.blur(function() {
                    if (Modulo.Params.tela.mitigarMinimo !== null) {
                        Modulo.Params.tela.mitigarMinimo.vezes = this.number();
                    }
                });

                Modulo.Objetos.icheckbug_mitigarMinimo = {};
                Instancia.LuckygamesIo.BugICheckEvent('.' + secaoId + ' .mitigar .minimo input[type="checkbox"]', Modulo.Objetos.icheckbug_mitigarMinimo, function() {
                    Modulo.Objetos.$mitigarMinimoLabel.css('opacity', this.checked ? 1 : 0.5);
                    Modulo.Params.tela.mitigarMinimo = !this.checked ? null : {
                        perdas: Modulo.Objetos.$mitigarMinimoPerdas.get(0).number(),
                        vezes: Modulo.Objetos.$mitigarMinimoVezes.get(0).number()
                    };
                }).trigger('ifChanged');

                Modulo.Objetos.$mitigarEsperaPerdas.blur(function() {
                    if (Modulo.Params.tela.mitigarEspera !== null) {
                        Modulo.Params.tela.mitigarEspera.perdas = this.number();
                    }
                });
                Modulo.Objetos.$mitigarEsperaTempo.blur(function() {
                    if (Modulo.Params.tela.mitigarEspera !== null) {
                        Modulo.Params.tela.mitigarEspera.tempo = this.number();
                    }
                });

                Modulo.Objetos.icheckbug_mitigarEspera = {};
                Instancia.LuckygamesIo.BugICheckEvent('.' + secaoId + ' .mitigar .espera input[type="checkbox"]', Modulo.Objetos.icheckbug_mitigarEspera, function() {
                    Modulo.Objetos.$mitigarEsperaLabel.css('opacity', this.checked ? 1 : 0.5);
                    Modulo.Params.tela.mitigarEspera = !this.checked ? null : {
                        perdas: Modulo.Objetos.$mitigarEsperaPerdas.get(0).number(),
                        tempo: Modulo.Objetos.$mitigarEsperaTempo.get(0).number()
                    };
                }).trigger('ifChanged');

                Modulo.Objetos.icheckbug_mitigarInterromperZerar = {};
                Instancia.LuckygamesIo.BugICheckEvent('.' + secaoId + ' .mitigar .interromperZerar input[type="checkbox"]', Modulo.Objetos.icheckbug_mitigarInterromperZerar, function() {
                    Modulo.Objetos.$mitigarInterromperZerarLabel.css('opacity', this.checked ? 1 : 0.5);
                    Modulo.Params.tela.mitigarInterromperZerar = !this.checked ? null : {
                        vezes: Modulo.Objetos.$mitigarInterromperZerar.get(0).number()
                    };
                }).trigger('ifChanged');
                Modulo.Objetos.$mitigarInterromperZerar.blur(function() {
                    if (Modulo.Params.tela.mitigarInterromperZerar !== null) {
                        Modulo.Params.tela.mitigarInterromperZerar.vezes = this.number();
                    }
                });

                Modulo.Objetos.$mitigarDesistirPerdas.blur(function() {
                    if (Modulo.Params.tela.mitigarDesistir !== null) {
                        Modulo.Params.tela.mitigarDesistir.perdas = this.number();
                    }
                });
                Modulo.Objetos.$mitigarDesistirTempo.blur(function() {
                    if (Modulo.Params.tela.mitigarDesistir !== null) {
                        Modulo.Params.tela.mitigarDesistir.tempo = this.number();
                    }
                });
                Modulo.Objetos.$mitigarDesistirModo.change(function() {
                    if (Modulo.Params.tela.mitigarDesistir !== null) {
                        Modulo.Params.tela.mitigarDesistir.modo = this.value;
                    }
                });

                Modulo.Objetos.icheckbug_mitigarDesistir = {};
                Instancia.LuckygamesIo.BugICheckEvent('.' + secaoId + ' .mitigar .desistir input[type="checkbox"]', Modulo.Objetos.icheckbug_mitigarDesistir, function() {
                    Modulo.Objetos.$mitigarDesistirLabel.css('opacity', this.checked ? 1 : 0.5);
                    Modulo.Params.tela.mitigarDesistir = !this.checked ? null : {
                        perdas: Modulo.Objetos.$mitigarDesistirPerdas.get(0).number(),
                        modo: Modulo.Objetos.$mitigarDesistirModo.get(0).value,
                        tempo: Modulo.Objetos.$mitigarDesistirTempo.get(0).value,
                    };
                }).trigger('ifChanged');

                Modulo.Objetos.$mitigarDesistirModo.change(function() {
                    if (this.value === 'recomecar') {
                        Modulo.Objetos.$mitigarDesistirTempoLabel.show();
                    } else {
                        Modulo.Objetos.$mitigarDesistirTempoLabel.hide();
                    }
                });
                Modulo.Objetos.$mitigarDesistirModo.change();

                Modulo.Objetos.$mitigarInverterPerdas.blur(function() {
                    if (Modulo.Params.tela.mitigarInverter !== null) {
                        Modulo.Params.tela.mitigarInverter.perdas = this.number();
                    }
                });
                Modulo.Objetos.icheckbug_mitigarInverter = {};
                Instancia.LuckygamesIo.BugICheckEvent('.' + secaoId + ' .mitigar .inverter input[type="checkbox"]', Modulo.Objetos.icheckbug_mitigarInverter, function() {
                    Modulo.Objetos.$mitigarInverterLabel.css('opacity', this.checked ? 1 : 0.5);
                    Modulo.Params.tela.mitigarInverter = !this.checked ? null : {
                        perdas: Modulo.Objetos.$mitigarInverterPerdas.get(0).number(),
                    };
                }).trigger('ifChanged');

                Modulo.Objetos.$mitigarContinuarTempo.blur(function() {
                    if (Modulo.Params.tela.mitigarContinuar !== null) {
                        Modulo.Params.tela.mitigarContinuar.tempo = this.number();
                    }
                });
                Modulo.Objetos.icheckbug_mitigarContinuar = {};
                Instancia.LuckygamesIo.BugICheckEvent('.' + secaoId + ' .mitigar .continuar input[type="checkbox"]', Modulo.Objetos.icheckbug_mitigarContinuar, function() {
                    Modulo.Objetos.$mitigarContinuarLabel.css('opacity', this.checked ? 1 : 0.5);
                    Modulo.Params.tela.mitigarContinuar = !this.checked ? null : {
                        tempo: Modulo.Objetos.$mitigarContinuarTempo.get(0).number(),
                    };
                }).trigger('ifChanged');

                Modulo.Objetos.$mitigarRiscoMaisMultiplicador.blur(function() {
                    if (Modulo.Params.tela.mitigarRiscoMais !== null) {
                        Modulo.Params.tela.mitigarRiscoMais.multiplicador = this.number();
                    }
                });
                Modulo.Objetos.$mitigarRiscoMaisLimite.blur(function() {
                    if (Modulo.Params.tela.mitigarRiscoMais !== null) {
                        Modulo.Params.tela.mitigarRiscoMais.limite = this.number();
                    }
                });

                let checkboxEmAlteracao = false;

                Modulo.Objetos.icheckbug_mitigarRiscoMais = {};
                Instancia.LuckygamesIo.BugICheckEvent('.' + secaoId + ' .mitigar .riscoMais input[type="checkbox"]', Modulo.Objetos.icheckbug_mitigarRiscoMais, function() {
                    Modulo.Objetos.$mitigarRiscoMaisLabel.css('opacity', this.checked ? 1 : 0.5);
                    Modulo.Params.tela.mitigarRiscoMais = !this.checked ? null : {
                        multiplicador: Modulo.Objetos.$mitigarRiscoMaisMultiplicador.get(0).number(),
                        limite: Modulo.Objetos.$mitigarRiscoMaisLimite.get(0).number()
                    };
                    Modulo.Params.risco.reset();

                    if (checkboxEmAlteracao) return;
                    checkboxEmAlteracao = true;
                    //if (Modulo.Objetos.icheckbug_mitigarRiscoMais) Modulo.Objetos.icheckbug_mitigarRiscoMais.$.iCheck('uncheck');
                    if (Modulo.Objetos.icheckbug_mitigarRiscoSeguro) Modulo.Objetos.icheckbug_mitigarRiscoSeguro.$.iCheck('uncheck');
                    if (Modulo.Objetos.icheckbug_mitigarRiscoNoMinimo) Modulo.Objetos.icheckbug_mitigarRiscoNoMinimo.$.iCheck('uncheck');
                    checkboxEmAlteracao = false;
                }).trigger('ifChanged');

                Modulo.Objetos.$mitigarRiscoSeguroPerdas.blur(function() {
                    if (Modulo.Params.tela.mitigarRiscoSeguro !== null) {
                        Modulo.Params.tela.mitigarRiscoSeguro.perdas = this.number();
                    }
                });
                Modulo.Objetos.$mitigarRiscoSeguroRisco.blur(function() {
                    if (Modulo.Params.tela.mitigarRiscoSeguro !== null) {
                        Modulo.Params.tela.mitigarRiscoSeguro.risco = this.number();
                    }
                });

                Modulo.Objetos.icheckbug_mitigarRiscoSeguro = {};
                Instancia.LuckygamesIo.BugICheckEvent('.' + secaoId + ' .mitigar .riscoSeguro input[type="checkbox"]', Modulo.Objetos.icheckbug_mitigarRiscoSeguro, function() {
                    Modulo.Objetos.$mitigarRiscoSeguroLabel.css('opacity', this.checked ? 1 : 0.5);
                    Modulo.Params.tela.mitigarRiscoSeguro = !this.checked ? null : {
                        perdas: Modulo.Objetos.$mitigarRiscoSeguroPerdas.get(0).number(),
                        risco: Modulo.Objetos.$mitigarRiscoSeguroRisco.get(0).number()
                    };

                    if (checkboxEmAlteracao) return;
                    checkboxEmAlteracao = true;
                    if (Modulo.Objetos.icheckbug_mitigarRiscoMais) Modulo.Objetos.icheckbug_mitigarRiscoMais.$.iCheck('uncheck');
                    //if (Modulo.Objetos.icheckbug_mitigarRiscoSeguro) Modulo.Objetos.icheckbug_mitigarRiscoSeguro.$.iCheck('uncheck');
                    if (Modulo.Objetos.icheckbug_mitigarRiscoNoMinimo) Modulo.Objetos.icheckbug_mitigarRiscoNoMinimo.$.iCheck('uncheck');
                    checkboxEmAlteracao = false;
                }).trigger('ifChanged');

                Modulo.Objetos.$mitigarRiscoNoMinimoPerdas.blur(function() {
                    if (Modulo.Params.tela.mitigarRiscoNoMinimo !== null) {
                        Modulo.Params.tela.mitigarRiscoNoMinimo.perdas = this.number();
                    }
                });
                Modulo.Objetos.$mitigarRiscoNoMinimoRisco.blur(function() {
                    if (Modulo.Params.tela.mitigarRiscoNoMinimo !== null) {
                        Modulo.Params.tela.mitigarRiscoNoMinimo.risco = this.number();
                    }
                });
                Modulo.Objetos.$mitigarRiscoNoMinimoModo.change(function() {
                    if (Modulo.Params.tela.mitigarRiscoNoMinimo !== null) {
                        Modulo.Params.tela.mitigarRiscoNoMinimo.modo = this.value;
                    }
                });

                Modulo.Objetos.icheckbug_mitigarRiscoNoMinimo = {};
                Instancia.LuckygamesIo.BugICheckEvent('.' + secaoId + ' .mitigar .riscoNoMinimo input[type="checkbox"]', Modulo.Objetos.icheckbug_mitigarRiscoNoMinimo, function() {
                    Modulo.Objetos.$mitigarRiscoNoMinimoLabel.css('opacity', this.checked ? 1 : 0.5);
                    Modulo.Params.tela.mitigarRiscoNoMinimo = !this.checked ? null : {
                        modo: Modulo.Objetos.$mitigarRiscoNoMinimoModo.get(0).value,
                        perdas: Modulo.Objetos.$mitigarRiscoNoMinimoPerdas.get(0).number(),
                        risco: Modulo.Objetos.$mitigarRiscoNoMinimoRisco.get(0).number()
                    };

                    if (checkboxEmAlteracao) return;
                    checkboxEmAlteracao = true;
                    if (Modulo.Objetos.icheckbug_mitigarRiscoMais) Modulo.Objetos.icheckbug_mitigarRiscoMais.$.iCheck('uncheck');
                    if (Modulo.Objetos.icheckbug_mitigarRiscoSeguro) Modulo.Objetos.icheckbug_mitigarRiscoSeguro.$.iCheck('uncheck');
                    //if (Modulo.Objetos.icheckbug_mitigarRiscoNoMinimo) Modulo.Objetos.icheckbug_mitigarRiscoNoMinimo.$.iCheck('uncheck');
                    checkboxEmAlteracao = false;
                }).trigger('ifChanged');

                Modulo.Objetos.$saldoMeta.blur(function() {
                    const saldo = this.valor_inicial();
                    const meta = this.number();
                    if (Number.isFinite(meta) && meta < saldo) {
                        $(this).val(saldo).blur();
                    }
                    Modulo.Params.tela.meta = meta;
                });
                Modulo.Objetos.$saldoMeta.get(0).valor_inicial = Instancia.LuckygamesIo.Parametros.Balance;

                Modulo.Objetos.$arriscar.blur(function() {
                    const arriscado = (Instancia.LuckygamesIo.Parametros.Balance() * (this.number() / 100));
                    Modulo.Objetos.$arriscado.html(arriscado.formatado());
                    Modulo.Params.tela.arriscado = parseFloat(arriscado.toFixed(8));
                });
                Modulo.Objetos.$arriscar.get(0).valor_inicial = () => 100;
                Modulo.Objetos.$arriscar.blur();

                Modulo.Objetos.$prediction.blur(function() {
                    const prediction = this.number();
                    const direcao = Instancia.LuckygamesIo.ValoresMultiplicadores["_" + prediction] >= 1 ? 'maior' : 'menor';
                    const multiplicador = direcao === 'maior' ? Instancia.LuckygamesIo.ValoresMultiplicadores["_" + prediction] : Instancia.LuckygamesIo.ValoresMultiplicadores["_" + (99 - prediction)];
                    Modulo.Objetos.$predictionMultiplicador.html(multiplicador + 'x');
                    Modulo.Objetos.$predictionRegra.html(direcao + ' que ' + prediction);
                    Modulo.Params.tela.prediction = prediction;
                    
                    if (Modulo.Params.tela.apostaPerdas !== null) { Modulo.Objetos.$apostaPerdas.blur(); }
                    else if (Modulo.Params.tela.apostaPorcento !== null) { Modulo.Objetos.$apostaPorcento.blur(); }
                    else if (Modulo.Params.tela.apostaValor !== null) { Modulo.Objetos.$apostaValor.blur(); }
                });
                Modulo.Objetos.$prediction.blur();

                Modulo.Objetos.$aposta.blur(Modulo.CalcularAposta);
                Modulo.Objetos.$apostaPorcento.val('0,1').blur();
                Modulo.CalcularAposta();

                let pulsarUltimo = null;
                Modulo.Objetos.$pulsarLimite = container.find('.pulsar input');
                Modulo.Objetos.$pulsarLimite.get(0).valor_inicial = () => Instancia.Estatisticas.Dados.Calculo.saldoAtual();
                Modulo.Objetos.$pulsarButtons = container.find('.pulsar button');
                Modulo.Objetos.$pulsarButtons.mousedown(function() {
                    const button = $(this);
                    button.addClass("click");
                    const value = button.text();
                    if (pulsarUltimo == null) pulsarUltimo = {
                        arriscar: Modulo.Objetos.$arriscar.val(),
                        limite: Instancia.Modulos.Limites.Objetos.$saldoMinimo.val(),
                    };
                    Modulo.Objetos.$arriscar.val(value).blur();
                    Instancia.Modulos.Limites.Objetos.$saldoMinimo.val(Modulo.Objetos.$pulsarLimite.val()).blur();
                });
                Modulo.Objetos.$pulsarButtons.mouseup(function() {
                    const button = $(this);
                    button.removeClass("click");
                    if (pulsarUltimo != null) {
                        Modulo.Objetos.$arriscar.val(pulsarUltimo.arriscar).blur();
                        Instancia.Modulos.Limites.Objetos.$saldoMinimo.val(pulsarUltimo.limite).blur();
                        pulsarUltimo = null;
                    }
                });

                Modulo.Objetos.$btnParar.on('click', function() { 
                    Modulo.Status('parar');
                });
                Modulo.Objetos.$btnPausar.on('click', function() { 
                    Modulo.Status(!this.ativo ? 'pausar' : 'reiniciar');
                });
                Modulo.Objetos.$btnLigar.on('click', function() {  
                    Modulo.Status(!this.ativo ? 'ligar' : 'desligar');
                });
                Modulo.Objetos.$btnPulsar.on('mousedown', function() { 
                    Modulo.Status('pulsar-on'); 
                });
                Modulo.Objetos.$btnPulsar.on('mouseup', function() { 
                    Modulo.Status('pulsar-off'); 
                });
                Modulo.Status('desligado');
            },

            atualizarExibicao: () => {

                Modulo.Objetos.saldoAtual.innerHTML = Instancia.LuckygamesIo.Parametros.Balance().formatado();
                
                if (Modulo.Params.andamento !== null) {
                    const params = Object.assign({}, Modulo.Params.andamento);
                    params.prediction = (params.direcao === 'over' ? 'maior que ' : 'menor que ') + params.prediction;
                    params.apostaInicial = params.apostaInicial.toFixed(8);
                    params.aposta = params.aposta.toFixed(8);
                    params.maximo = params.maximo.toFixed(8);
                    params.minimo = params.minimo.toFixed(8);
                    params.lucro = params.lucro.toFixed(8);
                    delete params.direcao;
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
                        '          Prediction: ' + params.prediction + '\n' +
                        '       Meta de ganho: ' + params.maximo + '\n' +
                        '     Primeira Aposta: ' + params.apostaInicial + '\n' +
                        '       Última Aposta: ' + params.aposta + '\n' +
                        '         Perda atual: ' + params.lucro + '\n' +
                        '     Limite de perda: ' + params.minimo + '\n' +
                        ' Sequência de perdas: ' + params.perdas + '\n' +
                        '            Recomeço: ' + params.recomeco + '\n' +
                        '        Saldo zerado: ' + params.saldoZerado + '\n'
                    );
                }
                
            },
        };

        Modulo.Status = (status) => {
            if (status === 'parar' && !confirm('Atenção! Parar pode resultar em perdas. Parar assim mesmo?')) { return; }

            Modulo.Objetos.$info.html('Desligado');
            Modulo.Objetos.$btns.hide();
            switch (status) {
                case 'pulsar-on':
                    Modulo.Objetos.$btnPulsar.show();
                    Modulo.Params.controle.pulsar = true;
                    Modulo.Objetos.$info.html('Ligado enquanto segura o botão');
                    break;
                case 'pulsar-off':
                    Modulo.Objetos.$btnParar.show();
                    Modulo.Params.controle.pulsar = false;
                    Modulo.Objetos.$info.html('Desligando. Aguarde...');
                    break;
                case 'ligar':                    
                    Modulo.Objetos.$btnParar.show();
                    Modulo.Objetos.$btnPausar.show();
                    Modulo.Objetos.$btnLigar.show();
                    Modulo.Objetos.$btnLigar.html('Desligar');
                    Modulo.Objetos.$btnLigar.get(0).ativo = true;
                    Modulo.Params.controle.ligar = true;
                    Modulo.Objetos.$info.html('Ligado');
                    break;
                case 'desligar':
                    Modulo.Objetos.$btnParar.show();
                    Modulo.Params.controle.ligar = false;
                    Modulo.Objetos.$info.html('Desligando. Aguarde...');
                    break;
                case 'pausar':
                    Modulo.Objetos.$btnParar.show();
                    Modulo.Objetos.$btnPausar.show();
                    Modulo.Objetos.$btnPausar.html('Reiniciar');
                    Modulo.Objetos.$btnPausar.get(0).ativo = true;
                    Modulo.Params.controle.pausar = true;
                    Modulo.Objetos.$info.html('Ligado, mas em pausa');
                    break;
                case 'reiniciar':
                    Modulo.Objetos.$btnParar.show();
                    Modulo.Objetos.$btnLigar.show();
                    Modulo.Objetos.$btnPausar.show();
                    Modulo.Objetos.$btnPausar.html('Pausar');
                    Modulo.Objetos.$btnPausar.get(0).ativo = false;
                    Modulo.Params.controle.pausar = false;
                    Modulo.Objetos.$info.html('Ligado');
                    break;
                case 'parar':                    
                    Modulo.Params.controle.parar = true;
                    Modulo.Objetos.$info.html('Forçando parada imediata. Aguarde...');
                    break;
                case 'desligado':
                    Modulo.Objetos.$btnPulsar.show();
                    Modulo.Params.controle.pulsar = false;
                    Modulo.Objetos.$btnPausar.html('Pausar');
                    Modulo.Objetos.$btnPausar.get(0).ativo = false;
                    Modulo.Objetos.$btnLigar.show();
                    Modulo.Objetos.$btnLigar.html('Ligar');
                    Modulo.Objetos.$btnLigar.get(0).ativo = false;
                    Modulo.Params.controle.pulsar = false;
                    Modulo.Params.controle.ligar = false;
                    Modulo.Params.controle.pausar = false;
                    Modulo.Params.controle.parar = false;
                    Instancia.Layout.AtualizarExibicao.Executar();
                    Modulo.Params.andamento = null;
                    break;
            }
            if (Modulo.Params.controle.ligar || Modulo.Params.controle.pulsar) {
                Modulo.Objetos.$log.show();
                Modulo.Objetos.$logFechar.hide();
            } else {
                Modulo.Objetos.$logFechar.show();
            }
            if (status !== 'desligado') {
                Modulo.Processar();
            }
        };

        Modulo.CalcularAposta = function(e) {            
            const forcar = !e;
            const input = 
                e ? this : 
                Modulo.Objetos.$apostaPerdas.hasClass('ativo') ? Modulo.Objetos.$apostaPerdas.get(0) :
                Modulo.Objetos.$apostaPorcento.hasClass('ativo') ? Modulo.Objetos.$apostaPorcento.get(0) :
                Modulo.Objetos.$apostaValor.hasClass('ativo') ? Modulo.Objetos.$apostaValor.get(0) :
                null;

            if (!input) { return; }

            const $input = $(input);

            const $inputPrediction = Modulo.Objetos.$prediction;
            const inputPrediction = $inputPrediction.get(0);

            if (!forcar && input.number_bkp === input.number() && inputPrediction.number_bkp === inputPrediction.number()) { return; }
            input.number_bkp = input.number();
            inputPrediction.number_bkp = inputPrediction.number();

            if ($input.hasClass('calculando')) { return; }
            Modulo.Objetos.$aposta.addClass('calculando');

            Modulo.Params.tela.apostaPerdas = null;
            Modulo.Params.tela.apostaPorcento = null;
            Modulo.Params.tela.apostaValor = null;

            Modulo.Objetos.$apostaInfo.show();
            if (!(Modulo.Params.tela.arriscado > 0)) {
                Modulo.Objetos.$apostaPerdas.val('').blur();
                Modulo.Objetos.$apostaValor.val('').blur();
                Modulo.Objetos.$apostaPorcento.val('').blur();
                Modulo.Objetos.$apostaInfo.hide();
            } else if ($input.hasClass('perdas')) {
                let perdas = input.number();
                let valor = Modulo.CalcularApostaValor(perdas, Modulo.Params.tela.arriscado, Modulo.Params.tela.prediction);

                if (valor === null) {
                    valor = 0.00000001;
                    perdas = Modulo.CalcularApostaPerdas(valor, Modulo.Params.tela.arriscado, Modulo.Params.tela.prediction);
                }

                const porcento = 100 * valor / Modulo.Params.tela.arriscado;

                Modulo.Objetos.$apostaPerdas.val(perdas.toFixed(8)).blur();
                Modulo.Objetos.$apostaValor.val(valor.toFixed(8)).blur();
                Modulo.Objetos.$apostaPorcento.val(porcento.toFixed(8)).blur();

                Modulo.Params.tela.apostaPerdas = perdas;
            } else if ($input.hasClass('porcento')) {

                let valor;
                let porcento = input.number();
                if (!Number.isFinite(porcento)) {
                    valor = 0.00000001;
                    porcento = 100 * valor / Modulo.Params.tela.arriscado;
                } else {
                    valor = Modulo.Params.tela.arriscado * porcento / 100;
                }
                const perdas = Modulo.CalcularApostaPerdas(valor, Modulo.Params.tela.arriscado, Modulo.Params.tela.prediction);

                Modulo.Objetos.$apostaPerdas.val(perdas.toFixed(8)).blur();
                Modulo.Objetos.$apostaValor.val(valor.toFixed(8)).blur();
                Modulo.Objetos.$apostaPorcento.val(porcento.toFixed(8)).blur();
                
                Modulo.Params.tela.apostaPorcento = porcento;
            } else if ($input.hasClass('valor')) {
                
                let valor = input.number();
                if (!Number.isFinite(valor)) {
                    valor = 0.00000001;
                }
                if (valor > Modulo.Params.tela.arriscado) {
                    valor = Modulo.Params.tela.arriscado;
                }
                const porcento = 100 * valor / Modulo.Params.tela.arriscado;
                const perdas = Modulo.CalcularApostaPerdas(valor, Modulo.Params.tela.arriscado, Modulo.Params.tela.prediction);
                
                Modulo.Objetos.$apostaPerdas.val(perdas.toFixed(8)).blur();
                Modulo.Objetos.$apostaValor.val(valor.toFixed(8)).blur();
                Modulo.Objetos.$apostaPorcento.val(porcento.toFixed(8)).blur();

                Modulo.Params.tela.apostaValor = valor;
            }
            
            if (Modulo.Objetos.$apostaInfo.is(':visible') || forcar) {
                const multiplicador = Instancia.LuckygamesIo.ValoresMultiplicadores['_' + Modulo.Params.tela.prediction] >= 1 ? Instancia.LuckygamesIo.ValoresMultiplicadores['_' + Modulo.Params.tela.prediction] : Instancia.LuckygamesIo.ValoresMultiplicadores['_' + (99 - Modulo.Params.tela.prediction)];
                const predictionOver = Instancia.LuckygamesIo.ValoresMultiplicadores['_' + Modulo.Params.tela.prediction] >= 1 ? Modulo.Params.tela.prediction : 99 - Modulo.Params.tela.prediction;
                const idealBase = 16;
                const ideal = parseInt((50 / predictionOver) * (idealBase * multiplicador));

                Modulo.Objetos.$apostaInfo.find('span').html(ideal);
                Modulo.Objetos.$mitigarEvitarPerdas.attr('number-padrao', parseInt((ideal / 4) * 2));
                Modulo.Objetos.$mitigarMinimoPerdas.attr('number-padrao', parseInt(ideal / 4));
                Modulo.Objetos.$mitigarEsperaPerdas.attr('number-padrao', parseInt(ideal / 4));
                Modulo.Objetos.$mitigarDesistirPerdas.attr('number-padrao', parseInt(ideal / 5));
                Modulo.Objetos.$mitigarInverterPerdas.attr('number-padrao', parseInt(ideal / 5));
                if (!Modulo.Objetos.icheckbug_mitigarEvitar.o.checked) {
                    Modulo.Objetos.$mitigarEvitarPerdas.val(Modulo.Objetos.$mitigarEvitarPerdas.attr('number-padrao')).blur();
                }
                if (!Modulo.Objetos.icheckbug_mitigarMinimo.o.checked) {
                    Modulo.Objetos.$mitigarMinimoPerdas.val(Modulo.Objetos.$mitigarMinimoPerdas.attr('number-padrao')).blur();
                }
                if (!Modulo.Objetos.icheckbug_mitigarEspera.o.checked) {
                    Modulo.Objetos.$mitigarEsperaPerdas.val(Modulo.Objetos.$mitigarEsperaPerdas.attr('number-padrao')).blur();
                }
                if (!Modulo.Objetos.icheckbug_mitigarDesistir.o.checked) {
                    Modulo.Objetos.$mitigarDesistirPerdas.val(Modulo.Objetos.$mitigarDesistirPerdas.attr('number-padrao')).blur();
                }
                if (!Modulo.Objetos.icheckbug_mitigarInverter.o.checked) {
                    Modulo.Objetos.$mitigarInverterPerdas.val(Modulo.Objetos.$mitigarInverterPerdas.attr('number-padrao')).blur();
                }
            } else {
                Modulo.Objetos.$mitigarEvitarPerdas.attr('number-padrao', 1);
                Modulo.Objetos.$mitigarMinimoPerdas.attr('number-padrao', 1);
                Modulo.Objetos.$mitigarEsperaPerdas.attr('number-padrao', 1);
                Modulo.Objetos.$mitigarDesistirPerdas.attr('number-padrao', 1);
                Modulo.Objetos.$mitigarInverterPerdas.attr('number-padrao', 1);
            }

            Modulo.Objetos.$aposta.removeClass('calculando');
            Modulo.Objetos.$aposta.removeClass('ativo');
            $input.addClass('ativo');
        };

        Modulo.CalcularApostaPerdas = (aposta, saldo, prediction) => {
            let perdas = 0;
            const multiplicador = Instancia.LuckygamesIo.ValoresMultiplicadores['_' + prediction] >= 1 ? Instancia.LuckygamesIo.ValoresMultiplicadores['_' + prediction] : Instancia.LuckygamesIo.ValoresMultiplicadores['_' + (99 - prediction)];
            const saldoFinal = saldo + aposta * multiplicador;
            let apostaCorrente = aposta;
            while (saldo > 0 && apostaCorrente < saldo) {
                apostaCorrente = (saldoFinal - saldo) / multiplicador;
                saldo -= apostaCorrente;

                perdas++;
            }
            return perdas;            
        };

        Modulo.CalcularApostaValor = (perdas, saldo, prediction) => {
            if (!Number.isFinite(perdas) || perdas < 0) { return null; }

            let aposta = 0.00000001;
            let perdasCalculadas = Modulo.CalcularApostaPerdas(aposta, saldo, prediction);
            
            if (perdas > perdasCalculadas) { return null; }
            else if (perdas === perdasCalculadas) { return aposta; }
            
            aposta = 0;
            let metade = saldo;
            do {
                aposta += perdas < perdasCalculadas ? metade : -metade;
                perdasCalculadas = Modulo.CalcularApostaPerdas(aposta, saldo, prediction);
                metade /= 2;              
            } while (perdas != perdasCalculadas);

            return aposta;
        };

        Modulo.ObterDadosParaApostar = (manterValores) => {
            const bkp = {};
            if (Modulo.Params.andamento) {
                manterValores = Array.isArray(manterValores) ? manterValores : [manterValores];
                for (let i = 0; i < manterValores.length; i++) {
                    bkp[manterValores[i]] = Modulo.Params.andamento[manterValores[i]];
                }
            }

            const tmp = {};
            tmp.ctrl_apostaAtiva = Modulo.Objetos.apostaAtiva();
            tmp.arriscar = Modulo.Objetos.$arriscar.val();
            tmp.apostaAtiva = tmp.ctrl_apostaAtiva.val();
            Modulo.Objetos.$arriscar.val('').blur().val(tmp.arriscar).blur();
            tmp.ctrl_apostaAtiva.val('').blur().val(tmp.apostaAtiva).blur();

            const result = { };

            result.prediction = Modulo.Params.tela.prediction;
            result.minimo = -Modulo.Params.tela.arriscado;
            
            result.aposta = 
                Modulo.Params.tela.apostaValor !== null ? Modulo.Params.tela.apostaValor :
                Modulo.Params.tela.apostaPorcento !== null ? (Modulo.Params.tela.apostaPorcento / 100) * Modulo.Params.tela.arriscado : 
                Modulo.Params.tela.apostaPerdas !== null ? Modulo.CalcularApostaValor(Modulo.Params.tela.apostaPerdas, Modulo.Params.tela.arriscado, Modulo.Params.tela.prediction) :
                null;

            if (result.aposta === null) {
                result = null;
                Instancia.Geral.Toast('Ocorreu um erro ao iniciar as apostas. Contate o suporte do módulo ' + Modulo.Secao.Titulo + '. ERR-J1JH3', 'error');
                return;
            }

            result.apostaInicial = result.aposta = parseFloat(result.aposta.toFixed(8));
            result.direcao = Instancia.LuckygamesIo.ValoresMultiplicadores['_' + result.prediction] >= 1 ? 'over' : 'under';
            result.multiplicador = result.direcao === 'over' ? Instancia.LuckygamesIo.ValoresMultiplicadores['_' + result.prediction] : Instancia.LuckygamesIo.ValoresMultiplicadores['_' + (99 - result.prediction)];
            result.maximo = parseFloat((result.aposta * result.multiplicador).toFixed(8));
            result.lucro = 0;
            result.perdas = 0;
            result.saldoZerado = 0;
            result.recomeco = 0;

            const keys = Object.keys(bkp);
            for (let i = 0; i < keys.length; i++) {
                result[keys[i]] = bkp[keys[i]];
                
            }

            return result;
        };

        Modulo.Processar = () => {
            if ((Modulo.Params.controle.pulsar || Modulo.Params.controle.ligar) && Modulo.Params.andamento === null) {
                Modulo.Params.andamento = Modulo.ObterDadosParaApostar();
            }

            if (!Modulo.Params.controle.loop) {
                Modulo.Processamento();
            }
        };

        Modulo.Processamento = (forcar = false) => {
            if (!forcar || Modulo.Params.controle.pausar) {
                if (Modulo.Params.controle.parar || Modulo.Params.controle.pausar || (!Modulo.Params.controle.ligar && !Modulo.Params.controle.pulsar)) {
                    Modulo.Params.controle.loop = false;
                    if (Modulo.Params.controle.parar || (!Modulo.Params.controle.ligar && !Modulo.Params.controle.pulsar)) {
                        Modulo.Status('desligado'); 
                    }
                    return;
                }
            }

            const parar = () => {
                Modulo.Params.controle.loop = false;
                Modulo.Status('desligado');
            }

            Modulo.Params.andamento.evitar = Number.isFinite(Modulo.Params.andamento.evitar) ? Modulo.Params.andamento.evitar : (Modulo.Params.tela.mitigarEvitar !== null ? Modulo.Params.tela.mitigarEvitar.perdas : null);
            Modulo.Params.andamento.evitarPerdas = Number.isFinite(Modulo.Params.andamento.evitarPerdas) ? Modulo.Params.andamento.evitarPerdas : 0;

            Modulo.Params.controle.loop = true;
            const apostaValor = Modulo.Params.andamento.evitar ? "0.00000001" : Modulo.Params.andamento.aposta.toFixed(8);
            Instancia.LuckygamesIo.Apostar(apostaValor, Modulo.Params.andamento.direcao, Modulo.Params.andamento.prediction)
                .then((response) => {
                    if (Modulo.Params.controle.parar) {
                        return parar();
                    }

                    if (Modulo.Params.tela.mitigarRiscoSeguro !== null) {

                        if (Modulo.Params.tela.mitigarRiscoSeguro.arriscarOriginal &&
                            Tips.Estatisticas.Dados.sequenciaPerdendo < Modulo.Params.tela.mitigarRiscoSeguro.sequenciaPerdendo) {

                            Modulo.Objetos.$arriscar.val(Modulo.Params.tela.mitigarRiscoSeguro.arriscarOriginal).blur();
                            Modulo.Params.tela.mitigarRiscoSeguro.arriscarOriginal = null;

                        } else if (!Modulo.Params.tela.mitigarRiscoSeguro.arriscarOriginal &&
                                    Tips.Estatisticas.Dados.sequenciaPerdendo == Modulo.Params.tela.mitigarRiscoSeguro.perdas) {

                            Modulo.Params.tela.mitigarRiscoSeguro.sequenciaPerdendo = Tips.Estatisticas.Dados.sequenciaPerdendo;
                            Modulo.Params.tela.mitigarRiscoSeguro.arriscarOriginal = Modulo.Objetos.$arriscar.get(0).number();
                            Modulo.Objetos.$arriscar.val(Modulo.Params.tela.mitigarRiscoSeguro.risco).blur();
                        }
                    }

                    if (Modulo.Params.tela.mitigarRiscoNoMinimo !== null) {
                        if (response.gameResult == "win") {
                            if (Modulo.Params.tela.mitigarRiscoNoMinimo.arriscarOriginal &&
                                Tips.Estatisticas.Dados.sequenciaPerdendo > Modulo.Params.tela.mitigarRiscoNoMinimo.perdas) {

                                Modulo.Objetos.$arriscar.val(Modulo.Params.tela.mitigarRiscoNoMinimo.arriscarOriginal).blur();
                                Modulo.Params.tela.mitigarRiscoNoMinimo.arriscarOriginal = null;

                            } else if (!Modulo.Params.tela.mitigarRiscoNoMinimo.arriscarOriginal &&
                                        Tips.Estatisticas.Dados.sequenciaPerdendo <= Modulo.Params.tela.mitigarRiscoNoMinimo.perdas) {

                                Modulo.Params.tela.mitigarRiscoNoMinimo.arriscarOriginal = Modulo.Objetos.$arriscar.get(0).number();
                                Modulo.Objetos.$arriscar.val(Modulo.Params.tela.mitigarRiscoNoMinimo.risco).blur();
                            }
                        } else if (response.gameResult == "lose") {
                            if (Modulo.Params.tela.mitigarRiscoNoMinimo.modo === 'desistir' &&
                                Modulo.Params.tela.mitigarRiscoNoMinimo.arriscarOriginal &&
                                Tips.Estatisticas.Dados.sequenciaPerdendo > Modulo.Params.tela.mitigarRiscoNoMinimo.perdas) {

                                Modulo.Objetos.$arriscar.val(Modulo.Params.tela.mitigarRiscoNoMinimo.arriscarOriginal).blur();
                                Modulo.Params.tela.mitigarRiscoNoMinimo.arriscarOriginal = null;

                                Modulo.Params.andamento = Modulo.ObterDadosParaApostar(['saldoZerado', 'recomeco']);
                            }
                        }
                    }

                    if (Modulo.Params.andamento.evitar > 0) {
                        if (response.gameResult === "lose") Modulo.Params.andamento.evitarPerdas++;
                        else if (response.gameResult === "win") Modulo.Params.andamento.evitarPerdas = 0;
                        
                        if (Instancia.Estatisticas.Dados.sequenciaPerdendo < Modulo.Params.andamento.evitarPerdas &&
                            Modulo.Params.andamento.evitarPerdas >= Modulo.Params.andamento.evitar) {
                            Modulo.Params.andamento.evitar = 0;                                
                        }
                        Modulo.Processamento();
                        return;
                    }
                    if (response.gameResult === "win") {
                        Modulo.Params.andamento.evitar = null;
                        Modulo.Params.andamento.evitarPerdas = null;

                        const saldoAtual = Instancia.LuckygamesIo.Parametros.Balance();
                        if (Modulo.Params.risco.saldoMaior == null || Modulo.Params.risco.saldoMaior < saldoAtual) {
                            Modulo.Params.risco.saldoMaior = saldoAtual;
                        }
                    }

                    Modulo.Params.andamento.lucro += parseFloat(response.profit);
                    Modulo.Params.andamento.aposta = parseInt(((Modulo.Params.andamento.maximo - Modulo.Params.andamento.lucro) / Modulo.Params.andamento.multiplicador) * 100000000) / 100000000;
                    const venceu = Modulo.Params.andamento.aposta < 0.00000001;
                    const limiteDePerda = Modulo.Params.andamento.lucro - Modulo.Params.andamento.aposta < Modulo.Params.andamento.minimo;
                    
                    if (venceu || limiteDePerda) {
                        Modulo.Params.andamento.saldoZerado = limiteDePerda ? Modulo.Params.andamento.saldoZerado + 1 : Modulo.Params.andamento.saldoZerado;
                        Modulo.Params.andamento = Modulo.ObterDadosParaApostar(['saldoZerado', 'recomeco']);
                        if (limiteDePerda) {
                            Instancia.Geral.Audio('warning');
                            window.dispatchEvent(new Event("BotZerou"));

                            if (Modulo.Params.tela.mitigarRiscoMais !== null) {
                                Modulo.Params.risco.novoNivel++;
                                if (!Modulo.Params.risco.interval) {
                                    Modulo.Params.risco.interval = setInterval(() => {
                                        if (!Modulo.Params.risco.atual) {
                                            Modulo.Params.risco.atual = Modulo.Objetos.$arriscar.get(0).number();
                                            Modulo.Params.risco.saldoAlvo = Modulo.Params.risco.saldoMaior;
                                        }
                                        const saldoAtual = Instancia.LuckygamesIo.Parametros.Balance();
                                        let desistir = false;
                                        if (Modulo.Params.risco.novoNivel != Modulo.Params.risco.ultimoNivel) {
                                            Modulo.Params.risco.ultimoNivel = Modulo.Params.risco.novoNivel;
                                            const novoArriscar = Modulo.Params.risco.atual * Math.pow(Modulo.Params.tela.mitigarRiscoMais.multiplicador, Modulo.Params.risco.novoNivel);
                                            if (novoArriscar > Modulo.Params.tela.mitigarRiscoMais.limite) {
                                                desistir = true;
                                                Modulo.Params.risco.saldoMaior = saldoAtual;
                                            } else {
                                                Modulo.Objetos.$arriscar.val(novoArriscar).blur();
                                            }
                                        }
                                        if (desistir || saldoAtual >= Modulo.Params.risco.saldoAlvo) {
                                            Modulo.Params.risco.reset();
                                        }
                                    }, 100);
                                }
                            }

                            if (Modulo.Params.tela.mitigarInterromperZerar !== null && (Modulo.Params.andamento.saldoZerado >= Modulo.Params.tela.mitigarInterromperZerar.vezes)) {
                                return parar();
                            }
                        } else if (Number.isFinite(Modulo.Params.tela.meta) && Instancia.LuckygamesIo.Parametros.Balance() > Modulo.Params.tela.meta) {
                            Instancia.Geral.Audio('limit-good');
                            return parar();
                        }
                    } else {
                        Modulo.Params.andamento.perdas++;
                    }
                    
                    let vencer = 0;
                    let espera = 0;
                    if (response.gameResult === "lose") {                        
                        if (Modulo.Params.tela.mitigarInverter !== null && (Modulo.Params.andamento.perdas % Modulo.Params.tela.mitigarInverter.perdas === 0)) {
                            Modulo.Objetos.$prediction.val(99 - Modulo.Params.tela.prediction).blur();
                            Modulo.Params.andamento.prediction = Modulo.Params.tela.prediction;
                            Modulo.Params.andamento.direcao = Instancia.LuckygamesIo.ValoresMultiplicadores['_' + Modulo.Params.andamento.prediction] >= 1 ? 'over' : 'under';
                            Modulo.Params.andamento.multiplicador = Modulo.Params.andamento.direcao === 'over' ? Instancia.LuckygamesIo.ValoresMultiplicadores['_' + Modulo.Params.andamento.prediction] : Instancia.LuckygamesIo.ValoresMultiplicadores['_' + (99 - Modulo.Params.andamento.prediction)];
                        }
                        if (Modulo.Params.tela.mitigarMinimo !== null && (Modulo.Params.andamento.perdas % Modulo.Params.tela.mitigarMinimo.perdas === 0)) {
                            vencer = Modulo.Params.tela.mitigarMinimo.vezes;
                        }
                        if (Modulo.Params.tela.mitigarEspera !== null && (Modulo.Params.andamento.perdas % Modulo.Params.tela.mitigarEspera.perdas === 0)) {
                            espera = Modulo.Params.tela.mitigarEspera.tempo;
                        }                        
                        if (Modulo.Params.tela.mitigarDesistir !== null && Modulo.Params.andamento.perdas >= Modulo.Params.tela.mitigarDesistir.perdas) {
                            switch (Modulo.Params.tela.mitigarDesistir.modo) {
                                case 'parar':
                                    return parar();                                    
                                case 'recomecar':
                                    Modulo.Params.andamento.recomeco = Modulo.Params.andamento.recomeco ? Modulo.Params.andamento.recomeco + 1 : 1;
                                    Modulo.Params.andamento = Modulo.ObterDadosParaApostar(['saldoZerado', 'recomeco']);
                                    if (espera < Modulo.Params.tela.mitigarDesistir.tempo) {
                                        espera = Modulo.Params.tela.mitigarDesistir.tempo;
                                    }
                                    break;
                            }
                        }
                    }

                    const fProcessamento = () => { 
                        if (Modulo.Params.controle.parar) {
                            return parar();
                        }
                        Modulo.Processamento(!venceu && !limiteDePerda);
                    };
                    const fApostaMinima = vencer === 0 ? null : () => {
                        Modulo.Params.andamento.evitar = null;
                        Modulo.Params.andamento.evitarPerdas = null;
                        Instancia.LuckygamesIo.Apostar('0.00000001', Modulo.Params.andamento.direcao, Modulo.Params.andamento.prediction)
                            .then((response2) => {
                                if (Modulo.Params.controle.parar) {
                                    return parar();
                                }
                                if (response2.gameResult === 'win') {
                                    vencer--;
                                }
                                if (vencer > 0) {
                                    fApostaMinima();
                                } else {
                                    if (Modulo.Params.controle.pausar) {
                                        Modulo.Params.controle.loop = false;
                                    } else {
                                        fProcessamento();
                                    }
                                }
                            })
                            .catch((erro2) => {
                                if (!Modulo.Params.controle.pausar) {
                                    Modulo.Params.controle.loop = false;
                                    Modulo.Objetos.$btnPausar.click();
                                }
                                Instancia.Geral.Toast('Ops! Ocorreu um erro no envio da aposta. ' + erro);
                            });
                    };
                    
                    if (espera > 0) {
                        setTimeout(fApostaMinima ? fApostaMinima : fProcessamento, espera);
                    } else if (vencer > 0) {
                        fApostaMinima();
                    } else {
                        fProcessamento();
                    }
                })
                .catch((erro) => {
                    if (!Modulo.Params.controle.pausar) {
                        Modulo.Params.controle.loop = false;
                        Modulo.Objetos.$btnPausar.click();
                        
                        if (Modulo.Params.tela.mitigarContinuar && Modulo.Params.tela.mitigarContinuar.tempo > 0) {
                            setTimeout(() => { Modulo.Objetos.$btnPausar.click(); }, Modulo.Params.tela.mitigarContinuar.tempo);
                        }
                    }
                    Instancia.Geral.Toast('Ops! Ocorreu um erro no envio da aposta. ' + erro);
                });
        };

        Modulo.QuandoLimiteAtingido = () => {
            Modulo.Params.controle.loop = false;
            Modulo.Status('desligado');
        };
        
        Modulo.Params = {
            controle: {
                pulsar: null,
                ligar: null,
                pausar: null,
                parar: null,
                loop: null,
                flagLimite: 'qualquer valor aqui',
            },
            tela: {
                meta: null,
                arriscado: null,
                prediction: null,
                apostaPerdas: null,
                apostaPorcento: null,
                apostaValor: null,
                mitigarEvitar: {
                    perdas: null,
                },
                mitigarMinimo: {
                    perdas: null,
                    vezes: null,
                },
                mitigarEspera: {
                    perdas: null,
                    tempo: null,
                },
                mitigarInterromperZerar: {
                    vezes: null,
                },
                mitigarDesistir: {
                    perdas: null,
                    modo: null,
                    tempo: null,
                },
                mitigarInverter: {
                    perdas: null,
                },
                mitigarContinuar: {
                    tempo: null,
                },
                mitigarRiscoMais: {
                    multiplicador: null,
                    limite: null,
                },
                mitigarRiscoSeguro: {
                    perdas: null,
                    risco: null,
                    ativo: null,
                },
                mitigarRiscoNoMinimo: {
                    perdas: null,
                    risco: null,
                    ativo: null,
                    modo: null,
                },
            },
            andamento: {
                direcao: null,
                prediction: null,
                multiplicador: null,
                apostaInicial: null,
                aposta: null,
                minimo: null,
                maximo: null,
                lucro: null,
                perdas: null,
                saldoZerado: null,
                recomeco: null,
                evitar: null,
                evitarPerdas: null,
            },
            risco: {
                atual: null,
                novoNivel: 0,
                ultimoNivel: null,
                interval: null,
                saldoAlvo: null,
                saldoMaior: null,

                reset: () => {
                    clearInterval(Modulo.Params.risco.interval);
                    if (Modulo.Params.risco.atual) Modulo.Objetos.$arriscar.val(Modulo.Params.risco.atual).blur();
                    Modulo.Params.risco.interval = null;
                    Modulo.Params.risco.atual = null;
                    Modulo.Params.risco.novoNivel = 0;
                    Modulo.Params.risco.ultimoNivel = null;
                    Modulo.Params.risco.saldoAlvo = null;
                },
            }
        };

    })();
}