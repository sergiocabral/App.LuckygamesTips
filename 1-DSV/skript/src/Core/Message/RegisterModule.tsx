namespace Skript.Core.Message {

    /**
     * Criar uma nova janela de diálogo.
     */
    export class RegisterModule extends Core.Bus.Message { 

        /**
         * Construtor.
         * @param {ModuleBase} module Módulo.
         */
        public constructor(module: Modules.ModuleBase) {
            super();
            this.module = module;
        }

        /**
         * Módulo.
         * @type {ModuleBase}
         */
        public module: Modules.ModuleBase;
    }
}