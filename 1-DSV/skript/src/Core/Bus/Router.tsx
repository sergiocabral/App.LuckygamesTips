namespace Core.Bus {

    /**
     * Roteador de comandos.
     */
    export abstract class Router<T> {
        
        /**
         * Construtor.
         * @param {T} sponsor Quem é responsável pela instância deste router
         */
        public constructor(sponsor: T) {
            Router.list.push(this);
            this.sponsor = sponsor;
        }

        /**
         * Quem é responsável pela instância deste router
         * @type {T}
         */
        public sponsor: T;

        /**
         * Roteadores de comandos. Toda classe descendente que é instanciada entra nessa lista.
         * @type {any}
         */
        private static list: Router<any>[] = [];

        /**
         * Solicita que um comando seja processado.
         * Entra na rota (router) para alguém capturar (handler).
         * @param command Comando.
         */
        public static Send(command: Command): Command {
            const commandToSend = command.constructor.name;
            for (let i = 0; i < Router.list.length; i++) {
                for (let j = 0; Array.isArray(Router.list[i].handlers) && j < Router.list[i].handlers.length; j++) {
                    const commandOfHandler = Router.list[i].handlers[j].command;
                    if (commandOfHandler === commandToSend) {
                        Router.list[i].handlers[j].handler(command);
                        command.handled = true;
                    }
                }
            }
            return command;
        }

        /**
         * Lista de comandos possíveis de serem processados.
         */
        public abstract handlers: CommandHandler[];

    }
}