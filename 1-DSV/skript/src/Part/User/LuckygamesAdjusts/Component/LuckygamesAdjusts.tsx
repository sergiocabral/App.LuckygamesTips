namespace Skript.Part.User.LuckygamesAdjusts.Component {

    /**
     * Componente principal do módulo.
     */
    export class LuckygamesAdjusts extends Layout.ReactJs.DialogComponentBase<Layout.ReactJs.EmptyProps, Partial<Layout.ReactJs.EmptyState>> {

        /**
         * Código CSS para este componente.
         */
        protected stylesheet: string = `
            ${this.selector()} {
                position: relative;
                min-height: 150px;
                background-color: red;
                overflow: auto;
            }
            ${this.selectorOutDialog()} {
                max-height: 150px;
            }
            ${this.selectorInDialog()} {
                position: absolute;
                left: 10px;
                top: 10px;
                right: 10px;
                bottom: 10px;
            }
            ${this.selector()} > .adjust {
            }
        `;

        /**
         * Construtor.
         * @param {DialogProps} props Propriedades.
         */
        public constructor(props: Layout.ReactJs.EmptyProps) {
            super(props);      
            
            this.onAdjustChange = this.onAdjustChange.bind(this);

            this.title = this.translate("Luckygames Adjusts");
        }
        
        /**
         * Ao alterar o valor de algum ajuste.
         * @param {Core.KeyValue<Core.KeyValue<string>[]>} adjusts Valores definidos.
         */
        private onAdjustChange(adjusts: Core.KeyValue<Core.KeyValue<string>[]>): void {
            console.log("onAdjustChange", adjusts);
        }

        /**
         * Renderizador do React. Conteúdo do container.
         * @returns {JSX.Element}
         */
        protected renderContent(): JSX.Element {         
            return (
                <div id={this.id()} className={this.className()}>
                    <Adjusts 
                        className="adjust"
                        onChange={this.onAdjustChange}
                        exclusive={true}
                        title="Atualizações de dados"
                        options={{
                            key: "websocket",
                            value: [
                                { key: "normal", value: "Frequência normal" },
                                { key: "reduce", value: "Frequência reduzida" },
                                { key: "off", value: "Desligado" }
                            ]
                        }}>
                        <p>Recebimento de informações globais da luckygames.io, como All Bets, High Rollers, Rare Wins, Bets Made, Total Won, etc.</p>
                        <p>Desativar aumenta a performance por reduzir o consumo de banda de internet.</p>
                    </Adjusts>
                    <Adjusts 
                        className="adjust"
                        onChange={this.onAdjustChange}
                        exclusive={true}
                        title="Atualizações de dados"
                        options={{
                            key: "animation",
                            value: [
                                { key: "on", value: "Ligado" },
                                { key: "off", value: "Desligado" }
                            ]
                        }}>
                        <p>Efeitos áudio visuais na atualização do saldo. Exibição do LuckyNumber tipo roleta giratória.</p>
                        <p>Desativar aumenta a performance por reduzir o consumo de processador e memória do seu computador.</p>
                    </Adjusts>
                    <Adjusts 
                        className="adjust"
                        onChange={this.onAdjustChange}
                        exclusive={true}
                        title="Visual"
                        options={{
                            key: "visual",
                            value: [
                                { key: "dark", value: "Escuro" },
                                { key: "light", value: "Claro" }
                            ]
                        }}>
                        <p>Layout com visual claro ou escuro do site luckygames.io.</p>
                        <p>É uma escolha meramente pessoal. Não interfere na performance.</p>
                    </Adjusts>
                </div>
            );
        }
    }
}