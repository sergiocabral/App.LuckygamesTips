namespace Skript.Business.Data {

    /**
     * Pacote de informações gravadas no storage.
     */
    export abstract class StoragePacket extends Skript.Framework.Data.StoragePacket {

        /**
         * Conjunto de automações.
         * @type {Framework.Types.Index<Object>}
         */
        public automations?: Framework.Types.Index<Object>;
    }

    /**
     * Pacote de informações gravadas no storage.
     */
    export class StoragePacketDefault extends Skript.Framework.Data.StoragePacketDefault {

        /**
         * Idioma atual.
         * @type {string}
         */
        public language: string = "pt";

        /**
         * Conjunto de automações.
         * @type {Framework.Types.Index<Object>}
         */
        public automations: Framework.Types.Index<Object> = { };
    }
}