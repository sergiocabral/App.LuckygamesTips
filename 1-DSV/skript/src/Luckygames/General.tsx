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

        private static animationValue: boolean = true;
        /**
         * Define ou retorna o estado da animação do website.
         * @param {Core.OffOn} mode Modo da animacao.
         * @returns {Core.OffOn} Estado atual.
         */
        public static animation(mode?: Core.OffOn): Core.OffOn {
            if (mode !== undefined && mode !== General.animation()) {
                // $.fn.animateAmount = () => {};
                // $.fn.animateBalance = function(e) { 
                //     "text" == this.attr("type") ? 
                //     this.val(e) : this.html(e);
                //     return this;
                // }
                // Game.sound = "on"; Game.uSound();
                if (mode === Core.OffOn.On) {
                    General.animationValue = true;
                } else {
                    General.animationValue = false;
                }
                skript.log.post("Site animation: {0}", skript.translate.get(Core.OffOn[mode]));
                new Message.AnimationModeWasChanged(mode).sendAsync();
            }
            return General.animationValue ? Core.OffOn.On : Core.OffOn.Off;
        }
    }
    
    new GeneralBus(General);
}