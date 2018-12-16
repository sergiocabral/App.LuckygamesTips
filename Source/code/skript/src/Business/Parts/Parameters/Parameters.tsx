namespace Skript.Business.Parts.Parameters {

    /**
     * Componente: Principal do módulo.
     */
    export class Parameters extends Layout.Components.DialogHeader.Content {

        /**
         * Carrega e aplica os estilos css.
         */
        public css(): string {
            return `
                ${this.classNameSelectorInDialog()} {
                    position: absolute;
                    top: ${this.theme.spacing}px;
                    left: ${this.theme.spacing}px;
                    bottom: ${this.theme.spacing}px;
                    right: ${this.theme.spacing}px;
                }
                ${this.classNameSelector()} > .set + .select2 {
                    width: calc(100% - 190px) !important;
                    margin-bottom: ${this.theme.spacing}px;
                    display: inline-block;
                }
                ${this.classNameSelector()} .select2 span.select2-selection.select2-selection--single {
                    outline: none;
                }
                ${this.classNameSelector()} .select2 .select2-selection__rendered {
                    line-height: 25px;
                }
                ${this.classNameSelectorOutDialog()} > .json > div {
                    height: 180px;
                }
                ${this.classNameSelectorInDialog()} > .json {
                    height: calc(100% - 78px);
                }
                ${this.classNameSelectorInDialog()} > .json > div {
                    height: 100%;
                }
                ${this.classNameSelector()} > .json.editing .ace_editor .ace_gutter {
                    background-color: brown;
                }
                ${this.classNameSelector()} > .controls.top {
                    display: inline-block;
                    float: right;
                }            
                ${this.classNameSelector()} > .controls.top > * {
                    margin: 0 0 0 ${this.theme.spacing / 2}px;
                }
                ${this.classNameSelector()} > .controls.bottom {
                    margin-top: ${this.theme.spacing / 2}px;
                    text-align: right;
                    padding-bottom: 2px;
                }
                ${this.classNameSelector()} > .controls.bottom > * {
                    margin: ${this.theme.spacing / 2}px 0 0 ${this.theme.spacing / 2}px;
                }
            `;
        }

        /**
         * Construtor.
         * @param {Framework.Layout.Components.EmptyProps} props Propriedades.
         */
        public constructor(props: Framework.Layout.Components.EmptyProps) {
            super(props);  
            
            this.title = "Operating Parameters";
            this.icon = "fas fa-users-cog";

            this.elAceEditorJson = React.createRef();
            this.elSelectParameter = React.createRef();
        }

        /**
         * Controle para seleção do parâmetro.
         * @type {React.RefObject<Framework.Layout.Components.Select.Select>}
         */
        private elSelectParameter: React.RefObject<Framework.Layout.Components.Select.Select>;

        /**
         * Id para componente AceEditor para o campo json.
         * @type {string}
         */
        private idAceEditorJson: string = Framework.Util.Text.random();

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
         * Prefixo usado no valor dos parâmetros de usuário.
         * @type {string}
         */
        private prefixValue: string = "user: ";

        /**
         * Define um conteúdo json no AceEditor.
         * @param json json
         */
        private setJson(json: string|Object): void {
            const text = typeof(json) === "string" ? json : (json ? JSON.stringify(json, null, this.jsonTabSize) : "");
            if (!this.objAceEditorJson || !this.elAceEditorJson.current || !this.elAceEditorJson.current.parentElement) return;
            this.objAceEditorJson.setValue(text);
            this.objAceEditorJson.selection.clearSelection();
            this.objAceEditorJson.selection.moveCursorFileStart();
            this.elAceEditorJson.current.parentElement.classList.remove('editing');
        }
        
        /**
         * Adiciona ações e parâmetros para automação deste componente.
         * @param {Framework.Types.Index<Framework.Types.Parameter<any>>} parameters Parâmetros.
         * @param {Framework.Types.Index<Framework.Types.Action>} actions Ações.
         */
        protected configureAutomation(parameters: Framework.Types.Index<Framework.Types.Parameter<any>>, actions: Framework.Types.Index<Framework.Types.Action>): void {
            parameters;
            actions;
            this.setJson;
        }

        /**
         * Renderizador do React.
         * @returns {JSX.Element}
         */
        protected renderContent(): JSX.Element {            
            return (
                <div id={this.id} className={this.classNameAttribute()}>
                    <Framework.Layout.Components.Select.Select 
                        ref={this.elSelectParameter}
                        className="set" 
                        allowClear={true} 
                        placeholder={"Select a parameter...".translate()}>
                        <optgroup label={"System".translate()}>
                            <option value="default">{"Default".translate()}</option>
                            <option value="current">{"Current".translate()}</option>
                        </optgroup>
                        <optgroup label={Object.keys({}).length === 0 ? "No custom parameter".translate() : "Custom".translate()}>
                            {Object.keys({}).sort().map(v => 
                                <option key={v} value={this.prefixValue + v}>{v}</option>
                            )}
                        </optgroup>
                    </Framework.Layout.Components.Select.Select>
                    <div className="controls top">
                        <button className="dialog-action button red" title={"Deletes the selected parameter.".translate()}>{"Delete".translate()}</button>
                        <button className="dialog-action button" title={"Reload the settings of the selected parameter.".translate()}>{"Reload".translate()}</button>
                    </div>
                    <div className="json"><div id={this.idAceEditorJson} ref={this.elAceEditorJson}></div></div>
                    <div className="controls bottom">
                        <button className="dialog-action button green" title={"Saves the current settings.".translate()}>{"Save".translate()}</button>
                        <button className="dialog-action button blue" title={"Applies the current settings to the modules.".translate()}>{"Apply".translate()}</button>
                    </div>
                </div>
            );
        }

        /**
         * Após montagem do componente.
         */
        public componentDidMount(): void {
            if (!this.elAceEditorJson.current || !this.elSelectParameter.current) return;

            this.objAceEditorJson = (window as any).ace.edit(this.idAceEditorJson);
            this.objAceEditorJson.setTheme("ace/theme/twilight");
            this.objAceEditorJson.session.setMode("ace/mode/json");
            this.objAceEditorJson.session.setTabSize(this.jsonTabSize);
            this.objAceEditorJson.session.setUseWrapMode(true);
            this.objAceEditorJson.on('change', () => {
                if (!this.elAceEditorJson.current || !this.elAceEditorJson.current.parentElement) return; 
                if (!this.elAceEditorJson.current.parentElement.classList.contains('editing')) 
                    this.elAceEditorJson.current.parentElement.classList.add('editing'); });
            
            this.elSelectParameter.current.value("");
        }

        /**
         * Evento ao redimensionar.
         */
        protected onResize(): void {
            if (!this.objAceEditorJson) return;
            this.objAceEditorJson.resize();
        }
    }

    Base.toAppendToMainDialog.push(Parameters);
}
