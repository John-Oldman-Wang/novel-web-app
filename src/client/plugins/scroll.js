export function getScrollTop() {
    return Math.max(document.body.scrollTop, document.documentElement.scrollTop, 0);
}

export function getScrollHeight() {
    return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, 0);
}

export function getWindowHeight() {
    if (document.compatMode == 'CSS1Compat') {
        return document.documentElement.clientHeight;
    }
    return document.body.clientHeight;
}
