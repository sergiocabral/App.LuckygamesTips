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

        /**
         * Define ou retorna o visual do website.
         * @param {ThemeMode} mode Modo do tema.
         * @returns {ThemeMode} Estado atual.
         */
        public static theme(mode?: ThemeMode): ThemeMode {
            if (mode !== undefined && mode !== General.theme()) {
                const toggleTheme = (window as any).uLight as Function;
                if (toggleTheme instanceof Function) {
                    toggleTheme();
                    skript.log.post("Site theme changed to {0}", skript.translate.get(ThemeMode[mode]));
                    new Message.ThemeModeWasChanged(mode).sendAsync();
                } else {
                    skript.log.post("It was not possible to change the look between light and dark.", null, Core.Log.Level.Error);
                }
            }
            return document.body.classList.contains("light") ? ThemeMode.Light : ThemeMode.Dark;
        }
    }
    
    new GeneralBus(General);
}