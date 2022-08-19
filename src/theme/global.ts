import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
@font-face {
    font-family: "Eau Naturelle Sans";
    src: url("eau_sans_book.otf") format("opentype");
    font-weight: normal;
}

@font-face {
    font-family: "Eau Naturelle Sans";
    src: ("eau_sans_black.otf") format ("opentype");
    font-weight: 600;
}

body {
    margin: 0px;
    padding: 0px;
    overflow-x: hidden;
}
`;

export default GlobalStyle;
