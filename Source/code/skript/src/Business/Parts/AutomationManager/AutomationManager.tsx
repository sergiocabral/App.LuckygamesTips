namespace Skript.Business.Parts.AutomationManager {

    /**
     * Componente: Principal do módulo.
     */
    export class AutomationManager extends Layout.Components.DialogHeader.Content<Framework.Layout.Components.EmptyProps, State> {

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
            this.elSelectAutomationSet = React.createRef();

            this.onDeleteClick = this.onDeleteClick.bind(this);
            this.onReloadClick = this.onReloadClick.bind(this);
            this.onSaveClick = this.onSaveClick.bind(this);
            this.onApplyClick = this.onApplyClick.bind(this);
            this.onAutomationSetChange = this.onAutomationSetChange.bind(this);

            this.toCaptureOff.push(Framework.Bus.Message.capture(Messages.DidPartsLoaded, this, this.onDidPartsLoaded));
            this.toCaptureOff.push(Framework.Bus.Message.capture(Messages.DidAutomationUpdated, this, this.onDidAutomationUpdated));
            this.toCaptureOff.push(Framework.Bus.Message.capture(Messages.DidAutomationApplied, this, this.onDidAutomationApplied));
            this.state = { automationSets: [ ] };
        }

        /**
         * Carrega a lista de conjunto de automações.
         */
        private loadAutomationSetList(): void {
            const automations = new Messages.GetSavedAutomations().request().automations;
            if (!automations) throw new Framework.Errors.EmptyValue("Messages.GetSavedAutomations.automations");
            this.setState({ automationSets: Object.keys(automations) });
        }

        /**
         * Controle para seleção do conjunto de automação
         * @type {React.RefObject<Framework.Layout.Components.Select.Select>}
         */
        private elSelectAutomationSet: React.RefObject<Framework.Layout.Components.Select.Select>;

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
         * @param {string|Object} json json
         * @param {boolean} setEditing Opcional. Define o indicador de edição.
         */
        private json(json?: string|Object, setEditing: boolean = false): string {
            if (!this.objAceEditorJson || !this.elAceEditorJson.current || !this.elAceEditorJson.current.parentElement) return "";
            if (json !== undefined) {
                const text = typeof(json) === "string" ? json : (json ? JSON.stringify(json, null, this.jsonTabSize) : "");
                this.objAceEditorJson.setValue(text);
                this.objAceEditorJson.selection.clearSelection();
                this.objAceEditorJson.selection.moveCursorFileStart();
                this.jsonEditing(setEditing);
            }
            return this.objAceEditorJson.getValue();
        }

        /**
         * Define o modo de edição para o editor de definições.
         * @param {boolean} mode Opcional. Define a edição.
         * @return {boolean}  Modo atual.
         */
        private jsonEditing(mode?: boolean): boolean {
            if (!this.elAceEditorJson.current || !this.elAceEditorJson.current.parentElement) throw new Framework.Errors.InvalidExecution("elAceEditorJson is not initialized.");
            const className = 'editing';
            if (mode !== undefined) {
                if (mode) this.elAceEditorJson.current.parentElement.classList.add(className);
                else this.elAceEditorJson.current.parentElement.classList.remove(className);
            }
            return this.elAceEditorJson.current.parentElement.classList.contains(className);
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
            this.defaults = this.extractJson(new Messages.GetCurrentAutomations().request().automations);
            if (this.elSelectAutomationSet.current) this.elSelectAutomationSet.current.value("default");
        }

        /**
         * Mensagem: ao aplicar definições nos módulos.
         */
        private onDidAutomationApplied(): void {
            if (!this.elSelectAutomationSet.current || !this.objAceEditorJson) return;
            const selected = this.elSelectAutomationSet.current.value();
            if (selected.length && selected[0].key === "current") this.jsonEditing(true);
        }

        /**
         * Mensagem: Ao atualiza um conjunto de automação.
         * @param {Messages.DidAutomationUpdated} message Mensagem
         */
        private onDidAutomationUpdated(message: Messages.DidAutomationUpdated): void {
            if (!this.elSelectAutomationSet.current || !this.objAceEditorJson) return;
            const selected = this.elSelectAutomationSet.current.value();
            const json = this.json();
            if (!message.edited) this.loadAutomationSetList();
            if (selected.length && selected[0].key.substr(this.prefixValue.length) === message.name) {
                if (message.deleted) {
                    this.elSelectAutomationSet.current.value([]);
                    this.json(json, true);
                }
                else this.jsonEditing(true);
            }
        }

        /**
         * Adiciona ações e parâmetros para automação deste componente.
         * @param {Framework.Types.Index<Framework.Types.Parameter<any>>} automationSet Conjunto de automação
         * @param {Framework.Types.Index<Framework.Types.Action>} actions Ações.
         * @returns {string} Nome do módulo.
         */
        protected configureAutomation(automationSet: Framework.Types.Index<Framework.Types.Parameter<any>>, actions: Framework.Types.Index<Framework.Types.Action>): string {
            automationSet;
            actions;
            return "Automation";
        }

        /**
         * Evento: Apagar parâmetro.
         */
        private onDeleteClick(): void {
            if (!this.elSelectAutomationSet.current) return;
            const value = this.elSelectAutomationSet.current.value();
            if (!value.length) this.toast.post("Before deleting select a automation set.", null, Framework.Log.Level.Warning);
            else if (value[0].key.indexOf(this.prefixValue) !== 0) this.toast.post("System automation sets can not be deleted.", null, Framework.Log.Level.Warning);
            else {
                const name = value[0].key.substr(this.prefixValue.length);
                console.Confirm("The deletion of automation set \"{0}\" will be irreversible. Do it anyway?".translate(name)).then(() =>
                    new Messages.DoAutomationDelete(name).send());
            }
        }

        /**
         * Evento: Recarregar definições do parâmetro.
         */
        private onReloadClick(): void {
            this.json("");
            if (!this.elSelectAutomationSet.current) return;
            const value = this.elSelectAutomationSet.current.value();
            if (value.length) switch (value[0].key) {
                case "default":
                    this.json(this.defaults);
                    break;
                case "current":
                    this.json(this.extractJson(new Messages.GetCurrentAutomations().request().automations));
                    break;
                default:
                    const automations = new Messages.GetSavedAutomations().request().automations;
                    if (!automations) throw new Framework.Errors.EmptyValue("Messages.GetSavedAutomations.automations");
                    this.json(automations[value[0].key.substr(this.prefixValue.length)]);
                    break;
            }
        }

        /**
         * Evento: Gravar definições como parâmetro.
         */
        private onSaveClick(): void {
            if (!this.objAceEditorJson || !this.elSelectAutomationSet.current) return;
            const elSelectAutomationSet = this.elSelectAutomationSet.current;

            let json: Object;
            try {
                json = JSON.parse(this.objAceEditorJson.getValue());
            } catch (error) {
                console.Error("Settings are not valid.\n{0}.".translate((error as Error).message), "Error applying settings");
                return;
            }

            const currentAutomationSet = elSelectAutomationSet.value();
            const currentAutomationSetName = currentAutomationSet.length === 0 || currentAutomationSet[0].key.indexOf(this.prefixValue) !== 0 ? "" : currentAutomationSet[0].value;
            console.Prompt("Save these settings in what automation set?", undefined, currentAutomationSetName, name => name.trim().length > 0).then(name => {
                if (name) {
                    new Messages.DoAutomationSave(name, json).send();
                    setTimeout(() => { elSelectAutomationSet.value(this.prefixValue + name); }, 1);
                }
            });
        }

        /**
         * Evento: Aplicar definições.
         */
        private onApplyClick(): void {
            if (!this.objAceEditorJson || !this.elSelectAutomationSet.current) return;

            const selected = this.elSelectAutomationSet.current.value();
            const jsonEditing = this.jsonEditing();

            try {
                const json: Object = JSON.parse(this.objAceEditorJson.getValue());
                const message = new Messages.DoAutomationApply(json).request();
                if (!message.success || !message.errors) throw new Framework.Errors.EmptyValue("Messages.DoAutomationApply.success or Messages.DoAutomationApply.errors");
                if (message.errors.length) console.Error("<ol><li>" + message.errors.join("</li><li>") + "</li></ol>", "Error applying settings");
                if (message.success.length && !jsonEditing && selected.length && selected[0].key === "current") this.jsonEditing(false);
            } catch (error) {
                console.Error("Settings are not valid.\n{0}.".translate((error as Error).message), "Error applying settings");
            }
        }

        /**
        * Evento: ao selecionar parâmetro.
        */
        private onAutomationSetChange(): void {
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
                        ref={this.elSelectAutomationSet}
                        className="set"
                        allowClear={true}
                        placeholder={"Select a automation set...".translate()}
                        onChange={this.onAutomationSetChange}>
                        <optgroup label={"System".translate()}>
                            <option value="default">{"Default".translate()}</option>
                            <option value="current">{"Current".translate()}</option>
                        </optgroup>
                        <optgroup label={this.state.automationSets.length === 0 ? "No custom automation set".translate() : "Custom".translate()}>
                            {this.state.automationSets.slice().sort().map(v =>
                                <option key={v} value={this.prefixValue + v}>{v}</option>
                            )}
                        </optgroup>
                    </Framework.Layout.Components.Select.Select>
                    <div className="controls top">
                        <button className="dialog-action button red" onClick={this.onDeleteClick} title={"Deletes the selected automation set.".translate()}>{"Delete".translate()}</button>
                        <button className="dialog-action button" onClick={this.onReloadClick} title={"Reload the settings of the selected automation set.".translate()}>{"Reload".translate()}</button>
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
            if (!this.elAceEditorJson.current || !this.elSelectAutomationSet.current) return;

            this.loadAutomationSetList();

            this.objAceEditorJson = (window as any).ace.edit(this.idAceEditorJson);
            this.objAceEditorJson.setTheme("ace/theme/twilight");
            this.objAceEditorJson.session.setMode("ace/mode/json");
            this.objAceEditorJson.session.setTabSize(this.jsonTabSize);
            this.objAceEditorJson.session.setUseWrapMode(true);
            this.objAceEditorJson.on('change', () => this.jsonEditing(true));
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
