namespace Skript.Layout.ReactJs.Component {

    /**
     * Props para este componente.
     */
    export class SelectProps extends Layout.ReactJs.EmptyProps {

        /**
         * Texto placeholder.
         * @type {string}
         */
        placeholder?: string;

        /**
         * Permite cancelar a seleção.
         * @type {boolean}
         */
        allowClear?: boolean;

        /**
         * Aceita tags.
         * @type {boolean}
         */
        tags?: boolean;

        /**
         * Seleção múltipla
         * @type {boolean}
         */
        multiple?: boolean;
    }

    /**
     * Controle tipo Switch, liga e desliga
     */
    export class Select extends ComponentBase<SelectProps, Partial<Layout.ReactJs.EmptyState>> {

        /**
         * Código CSS para este componente.
         */
        protected stylesheet: string = ``;

        /**
         * Construtor.
         * @param {SelectProps} props Propriedades.
         */
        public constructor(props: SelectProps) {
            super(props);
            this.onChange = this.onChange.bind(this);
            this.elContainer = React.createRef();
        }

        /**
         * Container.
         * @type {React.RefObject<HTMLSelectElement>}
         */
        private elContainer: React.RefObject<HTMLSelectElement>;

        /**
         * Ao clicar na lista
         * @param {any} evt Informações sobre o evento.
         */
        private onChange(evt: any): void {
            console.log(evt);
        }

        /**
         * Renderizador do React.
         * @returns {JSX.Element}
         */
        public render(): JSX.Element {
            return (
                <select id={this.id()} className={this.className()} ref={this.elContainer} onChange={this.onChange}>
                    {this.props.children}
                </select>
            );
        }

        /**
         * Ao montar o componente.
         */
        public componentDidMount(): void {
            const jQuery = (window as any).jQuery;
            if (!this.elContainer.current || !jQuery) return;

            const configuration: any = {
                debug: skript.configuration.debug,  
                language: skript.translate.languageDefault,
                placeholder: this.props.placeholder ? this.props.placeholder : ""
            };
            if (undefined !== this.props.tags) configuration.tags = this.props.tags;
            if (undefined !== this.props.multiple) configuration.multiple = this.props.multiple;
            if (undefined !== this.props.allowClear) configuration.allowClear = this.props.allowClear;
            setTimeout(() => jQuery(`${this.selector()}#${this.id()}`).select2(configuration), 1);
        }
    }
}
