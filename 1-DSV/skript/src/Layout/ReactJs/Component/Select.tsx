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

        /**
         * Evento para quando houver mudança de valores.
         * @param {Core.KeyValue[]} values Parâmetros selecionados.
         */
        onChange?: (values: Core.KeyValue<string>[]) => void;
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
         * Instância do select2
         * @type {any}
         */
        private select2: any;

        /**
         * Define ou retorna o valor selecionado.
         * @param value Valor a definir.
         * @returns {string[]} Valores selecionados.
         */
        public value(value?: string|string[]): Core.KeyValue<string>[] {
            if (!this.select2) return [];

            if (value !== undefined) {
                this.select2.val(Array.isArray(value) ? value : [value]).trigger("change");
            }

            const result: Core.KeyValue<string>[] = [];
            this.select2.select2("data").map((v: any) => result.push({ key: v.id, value: v.text }));
            return result;
        }

        /**
         * Ao clicar na lista
         */
        private onChange(): void {
            if (!this.props.onChange) return;
            const result: Core.KeyValue<string>[] = [];
            this.select2.select2("data").map((v: any) => result.push({ key: v.id, value: v.text }));
            this.props.onChange(result);
        }

        /**
         * Renderizador do React.
         * @returns {JSX.Element}
         */
        public render(): JSX.Element {
            return (
                <select id={this.id()} className={this.className()} ref={this.elContainer}>
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
                language: "en",
                placeholder: this.props.placeholder ? this.props.placeholder : ""
            };
            if (undefined !== this.props.tags) configuration.tags = this.props.tags;
            if (undefined !== this.props.multiple) configuration.multiple = this.props.multiple;
            if (undefined !== this.props.allowClear) configuration.allowClear = this.props.allowClear;
            setTimeout(() => {
                this.select2 = jQuery(`${this.selector()}#${this.id()}`).select2(configuration);
                this.select2.on("change", this.onChange);
            }, 1);
        }
    }
}
