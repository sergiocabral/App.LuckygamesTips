namespace Skript.Layout.ReactJs.Component {

    /**
     * Props para Switch.
     */
    export class SwitchProps extends Layout.ReactJs.EmptyProps {

        /**
         * Estado do controle.
         * @type {boolean}
         */
        checked?: boolean;

        /**
         * Class CSS todos Switch que fazem parte de uma conjunto radio.
         * @type {string}
         */
        radio?: string;

        /**
         * Valor.
         * @type {any}
         */
        value?: any;

        /**
         * Evento ao marcar.
         * @param {any} evt Informações do evento.
         * @param {string} value Valor selecionador.
         * @param {boolean} checked Marcado ou não.
         * @returns {boolean} Um retorno ===false desfaz a alteração.
         */
        onChange?: (evt: any, value: string, checked: boolean) => boolean|void;
    }

    /**
     * State para Switch.
     */
    export type SwitchState = {

        /**
         * Estatdo do controle.
         */
        checked: boolean;
    }

    /**
     * Controle tipo Switch, liga e desliga
     */
    export class Switch extends ComponentBase<SwitchProps, Partial<SwitchState>> {

        /**
         * Código CSS para este componente.
         */
        protected stylesheet: string = `
            ${this.selector()} > .input {
                display: inline-block;
                padding: 5px 1px;
                margin-bottom: -12px;
            }            
            ${this.selector()} > .input {
                display: inline-block;
            }
            ${this.selector()} > .input > input {
                display: inline-block;
            }
            ${this.selector()} > .input > input {
                display: inline-block;
                position: absolute;
                margin-left: -9999px;
                visibility: hidden;
            }
            ${this.selector()} > .input > input + label {
                display: block;
                position: relative;
                cursor: pointer;
                outline: none;
                user-select: none;
            }
            ${this.selector()} > .input > input.shadow + label {
                padding: 2px;
                width: 45px;
                height: 20px;
                background-color: #dddddd;
                border-radius: 60px;
            }
            ${this.selector()} > .input > input.shadow + label:before,
            ${this.selector()} > .input > input.shadow + label:after {
                display: block;
                position: absolute;
                top: 1px;
                left: 1px;
                bottom: 0.5px;
                content: "";
            }
            ${this.selector()} > .input > input.shadow + label:before {
                right: 1px;
                background-color: #eeeeee;
                border-radius: 60px;
                transition: all 0.4s;
            }
            ${this.selector()} > .input > input.shadow + label:after {
                width: 22px;
                background-color: #fff;
                border-radius: 100%;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
                transition: all 0.4s;
            }
            ${this.selector()} > .input > input.shadow[data-checked="true"] + label:before {
                background-color: #A5C4DE;
            }
            ${this.selector()} > .input > input.shadow[data-checked="true"] + label:after {
                transform: translateX(25px);
            }
            ${this.selector()} > .children {
                display: inline-block;
                margin-left: 5px;
                cursor: pointer;
            }
        `;

        /**
         * Construtor.
         * @param {SwitchProps} props Propriedades.
         */
        public constructor(props: SwitchProps) {
            super(props);

            this.elInput = React.createRef();

            this.onClick = this.onClick.bind(this);

            this.state = { checked: !!props.checked };
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
         * Retorna e/ou define o estado do controle.
         * @param value Valor
         * @returns {boolean} Estatdo atual
         */
        public checked(value?: boolean): boolean {            
            if (value !== undefined) {
                this.setState({ checked: value });
                this.check(this.elInput.current, value);
            }
            return this.state.checked as boolean;            
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
                if (this.props.onChange(evt, input.value, this.check(input)) === false) {
                    this.check(input, !this.check(input));
                    this.setState({ checked: this.check(input) });
                }
            }

            if (this.props.radio && this.check(input)) {
                const radioGroup = document.querySelectorAll(`${this.selectorBase()} .${this.props.radio} input[type="text"]`);
                for (let i = 0; i < radioGroup.length; i++) if (input != radioGroup[i]) this.check(radioGroup[i] as HTMLInputElement, false);
            }
        }

        /**
         * Ao receber novos dados de inicialização.
         * @param {SwitchProps} newProps Props
         */
        public componentWillReceiveProps(newProps: SwitchProps) {
            this.setState({checked: newProps.checked});
        }

        /**
         * Renderizador do React.
         * @returns {JSX.Element}
         */
        public render(): JSX.Element {
            return (
                <div id={this.id()} className={this.className() + (this.props.radio ? " " + this.props.radio : "")}>
                    <div className="input">
                        <input id={this.id() + "-input"} type="text" className="shadow" ref={this.elInput} value={this.props.value} data-checked={this.state.checked ? "true" : "false"} onClick={this.onClick} readOnly />
                        <label htmlFor={this.id() + "-input"} className="dialog-action"></label>
                    </div>
                    <label className="children dialog-action" htmlFor={this.id() + "-input"}>{this.props.children}</label>
                </div>
            );
        }
    }
}
