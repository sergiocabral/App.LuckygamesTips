namespace Skript.Business.Parts.Header {

    /**
     * Componente: seleção de igioma.
     */
    export class Language extends Base {

        /**
         * Carrega e aplica os estilos css.
         */
        public css: string = `
            ${this.classNameSelector()} {
                display: inline-block;
            }
            ${this.classNameSelector()} .language {
                display: inline-block;
                border-bottom: 2px solid transparent;
                margin: 2px 5px;
                opacity: 0.75;
            }
            ${this.classNameSelector()} .language.active {
                opacity: 1;
            }
            ${this.classNameSelector()} button {
                background: transparent;
                color: transparent;
                border: 0;
                cursor: pointer;
                width: 24px;
                background-size: cover;
            }
            ${this.classNameSelector()} button:focus {
                outline: none;
            }
            ${this.classNameSelector()} .en button {
                background-image: url("${this.theme.url}/language-en.png");
            }
            ${this.classNameSelector()} .pt button {
                background-image: url("${this.theme.url}/language-pt.png");
            }
        `;

        /**
         * Construtor.
         * @param {Framework.Layout.Components.EmptyProps} props Propriedades.
         */
        public constructor(props: Framework.Layout.Components.EmptyProps) {
            super(props);

            this.onClick = this.onClick.bind(this);

            this.toCaptureOff.push(Framework.Bus.Message.capture(Framework.Messages.DidLanguageSetted, this, this.onDidLanguageSetted));
        }

        /**
         * Evento: ao trocar o idioma.
         * @param evt Informações sobre o evento.
         */
        private onDidLanguageSetted(evt: CustomEvent<Framework.Messages.DidLanguageSetted>): void {
            this.language(evt.detail.language);
        }

        /**
         * Define/Retorna o idioma neste componente.
         * @param {string} language Opcional. Idioma
         * @returns {string} Idioma atual.
         */
        public language(language?: string): string {
            if (language) {
                const all = document.querySelectorAll(`#${this.id} .language.active`);
                for (let i = 0; i < all.length; i++) all[i].classList.remove("active");

                const defined = document.querySelector(`#${this.id} .language.${language}`) as HTMLElement;
                defined.classList.add("active");
                return language;
            } else {
                return Core.Main.instance.translate.language;
            }
        }

        /**
         * Quando o botão é pressionado.
         * @param evt Informações do evento.
         */
        private onClick(evt: any) {
            evt.preventDefault();
            const button = evt.target as HTMLElement;
            const parent = button.parentElement as HTMLElement;
            const language = parent.getAttribute("data-language") as string;
            new Framework.Messages.DoSetLanguage(language).send();
        }

        /**
         * Renderizador do React.
         * @returns {JSX.Element}
         */
        public render(): JSX.Element { super.render();           
            return (
                <div id={this.id} className={this.classNameAttribute()} title={"Select language.".translate()}>
                    <span className="language en" data-language="en">
                        <button onClick={this.onClick} className="button-shadow dialog-action">English</button>
                    </span>
                    <span className="language pt" data-language="pt">
                        <button onClick={this.onClick} className="button-shadow dialog-action">Português</button>
                    </span>
                </div>
            );
        }

        /**
         * Após componente montado.
         */
        public componentDidMount(): void { super.componentDidMount();
            const language = document.querySelector(`#${this.id} .language.${this.language()}`) as HTMLElement;
            language.classList.add("original");
            language.classList.add("active");
        }
    }
}
