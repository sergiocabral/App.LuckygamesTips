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
         * @param {Parameter<any>[]} parameters Opcional. Parâmetros.
         * @returns {Parameters} Instância
         */
        public static getInstance(name: string, parameters?: Parameter<any>[]): Parameters {
            if (!Parameters.instances[name]) Parameters.instances[name] = new Parameters(name);

            if (Array.isArray(parameters))
                for (let i = 0; i < parameters.length; i++)
                    Parameters.instances[name].set(parameters[i]);

            return Parameters.instances[name];
        }

        /**
         * Só deve haver uma instância para cada nome.
         * @param {string} name Nome do conjunto
         */
        private constructor(name: string) {
            this.name = name;
        }

        /**
         * Nome deste conjunto.
         * @type {string}
         */
        public name: string;

        /**
         * Lista de parâmetros.
         * @type {{[name:string]: Parameter<any>}}
         */
        public parameters: {[name:string]: Parameter<any>} = { };

        /**
         * Retorna os parâmetros como json
         * @returns {Object} Parâmetros.
         */
        public static parameters(): Object {
            const result: any = { };
            for (const i in Parameters.instances) {
                result[Parameters.instances[i].name] = { };
                for (const j in Parameters.instances[i].parameters) {
                    result[Parameters.instances[i].name][Parameters.instances[i].parameters[j].name] = 
                        Parameters.instances[i].parameters[j].get()
                }                
            }
            return result;
        }

        /**
         * Define um parâmetro. Em caso de repetições é feito substituição.
         * @param {Parameter<any>} parameter Parâmetro.
         */
        public set(parameter: Parameter<any>): void {
            this.parameters[parameter.name] = parameter;
        }
   }
   
   new ParametersBus(Parameters);
}