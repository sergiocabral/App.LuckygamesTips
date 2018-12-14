namespace Skript.Part.User.LuckygamesAdjusts {

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

            this.myMessageBus.push(new LuckygamesAdjustsBus(this));

            this.title = "Website adjusts";
            this.icon = "fas fa-check-double";

            this.elOptionWebsocket = React.createRef();
            this.elOptionAnimation = React.createRef();
            this.elOptionTheme = React.createRef();

            const messageWebSocket = new Luckygames.Message.GetWebSocketMode().sendSync();
            if (!messageWebSocket.result) throw new Core.Errors.NullNotExpected("Message.GetWebSocketMode.result");            
            this.valueOptionWebsocket = messageWebSocket.result.mode;

            const messageAnimation = new Luckygames.Message.GetAnimationMode().sendSync();
            if (!messageAnimation.result) throw new Core.Errors.NullNotExpected("Message.GetAnimationMode.result");
            this.valueOptionAnimation = messageAnimation.result.mode;

            const messageTheme = new Luckygames.Message.GetThemeMode().sendSync();
            if (!messageTheme.result) throw new Core.Errors.NullNotExpected("Message.GetThemeMode.result");            
            this.valueOptionTheme = messageTheme.result.mode;

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
         * Opção: Theme
         * @type {React.RefObject<Adjusts>}
         */
        private elOptionTheme: React.RefObject<Adjusts>;

        /**
         * Valor para option: Websocket.
         * @type {string}
         */
        private valueOptionWebsocket: Luckygames.WebSocketMode;

        /**
         * Valor para option: Animation.
         * @type {string}
         */
        private valueOptionAnimation: Core.OffOn;

        /**
         * Valor para option: Theme.
         * @type {string}
         */
        private valueOptionTheme: Luckygames.ThemeMode;
        
        /**
         * Definir valor de propriedade.
         * @param {Luckygames.WebSocketMode} mode Modo WebSocket.
         */
        public setOptionWebsocket(mode: Luckygames.WebSocketMode): void {
            if (!this.elOptionWebsocket.current) return;
            this.valueOptionWebsocket = mode;
            this.elOptionWebsocket.current.uncheckedAll();
            this.elOptionWebsocket.current.value(Luckygames.WebSocketMode[mode], true);
        }
        
        /**
         * Definir valor de propriedade.
         * @param {Core.OffOn} mode Modo Animation.
         */
        public setOptionAnimation(mode: Core.OffOn): void {
            if (!this.elOptionAnimation.current) return;
            this.valueOptionAnimation = mode;
            this.elOptionAnimation.current.uncheckedAll();
            this.elOptionAnimation.current.value(Core.OffOn[mode], true);
        }
        
        /**
         * Definir valor de propriedade.
         * @param {Luckygames.ThemeMode} mode Modo Theme.
         */
        public setOptionTheme(mode: Luckygames.ThemeMode): void {
            if (!this.elOptionTheme.current) return;
            this.valueOptionTheme = mode;
            this.elOptionTheme.current.uncheckedAll();
            this.elOptionTheme.current.value(Luckygames.ThemeMode[mode], true);
        }

        /**
         * Rwgistra os parâmetros deste componenete.
         */
        private registerParameters(): any {
            this.parameters = !this.title ? undefined : Automation.Parameters.getInstance(
                this.title,
                [
                    new Automation.Parameter<string>("Data updates", 
                        () => Luckygames.WebSocketMode[this.valueOptionWebsocket],
                        (value: string) => {
                            const setted = value === Luckygames.WebSocketMode[Luckygames.WebSocketMode[value as any] as any as Luckygames.WebSocketMode];
                            if (setted) this.onAdjustChange({
                                key: "websocket",
                                value: [ { key: value, value: this.translate(value), state: true } ]
                            });
                            return setted;
                        }),
                    new Automation.Parameter<string>("Animations", 
                        () => Core.OffOn[this.valueOptionAnimation],
                        (value: string) => {
                            const setted = value === Core.OffOn[Core.OffOn[value as any] as any as Core.OffOn];
                            if (setted) this.onAdjustChange({
                                key: "animation",
                                value: [ { key: value, value: this.translate(value), state: true } ]
                            });
                            return setted;
                        }),
                    new Automation.Parameter<string>("Theme", 
                        () => Luckygames.ThemeMode[this.valueOptionTheme],
                        (value: string) => {
                            const setted = value === Luckygames.ThemeMode[Luckygames.ThemeMode[value as any] as any as Luckygames.ThemeMode];
                            if (setted) this.onAdjustChange({
                                key: "theme",
                                value: [ { key: value, value: this.translate(value), state: true } ]
                            });
                            return setted;
                        })
                ]);
        }

        /**
         * Ao alterar o valor de algum ajuste.
         * @param {Core.KeyValue<Core.KeyValue<string>[]>} adjusts Valores definidos.
         */
        private onAdjustChange(adjusts: Core.KeyValue<Core.KeyValue<string>[]>): boolean|undefined {
            if (adjusts.value.length !== 1) throw new Core.Errors.InvalidArgument(`LuckygamesAdjusts.options(${adjusts.key}).length == ${adjusts.value.length}`);
            
            let mode, message;

            switch (adjusts.key) {
                case "websocket":
                    mode = Luckygames.WebSocketMode[adjusts.value[0].key as any] as any as Luckygames.WebSocketMode;
                    message = new Luckygames.Message.SetWebSocketMode(mode).sendSync();
                    if (message.result && message.result.mode !== mode) {
                        this.setOptionWebsocket(message.result.mode);
                        return false;
                    }
                    break;
                case "animation":
                    mode = Core.OffOn[adjusts.value[0].key as any] as any as Core.OffOn;
                    message = new Luckygames.Message.SetAnimationMode(mode).sendSync();
                    if (message.result && message.result.mode !== mode) {
                        this.setOptionAnimation(message.result.mode);
                        return false;
                    }
                    break;
                case "theme":
                    mode = Luckygames.ThemeMode[adjusts.value[0].key as any] as any as Luckygames.ThemeMode;
                    message = new Luckygames.Message.SetThemeMode(mode).sendSync();
                    if (message.result && message.result.mode !== mode) {
                        this.setOptionTheme(message.result.mode);
                        return false;
                    }
                    break;
                default:
                    throw new Core.Errors.InvalidArgument(`LuckygamesAdjusts.options(${adjusts.key})`);
            }

            return;
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
                                { key: Luckygames.WebSocketMode[Luckygames.WebSocketMode.Normal], value: this.translate(Luckygames.WebSocketMode[Luckygames.WebSocketMode.Normal]), state: this.valueOptionWebsocket === Luckygames.WebSocketMode.Normal },
                                { key: Luckygames.WebSocketMode[Luckygames.WebSocketMode.Reduce], value: this.translate(Luckygames.WebSocketMode[Luckygames.WebSocketMode.Reduce]), state: this.valueOptionWebsocket === Luckygames.WebSocketMode.Reduce },
                                { key: Luckygames.WebSocketMode[Luckygames.WebSocketMode.Off], value: this.translate(Luckygames.WebSocketMode[Luckygames.WebSocketMode.Off]), state: this.valueOptionWebsocket === Luckygames.WebSocketMode.Off }
                            ]
                        }}>
                        <p>{this.translate("Receiving global information from luckygames.io, such as Chat, All Bets, High Rollers, Rare Wins, Bets Made, Total Won, etc.")}</p>
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
                                { key: Core.OffOn[Core.OffOn.Off], value: this.translate(Core.OffOn[Core.OffOn.Off]), state: this.valueOptionAnimation === Core.OffOn.Off },
                                { key: Core.OffOn[Core.OffOn.On], value: this.translate(Core.OffOn[Core.OffOn.On]), state: this.valueOptionAnimation === Core.OffOn.On },
                            ]
                        }}>
                        <p>{this.translate("Audiovisual effects on the update of the balance, the Lucky Number type turnstile display, etc.")}</p>
                        <p>{this.translate("Off increases performance by reducing processor and memory consumption on your computer.")}</p>
                    </Adjusts>
                    <Adjusts 
                        ref={this.elOptionTheme}
                        className="adjust"
                        onChange={this.onAdjustChange}
                        exclusive={true}
                        title={this.translate("Theme")}
                        options={{
                            key: "theme",
                            value: [
                                { key: Luckygames.ThemeMode[Luckygames.ThemeMode.Dark], value: this.translate(Luckygames.ThemeMode[Luckygames.ThemeMode.Dark]), state: this.valueOptionTheme === Luckygames.ThemeMode.Dark },
                                { key: Luckygames.ThemeMode[Luckygames.ThemeMode.Light], value: this.translate(Luckygames.ThemeMode[Luckygames.ThemeMode.Light]), state: this.valueOptionTheme === Luckygames.ThemeMode.Light },
                            ]
                        }}>
                        <p>{this.translate("Layout with light or dark visual of the site luckygames.io.")}</p>
                        <p>{this.translate("It is a purely personal choice. Does not interfere with performance.")}</p>
                    </Adjusts>
                </div>
            );
        }

        /**
         * Quando o componente é montado.
         */
        public componentDidMount(): void {
            this.registerParameters();
        }
    }

    new Part("LuckygamesAdjusts", LuckygamesAdjusts);
}