namespace Skript.Framework.Request {

    /**
     * Manipulador de chamadas api.
     */
    export class Api {

        /**
         * Faz uma requisição de url.
         * @param {string} url Url.
         */
        public static request(url: string): Promise<string> {
            return new Promise((resolve, reject) => {
                const request = new XMLHttpRequest();
                request.open("GET", url);
                request.send();
                request.onloadend = (evt: any) => {
                    if (evt.currentTarget.status !== 200) {
                        reject(new Errors.RequestFail('Api error code: ' + evt.currentTarget.status));
                    } else {
                        resolve(evt.currentTarget.responseText);
                    }
                    console.Log("API returned status {status}. Url: {responseURL}", evt.currentTarget, "Request.Api", evt.currentTarget, evt.currentTarget.status === 200 ? Log.Level.Verbose : Log.Level.Warning);
                };
            });
        }

        /**
         * Construtor.
         * @param {ApiConfiguration} configuration Configurações da classe.
         */
        public constructor(public configuration: ApiConfiguration) {
            this.configuration = configuration;
        }

        /**
         * Carrega um script do servidor.
         * @param {string[]} contexts Contextos de script para carregamento do servidor.
         * @param {boolean} uniqueRequest Opcional. Quando true agrupa os modulos em uma chama. Quando false faz uma chamada para cada modulo.
         * @returns {Promise<void>} Retorna void depois que carrega o script do servidor.
         */
        public loadScript(contexts: string[], uniqueRequest: boolean = true): Promise<void> {
            if (!Array.isArray(contexts)) contexts = [String(contexts as any)];

            let urls: string[];

            if (uniqueRequest) {
                const separator = "/";
                const contextsString = contexts.reduce((a, c) => { a += (a !== "" ? separator : "") + c; return a; }, "");
                urls = [this.configuration.urlScript + contextsString];
            } else {
                urls = contexts.map(v => this.configuration.urlScript + v);
            }

            return new Promise((resolve, reject) => {
                Util.Request.libraries(urls).then(resolve).catch(reject);
            });
        }

        /**
         * Carrega um dado do servidor.
         * @param {Types.KeyValue[]} data Conjunto de tipo e subtipo.
         * @param {boolean} uniqueRequest Opcional. Quando true agrupa os modulos em uma chamada. Quando false faz uma chamada para cada modulo.
         * @returns {Promise<string>} Retorna os dados carregados como string.
         */
        public loadData(data: Types.KeyValue[], uniqueRequest: boolean = true): Promise<string[]> {
            let urls: string[];
            if (uniqueRequest) {
                const params = data.reduce((a, c) => {
                    a += (a ? "/" : "") + `${c.key}/${c.value}`;
                    return a;
                }, "");
                urls = [this.configuration.urlData + params];
            } else {
                urls = data.map(v => this.configuration.urlData + v.key + "/" + v.value);
            }

            return new Promise((resolve, reject) => {
                const response: string[] = [];
                const load = (index: number) => {
                    Api.request(urls[index]).then(responseText => {
                        response.push(responseText);
                        if (++index < urls.length) load(index);
                        else resolve(response);
                    }).catch(error => reject(error));
                }
                load(0);
            });
        }
    }
}