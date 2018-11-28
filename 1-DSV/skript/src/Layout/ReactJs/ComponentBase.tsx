namespace Skript.Layout.ReactJs {
    
    /**
     * Repositório de todas as instâncias principais do sistema.
     */
    declare const skript: Core.All;

    /**
     * Tipo para props vazio do React deste componente.
     */
    export type EmptyProps = { 

        /**
         * Id do elemento.
         * @type {string}
         */
        id?: string
    }

    /**
     * Tipo para state vazio do React deste componente.
     */
    export type EmptyState = { }

    /**
     * Botão que ativa o sistema.
     */
    export abstract class ComponentBase<P, S> extends React.Component<P, S> {

        /**
         * Código CSS para este componente.
         * @type {string}
         */
        protected abstract stylesheet: string;

        /**
         * Construtor.
         * @param {P} props Propriedades.
         */
        public constructor(props: P) {
            super(props);
            setTimeout(() => this.loadStylesheet(), 1);
        }

        /**
         * Usado como prefixo nos nomes de classe CSS.
         * @type {string}
         */
        private static classNamePrefix: string = Util.String.random();

        /**
         * Nome da classe CSS deste componente.
         * @type {string}
         */
        protected className: string = ComponentBase.classNamePrefix + this.constructor.name;

        /**
         * Registra o código CSS para este componente.
         */
        protected loadStylesheet(): void {
            Util.DOM.stylesheetCode(`
                .${Presentation.className} {
                    font-family: ${this.theme.generalTextFont};
                    font-size: 14px;              
                }
            `);
            if (typeof(this.stylesheet) === "string" && this.stylesheet) {
                Util.DOM.stylesheetCode(this.stylesheet);
            }
        }

        /**
         * Tema de cores para configurar o layout
         * @type {Theme.Stylesheet}
         */
        protected theme: Theme.Stylesheet = new Theme.Stylesheet(skript.data.colors);

        /**
         * Retorna a tradução de um texto em um determinado idioma.
         * @param {string} id Identificador do texto.
         * @param {any} values Opcional. Conjunto de valores para substituição na string.
         * @returns {string} Texto traduzido.
         */
        protected translate(id: string, values: any = { }): string {
            return skript.translate.get(id, values);
        }

        /**
         * Exibe uma mensagem ao usuário
         * @param {string} text Texto.
         * @param {Level} level Nível do log.
         */
        protected toast(text: string, level: Core.Log.Level = Core.Log.Level.Information): void {
            return skript.presentation.toast(text, level);
        }

        /**
         * Idioma atual.
         * @type {() => string}
         */
        protected language: () => string = () => skript.translate.languageDefault;

        /**
         * Id randômico determinado para a instância.
         * @type {string}
         */
        private randomId: string = Util.String.random();

        /**
         * Determina o id para o elemento.
         * @type {() => string}
         */
        protected id: () => string = () => (this.props as any).id ? (this.props as any).id : this.randomId;

        /**
         * Verifica pelo id se o componente existe.
         * @type {() => Element|null}
         */
        public exists: () => Element|null = () => document.querySelector(`#${this.id()}`);

        /**
         * Seletor CSS mais alto que engloba o componente.
         * @type {() => string}
         */
        protected selector: () => string = () => `.${Presentation.className} .${this.className}[id]`;

        /**
         * Quando um componente é montado.
         */
        public componentWillMount() {
            skript.log.post(`componentWillMount: ${this.constructor.name} id="${this.id()}".`, null, Core.Log.Level.DebugReact);
        }

        /**
         * Quando um componente é desmontado.
         */
        public componentWillUnmount() {
            skript.log.post(`componentWillUnmount: ${this.constructor.name} id="${this.id()}".`, null, Core.Log.Level.DebugReact);
        }
    }
}
