namespace Skript.Layout.ReactJs.Component {

    /**
     * Dados de uma mensagem de exibição.
     */
    type MessageWrapper = {

        /**
         * Identificador único.
         * @type {string}
         */
        id: string,

        /**
         * Mensagem de log
         * @type {Core.Log.Message}
         */
        message: Core.Log.Message

        /**
         * Id do timeout ativo que vai remover a mensagem.
         * @type {number}
         */
        idTimeoutRemove?: NodeJS.Timeout,
    }

    /**
     * Janela base que contem outros componentes.
     */
    export class ShowMessages extends ComponentBase<EmptyProps, Partial<EmptyState>> {

        /**
         * Código CSS para este componente.
         */
        public stylesheet: string = `
            @keyframes slide {
                100% { left: 0; }
            }
            ${this.selector()} .closing {
                visibility: hidden;
                opacity: 0;
                transition: visibility 0s 0.25s, opacity 0.25s linear;
            }
            ${this.selector()} {
                z-index: ${this.theme.zIndex * 2};
                position: fixed;
                bottom: 10px;
                left: 10px;
                width: 40%;                
            }
            ${this.selector()} p {
                background-color: #272823;
                color: lightgrey;
                padding: 6px 20px 6px 10px;
                margin: 6px 0 0 0;
                border-radius: 3px;
                position: relative;
                left: -110%;
                animation: slide 0.5s forwards;
                box-shadow: 0 0 10px black;
            }
            ${this.selector()} p.${Core.Log.Level[Core.Log.Level.Information]} {
                background-color: #015D88;
                color: lightgrey;
            }            
            ${this.selector()} p.${Core.Log.Level[Core.Log.Level.Warning]} {
                background-color: #E96227;
                color: lightgrey;
            }            
            ${this.selector()} p.${Core.Log.Level[Core.Log.Level.Error]} {
                background-color: #E61A23;
                color: lightgrey;
            }
            ${this.selector()} p .text {
                display: block;
                margin-bottom: 10px;
            }
            ${this.selector()} p .time {
                display: block;
                font-size: 70%;
                float: right;
                margin: -12px -14px 0 0;
                opacity: 0.75;
            }
            ${this.selector()} p a {
                color: ${Util.Drawing.blend(0.0, this.theme.dialogTitleBackground)};
                text-shadow: 0 0 10px ${Util.Drawing.blend(0.5, this.theme.dialogTitleBackground)};
                float: right;
                cursor: pointer;
                margin-right: -10px;
                text-decoration: none;
            }
            ${this.selector()} p a:hover {
                color: ${Util.Drawing.blend(0.2, this.theme.dialogTitleBackground)};
                text-shadow: 0 0 3px ${Util.Drawing.blend(0.5, this.theme.dialogTitleBackground)};
            }
        `;

        /**
         * Construtor.
         * @param {EmptyProps} props Propriedades.
         */
        public constructor(props: EmptyProps) {
            super(props);

            this.onCloseClick = this.onCloseClick.bind(this);
            
            this.messages = { };
        }
        
        /**
         * Lista de mensagens.
         * @type {{[key:string]: MessageWrapper}}
         */
        private messages: {[key:string]: MessageWrapper};

        /**
         * Posta uma mensagem para exibição.
         * @param {Core.Log.Message} message Mensagem
         */
        public post(message: Core.Log.Message): void {
            const messageWrapper: MessageWrapper = {
                id: Util.String.random(),
                message: message                
            }
            messageWrapper.idTimeoutRemove = setTimeout(() => this.remove(messageWrapper.id), 5000);
            this.messages[messageWrapper.id] = messageWrapper;
            this.setState({ });
        }

        /**
         * Remove uma mensagem
         * @param {string} id Identificador
         */
        private remove(id: string): void {
            clearTimeout(this.messages[id].idTimeoutRemove as NodeJS.Timeout);

            setTimeout(() => {
                delete this.messages[id];
                this.setState({  });
            }, 300 /* intervalo da animação */);

            const element = document.querySelector(`#${this.id()} p[data-id="${id}"]`) as HTMLElement;
            element.classList.add("closing");
        }

        /**
         * Quando o botão fechar é acionado.
         */
        private onCloseClick(ev: any): void {
            const button = ev.target as HTMLElement;
            const message = button.parentElement as HTMLElement;
            
            this.remove(message.getAttribute("data-id") as string);
        }

        /**
         * Renderizador do React.
         * @returns {JSX.Element}
         */
        public render(): JSX.Element {
            return (
                <div id={this.id()} className={this.className}>
                    {Object.values(this.messages).map((v) => (
                        <p key={v.id} data-id={v.id} className={Core.Log.Level[v.message.level]}>
                            <a href="#" className="no-underline" onClick={this.onCloseClick}>&times;</a>                            
                            <span className="text">{v.message.text}</span>
                            <span className="time">{v.message.time.format({})}</span>
                        </p>
                    ))}
                </div>
            );
        }
    }
}
