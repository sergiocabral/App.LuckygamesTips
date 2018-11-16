namespace Core.Api {

    /**
     * Manipulador de chamadas api.
     */
    export class Request {

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
                    request.onload = () => {
                        data[index].data = request.responseText;
                        if (++index < urls.length) load(index);
                        else resolve(data);
                    }
                }
                load(0);
            });
        }
    }
}