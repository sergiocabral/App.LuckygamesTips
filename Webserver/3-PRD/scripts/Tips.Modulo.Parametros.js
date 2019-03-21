window.Tips = window.Tips || {};
if (window.Tips.Modulos) {
    window.Tips.Modulos.Parametros = window.Tips.Modulos.Parametros || new (function() {

        const Instancia = window.Tips;
        const Modulo = this;

        Modulo.Inicializar = () => {
            Instancia.Layout.AdicionarSecao(Modulo.Secao);
        };

        Modulo.Objetos = { };

        Modulo.ImageBase64 = {
            Bot: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAADIUlEQVR42nWSf0zUZRzHX9+7+3KplVDiEK+VdEDDEjmIjXblly2dIX/I/DWn+WMmNZHNcoaari+lhvMPM1Nbbg6UWP5gMhkgqAmJ5w/AkACRHyfgXaPjVC6O7nYHPnHXYqPitT3bs2fP5/V8nvfzSIwi+jrEqv0d1NeVkiTu8Jreif2Z16nqfMTkl1Iw69uZ6W2mJ2Q29ZpE+q/tI3PrDlRVlaSWHp/I2lPOtIEbOG8dxe8bpsXjwRBugslNeHq1PJZeIE4/EDgLOUSHXznG9ZOrURQFadk+h+gu2UC7tRXfgBWvXpBXZabsSBfxKT4OZz9i3go9Q10paN3Q1FlDSGgUMVFx1N0uRbpYWis+3bCAZMPzFPX0MT/TSLa6m8M5X7J0u5mincVMiYjH9GIaprAdHDiUyixtG7dtf7Btl4rUe/eWSHrLzPJN75B/8gpX7ZeQNaE4/a3Blp2+VvxDvyM3LyO0N43LlbncaP6aju4h6i21SIFNy9Pmi4/3fMa6LAWLpZ+HohtZknGN/EakNpY7rnNormQw40E0Z+tyWZKjcHDXXs6UX5KCgn8wxCJWvKfiawDdczDtw7O83JJBbYOOSR54JekpB05/ge0+Y3VjE5vLIjZ+ksqcWDP37D8j+Z+S++1Njm9PxubWIGQNb0bspvHXn/h8q8qcREUaJyg4p4qyu4V8tfk7BsOnjmUw/MMajAngeKMCd2MkNd+XELMA1i5VxwuOFKjiVNUJjhYUYBu9w58j/RiFGW+n6e8Oo7/h2ZpMpKaHdM+sJmvtvwQB0hcrYsvp9cHk68uu4zrxLlPDYHHOxqAguiiPm40/knVs5X8zCJB/ShUxK5OZro3CLQbpy08KrkckDOKMO09Y/hr6HvzCojzTxIK5qxZRXLgNW0cDI/7RlwiHJ6O/2BCdSLrjKp4nXSh7jf8vKClThWycwWCkFXu1jPWCDpcDEj4Y5tXp89CVy+A1kL5/AkGAgxcyRGr6TiKkSBwj1uAYsHsJr8gk7DFYaiv5qHLhxIK29mpR0XaIqPhZuB0+KMxmkm4KocM+7DY77xe/Pa7mLy7+TBdr4hDaAAAAAElFTkSuQmCC",
            Risco: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACNElEQVR42qRTzW7aQBAebGO8RqDELVWFVA5AVDmqkDhValXJJy5RL/Tcl+AJ8gSc+ga9o0qRkmsv/TmkpxysKEFELSSADBjb2Mb4p7MmIIeqp1j67NmZ/b6Z2R2noiiCxzwcfX1OpYDFL0UKoIhoovkGUbrf9xvxHVN1ELcBLig+YnJuR/B9mpBWuVarFg8OJJLPC7RCxzDqt1dX73oXFx88x2njvpMHFWzIZG/v+PXRkRxxHFn6Ptz1enFAkiTxuSyLhXL5yfnZ2fFiPoeNCENfWFaRFYRWvdGQ57ZNdF2HwWAAtdPTGNSmPst1yStFkZlMpkU5WwHsp1k6PKzOTJPMUd00TbBte1satanPMAwwUeRZpVIN1ue0bsEHeJsrFCRtOt2SLMuC0WgUk26wlTAI1j1zHDzd35coB5efNgIvQoYRfOw7WK3AnM3AXiyg3+9DOp0GBv3sRhnjrm0LlJOsAHwMeLR0rCLCbGn0UXI2mwV+57RZ3Osnb2EF8Mccj+uRpokkMViqosTf/M5drzzPpZztIaLat/FwOMlhfyKuxfVAgaKq0Oh2Y1tMwHCcKeUkBTo3k0kXGMYRcSrppgyC5/k4YyZBDsPQGS6X15SzFQhxPBdB0P6haSoGHIIiBfT/rFRiUJsgPCSfW5Zqh2Gbch5MIjpO7vC0v+h6S+b56kuel0osK9CYHgTupedNVc+7XiE5/59RjkW0MPz11XWbiH9+JrzKTu4+8+ZJPfZ3/ivAANdhE/hZLAn6AAAAAElFTkSuQmCC",
            Tempo: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAC/ElEQVR42kRT20obURRdmYmJIeZioiZRTETx1rTmrRWqSKIWKqhQEbWY/oSv/kyhNaCWKBRKX6QPNtQiWOuDYrwkVZvoqJGMZhzNpXtPvRxYszlzzlr7enTDw8PQ6XQQBEGzhGpCOwAXwYr/K0s4LpVKmwSJgGKxCLZ6PC4j4bnP53s5Ojr6trGx8Vk+n9cO9Ho9dnd3N+bm5maSyeR3+vWToPKZ2NbWxl6Z/GpwcHAyHA5P3d7eutLpNFKpFE5PTyHLMioqKlyhULCPIhW3t7eZnCQUxNbWVg6la2hoaDIYDL7b2YlDvlZhqqyEoih4GghANBhwfHKCM0lCINAREEUxTyISiwiFQsHl9Xq7e3tD4a2tTRSN5XB4vajzeHCwt6eF73A40OL3Q2cyIR6Po6enJ1xXV9fNXBbwj4y8GU8kElCLJdjdbpjIo5GIqqo+Foj2Hl8DCjqBUjvCwMDrceayQG19fb2fc7W5arTLOSImaR+LxTR7j0tKqaq2Fmdn5/B4PH7m6uljl+VLZLNZ+Ky2B4++qiqteGzvV55ad06R8F1FuQZz9dQqjoIKCW0WSnfkgb4+hEIhhMfGYLFYNFAnEOrv1+4yh7ksIIuing5tuLnKoazCrHmLzM5icmICHyKRhwhYXKUOqTmujcACMnv/G4/vbDkcTmTSEsqpgByqjSrPZLb3cFZX4zglwW53YH8/scVcFvgdiUSiTmc1ircl5E4vINBI82LS/TJQ7uk/KSjknQUWF6NR5oo1NTWXmcx5GajLnZ1dT86lC+QuFVjMZpjKjdBTXVRFxV78EBKdud0eLCzMf1pZiUVpAH+xAD+Mo/X1NYEiF7q6gm1kIZ1kkNxP4ehQgpxVYDCUawMVibxfmJ+fiVLBv3BjRJfLxaOcv7q6iq+u/pCXl79JTU0tVc3N7Q67vRIMs9mCjY213enpqY9LS1+jRPxsNBoV7fV2dHRoT5N7SyK4ubmpp/0LutRAcN6V4IyQIK8rBoPhwEzpWa1Wre3/BBgA2laCpQNtu3AAAAAASUVORK5CYII=",
            PerdaMaxima: "data:image/gif;base64,R0lGODlhEAAQAMQfAPNRUfNMTMhSS/Ofnvzl5ettbbgGBvNZWfN7e/NVVfNjY/KKifnT0/NtbfNdXVQzGPSXl/WysptFNGA7HMkODv3q6vvg4N8jI/nOzosvHek1NdgbG7F2RVk2Gf///////yH5BAEAAB8ALAAAAAAQABAAAAVx4CeOZCl6aKqq5wAtCNIoB9Dd3glVFsFgg6CA08l9PAuLwnGoAQLDidGDYDAPCcBTwpGeGpFm9hngeo+KAVZL5hZPDgg7QC9zHtPEosDvFzJ3UxoXGxSGBogdgScrKop4JiUej0aRJ4pvlpc4mowpHyEAOw==",
            Lucro: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABEUlEQVR4XqWTPU7DQBCF31gjsMQF4BwUFBQ0FBRORZ+SA9CmpuUAlPRUcUmTkoKOG1AkErgLUpysMozicXa19gqZjDTSkz3vm33+IRHBIcXaIKJew+mUdvTFSMIBhEsz7aT5oxBoG8gqWpilzLMbQeWwa9UxxMNExIje/HLdO4vbV7I4PoYHmPnpypudSfZ83M0aSAvgcPPDpeDL+eF624jjIKjOYNLEoX2EszKT+4tuxJXBckanHt8I82JL7a1SLxSheXwuWK0NoP38TjGj3EfQTKP4LVQboK4tAgHx9+CfQaK+HeDsBJyY+hMg62YhHclwQOUAtggu/88JNsCJAX5U81AAfxLqVi8JqZ/p4N/5F/2SgKH2Cs7qAAAAAElFTkSuQmCC",
            Configuracao: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABX0lEQVR4Xp2TsWqDUBSGLyU+QFcfwMWhXTOlb9C3yBQQRRBEaFFINkNCIINLlgxZQh6hW8Z2y5bJuS1Ogsgp34UbpMQUKvzk9z/f4XBururWMx6Pn1A/cbv5MYoiQfg+7u5X02tn4rNt2wrhCajB9E18mc1mEscxEz/xh8NBC09GDQ9r+gadBd6qqlLD4VA1TXNvWdal4LquchxHZ8fjUbN9e3/tdjvZ7/eyWCwkDEOE1xk1mKsHxm5pmmooz3PAd3KEJ6MGA0tumkdBEMh0OpXNZiPb7VZ4NwDCk1GDgYWhdwAgIqptW3ZX5v33Q0YdwXYZJjxwskmSSFEUTGCFD7MCnowaDCw9Vw9xtVrJer2WLMvE8zyE1xk1mN5r6/u+LJdLmc/n/F7UzWBgr93EEf/z+XxWp9PpuyxLVde1Fp6MGgxs723kZI033wKejJrxf4pDmkwmgvD//SJH6BbzA0JbL5FfjltyAAAAAElFTkSuQmCC",
        }

        Modulo.Secao = {
            versao: 'v4',

            titulo: 'Parametros',

            css: `
                :host table.select td {
                    white-space: nowrap;
                }
                :host td:nth-child(2) {
                    width: 100%;
                }
                :host .descricao {
                    font-size: 150%;
                    color: grey;
                    font-weight: bold;
                    padding-left: 18px;
                }
                :host .descricao strong {
                    color: black;
                    text-transform: uppercase;
                    display: inline-block;
                    margin: 0 0 5px -10px;                    
                }
                :host #scriptParametros {
                    margin-top: 10px;
                    height: 180px;
                }
                :host .checkbox.aplicarPadrao {
                    float: left;
                    margin-top: 2px;
                }
                :host .script.edicao .ace_editor .ace_gutter {
                    background-color: brown;
                }
                :host .descricao .icone {
                    background-repeat: no-repeat;
                    background-position: left 5px;
                    padding-left: 19px;
                }
                :host .descricao .risco.baixo { color: orange; }
                :host .descricao .risco.medio { color: indianred; }
                :host .descricao .risco.alto { color: red; }
                :host .descricao .bot { background-image: url({base64Bot}); }
                :host .descricao .risco { background-image: url({base64Risco}); }
                :host .descricao .tempo { background-image: url({base64Tempo}); }
                :host .descricao .perdaMaxima { background-image: url({base64PerdaMaxima}); }
                :host .descricao .lucro { background-image: url({base64Lucro}); }
                :host .descricao .configuracao { background-image: url({base64Configuracao}); }
            `
            .replace('{base64Bot}', Modulo.ImageBase64.Bot)
            .replace('{base64Risco}', Modulo.ImageBase64.Risco)
            .replace('{base64Tempo}', Modulo.ImageBase64.Tempo)
            .replace('{base64PerdaMaxima}', Modulo.ImageBase64.PerdaMaxima)
            .replace('{base64Lucro}', Modulo.ImageBase64.Lucro)
            .replace('{base64Configuracao}', Modulo.ImageBase64.Configuracao),

            html: `
                <p class="info">
                    Este módulo possibilitar configurar o ` + Instancia.Definicoes.Nome + `
                    com parâmetros pre definidos e testados pelo desenvolvedor.
                    Parâmetros que resultaram em sucesso e não queremos esquecê-lo.
                    Ou mesmo que você ajuste os parâmetros através do script abaixo.
                </p>
                <table class="select">
                    <tr>
                        <td><label title="Lista de pré-definições que configuram os&lt;br&gt;parâmetros de cada módulo automaticamente.">Definições:</label></td>
                        <td>
                            <select></select>
                        </td>
                    </tr>
                </table>
                <table>
                    <tr><td class="descricao"></td></tr>
                    <tr><td class="script"><div id="scriptParametros"></div></td></tr>
                    <tr><td class="right">
                        <div class="checkbox aplicarPadrao">
                            <input type="checkbox" checked />
                            <label title="Aplica as definições padrão antes&lt;br&gt;de aplicar a definição selecionada.">Aplicar definições padrão.</label>
                        </div>
                        <button class="btn grey recarregar" title="Recarrega as definições da opção selecionada&lt;br&gt;sobreescrevendo qualquer alteração que você tenha feito no script.">Recarregar</button>
                        <button class="btn red executar" title="Aplica as configurações do script&lt;br&gt;nos parâmetros da tela.&lt;br&gt;E executa as operações pré-configuradas neste parâmetro.">Aplicar e Executar</button>
                        <button class="btn blue aplicar" title="Aplica as configurações do script&lt;br&gt;nos parâmetros da tela.">Aplicar</button>
                    </td></tr>
                </table>
            `,

            js: (container, secaoId) => {
                Modulo.Objetos.$definicaoSelecionada = container.find('select');
                Modulo.Objetos.$script = container.find('.script');
                Modulo.Objetos.$descricao = container.find('.descricao');
                Modulo.Objetos.$btnAplicar = container.find('button.aplicar');
                Modulo.Objetos.$btnAplicarEExecutar = container.find('button.executar');
                Modulo.Objetos.$btnRecarregar = container.find('button.recarregar');

                Modulo.Objetos.icheckbug_aplicarPadrao = {};
                Instancia.LuckygamesIo.BugICheckEvent('.' + secaoId + ' .aplicarPadrao input[type="checkbox"]', Modulo.Objetos.icheckbug_aplicarPadrao, function() {
                }).trigger('ifChanged');

                Modulo.Objetos.scriptAce = ace.edit("scriptParametros");
                Modulo.Objetos.scriptAce.setTheme("ace/theme/twilight");
                Modulo.Objetos.scriptAce.session.setMode("ace/mode/json");
                Modulo.Objetos.scriptAce.session.setTabSize(2);
                Modulo.Objetos.scriptAce.session.setUseWrapMode(true);
                Modulo.Objetos.scriptAce.on('change', () => {
                    if (!Modulo.Objetos.$script.hasClass('edicao')) {
                        Modulo.Objetos.$script.addClass('edicao');
                    }
                });
                
                Modulo.Parametros.Padrao = Modulo.Parametros.LerDaTela();
                Modulo.PreDefinicao('00000').definicoes = Modulo.Parametros.Padrao;

                Modulo.PreDefinicoes.sort((a, b) => a.nome < b.nome ? -1 : a.nome > b.nome ? 1 : 0);
                for (let i = 0; i < Modulo.PreDefinicoes.length; i++) {
                    Modulo.PreDefinicoes[i].nome = Modulo.PreDefinicoes[i].nome.replaceAll('#', '');
                }

                let htmlOptions = '';
                for (let i = 0; i < Modulo.PreDefinicoes.length; i++) {
                    htmlOptions += '<option value="{id}">{nome}</option>'.replace('{id}', Modulo.PreDefinicoes[i].id).replace('{nome}', Modulo.PreDefinicoes[i].nome);
                }
                Modulo.Objetos.$definicaoSelecionada.html(htmlOptions);
                Modulo.Objetos.$definicaoSelecionada.niceSelect('update');

                Modulo.Objetos.$definicaoSelecionada.change(function() {                    
                    const definicao = Modulo.PreDefinicao(this.value);

                    let descricao = '';
                    if (typeof(definicao.info) === 'string') descricao = '<br/>' + definicao.info;
                    if (definicao.info.risco) descricao += '<br /> &bull; <span class="icone risco ' + definicao.info.risco + '">Risco: ' + definicao.info.risco + '</span>';
                    if (definicao.info.bot) descricao += '<br /> &bull; <span class="icone bot">' + definicao.info.bot + '</span>';
                    if (definicao.info.lucro) descricao += '<br /> &bull; <span class="icone lucro">' + definicao.info.lucro + '</span>';
                    if (definicao.info.perdaMaxima) descricao += '<br /> &bull; <span class="icone perdaMaxima">' + definicao.info.perdaMaxima + '</span>';
                    if (definicao.info.tempo) descricao += '<br /> &bull; <span class="icone tempo">' + definicao.info.tempo + '</span>';
                    if (definicao.info.descricao) descricao += '<br /> &bull; <span class="icone configuracao">Modo de operação:</span>' + definicao.info.descricao.replaceAll('\n', '<br /> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; - ');

                    Modulo.Objetos.$descricao.html('<strong>' + definicao.nome + '</strong>' + descricao);
                    
                    const script = 
                        Array.isArray(definicao.definicoes) || typeof(definicao.definicoes) === 'string' ? Modulo.Parametros.ArrayStringToJson(definicao.definicoes) : 
                        typeof(definicao.definicoes) === 'object' && definicao.definicoes ? definicao.definicoes : 
                        definicao.definicoes instanceof Function ? definicao.definicoes() : 
                        {};

                    Modulo.Objetos.scriptAce.setValue(Instancia.Geral.ToString(script));
                    Modulo.Objetos.scriptAce.selection.clearSelection();
                    Modulo.Objetos.scriptAce.selection.moveCursorFileStart();
                    Modulo.Objetos.$script.removeClass('edicao');

                    Modulo.Objetos.$btnAplicarEExecutar.get(0).executar = definicao.executar;
                    if (definicao.executar instanceof Function) {
                        Modulo.Objetos.$btnAplicarEExecutar.show();
                    } else {
                        Modulo.Objetos.$btnAplicarEExecutar.hide();
                    }
                });
                Modulo.Objetos.$definicaoSelecionada.change();
                
                Modulo.Objetos.$btnRecarregar.click(() => {
                    Modulo.Objetos.$definicaoSelecionada.trigger('change');
                });

                Modulo.Objetos.$btnAplicar.click(() => {
                    Modulo.Parametros.AplicarNaTela(Modulo.Objetos.scriptAce.getValue());
                });

                Modulo.Objetos.$btnAplicarEExecutar.click(function() {
                    Modulo.Parametros.AplicarNaTela(Modulo.Objetos.scriptAce.getValue());
                    if (this.executar instanceof Function) {
                        this.executar();
                    }
                });
                Modulo.Objetos.$btnAplicarEExecutar.hide();              
            },
        };

        Modulo.PreDefinicao = (id) => {
            for (let i = 0; i < Modulo.PreDefinicoes.length; i++) {
                if (Modulo.PreDefinicoes[i].id == id) {
                    return Modulo.PreDefinicoes[i];
                }
            }
            return null;
        };

        Modulo.PreDefinicoes = [
            { 
                id: '00000',
                nome: '#Padrão', 
                info: `Configuração padrão de fábrica.`,
                definicoes: null,
            },            
            { 
                id: '00001', 
                nome: '##Atual', 
                info: `Configuração atual dos parâmetros na tela.`,
                definicoes: () => Modulo.Parametros.LerDaTela(),
            },
            { 
                id: 'I3WKM', 
                nome: 'Fifty Step', 
                info: {
                    bot: 'BOT Martin',
                    risco: 'baixo',
                    tempo: '10 minutos',
                    perdaMaxima: 'Perda máxima: 1%',
                    lucro: 'Meta de lucro: 1%',
                    descricao: `
                        Prediction: 50
                        Tolerância de perdas: 16x            
                        Limite automático para saldo mínimo: 99%            
                        Inverte o prediction após cada perda.`,
                },
                definicoes: [
                    "Global [ Atualização da tela ] = 0",
                    "Estatísticas [ Exibir gráficos ] = false",
                    "Alertas [ Emails ] = null",
                    "Alertas [ Saldo abaixo ] = null",
                    "Alertas [ Saldo acima ] = 101%",
                    "Limites [ Saldo mínimo ] = 99%",
                    "Limites [ Saldo mínimo automático ] = true",
                    "Espera [ Depois de apostas ] = 1",
                    "Espera [ Depois de apostas esperar ] = 200",
                    "Espera [ Variar tempo ] = true",
                    "Espera [ Variar tempo com percentual ] = 30",
                    "BOT Martin [ Meta de saldo ] = 101%",
                    "BOT Martin [ Arriscar % ] = 100",
                    "BOT Martin [ Prediction ] = 50",
                    "BOT Martin [ Aposta inicial por perdas ] = 16",
                    "BOT Martin [ Aposta inicial por percentual ] = null",
                    "BOT Martin [ Aposta inicial por valor ] = null",
                    "BOT Martin [ Evitar apostas ] = false",
                    "BOT Martin [ Evitar apostas se perda for menor ] = null",
                    "BOT Martin [ Apostar mínimo ] = false",
                    "BOT Martin [ Apostar mínimo após perdas ] = null",
                    "BOT Martin [ Apostar mínimo por vezes ] = null",
                    "BOT Martin [ Esperar ] = false",
                    "BOT Martin [ Esperar após perdas ] = null",
                    "BOT Martin [ Esperar por millisegundos ] = null",
                    "BOT Martin [ Desistir ] = false",
                    "BOT Martin [ Desistir após perdas ] = null",
                    "BOT Martin [ Após desistir ] = null",
                    "BOT Martin [ Desistir e recomeçar em millisegundos ] = null",
                    "BOT Martin [ Parar ao zerar ] = false",
                    "BOT Martin [ Parar ao zerar por vezes ] = null",
                    "BOT Martin [ Inverter prediction ] = true",
                    "BOT Martin [ Inverter prediction após perdas ] = 1",
                    "BOT Martin [ Recomeçar em caso de erro ] = true",
                    "BOT Martin [ Recomeçar em caso de erro após millisegundos ] = 1000",
                ],
                executar: () => {
                    Modulo.Comandos.AbrirJanela();
                    Modulo.Comandos.LigarBotMarin();
                    Modulo.Comandos.AbrirEstatisticas();
                },
            },
            { 
                id: 'UMHG5', 
                nome: 'Fifty Run', 
                info: {
                    bot: 'BOT Martin',
                    risco: 'médio',
                    tempo: '4 hora',
                    perdaMaxima: 'Perda máxima: 100%. Perde tudo.',
                    lucro: 'Meta de lucro: 20%',
                    descricao: `
                        Prediction: 50
                        Tolerância de perdas: 16x
                        Perdendo 9x espera longa antes de tentar mais 7x.
                        Inverte o prediction após cada perda.`,
                },
                definicoes: [
                    "Global [ Atualização da tela ] = 0",
                    "Estatísticas [ Exibir gráficos ] = false",
                    "Alertas [ Emails ] = null",
                    "Alertas [ Saldo abaixo ] = 20%",
                    "Alertas [ Saldo acima ] = 120%",
                    "Espera [ Depois de apostas ] = 1",
                    "Espera [ Depois de apostas esperar ] = 200",
                    "Espera [ Variar tempo ] = true",
                    "Espera [ Variar tempo com percentual ] = 30",
                    "BOT Martin [ Meta de saldo ] = 120%",
                    "BOT Martin [ Arriscar % ] = 100",
                    "BOT Martin [ Prediction ] = 50",
                    "BOT Martin [ Aposta inicial por perdas ] = 16",
                    "BOT Martin [ Aposta inicial por percentual ] = null",
                    "BOT Martin [ Aposta inicial por valor ] = null",
                    "BOT Martin [ Evitar apostas ] = false",
                    "BOT Martin [ Evitar apostas se perda for menor ] = null",
                    "BOT Martin [ Apostar mínimo ] = false",
                    "BOT Martin [ Apostar mínimo após perdas ] = null",
                    "BOT Martin [ Apostar mínimo por vezes ] = null",
                    "BOT Martin [ Esperar ] = true",
                    "BOT Martin [ Esperar após perdas ] = 9",
                    "BOT Martin [ Esperar por millisegundos ] = 30000",
                    "BOT Martin [ Desistir ] = false",
                    "BOT Martin [ Desistir após perdas ] = null",
                    "BOT Martin [ Após desistir ] = null",
                    "BOT Martin [ Desistir e recomeçar em millisegundos ] = null",
                    "BOT Martin [ Parar ao zerar ] = false",
                    "BOT Martin [ Parar ao zerar por vezes ] = null",
                    "BOT Martin [ Inverter prediction ] = true",
                    "BOT Martin [ Inverter prediction após perdas ] = 1",
                    "BOT Martin [ Recomeçar em caso de erro ] = true",
                    "BOT Martin [ Recomeçar em caso de erro após millisegundos ] = 1000",
                ],
                executar: () => {
                    Modulo.Comandos.AbrirJanela();
                    Modulo.Comandos.LigarBotMarin();
                    Modulo.Comandos.AbrirEstatisticas();
                },
            },
            { 
                id: 'J23O9',
                nome: 'Voyla 10', 
                info: {
                    bot: 'BOT Martin',
                    risco: 'medio',
                    tempo: '1 hora',
                    perdaMaxima: 'Perda máxima: 100%. Perde tudo.',
                    lucro: 'Meta de lucro: 20%',
                    descricao: `
                        Prediction: 10
                        Tolerância de perdas: 80x
                        Após perder 50x aposta o mínimo por 5x.`,
                },
                definicoes: [
                    "Global [ Atualização da tela ] = 0",
                    "Estatísticas [ Exibir gráficos ] = false",
                    "Alertas [ Emails ] = null",
                    "Alertas [ Saldo abaixo ] = 20%",
                    "Alertas [ Saldo acima ] = 120%",
                    "Espera [ Depois de apostas ] = 1",
                    "Espera [ Depois de apostas esperar ] = 200",
                    "Espera [ Variar tempo ] = true",
                    "Espera [ Variar tempo com percentual ] = 30",
                    "BOT Martin [ Meta de saldo ] = 120%",
                    "BOT Martin [ Arriscar % ] = 100",
                    "BOT Martin [ Prediction ] = 10",
                    "BOT Martin [ Aposta inicial por perdas ] = 80",
                    "BOT Martin [ Aposta inicial por percentual ] = null",
                    "BOT Martin [ Aposta inicial por valor ] = null",
                    "BOT Martin [ Evitar apostas ] = false",
                    "BOT Martin [ Evitar apostas se perda for menor ] = null",
                    "BOT Martin [ Apostar mínimo ] = false",
                    "BOT Martin [ Apostar mínimo após perdas ] = null",
                    "BOT Martin [ Apostar mínimo por vezes ] = null",
                    "BOT Martin [ Esperar ] = true",
                    "BOT Martin [ Esperar após perdas ] = 50",
                    "BOT Martin [ Esperar por millisegundos ] = 60000",
                    "BOT Martin [ Desistir ] = false",
                    "BOT Martin [ Desistir após perdas ] = null",
                    "BOT Martin [ Após desistir ] = null",
                    "BOT Martin [ Desistir e recomeçar em millisegundos ] = null",
                    "BOT Martin [ Parar ao zerar ] = false",
                    "BOT Martin [ Parar ao zerar por vezes ] = null",
                    "BOT Martin [ Inverter prediction ] = true",
                    "BOT Martin [ Inverter prediction após perdas ] = 50",
                    "BOT Martin [ Recomeçar em caso de erro ] = true",
                    "BOT Martin [ Recomeçar em caso de erro após millisegundos ] = 1000",
                ],
                executar: () => {
                    Modulo.Comandos.AbrirJanela();
                    Modulo.Comandos.LigarBotMarin();
                    Modulo.Comandos.AbrirEstatisticas();
                }
            },
            {                 
                id: 'J23O9', 
                nome: 'Test Full', 
                info: {
                    bot: 'BOT Martin',
                    risco: '?',
                    tempo: '?',
                    perdaMaxima: '?',
                    lucro: '?',
                    descricao: `
                        Este é um script de testes.`,
                },
                definicoes: [
                    "Global [ Atualização da tela ] = 0",
                    "Estatísticas [ Exibir gráficos ] = false",
                    "Alertas [ Emails ] = null",
                    "Alertas [ Saldo abaixo ] = 50%",
                    "Alertas [ Saldo acima ] = null",
                    "Espera [ Depois de apostas ] = 1",
                    "Espera [ Depois de apostas esperar ] = 400",
                    "Espera [ Variar tempo ] = false",
                    "Espera [ Variar tempo com percentual ] = null",
                    "BOT Martin [ Meta de saldo ] = 120%",
                    "BOT Martin [ Arriscar % ] = 50",
                    "BOT Martin [ Prediction ] = 10",
                    "BOT Martin [ Aposta inicial por perdas ] = 130",
                    "BOT Martin [ Aposta inicial por percentual ] = null",
                    "BOT Martin [ Aposta inicial por valor ] = null",
                    "BOT Martin [ Evitar apostas ] = false",
                    "BOT Martin [ Evitar apostas se perda for menor ] = null",
                    "BOT Martin [ Apostar mínimo ] = false",
                    "BOT Martin [ Apostar mínimo após perdas ] = null",
                    "BOT Martin [ Apostar mínimo por vezes ] = null",
                    "BOT Martin [ Esperar ] = false",
                    "BOT Martin [ Esperar após perdas ] = null",
                    "BOT Martin [ Esperar por millisegundos ] = null",
                    "BOT Martin [ Desistir ] = false",
                    "BOT Martin [ Desistir após perdas ] = false",
                    "BOT Martin [ Após desistir ] = null",
                    "BOT Martin [ Desistir e recomeçar em millisegundos ] = null",
                    "BOT Martin [ Parar ao zerar ] = true",
                    "BOT Martin [ Parar ao zerar por vezes ] = 1",
                    "BOT Martin [ Inverter prediction ] = true",
                    "BOT Martin [ Inverter prediction após perdas ] = 1",
                    "BOT Martin [ Recomeçar em caso de erro ] = true",
                    "BOT Martin [ Recomeçar em caso de erro após millisegundos ] = 1000",
                ],
                executar: () => {
                    Modulo.Comandos.AbrirJanela();
                    Modulo.Comandos.LigarBotMarin();
                    Modulo.Comandos.AbrirEstatisticas();
                }
            },
        ];

        Modulo.Comandos = {
            AbrirJanela: () => {
                if (!Instancia.Objetos.$janela.is(":visible")) Instancia.Objetos.$botaoAtivador.click();
            },
            AbrirEstatisticas: () => {
                const container = Instancia.Modulos.Estatisticas.Objetos.$saldoHistoricoPontos.closest('article');
                if (!container.is(":visible")) container.prev().click();
                Instancia.Objetos.$janela.closest('.jBox-content').scrollTop(121);
            },
            LigarBotMarin: () => {
                const container = Instancia.Modulos.MartinBot.Objetos.$btnLigar.closest('article');
                if (!container.is(":visible")) container.prev().click();
                const btn = Instancia.Modulos.MartinBot.Objetos.$btnLigar;
                if (btn.is(":visible") && btn.text() == "Ligar") btn.click();
            },
            LigarBotRaw: () => {
                const container = Instancia.Modulos.RawBot.Objetos.$controleBtnLigar.closest('article');
                if (!container.is(":visible")) container.prev().click();
                const btn = Instancia.Modulos.RawBot.Objetos.$controleBtnLigar;
                if (btn.is(":visible") && btn.text() == "Ligar") btn.click();
            },
        };

        Modulo.Mapa = [
            {
                nome: "Global",
                mapa: [
                    {
                        nome: "Atualização da tela",
                        get: () => Modulo.Funcoes.Get.Select(Instancia.Objetos.$atualizarExibicaoIntervalo),
                        set: (val) => Modulo.Funcoes.Set.Select(Instancia.Objetos.$atualizarExibicaoIntervalo, val),
                    }
                ]
            },
            {
                nome: "Estatísticas",
                mapa: [
                    {
                        nome: "Exibir gráficos",
                        get: () => Modulo.Funcoes.Get.Checkbox(Instancia.Modulos.Estatisticas.Objetos.icheckbug_exibirGrafico),
                        set: (val) => Modulo.Funcoes.Set.Checkbox(Instancia.Modulos.Estatisticas.Objetos.icheckbug_exibirGrafico, val),
                    },
                    {
                        nome: "Pontos no gráfico",
                        get: () => Modulo.Funcoes.Get.InputNumber(Instancia.Modulos.Estatisticas.Objetos.$saldoHistoricoPontos),
                        set: (val) => Modulo.Funcoes.Set.InputNumber(Instancia.Modulos.Estatisticas.Objetos.$saldoHistoricoPontos, val),
                    },
                ]
            },
            {
                nome: "Alertas",
                mapa: [
                    {
                        nome: "Emails",
                        get: () => Modulo.Funcoes.Get.InputText(Instancia.Modulos.Alertas.Objetos.$email),
                        set: (val) => Modulo.Funcoes.Set.InputText(Instancia.Modulos.Alertas.Objetos.$email, val),
                    },
                    {
                        nome: "Saldo abaixo",
                        get: () => Modulo.Funcoes.Get.InputNumber(Instancia.Modulos.Alertas.Objetos.$saldoAbaixo),
                        set: (val) => Modulo.Funcoes.Set.InputNumber(Instancia.Modulos.Alertas.Objetos.$saldoAbaixo, val),
                    },
                    {
                        nome: "Saldo acima",
                        get: () => Modulo.Funcoes.Get.InputNumber(Instancia.Modulos.Alertas.Objetos.$saldoAcima),
                        set: (val) => Modulo.Funcoes.Set.InputNumber(Instancia.Modulos.Alertas.Objetos.$saldoAcima, val),
                    },
                ]
            },
            {
                nome: "Limites",
                mapa: [
                    {
                        nome: "Saldo mínimo",
                        get: () => Modulo.Funcoes.Get.InputNumber(Instancia.Modulos.Limites.Objetos.$saldoMinimo),
                        set: (val) => Modulo.Funcoes.Set.InputNumber(Instancia.Modulos.Limites.Objetos.$saldoMinimo, val),
                    },
                    {
                        nome: "Saldo mínimo automático",
                        get: () => Modulo.Funcoes.Get.Checkbox(Instancia.Modulos.Limites.Objetos.icheckbug_saldoMinimoAutomatico),
                        set: (val) => Modulo.Funcoes.Set.Checkbox(Instancia.Modulos.Limites.Objetos.icheckbug_saldoMinimoAutomatico, val),
                    },
                    {
                        nome: "Saldo máximo",
                        get: () => Modulo.Funcoes.Get.InputNumber(Instancia.Modulos.Limites.Objetos.$saldoMaximo),
                        set: (val) => Modulo.Funcoes.Set.InputNumber(Instancia.Modulos.Limites.Objetos.$saldoMaximo, val),
                    },
                    {
                        nome: "Quantidade de aposta",
                        get: () => Modulo.Funcoes.Get.InputNumber(Instancia.Modulos.Limites.Objetos.$apostaQuantidade),
                        set: (val) => Modulo.Funcoes.Set.InputNumber(Instancia.Modulos.Limites.Objetos.$apostaQuantidade, val),
                    },
                    {
                        nome: "Aposta mínima",
                        get: () => Modulo.Funcoes.Get.InputNumber(Instancia.Modulos.Limites.Objetos.$apostaMinima),
                        set: (val) => Modulo.Funcoes.Set.InputNumber(Instancia.Modulos.Limites.Objetos.$apostaMinima, val),
                    },
                    {
                        nome: "Aposta máxima",
                        get: () => Modulo.Funcoes.Get.InputNumber(Instancia.Modulos.Limites.Objetos.$apostaMaxima),
                        set: (val) => Modulo.Funcoes.Set.InputNumber(Instancia.Modulos.Limites.Objetos.$apostaMaxima, val),
                    },
                    {
                        nome: "Sequência perdendo",
                        get: () => Modulo.Funcoes.Get.InputNumber(Instancia.Modulos.Limites.Objetos.$sequenciaPerdendo),
                        set: (val) => Modulo.Funcoes.Set.InputNumber(Instancia.Modulos.Limites.Objetos.$sequenciaPerdendo, val),
                    },
                    {
                        nome: "Sequência vencendo",
                        get: () => Modulo.Funcoes.Get.InputNumber(Instancia.Modulos.Limites.Objetos.$sequenciaVencendo),
                        set: (val) => Modulo.Funcoes.Set.InputNumber(Instancia.Modulos.Limites.Objetos.$sequenciaVencendo, val),
                    },
                    {
                        nome: "Enviar e-mail de notificação",
                        get: () => Modulo.Funcoes.Get.Checkbox(Instancia.Modulos.Limites.Objetos.icheckbug_email),
                        set: (val) => Modulo.Funcoes.Set.Checkbox(Instancia.Modulos.Limites.Objetos.icheckbug_email, val),
                    },
                    {
                        nome: "E-mail de notificação",
                        get: () => Modulo.Funcoes.Get.InputText(Instancia.Modulos.Limites.Objetos.$email),
                        set: (val) => Modulo.Funcoes.Set.InputText(Instancia.Modulos.Limites.Objetos.$email, val),
                    },
                ]
            },
            {
                nome: "Espera",
                mapa: [
                    {
                        nome: "Depois de apostas",
                        get: () => Modulo.Funcoes.Get.InputNumber(Instancia.Modulos.Espera.Objetos.$apostaQuantidadeVezes),
                        set: (val) => Modulo.Funcoes.Set.InputNumber(Instancia.Modulos.Espera.Objetos.$apostaQuantidadeVezes, val),
                    },
                    {
                        nome: "Depois de apostas esperar",
                        get: () => Modulo.Funcoes.Get.InputNumber(Instancia.Modulos.Espera.Objetos.$apostaQuantidadeTempo),
                        set: (val) => Modulo.Funcoes.Set.InputNumber(Instancia.Modulos.Espera.Objetos.$apostaQuantidadeTempo, val),
                    },
                    {
                        nome: "Depois de sequência perdendo",
                        get: () => Modulo.Funcoes.Get.InputNumber(Instancia.Modulos.Espera.Objetos.$sequenciaPerdendoVezes),
                        set: (val) => Modulo.Funcoes.Set.InputNumber(Instancia.Modulos.Espera.Objetos.$sequenciaPerdendoVezes, val),
                    },
                    {
                        nome: "Depois de sequência perdendo esperar",
                        get: () => Modulo.Funcoes.Get.InputNumber(Instancia.Modulos.Espera.Objetos.$sequenciaPerdendoTempo),
                        set: (val) => Modulo.Funcoes.Set.InputNumber(Instancia.Modulos.Espera.Objetos.$sequenciaPerdendoTempo, val),
                    },
                    {
                        nome: "Depois de sequência vencendo",
                        get: () => Modulo.Funcoes.Get.InputNumber(Instancia.Modulos.Espera.Objetos.$sequenciaVencendoVezes),
                        set: (val) => Modulo.Funcoes.Set.InputNumber(Instancia.Modulos.Espera.Objetos.$sequenciaVencendoVezes, val),
                    },
                    {
                        nome: "Depois de sequência vencendo esperar",
                        get: () => Modulo.Funcoes.Get.InputNumber(Instancia.Modulos.Espera.Objetos.$sequenciaVencendoTempo),
                        set: (val) => Modulo.Funcoes.Set.InputNumber(Instancia.Modulos.Espera.Objetos.$sequenciaVencendoTempo, val),
                    },
                    {
                        nome: "Variar tempo",
                        get: () => Modulo.Funcoes.Get.Checkbox(Instancia.Modulos.Espera.Objetos.icheckbug_variador),
                        set: (val) => Modulo.Funcoes.Set.Checkbox(Instancia.Modulos.Espera.Objetos.icheckbug_variador, val),
                    },
                    {
                        nome: "Variar tempo com percentual",
                        get: () => Modulo.Funcoes.Get.InputNumber(Instancia.Modulos.Espera.Objetos.$variador),
                        set: (val) => Modulo.Funcoes.Set.InputNumber(Instancia.Modulos.Espera.Objetos.$variador, val),
                    },
                ]
            },
            {
                nome: "Seed",
                mapa: [
                    {
                        nome: "Segundos",
                        get: () => Modulo.Funcoes.Get.InputNumber(Instancia.Modulos.Seed.Objetos.$tempo),
                        set: (val) => Modulo.Funcoes.Set.InputNumber(Instancia.Modulos.Seed.Objetos.$tempo, val),
                    },
                    {
                        nome: "Apostas",
                        get: () => Modulo.Funcoes.Get.InputNumber(Instancia.Modulos.Seed.Objetos.$apostas),
                        set: (val) => Modulo.Funcoes.Set.InputNumber(Instancia.Modulos.Seed.Objetos.$apostas, val),
                    },
                    {
                        nome: "Sequência Perdendo",
                        get: () => Modulo.Funcoes.Get.InputNumber(Instancia.Modulos.Seed.Objetos.$sequenciaPerdendo),
                        set: (val) => Modulo.Funcoes.Set.InputNumber(Instancia.Modulos.Seed.Objetos.$sequenciaPerdendo, val),
                    },
                    {
                        nome: "Sequência Vencendo",
                        get: () => Modulo.Funcoes.Get.InputNumber(Instancia.Modulos.Seed.Objetos.$sequenciaVencendo),
                        set: (val) => Modulo.Funcoes.Set.InputNumber(Instancia.Modulos.Seed.Objetos.$sequenciaVencendo, val),
                    },
                    {
                        nome: "Modo",
                        get: () => Modulo.Funcoes.Get.Select(Instancia.Modulos.Seed.Objetos.$modo),
                        set: (val) => Modulo.Funcoes.Set.Select(Instancia.Modulos.Seed.Objetos.$modo, val, false),
                    },
                    {
                        nome: "Seed",
                        get: () => Instancia.Modulos.Seed.Objetos.$modo.val() === 'customizado' ? Modulo.Funcoes.Get.InputText(Instancia.Modulos.Seed.Objetos.$seed) : null,
                        set: (val) => Instancia.Modulos.Seed.Objetos.$modo.val() === 'customizado' ? Modulo.Funcoes.Set.InputText(Instancia.Modulos.Seed.Objetos.$seed, val) : null,
                    },
                ]
            },
            {
                nome: "BOT Martin",
                mapa: [
                    {
                        nome: "Meta de saldo",
                        get: () => Modulo.Funcoes.Get.InputNumber(Instancia.Modulos.MartinBot.Objetos.$saldoMeta, Instancia.LuckygamesIo.Parametros.Balance()),
                        set: (val) => Modulo.Funcoes.Set.InputNumber(Instancia.Modulos.MartinBot.Objetos.$saldoMeta, val),
                    },
                    {
                        nome: "Arriscar %",
                        get: () => Modulo.Funcoes.Get.InputNumber(Instancia.Modulos.MartinBot.Objetos.$arriscar),
                        set: (val) => Modulo.Funcoes.Set.InputNumber(Instancia.Modulos.MartinBot.Objetos.$arriscar, val),
                    },
                    {
                        nome: "Prediction",
                        get: () => Modulo.Funcoes.Get.InputNumber(Instancia.Modulos.MartinBot.Objetos.$prediction),
                        set: (val) => Modulo.Funcoes.Set.InputNumber(Instancia.Modulos.MartinBot.Objetos.$prediction, val),
                    },
                    {
                        nome: "Aposta inicial por perdas",
                        get: () => Instancia.Modulos.MartinBot.Objetos.$apostaPerdas.hasClass('ativo') ? Modulo.Funcoes.Get.InputNumber(Instancia.Modulos.MartinBot.Objetos.$apostaPerdas) : null,
                        set: (val) => Modulo.Funcoes.Set.InputNumber(Instancia.Modulos.MartinBot.Objetos.$apostaPerdas, val),
                    },
                    {
                        nome: "Aposta inicial por percentual",
                        get: () => Instancia.Modulos.MartinBot.Objetos.$apostaPorcento.hasClass('ativo') ? Modulo.Funcoes.Get.InputNumber(Instancia.Modulos.MartinBot.Objetos.$apostaPorcento) : null,
                        set: (val) => Modulo.Funcoes.Set.InputNumber(Instancia.Modulos.MartinBot.Objetos.$apostaPorcento, val),
                    },
                    {
                        nome: "Aposta inicial por valor",
                        get: () => Instancia.Modulos.MartinBot.Objetos.$apostaValor.hasClass('ativo') ? Modulo.Funcoes.Get.InputNumber(Instancia.Modulos.MartinBot.Objetos.$apostaValor, Instancia.LuckygamesIo.Parametros.Balance()) : null,
                        set: (val) => Modulo.Funcoes.Set.InputNumber(Instancia.Modulos.MartinBot.Objetos.$apostaValor, val),
                    },
                    {
                        nome: "Evitar apostas",
                        get: () => Modulo.Funcoes.Get.Checkbox(Instancia.Modulos.MartinBot.Objetos.icheckbug_mitigarEvitar),
                        set: (val) => Modulo.Funcoes.Set.Checkbox(Instancia.Modulos.MartinBot.Objetos.icheckbug_mitigarEvitar, val),
                    },
                    {
                        nome: "Evitar apostas se perda for menor",
                        get: () => Modulo.Funcoes.Get.InputNumber(Instancia.Modulos.MartinBot.Objetos.$mitigarEvitarPerdas),
                        set: (val) => Modulo.Funcoes.Set.InputNumber(Instancia.Modulos.MartinBot.Objetos.$mitigarEvitarPerdas, val),
                    },
                    {
                        nome: "Apostar mínimo",
                        get: () => Modulo.Funcoes.Get.Checkbox(Instancia.Modulos.MartinBot.Objetos.icheckbug_mitigarMinimo),
                        set: (val) => Modulo.Funcoes.Set.Checkbox(Instancia.Modulos.MartinBot.Objetos.icheckbug_mitigarMinimo, val),
                    },
                    {
                        nome: "Apostar mínimo após perdas",
                        get: () => Modulo.Funcoes.Get.InputNumber(Instancia.Modulos.MartinBot.Objetos.$mitigarMinimoPerdas),
                        set: (val) => Modulo.Funcoes.Set.InputNumber(Instancia.Modulos.MartinBot.Objetos.$mitigarMinimoPerdas, val),
                    },
                    {
                        nome: "Apostar mínimo por vezes",
                        get: () => Modulo.Funcoes.Get.InputNumber(Instancia.Modulos.MartinBot.Objetos.$mitigarMinimoVezes),
                        set: (val) => Modulo.Funcoes.Set.InputNumber(Instancia.Modulos.MartinBot.Objetos.$mitigarMinimoVezes, val),
                    },
                    {
                        nome: "Esperar",
                        get: () => Modulo.Funcoes.Get.Checkbox(Instancia.Modulos.MartinBot.Objetos.icheckbug_mitigarEspera),
                        set: (val) => Modulo.Funcoes.Set.Checkbox(Instancia.Modulos.MartinBot.Objetos.icheckbug_mitigarEspera, val),
                    },
                    {
                        nome: "Esperar após perdas",
                        get: () => Modulo.Funcoes.Get.InputNumber(Instancia.Modulos.MartinBot.Objetos.$mitigarEsperaPerdas),
                        set: (val) => Modulo.Funcoes.Set.InputNumber(Instancia.Modulos.MartinBot.Objetos.$mitigarEsperaPerdas, val),
                    },
                    {
                        nome: "Esperar por millisegundos",
                        get: () => Modulo.Funcoes.Get.InputNumber(Instancia.Modulos.MartinBot.Objetos.$mitigarEsperaTempo),
                        set: (val) => Modulo.Funcoes.Set.InputNumber(Instancia.Modulos.MartinBot.Objetos.$mitigarEsperaTempo, val),
                    },
                    {
                        nome: "Desistir",
                        get: () => Modulo.Funcoes.Get.Checkbox(Instancia.Modulos.MartinBot.Objetos.icheckbug_mitigarDesistir),
                        set: (val) => Modulo.Funcoes.Set.Checkbox(Instancia.Modulos.MartinBot.Objetos.icheckbug_mitigarDesistir, val),
                    },
                    {
                        nome: "Desistir após perdas",
                        get: () => Modulo.Funcoes.Get.InputNumber(Instancia.Modulos.MartinBot.Objetos.$mitigarDesistirPerdas),
                        set: (val) => Modulo.Funcoes.Set.InputNumber(Instancia.Modulos.MartinBot.Objetos.$mitigarDesistirPerdas, val),
                    },
                    {
                        nome: "Após desistir",
                        get: () => Modulo.Funcoes.Get.Select(Instancia.Modulos.MartinBot.Objetos.$mitigarDesistirModo),
                        set: (val) => Modulo.Funcoes.Set.Select(Instancia.Modulos.MartinBot.Objetos.$mitigarDesistirModo, val),
                    },
                    {
                        nome: "Desistir e recomeçar em millisegundos",
                        get: () => Modulo.Funcoes.Get.InputNumber(Instancia.Modulos.MartinBot.Objetos.$mitigarDesistirTempo),
                        set: (val) => Modulo.Funcoes.Set.InputNumber(Instancia.Modulos.MartinBot.Objetos.$mitigarDesistirTempo, val),
                    },
                    {
                        nome: "Parar ao zerar",
                        get: () => Modulo.Funcoes.Get.Checkbox(Instancia.Modulos.MartinBot.Objetos.icheckbug_mitigarInterromperZerar),
                        set: (val) => Modulo.Funcoes.Set.Checkbox(Instancia.Modulos.MartinBot.Objetos.icheckbug_mitigarInterromperZerar, val),
                    },
                    {
                        nome: "Parar ao zerar por vezes",
                        get: () => Modulo.Funcoes.Get.InputNumber(Instancia.Modulos.MartinBot.Objetos.$mitigarInterromperZerar),
                        set: (val) => Modulo.Funcoes.Set.InputNumber(Instancia.Modulos.MartinBot.Objetos.$mitigarInterromperZerar, val),
                    },
                    {
                        nome: "Inverter prediction",
                        get: () => Modulo.Funcoes.Get.Checkbox(Instancia.Modulos.MartinBot.Objetos.icheckbug_mitigarInverter),
                        set: (val) => Modulo.Funcoes.Set.Checkbox(Instancia.Modulos.MartinBot.Objetos.icheckbug_mitigarInverter, val),
                    },
                    {
                        nome: "Inverter prediction após perdas",
                        get: () => Modulo.Funcoes.Get.InputNumber(Instancia.Modulos.MartinBot.Objetos.$mitigarInverterPerdas),
                        set: (val) => Modulo.Funcoes.Set.InputNumber(Instancia.Modulos.MartinBot.Objetos.$mitigarInverterPerdas, val),
                    },
                    {
                        nome: "Recomeçar em caso de erro",
                        get: () => Modulo.Funcoes.Get.Checkbox(Instancia.Modulos.MartinBot.Objetos.icheckbug_mitigarContinuar),
                        set: (val) => Modulo.Funcoes.Set.Checkbox(Instancia.Modulos.MartinBot.Objetos.icheckbug_mitigarContinuar, val),
                    },
                    {
                        nome: "Recomeçar em caso de erro após millisegundos",
                        get: () => Modulo.Funcoes.Get.InputNumber(Instancia.Modulos.MartinBot.Objetos.$mitigarContinuarTempo),
                        set: (val) => Modulo.Funcoes.Set.InputNumber(Instancia.Modulos.MartinBot.Objetos.$mitigarContinuarTempo, val),
                    },
                ]
            },
            {
                nome: "BOT Crazy",
                mapa: [
                    {
                        nome: "Prediction",
                        get: () => Modulo.Funcoes.Get.Radio(Instancia.Modulos.CrazyBot.Objetos.icheckbug_prediction),
                        set: (val) => Modulo.Funcoes.Set.Radio(Instancia.Modulos.CrazyBot.Objetos.icheckbug_prediction, val),
                    },
                    {
                        nome: "Valor arriscado",
                        get: () => Modulo.Funcoes.Get.InputNumber(Instancia.Modulos.CrazyBot.Objetos.$arriscado, Instancia.LuckygamesIo.Parametros.Balance()),
                        set: (val) => Modulo.Funcoes.Set.InputNumber(Instancia.Modulos.CrazyBot.Objetos.$arriscado, val),
                    },
                    {
                        nome: "Lucro mínimo %",
                        get: () => Modulo.Funcoes.Get.InputNumber(Instancia.Modulos.CrazyBot.Objetos.$lucro),
                        set: (val) => Modulo.Funcoes.Set.InputNumber(Instancia.Modulos.CrazyBot.Objetos.$lucro, val),
                    },
                    {
                        nome: "Continuar",
                        get: () => Modulo.Funcoes.Get.Checkbox(Instancia.Modulos.CrazyBot.Objetos.icheckbug_loop),
                        set: (val) => Modulo.Funcoes.Set.Checkbox(Instancia.Modulos.CrazyBot.Objetos.icheckbug_loop, val),
                    },
                    {
                        nome: "Continuar até saldo",
                        get: () => Modulo.Funcoes.Get.InputNumber(Instancia.Modulos.CrazyBot.Objetos.$loopAlvo, Instancia.LuckygamesIo.Parametros.Balance()),
                        set: (val) => Modulo.Funcoes.Set.InputNumber(Instancia.Modulos.CrazyBot.Objetos.$loopAlvo, val),
                    },
                ]
            },
            {
                nome: "BOT Raw",
                mapa: [
                    {
                        nome: "Meta de saldo",
                        get: () => Modulo.Funcoes.Get.InputNumber(Instancia.Modulos.RawBot.Objetos.componenteQuantoArriscar$SaldoMeta, Instancia.LuckygamesIo.Parametros.Balance()),
                        set: (val) => Modulo.Funcoes.Set.InputNumber(Instancia.Modulos.RawBot.Objetos.componenteQuantoArriscar$SaldoMeta, val),
                    },
                    {
                        nome: "Arriscar %",
                        get: () => Modulo.Funcoes.Get.InputNumber(Instancia.Modulos.RawBot.Objetos.componenteQuantoArriscar$Arriscar, 100),
                        set: (val) => Modulo.Funcoes.Set.InputNumber(Instancia.Modulos.RawBot.Objetos.componenteQuantoArriscar$Arriscar, val),
                    },
                    {
                        nome: "Prediction",
                        get: () => Modulo.Funcoes.Get.InputNumber(Instancia.Modulos.RawBot.Objetos.$prediction),
                        set: (val) => Modulo.Funcoes.Set.InputNumber(Instancia.Modulos.RawBot.Objetos.$prediction, val),
                    },
                    {
                        nome: "Multiplicador",
                        get: () => Modulo.Funcoes.Get.InputNumber(Instancia.Modulos.RawBot.Objetos.$multiplicador),
                        set: (val) => Modulo.Funcoes.Set.InputNumber(Instancia.Modulos.RawBot.Objetos.$multiplicador, val),
                    },
                    {
                        nome: "Perdas",
                        get: () => Modulo.Funcoes.Get.InputNumber(Instancia.Modulos.RawBot.Objetos.$perdas),
                        set: (val) => Modulo.Funcoes.Set.InputNumber(Instancia.Modulos.RawBot.Objetos.$perdas, val),
                    },
                    {
                        nome: "Niveis",
                        get: () => Modulo.Funcoes.Get.InputNumber(Instancia.Modulos.RawBot.Objetos.$niveis),
                        set: (val) => Modulo.Funcoes.Set.InputNumber(Instancia.Modulos.RawBot.Objetos.$niveis, val),
                    },
                    {
                        nome: "Sequencia",
                        get: () => Modulo.Funcoes.Get.InputText(Instancia.Modulos.RawBot.Objetos.$sequencia),
                        set: (val) => Modulo.Funcoes.Set.InputText(Instancia.Modulos.RawBot.Objetos.$sequencia, val),
                    },
                    {
                        nome: "Risco após perda",
                        get: () => Modulo.Funcoes.Get.Checkbox(Instancia.Modulos.RawBot.Objetos.icheckbug_mitigarRiscoTemporario),
                        set: (val) => Modulo.Funcoes.Set.Checkbox(Instancia.Modulos.RawBot.Objetos.icheckbug_mitigarRiscoTemporario, val),
                    },
                    {
                        nome: "Risco após perda, percentual",
                        get: () => Modulo.Funcoes.Get.InputNumber(Instancia.Modulos.RawBot.Objetos.$mitigarRiscoTemporarioRisco),
                        set: (val) => Modulo.Funcoes.Set.InputNumber(Instancia.Modulos.RawBot.Objetos.$mitigarRiscoTemporarioRisco, val),
                    },
                    {
                        nome: "Risco após perda, tempo",
                        get: () => Modulo.Funcoes.Get.InputNumber(Instancia.Modulos.RawBot.Objetos.$mitigarRiscoTemporarioTempo),
                        set: (val) => Modulo.Funcoes.Set.InputNumber(Instancia.Modulos.RawBot.Objetos.$mitigarRiscoTemporarioTempo, val),
                    },
                    {
                        nome: "Continuar mesmo após zerar",
                        get: () => Modulo.Funcoes.Get.Checkbox(Instancia.Modulos.RawBot.Objetos.icheckbug_mitigarContinuarAoZerar),
                        set: (val) => Modulo.Funcoes.Set.Checkbox(Instancia.Modulos.RawBot.Objetos.icheckbug_mitigarContinuarAoZerar, val),
                    },
                    {
                        nome: "Turbo aleatório",
                        get: () => Modulo.Funcoes.Get.Checkbox(Instancia.Modulos.RawBot.Objetos.icheckbug_mitigarTurboAleatorio),
                        set: (val) => Modulo.Funcoes.Set.Checkbox(Instancia.Modulos.RawBot.Objetos.icheckbug_mitigarTurboAleatorio, val),
                    },
                    {
                        nome: "Turbo aleatório, 1 em quantos",
                        get: () => Modulo.Funcoes.Get.InputNumber(Instancia.Modulos.RawBot.Objetos.$turboAleatorio),
                        set: (val) => Modulo.Funcoes.Set.InputNumber(Instancia.Modulos.RawBot.Objetos.$turboAleatorio, val),
                    },
                    {
                        nome: "Turbo risco",
                        get: () => Modulo.Funcoes.Get.InputNumber(Instancia.Modulos.RawBot.Objetos.$turboRiscoTemporarioRisco),
                        set: (val) => Modulo.Funcoes.Set.InputNumber(Instancia.Modulos.RawBot.Objetos.$turboRiscoTemporarioRisco, val),
                    },
                    {
                        nome: "Turbo tempo",
                        get: () => Modulo.Funcoes.Get.InputNumber(Instancia.Modulos.RawBot.Objetos.$turboRiscoTemporarioTempo),
                        set: (val) => Modulo.Funcoes.Set.InputNumber(Instancia.Modulos.RawBot.Objetos.$turboRiscoTemporarioTempo, val),
                    },
                    {
                        nome: "Botao de risco, limite",
                        get: () => Modulo.Funcoes.Get.InputNumber(Instancia.Modulos.RawBot.Objetos.$pulsarLimite, Instancia.LuckygamesIo.Parametros.Balance()),
                        set: (val) => Modulo.Funcoes.Set.InputNumber(Instancia.Modulos.RawBot.Objetos.$pulsarLimite, val),
                    },
                ]
            },
        ];

        Modulo.Funcoes = {
            Formatar: (val) => {
                if (typeof(val) === 'string' && val.replace(/[0-9]+[,\.]?[0-9]*/, "") === '') {
                    val = parseFloat(val.replace(',', '.'));
                } else if (typeof(val) === 'number') {
                    val = val.toFixed(8);
                    while (val.length > 0 && val[val.length - 1] == '0') {
                        val = val.substr(0, val.length - 1);
                    }
                    if (val.length > 0 && val[val.length - 1] == '.') {
                        val = val.substr(0, val.length - 1);
                    }
                    val = String(parseFloat(val)) == val ? parseFloat(val) : val;
                }
                if (val === null) {
                    val = "";
                }
                return val;
            },
            Get: {
                Select: (obj) => Modulo.Funcoes.Formatar(obj.val()),
                Checkbox: (obj) => Modulo.Funcoes.Formatar(obj.o.checked),
                Radio: (obj) => {
                    for (let i = 0; i < obj.o.length; i++) {
                        if (obj.o[i].checked) {
                            return Modulo.Funcoes.Formatar(obj.o[i].value);
                        }                        
                    }
                    return Modulo.Funcoes.Formatar(null);
                },
                InputText: (obj) => Modulo.Funcoes.Formatar(obj.val()),
                InputNumber: (obj, baseParaPercentual) => {
                    let result = obj.get(0).number();
                    if (result !== null && baseParaPercentual > 0) {
                        result = ((result / baseParaPercentual) * 100).toFixed(2);
                        while (result.length && result[result.length - 1] === '0') {
                            result = result.substr(0, result.length - 1);
                        }
                        if (result.length && result[result.length - 1] === '.') {
                            result = result.substr(0, result.length - 1);
                        }
                        result = (result.length ? result : "0") + '%';
                    } 

                    return Modulo.Funcoes.Formatar(result);
                },
            },
            Set: {
                Select: (obj, val, triggerChange = true) => {
                    val = String(val);
                    
                    const valBkp = obj.val();
                    obj.val(val);
                    if (obj.val() !== null) {
                        obj.niceSelect('update');
                        if (triggerChange) {
                            obj.trigger('change');
                        }
                    } else {
                        obj.val(valBkp);
                    }
                },
                Checkbox: (obj, val) => {
                    val = typeof(val) === 'string' ? val : String(!!val);

                    if (val === 'true') {
                        obj.$.iCheck('check');
                    } else {
                        obj.$.iCheck('uncheck');
                    }
                },
                Radio: (obj, val) => {
                    val = String(val);

                    for (let i = 0; i < obj.o.length; i++) {
                        $(obj.o[i]).iCheck(obj.o[i].value == val ? 'check' : 'uncheck');
                    }
                },
                InputText: (obj, val, triggerChange = true) => {
                    obj.val(String(val));

                    if (triggerChange) {
                        obj.change();
                    }
                },
                InputNumber: (obj, val) => {
                    val = String(val) + " ";

                    obj.val(val).blur();
                },
            }
        },
        
        Modulo.Parametros = {
            Padrao: null,
            JsonToArrayString: (json) => {
                const result = [];

                const modulos = Object.keys(json);
                for (let i = 0; i < modulos.length; i++) {
                    const modulo = modulos[i];
                    const parametros = Object.keys(json[modulo]);
                    for (let j = 0; j < parametros.length; j++) {
                        const parametro = parametros[j];
                        const valor = String(json[modulo][parametro]);
                        result.push("{modulo} [ {parametro} ] = {valor}".replace("{modulo}", modulo).replace("{parametro}", parametro).replace("{valor}", valor));
                    }                    
                }

                return result.length === 0 ? '' : result.length === 1 ? result[0] : result;
            },
            ArrayStringToJson: (str) => {
                str = Array.isArray(str) ? str : [String(str)];
                const result = {};

                for (let i = 0; i < str.length; i++) {
                    const instrucao = str[i];
                    const modulo = instrucao.substring(0, instrucao.indexOf("[")).trim();
                    const parametro = instrucao.substring(instrucao.indexOf("[") + 1, instrucao.indexOf("]")).trim();
                    let valor = instrucao.substring(instrucao.indexOf("=") + 1).trim();
                    valor = valor === 'null' ? null : valor;

                    result[modulo] = result[modulo] ? result[modulo] : { };
                    result[modulo][parametro] = valor;
                }

                return result;
            },
            LerDaTela: () => {
                const result = { };

                for (let i = 0; i < Modulo.Mapa.length; i++) {
                    const modulo = Modulo.Mapa[i].nome;
                    const mapa = Modulo.Mapa[i].mapa;

                    const obj = result[modulo] = { };

                    for (let j = 0; j < mapa.length; j++) {
                        const parametro = mapa[j].nome;
                        const valor = mapa[j].get();

                        obj[parametro] = valor;
                    }
                }

                return result;
            },
            AplicarNaTela: (json, aplicandoPadrao = false) => {
                if (typeof(json) !== 'object') {
                    try {
                        json = JSON.parse(json);
                    }
                    catch (ex) {
                        Instancia.Geral.Toast('O script não é válido e não pode ser aplicado.', 'error');
                        return;
                    }
                }

                const aplicarPadrao = Modulo.Objetos.icheckbug_aplicarPadrao.o.checked;
                if (aplicarPadrao && !aplicandoPadrao) {
                    Modulo.Parametros.AplicarNaTela(Modulo.Parametros.Padrao, true);
                }

                const getObj = (nome, container) => {
                    container = container ? container : Modulo.Mapa;
                    for (let i = 0; i < container.length; i++) {
                        if (container[i].nome == nome) {
                            return container[i];
                        }                        
                    }
                    return null;
                }

                const modulos = Object.keys(json);
                for (let i = 0; i < modulos.length; i++) {
                    const moduloNome = modulos[i];
                    const moduloJson = json[moduloNome];
                    const parametros = Object.keys(moduloJson);
                    const modulo = getObj(moduloNome);
                    for (let j = 0; modulo && j < parametros.length; j++) {
                        const parametroNome = parametros[j];
                        const parametroValor = moduloJson[parametroNome];
                        const parametro = getObj(parametroNome, modulo.mapa);
                        
                        if (parametro !== null && parametroValor !== null) {
                            parametro.set(parametroValor);
                        }
                    }
                }

                Instancia.Geral.Toast('Os parâmetros da tela foram definidos conforme o script.', 'info');
            }
        };

    })();
}