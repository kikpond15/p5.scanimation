let slit_frame_count, slit_width, imageSize;
let fileInput, showSlit, exportButton;
let images = [];
let slitImage,slitIllusts;
let slitPos = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  //GUI Set up
  fileInput = createInput();
  fileInput.position(10, 10);
  fileInput.attribute('type', 'file'); // ファイル選択として設定
  fileInput.attribute('multiple', ''); // 複数選択を有効化
  fileInput.elt.addEventListener('change', handleFileSelect, false);
  showSlit = createButton("Hide Slit");
  showSlit.position(10, 40);
  showSlit.mouseClicked(showOrHideSlide);

  exportButton = createButton("Export");
  exportButton.position(10, 250);
  exportButton.mouseClicked(exportSlits);

  slit_frame_count = createSlider(2, 6, 6, 1);
  slit_frame_count.position(10, 100);
  slit_frame_count.input(changeSlit);
  slit_width = createSlider(1, 10, 2, 1);
  slit_width.position(10, 150);
  slit_width.input(changeSlit);
  imageSize = createSlider(100, 800, 300, 100);
  imageSize.position(10, 200);
  noStroke();
  imageMode(CENTER);

  slitImage = createGraphics(width, height);
  changeSlit();
}

function draw() {
  background(255);
  if (images.length > 0) image(slitIllusts, width / 2 + slitPos, height / 2);
  if (showSlit.html() === "Hide Slit") image(slitImage, width/2, height/2);

  if (keyIsPressed) {
    if (keyCode === LEFT_ARROW) slitPos -= 1;
    else if (keyCode === RIGHT_ARROW) slitPos += 1;
  }
  drawGuiText();
}



function exportSlits() {
  if(images.length > 0){
    save(slitIllusts,'img.png');
    save(slitImage,'slit.png');
  } 
}

function changeSlit() {
  slitImage.clear();
  let count = 1;
  for (let x = 0; x < width; x += slit_width.value()) {
    if (count < slit_frame_count.value()) {
      slitImage.fill(0);
      slitImage.rect(150 + x, 100, slit_width.value(), height);
      count++;
    } else {
      count = 1;
    }
  }
}

function handleFileSelect(evt) {
  let files = Array.from(evt.target.files);
  // ファイル名に基づいてソート（番号順）
  files.sort((a, b) => {
    let numA = extractNumber(a.name);
    let numB = extractNumber(b.name);
    return numA - numB; // 番号でソート
  });
  imageOrder = Array(files.length).fill(null); // ソート後の順序を保持する配列
  images = [];
  // 各ファイルを処理
  for (let i = 0, f; f = files[i]; i++) {
    if (f.type.startsWith('image/')) { // 画像ファイルのみ処理
      let reader = new FileReader();
      reader.readAsDataURL(f); // ファイルをデータURLとして読み込む
      reader.onload = function (e) {
        loadImage(e.target.result, function (img) {
          imageOrder[i] = img;
          // 全ての画像が読み込まれたら描画
          if (imageOrder.every(img => img !== null)) {
            images = imageOrder;
            images = [];
            imageOrder.forEach((img, index) => {
              img = processImage(img, imageSize.value());
              images.push(addSlitedImage(img, slit_width.value(), imageOrder.length, index));
            });
            slitIllusts = compositeImage(images);
          }
        });
      }
    }
  }
}

// ファイル名から番号を抽出する関数
function extractNumber(filename) {
  let match = filename.match(/\d+/); // 数字部分を正規表現で抽出
  return match ? parseInt(match[0], 10) : 0; // 数字が見つからない場合は0
}

function drawGuiText() {
  text("Slit Number : " + slit_frame_count.value(), slit_frame_count.position().x, slit_frame_count.position().y - 5);
  text("Slit Width : " + slit_width.value(), slit_width.position().x, slit_width.position().y - 5);
  text("Image Size : " + imageSize.value(), imageSize.position().x, imageSize.position().y - 5);
}

function showOrHideSlide() {
  if (showSlit.html() === "Hide Slit") showSlit.html("Show Slit");
  else showSlit.html("Hide Slit");
}
