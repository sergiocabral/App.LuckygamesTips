namespace Skript.Util {

    /**
     * Opções para move um elemento.
     */
    export enum BringTo {

        /**
         * Enviar para o fim do DOM e para cima dos outros elementos.
         */
        Front,

        /**
         * Enviar para o início do DOM e para baixo dos outros elementos.
         */
        Back
    }

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
            if (typeof(code) !== "string" || !code.length) return;
            
            const hash: number = code.hash();
            const id = `style_${hash}`;
            
            if (document.getElementById(id)) return;

            const element: HTMLStyleElement = document.createElement("style") as HTMLStyleElement;
            element.id = id;
            element.innerHTML = code;
            document.body.prepend(element);
        }

        /**
         * Move um elemento dentro do seu parent.
         * @param {HTMLElement} element Elemento
         * @param {BringTo} to Direção
         */
        public static bring(element: HTMLElement, to: BringTo): void {
            if (!element.parentElement || 
                element.parentElement.children[element.parentElement.childNodes.length - 1] === element) return;
            
            switch (to) {
                case BringTo.Back: element.parentElement.prepend(element); break;
                case BringTo.Front: element.parentElement.append(element); break;
                default: throw new Error("Invalid BringTo.");
            }
        }

        /**
         * Limpa a seleção do usuário.
         */
        public static clearSelection(): void {
            if (window.getSelection) {
                if (window.getSelection().empty) {  // Chrome
                    window.getSelection().empty();
                } else if (window.getSelection().removeAllRanges) {  // Firefox
                    window.getSelection().removeAllRanges();
                }
            } else if ((document as any).selection) {  // IE?
                (document as any).selection.empty();
            }
        }
    }
}