namespace Skript.Modules {
    
    /**
     * Classe base para os módulos do sistema.
     */
    export class ModuleBase {

        /**
         * Construtor.
         */
        public constructor() {
            Core.Bus.MessageDispatcher.Send(new Core.Message.RegisterModule(this));
        }
    }
}
