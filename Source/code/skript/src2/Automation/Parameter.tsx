namespace Skript.Automation {

    /**
     * Tipo de função para leitura de valor.
     * @returns {T} Valor atual.
     */
    type ParameterGet<T> = () => T;

    /**
     * Tipo de função para definição de valor.
     * @param {T} Valor para definir.
     * @returns {boolean} true se foi definido com sucesso.
     */
    type ParameterSet<T> = (value: T) => boolean

    /**
     * Parâmetro individual
     */
    export class Parameter<T> {

        /**
         * Construtor.
         * @param {string} name Nome do parâmetro.
         * @param {ParameterGet<T>} get Função para definição.
         * @param {ParameterSet<T>} set Função para leitura.
         */
        public constructor(name: string, get: ParameterGet<T>, set: ParameterSet<T>) {
            this.name = name;
            this.get = get;
            this.set = set;
        }

        /**
         * Nome do parâmetro.
         * @returns {string}
         */
        public name: string;

        /**
         * Função para definição.
         * @returns {ParameterGet<T>}
         */
        public get: ParameterGet<T>;

        /**
         * Função para leitura.
         * @returns {ParameterSet<T>}
         */
        public set: ParameterSet<T>;
    }
}