window.Glasgow = window.Glasgow || {};
if (window.Glasgow.Modulos) {
    window.Glasgow.Modulos.Martin = window.Glasgow.Modulos.Martin || new (function() {

        const Instancia = window.Glasgow;
        const Modulo = this;

        Modulo.Inicializar = () => {
            Instancia.Layout.AdicionarSecao(Modulo.Secao);
        };

        Modulo.Objetos = { };

        Modulo.Secao = {
            versao: 'v1',

            titulo: 'Martin',

            css: `
                :host .parametros td {
                    text-align: center;
                }
                :host table label.titulo {
                    font-size: 12px;
                    display: inline-block;
                    width: 90%;
                    padding: 3px 0 5px 0;
                    background-color: slategray;
                    color: white;
                    border-radius: 5px;
                }
                :host .parametros label {
                    font-size: 10px;
                }
                :host .parametros td {
                    vertical-align: top;
                    width: 20%;
                    position: relative;
                }
                :host .parametros input[type="text"] {
                    width: 90%;
                    font-size: 10px;
                    line-height: 15px;
                    padding-top: 3px;
                }
                :host .parametros td:nth-child(n+2) input {
                    background-color: #fafafa;
                }
                :host .parametros button {
                    margin-top: 10px;
                }
                :host .parametros .pressionando button {
                    background-color: red;
                }
                :host .grafico td {
                    padding-top: 7px;
                }
                :host table table td {
                    width: 50%;
                    text-align: center;
                    padding: 0 10px;
                }
                :host table table td label {
                    display: inline-block;
                    margin-bottom: 5px;
                }
                :host .controles {
                    text-align: center;
                    padding-top: 10px;
                }
                :host .controles .radio {
                    position: relative;
                }
                :host .disabled {
                    position: absolute;
                    top: 0;
                    left: 0;
                    bottom: 0;
                    right: 0;
                    z-index: 1;
                    opacity: 0;
                }
                :host .disabled.white {
                    bottom: 35px;
                    background-color: white;
                    opacity: 0.8;
                }
                :host .grafico .ct-series-a .ct-line {
                    stroke: blue;
                    stroke-width: 2px;
                }
                :host .grafico .perda .ct-series-a .ct-line {
                    stroke: red;
                }
            `,
    
            html: `
                <p class="info">
                    Este BOT usa a estratégia
                    <a href="https://pt.wikipedia.org/wiki/Martingale" target="_blank">Martingale</a>
                    para garantir ganhos sempre. Mas se o seu saldo zerar você perde tudo.
                    Começe com o modo de risco mínimo e analise o gráfico para entender o funcionamento.
                    Mas se o seu saldo for muito baixo pode acontecer de não ser possível o
                    risco mínimo.
                </p>
                <table>
                    <tr class="parametros">
                        <td class="risco customizado">
                            <label class="titulo">Customizado</label>
                            <label>Limite</label>
                            <input type="text" class="limite" number number-digitos="0" number-min="1" number-padrao="20" />
                            <label>Aposta</label>
                            <input type="text" class="aposta" number number-min="0,00000001" number-padrao="0,00000001" />
                            <button class="btn">Apostar</button>
                        </td>
                        <td class="risco minimo">
                            <label class="titulo" title="O risco do seu saldo zerar aqui é praticamente zero. Mas seu lucro é muito baixo também." style="background-color: #FAAD12">Risco mínimo</label>
                            <label>Limite</label>
                            <input type="text" class="limite" readonly />
                            <label>Aposta</label>
                            <input type="text" class="aposta" readonly />
                            <button class="btn">Apostar</button>
                        </td>
                        <td class="risco baixo">
                            <label class="titulo" title="Você tem mais lucro, mas seu risco já é real, porém pequeno." style="background-color: #FA5F2E">Risco baixo</label>
                            <label>Limite</label>
                            <input type="text" class="limite" readonly />
                            <label>Aposta</label>
                            <input type="text" class="aposta" readonly />
                            <button class="btn">Apostar</button>
                        </td>
                        <td class="risco alto">
                            <label class="titulo" title="Você tem lucro rápido, mas com um alto risco." style="background-color: #E31C36">Risco alto</label>
                            <label>Limite</label>
                            <input type="text" class="limite" readonly />
                            <label>Aposta</label>
                            <input type="text" class="aposta" readonly />
                            <button class="btn">Apostar</button>
                        </td>
                        <td class="risco mortal">
                            <label class="titulo" title="Seu lucro é absurdo aqui, mas muito certamente vai zerar seu saldo." style="background-color: #F5050A">Risco mortal</label>
                            <label>Limite</label>
                            <input type="text" class="limite" readonly />
                            <label>Aposta</label>
                            <input type="text" class="aposta" readonly />
                            <button class="btn">Apostar</button>
                        </td>
                    </tr>
                    <tr class="grafico">
                        <td colspan="5">
                            <div></div>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="5">
                            <table>
                                <tr>
                                    <td class="esperaApos">
                                        <label title="Após perder essas vezes aposta o valor mínimo até voltar a ganhar. Deixe em branco para apostar sempre.">Aceitar quantas perdas</label>
                                        <input type="text" number number-digitos="0" number-min="1" number-min="99" value="2" maxlength="2" />
                                    </td>
                                    <td class="esperaNivel">
                                        <label title="Após cada perda espera antes de apostar novamente. Enquanto espera fica apostando o mínimo.">Esperar após perder</label>
                                        <select>
                                            <option value="0">Sem espera</option>
                                            <option value="1">Espera breve</option>
                                            <option value="2">Espera demorada</option>
                                            <option value="3">Espera muito demorada</option>
                                        </select>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="5" class="controles">
                            <div class="radio clique liberado" title="O BOT é interrompido assim que o botão é liberado.">
                                <input type="radio" name="fixar" value="liberado" checked />
                                <label>Clique liberado</label>
                            </div>
                            <div class="radio clique fixo" title="Tem que apertar o botão de aposta outra vez para interromper o BOT.">
                                <input type="radio" name="fixar" value="fixo" />
                                <label>Clique fixo</label>
                            </div>
                            <div class="checkbox exibirGrafico" title="Gráfico próprio para acompanhamento rápido.">
                                <input type="checkbox" checked />
                                <label>Exibir gráfico</label>
                            </div>
                        </td>
                    </tr>
                </table>
            `,

            js: (container, secaoId) => {
                const fBloquear = (selector, cssClass, modo) => {
                    if (modo) { container.find(selector).append('<div class="' + cssClass + '"></div>'); }
                    else { container.find(selector + ' .disabled').remove(); }
                }
                const fBloquearRadio = (modo) => { fBloquear('.controles .radio', 'disabled', modo); }
                const fBloquearApostas = (modo) => { fBloquear('.parametros td', 'disabled', modo); }
                const fEsmaecerApostas = (modo) => { fBloquear('.risco:not(.pressionando)', 'disabled white', modo); }

                Modulo.Objetos.apostarCustomizado = container.find('.risco.customizado button');
                Modulo.Objetos.apostarMinimo = container.find('.risco.minimo button');
                Modulo.Objetos.apostarBaixo = container.find('.risco.baixo button');
                Modulo.Objetos.apostarAlto = container.find('.risco.alto button');
                Modulo.Objetos.apostarMortal = container.find('.risco.mortal button');
                const fApostarClick = function() {
                    if (!Modulo.Objetos.icheckbug_clique.o[1].checked) { return; }

                    const $risco = $(this).closest('.risco');
                    if (!$risco.hasClass('pressionando')) {
                        $risco.addClass('pressionando');
                        container.find('.risco:not(.pressionando) button').hide();
                        fBloquearRadio(true);
                        fEsmaecerApostas(true);
                        
                        Modulo.PreencherGrafico(true);
                    }
                    else {
                        $risco.removeClass('pressionando');
                        fBloquearRadio(false);
                        
                        fBloquearApostas(true);
                        setTimeout(() => { 
                            container.find('.risco button').show(); 
                            Modulo.PreencherGrafico(false); 
                            fBloquearApostas(false); 
                            fEsmaecerApostas(false);
                        }, parseInt(Math.random() * 10) * 500);
                    }
                }
                Modulo.Objetos.apostarCustomizado.click(fApostarClick);
                Modulo.Objetos.apostarMinimo.click(fApostarClick);
                Modulo.Objetos.apostarBaixo.click(fApostarClick);
                Modulo.Objetos.apostarAlto.click(fApostarClick);
                Modulo.Objetos.apostarMortal.click(fApostarClick);
                const fApostarMouseDown = function() {
                    if (!Modulo.Objetos.icheckbug_clique.o[0].checked) { return; }
                    
                    $(this).closest('.risco').addClass('pressionando');
                    container.find('.risco:not(.pressionando) button').hide();
                    fBloquearRadio(true);
                    fEsmaecerApostas(true);
                    
                    Modulo.PreencherGrafico(true);
                }
                Modulo.Objetos.apostarCustomizado.on('mousedown', fApostarMouseDown);
                Modulo.Objetos.apostarMinimo.on('mousedown', fApostarMouseDown);
                Modulo.Objetos.apostarBaixo.on('mousedown', fApostarMouseDown);
                Modulo.Objetos.apostarAlto.on('mousedown', fApostarMouseDown);
                Modulo.Objetos.apostarMortal.on('mousedown', fApostarMouseDown);
                const fApostarMouseUp = function() {
                    if (!Modulo.Objetos.icheckbug_clique.o[0].checked) { return; }

                    $(this).closest('.risco').removeClass('pressionando');                    
                    fBloquearRadio(false);
                    fBloquearApostas(true);
                    setTimeout(() => { 
                        container.find('.risco button').show();
                        Modulo.PreencherGrafico(false); 
                        fBloquearApostas(false); 
                        fEsmaecerApostas(false);
                    }, parseInt(Math.random() * 10) * 500);
                }
                Modulo.Objetos.apostarCustomizado.on('mouseup', fApostarMouseUp);
                Modulo.Objetos.apostarMinimo.on('mouseup', fApostarMouseUp);
                Modulo.Objetos.apostarBaixo.on('mouseup', fApostarMouseUp);
                Modulo.Objetos.apostarAlto.on('mouseup', fApostarMouseUp);
                Modulo.Objetos.apostarMortal.on('mouseup', fApostarMouseUp);

                Modulo.Objetos.riscoCustomizadoLimite = container.find('.risco.customizado input.limite').get(0);
                Modulo.Objetos.riscoCustomizadoAposta = container.find('.risco.customizado input.aposta').get(0);

                Modulo.Objetos.icheckbug_clique = {};
                Instancia.LuckygamesIo.BugICheckEvent('.' + secaoId + ' .clique input[type="radio"]', Modulo.Objetos.icheckbug_clique, function() {
                    const add = this.value === 'fixo' ? 'red' : 'green';
                    const remove = add !== 'red' ? 'red' : 'green';
                    container.find('.parametros button').addClass(add).removeClass(remove);
                });
                $(Modulo.Objetos.icheckbug_clique.o[0]).trigger('ifChanged');

                Modulo.Objetos.grafico = container.find('.grafico div').get(0);
                Modulo.Objetos.graficoChartData = { series: [ [ ] ] };
                Modulo.Objetos.graficoChart = new Chartist.Line(
                    Modulo.Objetos.grafico,
                    Modulo.Objetos.graficoChartData, 
                    {
                        width: '100%',
                        height: '100px',
                        fullWidth: true,
                        chartPadding: 0,
                        showLine: true,
                        showPoint: false,
                        showArea: false,
                        showLabel: false,
                        axisX: { showGrid: false, showLabel: false, offset: 0 },
                        axisY: { showGrid: true, showLabel: true, offset: 40 },
                        lineSmooth: Chartist.Interpolation.step() /* .simple()*/,
                    });

                Modulo.Objetos.$grafico = container.find('.grafico');
                Modulo.Objetos.icheckbug_exibirGrafico = {};
                Instancia.LuckygamesIo.BugICheckEvent('.' + secaoId + ' .exibirGrafico input[type="checkbox"]', Modulo.Objetos.icheckbug_exibirGrafico, function() {
                    if (this.checked) { 
                        setTimeout(() => Modulo.Objetos.graficoChart.update(), 1);
                        setTimeout(() => Modulo.Objetos.graficoChart.update(), 100);
                        Modulo.Objetos.$grafico.show(); 
                    }
                    else{ Modulo.Objetos.$grafico.hide(); }
                }).trigger('ifChanged');
            },

            atualizarExibicao: () => {
                if (Modulo.Objetos.icheckbug_exibirGrafico.o.checked) {
                    Modulo.Objetos.graficoChart.update();
                }
            }
        };

        Modulo.PreencherGrafico = (modo) => {
            if (modo === true) {
                if (!Modulo.PreencherGraficoInterval)
                    Modulo.PreencherGraficoInterval = setInterval(() => { Modulo.PreencherGrafico(); }, 100);
            }
            else if (modo === false) {
                clearInterval(Modulo.PreencherGraficoInterval);
                delete Modulo.PreencherGraficoInterval;
            }
            else {
                if (Modulo.PreencherGraficoVal === undefined) Modulo.PreencherGraficoVal = 0;
                Modulo.PreencherGraficoVal += parseInt(Math.random() * 10) * (parseInt(Math.random() * 10) % 2 === 0 ? -1 : +1);
                Modulo.Objetos.graficoChartData.series[0].push(Modulo.PreencherGraficoVal);
                while (Modulo.Objetos.graficoChartData.series[0].length > 50) {
                    Modulo.Objetos.graficoChartData.series[0].shift();
                }
                const perda = Modulo.PreencherGraficoVal < 0;
                if (perda) { $(Modulo.Objetos.grafico).addClass('perda'); }
                else { $(Modulo.Objetos.grafico).removeClass('perda'); }
                if (Modulo.Objetos.icheckbug_exibirGrafico.o.checked) {
                    Modulo.Objetos.graficoChart.update();
                }
            }
        }
    })();
}