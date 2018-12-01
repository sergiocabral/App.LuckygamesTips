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

        /**
         * Backup de funções usadas na animação do site.
         */
        private static animationBackup: any = undefined;

        /**
         * Define ou retorna o estado da animação do website.
         * @param {Core.OffOn} mode Modo da animacao.
         * @returns {Core.OffOn} Estado atual.
         */
        public static animation(mode?: Core.OffOn): Core.OffOn {
            if (mode !== undefined && mode !== General.animation()) {

                if (!General.animationBackup) {
                    General.animationBackup = {
                        on: true,
                        nothing: () => {},
                        animateAmount: (window as any).$.fn.animateAmount,
                        animateBalance: (window as any).$.fn.animateBalance,
                        animateBalanceIntercept: function(e: any) { "text" == this.attr("type") ? this.val(e) : this.html(e); return this; },
                        uSound: (window as any).Game.uSound,
                        uAnimation: (window as any).Game.uAnimation,
                        soundOn: () => { (window as any).Game.sound = "off"; General.animationBackup.uSound(); },
                        soundOff: () => { (window as any).Game.sound = "on"; General.animationBackup.uSound(); },
                        animationOn: () => { (window as any).Game.animation = "off"; General.animationBackup.uAnimation(); },
                        animationOff: () => { (window as any).Game.animation = "on"; General.animationBackup.uAnimation(); }
                    };
                }

                if (mode === Core.OffOn.Off && General.animationBackup.on) {
                    (window as any).$.fn.animateAmount = General.animationBackup.nothing;
                    (window as any).$.fn.animateBalance = General.animationBackup.animateBalanceIntercept;
                    (window as any).Game.uSound = General.animationBackup.nothing;
                    (window as any).Game.uAnimation = General.animationBackup.nothing;
                    General.animationBackup.soundOff();
                    General.animationBackup.animationOff();
                    General.animationBackup.on = false;
                } else if (mode === Core.OffOn.On && !General.animationBackup.on) {
                    (window as any).$.fn.animateAmount = General.animationBackup.animateAmount;
                    (window as any).$.fn.animateBalance = General.animationBackup.animateBalance;
                    (window as any).Game.uSound = General.animationBackup.uSound;
                    (window as any).Game.uAnimation = General.animationBackup.uAnimation;
                    General.animationBackup.soundOn();
                    General.animationBackup.animationOn();
                    General.animationBackup.on = true;
                }

                skript.log.post("Site animation: {0}", skript.translate.get(Core.OffOn[mode]));
                new Message.AnimationModeWasChanged(mode).sendAsync();
            }
            return !General.animationBackup || General.animationBackup.on ? Core.OffOn.On : Core.OffOn.Off;
        }
    }
    
    new GeneralBus(General);
}