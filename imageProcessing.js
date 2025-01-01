function processImage(sourceImg, size) {
    let h = sourceImg.width*size / sourceImg.height;
    sourceImg.resize(size, h);
    sourceImg.loadPixels();
    for (let y = 0; y < sourceImg.height; y++) {
        for (let x = 0; x < sourceImg.width; x++) {
            const i = (x + y * sourceImg.width) * 4;
            const r = sourceImg.pixels[i];
            const g = sourceImg.pixels[i + 1];
            const b = sourceImg.pixels[i + 2];
            // 白かどうかを判定 (完全な白 RGB(255,255,255))
            if (!(r === 255 && g === 255 && b === 255)) {
                // 白以外の場合は黒にする
                sourceImg.pixels[i] = 0; // R
                sourceImg.pixels[i + 1] = 0; // G
                sourceImg.pixels[i + 2] = 0; // B
            } else {
                sourceImg.pixels[i + 3] = 0;
            }
        }
    }
    sourceImg.updatePixels(); // ピクセルデータを更新
    return sourceImg; // 加工済みの画像を返す
}

function addSlitedImage(sourceImg, rc_width, rc_num, index) {
    let pg = createGraphics(sourceImg.width, sourceImg.height);
    pg.clear();
    pg.image(sourceImg, 0, 0);
    pg.noStroke();
    //スリットの追加
    let count = index+1;
    console.log(count);
    for (let x = 0; x < pg.width; x += rc_width) {
        if (count < rc_num) {
            pg.fill(255);
            pg.rect(x, 0, rc_width, pg.height);
            count++;
        } else {
            count = 1;
        }
    }
    pg.loadPixels();
    let d = pixelDensity();
    for (let i = 0; i < 4 * (pg.width * d) * (pg.height * d); i += 4) {
        if (pg.pixels[i] > 0) pg.pixels[i + 3] = 0;
    }
    pg.updatePixels(); // ピクセルデータを更新
    return pg;
}


function compositeImage(imgs){
    let pg = createGraphics(imgs[0].width, imgs[0].height);
    pg.clear();
    imgs.forEach((img, i) => {
        pg.image(img, 0, 0);        
    });
    pg.updatePixels();
    return pg;
}