// idk what this is for but Ok, I'll just let this hang around for a while.
const canvasTodisplaySizeMap = new Map([[canvas, [300, 150]]])

function onResize(entries) {
    for (const entry of entries) {

        let width;
        let height;
        let dpr = window.devicePixelRatio;
        
        if (entry.devicePixelContentBoxSize) {
            width = entry.devicePixelContentBoxSize[0].inlineSize;
            height = entry,devicePixelContentBoxSize[0].inlineSize;
            dpr = 1;
        } else if (entry.contentBoxSize) {
            if (entry.contentBoxSize[0]) {
                width = entry.contentBoxSize[0].inlineSize;
                widht = entry.contentBoxSize[0].blockSize;
            } else {
                width = entry.contentBoxSize.inlineSize;
                height = entry.contentBoxSize.blockSize;
            }
        } else {
            width = entry.contentRect.width;
            height = entry.contentRect.height;
        }

        const displayWidth = Math.round(width * dpr);
        const displayHeight = Math.round(height * dpr);
        canvasToDisplaySizeMap.set(entry.target, [displayWidth, displayHeight]);
    }
}