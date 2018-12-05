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
            if (!Parameters.instances[name]) {
                Parameters.instances[name] = new Parameters(name);
                Parameters.defaultSettingsValue[name] = { };
            }

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
         * Definições padrão.
         * @type {Object}
         */
        private static defaultSettingsValue: {[name: string]: {[name: string]: any}} = { };

        /**
         * Retorna as definições padrão em todos os parâmetros.
         */
        public static defaultSettings: () => Object = () => Parameters.defaultSettingsValue;

        /**
         * Retorna as definições atuais em todos os parâmetros.
         * @returns {Object} Parâmetros.
         */
        public static currentSettings(): Object {
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
         * Retorna os parâmetros gravados e suas definições.
         * @returns {{[name: string]: Object}} Lista parâmetro e definições.
         */
        public static parameters(): {[name: string]: Object} {
            return skript.storage.data().parameters;
        }
        
        /**
         * Sava defjnições em um parâmetro de usuário.
         * @param {string} name Nome
         * @param {Object} settings Definições.
         */
        public static save(name: string, settings: Object): void {
            if (typeof(name) !== "string" || !name.trim() || typeof(settings) !== "object") throw new Core.Errors.InvalidArgument("Parameters.save()");
            const parameters = skript.storage.data().parameters;
            parameters[name] = settings;
            skript.storage.data({ parameters: parameters });
            new Message.ParametersUpdated().sendAsync();
        }

        /**
         * Define um parâmetro. Em caso de repetições é feito substituição.
         * @param {Parameter<any>} parameter Parâmetro.
         */
        public set(parameter: Parameter<any>): void {
            const isNew = this.parameters[parameter.name] === undefined;
            this.parameters[parameter.name] = parameter;
            if (isNew) Parameters.defaultSettingsValue[this.name][parameter.name] = parameter.get();
            new Message.ParametersUpdated().sendAsync();
        }
   }
   
   new ParametersBus(Parameters);
}