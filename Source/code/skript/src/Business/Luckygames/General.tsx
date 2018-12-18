namespace Skript.Business.Luckygames {

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
                const matches = /lang=[a-z]*/i.exec(active.href);
                if (matches && matches.length) return matches[0].replace("lang=", "");
            }
            return "";
        }

        /**
         * Define ou retorna o visual do website.
         * @param {ThemeMode} mode Modo do tema.
         * @returns {ThemeMode} Estado atual.
         */
        public static theme(mode?: ThemeMode): ThemeMode {
            if (mode !== undefined && mode !== this.theme()) {
                const toggleTheme = (window as any).uLight as Function;
                if (toggleTheme instanceof Function) {
                    toggleTheme();
                    Core.Main.instance.log.post("Site theme changed to {0}", ThemeMode[mode].translate(), Framework.Log.Level.Information);
                    new Messages.DidThemeSetted(mode).send();
                } else {
                    Core.Main.instance.log.post("It was not possible to change the look between light and dark.", undefined, Framework.Log.Level.Error);
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
         * @param {Framework.Types.OffOn} mode Modo da animacao.
         * @returns {Framework.Types.OffOn} Estado atual.
         */
        public static animation(mode?: Framework.Types.OffOn): Framework.Types.OffOn {
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

                if (mode === Framework.Types.OffOn.Off && General.animationBackup.on) {
                    (window as any).$.fn.animateAmount = General.animationBackup.nothing;
                    (window as any).$.fn.animateBalance = General.animationBackup.animateBalanceIntercept;
                    (window as any).Game.uSound = General.animationBackup.nothing;
                    (window as any).Game.uAnimation = General.animationBackup.nothing;
                    General.animationBackup.soundOff();
                    General.animationBackup.animationOff();
                    General.animationBackup.on = false;
                } else if (mode === Framework.Types.OffOn.On && !General.animationBackup.on) {
                    (window as any).$.fn.animateAmount = General.animationBackup.animateAmount;
                    (window as any).$.fn.animateBalance = General.animationBackup.animateBalance;
                    (window as any).Game.uSound = General.animationBackup.uSound;
                    (window as any).Game.uAnimation = General.animationBackup.uAnimation;
                    General.animationBackup.soundOn();
                    General.animationBackup.animationOn();
                    General.animationBackup.on = true;
                }

                Core.Main.instance.log.post("Site animation: {0}", Framework.Types.OffOn[mode].translate(), Framework.Log.Level.Information);
                new Messages.DidAnimationSetted(mode).send();
            }
            return !General.animationBackup || General.animationBackup.on ? Framework.Types.OffOn.On : Framework.Types.OffOn.Off;
        }
    }

    Framework.Bus.Message.capture(Messages.DoSetTheme, undefined, (message: Messages.DoSetTheme) => General.theme(message.mode));
    Framework.Bus.Message.capture(Messages.GetTheme, undefined, (message: Messages.GetTheme) => message.mode = General.theme());

    Framework.Bus.Message.capture(Messages.DoSetAnimation, undefined, (message: Messages.DoSetAnimation) => General.animation(message.mode));
    Framework.Bus.Message.capture(Messages.GetAnimation, undefined, (message: Messages.GetAnimation) => message.mode = General.animation());
}