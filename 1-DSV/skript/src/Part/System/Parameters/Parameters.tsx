namespace Skript.Part.System.MainHeader {

    /**
     * Componente principal do módulo.
     */
    export class Parameters extends Layout.ReactJs.DialogComponentBase<Layout.ReactJs.EmptyProps, Partial<Layout.ReactJs.EmptyState>> {

        /**
         * Código CSS para este componente.
         */
        protected stylesheet: string = `
            ${this.selector()} {
            }            
            ${this.selector()} .json > div {
                height: 180px;
            }
            ${this.selector()} .json.edicao .ace_editor .ace_gutter {
                background-color: brown;
            }
        `;

        /**
         * Construtor.
         * @param {Layout.ReactJs.EmptyProps} props Propriedades.
         */
        public constructor(props: Layout.ReactJs.EmptyProps) {
            super(props);  
            
            this.title = this.translate("Parameters to initialization");
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
            return JSON.stringify({ teste: 123, ops: "hahaha" }, null, this.jsonTabSize);
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
                    <div className="json"><div id={this.idAceEditorJson} ref={this.elAceEditorJson}></div></div>
                    <div>teste</div>
                    <Layout.ReactJs.Component.Select values={[
                        { key: "valor1", value: "Opção 1" },
                        { key: "valor2", value: "Opção 2" },
                        { key: "valor3", value: "Opção 3", state: true },
                        { key: "valor4", value: "Opção 4" }
                    ]} />
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

            this.setJson(this.json());
        }
    }

    new Part("Parameters", Parameters);
}
