import {OutputType, Status, Weight, Brightness, Color} from "../../Enums";
import {colors, colorValue} from "./colors";
import {TabHoverState} from "../TabComponent";
import {darken, lighten, failurize, alpha} from "./functions";
import {Attributes} from "../../Interfaces";
import {CSSObject} from "./definitions";
import {ColumnList, PaneList} from "../../utils/PaneTree";
import {CSSProperties} from "react";

const jobBackgroundColor = colors.black;
const backgroundColor = darken(jobBackgroundColor, 4);
const fontFamily = "'Hack', 'Fira Code', 'Menlo', monospace";
const fontSize = 14;
const promptFontSize = fontSize * 1.1;
export const outputPadding = 10;
const suggestionSize = 2 * fontSize;
export const titleBarHeight = 24;
export const rowHeight = fontSize + 2;
export const statusBarHeight = 70;
export const promptLetterWidth = promptFontSize / 2 + 1.5;

function getLetterWidth(size: number, fontFamily: string) {
    // document is not defined in tests.
    if (typeof document !== "undefined") {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d")!;
        context.font = `${size}px ${fontFamily}`;
        return context.measureText("m").width;
    } else {
        return (size / 2) + 1.5;
    }
}

export const letterWidth = getLetterWidth(fontSize, fontFamily);

const cssVariables = {
    "--font-size": `${fontSize}px`,
    "--font-family": fontFamily,
    "--title-bar-height": `${titleBarHeight}px`,
    "--row-height": `${rowHeight}px`,
    "--status-bar-height": `${statusBarHeight}px`,
    "--content-padding": `${outputPadding}px`,
    "--background-color": backgroundColor,
    "--job-background-color": jobBackgroundColor,
    "--job-background-color-failure": failurize(jobBackgroundColor),
    "--text-color": colors.white,
    "--black-color": colors.black,
    "--white-color": colors.white,
};

const decorationWidth = 30;
const searchInputColor = lighten(backgroundColor, 15);

function sessionsGridTemplate(list: PaneList): CSSObject {
    if (list instanceof ColumnList) {
        return {
            gridTemplateColumns: `repeat(${list.children.length}, calc(100% / ${list.children.length}))`,
            gridTemplateRows: "100%",
        };
    } else {
        return {
            gridTemplateRows: `repeat(${list.children.length}, calc(100% / ${list.children.length}))`,
            gridTemplateColumns: "100%",
        };
    }
}

function tabCloseButtonColor(hover: TabHoverState) {
    if (hover === TabHoverState.Close) {
        return colors.red;
    } else if (hover === TabHoverState.Tab) {
        return colors.white;
    } else {
        return "transparent";
    }
}

function jaggedBorder(color: string, panelColor: string, darkenPercent: number) {
    return {
        background: `-webkit-linear-gradient(${darken(panelColor, darkenPercent)} 0%, transparent 0%) 0 100% repeat-x,
                     -webkit-linear-gradient(135deg, ${color} 33.33%, transparent 33.33%) 0 0 / 15px 50px,
                     -webkit-linear-gradient(45deg, ${color} 33.33%, ${darken(panelColor, darkenPercent)} 33.33%) 0 0 / 15px 50px`,
    };
}

export const application = {
    ...cssVariables,
};

export const jobs = (isSessionFocused: boolean): CSSObject => ({
    ...(isSessionFocused ? {} : {pointerEvents: "none"}),
});

export const suggestionIcon = {
    fontFamily: "FontAwesome",
    display: "inline-block",
    width: suggestionSize,
    height: suggestionSize,
    lineHeight: "2em",
    verticalAlign: "middle",
    textAlign: "center",
    fontStyle: "normal",
    opacity: .5,
    marginRight: 10,
    backgroundColor: "rgba(0, 0, 0, 0.15)",
};

export const autocomplete = {
    box: (caretPosition: number): CSSProperties => {
        return {
            left: decorationWidth + (caretPosition * promptLetterWidth),
        };
    },
    synopsis: {
        float: "right",
        opacity: 0.5,
        fontSize: "0.8em",
        marginTop: "0.65em",
        marginRight: 5,
    },
    value: {
        paddingRight: 30,
    },
    item: (isHighlighted: boolean) => {
        const style: CSSObject = {
            listStyleType: "none",
            padding: 2,
            cursor: "pointer",
        };

        if (isHighlighted) {
            style.backgroundColor = "#383E4A";
        }

        return style;
    },
    suggestionsList: {
        maxHeight: 300,
        overflow: "auto",
        padding: 0,
        margin: 0,
    } as CSSProperties,
};

export const statusBar = {
    status: (status: VcsStatus) => ({
        color: status === "dirty" ? colors.blue : colors.white,
    }),
};

export const sessions = (list: PaneList) => ({
    ...sessionsGridTemplate(list),
});

