/// <reference path="Part/System/MainHeader/Component/MainHeader.tsx" />
/// context: SystemPart,SystemPartPublic

/// <reference path="Part/System/MainHeader/Part.tsx" />
/// context: SystemPart,SystemPartPublic

/// #############################################

/// <reference path="Part/System/LogViewer/Component/LogViewer.tsx" />
/// context: SystemPart,SystemPartPrivate

/// <reference path="Part/System/LogViewer/Part.tsx" />
/// context: SystemPart,SystemPartPrivate

/// #############################################

/// <reference path="Part/User/LuckygamesAdjusts/Component/LuckygamesAdjusts.tsx" />
/// context: PaidPart,LuckygamesAdjusts

/// <reference path="Part/User/LuckygamesAdjusts/Part.tsx" />
/// context: PaidPart,LuckygamesAdjusts

/// #############################################

/// <reference path="Layout/Theme/Stylesheet.tsx" />
/// context: react

/// <reference path="Layout/ReactJs/ComponentBase.tsx" />
/// context: react

/// <reference path="Layout/ReactJs/MoveAndResize.tsx" />
/// context: react

/// <reference path="Layout/ReactJs/Visibility.tsx" />
/// context: react

/// <reference path="Layout/ReactJs/Component/Switch.tsx" />
/// context: react

/// <reference path="Layout/ReactJs/Component/LanguageSelectBus.tsx" />
/// context: react

/// <reference path="Layout/ReactJs/Component/LanguageSelect.tsx" />
/// context: react

/// <reference path="Layout/ReactJs/Component/Dialog.tsx" />
/// context: react

/// <reference path="Layout/ReactJs/Component/ButtonActivator.tsx" />
/// context: react

/// <reference path="Layout/ReactJs/Component/ShowMessages.tsx" />
/// context: react

/// #############################################

/// <reference path="Util/DateTime.tsx" />
/// context: Initialize

/// <reference path="Util/DOM.tsx" />
/// context: Initialize

/// <reference path="Util/Drawing.tsx" />
/// context: Initialize

/// <reference path="Util/LoadReferences.tsx" />
/// context: Initialize

/// <reference path="Util/Number.tsx" />
/// context: Initialize

/// <reference path="Util/String.tsx" />
/// context: Initialize

/// #############################################

/// <reference path="Core/Environment/String.tsx" />
/// context: Initialize

/// <reference path="Core/Environment/Date.tsx" />
/// context: Initialize

/// <reference path="Core/Environment/Number.tsx" />
/// context: Initialize

/// #############################################

/// <reference path="Core/Log/Level.tsx" />
/// context: Initialize

/// <reference path="Core/Log/Message.tsx" />
/// context: Initialize

/// <reference path="Core/Log/ConsoleLog.tsx" />
/// context: Initialize

/// <reference path="Core/Log/History.tsx" />
/// context: Initialize

/// #############################################

/// <reference path="Core/Configuration.tsx" />
/// context: Initialize

/// <reference path="Core/Data.tsx" />
/// context: Initialize

/// #############################################

/// <reference path="Core/Bus/Message.tsx" />
/// context: Initialize

/// <reference path="Core/Bus/MessageHandler.tsx" />
/// context: Initialize

/// <reference path="Core/Bus/MessageBus.tsx" />
/// context: Initialize

/// <reference path="Core/Message/RegisterPart.tsx" />
/// context: Initialize

/// #############################################

/// <reference path="Locale/Format/Number.tsx" />
/// context: Initialize

/// <reference path="Locale/Format/Date.tsx" />
/// context: Initialize

/// <reference path="Locale/FormatSet.tsx" />
/// context: Initialize

/// <reference path="Locale/Formats.tsx" />
/// context: Initialize

/// <reference path="Locale/Message/LanguageChanged.tsx" />
/// context: Initialize

/// <reference path="Locale/Message/SetLanguage.tsx" />
/// context: Initialize

/// <reference path="Locale/TranslatesBus.tsx" />
/// context: Initialize

/// <reference path="Locale/Translate.tsx" />
/// context: Initialize

/// <reference path="Locale/Translates.tsx" />
/// context: Initialize

/// #############################################

/// <reference path="Layout/Theme/Colors.tsx" />
/// context: Initialize

/// <reference path="Layout/Message/DialogCreate.tsx" />
/// context: Initialize

/// <reference path="Layout/Message/MainDialogToggle.tsx" />
/// context: Initialize

/// <reference path="Layout/Message/AppendToMainDialog.tsx" />
/// context: Initialize

/// <reference path="Layout/PresentationBus.tsx" />
/// context: Initialize

/// <reference path="Layout/Presentation.tsx" />
/// context: Initialize

/// #############################################

/// <reference path="Core/Api/ScriptContext.tsx" />
/// context: Initialize

/// <reference path="Core/Api/Data.tsx" />
/// context: Initialize

/// <reference path="Core/Api/DataType.tsx" />
/// context: Initialize

/// <reference path="Core/Api/Request.tsx" />
/// context: Initialize

/// #############################################

/// <reference path="Data/Packet.tsx" />
/// context: Initialize

/// <reference path="Data/Storage.tsx" />
/// context: Initialize

/// #############################################

/// <reference path="Part/Tools.tsx" />
/// context: Initialize

/// <reference path="Part/PartBase.tsx" />
/// context: Initialize

/// #############################################

/// <reference path="Core/MainBus.tsx" />
/// context: Initialize

/// <reference path="Core/Main.tsx" />
/// context: Initialize

/// <reference path="Core/Infrastructure.tsx" />
/// context: Initialize

/// <reference path="Core/All.tsx" />
/// context: Initialize

/// #############################################

const skript: Skript.Core.All = new Skript.Core.All();

new Skript.Core.Infrastructure({
    name: "Luckygames Tips",
    debug: true,
    welcome: true,
    server: "https://dsv.luckygames.tips/"
});
