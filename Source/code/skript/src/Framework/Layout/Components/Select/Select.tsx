namespace Skript.Framework.Layout.Components.Select {

    /**
     * Controle tipo lista <select>
     */
    export class Select extends Base<Props> {

        /**
         * Carrega e aplica os estilos css.
         */
        public css(): string {
            return `
                ${this.classNameSelector()} { }
            `;
        }

        /**
         * Construtor.
         * @param {Props} props Propriedades.
         */
        public constructor(props: Props) {
            super(props);
            this.onChange = this.onChange.bind(this);
        }

        /**
         * Instância do select2
         * @type {any}
         */
        private select2: any;

        /**
         * Configurações para select2
         * @type {any}
         */
        private select2Configuration: any;

        /**
         * Define ou retorna o valor selecionado.
         * @param value Valor a definir.
         * @returns {string[]} Valores selecionados.
         */
        public value(value?: string|string[]): Types.KeyValue<string>[] {
            if (!this.select2) return [];

            if (value !== undefined) {
                this.select2.val(Array.isArray(value) ? value : [value]).trigger("change");
            }

            const result: Types.KeyValue<string>[] = [];
            const data = this.select2.select2("data");
            if (data) data.map((v: any) => result.push({ key: v.id, value: v.text }));
            return result;
        }

        /**
         * Ao clicar na lista
         */
        private onChange(): void {
            if (!this.props.onChange) return;
            const result: Types.KeyValue<string>[] = [];
            const data = this.select2.select2("data");
            if (data) data.map((v: any) => result.push({ key: v.id, value: v.text }));
            this.props.onChange(result);
        }

        /**
         * Renderizador do React.
         * @returns {JSX.Element}
         */
        public render(): JSX.Element { super.render();
            return (
                <select id={this.id} className={this.classNameAttribute()}>
                    {this.props.children}
                </select>
            );
        }

        /**
         * Ao montar o componente.
         */
        public componentDidMount(): void { super.componentDidMount();
            this.select2Configuration = {
                language: "skript",
                placeholder: this.props.placeholder ? this.props.placeholder : "",
                dropdownParent: jQuery(Core.Main.instance.presentation.container3rdParty)
            };
            if (undefined !== this.props.tags) this.select2Configuration.tags = this.props.tags;
            if (undefined !== this.props.multiple) this.select2Configuration.multiple = this.props.multiple;
            if (undefined !== this.props.allowClear) this.select2Configuration.allowClear = this.props.allowClear;
            setTimeout(() => {
                this.select2 = (jQuery(`${this.classNameSelector()}#${this.id}`) as any).select2(this.select2Configuration);
                this.select2.on("change", this.onChange);
                this.select2.val([]).trigger('change');
            }, 0);
        }

        /**
         * Ao desmontar componente.
         */
        public componentWillUnmount(): void { super.componentWillUnmount();
            if (!this.select2) return;
            this.select2.select2("destroy");
        }

        /**
         * Define as traduções do select2
         * @param {string} language Opcional. Nome do conjunto de traduções.
         */
        public static translate(language: string = "skript"): void {
            const jquery = (window as any).jQuery;

            if (!jquery ||
                !jquery.fn ||
                !jquery.fn.select2 ||
                !jquery.fn.select2.amd ||
                !jquery.fn.select2.amd.define) return;

            jquery.fn.select2.amd.define('select2/i18n/' + language, [], function () {
                return {
                    errorLoading: function () {
                        return 'The results could not be loaded.'.translate();
                    },
                    inputTooLong: function (args: any) {
                        var overChars = args.input.length - args.maximum;
                        var message;
                        if (overChars == 1) message = 'Please delete {0} character.'.translate(overChars);
                        else message = 'Please delete {0} characters.'.translate(overChars);
                        return message;
                    },
                    inputTooShort: function (args: any) {
                        var remainingChars = args.minimum - args.input.length;
                        var message = 'Please enter {0} or more characters.'.translate(remainingChars);
                        return message;
                    },
                    loadingMore: function () {
                        return 'Loading more results...'.translate();
                    },
                    maximumSelected: function (args: any) {
                        var message;
                        if (args.maximum == 1) message = 'You can only select {0} item.'.translate(args.maximum);
                        else message = 'You can only select {0} items.'.translate(args.maximum);
                        return message;
                    },
                    noResults: function () {
                        return 'No results found'.translate();
                    },
                    searching: function () {
                        return 'Searching...'.translate();
                    }
                };
            });
        }
    }

    Select.translate();
}
