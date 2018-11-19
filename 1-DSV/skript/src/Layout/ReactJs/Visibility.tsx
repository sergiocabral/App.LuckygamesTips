namespace Skript.Layout.ReactJs {

    /**
     * Implementa a exibição/esconder suave do elemento.
     */
    export class Visibility {

        /**
         * Construtor.
         * @param owner Elemento.
         */
        public constructor(element: HTMLElement) {
            this.element = element;
            
            this.setStylesheet();

            element.style.visibility = "hidden";
            element.classList.add("visibility");
            element.classList.add("hidden");
        }

        /**
         * Elemento.
         * @type {HTMLElement}
         */
        public element: HTMLElement;

        /**
         * Registra o código CSS.
         */
        private setStylesheet() {
            const selector = `.${Presentation.className}`;
            Util.DOM.stylesheetCode(`
            ${selector} .visibility {
                visibility: visible !important;
                transition: opacity 0.2s ease-out;
                opacity: 1;
            }
            ${selector} .visibility.hidden {
                opacity: 0;
            }
            `);
        }

        /**
         * Define a exibição do elemento.
         * Quando nenhum parâmetro é informado apenas retorna a informação.
         * @param {boolean} mode Opcional. Exibe ou esconde.
         * @returns {boolean} Retorna o estado de exibição.
         */
        public visible(mode?: boolean): boolean {
            if (mode === true) {
                this.element.classList.remove("hidden");
            } else if (mode === false) {
                this.element.classList.add("hidden");
            }
            return !this.element.classList.contains("hidden");
        }
    }
}
