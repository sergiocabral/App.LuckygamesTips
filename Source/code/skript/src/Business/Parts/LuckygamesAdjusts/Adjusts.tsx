namespace Skript.Business.Parts.LuckygamesAdjusts {

    /**
     * Componente principal do módulo.
     */
    export class Adjusts extends Layout.Components.Base<AdjustsProps, Framework.Layout.Components.EmptyState> {

        /**
         * Carrega e aplica os estilos css.
         */
        public css(): string {
            return `
                ${this.classNameSelector()} > * {
                    margin: 0 ${this.theme.spacing}px;
                }
                ${this.classNameSelector()} > h1 {
                    margin: 0;
                }            
                ${this.classNameSelector()} > h1 {
                    margin-bottom: 5px;
                }
                ${this.classNameSelector()} > .description {
                    margin-bottom: 3px;
                }
                ${this.classNameSelector()} > .description > * {
                    opacity: 0.65;
                    display: inline;
                }       
                ${this.classNameSelector()} > .description > *:after {
                    content: " ";
                }
                ${this.classNameSelector()} > .description > *:first-child {
                    opacity: 1;
                }
            `;
        }

        /**
         * Construtor.
         * @param {DialogProps} props Propriedades.
         */
        public constructor(props: AdjustsProps) {
            super(props);            

            this.onOptionChange = this.onOptionChange.bind(this);

            this.elContainer = React.createRef();

            if (!props.options || !props.options.value)  throw new Framework.Errors.EmptyValue("AdjustsProps.options");

            this.key = props.options.key;

            this.values = [];
            props.options.value.map(v => this.values.push(new OptionWrapper(v)));
        }
        
        /**
         * Referência ao container pai de todos.
         * @type {React.RefObject<HTMLDivElement>}
         */
        private elContainer: React.RefObject<HTMLDivElement>;

        /**
         * Solicita ao React a atualização do componente se já for possível.
         */
        private update(): void {
            if (this.elContainer.current) this.forceUpdate();
        }

        /**
         * Valor representado por este componente.
         * @type {string}
         */
        private key: string;

        private values: OptionWrapper[];

        /**
         * Retorna e/ou define um valor de opção.
         * @param {string} option Opção.
         * @param {boolean} checked Opcional. Define se está marcado ou não.
         */
        public value(option: string, checked?: boolean): boolean {
            for (const index in this.values) {
                if (this.values[index].option.key === option) {
                    if (checked !== undefined) {
                        this.values[index].checked = checked;
                        this.update();
                    }
                    return this.values[index].checked;
                }
            }
            return false;
        }

        /**
         * Retorna os valores atuais.
         * @returns {Framework.Types.KeyValue<Framework.Types.KeyValue<string, boolean>[]>} Key com Value em lista de valores marcados.
         */
        public getValues(): Framework.Types.KeyValue<Framework.Types.KeyValue<string, boolean>[]> {
            const result: Framework.Types.KeyValue<Framework.Types.KeyValue<string, boolean>[]> = {
                key: this.key,
                value: []
            };

            for (const index in this.values) {
                if (this.values[index].checked) {
                    result.value.push(Object.assign({}, this.values[index].option));
                }
            }

            return result;
        }

        /**
         * Desmarca todas as opções.
         */
        public uncheckedAll(): void {
            for (const index in this.values) this.values[index].checked = false;
            this.update();
        }

        /**
         * Ao definir uma opção.
         * @param {string} value Valor
         * @param {boolean} checked Marcado ou não.
         */
        private onOptionChange(option: string, checked: boolean): boolean|void {
            if (checked) {
                if (this.props.exclusive) this.uncheckedAll();
                this.value(option, checked);
            }
            if (this.props.onChange instanceof Function) return this.props.onChange(this.getValues());
        }

        /**
         * Class CSS para o grupo de radio button.
         * @type {string}
         */
        private classNameForRadio: string = Framework.Util.Text.random();
        
        /**
         * Renderizador do React. Conteúdo do container.
         * @returns {JSX.Element}
         */
        public render(): JSX.Element { super.render();
            return (
                <div id={this.id} className={this.classNameAttribute()} ref={this.elContainer}>                
                    <h1 className="line">{this.props.title}</h1>
                    <div className="description">{this.props.children}</div>
                    {this.values.map(v => 
                        <Framework.Layout.Components.Switch.Switch 
                            key={v.option.key} 
                            value={v.option.key} 
                            checked={v.checked}
                            radio={this.props.exclusive ? this.classNameForRadio : undefined}
                            onChange={this.onOptionChange}>
                            {v.option.value}
                        </Framework.Layout.Components.Switch.Switch>
                    )}
                    <div className="spacing"></div>
                </div>
            );
        }
    }
}
