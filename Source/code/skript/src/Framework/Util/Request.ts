namespace Skript.Framework.Util {

    /**
     * Utilitários para carregamento de dados.
     */
    export class Request {

        /**
         * Carrega bibliotecas JavaScript e/ou CSS.
         * Carregamentos repetidos são evitados com verificação de hash.
         * @param {string[]} urls Urls dos arquivos
         * @returns {Promise<void>} Retorna void após o carregamento de todos as bibliotecas.
         */
        public static libraries(urls: string[]): Promise<void> {
            if (!Array.isArray(urls)) urls = [String(urls ? urls as any : "")];

            return new Promise((resolve, reject) => {
                const load = (urls: string[], index: number) => {
                    if (index < urls.length) {
                        const loadUrl = 
                            urls[index].substr(-3) === ".js" || urls[index].indexOf("/script") >= 0 ?
                            Request.javascript : 
                            Request.stylesheet;

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
        public static javascript(src: string): Promise<void> {
            const hash: number = Text.hash(src);
            const id = `script-${hash}`.replace("--", "-");

            if (document.getElementById(id)) return new Promise(resolve => resolve());

            return new Promise((resolve, reject) => {
                const element: HTMLScriptElement = document.createElement("SCRIPT") as HTMLScriptElement;
                element.id = id;
                element.type = "text/javascript";
                element.src = src;
                element.onload = () => {
                    console.Log("Loaded {type}: {url}", { type: "javascript", url: src }, "Util.Request", element);
                    resolve();
                }
                element.onerror = (e) => {
                    console.Log("Failed loading {type}: {url}", { type: "javascript", url: src }, "Util.Request", [e, element], Log.Level.Error);
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
            const hash: number = Text.hash(href);
            const id = `link-${hash}`.replace("--", "-");

            if (document.getElementById(id)) return new Promise(resolve => resolve());

            return new Promise((resolve, reject) => {
                const element: HTMLLinkElement = document.createElement("link") as HTMLLinkElement;
                element.id  = id;
                element.rel  = "stylesheet";
                element.type = "text/css";
                element.href = href;
                element.media = "all";
                element.onload = () => {
                    console.Log("Loaded {type}: {url}", { type: "stylesheet", url: href }, "Util.Request", element);
                    resolve();
                }
                element.onerror = (e) => {
                    console.Log("Failed loading {type}: {url}", { type: "stylesheet", url: href }, "Util.Request", [e, element], Log.Level.Error);
                    reject({ error: e, url: href });
                };
                document.body.prepend(element);
            });
        }
    }
}