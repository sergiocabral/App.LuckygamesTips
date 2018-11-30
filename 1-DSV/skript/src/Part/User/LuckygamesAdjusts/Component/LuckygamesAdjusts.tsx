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
            }
            ${this.selectorOutDialog()} {
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
         * @param {Core.KeyValue<any>} djust Ajuste acionado.
         * @param {Core.KeyValue<any>} value Valor definido.
         */
        private onAdjustChange(adjust: Core.KeyValue<any>, value: Core.KeyValue<any>): void {
            console.log("onAdjustChange", adjust, value);
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
                        title="Atualizações de dados"
                        options={{
                            "receiveData": [
                                { "normal": "Frequência normal" },
                                { "reduce": "Frequência reduzida" },
                                { "off": "Desligado" }
                            ]
                        }}>
                        <p>Recebimento de informações globais da luckygames.io, como All Bets, High Rollers, Rare Wins, Bets Made, Total Won, etc.</p>
                        <p>Desativar aumenta a performance por reduzir o consumo de banda de internet.</p>
                    </Adjusts>
                    <Adjusts 
                        className="adjust"
                        onChange={this.onAdjustChange}
                        title="Atualizações de dados"
                        options={{
                            "receiveData": [
                                { "on": "Ligado" },
                                { "off": "Desligado" }
                            ]
                        }}>
                        <p>Efeitos áudio visuais na atualização do saldo. Exibição do LuckyNumber tipo roleta giratória.</p>
                        <p>Desativar aumenta a performance por reduzir o consumo de processador e memória do seu computador.</p>
                    </Adjusts>
                    <Adjusts 
                        className="adjust"
                        onChange={this.onAdjustChange}
                        title="Visual"
                        options={{
                            "receiveData": [
                                { "dark": "Escuro" },
                                { "light": "Claro" }
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