/// <reference path="Core.Translate.tsx" />
/// <reference path="Util.String.tsx" />
/// <reference path="Util.Load.tsx" />
/// <reference path="Core.Messages.tsx" />
/// <reference path="Visual.Theme.tsx" />
/// <reference path="Visual.Layout.tsx" />
/// <reference path="Core.Main.tsx" />
/// <reference path="Component.Dialog.tsx" />

/**
 * Abaixo, configuração para determinar quais script
 * são retornados pelo endereço https://luckygames.tips/script?{modulo}
 * Onde {modulo} na lista abaixo fica após o sinal de igual.
 */
/// script=: Core.Translate
/// script=: Util.String
/// script=: Util.Load
/// script=: Core.Messages
/// script=: Visual.Theme
/// script=: Visual.Layout
/// script=: Core.Main
/// script=react: Component.Dialog

Core.Main.initialize({ debug: true });