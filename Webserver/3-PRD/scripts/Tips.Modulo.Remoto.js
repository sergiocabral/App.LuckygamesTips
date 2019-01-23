window.Tips = window.Tips || {};
if (window.Tips.Modulos) {
    window.Tips.Modulos.Remoto = window.Tips.Modulos.Remoto || new (function() {

        const Instancia = window.Tips;
        const Modulo = this;

        Modulo.Inicializar = () => {
            Instancia.Layout.AdicionarSecao(Modulo.Secao);
        };

        Modulo.Objetos = { };

        Modulo.Secao = {
            versao: 'v1',

            titulo: 'Remoto',

            css: `
            :host div {
                width: 100%;
                background-color: black;
                color: lightgreen;
                font-family: monospace;
                white-space: pre;
                height: 150px;
                overflow: auto;
                margin-top: 0;
                border: 1px solid darkgreen;
                padding: 10px;
                width: calc(100% - 33px);
                background-color: darkslategrey;
                margin-left: 5px;
            }
            `,
            html: `<div></div>`,

            js: (container) => {
                Modulo.Objetos.log = container.find("div").get(0);
                Modulo.Escutar();
                window.addEventListener('BotMartinZerou', () => {
                    const saldo = Tips.LuckygamesIo.Parametros.Balance();
                    if (!Number.isFinite(Modulo.Parametros.saldoMinimo) || saldo <= Modulo.Parametros.saldoMinimo) {
                        Modulo.PararTudoNoServidor();
                    }
                });
                Modulo.Log('Iniciada automação pelo servidor.', 'info');
            },
        };

        Modulo.Log = (mensagem, tipo) => {
            if (Modulo.Parametros.ultimoLog == mensagem + tipo) return;
            Modulo.Parametros.ultimoLog = mensagem + tipo;

            const string = `[${new Date().formatado()}] ${mensagem}`;
            Modulo.Objetos.log.innerHTML = string + "\n" + Modulo.Objetos.log.innerHTML;
            Instancia.Geral.Toast(mensagem, tipo);
        };

        Modulo.Config = {
            intervalo: 1000,
            intervaloSemComunicacao: 10000,
            usuario: Tips.LuckygamesIo.Parametros.Usuario().toLowerCase().trim(),
            moeda: Instancia.LuckygamesIo.Parametros.Moeda(),
        };

        Modulo.Escutar = () => {
            if (Modulo.Parametros.parado) return;

            const recarregar = () => Modulo.Parametros.idTimeoutEscuta = setTimeout(Modulo.Escutar, Modulo.Config.intervalo);

            Instancia.Api.Comando('Util/Flag', {}).then(response => {
                try {
                    const dados = response.erro ? null : response.response.dados;
                    if (!dados || typeof(dados) !== 'object') throw new Error('dados incorretos');
                    Modulo.Processar(dados);
                } catch (error) {
                    Modulo.Log('Erro nos dados recebidos do servidor.');
                    console.log("Erro de dados ou lógico:", error);
                }                
                recarregar();
            }).catch(error => {
                Modulo.Log('Erro na conexão com o servidor. ' + error, 'error');
                console.log("Erro de rede:", error);
                recarregar();
            });
        };

        Modulo.PararBots = () => {
            console.logg("Remoto: parar");
            const btn = Instancia.Modulos.MartinBot.Objetos.$btnLigar;
            if (btn.get(0).style.display !== "none") {
                if (btn.text() == "Desligar") btn.click();
                Modulo.Log(`Bot Martin interrompido.`, 'info');
                console.logg("Remoto: parado!");
                return true;
            }
            return false
        }

        Modulo.PararTudo = () => {
            const pararBots = () => {
                if (!Modulo.PararBots()) setTimeout(pararBots, 1000);
                else Modulo.Parametros.processamentoIniciado = false;
            }
            pararBots();
            Modulo.Parametros.parado = true;
            Modulo.Log('Automação foi desligada pelo cliente por falta de comunicação com o servidor.', 'warning');
        }

        Modulo.Processar = dados => {
            clearTimeout(Modulo.Parametros.idTimeoutPararTudo);
            if (dados.parar) {
                Modulo.Log('A automação foi desligada no servidor.', 'warning');
                Modulo.PararTudo();
                return;  
            }
            Modulo.Parametros.idTimeoutPararTudo = setTimeout(Modulo.PararTudo, Modulo.Config.intervaloSemComunicacao);

            const automacao = dados.groups.reduce(
                (a, c) => 
                    a = a == null && !c.ignorar &&
                    c.usuarios.map(v => v.toLowerCase().trim()).indexOf(Modulo.Config.usuario) >= 0 ? 
                    c : a, null);

            if (automacao) {
                if (automacao.saldoMinimo) {
                    let saldoMinimo = parseFloat(String(automacao.saldoMinimo).replace(",", ".")) / 100;
                    saldoMinimo *= Tips.LuckygamesIo.Parametros.Balance();
                    if (!(Modulo.Parametros.saldoMinimo > saldoMinimo)) Modulo.Parametros.saldoMinimo = saldoMinimo;
                }
                if (automacao.relatorio) Modulo.EnviarRelatorio();
                if (automacao.atualizar) {
                    location.reload();
                    Modulo.Log("Atualizando página.", "warning");
                    Modulo.Parametros.parado = true;
                    return;
                }
                if (automacao.moeda.toLowerCase() != Modulo.Config.moeda.toLowerCase()) {
                    location.href = location.origin + "?coin=" + automacao.moeda.toLowerCase();
                    Modulo.Log("Trocando moedas. Atualizando página.", "warning");
                    Modulo.Parametros.parado = true;
                    return;
                }
                Modulo.Parametros.id = automacao.id;
                if (automacao.mensagem && automacao.mensagem !== Modulo.Parametros.ultimaMensagem) {
                    Modulo.Parametros.ultimaMensagem = automacao.mensagem;
                    Modulo.Log("SERVIDOR DIZ: " + automacao.mensagem, 'info');
                }
                if (automacao.script) {
                    const scriptStr = JSON.stringify(automacao.script);
                    if (automacao.ligado && (scriptStr != Modulo.Parametros.ultimoScript || !Modulo.Parametros.processamentoIniciado)) {
                        Modulo.Parametros.ultimoScript = scriptStr;
                        const json = Instancia.Modulos.Parametros.Parametros.ArrayStringToJson(automacao.script);
                        Instancia.Modulos.Parametros.Parametros.AplicarNaTela(json);
                        if (!Modulo.Parametros.processamentoIniciado) {                        
                            Instancia.Modulos.Parametros.Comandos.AbrirJanela();
                            //Instancia.Modulos.Parametros.Comandos.LigarBotMarin();
                            Instancia.Modulos.Parametros.Comandos.LigarBotRatwo();
                            Instancia.Modulos.Parametros.Comandos.AbrirEstatisticas();
                            Modulo.Parametros.processamentoIniciado = true;
                        }
                        console.logg("Remoto: aplicado script");
                    } else if (!automacao.ligado && Modulo.Parametros.processamentoIniciado) {
                        if (Modulo.PararBots()) {
                            Modulo.Parametros.ultimoScript = "";
                            Modulo.Parametros.processamentoIniciado = false;
                        }
                    }
                    console.logg("Remoto: loop");
                }
            }
        };

        Modulo.Parametros = {
            idTimeoutEscuta: 0,
            idTimeoutPararTudo: 0,
            parado: false,
            ultimaMensagem: "",
            processamentoIniciado: false,
            id: null,
            ultimoRelatorio: null,
            saldoMinimo: null,
        };

        Modulo.PararTudoNoServidor = () => {
            if (Modulo.Parametros.processamentoIniciado && Modulo.Parametros.id) {
                Instancia.Api.Comando('Util/Flag/Desligar', { data: { id: Modulo.Parametros.id } });

                const assunto = 'Luckygames.tips - Controle remoto parado';
                const mensagem = Instancia.Geral.FormatarString(
                    'Usuário: <strong>{0}</strong><br/>Moeda: <strong>{1}</strong><br/>Saldo atual: <strong>{2}</strong><br/><br/>Esta instância solicitou parada do controle remoto "<strong>{3}</strong>".', 
                    Instancia.LuckygamesIo.Parametros.Usuario(), 
                    Instancia.LuckygamesIo.Parametros.Moeda(), 
                    Instancia.Estatisticas.Dados.Formatado.SaldoAtual(),
                    Modulo.Parametros.id);

                Instancia.Api.Email(Instancia.Api.Licenca().email, assunto, mensagem).then((data) => { 
                    if (!data || !data.sucesso || !data.response || data.response.erro) {
                        const erro = data && data.response && data.response.mensagem ? ': ' + data.response.mensagem : '.';
                        Instancia.Geral.Toast('Ocorreu um erro ao enviar o e-mail de notificação' + erro, 'error');
                    }
                    else {
                        Instancia.Geral.Toast(`Um e-mail foi enviado informado que foi solicitada a parada do controle remoto "${Modulo.Parametros.id}".`, 'info');
                    }
                });
            }
        };

        Modulo.EnviarRelatorio = () => {
            const saldo = Tips.LuckygamesIo.Parametros.Balance();
            
            if (saldo == Modulo.Parametros.ultimoRelatorio) return;

            Modulo.Parametros.ultimoRelatorio = saldo;

            console.logg("Remoto: enviando relatório");
            Instancia.Api.Comando('Util/Flag/Relatorio/Enviar', { data: { 
                usuario: Instancia.LuckygamesIo.Parametros.Usuario(),
                saldo: Instancia.Estatisticas.Dados.Formatado.SaldoAtual(),
                moeda: Instancia.LuckygamesIo.Parametros.Moeda(),
                percentual: Tips.Modulos.Estatisticas.Objetos.lucroApostasPercentual.innerText
            }}).catch(error => {
                Modulo.Parametros.ultimoRelatorio = "";
                Modulo.Log("Erro ao enviar relatório. " + error);
            });
        }

    })();
}