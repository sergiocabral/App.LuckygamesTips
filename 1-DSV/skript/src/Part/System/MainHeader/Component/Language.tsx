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
            }
            ${this.selector()} button {
                background: transparent;
                color: transparent;
                border: 0;
                cursor: pointer;
                width: 24px;
                background-size: cover;
                margin-left: 10px;
            }
            ${this.selector()} button:focus {
                outline: none;
            }
            ${this.selector()} button.en {
                background-image: url("${this.theme.url}/media/language-en.png");
            }
            ${this.selector()} button.pt {
                background-image: url("${this.theme.url}/media/language-pt.png");
            }
        `;

        /**
         * Construtor.
         * @param {Layout.ReactJs.EmptyProps} props Propriedades.
         */
        public constructor(props: Layout.ReactJs.EmptyProps) {
            super(props);            
        }
        /**
         * Renderizador do React.
         * @returns {JSX.Element}
         */
        public render(): JSX.Element {            
            return (
                <div id={this.id()} className={this.className}>
                    <button className="en" data-language="en" data-message="Refresh the page to update the language." title={this.translate("Seleção de idioma.")}>English</button>
                    <button className="pt" data-language="pt" data-message="Atualize a página para atualizar o idioma." title={this.translate("Seleção de idioma.")}>Português</button>
                    <div className="message"></div>
                </div>
            );
        }
    }
}
