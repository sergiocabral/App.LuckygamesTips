namespace Util {

    /**
     * Utilitários para carregamento de dados.
     */
    export class Load {

        /**
         * Carrega bibliotecas JavaScript ou CSS.
         * @param  {string[]} urls Urls dos arquivos
         * @returns Promise Retorna void após o carregamento de todos as bibliotecas.
         */
        public static libraries(urls: string[]): Promise<void> {
            return new Promise(resolve => {
                const load = (urls: string[], index: number) => {
                    if (index < urls.length) {
                        const loadUrl = 
                            urls[index].substr(-3) === ".js" || urls[index].indexOf("/script") >= 0 ?
                            Load.javaScript : 
                            Load.stylesheet;

                        loadUrl(urls[index]).then(() => load(urls, ++index));
                    }
                    else resolve();
                }
                load(urls, 0);
            });
        }

        /**
         * Carrega um arquivo JavaScript.
         * @param  {string} src Url do arquivo
         * @returns Promise Retorna void quando carregar o arquivo.
         */
        public static javaScript(src: string): Promise<void> {
            Core.Messages.log(`Carregando JavaScript: ${src}`, Core.LogLevel.Debug);
            return new Promise(resolve => {
                const element: HTMLScriptElement = document.createElement("SCRIPT") as HTMLScriptElement;
                element.type = "text/javascript";
                element.src = src;
                element.onload = () => resolve();
                document.getElementsByTagName("head")[0].appendChild(element);
            });
        }

        /**
         * Carrega um arquivo JavaScript.
         * @param  {string} href Url do arquivo
         * @returns Promise Retorna void quando carregar o arquivo.
         */
        public static stylesheet(href: string): Promise<void> {
            Core.Messages.log(`Carregando Stylesheet: ${href}`, Core.LogLevel.Debug);
            return new Promise(resolve => {
                const element: HTMLLinkElement = document.createElement("link") as HTMLLinkElement;
                element.rel  = "stylesheet";
                element.type = "text/css";
                element.href = href;
                element.media = "all";
                element.onload = () => resolve();
                document.getElementsByTagName("head")[0].appendChild(element);
            });
        }

        /**
         * Carrega um código CSS dinamicamente.
         * @param  {string} code Código CSS
         * @returns void
         */
        public static stylesheetCode(code: string): void {
            const element: HTMLStyleElement = document.createElement("style") as HTMLStyleElement;
            element.innerHTML = code;
            document.getElementsByTagName("head")[0].appendChild(element);
        }
    }
}