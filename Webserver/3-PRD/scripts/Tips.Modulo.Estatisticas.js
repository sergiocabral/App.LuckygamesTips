window.Tips = window.Tips || {};
if (window.Tips.Modulos) {
    window.Tips.Modulos.Estatisticas = window.Tips.Modulos.Estatisticas || new (function() {

        const Instancia = window.Tips;
        const Modulo = this;

        Modulo.Inicializar = () => {
            Instancia.Layout.AdicionarSecao(Modulo.Secao);
        };

        Modulo.Objetos = { };

        Modulo.Secao = {
            versao: 'v2',

            titulo: 'Estatísticas',
    
            css: `
            :host table td:not([colspan]):nth-child(1), :host table td:not([colspan]):nth-child(3) {
                text-align: right;
                color: #aaa;
            }
            :host table td:not([colspan]):nth-child(2), :host table td:not([colspan]):nth-child(4) {
                text-align: left;
                color: black;
            }
            :host table td:not([colspan]):nth-child(2):before, :host table td:not([colspan]):nth-child(4):before {
                content: ':';
                margin-right: 4px;
            }
            :host label {
                font-size: 12px;
            }
            :host ol {
                margin: 0;
                padding: 0 0 0 20px;
            }
            :host .saldoHistorico .ct-series-a .ct-line {
                stroke: blue;
                stroke-width: 2px;
            }
            :host .saldoHistorico .perda .ct-series-a .ct-line {
                stroke: red;
            }
            :host .controles input[type="text"] {
                width: 75px;
            }
            :host .controles button {
                position: relative;
                top: -2px;
            }
            :host .apostaMelhores button {
                float: right;
                margin-top: -29px;
            }
            :host .predicao {
                text-align: center;
            }          
            :host td.predicao,
            :host td.sorteados {
                vertical-align: top;
            }         
            :host .predicao button,
            :host .sorteados button {
                margin-top: 5px;
            }
            :host .predicao .ct-series-a .ct-slice-pie { 
                fill: #2EAB5B; 
            }
            :host .predicao .ct-series-b .ct-slice-pie { 
                fill: #AB2E40; 
            }
            :host .predicao .ct-label { 
                font-size: 1.3em;
                fill: white;
            }
            :host .sorteados {
                text-align: right;
            }
            :host .sorteados .grafico {
                overflow: auto;
                width: 378px;
                border: 1px solid gainsboro;
                border-radius: 3px;
            }
            :host .sorteados label {
                display: block;
                text-align: left;
                white-space: normal;
                height: 50px;
                overflow: auto;
                border: 1px solid gainsboro;
                border-radius: 3px;
                margin-top: -1px;
                width: 277px;
            }
            :host .sorteados label span {
                display: inline-block;
                width: 85px;
            }
            :host .sorteados label span strong {
                display: inline-block;
                width: 15px;
            }
            :host .sorteados label span em {
                display: inline-block;
                width: 40px;
                text-align: right;
                font-style: normal;
                font-size: 9px;
                position: relative;
                top: -1px;
            }
            :host .sorteados .ct-series-a .ct-bar {
                stroke: #333;
                stroke-width: 18px; 
            }
            :host .sorteados button {
                float: right;
                margin-top: -29px;
            }
            :host .sequencias .grafico {
                border: 1px solid gainsboro;
                border-radius: 3px;
                margin-bottom: 5px;
                height: 100px;
                overflow: auto;
                text-align: center;
            }
            :host .sequencias .grafico > div {
                margin: 1px 0;
            }
            :host .sequencias .grafico .sequencia  {
                display: inline-block;
                width: 10%;
                background-color: #444;
                border-radius: 10px;
                text-align: center;
                color: white;
            }
            :host .sequencias .grafico .perdendo  {
                text-align: left;
            }
            :host .sequencias .grafico .vencendo  {
                text-align: right;
            }
            :host .sequencias .grafico .perdendo,
            :host .sequencias .grafico .vencendo  {
                display: inline-block;
                width: 44%;
            }
            :host .sequencias .grafico .quantidade  {
                display: inline-block;
                width: 40px;
                text-align: right;
            }
            :host .sequencias .grafico .porcento  {
                display: inline-block;
                width: 50px;
                text-align: right;
            }
            :host .sequencias .grafico .barra  {
                width: 100px;
                display: inline-block;
            }
            :host .sequencias .grafico .barra span  {
                min-width: 5px;
                display: inline-block;
            }
            :host .sequencias .grafico .perdendo .barra  {
                text-align: right;
                margin-left: 8px;
            }
            :host .sequencias .grafico .vencendo .barra  {
                text-align: left;
                margin-right: 8px;
            }
            :host .sequencias .grafico .perdendo .barra span  {
                background-color: #AB2E40;
            }
            :host .sequencias .grafico .vencendo .barra span  {
                background-color: #2EAB5B;
            }
            :host .sequenciasHistorico .grafico {
                border: 1px solid gainsboro;
                border-radius: 3px;
                margin-bottom: 5px;
                height: 52px;
                overflow: auto;
                text-align: center;
                width: 484px;
            }
            :host .sequenciasHistorico .grafico > div {
                text-align: left;
                min-width: 100%;
                white-space: nowrap;
            }
            :host .sequenciasHistorico .grafico span {
                display: inline-block;
                text-align: center;
                width: 30px;
                border-radius: 10px;
                margin: 2px 1px 2px 2px;
                padding: 4px 0 5px 0;
            }
            :host .sequenciasHistorico .grafico span.perdendo {
                background-color: #AB2E40;
                color: white;
                position: relative;
                top: 5px;
            }
            :host .sequenciasHistorico .grafico span.vencendo {
                background-color: #2EAB5B;
                color: white;
            }
            `,
    
            html: `
                <table>
                    <tr>
                        <td><label title="Seu nome de usuário&lt;br/&gt;na Luckygames.">Usuário</label></td>
                        <td><label class="usuario">—</label></td>
                        <td><label title="Moeda selecionada&lt;br/&gt;para apostas.">Moeda</label></td>
                        <td><label class="moeda">—</label></td>
                    </tr>
                    <tr><td colspan="4"><div class="divisor"></div></td></tr>
                    <tr>
                        <td><label title="Momento em que as estatísticas&lt;br/&gt;começaram a ser contabilizadas.">Início</label></td>
                        <td><label class="tempoInicio">—</label></td>
                        <td><label title="Tempo corrido desde o início&lt;br/&gt;até a última aposta.">Tempo corrido</label></td>
                        <td><label class="tempoCorrido">—</label></td>
                    </tr>
                    <tr>
                        <td><label title="Momento da última aposta.">Fim</label></td>
                        <td><label class="tempoFim">—</label></td>
                        <td><label title="Com base no tempo corrido,&lt;br/&gt;em média quantas apostas foram&lt;br/&gt;enviadas a cada minuto.">Velocidade</label></td>
                        <td><label class="velocidade">—</label></td>
                    </tr>
                    <tr><td colspan="4"><div class="divisor"></div></td></tr>
                    <tr>
                        <td><label title="Seu saldo quando as estatísticas&lt;br/&gt;começaram a ser contabilizadas.">Saldo inicial</label></td>
                        <td><label class="saldoInicial">—</label></td>
                        <td><label title="Menor saldo já alcançado.">Menor saldo</label></td>
                        <td><label class="saldoMenor">—</label></td>
                    </tr>
                    <tr>
                        <td><label title="Seu saldo atual.&lt;br/&gt;Quanto você realmente tem.">Saldo atual</label></td>
                        <td><label class="saldoAtual">—</label></td>
                        <td><label title="Maior saldo já alcançado.">Maior saldo</label></td>
                        <td><label class="saldoMaior">—</label></td>
                    </tr>
                    <tr>
                        <td><label title="Quanto você ganhou ou perdeu&lt;br/&gt;com as apostas feitas.">Lucro em apostas</label></td>
                        <td><label class="lucroApostas">—</label></td>
                        <td><label title="Quanto você ganhou ou perdeu,&lt;br/&gt;incluindo apostas, doações, prêmios, etc.">Lucro absoluto</label></td>
                        <td><label class="lucroAbsoluto">—</label></td>
                    </tr>
                    <tr>
                        <td><label title="Percentual do lucro em apostas.">Percentual</label></td>
                        <td><label class="lucroApostasPercentual">—</label></td>
                        <td><label title="Percentual do lucro absoluto.">Percentual</label></td>
                        <td><label class="lucroAbsolutoPercentual">—</label></td>
                    </tr>
                    <tr><td colspan="4"><div class="divisor"></div></td></tr>
                    <tr>
                        <td><label title="Quantidade de apostas enviadas.">Apostas</label></td>
                        <td><label class="apostaQuantidade">—</label></td>
                        <td><label title="Valor do montante total apostado.">Total apostado</label></td>
                        <td><label class="apostaTotal">—</label></td>
                    </tr>
                    <tr>
                        <td><label title="Menor valor de aposta enviada.">Menor aposta</label></td>
                        <td><label class="apostaMenor">—</label></td>
                        <td><label title="Valor da última aposta enviada.">Última aposta</label></td>
                        <td><label class="apostaUltima">—</label></td>
                    </tr>
                    <tr>
                        <td><label title="Maior valor de aposta enviada.">Maior aposta</label></td>
                        <td><label class="apostaMaior">—</label></td>
                        <td colspan="2">&nbsp;</td>
                    </tr>
                    <tr><td colspan="4"><div class="divisor"></div></td></tr>
                    <tr>
                        <td><label title="Total de apostas que você perdeu.">Apostas perdidas</label></td>
                        <td><label class="apostaPerdidas">—</label></td>
                        <td><label title="Total de apostas que você venceu.">Apostas vencidas</label></td>
                        <td><label class="apostaVencidas">—</label></td>
                    </tr>
                    <tr>
                        <td><label title="Sequência atual de apostas&lt;br/&gt;perdidas consecutivamente.">Sequência perdida</label></td>
                        <td><label class="sequenciaPerdidas">—</label></td>
                        <td><label title="Sequência atual de apostas&lt;br/&gt;vencidas consecutivamente.">Sequência vencida</label></td>
                        <td><label class="sequenciaVencidas">—</label></td>
                    </tr>
                    <tr>
                        <td><label title="Maior sequência já presenciada&lt;br/&gt;de apostas perdidas.">Maior sequência</label></td>
                        <td><label class="sequenciaPerdidasMaxima">—</label></td>
                        <td><label title="Maior sequência já presenciada&lt;br/&gt;de apostas vencidas.">Maior sequência</label></td>
                        <td><label class="sequenciaVencidasMaxima">—</label></td>
                    </tr>
                    <tr>
                        <td><label title="Média da sequência máxima&lt;br/&gt;de apostas perdidas.">Sequência média</label></td>
                        <td><label class="sequenciaPerdidasMedia">—</label></td>
                        <td><label title="Média da sequência máxima&lt;br/&gt;de apostas vencidas.">Sequência média</label></td>
                        <td><label class="sequenciaVencidasMedia">—</label></td>
                    </tr>
                    <tr><td colspan="4"><div class="divisor"></div></td></tr>
                    <tr>
                        <td colspan="4">
                            <div class="checkbox contabilizarGraficos" style="margin-top: 2px;">
                                <input type="checkbox" checked />
                                <label title="Você pode desativar a contabilização&lt;br/&gt;dos gráficos para melhorar a performance">Exibir gráficos</label>
                            </div>
                            <button class="limparTudo btn grey" style="float: right;" title="Reinicia a contabilização de&lt;br/&gt;todas as estatítiscas.">Reiniciar todos os gráficos e estatísticas</button>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="4" class="apostaMelhores">
                            <h1>Melhores apostas</h1>
                            <div></div>
                            <button class="btn grey" title="Limpa apenas esta lista&lt;br/&gt;de melhores apostas.">Limpar</button>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="4" class="saldoHistorico">
                            <h1 title="Representação gráfica do seu saldo&lt;br/&gt;ao longo das apostas feitas.">Progressão do saldo</h1>
                            <div class="controles">
                                <label title="Total de pontos exibidos no gráfico.&lt;br/&gt;Quanto mais pontos, menos performance.">Pontos do gráfico:</label>
                                <input type="text" number number-digitos="0" number-min="10" number-padrao="100" maxlength="6" />
                                <button class="btn grey" title="Limpa os dados apenas deste&lt;br/&gt;gráfico de progressão do saldo.">Limpar gráfico</button>
                            </div>
                            <div class="grafico"></div>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="1" class="predicao">
                            <h1 title="Validação da predição do número sorteado.&lt;br/&gt;Na teoria, a parte verde deve corresponder ao Win Chance.">Estatísticas</h1>
                            <div class="grafico"></div>
                            <button class="btn grey" title="Limpa os dados apenas deste&lt;br/&gt;gráfico de estatísticas da predição.">Limpar gráfico</button>
                        </td>
                        <td colspan="3" class="sorteados">
                            <h1 title="Estatísticas dos números sorteados de 0 a 99.">Números mais sorteados</h1>
                            <div class="grafico"></div>
                            <label title="Números mais sorteados com indicativo percentual"></label>
                            <button class="btn grey" title="Limpa os dados apenas deste&lt;br/&gt;gráfico de números mais sorteados.">Limpar gráfico</button>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="4" class="sequencias">
                            <h1 title="Análise das sequências&lt;br/&gt;consecutivas perdendo ou vencendo.&lt;br/&gt;No centro é indicado o número de vezes, a sequência.&lt;br/&gt;Nas extremidades se vê quantas vezes ela aconteceu."><span class="floatLeft">(Perdeu)</span> Sequências mais recorrentes <span class="floatRight">(Venceu)</span></h1>
                            <div class="grafico"></div>
                            <div class="controles">
                                <button class="btn grey" title="Limpa os dados apenas deste&lt;br/&gt;gráfico de sequências recorrentes.">Limpar gráfico</button>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="4" class="sequenciasHistorico">
                            <h1 title="Cada número indica a&lt;br/&gt;sequência perdendo ou vencendo.&lt;br/&gt;A lista vai do mais recente para o mais antigo.">Últimas {LimiteListaUltimasSequencias} sequências</h1>
                            <div class="grafico"></div>
                            <div class="controles">
                                <button class="btn grey" title="Limpa os dados apenas deste&lt;br/&gt;gráfico de últimas de sequências.">Limpar gráfico</button>
                            </div>
                        </td>
                    </tr>
                </table>
            `.replace('{LimiteListaUltimasSequencias}', Instancia.Estatisticas.Parametros.LimiteListaUltimasSequencias),

            js: (container, secaoId) => {
                Modulo.Objetos.icheckbug_exibirGrafico = {};
                Instancia.LuckygamesIo.BugICheckEvent('.' + secaoId + ' .contabilizarGraficos input[type="checkbox"]', Modulo.Objetos.icheckbug_exibirGrafico, function() {
                    const exibir = this.checked;
                    let $tr = $(this).closest('tr').next();
                    $tr.find('td').css('padding-top', '20px');
                    while ($tr.length && $tr.get(0).tagName === 'TR') {
                        if (exibir) { $tr.show(); }
                        else { $tr.hide(); }
                        $tr = $tr.next();
                    }
                }).trigger('ifChanged');

                Modulo.Objetos.usuario = container.find('.usuario').get(0);
                Modulo.Objetos.moeda = container.find('.moeda').get(0);
                Modulo.Objetos.tempoInicio = container.find('.tempoInicio').get(0);
                Modulo.Objetos.tempoFim = container.find('.tempoFim').get(0);
                Modulo.Objetos.tempoCorrido = container.find('.tempoCorrido').get(0);
                Modulo.Objetos.velocidade = container.find('.velocidade').get(0);
                Modulo.Objetos.saldoInicial = container.find('.saldoInicial').get(0);
                Modulo.Objetos.saldoAtual = container.find('.saldoAtual').get(0);
                Modulo.Objetos.saldoMenor = container.find('.saldoMenor').get(0);
                Modulo.Objetos.saldoMaior = container.find('.saldoMaior').get(0);
                Modulo.Objetos.lucroApostas = container.find('.lucroApostas').get(0);
                Modulo.Objetos.lucroApostasPercentual = container.find('.lucroApostasPercentual').get(0);
                Modulo.Objetos.lucroAbsoluto = container.find('.lucroAbsoluto').get(0);
                Modulo.Objetos.lucroAbsolutoPercentual = container.find('.lucroAbsolutoPercentual').get(0);
                Modulo.Objetos.apostaQuantidade = container.find('.apostaQuantidade').get(0);
                Modulo.Objetos.apostaTotal = container.find('.apostaTotal').get(0);
                Modulo.Objetos.apostaMenor = container.find('.apostaMenor').get(0);
                Modulo.Objetos.apostaMaior = container.find('.apostaMaior').get(0);
                Modulo.Objetos.apostaUltima = container.find('.apostaUltima').get(0);
                Modulo.Objetos.apostaPerdidas = container.find('.apostaPerdidas').get(0);
                Modulo.Objetos.sequenciaPerdidas = container.find('.sequenciaPerdidas').get(0);
                Modulo.Objetos.sequenciaPerdidasMedia = container.find('.sequenciaPerdidasMedia').get(0);
                Modulo.Objetos.sequenciaPerdidasMaxima = container.find('.sequenciaPerdidasMaxima').get(0);
                Modulo.Objetos.apostaVencidas = container.find('.apostaVencidas').get(0);
                Modulo.Objetos.sequenciaVencidas = container.find('.sequenciaVencidas').get(0);
                Modulo.Objetos.sequenciaVencidasMedia = container.find('.sequenciaVencidasMedia').get(0);
                Modulo.Objetos.sequenciaVencidasMaxima = container.find('.sequenciaVencidasMaxima').get(0);
                
                Modulo.Objetos.apostaMelhores = container.find('.apostaMelhores div').get(0);                
                container.find('.apostaMelhores button').click(() => {
                    Instancia.Estatisticas.Dados.apostaMelhores.length = 0;
                    Modulo.Secao.atualizarExibicao();
                });
                
                Modulo.Objetos.$saldoHistoricoPontos = container.find('.saldoHistorico .controles input');
                Modulo.Objetos.$saldoHistoricoPontos.val(Instancia.Estatisticas.Parametros.LimiteListaSaldoHistorico).blur(function() {
                    Instancia.Estatisticas.Parametros.LimiteListaSaldoHistorico = this.number();
                    Modulo.Secao.atualizarExibicao();
                });
                container.find('.saldoHistorico .controles button').click(() => {
                    Instancia.Estatisticas.Dados.saldoHistorico.length = 0;
                    Modulo.Secao.atualizarExibicao();
                });
                Modulo.Objetos.saldoHistorico = container.find('.saldoHistorico .grafico').get(0);
                Modulo.Objetos.saldoHistoricoChartData = { series: [ [ ] ] };
                Modulo.Objetos.saldoHistoricoChart = new Chartist.Line(
                    Modulo.Objetos.saldoHistorico,
                    Modulo.Objetos.saldoHistoricoChartData, 
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

                container.find('.predicao button').click(() => {
                    Instancia.Estatisticas.Dados.predicao = [0, 0];
                    Modulo.Secao.atualizarExibicao();
                });
                Modulo.Objetos.predicao = container.find('.predicao .grafico').get(0);
                Modulo.Objetos.predicaoChartData = { series: [ 0, 0 ] };
                Modulo.Objetos.predicaoChart = new Chartist.Pie(
                    Modulo.Objetos.predicao,
                    Modulo.Objetos.predicaoChartData, 
                    {
                        width: '100%',
                        height: '117px',
                        fullWidth: true,
                        chartPadding: 0,
                        labelInterpolationFnc: function(value, serie) {
                            var total = Modulo.Objetos.predicaoChartData.series[0] + Modulo.Objetos.predicaoChartData.series[1];
                            var valor = parseInt((Modulo.Objetos.predicaoChartData.series[serie] / total) * 100);
                            return valor + '%';
                        }
                    });

                container.find('.sorteados button').click(() => {
                    Instancia.Estatisticas.Dados.sorteados.fill(0);
                    Modulo.Secao.atualizarExibicao();
                });
                Modulo.Objetos.sorteadosInfo = container.find('.sorteados label').get(0);
                Modulo.Objetos.sorteados = container.find('.sorteados .grafico').get(0);
                Modulo.Objetos.sorteadosChartData = { 
                    labels: '0'.repeat(100).split('').map(function(x, i) { return String(i); }),
                    series: [ '0'.repeat(100).split('').map(x => parseInt(x)) ] 
                };                
                Modulo.Objetos.sorteadosChart = new Chartist.Bar(
                    Modulo.Objetos.sorteados, 
                    Modulo.Objetos.sorteadosChartData, 
                    {
                        width: '2500px',
                        height: '81px',
                        horizontalBars: false,
                        fullWidth: true,
                        chartPadding: 0,
                        axisX: {
                            showGrid: false,
                            showLabel: true,
                            offset: 30
                        },
                        axisY: {
                            showGrid: true,
                            showLabel: true,
                            offset: 30
                        },
                    });

                Modulo.Objetos.sequenciasRecorrentes = container.find('.sequencias .grafico').get(0);                
                container.find('.sequencias button:not(.limparTudo)').click(() => {
                    Instancia.Estatisticas.Dados.sequenciaPerdendoRecorrente.length = 0;
                    Instancia.Estatisticas.Dados.sequenciaVencendoRecorrente.length = 0;
                    Modulo.Secao.atualizarExibicao();
                });

                Modulo.Objetos.sequenciasHistorico = container.find('.sequenciasHistorico .grafico').get(0);                
                container.find('.sequenciasHistorico button:not(.limparTudo)').click(() => {
                    Instancia.Estatisticas.Dados.sequenciaHistorico.length = 0;
                    Modulo.Secao.atualizarExibicao();
                });
                
                container.find('button.limparTudo').click(() => {
                    Instancia.Estatisticas.Reiniciar();
                    Modulo.Secao.atualizarExibicao();
                    Instancia.Geral.Toast('Estatísticas reiniciadas.', 'info');
                });
            },

            atualizarExibicao: () => {
                const fFormatar = (valor, color, color2) => {
                    if (valor.length && valor[0] != '—') {
                        if (color && color2) {
                            color = valor[0] === '-' ? color : color2;
                        }
                        if (color) {
                            valor = '<span style="color:' + color + ';">' + valor + '</span>';
                        }
                    }
                    return valor;
                };

                Modulo.Objetos.usuario.innerHTML = Instancia.LuckygamesIo.Parametros.Usuario();
                Modulo.Objetos.moeda.innerHTML = Instancia.LuckygamesIo.Parametros.Moeda();
                Modulo.Objetos.usuario.innerHTML = Instancia.LuckygamesIo.Parametros.Usuario();
                Modulo.Objetos.tempoInicio.innerHTML = fFormatar(Instancia.Estatisticas.Dados.Formatado.TempoInicio());
                Modulo.Objetos.tempoFim.innerHTML = fFormatar(Instancia.Estatisticas.Dados.Formatado.TempoFinal());
                Modulo.Objetos.tempoCorrido.innerHTML = fFormatar(Instancia.Estatisticas.Dados.Formatado.TempoCorrido());
                Modulo.Objetos.velocidade.innerHTML = fFormatar(Instancia.Estatisticas.Dados.Formatado.Velocidade());
                Modulo.Objetos.saldoInicial.innerHTML = fFormatar(Instancia.Estatisticas.Dados.Formatado.SaldoInicial());
                Modulo.Objetos.saldoAtual.innerHTML = fFormatar(Instancia.Estatisticas.Dados.Formatado.SaldoAtual());
                Modulo.Objetos.saldoMenor.innerHTML = fFormatar(Instancia.Estatisticas.Dados.Formatado.SaldoMenor(), '#AB2E40');
                Modulo.Objetos.saldoMaior.innerHTML = fFormatar(Instancia.Estatisticas.Dados.Formatado.SaldoMaior(), '#2EAB5B');
                Modulo.Objetos.lucroApostas.innerHTML = fFormatar(Instancia.Estatisticas.Dados.Formatado.ApostaLucro(), 'red', 'blue');
                Modulo.Objetos.lucroApostasPercentual.innerHTML = fFormatar(Instancia.Estatisticas.Dados.Formatado.ApostaLucroPercentual(), 'red', 'blue');
                Modulo.Objetos.lucroAbsoluto.innerHTML = fFormatar(Instancia.Estatisticas.Dados.Formatado.Lucro(), 'red', 'blue');
                Modulo.Objetos.lucroAbsolutoPercentual.innerHTML = fFormatar(Instancia.Estatisticas.Dados.Formatado.LucroPercentual(), 'red', 'blue');
                Modulo.Objetos.apostaQuantidade.innerHTML = fFormatar(Instancia.Estatisticas.Dados.Formatado.ApostaQuantidade());
                Modulo.Objetos.apostaTotal.innerHTML = fFormatar(Instancia.Estatisticas.Dados.Formatado.ApostaTotal());
                Modulo.Objetos.apostaMenor.innerHTML = fFormatar(Instancia.Estatisticas.Dados.Formatado.ApostaMenor(), '#AB2E40');
                Modulo.Objetos.apostaMaior.innerHTML = fFormatar(Instancia.Estatisticas.Dados.Formatado.ApostaMaior(), '#2EAB5B');
                Modulo.Objetos.apostaUltima.innerHTML = fFormatar(Instancia.Estatisticas.Dados.Formatado.ApostaUltima());
                Modulo.Objetos.apostaPerdidas.innerHTML = fFormatar(Instancia.Estatisticas.Dados.Formatado.ApostaQuantidadePerdida());
                Modulo.Objetos.sequenciaPerdidas.innerHTML = fFormatar(Instancia.Estatisticas.Dados.Formatado.SequenciaPerdendo());
                Modulo.Objetos.sequenciaPerdidasMedia.innerHTML = fFormatar(Instancia.Estatisticas.Dados.Formatado.SequenciaPerdendoMedia());
                Modulo.Objetos.sequenciaPerdidasMaxima.innerHTML = fFormatar(Instancia.Estatisticas.Dados.Formatado.SequenciaPerdendoMaxima());
                Modulo.Objetos.apostaVencidas.innerHTML = fFormatar(Instancia.Estatisticas.Dados.Formatado.ApostaQuantidadeVencida());
                Modulo.Objetos.sequenciaVencidas.innerHTML = fFormatar(Instancia.Estatisticas.Dados.Formatado.SequenciaVencendo());
                Modulo.Objetos.sequenciaVencidasMedia.innerHTML = fFormatar(Instancia.Estatisticas.Dados.Formatado.SequenciaVencendoMedia());
                Modulo.Objetos.sequenciaVencidasMaxima.innerHTML = fFormatar(Instancia.Estatisticas.Dados.Formatado.SequenciaVencendoMaxima());

                if (!Modulo.Objetos.icheckbug_exibirGrafico.o.checked) { return; }

                const apostaMelhores = Instancia.Estatisticas.Dados.Formatado.ApostaMelhores();
                let apostaMelhoresHtml = '<div style="text-align: center;">Nenhuma aposta ainda.</div>';
                if (apostaMelhores.length) {
                    apostaMelhoresHtml = '<ol>';
                    for (let i = 0; i < apostaMelhores.length; i++) {
                        apostaMelhoresHtml += '<li><a href="' + apostaMelhores[i].url + '" target="_blank">Bet #' + apostaMelhores[i].id + '</a>: Apostou ' + apostaMelhores[i].aposta + ', ganhou ' + apostaMelhores[i].ganho + '.</li>';
                    }
                    apostaMelhoresHtml += '</ol>';
                }
                Modulo.Objetos.apostaMelhores.innerHTML = apostaMelhoresHtml;

                if (Instancia.Estatisticas.Dados.Calculo.lucro() < 0) {
                    $(Modulo.Objetos.saldoHistorico).addClass('perda');
                }
                else {
                    $(Modulo.Objetos.saldoHistorico).removeClass('perda');
                }
                Modulo.Objetos.saldoHistoricoChartData.series[0] = Instancia.Estatisticas.Dados.Formatado.SaldoHistorico();
                Modulo.Objetos.saldoHistoricoChart.update();

                const predicaoData = Instancia.Estatisticas.Dados.Formatado.Predicao();
                predicaoData.push(predicaoData.shift());
                Modulo.Objetos.predicaoChartData.series = predicaoData;
                Modulo.Objetos.predicaoChart.update();

                Modulo.Objetos.sorteadosChartData.series[0] = Instancia.Estatisticas.Dados.Formatado.Sorteados();
                Modulo.Objetos.sorteadosChart.update();
                const sorteadosInfo = Instancia.Estatisticas.Dados.Formatado.SorteadosPercentual().reduce((a, c) => { 
                    a += '<span>&#9679; <strong>' + c.numero + '</strong> <em>(' + c.percentual + ')</em></span>'; 
                    return a;
                }, '');
                Modulo.Objetos.sorteadosInfo.innerHTML = sorteadosInfo ? sorteadosInfo : 'Nenhum ainda.';

                let htmlSequenciasRecorrentes = '';
                const sequenciaPerdendo = Instancia.Estatisticas.Dados.Formatado.SequenciaPerdendoRecorrente();
                const sequenciaVencendo = Instancia.Estatisticas.Dados.Formatado.SequenciaVencendoRecorrente();
                const totalPerdendo = sequenciaPerdendo.reduce((a, c) => a + c, 0);
                const totalVencendo = sequenciaVencendo.reduce((a, c) => a + c, 0);
                const sequencias = sequenciaPerdendo.length >= sequenciaVencendo.length ? sequenciaPerdendo.length : sequenciaVencendo.length;
                for (let i = 0; i < sequencias; i++) {
                    const sequencia = i + 1;
                    const quantidadePerdendo = sequenciaPerdendo[i] ? sequenciaPerdendo[i] : 0;
                    const quantidadeVencendo = sequenciaVencendo[i] ? sequenciaVencendo[i] : 0;
                    const porcentoPerdendo = (totalPerdendo === 0 ? 0 : (quantidadePerdendo / totalPerdendo) * 100).toFixed(2) + '%';
                    const porcentoVencendo = (totalVencendo === 0 ? 0 : (quantidadeVencendo / totalVencendo) * 100).toFixed(2) + '%';
                    htmlSequenciasRecorrentes += '<div><span class="perdendo"><span class="quantidade">' + quantidadePerdendo + '</span><span class="porcento">' + porcentoPerdendo.replace('.', Instancia.Definicoes.SeparadorDecimal) + '</span><span class="barra"><span style="width: ' + porcentoPerdendo + '">&nbsp;</span></span></span><span class="sequencia">' + sequencia + '</span><span class="vencendo"><span class="barra"><span style="width: ' + porcentoVencendo + '">&nbsp;</span></span><span class="porcento">' + porcentoVencendo.replace('.', Instancia.Definicoes.SeparadorDecimal) + '</span><span class="quantidade">' + quantidadeVencendo + '</span></span></div>';
                }
                Modulo.Objetos.sequenciasRecorrentes.innerHTML = htmlSequenciasRecorrentes ? htmlSequenciasRecorrentes : '<span>Nenhuma ainda</span>';

                const htmlSequenciasHistorico = Instancia.Estatisticas.Dados.sequenciaHistorico.map((valor) => { return '<span class="' + (valor < 0 ? 'perdendo' : 'vencendo') + '">' + Math.abs(valor) + '</span>'; }).join('');
                Modulo.Objetos.sequenciasHistorico.innerHTML = htmlSequenciasHistorico ? '<div>' + htmlSequenciasHistorico + '</div>' : 'Nenhuma ainda';

            }
        };
    })();
}