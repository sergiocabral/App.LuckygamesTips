namespace Skript.Locale.Format {

    /**
     * Configurações de formatação de data.
     */
    export type Date = {
        
        /**
         * Máscara de formatação.
         * 
         * Use para compor a máscara:
         *   D = dias corridos
         *   d = dia
         *   M = mês
         *   y = ano
         *   h = hora
         *   m = minuto
         *   s = segundo
         *   z = milissegundo
         * 
         * Nomes de máscara:
         *   running = D h:m:s
         */
        mask: string,

        /**
         * Texto usado para contabilizar 1 dia (singular).
         */
        day: string,

        /**
         * Texto usado para contabilizar 2 ou mais dias (plural).
         */
        days: string
    }
}