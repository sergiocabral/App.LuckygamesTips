namespace Skript.Part.User.LuckygamesAdjusts.Component {

    class OptionWrapper {

        public constructor(option: Core.KeyValue<string>) {
            this.option = option;
        }

        option: Core.KeyValue<string>;

        checked: boolean = false;
    }

    class AdjustsProps extends Layout.ReactJs.EmptyProps {
        
        title?: string;

        onChange?: (options: Core.KeyValue<Core.KeyValue<string>[]>) => void;

        options?: Core.KeyValue<Core.KeyValue<string>[]>;

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
            ${this.selector()} {
                
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
         * @returns {Core.KeyValue<Core.KeyValue<string>[]>} Key com Value em lista de valores marcados.
         */
        public getValues(): Core.KeyValue<Core.KeyValue<string>[]> {
            const result: Core.KeyValue<Core.KeyValue<string>[]> = {
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
        private onOptionChange(evt: any, option: string, checked: boolean): void {
            evt;
            if (this.props.exclusive) this.uncheckedAll();
            this.value(option, checked);
            if (this.props.onChange instanceof Function)
                this.props.onChange(this.getValues());
        }

        /**
         * Class CSS para o grupo de radio button.
         * @type {string}
         */
        private classNameForRadio: string = Util.String.random();
        
        /**
         * Renderizador do React. Conteúdo do container.
         * @returns {JSX.Element}
         */
        public render(): JSX.Element {         
            return (
                <div id={this.id()} className={this.className()} ref={this.elContainer}>
                    <h1>{this.props.title}</h1>
                    <div className="description">{this.props.children}</div>
                    {this.values.map(v => 
                        <Layout.ReactJs.Component.Switch 
                            key={v.option.key} 
                            value={v.option.key} 
                            checked={v.checked}
                            radio={this.classNameForRadio}
                            onChange={this.onOptionChange}>
                            {v.option.value}
                        </Layout.ReactJs.Component.Switch>
                    )}
                </div>
            );
        }
    }
}
