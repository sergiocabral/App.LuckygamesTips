namespace Skript.Core.Api {
    
    /**
     * Repositório de todas as instâncias principais do sistema.
     */
    declare const skript: Core.All;

    /**
     * Manipulador de chamadas api.
     */
    export class Request {

        /**
         * Construtor.
         * @param {string} server Url do servidor da api.
         */
        public constructor(server: string) {
            skript.api = this;
            
            this.server = server;
            this.url = `${server}/api/`.replace("://", "$").replace("//", "/").replace("$", "://");
        }

        /**
         * Url do servidor da api.
         */
        public server: string;

        /**
         * Url parcial para chamada da API.
         */
        private url: string;

        /**
         * Retorna a url completa para chamada da api.
         * @param {string} module Nome do módulo.
         * @param {string} command Nome do comando.
         * @param {string} parameter Nome do parâmetro
         * @returns {string} Url.
         */
        public getUrl(module: string, command: string, parameter: string = "") {
            return `${this.url}${module}/${command}/${parameter}`;
        }

        /**
         * Carrega um script do servidor.
         * @param {ScriptContext[]} contexts Contextos de script para carregamento do servidor.
         * @param {boolean} uniqueRequest Opcional. Quando true agrupa os modulos em uma chama. Quando false faz uma chamada para cada modulo.
         * @returns {Promise<void>} Retorna void depois que carrega o script do servidor.
         */
        public loadScript(contexts: ScriptContext[], uniqueRequest: boolean = true): Promise<void> {
            let urls: string[];

            if (uniqueRequest) {
                const separator = ",";
                const contextsString = contexts.reduce((c, i) => { c += (c !== "" ? separator : "") + ScriptContext[i]; return c; }, "");
                urls = [this.getUrl("script", contextsString)];
            } else {
                urls = contexts.map(i => this.getUrl("script", ScriptContext[i]));
            }

            return new Promise((resolve, reject) => {
                Util.LoadReferences.libraries(urls).then(resolve).catch(reject);
            });
        }

        /**
         * Carrega um dado do servidor.
         * @param {Data[]} contexts Lista de dados para retorno.
         * @returns {Promise<Data[]>} Retorna Data[] com os dados carregados.
         */
        public loadData(data: Data[]): Promise<Data[]> {
            const urls: string[] = data.map(i => this.getUrl("data", DataType[i.type], i.name));
            return new Promise(resolve => {
                const load = (index: number) => {
                    const request = new XMLHttpRequest();
                    request.open("GET", urls[index]);
                    request.send();                    
                    request.onloadend = (ev: any) => {
                        data[index].data = request.responseText;
                        if (++index < urls.length) load(index);
                        else resolve(data);
                        
                        const result = ev.currentTarget.status === 200 ? "Sucesso" : "Falha";
                        skript.log.post(`API. ${result}. Status {status}. Url: {responseURL}`, ev.currentTarget, ev.currentTarget.status === 200 ? Core.Log.Level.Debug : Core.Log.Level.Warning, ev.currentTarget);
                    };
                }
                load(0);
            });
        }
    }
}