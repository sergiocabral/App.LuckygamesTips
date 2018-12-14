
namespace Skript.Framework.Core {

    /**
     * Dados para inicialização do sistema.
     */
    export type MainConfiguration<TConfigurationOfBusiness, TStoragePacketDefault extends Data.StoragePacketDefault> = {

        /**
         * Dados para inicialização do sistema no contexto do negócio.
         */
        business: TConfigurationOfBusiness,

        /**
         * Nome do sistema.
         * @type {string}
         */
        name: string,

        /**
         * Class CSS que contém todos os componentes.
         * @type {string}
         */
        className: string,

        /**
         * Nome do dados para regionalismo.
         * @type {string}
         */
        dataNameLocale: string,

        /**
         * Nome do dados para traduções.
         * @type {string}
         */
        dataNameTranslate: string,

        /**
         * Nome do storage no browser.
         */
        storageName: string,

        /**
         * Instância que retorna os valores padrão para os dados no storage.
         */
        storagePacketDefault: TStoragePacketDefault,

        /**
         * Bibliotecas javascript e css para carregar.
         * @type {string[]}
         */
        libraries: string[],

        /**
         * Opcional. Endereço url do servidor.
         * @type {string|undefined}
         */
        server: string|undefined,
    }
}