window.Tips = window.Tips || {};
if (window.Tips.Modulos) {

    window.Tips.Modulos.MiddleBot = window.Tips.Modulos.MiddleBot || new (function() {

        const Instancia = window.Tips;
        const Modulo = this;

        Modulo.Inicializar = () => {
            Instancia.BotConstrutor.ImplementarLigaDesliga(Modulo, Modulo.Parametros.Processar);
            Instancia.Layout.AdicionarSecao(Modulo.Secao);
        };

        Modulo.Objetos = { };

        Modulo.Secao = { 
            versao: 'v1',

            titulo: 'BOT Middle',

            css: `
                {componenteQuantoArriscar}
                :host label {
                    font-weight: bold;
                }
                :host .label label {
                    color: #aaa;
                    font-weight: normal;
                }
                :host table.config td {
                    vertical-align: top;
                }
                :host table.config td h1 {
                    font-size: 100%;
                }
                :host table.config td.estatistica {
                    width: 20%;
                }
                :host table.config td.parametros {
                    width: 40%;                    
                    text-align: center;
                }
                :host table.config td.parametros table.prediction {
                    width: 65%;
                    margin: 0 auto;
                }
                :host table.config td.lista {
                    width: 40%;
                }
                :host .estatistica {
                    text-align: center;
                }         
                :host .estatistica .ct-series-a .ct-slice-pie { 
                    fill: #2EAB5B; 
                }
                :host .estatistica .ct-series-b .ct-slice-pie { 
                    fill: #AB2E40; 
                }
                :host .estatistica .ct-label { 
                    font-size: 1.3em;
                    fill: white;
                }
                :host .historico {
                    margin-top: 30px;
                }
                :host .historico input {
                    width: 60px;
                }
                :host .lista table th,
                :host .lista table td {
                    font-size: 80%;
                    width: 30%;
                    text-align: center;
                    white-space: normal;
                }
                :host .lista table input {
                    text-align: center;
                }
            `
            .replace('{componenteQuantoArriscar}', Instancia.BotConstrutor.ComponenteQuantoArriscar(Modulo, 'css')),

            html: `
                <p class="info">
                    Este BOT usa prediction para 50% de chance e a estratégia
                    <a href="https://pt.wikipedia.org/wiki/Martingale" target="_blank">Martingale</a>
                    para garantir ganhos sempre. Como a estatística tende a se manter no meio, em 50%,
                    quando ocorre algum um desequilíbrio aumenta as apostas.
                </p>
                {componenteQuantoArriscar}
                <div class="divisor"></div>
                <table class="config">
                    <tr>
                        <td class="estatistica">
                            <h1>Estatística</h1>
                            <div class="grafico"></div>
                        </td>
                        <td class="parametros">                            
                            <h1>Prediction</h1>
                            <table class="prediction">
                                <tr>
                                    <td class="left width50">
                                        <div class="radio">
                                            <input type="radio" name="prediction" value="49" />
                                            <label>49</label>
                                        </div>
                                    </td>
                                    <td class="left width50">
                                        <div class="radio">
                                            <input type="radio" name="prediction" value="50" />
                                            <label>50</label>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="left" colspan="2">
                                        <div class="radio">
                                            <input type="radio" name="prediction" value="" checked />
                                            <label>Alternado</label>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                            <div class="historico">
                                <h1>Histórico</h1>
                                <input type="text" number number-digitos="0" number-min="3" number-padrao="10" maxlength="3" />
                            </div>
                        </td>
                        <td class="lista">                            
                            <h1>Marcas</h1>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Estatística vencendo</th>
                                        <th>Limite de perda</th>
                                        <th>Apostas quantas vezes</th>
                                    </tr>
                                </thead>
                                <tr>
                                    <td><input type="text" class="estatistica" number number-digitos="0" number-min="0" number-max="10" number-padrao="10" maxlength="3" /></td>
                                    <td><input type="text" class="perda" number number-digitos="0" number-min="0" number-max="99" maxlength="2" value="3" /></td>
                                    <td><input type="text" class="vezes" number number-digitos="0" number-min="1" number-max="99" maxlength="2" value="1" /></td>
                                </tr>
                                <tr>
                                    <td><input type="text" class="estatistica" number number-digitos="0" number-min="11" number-max="20" number-padrao="20" maxlength="3" /></td>
                                    <td><input type="text" class="perda" number number-digitos="0" number-min="0" number-max="99" maxlength="2" value="4" /></td>
                                    <td><input type="text" class="vezes" number number-digitos="0" number-min="1" number-max="99" maxlength="2" value="1" /></td>
                                </tr>
                                <tr>
                                    <td><input type="text" class="estatistica" number number-digitos="0" number-min="21" number-max="30" number-padrao="30" maxlength="3" /></td>
                                    <td><input type="text" class="perda" number number-digitos="0" number-min="0" number-max="99" maxlength="2" value="6" /></td>
                                    <td><input type="text" class="vezes" number number-digitos="0" number-min="1" number-max="99" maxlength="2" value="2" /></td>
                                </tr>
                                <tr>
                                    <td><input type="text" class="estatistica" number number-digitos="0" number-min="31" number-max="40" number-padrao="40" maxlength="3" /></td>
                                    <td><input type="text" class="perda" number number-digitos="0" number-min="0" number-max="99" maxlength="2" value="9" /></td>
                                    <td><input type="text" class="vezes" number number-digitos="0" number-min="1" number-max="99" maxlength="2" value="" /></td>
                                </tr>
                                <tr>
                                    <td><input type="text" class="estatistica" number number-digitos="0" number-min="41" number-max="50" number-padrao="50" maxlength="3" /></td>
                                    <td><input type="text" class="perda" number number-digitos="0" number-min="0" number-max="99" maxlength="2" value="12" /></td>
                                    <td><input type="text" class="vezes" number number-digitos="0" number-min="1" number-max="99" maxlength="2" value="" /></td>
                                </tr>
                                <tr>
                                    <td><input type="text" class="estatistica" number number-digitos="0" number-min="51" number-max="100" number-padrao="100" maxlength="3" /></td>
                                    <td><input type="text" class="perda" number number-digitos="0" number-min="0" number-max="99" maxlength="2" value="18" /></td>
                                    <td><input type="text" class="vezes" number number-digitos="0" number-min="1" number-max="99" maxlength="2" value="" /></td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            `
            .replace('{componenteQuantoArriscar}', Instancia.BotConstrutor.ComponenteQuantoArriscar(Modulo, 'html')),

            js: (container, secaoId) => {
                const componenteQuantoArriscar = Instancia.BotConstrutor.ComponenteQuantoArriscar(Modulo, 'js');
                if (componenteQuantoArriscar instanceof Function) { componenteQuantoArriscar(container, secaoId); }

                Modulo.Objetos.estatistica = container.find('.estatistica .grafico').get(0);
                Modulo.Objetos.estatisticaChartData = { series: [ 0, 0 ] };
                Modulo.Objetos.estatisticaChart = new Chartist.Pie(
                    Modulo.Objetos.estatistica,
                    Modulo.Objetos.estatisticaChartData, 
                    {
                        width: '100%',
                        height: '85px',
                        fullWidth: true,
                        chartPadding: 0,
                        labelInterpolationFnc: function(value, serie) {
                            var total = Modulo.Objetos.estatisticaChartData.series[0] + Modulo.Objetos.estatisticaChartData.series[1];
                            var valor = parseInt((Modulo.Objetos.estatisticaChartData.series[serie] / total) * 100);
                            return valor + '%';
                        }
                    });

                Modulo.Objetos.icheckbug_prediction = {};
                Instancia.LuckygamesIo.BugICheckEvent('.' + secaoId + ' .prediction input[type="radio"]', Modulo.Objetos.icheckbug_prediction, function() { 
                    Modulo.Parametros.prediction = Tips.Modulos.MiddleBot.Objetos.icheckbug_prediction.o.reduce((a, o) => { a = o.checked ? o.value : a; return a; }, '');
                });
                $(Modulo.Objetos.icheckbug_prediction.o[0]).trigger('ifChanged');

                Modulo.Objetos.$historico = container.find('.historico input');
                Modulo.Objetos.$historico.blur(function() {
                    Modulo.Parametros.historico = this.number();
                });
                Modulo.Objetos.$historico.blur();

                Modulo.Objetos.$listaInputs = container.find('.lista input');
                Modulo.Objetos.$listaInputs.blur(function(e) {
                    if (e) {
                        if ($(this).hasClass('perda')) {
                            const perda = this.number();
                            if (perda) {
                                const perdaMaxima = Instancia.BotConstrutor.CalcularApostaPerdas(0.00000001, Modulo.Componentes.QuantoArriscar.arriscado, 50);
                                if (perda > perdaMaxima) {
                                    $(this).val(perdaMaxima.toFixed(8)).blur();
                                }
                            }
                        }
                    }

                    Modulo.Parametros.lista.length = 0;
                    for (let i = 0; i < Modulo.Objetos.$listaInputs.length; i += 3) {
                        Modulo.Parametros.lista.push([
                            Modulo.Objetos.$listaInputs[i].number(),
                            Modulo.Objetos.$listaInputs[i + 1].number(),
                            Modulo.Objetos.$listaInputs[i + 2].number()
                        ]);
                    }
                });
                Modulo.Objetos.$listaInputs.blur();
            },

            atualizarExibicao: () => {
                const componenteQuantoArriscar = Instancia.BotConstrutor.ComponenteQuantoArriscar(Modulo, 'atualizarExibicao');
                if (componenteQuantoArriscar instanceof Function) { componenteQuantoArriscar(); }

                Modulo.Objetos.estatisticaChartData.series = [
                    Tips.Modulos.MiddleBot.Parametros.apostasRealVencida,
                    Tips.Modulos.MiddleBot.Parametros.apostasRealPerdida,
                ];
                if (Modulo.Objetos.estatisticaChartData.series[0] === 0 &&
                    Modulo.Objetos.estatisticaChartData.series[1] === 0) {
                    Modulo.Objetos.estatisticaChartData.series = [1, 1];
                }
                Modulo.Objetos.estatisticaChart.update();
            },
        };

        Modulo.Parametros = {
            lista: [],
            multiplicador: Instancia.LuckygamesIo.ValoresMultiplicadores['_50'],
            prediction: null,
            predictionReal: 50,
            historico: null,
            apostas: [],
            apostasReal: [],
            apostasRealVencida: 0,
            apostasRealPerdida: 0,
            estatistica: null,

            ultimaAposta: null,
            proxima: {
                saldoInicial: 0,
                lucro: 0,
                zerado: 0,
                emAndamento: false,
                arriscado: null,
                meta: null,
                perdasAcumuladas: 0,
                aposta: null,
                estatistica: null,
                perda: null,
                vezes: null,                
            },
            
            estado: '',
            log: (estado) => {
                if (typeof(estado) === 'string') Modulo.Parametros.estado = estado;
                let log = {
                    "Estado": (' '.repeat(100) + Modulo.Parametros.estado).substr(-20),
                    "Histórico": Modulo.Parametros.apostasReal.length,
                    "Aposta": Modulo.Parametros.ultimaAposta,

                    "Meta de ganho": !Modulo.Parametros.proxima.emAndamento ? '-' : Modulo.Parametros.proxima.meta.toFixed(8),
                    "Saldo arriscado": !Modulo.Parametros.proxima.emAndamento ? '-' : Modulo.Parametros.proxima.arriscado.toFixed(8),
                    "Limite de perda": !Modulo.Parametros.proxima.emAndamento ? '-' : Modulo.Parametros.proxima.perda,

                    "Saldo inicial": Modulo.Parametros.proxima.saldoInicial.toFixed(8),
                    "Saldo atual": Modulo.Componentes.QuantoArriscar.saldo.toFixed(8),
                    "Lucro": Modulo.Parametros.proxima.lucro.toFixed(2) + "%",
                    "Zerou quantas vezes": Modulo.Parametros.proxima.zerado,
                };
                Modulo.Componentes.LigaDesliga.Log(log);
            },

            Processar: () => {
                return new Promise(resolve => {
                    const param = Modulo.Parametros;

                    if (param.prediction) param.predictionReal = param.prediction;
                    else param.predictionReal = param.predictionReal != 50 ? 50 : 49;
                    param.ultimaAposta = "0.00000001";

                    param.apostasReal = param.apostas.slice(0, param.historico);
                    param.apostasRealVencida = Tips.Modulos.MiddleBot.Parametros.apostasReal.reduce((c, i) => c + (i > 0 ? 1 : 0), 0);
                    param.apostasRealPerdida = Tips.Modulos.MiddleBot.Parametros.apostasReal.reduce((c, i) => c + (i < 0 ? 1 : 0), 0);
                    
                    param.estatistica = parseInt((param.apostasRealVencida / (param.apostasRealVencida + param.apostasRealPerdida)) * 100);
                    param.estatistica = !(param.estatistica > 0) ? 100 : param.estatistica;

                    if (param.apostas.length >= 1000) param.apostas.length = 999;
                    if (param.apostas.length < param.historico) {
                        param.log('Coletando estatísticas');
                    } else {
                        if (!param.proxima.emAndamento) {
                            param.proxima.perdasAcumuladas = 0;
                            param.proxima.arriscado = Modulo.Componentes.QuantoArriscar.arriscado;
                            param.proxima.meta = null;
                            param.proxima.aposta = null;
                            
                            for (let i = 0; i < param.lista.length; i++) {
                                if (param.lista[i][1] !== null && param.estatistica <= param.lista[i][0]) {

                                    if (param.proxima.estatistica === param.lista[i][0] && param.proxima.vezes <= 0) continue;                                    

                                    param.proxima.estatistica = param.lista[i][0];
                                    param.proxima.perda = param.lista[i][1];
                                    param.proxima.vezes = param.lista[i][2] ? param.lista[i][2] : Number.MAX_SAFE_INTEGER;
                                    param.proxima.emAndamento = true;
                                    break;
                                }                                
                            }

                            if (param.proxima.emAndamento) {
                                param.proxima.aposta = Instancia.BotConstrutor.CalcularApostaValor(param.proxima.perda, param.proxima.arriscado, param.predictionReal);
                                if (param.proxima.aposta) {
                                    param.proxima.meta = Modulo.Componentes.QuantoArriscar.saldo + param.proxima.aposta * param.multiplicador;
                                    param.ultimaAposta = param.proxima.aposta.toFixed(8);
                                } else {
                                    param.proxima.emAndamento = false;
                                }
                            }
                        } else {
                            param.ultimaAposta = param.proxima.aposta.toFixed(8);
                        }
                        param.log(param.proxima.emAndamento ? 'Enviando aposta' : 'Aguardando momento');
                    }

                    if (!param.proxima.saldoInicial) {
                        param.proxima.saldoInicial = Modulo.Componentes.QuantoArriscar.saldo;
                    }
                    
                    Instancia.LuckygamesIo.Apostar(param.ultimaAposta, param.predictionReal == 50 ? 'over' : 'under', param.predictionReal).then((response) => {
                        if (response.gameResult === 'win') {
                            param.apostas.unshift(1);
                        } else if (response.gameResult === 'lose') {
                            param.apostas.unshift(-1);
                        }

                        param.proxima.lucro = parseInt(((Modulo.Componentes.QuantoArriscar.saldo / param.proxima.saldoInicial) - 1) * 10000) / 100;

                        let finalizado = true;

                        if (param.proxima.emAndamento) {
                            if (response.gameResult === 'win') {
                                param.proxima.vezes--;
                                if (param.proxima.vezes <= 0) param.apostas.length = 0;
                                param.proxima.emAndamento = false;

                                if (Modulo.Componentes.QuantoArriscar.meta && Modulo.Componentes.QuantoArriscar.saldo >= Modulo.Componentes.QuantoArriscar.meta) {
                                    Modulo.Componentes.LigaDesliga.Status('desligar');
                                    param.log('Desligado');
                                    Instancia.Geral.Audio('limit-good');
                                    param.apostas.length = 0;
                                }
                            } else {
                                param.proxima.perdasAcumuladas += param.proxima.aposta;
                                param.proxima.aposta *= 2;

                                if (param.proxima.perdasAcumuladas + param.proxima.aposta > param.proxima.arriscado) {
                                    param.proxima.zerado++;
                                    param.proxima.emAndamento = false;
                                    //Modulo.Componentes.LigaDesliga.Status('desligar');
                                    //param.log('Desligado');
                                    Instancia.Geral.Audio('warning');
                                    param.apostas.length = 0;
                                } else {
                                    finalizado = false;
                                }
                            }
                        }
                        
                        resolve(finalizado);
                    }).catch(err => {
                        Modulo.Componentes.LigaDesliga.Status('pausar');
                    });
                });
            },
        };
        
   })();
}