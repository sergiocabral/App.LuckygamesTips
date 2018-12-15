namespace Skript.Business.Layout.Components.Toast {

    /**
     * Janela base que contem outros componentes.
     */
    export class Toast extends Base<Framework.Layout.Components.EmptyProps, State> {

        /**
         * Carrega e aplica os estilos css.
         */
        public css(): string {
            return `
                @keyframes Toast-Slide {
                    100% { left: 0; }
                }
                ${this.classNameSelector()} {
                    z-index: 996;
                    position: fixed;
                    bottom: ${this.theme.spacing}px;
                    left: ${this.theme.spacing}px;
                    width: 40%;
                    max-width: 400px;
                }
                ${this.classNameSelector()} p {
                    background-color: #272823;
                    color: lightgrey;
                    padding: 6px 20px 6px 10px;
                    margin: 6px 0 0 0;
                    border-radius: 3px;
                    position: relative;
                    left: -110%;
                    animation: Toast-Slide 0.5s forwards;
                    transition: opacity 0.25s linear;
                    box-shadow: 0 0 10px black;
                }
                ${this.classNameSelector()} p.closing {
                    opacity: 0;
                }
                ${this.classNameSelector()} p.${Framework.Log.Level[Framework.Log.Level.Information]} {
                    background-color: #015D88;
                    color: lightgrey;
                }
                ${this.classNameSelector()} p.${Framework.Log.Level[Framework.Log.Level.Warning]} {
                    background-color: #CB5A00;
                    color: lightgrey;
                }
                ${this.classNameSelector()} p.${Framework.Log.Level[Framework.Log.Level.Error]} {
                    background-color: #E61A23;
                    color: lightgrey;
                }
                ${this.classNameSelector()} p .text {
                    display: block;
                    margin-bottom: ${this.theme.spacing}px;
                }
                ${this.classNameSelector()} p .text:after {
                    content: " ";
                    display: inline-block;
                }
                ${this.classNameSelector()} p .time {
                    display: block;
                    font-size: 70%;
                    float: right;
                    margin: -12px -14px 0 0;
                    opacity: 0.75;
                }
                ${this.classNameSelector()} p a {
                    color: ${Framework.Util.Drawing.blend(0.0, this.theme.dialogTitleBackgroundColor)};
                    text-shadow: 0 0 10px ${Framework.Util.Drawing.blend(0.5, this.theme.dialogTitleBackgroundColor)};
                    float: right;
                    cursor: pointer;
                    margin: -5px -14px 0 0;
                    text-decoration: none;
                }
                ${this.classNameSelector()} p a:hover {
                    color: ${Framework.Util.Drawing.blend(0.2, this.theme.dialogTitleBackgroundColor)};
                    text-shadow: 0 0 3px ${Framework.Util.Drawing.blend(0.5, this.theme.dialogTitleBackgroundColor)};
                }
            `;
        }

        /**
         * Construtor.
         * @param {Framework.Layout.Components.EmptyProps} props Propriedades.
         */
        public constructor(props: Framework.Layout.Components.EmptyProps) {
            super(props);

            this.state = { messages: { } };

            this.onCloseClick = this.onCloseClick.bind(this);

            this.toCaptureOff.push(Framework.Bus.Message.capture(Framework.Messages.DidLogPosted, this, this.onDidLogPosted));
        }
        
        /**
         * Tempo para remoção automática.
         */
        private removeInterval: number = 10000;

        /**
         * Constrole de auto remove.
         */
        private removeTimeout: Framework.Types.Index<NodeJS.Timeout> = { };

        /**
         * Adiciona uma mensagem
         * @param {string} text Mensagem.
         * @param {Framework.Log.Level} level Nível.
         * @param {Date} time Data e hora.
         * @param {boolean} remove Opcional. Indica se deve ser removida automaticamente.
         */
        private add(text: string, level: Framework.Log.Level, time: Date, remove: boolean = true): void {
            const id = text.hash();

            if (this.removeTimeout[id]) clearTimeout(this.removeTimeout[id]);

            const messages = this.state.messages;
            messages[id] = {
                text: text,
                level: level,
                time: time,
                removed: false
            }

            this.setState({ messages: messages });

            if (remove)
                this.removeTimeout[id] = 
                    setTimeout(() => this.remove(text), this.removeInterval);
        }

        /**
         * Remove uma mensagem em exibição.
         * @param text Mensagem.
         */
        private remove(text: string): void {
            const id = text.hash();
            
            if (this.removeTimeout[id]) clearTimeout(this.removeTimeout[id]);

            const messages = this.state.messages;
            if (!messages[id]) return;

            messages[id].removed = true;
            this.removeTimeout[id] = setTimeout(() => {
                const messages = this.state.messages;
                delete messages[id];
                delete this.removeTimeout[id];
                this.setState({ messages: messages });
            }, 250);

            this.setState({ messages: messages });
        }

        /**
         * Mensagem: ao se postar nova mensagem no log.
         * @param {Framework.Messages.DidLogPosted} message Mensagem.
         */
        private onDidLogPosted(message: Framework.Messages.DidLogPosted): void {
            if (message.log.level === Framework.Log.Level.Debug ||
                message.log.level === Framework.Log.Level.Verbose) return;
            this.add(message.log.text, message.log.level, message.log.time);
        }

        /**
         * Posta uma mensagem para exibição.
         * @param {string} text Texto.
         * @param {Framework.Log.Level} level Nível da mensagem.
         */
        public post(text: string, level: Framework.Log.Level = Framework.Log.Level.Information): void {
            this.add(text.translate(), level, new Date());
        }

        /**
         * Quando o botão fechar é acionado.
         * @param {any} evt Informações sobre o evento.
         */
        private onCloseClick(evt: any): void {
            let element = Framework.Util.DOM.parentWithTag(evt.target, "P");
            if (!element) return;
            element = element.querySelector(".text");
            if (!element) return;
            this.remove(element.innerHTML);
        }

        /**
         * Renderizador do React.
         * @returns {JSX.Element}
         */
        public render(): JSX.Element { super.render();
            return (
                <div id={this.id} className={this.classNameAttribute()}>
                    {Object.keys(this.state.messages).map((message) => (
                        <p key={message} className={Framework.Log.Level[this.state.messages[message].level] + (this.state.messages[message].removed ? " closing" : "")}>
                            <a href="#" className="no-underline" onClick={this.onCloseClick}>&times;</a>
                            <span className="text">{this.state.messages[message].text}</span>
                            <span className="time">{this.state.messages[message].time.format()}</span>
                        </p>
                    ))}
                </div>
            );
        }
    }
}
