import { css } from "styled-components";

const theme = {
  borderRadius: "5px",

  boxShadow: "rgb(0 0 0 / 13%) 0px 0px 1px, rgb(0 0 0 / 20%) 0px 1px 3px",
  colors: {
    blue: "#007bff",
    blueGray: "#4B6587",
    cyan: "#17a2b8",
    danger: "#ff0000",
    // gray: '#808080',
    darkGray: "#343a40",
    fuchsia: "#f012be",
    gray: "#71797E",
    green: "#28a745",
    indigo: "#6610f2",
    lightBlue: "#3c8dbc",
    lightGray: "#ebebeb",
    lime: "#01ff70",
    main: "#1890ff",
    mainBackground: "#f4f6f9",
    mainBlack: "#000000",
    mainFontColor: "#343a40",
    mainHover: "#1890ff",
    mainWhite: "#ffffff",
    maroon: "#d81b60",
    navy: "#001f3f",
    olive: "#3d9970",
    orange: "#ff851b",
    pink: "#e83e8c",
    purple: "#605ca8",
    red: "#dc3545",
    success: "#2ecc71",
    teal: "#39cccc",
    transparent: "transparent",
    warning: "#ffa700",
    yellow: "#ffc107",
  },
  disabled: "0.65",
  fontSize: {
    lg: "16px",
    md: "15px",
    sm: "14px",
    xl: "18px",
    xs: "13px",
    xxs: "11px",
  },
  fontWeight: {
    lg: 600,
    md: 500,
    sm: 400,
    xl: "bold",
    xs: "normal",
  },

  mixin: {
    boxModel: ({ h = null, mg = null, pd = null, w = null }) => {
      return css`
        width: ${w};
        width: ${({ theme }) => theme.tagWidth[w]};
        height: ${h};
        height: ${({ theme }) => theme.tagHeight[h]};
        margin: ${mg};
        padding: ${pd};
      `;
    },
    ellipsis: ({
      overflow = "hidden",
      textOverflow = "ellipsis",
      whiteSpace = "nowrap",
    }) => {
      return css`
        overflow: ${overflow};
        white-space: ${whiteSpace};
        text-overflow: ${textOverflow};
      `;
    },
    flexSet: ({
      align = "center",
      direction = "row",
      display = "flex",
      justify = "center",
    }) => {
      return css`
        display: ${display};
        justify-content: ${justify};
        align-items: ${align};
        flex-direction: ${direction};
      `;
    },
    fontSet: ({
      title = "sm",
      size = "14px",
      weight = "normal",
      family = `'Noto Sans KR', 'Lucida Grande', Helvetica, Arial, sans-serif`,
      decoration = null,
    }) => {
      return css`
        font-size: ${({ theme }) => theme.title[title]};
        font-size: ${size};
        font-weight: ${weight};
        font-family: ${family || "Noto Sans KR"};
        text-decoration: ${decoration};
      `;
    },
    smallDot: ({
      backgroundColor = "#888",
      borderRadius = "50%",
      content = "",
      height = "2px",
      position = "absolute",
      top = "50%",
      transform = "translateY(-50%)",
      width = "2px",
    }) => {
      return css`
        content: ${content};
        position: ${position};
        width: ${width};
        height: ${height};
        background-color: ${backgroundColor};
        top: ${top};
        transform: ${transform};
        border-radius: ${borderRadius};
      `;
    },
    tagSet: ({
      bg = "main",
      fontSize = "sm",
      h = "sm",
      w = "sm",
      weight = "xs",
    }) => {
      return css`
        width: ${({ theme }) => theme.tagWidth[w] || w};
        height: ${({ theme }) => theme.tagHeight[h] || h};
        background-color: ${({ theme }) => theme.colors[bg]} !important;
        border: 1px solid ${({ theme }) => theme.colors[bg]} !important;
        font-size: ${({ theme }) => theme.fontSize[fontSize]};
        font-weight: ${({ theme }) => theme.fontWeight[weight]};
      `;
    },
  },
  tagHeight: {
    lg: "44px",
    md: "36px",
    sm: "30px",
    xl: "60px",
    xs: "24px",
  },
  tagWidth: {
    "10%": "10%",
    "100%": "100%",
    "20%": "20%",
    "200%": "200%",
    "2xl": "480px",
    "30%": "30%",
    "3xl": "720px",
    "40%": "40%",
    "50%": "50%",
    "60%": "60%",
    "70%": "70%",
    "80%": "80%",
    "90%": "90%",
    lg: "200px",
    md: "160px",
    sm: "120px",
    xl: "240px",
    xs: "100px",
  },

  title: {
    lg: "20px",
    md: "18px",
    sm: "17px",
    xl: "24px",
    xs: "15px",
  },
};

export default theme;
