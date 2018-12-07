window.Tips = window.Tips || {};
if (window.Tips.Modulos) {
    window.Tips.Modulos.Espera = window.Tips.Modulos.Espera || new (function() {

        const Instancia = window.Tips;
        const Modulo = this;

        Modulo.Inicializar = () => {
            Instancia.Layout.AdicionarSecao(Modulo.Secao);
            Instancia.InterceptadorAjax.Anexar('ModuloEspera', 'request', 10, Modulo.AntesDaAposta);
            Instancia.InterceptadorAjax.Anexar('ModuloEspera', 'response', 10, Modulo.DepoisDaAposta);
        };

        Modulo.Objetos = {};

        Modulo.DepoisDaAposta = (resultado, response, request) => {
            if (resultado !== 'load' || 
                !response || 
                !request) { return; }
            
            if (request.betAmount !== undefined) {
                Modulo.Estatisticas.apostaQuantidade++;            
                if (response.gameResult === 'lose') { 
                    Modulo.Estatisticas.apostaSequenciaVencida = 0;
                    Modulo.Estatisticas.apostaSequenciaPerdida++;
                } else if (response.gameResult === 'win') {
                    Modulo.Estatisticas.apostaSequenciaPerdida = 0;
                    Modulo.Estatisticas.apostaSequenciaVencida++;
                }
            }
        };

        Modulo.AntesDaAposta = (queryString) => {
            if (!queryString) { return; }
            if (queryString.game !== 'dice') { return; }
            if (queryString.betAmount === undefined) { return; }

            let espera = 0;

            if (Modulo.Params.apostaQuantidadeVezes !== null && Modulo.Params.apostaQuantidadeTempo !== null) {
                if (Modulo.Estatisticas.apostaQuantidade >= Modulo.Params.apostaQuantidadeVezes) {
                    Modulo.Estatisticas.apostaQuantidade = 0;
                    const tempo = Modulo.Params.apostaQuantidadeTempo * Modulo.Params.fVariador();
                    espera = espera > tempo ? espera : tempo;
                    console.logg('Espera:', 'apostaQuantidadeVezes', 'Tempo:', tempo);
                }
            }
            if (Modulo.Params.sequenciaPerdendoVezes !== null && Modulo.Params.sequenciaPerdendoTempo !== null) {
                if (Modulo.Estatisticas.apostaSequenciaPerdida >= Modulo.Params.sequenciaPerdendoVezes) {
                    Modulo.Estatisticas.apostaSequenciaPerdida = 0;
                    const tempo = Modulo.Params.sequenciaPerdendoTempo * Modulo.Params.fVariador();
                    espera = espera > tempo ? espera : tempo;
                    console.logg('Espera:', 'sequenciaPerdendoVezes', 'Tempo:', tempo);
                }
            }
            if (Modulo.Params.sequenciaVencendoVezes !== null && Modulo.Params.sequenciaVencendoTempo !== null) {
                if (Modulo.Estatisticas.apostaSequenciaVencida >= Modulo.Params.sequenciaVencendoVezes) {
                    Modulo.Estatisticas.apostaSequenciaVencida = 0;
                    const tempo = Modulo.Params.sequenciaVencendoTempo * Modulo.Params.fVariador();
                    espera = espera > tempo ? espera : tempo;
                    console.logg('Espera:', 'sequenciaVencendoVezes', 'Tempo:', tempo);
                }
            }
            console.logg('Espera real:', espera);
            Instancia.InterceptadorAjax.EsperaNaProximaAposta(espera);            
        };

        Modulo.Secao = {
            versao: 'v1',

            titulo: 'Espera',
    
            css: `
                :host .params td:nth-child(1) {
                    width: 50px;
                }
                :host .params td:nth-child(2) {
                    
                }
                :host .params td:nth-child(3) {
                    text-align: center;                    
                }
                :host td > label {
                    padding: 0 10px;
                }
                :host .checkbox {
                    margin: 2px 0 -2px 0;
                }
                :host .variador {
                    margin-top: -12px;
                }
                :host .variador td {
                    white-space: nowrap;
                }                
                :host .variador td:nth-child(2) input {
                    width: 50px;
                }
                :host .variador td:nth-child(4) {
                    width: 100%;
                    text-align: right;
                }
            `,
            
            html: `
                <p class="info">
                    Reduz a velocidade no envio de apostas por incluir
                    um tempo de espera entre elas conforme critérios abaixo.
                </p>
                <table class="params">
                    <tr>
                        <td valign="bottom">&nbsp;</td>
                        <td valign="bottom"><label>Depois de...</label></td>
                        <td valign="bottom"><label>Esperar quantos milissegundos</label></td>
                    </tr>
                    <tr><td colspan="3"><div class="divisor"></div></td></tr>
                    <tr class="apostaQuantidade">
                        <td><input type="text" number number-digitos="0" number-min="1" number-max="99" maxlength="2" /></td>
                        <td><label title="Depois de tantas&lt;br&gt;apostas vencidas ou perdidas.">apostas</label></td>
                        <td><input type="text" number number-digitos="0" number-min="1" number-padrao="1000" value="1000" /></td>
                    </tr>
                    <tr class="sequenciaPerdendo">
                        <td><input type="text" number number-digitos="0" number-min="1" number-max="99" maxlength="2" /></td>
                        <td><label title="Depois de uma sequência de&lt;br&gt;apostas perdidas.">sequências perdendo</label></td>
                        <td><input type="text" number number-digitos="0" number-min="1" number-padrao="1000" value="1000" /></td>
                    </tr>
                    <tr class="sequenciaVencendo">
                        <td><input type="text" number number-digitos="0" number-min="1" number-max="99" maxlength="2" /></td>
                        <td><label title="Depois de uma sequência de&lt;br&gt;apostas vencidas.">sequências vencendo</label></td>
                        <td><input type="text" number number-digitos="0" number-min="1" number-padrao="1000" value="1000" /></td>
                    </tr>
                    <tr><td colspan="3"><div class="divisor"></div></td></tr>
                </table>
                <table class="variador">
                    <tr class="variador">
                        <td>
                            <div class="checkbox">
                                <input type="checkbox" />
                                <label title="Aplica uma variação ao tempo&lt;br&gt;de espera para aparentar casualidade.&lt;br&gt;O tempo pode variar pra mais ou pra menos&lt;br&gt;dentro do percentual informado.">Variar o tempo <span class="hide">em até</span></label>
                            </div>
                        </td>
                        <td><input class="hide" type="text" number number-digitos="0" number-min="1" number-max="100" maxlength="3" value="20" /></td>
                        <td><label class="hide" title="Aplica uma variação ao tempo&lt;br&gt;de espera para aparentar casualidade.&lt;br&gt;O tempo pode variar pra mais ou pra menos.">porcento.</label></td>
                        <td><div class="controles"><button class="btn grey" title="Remove os tempos definidos acima.">Limpar</button></div></td>
                    </tr>
                </table>
            `,

            js: (container, secaoId) => {
                Modulo.Objetos.$variador = container.find('.variador input[type="text"]');
                Modulo.Objetos.$variadorControles = container.find('.variador .hide');
                
                Modulo.Objetos.icheckbug_variador = {};
                Instancia.LuckygamesIo.BugICheckEvent('.' + secaoId + ' .variador input[type="checkbox"]', Modulo.Objetos.icheckbug_variador, function() {
                    const checked = this.checked;
                    if (checked) { Modulo.Objetos.$variadorControles.show(); }
                    else { Modulo.Objetos.$variadorControles.hide(); }
                    Modulo.Objetos.$variador.blur();
                }).trigger('ifChanged');
                
                container.find('button').click(() => {
                    container.find('.params input[number]').val('').blur();
                });

                const fConfigurarParams = (selector) => {
                    const inputs = container.find(selector + ' input');
                    const inputVezes = $(inputs.get(0));
                    const inputTempo = $(inputs.get(1));

                    inputVezes.blur(function() {
                        if (Number.isFinite(this.number())) {
                            inputTempo.show();
                        } else {
                            inputTempo.hide();
                        }
                    });
                    inputVezes.blur();

                    return inputs;
                }
                let inputs;
                
                inputs = fConfigurarParams('.apostaQuantidade');
                Modulo.Objetos.$apostaQuantidadeVezes = $(inputs.get(0));
                Modulo.Objetos.$apostaQuantidadeTempo = $(inputs.get(1));

                inputs = fConfigurarParams('.sequenciaPerdendo');
                Modulo.Objetos.$sequenciaPerdendoVezes = $(inputs.get(0));
                Modulo.Objetos.$sequenciaPerdendoTempo = $(inputs.get(1));

                inputs = fConfigurarParams('.sequenciaVencendo');
                Modulo.Objetos.$sequenciaVencendoVezes = $(inputs.get(0));
                Modulo.Objetos.$sequenciaVencendoTempo = $(inputs.get(1));

                Modulo.Objetos.$apostaQuantidadeVezes.blur(function() { Modulo.Params.apostaQuantidadeVezes = this.number(); Modulo.Objetos.$apostaQuantidadeTempo.blur(); });
                Modulo.Objetos.$apostaQuantidadeTempo.blur(function() { Modulo.Params.apostaQuantidadeTempo = this.number(); });
                Modulo.Objetos.$sequenciaPerdendoVezes.blur(function() { Modulo.Params.sequenciaPerdendoVezes = this.number(); Modulo.Objetos.$sequenciaPerdendoTempo.blur(); });
                Modulo.Objetos.$sequenciaPerdendoTempo.blur(function() { Modulo.Params.sequenciaPerdendoTempo = this.number(); });
                Modulo.Objetos.$sequenciaVencendoVezes.blur(function() { Modulo.Params.sequenciaVencendoVezes = this.number(); Modulo.Objetos.$sequenciaVencendoTempo.blur(); });
                Modulo.Objetos.$sequenciaVencendoTempo.blur(function() { Modulo.Params.sequenciaVencendoTempo = this.number(); });
                Modulo.Objetos.$variador.blur(function() { Modulo.Params.variador = Modulo.Objetos.icheckbug_variador.o.checked ? this.number() : null; });
            }
        };

        Modulo.Params = {
            apostaQuantidadeVezes: null,
            apostaQuantidadeTempo: null,
            sequenciaPerdendoVezes: null,
            sequenciaPerdendoTempo: null,
            sequenciaVencendoVezes: null,
            sequenciaVencendoTempo: null,
            variador: null,
            fVariador: () => {
                if (!Number.isFinite(Modulo.Params.variador)) { return 1; }
                else { 
                    const sinal = parseInt(Instancia.Geral.Randomico() * 100) % 2 === 0 ? -1 : 1;
                    const percentual = Math.floor((Instancia.Geral.Randomico() * Modulo.Params.variador) + 1);
                    return 1 + (sinal * percentual / 100); 
                }
            }
        };

        Modulo.Estatisticas = {
            apostaQuantidade: 0,
            apostaSequenciaPerdida: 0,
            apostaSequenciaVencida: 0,
        };

    })();
}