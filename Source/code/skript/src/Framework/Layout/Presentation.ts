namespace Skript.Framework.Layout {
    
    /**
     * Organiza e manipula o layout.
     */
    export class Presentation {

        /**
         * Construtor.
         * @param {PresentationConfiguration} configuration Configuração de inicialização da classe.
         */
        public constructor(public configuration: PresentationConfiguration) {
            this.stylesheet();

            const container: HTMLDivElement = document.createElement('div') as HTMLDivElement;
            container.id = Util.Text.random();
            container.className = configuration.className;
            document.body.appendChild(container);
            this.container = container;
            console.Log("Created main container: <{tagName} id=\"{id}\" />", container, "Layout.Presentation", container);

            this.container3rdParty = this.createContainer(configuration.className + "3rdParty");
        }

        /**
         * Carrega e aplica os estilos css.
         */
        public stylesheet(): void {
            const selector = `.${this.configuration.className}`;
            Util.DOM.stylesheet(`
                ${selector} {
                    text-align: left;
                }
                ${selector} li:before {
                    display: none;
                }
            `);
        }

        /**
         * Container HTML para todos os componentes.
         * @type {HTMLDivElement}
         */
        public container: HTMLDivElement;

        /**
         * Container HTML para componentes de terceiros.
         * @type {HTMLDivElement}
         */
        public container3rdParty: HTMLDivElement;

        /**
         * Cria um container para receber um componente independente.
         * @param {string} className Define o valor da class css.
         * @returns {HTMLDivElement} Container criado.
         */
        public createContainer(className?: string): HTMLDivElement {
            const container = document.createElement('div');
            container.id = Util.Text.random();
            if (className) container.className = className;
            this.container.appendChild(container);
            console.Log("Created child container: <{tagName} id=\"{id}\" class=\"{className}\" />", container, "Layout.Presentation", container);
            return container;
        }
    }
}