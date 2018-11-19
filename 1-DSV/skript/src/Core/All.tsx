namespace Skript.Core {
    /**
     * Repositório de todas as instâncias principais do sistema.
     * Para que tudo fique acessível a todos.
     */
    export class All {

        /**
         * Armazena qualquer coisa.
         * Para quando houver necessidade de ter um valor global.
         */
        public any: {[index: string]: any} = { };

        /**
         * Classe principal responsável por rodar o sistema.
         */
        public infrastructure: Core.Infrastructure = { } as Core.Infrastructure;

        /**
         * O sistema funciona a partir desta classe.
         */
        public main: Core.Main = { } as Core.Main;

        /**
         * Conjunto de propriedades que configuram o sistema.
         */
        public configuration: Core.Configuration = { } as Core.Configuration;

        /**
         * Conjunto de dados que configuram o sistema.
         */
        public data: Core.Data = { } as Core.Data;

        /**
         * Manipulador de chamadas api.
         */
        public api: Core.Api.Request = { } as Core.Api.Request;

        /**
         * Manipula e registra mensagens de log.
         */
        public log: Core.Log.History = { } as Core.Log.History;

        /**
         * Conjuntos de propriedades de stylesheet que configuram o layout.
         */
        public stylesheet: Layout.Theme.Stylesheet = { } as Layout.Theme.Stylesheet;

        /**
         * Organiza e manipula o layout.
         */
        public presentation: Layout.Presentation = { } as Layout.Presentation;

        /**
         * Manipulador de traduções.
         */
        public translate: Locale.Translates = { } as Locale.Translates;
    }
}