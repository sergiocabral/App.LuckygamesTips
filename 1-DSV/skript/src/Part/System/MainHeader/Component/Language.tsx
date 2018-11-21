namespace Skript.Part.System.MainHeader.Component {

    /**
     * Componente principal do módulo.
     */
    export class Language extends Layout.ReactJs.ComponentBase<Layout.ReactJs.EmptyProps, Partial<Layout.ReactJs.EmptyState>> {

        /**
         * Nome da classe CSS deste componente.
         */
        public className: string = 'MainHeader-Language';

        /**
         * Código CSS para este componente.
         */
        public stylesheet: string = `
            ${this.selector()} {
                text-align: right;
                margin: 18px 13px 0 0;
                min-width: 150px;
            }
            ${this.selector()} .language {
                border-bottom: 2px solid transparent;
                padding-bottom: 1px;
                display: inline-block;
                margin-left: 10px;  
                margin-bottom: 2px;         
            }
            ${this.selector()} .language.active {
                border-bottom-color: ${Util.Drawing.blend(0.3, this.theme.dialogTitleBackground)};
            }
            ${this.selector()} button {
                background: transparent;
                color: transparent;
                border: 0;
                cursor: pointer;
                width: 24px;
                background-size: cover;
            }
            ${this.selector()} button:focus {
                outline: none;
            }
            ${this.selector()} .en button {
                background-image: url("${this.theme.url}/media/language-en.png");
            }
            ${this.selector()} .pt button {
                background-image: url("${this.theme.url}/media/language-pt.png");
            }
        `;

        /**
         * Construtor.
         * @param {Layout.ReactJs.EmptyProps} props Propriedades.
         */
        public constructor(props: Layout.ReactJs.EmptyProps) {
            super(props);            

            this.onClick = this.onClick.bind(this);

            this.elMessage = React.createRef();
        }

        /**
         * Mensagem ao usuário.
         * @type {React.RefObject<HTMLElement>}
         */
        private elMessage: React.RefObject<HTMLElement>;

        /**
         * 
         * @param ev Quando o botão é pressionado.
         */
        private onClick(ev: any) {
            const container = document.querySelectorAll(`#${this.id()} .language.active`);
            for (let i = 0; i < container.length; i++) container[i].classList.remove("active");

            const button = ev.target as HTMLElement;
            
            const parent = button.parentElement as HTMLElement;
            parent.classList.add("active");

            const message = this.elMessage.current as HTMLElement;            
            message.innerHTML = parent.classList.contains("original") ? "" : button.getAttribute("data-message") as string;

            const language = button.getAttribute("data-language");
            Core.Bus.MessageBus.Send(new Locale.Message.SetLanguage(language as string));
        }

        /**
         * Renderizador do React.
         * @returns {JSX.Element}
         */
        public render(): JSX.Element {            
            return (
                <div id={this.id()} className={this.className}>
                    <span className="message" ref={this.elMessage as any}></span>
                    <span className="language en"><button 
                        data-language="en" 
                        data-message="Refresh the page to update." 
                        title={this.translate("Select language.")}
                        onClick={this.onClick}
                        >English</button></span>
                    <span className="language pt"><button
                        data-language="pt" 
                        data-message="Atualize a página para atualizar." 
                        title={this.translate("Select language.")}
                        onClick={this.onClick}
                        >Português</button></span>
                </div>
            );
        }

        /**
         * Após componente montado.
         */
        public componentDidMount(): void {
            const language = document.querySelector(`#${this.id()} .language.${this.language()}`) as HTMLElement;
            language.classList.add("original");
            language.classList.add("active");
        }
    }
}
