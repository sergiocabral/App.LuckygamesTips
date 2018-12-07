window.Tips = window.Tips || {};
if (window.Tips.Modulos) {
    window.Tips.Modulos.Limites = window.Tips.Modulos.Limites || new (function() {

        const Instancia = window.Tips;
        const Modulo = this;

        Modulo.Inicializar = () => {
            Instancia.Layout.AdicionarSecao(Modulo.Secao);
            Instancia.InterceptadorAjax.Anexar('ModuloLimite', 'request', 10, Modulo.AntesDaAposta);
            Instancia.InterceptadorAjax.Anexar('ModuloLimite', 'response', 10, Modulo.DepoisDaAposta);
        };

        Modulo.Objetos = {};

        Modulo.DepoisDaAposta = (resultado, response, request) => {
            if (!response) { return; }

            const saldo = parseFloat(response.balance);

            if (!Number.isFinite(saldo)) { return; }
            if (!Number.isFinite(Modulo.Limites.saldoMinimo)) { return; }
            if (!Number.isFinite(Modulo.Limites.saldoMinimoAutomatico)) { return; }

            const limite = saldo * Modulo.Limites.saldoMinimoAutomatico;

            if (Modulo.Limites.saldoMinimo < limite) {
                Modulo.Objetos.$saldoMinimo.val(limite.toFixed(8)).blur();
            }
        };

        Modulo.AntesDaAposta = (queryString) => {
            if (!queryString) { return; }
            if (queryString.game !== 'dice') { return; }
            if (queryString.betAmount === undefined) { return; }

            const apostasQuantidade = Instancia.Estatisticas.Dados.apostaQuantidade;
            const sequenciaPerdendo = Instancia.Estatisticas.Dados.sequenciaPerdendo;
            const sequenciaVencendo = Instancia.Estatisticas.Dados.sequenciaVencendo;
            const aposta = parseFloat(queryString.betAmount);
            const saldoAtual = Instancia.LuckygamesIo.Parametros.Balance();
            const saldoSePerder = saldoAtual - aposta;

            let limiteAtingido = '';
            let limiteBom = true;

            if (Modulo.Limites.saldoMinimo !== null) {
                if (saldoSePerder < Modulo.Limites.saldoMinimo) {
                    Modulo.Objetos.$saldoMinimo.addClass('bg-alerta');
                    limiteAtingido += '<br />* Saldo mínimo';
                    limiteBom = false;
                }
            }
            if (Modulo.Limites.saldoMaximo !== null) {
                if (saldoAtual >= Modulo.Limites.saldoMaximo) {
                    Modulo.Objetos.$saldoMaximo.addClass('bg-alerta');
                    limiteAtingido += '<br />* Saldo máximo';
                }
            }
            if (Modulo.Limites.apostaQuantidade !== null) {
                if (apostasQuantidade >= Modulo.Limites.apostaQuantidade) {
                    Modulo.Objetos.$apostaQuantidade.addClass('bg-alerta');
                    limiteAtingido += '<br />* Quantidade de apostas';
                }
            }
            if (Modulo.Limites.apostaMinima !== null) {
                if (aposta < Modulo.Limites.apostaMinima) {
                    Modulo.Objetos.$apostaMinima.addClass('bg-alerta');
                    limiteAtingido += '<br />* Aposta mínima';
                }
            }
            if (Modulo.Limites.apostaMaxima !== null) {
                if (aposta > Modulo.Limites.apostaMaxima) {
                    Modulo.Objetos.$apostaMaxima.addClass('bg-alerta');
                    limiteAtingido += '<br />* Aposta máxima';
                }
            }
            if (Modulo.Limites.sequenciaPerdendo !== null) {
                if (sequenciaPerdendo >= Modulo.Limites.sequenciaPerdendo) {
                    Modulo.Objetos.$sequenciaPerdendo.addClass('bg-alerta');
                    limiteAtingido += '<br />* Sequência perdendo';
                    limiteBom = false;
                }
            }
            if (Modulo.Limites.sequenciaVencendo !== null) {
                if (sequenciaVencendo >= Modulo.Limites.sequenciaVencendo) {
                    Modulo.Objetos.$sequenciaVencendo.addClass('bg-alerta');
                    limiteAtingido += '<br />* Sequência vencendo';
                }
            }

            if (limiteAtingido) {
                for (let i = 0; i < Instancia.Params.QuandoLimiteAtingido.length; i++) {
                    if (Instancia.Params.QuandoLimiteAtingido[i] instanceof Function) {
                        Instancia.Params.QuandoLimiteAtingido[i]();
                    }
                }
                Instancia.LuckygamesIo.PararApostas();
                setTimeout(Instancia.Layout.AtualizarExibicao.Executar, 1000);

                if (Modulo.Objetos.$email.is(':visible') && Modulo.Objetos.$email.val()) {
                    const assunto = Instancia.Geral.FormatarString(
                        'Luckygames.tips - Limite atingido', 
                        Instancia.LuckygamesIo.Parametros.Usuario(), 
                        Instancia.LuckygamesIo.Parametros.Moeda());
                    const mensagem = Instancia.Geral.FormatarString(
                        'Usuário: <strong>{0}</strong><br />Moeda: <strong>{1}</strong><br/>Saldo atual: <strong>{2}</strong><br/><br/>Um ou mais limites foram atingidos e as apostas foram interrompidas:<strong>{3}</strong>', 
                        Instancia.LuckygamesIo.Parametros.Usuario(), 
                        Instancia.LuckygamesIo.Parametros.Moeda(), 
                        Instancia.Estatisticas.Dados.Formatado.SaldoAtual(),
                        limiteAtingido);
                    Instancia.Api.Email(Modulo.Objetos.$email.val().trim(), assunto, mensagem).then((data) => { 
                        if (!data || !data.sucesso || !data.response || data.response.erro) {
                            const erro = data && data.response && data.response.mensagem ? ': ' + data.response.mensagem : '.';
                            Instancia.Geral.Toast('Ocorreu um erro ao enviar o e-mail de notificação' + erro, 'info');
                        }
                        else {
                            Instancia.Geral.Toast('Um e-mail foi enviado para notificar que os limites foram atingidos.', 'info');
                        }
                    });
                }
                Instancia.Geral.Toast('Um ou mais limites foram atingidos e as apostas foram interrompidas.' + limiteAtingido, 'error');
                Instancia.Geral.Audio(limiteBom ? 'limit-good' : 'limit-bad');
                return false;
            }
        };

        Modulo.Secao = {
            versao: 'v2',

            titulo: 'Limites',
    
            css: `
                :host td[rowspan] {
                    border-right: 2px solid gainsboro;
                }
                :host td > label {
                    padding: 0 10px;
                }
                :host .email .checkbox {
                    margin: 2px 0 -2px 0;
                }
                :host .email input[type="text"] {
                    text-align: left;
                }
                :host .saldoMinimo input[type="text"] {
                    width: 215px;
                }
                :host .saldoMinimo .checkbox {
                    position: relative;
                    top: -1px;
                    left: 8px;
                }
                :host .saldoMinimo .checkbox label {
                    font-size: 23px !important;
                    position: absolute;
                    left: 22px;
                    top: -7px;
                }
            `,
            
            html: `
                <p class="info">
                    Quando um ou mais limites são atingidos o site
                    fica restrito para qualquer comunicação com a
                    internet, garantindo que nenhuma aposta seja enviada.
                </p>
                <table>
                    <tr class="saldoMinimo">
                        <td rowspan="2"><label title="Saldo é quanto você tem&lt;br/&gt;disponível para apostar">Saldo</label></td>
                        <td><label title="Garante que o seu saldo nunca&lt;br/&gt;fique abaixo desse valor.">Mínimo</label></td>
                        <td>
                            <input type="text" number number-min="0.00000001" /> 
                            <div class="checkbox">
                                <input type="checkbox" />
                                <label title="Marque o checkbox para fazer este&lt;br/&gt;limite subir à medida que o saldo aumenta.">&#8679;</label>
                            </div>
                        </td>
                    </tr>
                    <tr class="saldoMaximo">
                        <td><label title="Interrompe as apostas caso o seu saldo&lt;br/&gt;seja igual ou maior que esse valor.">Máximo</label></td>
                        <td><input type="text" number number-min="0.00000001" /></td>
                    </tr>
                    <tr><td colspan="3"><div class="divisor"></div></td></tr>
                    <tr class="apostaQuantidade">
                        <td rowspan="3"><label title="Aposta, ou bet, é o valor apostado&lt;br/&gt;que resulta em perder ou vencer.">Aposta</label></td>
                        <td><label title="Interrompe quando a quantidade de apostas&lt;br/&gt;enviadas ultrapassa esse valor.">Quantidade</label></td>
                        <td><input type="text" number number-digitos="0" number-min="1" /></td>
                    </tr>
                    <tr class="apostaMinima">
                        <td><label title="Interrompe quando o valor apostado&lt;br/&gt;for menor que esse valor.">Mínima</label></td>
                        <td><input type="text" number number-min="0.00000001" /></td>
                    </tr>
                    <tr class="apostaMaxima">
                        <td><label title="Interrompe quando o valor apostado&lt;br/&gt;for maior que esse valor.">Máxima</label></td>
                        <td><input type="text" number number-min="0.00000001" /></td>
                    </tr>
                    <tr><td colspan="3"><div class="divisor"></div></td></tr>
                    <tr class="sequenciaPerdendo">
                        <td rowspan="2"><label title="Sequência são as vezes consecutivas&lt;br/&gt;que se perde ou vence as apostas.">Sequência</label></td>
                        <td><label title="Interrompe quando as apostas são perdidas&lt;br/&gt;consecutivamente nessa quantidade de vezes.">Perdendo</label></td>
                        <td><input type="text" number number-digitos="0" number-min="1" /></td>
                    </tr>
                    <tr class="sequenciaVencendo">
                        <td><label title="Interrompe quando as apostas são vencidas&lt;br/&gt;consecutivamente nessa quantidade de vezes.">Vencendo</label></td>
                        <td><input type="text" number number-digitos="0" number-min="1" /></td>
                    </tr>
                    <tr><td colspan="3"><div class="divisor"></div></td></tr>
                    <tr class="email">
                        <td colspan="2">
                            <div class="checkbox">
                                <input type="checkbox" />
                                <label title="Se algum limite for atingido&lt;br/&gt;um e-mail de alerta é enviado.">E-mail para notificação</label>
                            </div>
                        </td>
                        <td><input type="text" title="Informe um ou vários e-mails&lt;br/&gt;separados por vírgula." /></td>
                    </tr>
                </table>
                <div class="controles"><button class="btn grey" title="Remove os limites definidos acima.">Limpar</button></div>
            `,

            js: (container, secaoId) => {
                Modulo.Objetos.$email = container.find('.email input[type="text"]');
                Modulo.Objetos.$email.val(Instancia.Api.Licenca().email != Instancia.Definicoes.Contato ? Instancia.Api.Licenca().email : '');
                
                Modulo.Objetos.$saldoMinimo = container.find('.saldoMinimo input[type="text"]');
                Modulo.Objetos.saldoMinimo = Modulo.Objetos.$saldoMinimo.get(0);
                Modulo.Objetos.$saldoMaximo = container.find('.saldoMaximo input[type="text"]');
                Modulo.Objetos.$apostaQuantidade = container.find('.apostaQuantidade input[type="text"]');
                Modulo.Objetos.$apostaMinima = container.find('.apostaMinima input[type="text"]');
                Modulo.Objetos.$apostaMaxima = container.find('.apostaMaxima input[type="text"]');
                Modulo.Objetos.$sequenciaPerdendo = container.find('.sequenciaPerdendo input[type="text"]');
                Modulo.Objetos.$sequenciaVencendo = container.find('.sequenciaVencendo input[type="text"]');

                const configuraSaldoMinimoAutomatico = () => {
                    const limite = Modulo.Objetos.saldoMinimo.number();
                    const ativo = Modulo.Objetos.icheckbug_saldoMinimoAutomatico.o.checked;

                    if (ativo && Number.isFinite(limite)) {
                        const saldoAtual = Instancia.Estatisticas.Dados.Calculo.saldoAtual();

                        Modulo.Limites.saldoMinimoAutomatico = limite / saldoAtual;
                    } else {
                        Modulo.Limites.saldoMinimoAutomatico = null;
                    }
                };

                Modulo.Objetos.icheckbug_saldoMinimoAutomatico = {};
                Instancia.LuckygamesIo.BugICheckEvent('.' + secaoId + ' .saldoMinimo input[type="checkbox"]', Modulo.Objetos.icheckbug_saldoMinimoAutomatico, function() {
                    configuraSaldoMinimoAutomatico();
                }).trigger('ifChanged');
                
                Modulo.Objetos.icheckbug_email = {};
                Instancia.LuckygamesIo.BugICheckEvent('.' + secaoId + ' .email input[type="checkbox"]', Modulo.Objetos.icheckbug_email, function() {
                    const checked = this.checked;
                    if (checked) { Modulo.Objetos.$email.show(); }
                    else { Modulo.Objetos.$email.hide(); }
                }).trigger('ifChanged');
                
                container.find('button').click(() => {
                    container.find('input[number]').val('').blur();
                });

                container.find('input').blur(function() {
                    if (this.value) { $(this).addClass('bg-ativo').removeClass('bg-alerta'); }
                    else { $(this).removeClass('bg-ativo').removeClass('bg-alerta'); }
                });

                const fSaldoAtual = () => {
                    return Instancia.Estatisticas.Dados.Calculo.saldoAtual();
                };
                Modulo.Objetos.$saldoMinimo.get(0).valor_inicial = fSaldoAtual;
                Modulo.Objetos.$saldoMaximo.get(0).valor_inicial = fSaldoAtual;

                const fApostaAtual = () => {
                    const result = parseFloat(Instancia.LuckygamesIo.Objetos.betAmount.value);
                    return result === null ? 1 : result;
                };
                Modulo.Objetos.$apostaMinima.get(0).valor_inicial = fApostaAtual;
                Modulo.Objetos.$apostaMaxima.get(0).valor_inicial = fApostaAtual;

                Modulo.Objetos.$saldoMinimo.blur(function() { Modulo.Limites.saldoMinimo = this.number(); configuraSaldoMinimoAutomatico(); });
                Modulo.Objetos.$saldoMaximo.blur(function() { Modulo.Limites.saldoMaximo = this.number(); });
                Modulo.Objetos.$apostaQuantidade.blur(function() { Modulo.Limites.apostaQuantidade = this.number(); });
                Modulo.Objetos.$apostaMinima.blur(function() { Modulo.Limites.apostaMinima = this.number(); });
                Modulo.Objetos.$apostaMaxima.blur(function() { Modulo.Limites.apostaMaxima = this.number(); });
                Modulo.Objetos.$sequenciaPerdendo.blur(function() { Modulo.Limites.sequenciaPerdendo = this.number(); });
                Modulo.Objetos.$sequenciaVencendo.blur(function() { Modulo.Limites.sequenciaVencendo = this.number(); });
            }
        };
        
        Modulo.Limites = {
            saldoMinimoAutomatico: null,
            saldoMinimo: null,
            saldoMaximo: null,
            apostaQuantidade: null,
            apostaMinima: null,
            apostaMaxima: null,
            sequenciaPerdendo: null,
            sequenciaVencendo: null,
        };
    })();
}