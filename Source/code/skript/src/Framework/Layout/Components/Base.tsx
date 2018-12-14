namespace Skript.Framework.Layout.Components {

    /**
     * Base de todo componente React do sistema.
     */
    export abstract class Base<TProps extends EmptyProps = EmptyProps, TState extends EmptyState = EmptyState> extends React.Component<TProps, TState> {

        /**
         * Construtor.
         * @param {TProps} props Propriedades.
         */
        public constructor(props: TProps) { 
            super(props);           
            
            this.id = this.props.id ? this.props.id as string : Util.Text.random();
            this.url = Data.ServerVariables.urlMedia;

            this.cssLoad();
        }

        /**
         * Espaçamento de borda padrão nos elementos.
         */
        public static spacing: number = 10;

        /**
         * Espaçamento de borda padrão nos elementos.
         */
        public spacing: number = Base.spacing;

        /**
         * Url para referências imagens, etc.
         * @type {string}
         */
        protected url: string;

        /**
         * Id do elemento.
         * @type {string}
         */
        public id: string;

        /**
         * Retorna um seletor CSS uma instância.
         * @param {any} instance Instância.
         * @returns {string} Seletor CSS.
         */
        public static getSelector(instance: any): string {
            return `.${Core.Main.instance.presentation.configuration.className} .${Base.getClassName(instance)}`;
        }

        /**
         * Define a classe CSS para uma instância.
         * @param {any} instance Instância.
         * @returns {string} Class CSS.
         */
        public static getClassName(instance: any): string {
            if (typeof(instance) === 'string') return instance.random();
            else if (typeof(instance) === 'object') return instance.constructor.name.random();
            else if (typeof(instance) === 'function') return instance.name.random();
            else throw new Errors.InvalidArgument("Instance not string, object or function to getClassName. Type: " + typeof(instance));
        }

        /**
         * Class css para componentes gerados nesta classe.
         * @type {string}
         */
        public className: string = Base.getClassName(this);

        /**
         * Class CSS do componente para uso como atributo em class=""
         * @returns {string} Seletor CSS.
         */
        protected classNameAttribute(): string { return this.className + ((this.props as any).className ? " " + (this.props as any).className : ""); }

        /**
         * Class CSS do componente para uso dentro de um código css.
         * @returns {string} Seletor CSS.
         */
        protected classNameSelector(): string { return `.${Core.Main.instance.presentation.configuration.className} .${this.className}`; }
        
        /**
         * Estilos css do componente.
         */
        public abstract css: string;

        /**
         * Carrega os estilos css do componente.
         */
        public cssLoad(): void { Util.DOM.stylesheet(this.css); }

        /**
         * Registra no log um evento do React.
         * @param {string} name Nome do evento.
         * @param {any} args Argumentos recebidos.
         */
        private logReactEvent(name: string, args?: any): void {
            console.Log("Component \"{component}\". React event \"{event}\".", { component: this.constructor.name, event: name }, "Layout.Components", args);
        }

        /**
         * Atualiza a exibição do componente.
         */
        public forceUpdate(): void {
            this.logReactEvent("forceUpdate");
            super.forceUpdate();
        }

        /**
         * Renderizador do React.
         * @returns {JSX.Element}
         */
        public render(): JSX.Element {
            this.logReactEvent("render");
            Util.DOM.stylesheet(this.css);
            return undefined as any as JSX.Element;
        }

        /**
         * Método React: componentWillMount
         */
        public componentWillMount(): void {
            this.logReactEvent("componentWillMount");
        }

        /**
         * Método React: componentDidMount
         */
        public componentDidMount(): void {
            this.logReactEvent("componentDidMount");
        }

        /**
         * Método React: componentWillReceiveProps
         * @param {TProps} newProps Props.
         */
        public componentWillReceiveProps(newProps: TProps): void {
            this.logReactEvent("componentWillReceiveProps", { newProps: newProps });
        }

        /**
         * Método React: shouldComponentUpdate
         * @param {TProps} newProps Props.
         * @param {TState} newState State.
         */
        public shouldComponentUpdate(newProps: TProps, newState: TState): boolean {
            this.logReactEvent("shouldComponentUpdate", { newProps: newProps, newState: newState });
            return true;
        }

        /**
         * Método React: componentWillUpdate
         * @param {TProps} newProps Props.
         * @param {TState} newState State.
         */
        public componentWillUpdate(newProps: TProps, newState: TState): void {
            this.logReactEvent("componentWillUpdate", { newProps: newProps, newState: newState });
        }

        /**
         * Método React: componentDidUpdate
         * @param {TProps} oldProps Props.
         * @param {TState} oldState State.
         */
        public componentDidUpdate(oldProps: TProps, oldState: TState): void {
            this.logReactEvent("componentDidUpdate", { newProps: oldProps, newState: oldState });
        }

        /**
         * Método React: componentWillUnmount
         */
        public componentWillUnmount(): void {
            this.logReactEvent("componentWillUnmount");
        }
    }
}
