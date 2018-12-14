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
            const isNew = parameters[name] === undefined;
            parameters[name] = settings;
            skript.storage.data({ parameters: parameters });
            if (isNew) skript.log.post("Parameter \"{0}\" was successfully created.", name, Core.Log.Level.Information);
            else skript.log.post("Parameter \"{0}\" has been updated successfully.", name, Core.Log.Level.Information);
            new Message.ParametersUpdated().sendAsync();
        }

        /**
         * Apagar um parâmetro.
         * @param {string} name Nome
         */
        public static delete(name: string): void {
            const parameters = skript.storage.data().parameters;
            if (parameters[name] === undefined) return skript.log.post("Parameter \"{0}\" did not exist to be deleted.", name, Core.Log.Level.Warning);
            delete parameters[name];
            skript.storage.data({ parameters: parameters });
            skript.log.post("Parameter \"{0}\" was deleted successfully.", name, Core.Log.Level.Information);
            new Message.ParametersUpdated().sendAsync();
        }
        
        /**
         * Aplica os parâmetros nos módulos.
         * @param {Object} settings Definições
         * @returns {string[] | undefined} Lista de erros se houver.
         */
        public static applySettings(settings: any): string[] | undefined {
            const errors: string[] = [];
            let setCount = 0;
            let setErrorCount = 0;
            for (const name in settings) {
                if (this.instances[name] === undefined) {
                    errors.push(skript.translate.get("Module \"{0}\" does not exist.", name));
                    setCount += Object.keys(settings).length;
                    setErrorCount += Object.keys(settings).length;
                }
                else for (const field in settings[name]) {
                    setCount++;
                    if (this.instances[name].parameters[field] === undefined) {
                        errors.push(skript.translate.get("Module \"{0}\" does not have the \"{1}\" field.", [name, field]));
                        setErrorCount++;
                    } else {
                        const result = this.instances[name].parameters[field].set(settings[name][field]);
                        if (!result) {
                            setErrorCount++;
                            errors.push(skript.translate.get("For module \"{0}\", field \"{1}\" has invalid values.", [name, field]));
                        }
                    }
                }
            }
            if (setCount === 0) skript.log.post("There were no settings to apply.", undefined, Core.Log.Level.Warning);
            if (setErrorCount === 0) skript.log.post("A total of {0} settings were successfully applied to the modules.", setCount, Core.Log.Level.Information);
            else if (setErrorCount !== setCount) skript.log.post("A total of {0} settings have been successfully applied to the modules. But there was an error in {1}.", [setCount - setErrorCount, setErrorCount], Core.Log.Level.Warning);
            else skript.log.post("All {0} definitions have errors when applied to the modules.", setErrorCount, Core.Log.Level.Error);
            return errors.length ? errors : undefined
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