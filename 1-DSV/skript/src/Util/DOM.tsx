namespace Util {

    /**
     * Utilitários para manipulação do DOM.
     */
    export class DOM {

        /**
         * Carrega um código CSS dinamicamente.
         * Carregamentos repetidos são evitados com verificação de hash.
         * @param {string} code Código CSS.
         */
        public static stylesheetCode(code: string): void {
            const hash: number = code.hash();
            const id = `style_${hash}`;
            
            if (document.getElementById(id)) return;

            const element: HTMLStyleElement = document.createElement("style") as HTMLStyleElement;
            element.id = id;
            element.innerHTML = code;
            document.body.prepend(element);
        }
    }
}