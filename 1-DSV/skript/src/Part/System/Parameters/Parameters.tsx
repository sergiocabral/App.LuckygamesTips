namespace Skript.Part.System.MainHeader {

    /**
     * Componente principal do módulo.
     */
    export class Parameters extends Layout.ReactJs.DialogComponentBase<Layout.ReactJs.EmptyProps, Partial<Layout.ReactJs.EmptyState>> {

        /**
         * Código CSS para este componente.
         */
        protected stylesheet: string = `
            ${this.selectorInDialog()} {
                position: absolute;
                top: ${this.theme.spacing}px;
                left: ${this.theme.spacing}px;
                bottom: ${this.theme.spacing}px;
                right: ${this.theme.spacing}px;
            }
            ${this.selector()} > .set + .select2 {
                width: 100% !important;
                margin-bottom: ${this.theme.spacing}px;
            }
            ${this.selector()} span.select2-selection.select2-selection--single {
                outline: none;
            }
            ${this.selectorOutDialog()} > .json > div {
                height: 180px;
            }
            ${this.selectorInDialog()} > .json {
                height: calc(100% - 78px);
            }
            ${this.selectorInDialog()} > .json > div {
                height: 100%;
            }
            ${this.selector()} > .json.edicao .ace_editor .ace_gutter {
                background-color: brown;
            }
            ${this.selector()} > .controls {
                margin-top: ${this.theme.spacing / 2}px;
                text-align: right;
                padding-bottom: 2px;
            }
            ${this.selector()} > .controls > * {
                margin: ${this.theme.spacing / 2}px 0 0 ${this.theme.spacing / 2}px;
            }
        `;

        /**
         * Construtor.
         * @param {Layout.ReactJs.EmptyProps} props Propriedades.
         */
        public constructor(props: Layout.ReactJs.EmptyProps) {
            super(props);  
            
            this.title = "Operating Parameters";
            this.icon = "fas fa-users-cog";

            this.elAceEditorJson = React.createRef();
        }
        
        /**
         * Id para componente AceEditor para o campo json.
         * @type {string}
         */
        private idAceEditorJson: string = Util.Text.random();

        /**
         * Elemento container do AceEditor para o campo json.
         * @type {React.RefObject<HTMLDivElement>}
         */
        private elAceEditorJson: React.RefObject<HTMLDivElement>;

        /**
         * Referência para o AceEditor para o campo json.
         * @type {any}
         */
        private objAceEditorJson?: any;

        /**
         * Espaçamento do TAB na formatação do json.
         * @type {number}
         */
        private jsonTabSize: number = 2;

        /**
         * Parâmetros atuais como json
         * @returns {string} json
         */
        public json(): string {
            const message = new Automation.Message.GetCurrentParameters().sendSync();
            if (!message.result) throw new Core.Errors.NullNotExpected("Message.GetCurrentParameters.result");
            return JSON.stringify(message.result.parameters, null, this.jsonTabSize);
        }

        /**
         * Define um conteúdo json no AceEditor.
         * @param json json
         */
        private setJson(json: string): void {
            if (!this.objAceEditorJson || !this.elAceEditorJson.current || !this.elAceEditorJson.current.parentElement) return;
            this.objAceEditorJson.setValue(json);
            this.objAceEditorJson.selection.clearSelection();
            this.objAceEditorJson.selection.moveCursorFileStart();
            this.elAceEditorJson.current.parentElement.classList.remove('edicao');
        }

        /**
         * Renderizador do React.
         * @returns {JSX.Element}
         */
        protected renderContent(): JSX.Element {            
            return (
                <div id={this.id()} className={this.className()}>
                    <Layout.ReactJs.Component.Select className="set">
                        <option>{this.translate("Default")}</option>
                        <option>{this.translate("Current")}</option>
                    </Layout.ReactJs.Component.Select>
                    <div className="json"><div id={this.idAceEditorJson} ref={this.elAceEditorJson}></div></div>
                    <div className="controls">
                        <button className="button red" title={this.translate("Deletes the selected parameter.")}>{this.translate("Delete")}</button>
                        <button className="button green" title={this.translate("Saves the current settings to the selected parameter.")}>{this.translate("Save")}</button>
                        <button className="button" title={this.translate("Save the current settings as a new parameter.")}>{this.translate("Save As")}</button>
                        <button className="button" title={this.translate("Reload the settings of the selected parameter.")} disabled>{this.translate("Reload")}</button>
                        <button className="button blue" title={this.translate("Applies the current settings to the modules.")}>{this.translate("Apply")}</button>
                    </div>
                </div>
            );
        }

        /**
         * Após montagem do componente.
         */
        public componentDidMount(): void {
            if (!this.elAceEditorJson.current) return;

            this.objAceEditorJson = (window as any).ace.edit(this.idAceEditorJson);
            this.objAceEditorJson.setTheme("ace/theme/twilight");
            this.objAceEditorJson.session.setMode("ace/mode/json");
            this.objAceEditorJson.session.setTabSize(this.jsonTabSize);
            this.objAceEditorJson.session.setUseWrapMode(true);
            this.objAceEditorJson.on('change', () => {
                if (!this.elAceEditorJson.current || !this.elAceEditorJson.current.parentElement) return; 
                if (!this.elAceEditorJson.current.parentElement.classList.contains('edicao')) 
                    this.elAceEditorJson.current.parentElement.classList.add('edicao'); });

            setTimeout(() => this.setJson(this.json()), 1000);
        }
    }

    new Part("Parameters", Parameters);
}
