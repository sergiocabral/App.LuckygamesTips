window.Tips = window.Tips || {};
if (window.Tips.Modulos) {
    window.Tips.Modulos.Alertas = window.Tips.Modulos.Alertas || new (function() {

        const Instancia = window.Tips;
        const Modulo = this;

        Modulo.Inicializar = () => {
            Instancia.Layout.AdicionarSecao(Modulo.Secao);
            Instancia.InterceptadorAjax.Anexar('ModuloAlertas', 'response', 10, Modulo.DepoisDaAposta);
        };

        Modulo.Objetos = {};

        Modulo.DepoisDaAposta = (resultado, response, request) => {
            if (!response || !request) { return; }
            if (request.game !== 'dice') { return; }
            if (request.betAmount === undefined) { return; }

            const saldo = parseFloat(response.balance);
            const email = Modulo.Parametros.email;

            if (!Number.isFinite(saldo)) { return; }

            const mensagens = [];

            if (Number.isFinite(Modulo.Parametros.saldoAbaixo)) {
                if (!Modulo.Parametros.saldoAbaixoAlertado && saldo <= Modulo.Parametros.saldoAbaixo) {
                    Modulo.Parametros.saldoAbaixoAlertado = true;
                    Modulo.Objetos.$saldoAbaixo.addClass('bg-alerta');

                    mensagens.push(Instancia.Geral.FormatarString('Saldo passou ABAIXO de {0}.', Modulo.Parametros.saldoAbaixo.toFixed(8)));
                    Instancia.Geral.Audio('limit-bad');
                }
            }

            if (Number.isFinite(Modulo.Parametros.saldoAcima)) {
                if (!Modulo.Parametros.saldoAcimaAlertado && saldo >= Modulo.Parametros.saldoAcima) {
                    Modulo.Parametros.saldoAcimaAlertado = true;
                    Modulo.Objetos.$saldoAcima.addClass('bg-alerta');

                    mensagens.push(Instancia.Geral.FormatarString('Saldo passou ACIMA de {0}.', Modulo.Parametros.saldoAcima.toFixed(8)));
                    Instancia.Geral.Audio('limit-good');
                }
            }

            if (mensagens.length && email) {
                setTimeout(() => {
                    const assunto = 'Luckygames.tips - Alerta disparado';
                    const mensagem = Instancia.Geral.FormatarString(
                        'Usuário: <strong>{0}</strong><br/>Moeda: <strong>{1}</strong><br/>Saldo atual: <strong>{2}</strong><br/><br/>Um ou mais alertas foram disparados, mas as apostas não foram interrompidas.<br/><strong>{3}</strong>', 
                        Instancia.LuckygamesIo.Parametros.Usuario(), 
                        Instancia.LuckygamesIo.Parametros.Moeda(), 
                        Instancia.Estatisticas.Dados.Formatado.SaldoAtual(),
                        ' - ' + mensagens.reduce((a, b) => a + '<br/> - ' + b));

                    Instancia.Api.Email(email, assunto, mensagem).then((data) => { 
                        if (!data || !data.sucesso || !data.response || data.response.erro) {
                            const erro = data && data.response && data.response.mensagem ? ': ' + data.response.mensagem : '.';
                            Instancia.Geral.Toast('Ocorreu um erro ao enviar o e-mail de notificação' + erro, 'error');
                        }
                        else {
                            Instancia.Geral.Toast('Um e-mail foi enviado com os alertas disparados.', 'info');
                        }
                    });

                    console.logg(Instancia.Geral.FormatarString('Email de alerta para {0}. {1}', email, mensagem.replaceAll('<br/>', '\n').replaceAll('<strong>', '').replaceAll('</strong>', '')));
                }, 5000);
            }
        }

        Modulo.Secao = {
            versao: 'v1',

            titulo: 'Alertas',
    
            css: `
            `,
            
            html: `
                <p class="info">
                    Define alertas por email de acordo com a movimentação do saldo.
                </p>
                <table>
                    <tr class="email">
                        <td><label title="Informe um ou vários e-mails&lt;br/&gt;separados por vírgula.">Emails:</label></td>
                        <td><input type="text" /></td>
                    </tr>
                    <tr><td colspan="3"><div class="divisor"></div></td></tr>
                    <tr class="saldoAbaixo">
                        <td><label title="Quando o saldo passar&lt;br/&gt;para baixo deste valor.">Saldo abaixo de:</label></td>
                        <td><input type="text" number number-min="0.00000001" /></td>
                    </tr>
                    <tr class="saldoAcima">
                        <td><label title="Quando o saldo passar&lt;br/&gt;para cima deste valor.">Saldo acima de:</label></td>
                        <td><input type="text" number number-min="0.00000001" /></td>
                    </tr>
                </table>
                <div class="controles"><button class="btn grey" title="Remove os alertas definidos acima.">Limpar</button></div>
            `,

            js: (container, secaoId) => {
                Modulo.Objetos.$email = container.find('.email input');
                Modulo.Objetos.$saldoAbaixo = container.find('.saldoAbaixo input');
                Modulo.Objetos.$saldoAcima = container.find('.saldoAcima input');

                Modulo.Objetos.$email.blur(function() {
                    if (!this.value.trim() && Instancia.Api.Licenca().email != Instancia.Definicoes.Contato) {
                        this.value = Instancia.Api.Licenca().email;
                    }                    
                    Modulo.Parametros.email = this.value;
                });

                Modulo.Objetos.$saldoAbaixo.get(0).valor_inicial = () => Instancia.Estatisticas.Dados.Calculo.saldoAtual();
                Modulo.Objetos.$saldoAbaixo.blur(function() {
                    Modulo.Parametros.saldoAbaixo = this.number();
                    Modulo.Parametros.saldoAbaixoAlertado = false;
                });

                Modulo.Objetos.$saldoAcima.get(0).valor_inicial = () => Instancia.Estatisticas.Dados.Calculo.saldoAtual();
                Modulo.Objetos.$saldoAcima.blur(function() {
                    Modulo.Parametros.saldoAcima = this.number();
                    Modulo.Parametros.saldoAcimaAlertado = false;
                });                
                
                container.find('button').click(() => {
                    container.find('input[number]').val('').blur();
                });

                container.find('input').blur(function() {
                    if (this.value) { $(this).addClass('bg-ativo').removeClass('bg-alerta'); }
                    else { $(this).removeClass('bg-ativo').removeClass('bg-alerta'); }
                });
                container.find('input').blur();
            }
        };

        Modulo.Parametros = {
            emails: null,
            saldoAbaixo: null,
            saldoAbaixoAlertado: null,
            saldoAcima: null,
            saldoAcimaAlertado: null,
        }
        
    })();
}