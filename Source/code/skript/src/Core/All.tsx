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
        public infrastructure: Core.Infrastructure = (null as any) as Core.Infrastructure;

        /**
         * O sistema funciona a partir desta classe.
         */
        public main: Core.Main = (null as any) as Core.Main;

        /**
         * Conjunto de propriedades que configuram o sistema.
         */
        public configuration: Core.Configuration = (null as any) as Core.Configuration;

        /**
         * Conjunto de dados que configuram o sistema.
         */
        public data: Core.Data = (null as any) as Core.Data;

        /**
         * Manipulador de chamadas api.
         */
        public api: Core.Api.Request = (null as any) as Core.Api.Request;

        /**
         * Manipula e registra mensagens de log.
         */
        public log: Core.Log.History = (null as any) as Core.Log.History;

        /**
         * Conjuntos de propriedades de stylesheet que configuram o layout.
         */
        public stylesheet: Layout.Theme.Stylesheet = (null as any) as Layout.Theme.Stylesheet;

        /**
         * Organiza e manipula o layout.
         */
        public presentation: Layout.Presentation = (null as any) as Layout.Presentation;

        /**
         * Manipulador de traduções.
         */
        public translate: Locale.Translates = (null as any) as Locale.Translates;

        /**
         * Manipula os dados no storage do browser.
         */
        public storage: Data.Storage = (null as any) as Data.Storage;
    }
}