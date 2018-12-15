namespace Skript.Business.Layout.Components.SetLanguage {

    /**
     * Componente: seleção de igioma.
     */
    export class SetLanguage extends Base<Framework.Layout.Components.EmptyProps, State> {

        /**
         * Carrega e aplica os estilos css.
         */
        public css(): string {
            return `
                ${this.classNameSelector()} {
                    display: inline-block;
                }
                ${this.classNameSelector()} .language {
                    display: inline-block;
                    margin: 0 5px;
                    opacity: 0.5;
                }
                ${this.classNameSelector()} .language.active {
                    opacity: 1;
                }
                ${this.classNameSelector()} button {
                    background: transparent;
                    color: transparent;
                    border: none;
                    cursor: pointer;
                    width: 24px;
                    background-size: cover;
                }
                ${this.classNameSelector()} button:focus {
                    outline: none;
                }
                ${this.classNameSelector()} .en button {
                    background-image: url('data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAABkAAD/4QMraHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjMtYzAxMSA2Ni4xNDU2NjEsIDIwMTIvMDIvMDYtMTQ6NTY6MjcgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzYgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkE4RjAyRDA0RkZGMjExRTg5MUNCRjkwRkE3QzVDNTJEIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkE4RjAyRDA1RkZGMjExRTg5MUNCRjkwRkE3QzVDNTJEIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QThGMDJEMDJGRkYyMTFFODkxQ0JGOTBGQTdDNUM1MkQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QThGMDJEMDNGRkYyMTFFODkxQ0JGOTBGQTdDNUM1MkQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7/7gAOQWRvYmUAZMAAAAAB/9sAhAABAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAgICAgICAgICAgIDAwMDAwMDAwMDAQEBAQEBAQIBAQICAgECAgMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwP/wAARCAARABgDAREAAhEBAxEB/8QAhwAAAgMBAAAAAAAAAAAAAAAAAAMCCAkKAQACAwEAAAAAAAAAAAAAAAAABwUGCAkQAAICAQMDBQEAAAAAAAAAAAIDAQQFBgcIABESExhY2AmZEQABAgQBBgoLAQAAAAAAAAABAgMAEQQFBiFREhMHF0FhIhRU1BVWltYxcZEyM2N0lJUWCJf/2gAMAwEAAhEDEQA/AM5KGMpsxGMulVxJuPB4m9N08RWOyTpxeOuRfOxIyw7UNxqny2XSUspLP1IkBOtrtS1aZSCqWkRKfGRL1ZZSzH0Z4bgyxeX8+tr8frfeDVuCHZ/TG6K6O1Ve/GlLXEvCcqaWM9DUOGxK8vGgL+7OxtXSzKldI0FZcbtwpSEVIrJHtAJLbywmtwvQodZ5wE3JRkpgVOiSyvlaKnG9AmfvhRnMiWXSjTf8o344cxxeKxN1VZtbZm0a1N9Xh8uSqUqDXOm7dcjUgZV82LLQR8UOqloRr77WMd8H9A/xZ0V98OssdkU/QEfjk9Zjde9B3vu//o9R5WhPtad6kOjhfp+GiwGi2Pyc4cQ0WrZRatosjnb5i1bcZVISie4lVTMdpUvxYG8DaZKXalzl9NT8fzuM+05zCG3R/wAv9Ew742xJ5ciKeK0oXCk8KNLrSIpAER+SnDCUAFaumnXBaC50EpY16dZSVwIx4JUCx7AIjENfb9i3FFO3SYlfq6+kacLiEP0dMtKHCCkrSNeJKIJBPCCc8XHBFm2ObM7lUXnZ1W2yyXaqYDDz1JjnEjTjrKV6xLSz+tGaAvlgSyKywz2ts+FGlP5HcKvvJ1WeyGuhI+wpusQy95zPfJzx/iPyxHFv0mI7IQdEEHRBH//Z');
                }
                ${this.classNameSelector()} .pt button {
                    background-image: url('data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAABkAAD/4QMraHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjMtYzAxMSA2Ni4xNDU2NjEsIDIwMTIvMDIvMDYtMTQ6NTY6MjcgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzYgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjg0NkU2MENBRkZGMjExRTg5QTk0OEU0MzI1OTJERDQwIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjg0NkU2MENCRkZGMjExRTg5QTk0OEU0MzI1OTJERDQwIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6ODQ2RTYwQzhGRkYyMTFFODlBOTQ4RTQzMjU5MkRENDAiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6ODQ2RTYwQzlGRkYyMTFFODlBOTQ4RTQzMjU5MkRENDAiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7/7gAOQWRvYmUAZMAAAAAB/9sAhAABAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAgICAgICAgICAgIDAwMDAwMDAwMDAQEBAQEBAQIBAQICAgECAgMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwP/wAARCAARABgDAREAAhEBAxEB/8QAfQAAAwEAAAAAAAAAAAAAAAAAAQQIBwEBAAMBAAAAAAAAAAAAAAAACAECCQcQAAEEAwACAQMFAAAAAAAAAAMCBAUGAQcIABITEUIVgsIUFgkRAAICAgAGAQIEBwEAAAAAAAECAwQFBwAREhMGCBQiFSEjJBZBgUKCwjNDCf/aAAwDAQACEQMRAD8Am/RvPO2ui7T/AFXVlZJKqaEZZsNlkS/i6bTmL4qxok7VYjIU2YN0jAYqQDwZ64QAnwAKpOU+Zf7a3drPSGB+/bDyAgaQN8enCBNkLjL/AEVaoZSRz5KZpWiroSA0nUQpwz0/o7ZW9PID4/rrHSXJImi+TOforVElYqslmY/SgISR0jUPYnWGUVoZ5EKcL2q48r0ZbigWvXnVEdXmFxdViZ74aw9Wm9FQEwysGa+eQmtN1+UlrJEaMIpScinHsu2n3CVJfiZ5QrEVlI0PTn3kyXiQ21Uua9OVfErdj100lxM3LWauLggHkLwrUHk3bPbNEVziUl/SPMJQZwyqvrBoG94k3idTP5CTYCWipzS12+2mZbHaatFUZkeWp2T9M6TNdewPkJWaEGjw5vLnXbfOtjRXtn1pTFs/W4XWbhDm/M0W6x4VJyKVqlmbow1et3TUonGAGwB8EJx5MAeVYx4bNSbx1lu/CHM6/wAgJLMQHyaNgCDI0n58ilqqWJADc078JlrswIEgYFQOdv6J2bo3NjDbCxstWOV5BXsr+ZVtrGxUvXnUdLfh0yNC4jswpJH8mCB3CcafzF2ltfmMxoSIwzu+qZh2c1p1TYykDESKJEKWUy6r8w3GSQqk5IxfuBTgWDNi/VOXDc3xo9ef799VNbb9j+7ZLuYjY0MaLWy9ZeuRe0ecKW6zMsduCNgCo5xzxgco5un6D0X139tdmevFlqODeO/4TPMsljHWPxiZgV6pIJOTPWnKr0h1Dwk9Lz1rJjjCxJTf8+uf9e7FHvvXnaLugaLHcFOl6ZrtJno7sYsPmSJJE0/INmrvOn7LWXsNj+EWzSD88A5aqwVzGqe5VHZ1Csf+p+87vgg1vl9Qtc9kVxIjXyFsnW/YZsrEKy58kxDMRyLP+t/byQi8Jh2Y7S1uU4Xtjbvrnk/Fj55fzt84hpWhbCvGJMuGL8zDEC7QojQqJEywsLGjFVaIWR8Hi4enu19q9MkRAPRs6BqOMctS1rUtZL8kQyRGIU3iHFhl1NmjqzSscy9BCVkbdi39Pq3ah9le2XOgfVHXGg0GZptLmtlSo62MxZBSQ93/AHJUrh3SrFISetmaWzKCe5N0noBJ9ivbrZfsLOMblGTGeBwydUGNrn8sEFiHsTdKSWpeRA5uEgUqHirQyNIzx54neCnwPu/T+7y3/P8Av/x4n+H8+D5XiOP/2Q==');
                }
            `;
        }

        /**
         * Construtor.
         * @param {Framework.Layout.Components.EmptyProps} props Propriedades.
         */
        public constructor(props: Framework.Layout.Components.EmptyProps) {
            super(props);

            const language = new Framework.Messages.GetLanguage().request().language;
            if (!language) throw new Framework.Errors.EmptyValue("Language is not defined.");
            this.state = { language: language };

            this.onClick = this.onClick.bind(this);

            this.toCaptureOff.push(Framework.Bus.Message.capture(Framework.Messages.DidLanguageSetted, this, this.onDidLanguageSetted));
        }

        /**
         * Evento: ao trocar o idioma.
         * @param {Framework.Messages.DidLanguageSetted} message Informações sobre o evento.
         */
        private onDidLanguageSetted(message: Framework.Messages.DidLanguageSetted): void {
            this.setState({ language: message.newLanguage });
        }

        /**
         * Quando o botão é pressionado.
         * @param evt Informações do evento.
         */
        private onClick(evt: any) {
            const element = Framework.Util.DOM.path(evt.target).reduce((a: Element|null, c: Element) => { a = a ? a : (c.classList.contains("language") ? c : null); return a; }, null);
            if (!element) return;
            const language = element.getAttribute("data-language") as string;
            new Framework.Messages.DoSetLanguage(language).send();
        }

        /**
         * Renderizador do React.
         * @returns {JSX.Element}
         */
        public render(): JSX.Element { super.render();           
            return (
                <div id={this.id} className={this.classNameAttribute()} title={"Select language.".translate()}>
                    <span className={"language en" + ("en" === this.state.language ? " active" : "")} data-language="en">
                        <button onClick={this.onClick} className="button-shadow dialog-action">English</button>
                    </span>
                    <span className={"language pt" + ("pt" === this.state.language ? " active" : "")} data-language="pt">
                        <button onClick={this.onClick} className="button-shadow dialog-action">Português</button>
                    </span>
                </div>
            );
        }
    }
}
