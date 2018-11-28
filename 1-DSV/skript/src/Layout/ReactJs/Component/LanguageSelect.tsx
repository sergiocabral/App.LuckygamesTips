namespace Skript.Layout.ReactJs.Component {

    /**
     * Seleciona o idioma.
     */
    export class LanguageSelect extends ComponentBase<Layout.ReactJs.EmptyProps, Partial<Layout.ReactJs.EmptyState>> {

        /**
         * Código CSS para este componente.
         */
        protected stylesheet: string = `
            ${this.selector()} {
                display: inline-block;
            }
            ${this.selector()} .language {
                display: inline-block;
                border-bottom: 2px solid transparent;
                padding-bottom: 1px;
                margin: 2px 5px;
            }
            ${this.selector()} .language.active {
                border-bottom-color: ${Util.Drawing.blend(0.3, this.theme.dialogTitleBackgroundColor)};
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

            this.myMessageBus.push(new LanguageSelectBus(this));

            this.onClick = this.onClick.bind(this);
        }

        /**
         * Define o idioma neste componente.
         * @param {string} language Idioma
         */
        public setLanguage(language: string): void {
            const all = document.querySelectorAll(`#${this.id()} .language.active`);
            for (let i = 0; i < all.length; i++) all[i].classList.remove("active");

            const defined = document.querySelector(`#${this.id()} .language.${language}`) as HTMLElement;
            defined.classList.add("active");
        }

        /**
         * Quando o botão é pressionado.
         * @param evt Informações do evento.
         */
        private onClick(evt: any) {
            evt.preventDefault();
            const button = evt.target as HTMLElement;
            const parent = button.parentElement as HTMLElement;
            const language = parent.getAttribute("data-language");
            new Locale.Message.SetLanguage(language as string).sendAsync();
        }

        /**
         * Renderizador do React.
         * @returns {JSX.Element}
         */
        public render(): JSX.Element {            
            return (
                <div id={this.id()} className={this.className} title={this.translate("Select language.")}>
                    <span className="language en" data-language="en">
                        <button onClick={this.onClick}>English</button>
                    </span>
                    <span className="language pt" data-language="pt">
                        <button onClick={this.onClick}>Português</button>
                    </span>
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
