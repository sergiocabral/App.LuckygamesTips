namespace Util {
    
    /**
     * Repositório de todas as instâncias principais do sistema.
     */
    declare const tips: Core.All;

    /**
     * Utilitários para carregamento de dados.
     */
    export class LoadReferences {

        /**
         * Carrega bibliotecas JavaScript e/ou CSS.
         * Carregamentos repetidos são evitados com verificação de hash.
         * @param {string[]} urls Urls dos arquivos
         * @returns {Promise<void>} Retorna void após o carregamento de todos as bibliotecas.
         */
        public static libraries(urls: string[]): Promise<void> {
            return new Promise((resolve, reject) => {
                const load = (urls: string[], index: number) => {
                    if (index < urls.length) {
                        const loadUrl = 
                            urls[index].substr(-3) === ".js" || urls[index].indexOf("/script") >= 0 ?
                            LoadReferences.javaScript : 
                            LoadReferences.stylesheet;

                        loadUrl(urls[index]).then(() => load(urls, ++index)).catch(reject);
                    }
                    else resolve();
                }
                load(urls, 0);
            });
        }

        /**
         * Carrega um arquivo JavaScript.
         * Carregamentos repetidos são evitados com verificação de hash.
         * @param {string} src Url do arquivo
         * @returns {Promise<void>} Retorna void quando o arquivo é carregado.
         */
        public static javaScript(src: string): Promise<void> {
            const hash: number = src.hash();
            const id = `script_${hash}`;

            if (document.getElementById(id)) return new Promise(resolve => resolve());

            return new Promise((resolve, reject) => {
                const element: HTMLScriptElement = document.createElement("SCRIPT") as HTMLScriptElement;
                element.id = id;
                element.type = "text/javascript";
                element.src = src;
                element.onload = () => {
                    tips.log.post("Carregado javascript.", null, Core.Log.Level.Debug, element);
                    resolve();
                }
                element.onerror = (e) => {
                    tips.log.post("Falha ao carregar javascript.", null, Core.Log.Level.Error, [e, element]);
                    reject({ error: e, url: src });
                };
                document.body.prepend(element);
            });
        }

        /**
         * Carrega um arquivo CSS.
         * Carregamentos repetidos são evitados com verificação de hash.
         * @param  {string} href Url do arquivo
         * @returns {Promise<void>} Retorna void quando o arquivo é carregado.
         */
        public static stylesheet(href: string): Promise<void> {
            const hash: number = href.hash();
            const id = `link_${hash}`;

            if (document.getElementById(id)) return new Promise(resolve => resolve());

            return new Promise((resolve, reject) => {
                const element: HTMLLinkElement = document.createElement("link") as HTMLLinkElement;
                element.id  = id;
                element.rel  = "stylesheet";
                element.type = "text/css";
                element.href = href;
                element.media = "all";
                element.onload = () => {
                    tips.log.post("Carregado stylesheet.", null, Core.Log.Level.Debug, element);
                    resolve();
                }
                element.onerror = (e) => {
                    tips.log.post("Falha ao carregar stylesheet.", null, Core.Log.Level.Error, [e, element]);
                    reject({ error: e, url: href });
                };
                document.body.prepend(element);
            });
        }
    }
}