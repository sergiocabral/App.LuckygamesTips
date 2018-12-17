namespace Skript.Business.Automation {

    /**
     * Propriedades para automação de módulos do sistema.
     */
    export type Set = { 

        /**
         * Lista para definir/ler os parâmetros da tela.
         * @type {Framework.Types.Index<Framework.Types.Parameter<any>>}
         */
        parameters: Framework.Types.Index<Framework.Types.Parameter<any>>,

        /**
         * Lista para execução de ações.
         * @type {Framework.Types.Index<Framework.Types.Action>}
         */
        actions: Framework.Types.Index<Framework.Types.Action>
    }
}