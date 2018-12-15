namespace Skript.Framework.Layout.Components.Switch {

    /**
     * Controle tipo Switch, liga e desliga
     */
    export class Switch extends Base<Props> {

        /**
         * Carrega e aplica os estilos css.
         */
        public css(): string {
            return `
                ${this.classNameSelector()} > .input {
                    display: inline-block;
                    margin: 5px 0 2px 0;
                }            
                ${this.classNameSelector()} > .input {
                    display: inline-block;
                }
                ${this.classNameSelector()} > .input > input {
                    display: inline-block;
                }
                ${this.classNameSelector()} > .input > input {
                    display: inline-block;
                    position: absolute;
                    margin-left: -9999px;
                    visibility: hidden;
                }
                ${this.classNameSelector()} > .input > input + label {
                    display: block;
                    position: relative;
                    cursor: pointer;
                    outline: none;
                    user-select: none;
                }
                ${this.classNameSelector()} > .input > input.shadow + label {
                    padding: 2px;
                    width: 45px;
                    height: 20px;
                    background-color: #dddddd;
                    border-radius: 60px;
                }
                ${this.classNameSelector()} > .input > input.shadow + label:before,
                ${this.classNameSelector()} > .input > input.shadow + label:after {
                    display: block;
                    position: absolute;
                    top: 1px;
                    left: 1px;
                    bottom: 0.5px;
                    content: "";
                }
                ${this.classNameSelector()} > .input > input.shadow + label:before {
                    right: 1px;
                    background-color: #eeeeee;
                    border-radius: 60px;
                    transition: all 0.4s;
                }
                ${this.classNameSelector()} > .input > input.shadow + label:after {
                    width: 22px;
                    background-color: #fff;
                    border-radius: 100%;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
                    transition: all 0.4s;
                }
                ${this.classNameSelector()} > .input > input.shadow[data-checked="true"] + label:before {
                    background-color: #A5C4DE;
                }
                ${this.classNameSelector()} > .input > input.shadow[data-checked="true"] + label:after {
                    transform: translateX(25px);
                }
                ${this.classNameSelector()} > .children {
                    display: inline-block;
                    margin-left: 5px;
                    cursor: pointer;
                    position: relative;
                    top: -8px;
                }
            `;
        }

        /**
         * Construtor.
         * @param {Props} props Propriedades.
         */
        public constructor(props: Props) {
            super(props);

            this.elInput = React.createRef();

            this.onClick = this.onClick.bind(this);

            this.isChecked = !!props.checked;
        }

        /**
         * Input.
         * @type {React.RefObject<HTMLInputElement>}
         */
        private elInput: React.RefObject<HTMLInputElement>;

        /**
         * Define e retorna o estado de um input.
         * @param {HTMLInputElement} input Input
         * @param {boolean} checked Define o estado.
         */
        private check(input?: HTMLInputElement | null, checked?: boolean): boolean {
            if (!input) return false;
            
            if (checked !== undefined) {
                input.setAttribute("data-checked", checked ? "true" : "false");
            }

            return input.getAttribute("data-checked") === "true";
        }

        /**
         * Estatdo do controle.
         */
        private isChecked: boolean;

        /**
         * Retorna e/ou define o estado do controle.
         * @param value Valor
         * @returns {boolean} Estatdo atual
         */
        public checked(value?: boolean): boolean {            
            if (value !== undefined) {
                this.setState({ checked: value });
                this.check(this.elInput.current, value);
            }
            return this.isChecked;
        }

        /**
         * Ao definir checked.
         * @param evt Informações sobre o evento.
         */
        private onClick(evt: any): void {
            const input = evt.target as HTMLInputElement;            

            if (this.props.radio && this.check(input)) return;

            this.check(input, !this.check(input));
            this.setState({ checked: this.check(input) });

            if (this.props.onChange instanceof Function) {
                if (this.props.onChange(input.value, this.check(input), evt) === false) {
                    this.check(input, !this.check(input));
                    this.setState({ checked: this.check(input) });
                }
            }

            if (this.props.radio && this.check(input)) {
                const radioGroup = document.querySelectorAll(`${this.classNameSelector()}.${this.props.radio} input[type="text"]`);
                for (let i = 0; i < radioGroup.length; i++) if (input != radioGroup[i]) this.check(radioGroup[i] as HTMLInputElement, false);
            }
        }

        /**
         * Ao receber novos dados de inicialização.
         * @param {SwitchProps} newProps Props
         */
        public componentWillReceiveProps(newProps: Props) { super.componentWillReceiveProps(newProps);
            if (newProps.checked !== undefined) this.isChecked = newProps.checked;
        }

        /**
         * Renderizador do React.
         * @returns {JSX.Element}
         */
        public render(): JSX.Element { super.render();
            return (
                <div id={this.id} className={this.classNameAttribute() + (this.props.radio ? " " + this.props.radio : "")}>
                    <div className="input">
                        <input id={this.id + "-input"} type="text" className="shadow" ref={this.elInput} value={this.props.value} data-checked={this.isChecked ? "true" : "false"} onClick={this.onClick} readOnly />
                        <label htmlFor={this.id + "-input"} className="dialog-action"></label>
                    </div>
                    <label className="children dialog-action" htmlFor={this.id + "-input"}>{this.props.children}</label>
                </div>
            );
        }
    }
}
