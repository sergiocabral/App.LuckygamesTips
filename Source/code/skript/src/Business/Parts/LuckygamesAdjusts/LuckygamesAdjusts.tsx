namespace Skript.Business.Parts.LuckygamesAdjusts {

    /**
     * Componente principal do módulo.
     */
    export class LuckygamesAdjusts extends Layout.Components.DialogHeader.Content {

        /**
         * Carrega e aplica os estilos css.
         */
        public css(): string {
            return `
                ${this.classNameSelector()} {
                    position: relative;
                }
                ${this.classNameSelectorInDialog()} {
                    position: absolute;
                    left: ${this.theme.spacing}px;
                    top: ${this.theme.spacing}px;
                    right: ${this.theme.spacing}px;
                    bottom: ${this.theme.spacing}px;
                    overflow: auto;
                }
                ${this.classNameSelector()} > .adjust {
                    display: inline-block;
                }
            `;
        }

        /**
         * Construtor.
         * @param {Framework.Layout.Components.EmptyProps} props Propriedades.
         */
        public constructor(props: Framework.Layout.Components.EmptyProps) {
            super(props);

            this.title = "Website adjusts";
            this.icon = "fas fa-check-double";

            this.elOptionWebsocket = React.createRef();
            this.elOptionAnimation = React.createRef();
            this.elOptionTheme = React.createRef();

            this.toCaptureOff.push(Framework.Bus.Message.capture(Luckygames.Messages.DidWebSocketModeSetted, this, this.onDidWebSocketModeSetted));
            const valueOptionWebsocket = new Luckygames.Messages.GetWebSocketMode().request().mode;
            if (valueOptionWebsocket === undefined) throw new Framework.Errors.EmptyValue("Messages.GetWebSocketMode.mode");
            this.valueOptionWebsocket = valueOptionWebsocket;

            this.toCaptureOff.push(Framework.Bus.Message.capture(Luckygames.Messages.DidAnimationSetted, this, this.onDidAnimationSetted));
            const valueOptionAnimation = new Luckygames.Messages.GetAnimation().request().mode;
            if (valueOptionAnimation === undefined) throw new Framework.Errors.EmptyValue("Messages.GetAnimation.mode");
            this.valueOptionAnimation = valueOptionAnimation;

            this.toCaptureOff.push(Framework.Bus.Message.capture(Luckygames.Messages.DidThemeSetted, this, this.onDidThemeSetted));
            const valueOptionTheme = new Luckygames.Messages.GetTheme().request().mode;
            if (valueOptionTheme === undefined) throw new Framework.Errors.EmptyValue("Messages.GetTheme.mode");
            this.valueOptionTheme = valueOptionTheme;

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
         * @type {Framework.Types.OffOn}
         */
        private valueOptionAnimation: Framework.Types.OffOn;

        /**
         * Valor para option: Theme.
         * @type {string}
         */
        private valueOptionTheme: Luckygames.ThemeMode;

        /**
         * Mensagem: Ao definir WebSocketMode
         * @param {Luckygames.Messages.DidWebSocketModeSetted} message Mensagem
         */
        private onDidWebSocketModeSetted(message: Luckygames.Messages.DidWebSocketModeSetted): void {
            this.setOptionWebsocket(message.mode);
        }

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
         * Mensagem: Ao definir Animation
         * @param {Luckygames.Messages.DidAnimationSetted} message Mensagem
         */
        private onDidAnimationSetted(message: Luckygames.Messages.DidAnimationSetted): void {
            this.setOptionAnimation(message.mode);
        }

        /**
         * Definir valor de propriedade.
         * @param {Framework.Types.OffOn} mode Modo Animation.
         */
        public setOptionAnimation(mode: Framework.Types.OffOn): void {
            if (!this.elOptionAnimation.current) return;
            this.valueOptionAnimation = mode;
            this.elOptionAnimation.current.uncheckedAll();
            this.elOptionAnimation.current.value(Framework.Types.OffOn[mode], true);
        }

        /**
         * Mensagem: Ao definir Theme
         * @param {Luckygames.Messages.DidThemeSetted} message Mensagem
         */
        private onDidThemeSetted(message: Luckygames.Messages.DidThemeSetted): void {
            this.setOptionTheme(message.mode);
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
         * Adiciona ações e parâmetros para automação deste componente.
         * @param {Framework.Types.Index<Framework.Types.Parameter<any>>} parameters Parâmetros.
         * @param {Framework.Types.Index<Framework.Types.Action>} actions Ações.
         * @returns {string} Nome do módulo.
         */
        protected configureAutomation(parameters: Framework.Types.Index<Framework.Types.Parameter<any>>): string {
            let parameter: Framework.Types.Parameter<string>;

            parameter = {
                name: "DataUpdates",
                get: (): string => Luckygames.WebSocketMode[this.valueOptionWebsocket],
                set: (value: string): boolean => {
                    const setted = value === Luckygames.WebSocketMode[Luckygames.WebSocketMode[value as any] as any as Luckygames.WebSocketMode];
                    if (setted) this.onAdjustChange({
                        key: "websocket",
                        value: [ { key: value, value: value.translate(), state: true } ]
                    });
                    return setted;
                }
            };
            parameters[parameter.name] = parameter;

            parameter = {
                name: "Animations",
                get: (): string => Framework.Types.OffOn[this.valueOptionAnimation],
                set: (value: string): boolean => {
                    const setted = value === Framework.Types.OffOn[Framework.Types.OffOn[value as any] as any as Framework.Types.OffOn];
                    if (setted) this.onAdjustChange({
                        key: "animation",
                        value: [ { key: value, value: value.translate(), state: true } ]
                    });
                    return setted;
                }
            };
            parameters[parameter.name] = parameter;

            parameter = {
                name: "Theme",
                get: (): string => Luckygames.ThemeMode[this.valueOptionTheme],
                set: (value: string): boolean => {
                    const setted = value === Luckygames.ThemeMode[Luckygames.ThemeMode[value as any] as any as Luckygames.ThemeMode];
                    if (setted) this.onAdjustChange({
                        key: "theme",
                        value: [ { key: value, value: value.translate(), state: true } ]
                    });
                    return setted;
                }
            };
            parameters[parameter.name] = parameter;

            return "LuckygamesAdjusts";
        }

        /**
         * Ao alterar o valor de algum ajuste.
         * @param {Framework.Types.KeyValue<Framework.Types.KeyValue<string>[]>} adjusts Valores definidos.
         */
        private onAdjustChange(adjusts: Framework.Types.KeyValue<Framework.Types.KeyValue<string>[]>): boolean|undefined {
            if (adjusts.value.length !== 1) throw new Framework.Errors.InvalidArgument(`LuckygamesAdjusts.options(${adjusts.key}).length == ${adjusts.value.length}`);

            let mode, modeNew;

            switch (adjusts.key) {
                case "websocket":
                    mode = Luckygames.WebSocketMode[adjusts.value[0].key as any] as any as Luckygames.WebSocketMode;
                    modeNew = new Luckygames.Messages.DoSetWebSocketMode(mode).request().mode;
                    if (mode !== modeNew) {
                        this.setOptionWebsocket(modeNew);
                        return false;
                    }
                    break;
                case "animation":
                    mode = Framework.Types.OffOn[adjusts.value[0].key as any] as any as Framework.Types.OffOn;
                    modeNew = new Luckygames.Messages.DoSetAnimation(mode).request().mode;
                    if (mode !== modeNew) {
                        this.setOptionAnimation(modeNew);
                        return false;
                    }
                    break;
                case "theme":
                    mode = Luckygames.ThemeMode[adjusts.value[0].key as any] as any as Luckygames.ThemeMode;
                    modeNew = new Luckygames.Messages.DoSetTheme(mode).request().mode;
                    if (mode !== modeNew) {
                        this.setOptionTheme(modeNew);
                        return false;
                    }
                    break;
                default:
                    throw new Framework.Errors.InvalidArgument(`LuckygamesAdjusts.options(${adjusts.key})`);
            }

            return;
        }

        /**
         * Renderizador do React. Conteúdo do container.
         * @returns {JSX.Element}
         */
        protected renderContent(): JSX.Element {
            return (
                <div id={this.id} className={this.classNameAttribute()}>
                    <Adjusts
                        ref={this.elOptionWebsocket}
                        className="adjust"
                        onChange={this.onAdjustChange}
                        exclusive={true}
                        title={"Data updates".translate()}
                        options={{
                            key: "websocket",
                            value: [
                                { key: Luckygames.WebSocketMode[Luckygames.WebSocketMode.Normal], value: Luckygames.WebSocketMode[Luckygames.WebSocketMode.Normal].translate(), state: this.valueOptionWebsocket === Luckygames.WebSocketMode.Normal },
                                { key: Luckygames.WebSocketMode[Luckygames.WebSocketMode.Reduce], value: Luckygames.WebSocketMode[Luckygames.WebSocketMode.Reduce].translate(), state: this.valueOptionWebsocket === Luckygames.WebSocketMode.Reduce },
                                { key: Luckygames.WebSocketMode[Luckygames.WebSocketMode.Off], value: Luckygames.WebSocketMode[Luckygames.WebSocketMode.Off].translate(), state: this.valueOptionWebsocket === Luckygames.WebSocketMode.Off }
                            ]
                        }}>
                        <p>{"Receiving global information from luckygames.io, such as Chat, All Bets, High Rollers, Rare Wins, Bets Made, Total Won, etc.".translate()}</p>
                        <p>{"Off increases performance by reducing internet bandwidth consumption.".translate()}</p>
                    </Adjusts>
                    <Adjusts
                        ref={this.elOptionAnimation}
                        className="adjust"
                        onChange={this.onAdjustChange}
                        exclusive={true}
                        title={"Animations".translate()}
                        options={{
                            key: "animation",
                            value: [
                                { key: Framework.Types.OffOn[Framework.Types.OffOn.Off], value: Framework.Types.OffOn[Framework.Types.OffOn.Off].translate(), state: this.valueOptionAnimation === Framework.Types.OffOn.Off },
                                { key: Framework.Types.OffOn[Framework.Types.OffOn.On], value: Framework.Types.OffOn[Framework.Types.OffOn.On].translate(), state: this.valueOptionAnimation === Framework.Types.OffOn.On },
                            ]
                        }}>
                        <p>{"Audiovisual effects on the update of the balance, the Lucky Number type turnstile display, etc.".translate()}</p>
                        <p>{"Off increases performance by reducing processor and memory consumption on your computer.".translate()}</p>
                    </Adjusts>
                    <Adjusts
                        ref={this.elOptionTheme}
                        className="adjust"
                        onChange={this.onAdjustChange}
                        exclusive={true}
                        title={"Theme".translate()}
                        options={{
                            key: "theme",
                            value: [
                                { key: Luckygames.ThemeMode[Luckygames.ThemeMode.Dark], value: Luckygames.ThemeMode[Luckygames.ThemeMode.Dark].translate(), state: this.valueOptionTheme === Luckygames.ThemeMode.Dark },
                                { key: Luckygames.ThemeMode[Luckygames.ThemeMode.Light], value: Luckygames.ThemeMode[Luckygames.ThemeMode.Light].translate(), state: this.valueOptionTheme === Luckygames.ThemeMode.Light },
                            ]
                        }}>
                        <p>{"Layout with light or dark visual of the site luckygames.io.".translate()}</p>
                        <p>{"It is a purely personal choice. Does not interfere with performance.".translate()}</p>
                    </Adjusts>
                </div>
            );
        }
    }

    Base.toAppendToMainDialog.push(LuckygamesAdjusts);
}