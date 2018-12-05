namespace Skript.Layout.ReactJs {
    
    /**
     * Repositório de todas as instâncias principais do sistema.
     */
    declare const skript: Core.All;

    /**
     * Tipo para props vazio do React deste componente.
     */
    export class EmptyProps { 

        /**
         * Id do elemento.
         * @type {string}
         */
        id?: string

        /**
         * Class CSS do elemento.
         * @type {string}
         */
        className?: string
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
        protected static classNamePrefix: string = Util.Text.random();

        /**
         * Retorna o seletor css base pata um componente.
         * @param {typeof ComponentBase} component Classe do componente.
         * @returns {string} seletor css.
         */
        public static selectorForComponent(name: string): string {
            return `.${Presentation.className} .${ComponentBase.classNamePrefix}${name}`;
        }

        /**
         * Nome da classe CSS deste componente.
         * @type {string}
         */
        protected myClassName: string = ComponentBase.classNamePrefix + this.constructor.name;

        /**
         * Determina as class CSS para o elemento.
         * @type {() => string}
         */
        protected className: () => string = () => this.myClassName + ((this.props as any).className ? " " + (this.props as any).className : "");

        /**
         * Id randômico determinado para a instância.
         * @type {string}
         */
        private randomId: string = Util.Text.random();

        /**
         * Determina o id para o elemento.
         * @type {() => string}
         */
        protected id: () => string = () => (this.props as any).id ? (this.props as any).id : this.randomId;

        /**
         * Registra o código CSS para este componente.
         */
        protected loadStylesheet(): void {
            Util.DOM.stylesheetCode(`
                .${this.classNameBase} {
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
         * @param {string} text Texto (será aplicado tradução)
         * @param {any} values Opcional. Conjunto de valores para substituição na string.
         * @param {Level} level Nível do log.
         */
        protected toast(text: string, values: any = { }, level: Core.Log.Level = Core.Log.Level.Information): void {
            return skript.presentation.toast(text, values, level);
        }

        /**
         * Idioma atual.
         * @type {() => string}
         */
        protected language: () => string = () => skript.translate.languageDefault;

        /**
         * Verifica pelo id se o componente existe.
         * @type {() => Element|null}
         */
        public exists: () => Element|null = () => document.querySelector(`#${this.id()}`);

        /**
         * Seletor CSS mais alto que engloba o componente.
         * @type {() => string}
         */
        protected selector: () => string = () => `.${this.classNameBase} .${this.myClassName}[id]`;

        /**
         * Class CSS mais alto que engloba todo o sistema.
         * @type {string}
         */
        protected classNameBase: string = Presentation.className;

        /**
         * Seletor CSS mais alto que engloba todo o sistema.
         * @type {() => string}
         */
        protected selectorBase: () => string = () => `.${this.classNameBase}`;

        /**
         * Determina se o sistema está em modo debug.
         */
        protected debug: () => boolean = () => !!skript.configuration.debug;
                
        /**
         * Exibe uma janela de mensagem ao usuário.
         * @param {string} text Pergunta.
         * @param {string} title Opcional. Título.
         * @param {any} values Opcional. Conjunto de valores para substituição na string.
         */
        public alert(text: string, title?: string, values: any = { }): void {
            Util.DOM.dialog({ 
                title: title ? skript.translate.get(title, values) : "",
                text: skript.translate.get(text, values)
            });
        }
                
        /**
         * Solicita confirmação de sim ou não ao usuário.
         * @param {string} text Pergunta.
         * @param {string} title Opcional. Título.
         * @param {any} values Opcional. Conjunto de valores para substituição na string.
         */
        public confirm(text: string, title?: string, values: any = { }): Promise<void> {
            return new Promise(resolve => {
                Util.DOM.dialog({ 
                    title: title ? skript.translate.get(title, values) : "",
                    text: skript.translate.get(text, values),
                    buttons: [
                        {
                            name: skript.translate.get("No"),
                            icon: "fas fa-times-circle",
                            escape: true
                        },
                        {
                            name: skript.translate.get("Yes"),
                            icon: "fas fa-check-circle",
                            focus: true,
                            className: "blue"
                        }
                    ]
                }).then((button) => {
                    if (!button.escape) resolve();
                });
            });
        }

        /**
         * Definir instâncias de Bus aqui para serem liberadas quando o componente for desmontado.
         */
        protected myMessageBus: Core.Bus.MessageBus<any>[] = [];

        /**
         * Organiza os parâmertros deste componente.
         * @type {Automation.Parameters}
         */
        protected parameters?: Automation.Parameters;

        /**
         * Quando um componente é montado.
         */
        public componentWillMount() {
            skript.log.post(`Triggered componentWillMount: {component} id="{id}"`, { component: this.constructor.name, id: this.id() }, Core.Log.Level.DebugReact);
        }

        /**
         * Quando um componente é desmontado.
         */
        public componentWillUnmount() {
            skript.log.post(`Triggered componentWillUnmount: {component} id="{id}"`, { component: this.constructor.name, id: this.id() }, Core.Log.Level.DebugReact);
            for (const index in this.myMessageBus) this.myMessageBus[index].dispose();
        }
    }
}
