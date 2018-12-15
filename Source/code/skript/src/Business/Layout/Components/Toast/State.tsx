namespace Skript.Business.Layout.Components.Toast {

    /**
     * State para o componente.
     */
    export type State = {

        /**
         * Lista de mensagens para exibição.
         */
        messages: Framework.Types.Index<Message>;
    } 
}
