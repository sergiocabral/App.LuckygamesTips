namespace Skript.Layout.ReactJs.Component {

    /**
     * Props para este componente.
     */
    export class SelectProps extends Layout.ReactJs.EmptyProps {

        /**
         * Valores
         * @type {Core.KeyValue<string, boolean>[]}
         */
        values?: Core.KeyValue<string, boolean>[];
    }

    /**
     * Controle tipo Switch, liga e desliga
     */
    export class Select extends ComponentBase<SelectProps, Partial<Layout.ReactJs.EmptyState>> {

        /**
         * Código CSS para este componente.
         */
        protected stylesheet: string = `
            ${this.selector()} { 
                background-color: #A5C4DE;
                color: rgba(0,0,0,0.6);
                padding: 0;
                border: 1px solid rgba(0,0,0,0.2);
                border-radius: 4px;
                height: 30px;
                width: 150px;
                cursor: pointer;
            }
            ${this.selector()} > li { 
                padding: 3px 15px 5px 10px; 
                z-index: 2; 
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                width: calc(100% - 25px);
            }
            ${this.selector()} > li:first-child:before { 
                content: "\\25BC";
                float: right;
                margin: 1px -10px 0 0;
                cursor: pointer;
            }
            ${this.selector()} > li:not(:first-child) { 
                margin-bottom: 1px;
            }
            ${this.selector()} > li:not(.init) { 
                background-color: #A5C4DE;
                float: left; 
                display: none; 
            }
            ${this.selector()} > li:not(.init):hover, 
            ${this.selector()} > li.selected:not(.init) { 
                background-color: #424E59;
                color: rgba(255,255,255,0.7);
            }
            ${this.selector()} > li.init { 
                cursor: pointer; 
            }
        `;

        /**
         * Construtor.
         * @param {SelectProps} props Propriedades.
         */
        public constructor(props: SelectProps) {
            super(props);
            this.onClick = this.onClick.bind(this);
        }

        /**
         * Ao clicar na lista
         * @param {any} evt Informações sobre o evento.
         */
        private onClick(evt: any): void {
            let init;            
            if (evt.target.classList.contains("init")) {
                const itens = Array.from(evt.target.parentElement.querySelectorAll('li:not(.init)')) as HTMLElement[];
                itens.map(v => v.style.display = !v.style.display || v.style.display == "none" ? "list-item" : "none");
            } else if (init = document.querySelector("ul .init")) {
                const all = Array.from(document.querySelectorAll("ul li:not(.init)")) as HTMLElement[];
                for (const i in all) all[i].classList.remove("selected");
                evt.target.classList.add("selected");
                init.innerHTML = evt.target.innerHTML;
                all.map(v => v.style.display = v.style.display == "none" ? "list-item" : "none");
            }
        }

        /**
         * Renderizador do React.
         * @returns {JSX.Element}
         */
        public render(): JSX.Element {
            return (
                <ul id={this.id()} className={this.className()} onClick={this.onClick}>
                    {[(this.props.values ? this.props.values : []).concat([{ key: "", value: "", state: true }]).reduce((a: any, c: any) => a = a || (c.state ? c : null), null)].map((v: any) => 
                        <li key="-1" className="init">{v.value}</li>
                    )}
                    {(this.props.values ? this.props.values : []).map((v, i) => 
                        <li key={i} className={v.state ? "selected" : ""} data-value={v.key}>{v.value}</li>
                    )}
                </ul>
            );
        }
    }
}
