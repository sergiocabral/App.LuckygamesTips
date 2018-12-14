namespace Skript.Framework.Data {

    /**
     * Interface com o servidor, onde referência valores vindos de lá.
     */
    export class ServerVariables {

        /**
         * Carrega as variáveis do servidor.
         * @param {string} url Opcional. Url do servidor.
         */
        public static initialize(url?: string): Promise<void> {
            return new Promise((resolve, reject) => {
                const property = "mysys";
                if ((window as any)[property]) {
                    Object.assign(this, (window as any)[property]);
                    delete (window as any)[property];
                    resolve();
                } else {
                    if (!url) throw new Errors.EmptyValue("ServerVariables url.");
                    Request.Api.request(url + "api/servervariables/").then(response => {
                        Object.assign(this, JSON.parse(response));
                        resolve();
                    }).catch(error => reject(error));
                }
            });
        }

        /**
         * Retorna o nome de uma variável. Se não existir dispara exception.
         * @param {string} name Nome da variável.
         * @returns {any} Valor.
         */
        public static get(name: string): any {
            const containerName = 'mysys';
            const container: any = (window as any)[containerName];
            if (container === undefined) throw new Errors.EmptyValue(`window.${containerName}`);

            const value: any = container[name];
            if (value === undefined) throw new Errors.EmptyValue(`window.${containerName}.${name}`);

            return value;
        }

        /**
         * Indica se o servidor está em modo debug.
         * @returns {string} Valor.
         */
        public static debug: boolean;

        /**
         * Url do servidor.
         * @returns {string} Valor.
         */
        public static url: string;

        /**
         * Url do servidor para recebimento referencias imagens, etc.
         * @returns {string} Valor.
         */
        public static urlMedia: string;

        /**
         * Url do servidor para recebimentos de dados JSON.
         * @returns {string} Valor.
         */
        public static urlData: string;

        /**
         * Url do servidor para recebimentos de conteúdo javascript.
         * @returns {string} Valor.
         */
        public static urlScript: string;
    }
}