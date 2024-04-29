
export const fitViewport = () => {
    const cssText = `
    :root {
        --doc-height: 100dvh;
    }
       
    html,
    body {
    padding: 0;
    margin: 0;
    height: 100vh; /* fallback for Js load */
    height: 100dvh; /* fallback for Js load */
    height: var(--doc-height);
    }
    `;
    const style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(cssText));
    document.head.appendChild(style);
    const documentHeight = () => {
        const doc = document.documentElement
        doc.style.setProperty('--doc-height', `${window.visualViewport?.height || window.innerHeight}px`)
    }
    window.addEventListener('resize', documentHeight)
    documentHeight();
}