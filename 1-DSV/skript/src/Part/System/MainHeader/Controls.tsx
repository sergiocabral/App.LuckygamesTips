namespace Skript.Part.System.MainHeader {

    /**
     * Lista os levels de log para seleção
     */
    export class Controls extends Layout.ReactJs.ComponentBase<Layout.ReactJs.EmptyProps, Partial<Layout.ReactJs.EmptyState>> {
        
        /**
         * Código CSS para este componente.
         */
        protected stylesheet: string = `
            ${this.selector()} {
                position: relative;
                top: 2px;
            }
            ${this.selector()} > .text-shadow {
                font-size: 15px;
                color: ${Util.Drawing.blend(0.3, this.theme.generalTextColor)};
            }
            ${this.selector()} > .separator {
                display: inline-block;
                width: ${this.theme.spacing}px;
                margin-right: ${this.theme.spacing}px;
                border-right: 1px solid ${Util.Drawing.blend(0.3, this.theme.dialogTitleBackgroundColor)};
            }
            ${this.selector()} > .separator:after {
                content: "\\00a0";
            }
        `;

        /**
         * Construtor.
         * @param {Layout.ReactJs.EmptyProps} props Propriedades.
         */
        public constructor(props: Layout.ReactJs.EmptyProps) {
            super(props);

            this.onClick = this.onClick.bind(this);
        }

        /**
         * Clique nos botões.
         * @param {MouseEvent} evt Informações sobre o evento.
         */
        private onClick(evt: any): void {
            if (!evt || !evt.target) return;

            evt.preventDefault();
            
            const targets = evt.nativeEvent && Array.isArray(evt.nativeEvent.path) ? evt.nativeEvent.path : Util.DOM.path(evt.target);
            const button = targets.reduce((a: any, c: any) => a = a || (c.classList && c.classList.contains("text-shadow") ? c : null), null);
            const action = button ? button.getAttribute("data-action") : undefined;

            if ((this as any)[action] instanceof Function) (this as any)[action]();
        }

        /**
         * Obtem a lista de módulos atuais.
         * @returns {{ click: HTMLElement, content: HTMLElement }[]} Array
         */
        private getModules(): { click: HTMLElement, content: HTMLElement }[] {
            const selector = Layout.ReactJs.ComponentBase.selectorForComponent(Layout.ReactJs.Component.HeaderContainer.name);
            const clicks = document.querySelectorAll(`${selector} > .title h1`);
            const contents = document.querySelectorAll(`${selector} > .content`);

            if (clicks.length !== contents.length) throw new Core.Errors.InvalidArgument(`getModules(): headers.length(${clicks.length}) == content.length(${contents.length})`);

            const list: { click: HTMLElement, content: HTMLElement }[] = [];
            for (let i = 0; i < clicks.length; i++) {
                list.push({
                    click: clicks[i] as HTMLElement,
                    content: contents[i] as HTMLElement
                });                
            }
            return list;
        }

        /**
         * Obtem a lista de janelas.
         * @returns {{ click: HTMLElement, content: HTMLElement }[]} Array
         */
        private getDialogs(): { click: HTMLElement, content: HTMLElement }[] {
            const selector = Layout.ReactJs.ComponentBase.selectorForComponent(Layout.ReactJs.Component.Dialog.name);
            const clicks = document.querySelectorAll(`${selector}.moduleDialog > .header a.close`);
            const contents = document.querySelectorAll(`${selector}.moduleDialog`);

            if (clicks.length !== contents.length) throw new Core.Errors.InvalidArgument(`getModules(): headers.length(${clicks.length}) == content.length(${contents.length})`);

            const list: { click: HTMLElement, content: HTMLElement }[] = [];
            for (let i = 0; i < clicks.length; i++) {
                list.push({
                    click: clicks[i] as HTMLElement,
                    content: contents[i] as HTMLElement
                });                
            }
            return list;
        }

        /**
         * Ação: Expandir todos os módulos.
         */
        public expandModules(): void {
            const modules = this.getModules();
            for (const i in modules)
                if (modules[i].content.classList.contains("hidden")) 
                    modules[i].click.click();
        }

        /**
         * Ação: Fechar todos os módulos.
         */
        public collapseModules(): void {
            const modules = this.getModules();
            for (const i in modules)
                if (!modules[i].content.classList.contains("hidden")) 
                    modules[i].click.click();
        }

        /**
         * Ação: Fechar todas as janelas dos módulos.
         */
        public closeModuleDialogs(): void {
            const modules = this.getDialogs();
            for (const i in modules)
                if (!modules[i].content.classList.contains("hidden")) 
                    modules[i].click.click();
        }

        /**
         * Renderizador do React.
         * @returns {JSX.Element}
         */
        public render(): JSX.Element {            
            return (
                <div id={this.id()} className={this.className()}>
                    <a href="#" className="text-shadow dialog-action" data-action="expandModules" onClick={this.onClick} title={this.translate("Expand all modules")}><i className="fas fa-caret-square-down"></i></a>
                    <a href="#" className="text-shadow dialog-action" data-action="collapseModules" onClick={this.onClick} title={this.translate("Collapse all modules")}><i className="fas fa-caret-square-up"></i></a>
                    <a href="#" className="text-shadow dialog-action" data-action="closeModuleDialogs" onClick={this.onClick} title={this.translate("Close all the module windows")}><i className="fas fa-times-circle"></i></a>
                    <div className="separator"></div>
                </div>
            );
        }
    }
}
