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
            }
            ${this.selectorInDialog()} {
                position: absolute;
                left: ${this.theme.spacing}px;
                top: ${this.theme.spacing}px;
                right: ${this.theme.spacing}px;
                bottom: ${this.theme.spacing}px;
                overflow: auto;
            }
            ${this.selector()} > .adjust {
                display: inline-block;
            }
        `;

        /**
         * Construtor.
         * @param {DialogProps} props Propriedades.
         */
        public constructor(props: Layout.ReactJs.EmptyProps) {
            super(props);      

            this.title = this.translate("Website adjusts");
            this.icon = "far fa-list-alt";

            this.elOptionWebsocket = React.createRef();
            this.elOptionAnimation = React.createRef();
            this.elOptionVisual = React.createRef();

            this.onAdjustChange = this.onAdjustChange.bind(this);
        }

        /**
         * Opção: Websocket
         * @type {React.RefObject<Adjusts>}
         */
        private elOptionWebsocket: React.RefObject<Adjusts>;

        /**
         * Opção: Animation
         * @type {React.RefObject<Adjusts>}
         */
        private elOptionAnimation: React.RefObject<Adjusts>;

        /**
         * Opção: Visual
         * @type {React.RefObject<Adjusts>}
         */
        private elOptionVisual: React.RefObject<Adjusts>;
        
        /**
         * Ao alterar o valor de algum ajuste.
         * @param {Core.KeyValue<Core.KeyValue<string>[]>} adjusts Valores definidos.
         */
        private onAdjustChange(adjusts: Core.KeyValue<Core.KeyValue<string>[]>): void {
            if (adjusts.value.length !== 1) throw new Core.Errors.InvalidArgument(`LuckygamesAdjusts.options(${adjusts.key}).length == ${adjusts.value.length}`);
            
            switch (adjusts.key) {
                case "websocket":
                    switch (adjusts.value[0].key) {
                        case "normal": 
                            Luckygames.WebSocketControl.mode(Luckygames.WebSocketMode.Normal);
                            break;
                        case "reduce": 
                            Luckygames.WebSocketControl.mode(Luckygames.WebSocketMode.Reduce);
                            break;
                        case "off": 
                            Luckygames.WebSocketControl.mode(Luckygames.WebSocketMode.Off);
                            break;
                        default:
                            throw new Core.Errors.InvalidArgument(`LuckygamesAdjusts.options(${adjusts.key})(${adjusts.value[0].key})`);
                    }
                    break;
                case "animation":
                    break;
                case "visual":
                    break;
                default:
                    throw new Core.Errors.InvalidArgument(`LuckygamesAdjusts.options(${adjusts.key})`);
            }
        }

        /**
         * Renderizador do React. Conteúdo do container.
         * @returns {JSX.Element}
         */
        protected renderContent(): JSX.Element {         
            return (
                <div id={this.id()} className={this.className()}>
                    <Adjusts 
                        ref={this.elOptionWebsocket}
                        className="adjust"
                        onChange={this.onAdjustChange}
                        exclusive={true}
                        title={this.translate("Data updates")}
                        options={{
                            key: "websocket",
                            value: [
                                { key: "normal", value: this.translate("Normal frequency"), state: true },
                                { key: "reduce", value: this.translate("Reduced frequency") },
                                { key: "off", value: this.translate("Off") }
                            ]
                        }}>
                        <p>{this.translate("Receiving global information from luckygames.io, such as All Bets, High Rollers, Rare Wins, Bets Made, Total Won, etc.")}</p>
                        <p>{this.translate("Off increases performance by reducing internet bandwidth consumption.")}</p>
                    </Adjusts>
                    <Adjusts 
                        ref={this.elOptionAnimation}
                        className="adjust"
                        onChange={this.onAdjustChange}
                        exclusive={true}
                        title={this.translate("Animations")}
                        options={{
                            key: "animation",
                            value: [
                                { key: "on", value: this.translate("On"), state: true },
                                { key: "off", value: this.translate("Off") }
                            ]
                        }}>
                        <p>{this.translate("Audiovisual effects on the update of the balance, the Lucky Number type turnstile display, etc.")}</p>
                        <p>{this.translate("Off increases performance by reducing processor and memory consumption on your computer.")}</p>
                    </Adjusts>
                    <Adjusts 
                        ref={this.elOptionVisual}
                        className="adjust"
                        onChange={this.onAdjustChange}
                        exclusive={true}
                        title={this.translate("Theme")}
                        options={{
                            key: "visual",
                            value: [
                                { key: "dark", value: this.translate("Dark"), state: true },
                                { key: "light", value: this.translate("Light") }
                            ]
                        }}>
                        <p>{this.translate("Layout with light or dark visual of the site luckygames.io.")}</p>
                        <p>{this.translate("It is a purely personal choice. Does not interfere with performance.")}</p>
                    </Adjusts>
                </div>
            );
        }
    }
}