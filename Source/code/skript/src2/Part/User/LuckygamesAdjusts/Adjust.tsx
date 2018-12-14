namespace Skript.Part.User.LuckygamesAdjusts {

    /**
     * Dados relativos a opção.
     */
    class OptionWrapper {

        /**
         * Construtor.
         * @param {Core.KeyValue<string, boolean>} option Opção.
         */
        public constructor(option: Core.KeyValue<string, boolean>) {
            this.option = option;
            this.checked = !!option.state;
        }

        /**
         * Opção.
         * @type {Core.KeyValue<string, boolean>}
         */
        option: Core.KeyValue<string, boolean>;

        /**
         * Indica se está selecionada.
         * @type {boolean}
         */
        checked: boolean;
    }

    /**
     * Props para este componente.
     */
    class AdjustsProps extends Layout.ReactJs.EmptyProps {
        
        /**
         * Título.
         * @type {string}
         */
        title?: string;

        /**
         * Evento ao alterar seleção.
         * @type {(options: Core.KeyValue<Core.KeyValue<string, boolean>[]>) => boolean|undefined}
         */
        onChange?: (options: Core.KeyValue<Core.KeyValue<string, boolean>[]>) => boolean|undefined;

        /**
         * Lista de opções
         * @type {Core.KeyValue<Core.KeyValue<string, boolean>[]>}
         */
        options?: Core.KeyValue<Core.KeyValue<string, boolean>[]>;

        /**
         * Indica se a seleção da opção desmarca as outras.
         * @type {boolean}
         */
        exclusive?: boolean;
    }

    /**
     * Componente principal do módulo.
     */
    export class Adjusts extends Layout.ReactJs.ComponentBase<AdjustsProps, Partial<Layout.ReactJs.EmptyState>> {

        /**
         * Código CSS para este componente.
         */
        protected stylesheet: string = `
            ${this.selector()} > * {
                margin: 0 ${this.theme.spacing}px;
            }
            ${this.selector()} > h1 {
                margin: 0;
            }            
            ${this.selector()} > h1 {
                margin-bottom: 5px;
            }
            ${this.selector()} > .description {
                margin-bottom: 3px;
            }
            ${this.selector()} > .description > * {
                opacity: 0.65;
                display: inline;
            }       
            ${this.selector()} > .description > *:after {
                content: " ";
            }
            ${this.selector()} > .description > *:first-child {
                opacity: 1;
            }
        `;

        /**
         * Construtor.
         * @param {DialogProps} props Propriedades.
         */
        public constructor(props: AdjustsProps) {
            super(props);            
            
            this.onOptionChange = this.onOptionChange.bind(this);

            this.elContainer = React.createRef();

            if (!props.options || !props.options.value)  throw new Core.Errors.NullNotExpected("AdjustsProps.options");

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
         * @returns {Core.KeyValue<Core.KeyValue<string, boolean>[]>} Key com Value em lista de valores marcados.
         */
        public getValues(): Core.KeyValue<Core.KeyValue<string, boolean>[]> {
            const result: Core.KeyValue<Core.KeyValue<string, boolean>[]> = {
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
         * @param {any} evt Informações do evento.
         * @param {string} value Valor
         * @param {boolean} checked Marcado ou não.
         */
        private onOptionChange(evt: any, option: string, checked: boolean): boolean|void {
            evt;
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
        private classNameForRadio: string = Util.Text.random();
        
        /**
         * Renderizador do React. Conteúdo do container.
         * @returns {JSX.Element}
         */
        public render(): JSX.Element {         
            return (
                <div id={this.id()} className={this.className()} ref={this.elContainer}>                
                    <h1 className="line">{this.props.title}</h1>
                    <div className="description">{this.props.children}</div>
                    {this.values.map(v => 
                        <Layout.ReactJs.Component.Switch 
                            key={v.option.key} 
                            value={v.option.key} 
                            checked={v.checked}
                            radio={this.props.exclusive ? this.classNameForRadio : undefined}
                            onChange={this.onOptionChange}>
                            {v.option.value}
                        </Layout.ReactJs.Component.Switch>
                    )}
                    <div className="spacing"></div>
                </div>
            );
        }
    }
}
