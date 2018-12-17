namespace Skript.Business.Parts.AutomationManager {

    /**
     * Componente: Principal do módulo.
     */
    export class AutomationManager extends Layout.Components.DialogHeader.Content {

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
            
            this.title = "Automation";
            this.icon = "fas fa-users-cog";

            this.elAceEditorJson = React.createRef();
            this.elSelectParameter = React.createRef();

            this.onDeleteClick = this.onDeleteClick.bind(this);
            this.onReloadClick = this.onReloadClick.bind(this);
            this.onSaveClick = this.onSaveClick.bind(this);
            this.onApplyClick = this.onApplyClick.bind(this);
            this.onParameterChange = this.onParameterChange.bind(this);

            this.toCaptureOff.push(Framework.Bus.Message.capture(Messages.DidPartsLoaded, this, this.onDidPartsLoaded));
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
         * Definições padrão do sistema.
         * @type {Object}
         */
        private defaults: Object = { };

        /**
         * Mensagem: ao carregar módulos.
         */
        private onDidPartsLoaded(): void {
            this.defaults = this.extractJson(new Messages.GetAutomations().request().automations);
        }

        /**
         * Adiciona ações e parâmetros para automação deste componente.
         * @param {Framework.Types.Index<Framework.Types.Parameter<any>>} parameters Parâmetros.
         * @param {Framework.Types.Index<Framework.Types.Action>} actions Ações.
         */
        protected configureAutomation(parameters: Framework.Types.Index<Framework.Types.Parameter<any>>, actions: Framework.Types.Index<Framework.Types.Action>): void {
            parameters;
            actions;
        }

        /**
         * Evento: Apagar parâmetro.
         */
        private onDeleteClick(): void {
            if (!this.elSelectParameter.current) return;
        }

        /**
         * Evento: Recarregar definições do parâmetro.
         */
        private onReloadClick(): void {
            this.setJson("");
            if (!this.elSelectParameter.current) return;
            const value = this.elSelectParameter.current.value();
            if (value.length) switch (value[0].key) {
                case "default":
                    this.setJson(this.defaults);
                    break;
                case "current":
                    this.setJson(this.extractJson(new Messages.GetAutomations().request().automations));
                    break;
            }
        }

        /**
         * Evento: Gravar definições como parâmetro.
         */
        private onSaveClick(): void {
            if (!this.elSelectParameter.current) return;
        }

        /**
         * Evento: Aplicar definições.
         */
        private onApplyClick(): void {
            if (!this.objAceEditorJson) return;
            try {
                const json: Object = JSON.parse(this.objAceEditorJson.getValue());
                const message = new Messages.DoAutomationApply(json).request();
                if (!message.success || !message.errors) throw new Framework.Errors.EmptyValue("Messages.DoAutomationApply.success or Messages.DoAutomationApply.errors");
                if (message.errors.length) console.Error("<ol><li>" + message.errors.join("</li><li>") + "</li></ol>", "Error applying settings");
            } catch (error) {                
                console.Error("Settings are not valid.\n{0}.".translate((error as Error).message), "Error applying settings");
            }
        }
        
        /**
        * Evento: ao selecionar parâmetro.
        */
        private onParameterChange(): void {
            this.onReloadClick();
        }

        /**
         * Extrai os dados json de um conjunto de informação de automação.
         * @param automations Dados de automação.
         * @returns {Object} Objeto pronto para ser convertido em JSON.
         */
        private extractJson(automations?: Framework.Types.Index<Automation.Set>): Object {
            const result: Framework.Types.Index<Framework.Types.Index<any>> = { };
            if (automations) {
                for (const automation in automations) {
                    result[automation] = { };
                    if (automations[automation].parameters) {
                        for (const parameter in automations[automation].parameters) {
                            result[automation][automations[automation].parameters[parameter].name] =
                            automations[automation].parameters[parameter].get();
                        }
                    }
                    if (automations[automation].actions) {
                        for (const action in automations[automation].actions) {
                            result[automation][Automation.Manager.actionProperty] = result[automation][Automation.Manager.actionProperty] || { };
                            result[automation][Automation.Manager.actionProperty][automations[automation].actions[action].name] = false;
                        }
                    }
                    if (!Object.keys(result[automation]).length) delete result[automation];
                }
            }
            return result;
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
                        placeholder={"Select a parameter...".translate()}
                        onChange={this.onParameterChange}>
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
                        <button className="dialog-action button red" onClick={this.onDeleteClick} title={"Deletes the selected parameter.".translate()}>{"Delete".translate()}</button>
                        <button className="dialog-action button" onClick={this.onReloadClick} title={"Reload the settings of the selected parameter.".translate()}>{"Reload".translate()}</button>
                    </div>
                    <div className="json"><div id={this.idAceEditorJson} ref={this.elAceEditorJson}></div></div>
                    <div className="controls bottom">
                        <button className="dialog-action button green" onClick={this.onSaveClick} title={"Saves the current settings.".translate()}>{"Save".translate()}</button>
                        <button className="dialog-action button blue" onClick={this.onApplyClick} title={"Applies the current settings to the modules.".translate()}>{"Apply".translate()}</button>
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
            
            const elSelectParameter = this.elSelectParameter.current;
            setTimeout(() => elSelectParameter.value("current"), 0);
        }

        /**
         * Evento ao redimensionar.
         */
        protected onResize(): void {
            if (!this.objAceEditorJson) return;
            this.objAceEditorJson.resize();
        }
    }

    Base.toAppendToMainDialog.push(AutomationManager);
}
