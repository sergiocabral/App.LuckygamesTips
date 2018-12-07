window.Tips = window.Tips || {};
if (window.Tips.Modulos) {

    window.Tips.Modulos.RawBot = window.Tips.Modulos.RawBot || new (function() {

        const Instancia = window.Tips;
        const Modulo = this;

        Modulo.Inicializar = () => {
            Instancia.BotConstrutor.ImplementarLigaDesliga(Modulo, Modulo.Parametros.Processar);
            Instancia.Layout.AdicionarSecao(Modulo.Secao);
        };

        Modulo.Objetos = { };

        Modulo.Secao = { 
            versao: 'v1',

            titulo: 'BOT Raw',

            css: `
                {componenteQuantoArriscar}
            `
            .replace('{componenteQuantoArriscar}', Instancia.BotConstrutor.ComponenteQuantoArriscar(Modulo, 'css')),

            html: `
                <p class="info">
                    BOT customizado via código-fonte.
                </p>
                {componenteQuantoArriscar}
                <div class="divisor"></div>
                <table class="config">
                    <tr>
                        <td>
                            Parans
                        </td>
                    </tr>
                </table>
            `
            .replace('{componenteQuantoArriscar}', Instancia.BotConstrutor.ComponenteQuantoArriscar(Modulo, 'html')),

            js: (container, secaoId) => {
                const param = Modulo.Parametros;
                
                const componenteQuantoArriscar = Instancia.BotConstrutor.ComponenteQuantoArriscar(Modulo, 'js');
                if (componenteQuantoArriscar instanceof Function) { componenteQuantoArriscar(container, secaoId); }
            },

            atualizarExibicao: () => {
                const param = Modulo.Parametros;

                const componenteQuantoArriscar = Instancia.BotConstrutor.ComponenteQuantoArriscar(Modulo, 'atualizarExibicao');
                if (componenteQuantoArriscar instanceof Function) { componenteQuantoArriscar(); }
                
                param.log();        
            },
        };

        Modulo.Parametros = {
            estado: null,
            apostas: null,
            saldoInicial: null,
            saldoAtual: null,
            param: null,
            ultimaAposta: null,            
            perdas: null,
            arriscar: null,
            limitePerdas: null,

            log: (estado) => {
                const param = Modulo.Parametros;

                param.atualizar();
                
                if (typeof(estado) === 'string') param.estado = estado;

                let log = {
                    "Estado": String(param.estado).toUpperCase(),
                    "Apostas": param.apostas.slice(0, 12).reduce((a, c) => a + (c > 0 ? "+" + c : c) + "|", "|"),
                    "Saldo inicial": param.saldoInicial.toFixed(8),
                    "Saldo atual": param.saldoAtual.toFixed(8),
                    "Lucro": "% " + (param.lucro >= 0 ? "+" : "") + param.lucro.toFixed(8),
                    "Última aposta": (!Number.isFinite(param.ultimaAposta) ? 0.00000001 : param.ultimaAposta).toFixed(8),
                    "Limite de perda": param.limitePerdas > 0 ? param.limitePerdas : "—",
                    "Perda atual": param.perdas > 0 ? param.perdas : "—",
                };
                Modulo.Componentes.LigaDesliga.Log(log);
            },

            atualizar: (reset = false) => {
                const param = Modulo.Parametros;
                if (reset || param.estado === null) {
                    if (param.apostas) param.apostas.length = 0;
                    else param.apostas = [];
                    param.apostas.push(0);
                    param.ultimaAposta = null;
                    param.perdas = 0;
                    param.arriscar = false;
                    Instancia.Modulos.RawBot.Objetos.componenteQuantoArriscar$Arriscar.blur();
                }
                if (param.estado === null) {
                    param.estado = "desligado";
                    param.saldoInicial = Modulo.Componentes.QuantoArriscar.saldo;
                }
                param.saldoAtual = Modulo.Componentes.QuantoArriscar.saldo;
                param.lucro = 100 * (param.saldoAtual / param.saldoInicial - 1);
            },

            random: (min, max) => {
                return parseInt(Math.random() * (++max - min) + min);
            },

            Processar: () => {
                return new Promise(resolve => {
                    const param = Modulo.Parametros;
                    
                    if (param.estado !== "ligado") param.atualizar(true);
                    
                    const sequencia = 3; //sequência perdendo
                    const perdendo = 4; //por quantas vezes sequências perdendo é maior que o valor acima.
                    if (param.apostas.length >= 10 && !param.ultimaAposta) { 
                        if (param.apostas[0] > 0) {
                            let valido = true;
                            for (let i = 0; i < perdendo; i++) valido = valido & param.apostas[i * 2 + 1] <= -Math.abs(sequencia);
                            if (valido) {                                
                                param.limitePerdas = param.random(7, 12); //perda maxima sem zerar
                                param.ultimaAposta = Instancia.BotConstrutor.CalcularApostaValor(param.limitePerdas, Modulo.Componentes.QuantoArriscar.arriscado, 50);
                            }
                        }
                    } else if (param.ultimaAposta) {
                        param.ultimaAposta *= 2;
                        if (++param.perdas >= param.limitePerdas) {
                            Modulo.Parametros.log("perdeu");
                            Modulo.Componentes.LigaDesliga.Status('desligar');
                            Instancia.Geral.Audio('warning');
                            param.atualizar(true);
                            resolve(true);
                            return;
                        }
                    } else if (param.arriscar) {
                        param.limitePerdas = param.random(9, 16);
                        param.ultimaAposta = Instancia.BotConstrutor.CalcularApostaValor(param.limitePerdas, Modulo.Componentes.QuantoArriscar.arriscado, 50);
                    }

                    const aposta = param.ultimaAposta ? param.ultimaAposta : 0.00000001;

                    param.log("ligado");

                    Instancia.LuckygamesIo.Apostar(aposta.toFixed(8), 'over', 50).then((response) => {                        
                        let finalizado = aposta == 0.00000001;

                        if (response.gameResult === 'win') {
                            if (param.apostas[0] >= 0) param.apostas[0]++;
                            else param.apostas.unshift(1);                            
                            if (param.ultimaAposta) param.atualizar(true);
                            else if (Math.abs(param.apostas[1]) >= sequencia / 3 && parseInt(Math.random() * 100) % 2 == 0) param.arriscar = true;
                        } else if (response.gameResult === 'lose') {
                            if (param.apostas[0] <= 0) param.apostas[0]--;
                            else param.apostas.unshift(-1);
                        }

                        if (Modulo.Componentes.QuantoArriscar.meta && Modulo.Componentes.QuantoArriscar.saldo >= Modulo.Componentes.QuantoArriscar.meta) {
                            Modulo.Parametros.log("desligado");
                            Modulo.Componentes.LigaDesliga.Status('desligar');
                            Instancia.Geral.Audio('limit-good');                            
                            finalizado = true;
                        }

                        resolve(finalizado);
                    }).catch(err => {
                        console.log("Erro: ", err);
                        Modulo.Componentes.LigaDesliga.Status('pausar');
                    });
                });
            },
        };
        
   })();
}