namespace Skript.Util {
    
    /**
     * Repositório de todas as instâncias principais do sistema.
     */
    declare const skript: Core.All;

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

            skript.log.post('Inserted: <{tagName} id=\"{id}\" />', element, Core.Log.Level.DebugDOM, element);
        }

        /**
         * Move um elemento dentro do seu parent.
         * @param {HTMLElement} element Elemento
         * @param {BringTo} to Direção
         */
        public static bring(element: HTMLElement, to: BringTo): void {
            const logInfo: any = {
                element: element,
                parentElement: element.parentElement,
            }

            if (!element.parentElement) {
                skript.log.post('Canceled BringTo {direction}: <{tagName} id="{id}" />', { tagName: element.tagName, id: element.id, direction: BringTo[to] }, Core.Log.Level.DebugDOM, logInfo);
                return;
            }

            let bringTo = false;
            switch (to) {
                case BringTo.Back:
                    bringTo = element.parentElement.children[0] !== element;
                    if (bringTo) element.parentElement.prepend(element); 
                    break;
                case BringTo.Front: 
                    bringTo = element.parentElement.children[element.parentElement.childNodes.length - 1] !== element;
                    if (bringTo) element.parentElement.append(element);                    
                    break;
                default: throw new Error("Invalid BringTo.");
            }
            
            logInfo.children = element.parentElement.children.length;
            logInfo.childrenFirst = element.parentElement.children[0];
            logInfo.childrenLast = element.parentElement.children[element.parentElement.children.length - 1];
            if (bringTo) skript.log.post('BringTo {direction}: <{tagName} id="{id}" />', { tagName: element.tagName, id: element.id, direction: BringTo[to] }, Core.Log.Level.DebugDOM, logInfo);
            else skript.log.post('Canceled BringTo {direction}: <{tagName} id="{id}" />', { tagName: element.tagName, id: element.id, direction: BringTo[to] }, Core.Log.Level.DebugDOM, logInfo);
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