export const session = (isFocused: boolean) => {
    const styles: CSSObject = {};

    if (!isFocused) {
        styles.boxShadow = `0 0 0 1px ${alpha(colors.white, 0.3)}`;
        styles.margin = "0 1px 0 0";
    }

    return styles;
};

export const sessionShutter = (isFocused: boolean) => ({
    backgroundColor: colors.white,
    opacity: isFocused ? 0 : 0.2,
});

export const tabs = {
    justifyContent: "center" as "center",
    display: "flex",
    WebkitMarginBefore: 0,
    WebkitMarginAfter: 0,
    WebkitPaddingStart: 0,
    WebkitUserSelect: "none",
    listStyle: "none",
    paddingLeft: 68,
    paddingRight: 129,
};

const searchInputHeight = titleBarHeight - 6;
export const search: CSSProperties = {
    position: "absolute",
    right: 4,
    top: (titleBarHeight - searchInputHeight) / 2,
};

export const searchIcon: CSSProperties = {
    position: "relative",
    left: fontSize,
    top: -1,
    fontSize: fontSize - 4,
    fontFamily: "FontAwesome",
};

export const searchInput = {
    backgroundColor: searchInputColor,
    border: 0,
    borderRadius: 3,
    WebkitAppearance: "none",
    outline: "none",
    height: searchInputHeight,
    width: 120,
    paddingLeft: fontSize,
    color: colors.white,
};

export const tab = (isHovered: boolean, isFocused: boolean): CSSProperties => {
    return {
        backgroundColor: isHovered ? backgroundColor : colors.black,
        opacity: (isHovered || isFocused) ? 1 : 0.3,
        position: "relative",
        height: titleBarHeight,
        flex: "auto",
        display: "inline-block",
        textAlign: "center",
        paddingTop: 2,
    };
};

export const tabClose = (hover: TabHoverState): CSSProperties => {
    const margin = titleBarHeight - fontSize;

    return {
        fontFamily: "FontAwesome",
        color: tabCloseButtonColor(hover),
        position: "absolute",
        left: margin,
        top: margin / 2,
    };
};

export const commandSign = {
    fontSize: fontSize + 3,
    verticalAlign: "middle",
};

// To display even empty rows. The height might need tweaking.
// TODO: Remove if we always have a fixed output width.
export const charGroup = (attributes: Attributes) => {
    const styles: CSSObject = {
        color: colorValue(attributes.color, {isBright: attributes.brightness === Brightness.Bright}),
        backgroundColor: colorValue(attributes.backgroundColor, {isBright: false}),
    };

    if (attributes.inverse) {
        const color = styles.color;

        styles.color = styles.backgroundColor;
        styles.backgroundColor = color;
    }

    if (attributes.underline) {
        styles.textDecoration = "underline";
    }

    if (attributes.weight === Weight.Bold) {
        styles.fontWeight = "bold";
    }

    // Remove default colors to allow CSS override for failed commands and reverse mode.
    if (attributes.color === Color.White && !attributes.inverse) {
        delete styles.color;
    }
    if (attributes.backgroundColor === Color.Black && !attributes.inverse) {
        delete styles.backgroundColor;
    }

    return styles;
};

export const outputCut = (status: Status): CSSProperties => ({
    ...jaggedBorder(
        [Status.Failure, Status.Interrupted].includes(status) ? failurize(jobBackgroundColor) : jobBackgroundColor,
        [Status.Failure, Status.Interrupted].includes(status) ? failurize(backgroundColor) : backgroundColor,
        0,
    ),
    color: lighten(jobBackgroundColor, 35),
});

export const outputCutIcon = {marginRight: 10, fontFamily: "FontAwesome"};

export const output = (activeOutputType: OutputType, status: Status) => {
    const styles: CSSObject = {};

    if (activeOutputType === OutputType.Alternate) {
        if ([Status.Failure, Status.Interrupted, Status.Success].includes(status)) {
            styles.zoom = 0.1;
        }

        if (status === Status.InProgress) {
            styles.backgroundColor = jobBackgroundColor;
            styles.position = "absolute";
            styles.top = 0;
            styles.bottom = 0;
            styles.left = 0;
            styles.right = 0;
            styles.zIndex = 4;
        }
    }

    return styles;
};

export const cursor = (rowIndex: number, columnIndex: number) => ({
    top: rowIndex * rowHeight,
    left: columnIndex * letterWidth,
    height: rowHeight,
    width: letterWidth,
});

export const actions = {
    marginRight: 15,
    textAlign: "right",
};

export const action = {
    textAlign: "center",
    width: fontSize,
    display: "inline-block",
    margin: "0 3px",
    cursor: "pointer",
    fontFamily: "FontAwesome",
};

export const prettifyToggle = (isEnabled: boolean) => {
    return {
        ...action,
        color: isEnabled ? colors.green : colors.white,
    };
};

export const image = {
    maxHeight: "90vh",
    maxWidth: "100vh",
};
