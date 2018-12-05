namespace Skript.Part.System.Parameters {

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
                width: calc(100% - 167px) !important;
                margin-bottom: ${this.theme.spacing}px;
                display: inline-block;
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
            ${this.selector()} > .controls.top {
                display: inline-block;
                float: right;
            }            
            ${this.selector()} > .controls.top > * {
                margin: 0 0 0 ${this.theme.spacing / 2}px;
            }
            ${this.selector()} > .controls.bottom {
                margin-top: ${this.theme.spacing / 2}px;
                text-align: right;
                padding-bottom: 2px;
            }
            ${this.selector()} > .controls.bottom > * {
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

            this.onChange = this.onChange.bind(this);
            this.onActionDeleteClick = this.onActionDeleteClick.bind(this);
            this.onActionReloadClick = this.onActionReloadClick.bind(this);
            this.onActionSaveClick = this.onActionSaveClick.bind(this);
            this.onActionApplyClick = this.onActionApplyClick.bind(this);

            this.elSelectParameter = React.createRef();
            this.elAceEditorJson = React.createRef();

            this.load();

            this.myMessageBus.push(new ParametersBus(this));
        }

        /**
         * Controle para seleção do parâmetro.
         * @type {React.RefObject<Layout.ReactJs.Component.Select>}
         */
        private elSelectParameter: React.RefObject<Layout.ReactJs.Component.Select>;
        
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
         * Prefixo usado no valor dos parâmetros de usuário.
         * @type {string}
         */
        private prefixValue: string = "user: ";

        /**
         * Parâmetros atuais.
         * @type {{[name: string]: Object}}
         */
        private currentParameters: {[name: string]: Object} = { };

        /**
         * Carrega lista de parâmetros
         */
        public load(): void {
            const message = new Automation.Message.GetSavedParameters().sendSync();
            if (!message.result) throw new Core.Errors.NullNotExpected("Message.GetParameters.result");
            this.currentParameters = message.result.parameters ? message.result.parameters : { };
            setTimeout(() => { if (this.elSelectParameter.current) this.elSelectParameter.current.value(""); }, 1);
            this.forceUpdate();
        }

        /**
         * Atualiza a exibição do componente.
         */
        public forceUpdate(): void {
            if (this.elSelectParameter.current) super.forceUpdate();
        }

        /**
         * Evento ao mudar seleção do select parameter.
         * @param {Core.KeyValue[]} values Valores atuais.
         */
        private onChange(values: Core.KeyValue<string>[]): void {
            if (!this.elAceEditorJson.current || !this.elAceEditorJson.current.parentElement || !this.objAceEditorJson) return;

            if (!Array.isArray(values) || values.length > 1) throw new Core.Errors.InvalidArgument(`Parameters.onChange(values.length(${Array.isArray(values) ? values.length : typeof(values)}) <= 1`);

            let message;

            if (values.length === 0) {
                if (this.objAceEditorJson.getValue().length) this.elAceEditorJson.current.parentElement.classList.add('edicao');
            }
            else switch (values[0].key) {
                case "current":
                    message = new Automation.Message.GetCurrentSettings().sendSync();
                    if (!message.result) throw new Core.Errors.NullNotExpected("Message.GetCurrentSettings.result");
                    this.setJson(message.result.settings);
                    break;
                case "default":
                    message = new Automation.Message.GetDefaultSettings().sendSync();
                    if (!message.result) throw new Core.Errors.NullNotExpected("Message.GetDefaultSettings.result");
                    this.setJson(message.result.settings);
                    break;
                default: 
                    this.setJson(this.currentParameters[values[0].key.substr(this.prefixValue.length)]);
            }
        }

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
            this.elAceEditorJson.current.parentElement.classList.remove('edicao');
        }

        /**
         * Ação: apagar parâmetro.
         */
        private onActionDeleteClick(): void {
            if (!this.elSelectParameter.current) return;
            const value = this.elSelectParameter.current.value();
            if (!value.length) this.toast("Before deleting, select a parameter.", null, Core.Log.Level.Warning);
            else if (value[0].key.indexOf(this.prefixValue) !== 0) this.toast("System parameters can not be deleted.", null, Core.Log.Level.Warning);
            else {
                const name = value[0].key.substr(this.prefixValue.length);
                this.confirm("The deletion of parameter \"{0}\" will be irreversible. Do it anyway?", name).then(() => 
                    new Automation.Message.DeleteParameter(name).sendSync());
            }
        }

        /**
         * Ação: recarregar definições so parâmetro selecionado.
         */
        private onActionReloadClick(): void {
            if (!this.elSelectParameter.current) return;
            const value = this.elSelectParameter.current.value();
            this.onChange(value);
            if (!value.length) this.setJson("");
        }

        /**
         * Ação: savar definições em um parâmetro.
         */
        private onActionSaveClick(): void {
            if (!this.objAceEditorJson || !this.elSelectParameter.current) return;

            let json: Object;
            try {
                json = JSON.parse(this.objAceEditorJson.getValue());
            } catch (error) {
                this.error("Settings are not valid.\n{0}.", (error as Error).message);
                return;
            }

            const currentParameter = this.elSelectParameter.current.value();            
            const currentParameterName = currentParameter.length === 0 || currentParameter[0].key.indexOf(this.prefixValue) !== 0 ? "" : currentParameter[0].value;
            this.prompt("Save these settings in what parameter?", undefined, currentParameterName).then(name => {
                new Automation.Message.SaveSettingsToParameter(name, json).sendSync();
                setTimeout(() => { if (this.elSelectParameter.current) this.elSelectParameter.current.value(this.prefixValue + name); }, 1);
            });
        }

        /**
         * Ação: aplicar definições nos módulos.
         */
        private onActionApplyClick(): void {
            if (!this.objAceEditorJson) return;

            let json: Object;
            try {
                json = JSON.parse(this.objAceEditorJson.getValue());
            } catch (error) {
                this.error("Settings are not valid.\n{0}.", (error as Error).message);
                return;
            }

            const message = new Automation.Message.ApplySettings(json).sendSync();
            if (!message.result) throw new Core.Errors.NullNotExpected("Message.ApplySettings.result");
            if (message.result.errors && message.result.errors.length) {
                this.error(
                    this.translate("Applying the settings resulted in the following errors:") + "\n" + 
                    message.result.errors.join("\n"));
            }
        }

        /**
         * Renderizador do React.
         * @returns {JSX.Element}
         */
        protected renderContent(): JSX.Element {            
            return (
                <div id={this.id()} className={this.className()}>
                    <Layout.ReactJs.Component.Select className="set" ref={this.elSelectParameter} onChange={this.onChange} allowClear={true} placeholder={this.translate("Select a parameter...")}>
                        <optgroup label={this.translate("System")}>
                            <option value="default">{this.translate("Default")}</option>
                            <option value="current">{this.translate("Current")}</option>
                        </optgroup>
                        <optgroup label={Object.keys(this.currentParameters).length === 0 ? this.translate("No user parameter.") : this.translate("User parameter")}>
                            {Object.keys(this.currentParameters).sort().map(v => 
                                <option key={v} value={this.prefixValue + v}>{v}</option>
                            )}
                        </optgroup>
                    </Layout.ReactJs.Component.Select>
                    <div className="controls top">
                        <button className="dialog-action button red" title={this.translate("Deletes the selected parameter.")} onClick={this.onActionDeleteClick}>{this.translate("Delete")}</button>
                        <button className="dialog-action button" title={this.translate("Reload the settings of the selected parameter.")} onClick={this.onActionReloadClick}>{this.translate("Reload")}</button>
                    </div>
                    <div className="json"><div id={this.idAceEditorJson} ref={this.elAceEditorJson}></div></div>
                    <div className="controls bottom">
                        <button className="dialog-action button green" title={this.translate("Saves the current settings.")} onClick={this.onActionSaveClick}>{this.translate("Save")}</button>
                        <button className="dialog-action button blue" title={this.translate("Applies the current settings to the modules.")} onClick={this.onActionApplyClick}>{this.translate("Apply")}</button>
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
                if (!this.elAceEditorJson.current.parentElement.classList.contains('edicao')) 
                    this.elAceEditorJson.current.parentElement.classList.add('edicao'); });
            
            const elSelectParameter = this.elSelectParameter.current;
            setTimeout(() => elSelectParameter.value(""), 1);
        }
    }

    new Part("Parameters", Parameters);
}
