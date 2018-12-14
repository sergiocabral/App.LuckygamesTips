namespace Skript.Business.Parts.Header {

    /**
     * Componente: Barra de controles.
     */
    export class Controls extends Base {

        /**
         * Carrega e aplica os estilos css.
         */
        public css: string = `
            ${this.classNameSelector()} {
                position: relative;
                top: 2px;
            }
            ${this.classNameSelector()} > .text-shadow {
                font-size: 15px;
                color: ${Framework.Util.Drawing.blend(0.3, this.theme.generalTextColor)};
            }
            ${this.classNameSelector()} > .text-shadow > span {
                margin-left: 5px;
                font-size: 12px;
                position: relative;
                top: -1px;
            }
            ${this.classNameSelector()} > .separator {
                display: inline-block;
                width: ${this.theme.spacing}px;
                margin-right: ${this.theme.spacing}px;
                border-right: 1px solid ${Framework.Util.Drawing.blend(0.3, this.theme.dialogTitleBackgroundColor)};
            }
            ${this.classNameSelector()} > .separator:after {
                content: "\\00a0";
            }
        `;

        /**
         * Construtor.
         * @param {Framework.Layout.Components.EmptyProps} props Propriedades.
         */
        public constructor(props: Framework.Layout.Components.EmptyProps) {
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

            const targets = evt.nativeEvent && Array.isArray(evt.nativeEvent.path) ? evt.nativeEvent.path : Framework.Util.DOM.path(evt.target);
            const button = targets.reduce((a: any, c: any) => a = a || (c.classList && c.classList.contains("text-shadow") ? c : null), null);
            const action = button ? button.getAttribute("data-action") : undefined;

            if ((this as any)[action] instanceof Function) (this as any)[action]();
        }

        /**
         * Obtem a lista de módulos atuais.
         * @returns {{ click: HTMLElement, content: HTMLElement }[]} Array
         */
        private getModules(): { click: HTMLElement, content: HTMLElement }[] {
            const selector = Framework.Layout.Components.Base.getSelector(Framework.Layout.Components.DialogHeader.DialogHeader);
            const clicks = document.querySelectorAll(`${selector} > .title h1`);
            const contents = document.querySelectorAll(`${selector} > .content`);

            if (clicks.length !== contents.length) throw new Framework.Errors.InvalidArgument(`getModules(): headers.length(${clicks.length}) == content.length(${contents.length})`);

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
            const selector = Framework.Layout.Components.Base.getSelector(Framework.Layout.Components.Dialog.Dialog);
            const clicks = document.querySelectorAll(`${selector}.moduleDialog > .header a.close`);
            const contents = document.querySelectorAll(`${selector}.moduleDialog`);

            if (clicks.length !== contents.length) throw new Framework.Errors.InvalidArgument(`getModules(): headers.length(${clicks.length}) == content.length(${contents.length})`);

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
         * Solicita atualização da página.
         */
        public refreshPage(): void {
            console.Confirm("Refreshing the page will cause any activity in progress to be interrupted. Update anyway?")
                .then(() => location.reload());
        }

        /**
         * Renderizador do React.
         * @returns {JSX.Element}
         */
        public render(): JSX.Element { super.render();
            return (
                <div id={this.id} className={this.classNameAttribute()}>
                    <a href="#" className="text-shadow dialog-action" data-action="refreshPage" onClick={this.onClick} title={"Refresh page.".translate()}><i className="fas fa-sync-alt"></i></a>
                    <div className="separator"></div>
                    <a href="#" className="text-shadow dialog-action" data-action="expandModules" onClick={this.onClick} title={"Expand all modules.".translate()}><i className="fas fa-caret-square-down"></i></a>
                    <a href="#" className="text-shadow dialog-action" data-action="collapseModules" onClick={this.onClick} title={"Collapse all modules.".translate()}><i className="fas fa-caret-square-up"></i></a>
                    <a href="#" className="text-shadow dialog-action" data-action="closeModuleDialogs" onClick={this.onClick} title={"Close all the module windows.".translate()}><i className="fas fa-times-circle"></i></a>
                    <div className="separator"></div>
                </div>
            );
        }
    }
}
