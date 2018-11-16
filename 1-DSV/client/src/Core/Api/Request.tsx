namespace Core.Api {

    /**
     * Manipulador de chamadas api.
     */
    export class Request {

        /**
         * Instância para uso global no sistema.
         * @type {Request}
         */
        private static instance: Request|undefined;

        /**
         * Define uma instância para uso global no sistema.
         * Só pode ser definido uma vez.
         * @param {Request} instance Instância global.
         */
        public static setInstance(instance: Request): void {
            if (this.instance) throw new Error("A instância global de api não pode ser redefinida.");
            this.instance = instance;
        }

        /**
         * Retorna a instância de uso global.
         * @returns {Request} Instância global.
         */
        public static getInstance(): Request {
            if (!this.instance) throw new Error("A instância global de api ainda não foi definida.");
            return this.instance;
        }

        /**
         * Construtor.
         * @param {string} server Url do servidor da api.
         */
        public constructor(server: string) {
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
         * @param ScriptContext[] contexts Contextos de script para carregamento do servidor.
         * @returns {Promise<void>} Retorna void depois que carrega o script do servidor.
         */
        public loadScript(contexts: ScriptContext[]): Promise<void> {
            const urls: string[] = contexts.map(i => this.getUrl("script", ScriptContext[i]));
            return new Promise(resolve => {
                Util.LoadReferences.libraries(urls).then(resolve);
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
                    Core.Log.History.getInstance().post(`Chamando API: ${urls[index]}`, Core.Log.Level.Debug);

                    const request = new XMLHttpRequest();
                    request.open("GET", urls[index]);
                    request.send();
                    request.onloadend = (ev: any) => {
                        data[index].data = request.responseText;
                        if (++index < urls.length) load(index);
                        else resolve(data);
                        if (ev.currentTarget.status !== 200) {
                            Core.Log.History.getInstance().post(`Erro HTTP ${ev.currentTarget.status} ao obter dados da chamada de API ${ev.currentTarget.responseURL}.`, Core.Log.Level.Debug);
                        }
                    };
                }
                load(0);
            });
        }
    }
}