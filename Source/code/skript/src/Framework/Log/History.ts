namespace Skript.Framework.Log {

    /**
     * Manipula e registra mensagens de log.
     */
    export class History {

        /**
         * Instância padrão para uso geral do sistema.
         * @type {History}
         */
        public static default: History;

        /**
         * Armazena o histórico dos IDs utilizados pelas mensagens de log.
         * @type {number}
         */
        public static id: number = 0;

        /**
         * Construtor.
         * @param {boolean} debug Sinaliza que está em modo debug e aceita mensagens Level.Verbose.
         * @param {boolean} setDefault Opcional. Define a instância como padrão do sistema.
         */
        public constructor(public debug: boolean, setDefault: boolean = false) {
            if (setDefault) {
                if (!History.default) History.default = this;
                else throw new Errors.InvalidExecution("History.default already defined.");

                Bus.Message.capture(Messages.DoLogClear, this, this.clear);
                Bus.Message.capture(Messages.GetLogMessages, this, this.onGetLogMessages);
            }
            this.debug = debug;
        }

        /**
         * Mensagem: ao solicitar lista atual do log.
         * @param {Messages.GetLogMessages} message Mensagem
         */
        private onGetLogMessages(message: Messages.GetLogMessages): void {
            message.messages = this.messages.slice();
        }

        /**
         * Lista de mensagens de log.
         * @type {Message[]}
         */
        public messages: Message[] = [];

        /**
         * Monta um objeto de mensagem de log.
         * @param {string} message Mensagem.
         * @param {any} values Conjunto de valores para substituição na string.
         * @param {Level} level Nível da mensagem.
         * @param {string} origin Orígem do log. Nome do módulo ou arquivo.
         */
        public mountMessage(text: string, values: any, level: Level, origin: string): Message {
            try {
                text = text.translate(values);
            } catch (error) {
                text = text.querystring(values);
            }

            const message: Message = {
                id: ++History.id,
                time: new Date(),
                level: level,
                text: text,
                origin: origin
            };
            return message;
        }

        /**
         * Limpa todas as mensagens do log.
         */
        public clear(): void {
            this.messages.length = 0;
            new Messages.DidLogCleared().send();
            if(this === History.default) Core.Main.instance.log.post("The log message list has been cleared.", undefined, Log.Level.Information);
        }

        /**
         * Registra uma mensagem de log
         * @param {string} message Mensagem.
         * @param {any} values Opcional. Conjunto de valores para substituição na string.
         * @param {Level} level Nível da mensagem.
         * @param {string} origin Opcional. Orígem do log. Nome do módulo ou arquivo.
         * @param {any} toConsoleLog Opcional. Qualquer coisas para ser passado como parâmetro para console.log
         */
        public post(text: string, values: any = { }, level: Level = Level.Debug, origin: string = '', toConsoleLog: any = undefined): void {
            if (!this.debug && level > Level.Debug) return;

            const message = this.mountMessage(text, values, level, origin);
            if (level !== Level.Console) {
                this.messages.push(message);
                new Messages.DidLogPosted(message).send();
            }
            Console.write(message, level, toConsoleLog);
        }

        /**
         * Registra uma mensagem de log na instância padrão. (caso tenha sido definida);
         * @param {string} message Mensagem.
         * @param {any} values Opcional. Conjunto de valores para substituição na string.
         * @param {string} origin Opcional. Orígem do log. Nome do módulo ou arquivo.
         * @param {any} toConsoleLog Opcional. Qualquer coisas para ser passado como parâmetro para console.log
         * @param {Level} level Opcional. Nível da mensagem. Padrão Verbose.
         */
        public static post(text: string, values: any = { }, origin: string = '', toConsoleLog: any = undefined, level: Level = Level.Verbose): void {
            if (History.default) return History.default.post(text, values, level, origin, toConsoleLog);
        }
    }
}