namespace Skript.Luckygames {

    /**
     * Funcionalidade em geral luckygames.io
     */
    export class General {

        /**
         * Idioma do site.
         * @returns {string} Retorna o formato do site: en, ru, br, es, tr
         */
        public static language(): string {
            const active = document.querySelector("a.tooltipstered.active") as HTMLAnchorElement;
            if (active && active.href) {
                const matches = /(?<=lang\=)[a-z]*(?=($|[^a-z]))/i.exec(active.href);
                if (matches && matches.length) return matches[0];
            }
            return "";
        }
    }
}