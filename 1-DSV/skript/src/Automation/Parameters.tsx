namespace Skript.Automation {

    /**
     * Organiza os parâmertros de um módulo.
     */
    export class Parameters {

        /**
         * Lista de parâmetros instanciados.
         */
        private static instances: {[name:string]: Parameters} = { };

        /**
         * Retorna uma instância para o conjunto prâmetro solicitado.
         * Só deve haver uma instância para cada nome.
         * @param {string} name Nome do conjunto
         * @returns {Parameters} Instância
         */
        public static getInstance(name: string): Parameters {
            if (!Parameters.instances[name]) Parameters.instances[name] = new Parameters(name);
            return Parameters.instances[name];
        }

        /**
         * Só deve haver uma instância para cada nome.
         * @param {string} name Nome do conjunto
         */
        private constructor(name: string) {
            this.nameValue = name;
        }

        /**
         * Nome deste conjunto.
         * @type {string}
         */
        private nameValue: string;

        /**
         * Nome deste conjunto.
         * @returns {string} Nome.
         */
        public name: () => string = () => this.nameValue;
    }
}