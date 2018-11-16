namespace Util {

    /**
     * Utilitários para manipulação e geração de string.
     */
    export class String {

        /**
         * Extrai um hash de uma string.
         * @param value Valor.
         */
        public static hash(value: string): number {
            return value.split("").reduce((a, b) => {
                a = ((a << 5) - a) + b.charCodeAt(0);
                return a & a
            }, 0);              
        }

        /**
         * Retorna um valor randômico 
         * @param length Comprimento da string
         */
        public static random(length: number = 5): string {
            let result = "";
            while (result.length < length) result += btoa(Math.random().toString()).substr(5).replace(/([^a-z0-9]|^[0-9]*)/gi, '');
            return result.substr(0, length);
        }
    }
}