namespace Skript.Layout.ReactJs.Component {

    /**
     * Props para Switch.
     */
    export type SwitchProps = {

        /**
         * Estatdo do controle.
         */
        checked: boolean
    }

    /**
     * State para Switch.
     */
    export type SwitchState = {

        /**
         * Estatdo do controle.
         */
        checked: boolean
    }

    /**
     * Controle tipo Switch, liga e desliga
     */
    export class Switch extends ComponentBase<SwitchProps, Partial<SwitchState>> {

        /**
         * Nome da classe CSS deste componente.
         */
        public className: string = 'switch';

        /**
         * Código CSS para este componente.
         */
        public stylesheet: string = `
            ${this.selector()} {
                display: inline-block;
                padding: 3px 1px;
                margin-bottom: -10px;
            }
            ${this.selector()} input {
                display: inline-block;
            }
            ${this.selector()} input {
                display: inline-block;
                position: absolute;
                margin-left: -9999px;
                visibility: hidden;
            }
            ${this.selector()} input + label {
                display: block;
                position: relative;
                cursor: pointer;
                outline: none;
                user-select: none;
            }
            ${this.selector()} input.shadow + label {
                padding: 2px;
                width: 45px;
                height: 20px;
                background-color: #dddddd;
                border-radius: 60px;
            }
            ${this.selector()} input.shadow + label:before,
            ${this.selector()} input.shadow + label:after {
                display: block;
                position: absolute;
                top: 1px;
                left: 1px;
                bottom: 0.5px;
                content: "";
            }
            ${this.selector()} input.shadow + label:before {
                right: 1px;
                background-color: #eeeeee;
                border-radius: 60px;
                transition: all 0.4s;
            }
            ${this.selector()} input.shadow + label:after {
                width: 22px;
                background-color: #fff;
                border-radius: 100%;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
                transition: all 0.4s;
            }
            ${this.selector()} input.shadow:checked + label:before {
                background-color: #8ce196;
            }
            ${this.selector()} input.shadow:checked + label:after {
                transform: translateX(25px);
            }
        `;

        /**
         * Construtor.
         * @param {SwitchProps} props Propriedades.
         */
        public constructor(props: SwitchProps) {
            super(props);

            this.elCheckbox = React.createRef();

            this.onClick = this.onClick.bind(this);

            this.state = { checked: props.checked };
        }

        /**
         * Checkbox.
         * @type {React.RefObject<HTMLElement>}
         */
        private elCheckbox: React.RefObject<HTMLElement>;

        /**
         * Retorna e/ou define o estado do controle.
         * @param value Valor
         * @returns {boolean} Estatdo atual
         */
        public checked(value?: boolean): boolean {            
            if (value !== undefined) {
                this.setState({ checked: value });
                (this.elCheckbox.current as HTMLInputElement).checked = value;
            }
            return this.state.checked as boolean;            
        }

        /**
         * Ao clicar no controle
         * @param ev Informações sobre o evento.
         */
        private onClick(ev: any): void {
            this.setState({ checked: ev.target.checked });
        }

        /**
         * Renderizador do React.
         * @returns {JSX.Element}
         */
        public render(): JSX.Element {
            const _this = this;eval("window._this = _this"); _this;
            return (
                <div id={this.id()} className={this.className}>
                    <input id={this.id() + "-input"} type="checkbox" className="shadow" ref={this.elCheckbox as any} defaultChecked={this.state.checked} onClick={this.onClick}/>
                    <label htmlFor={this.id() + "-input"}></label>
                </div>
            );
        }
    }
}
