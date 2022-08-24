function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

const pixelSize = 30;
const lineWidth = 3;

var indexedColors = [
  [255, 0, 0],
  [0, 0, 255],
  [0, 255, 0],
  [255, 255, 0],
  [255, 165, 0],
  [255, 255, 255],
];

function closestIndexedColor(color) {
  var closest = {};
  var dist;
  for (var i = 0; i < indexedColors.length; i++) {
    dist = Math.pow(indexedColors[i][0] - color[0], 2);
    dist += Math.pow(indexedColors[i][1] - color[1], 2);
    dist += Math.pow(indexedColors[i][2] - color[2], 2);
    dist = Math.sqrt(dist);

    if (!closest.dist || closest.dist > dist) {
      closest.dist = dist;
      closest.color = indexedColors[i];
    }
  }
  // returns closest match as RGB array without alpha
  return closest.color;
}



function drawCube(ctx, row, column, colors) {

  ctx.fillStyle = `rgb(0,0,0)`;

  let pixel_y = row + (row * lineWidth * 3) + (row * pixelSize * 3);
  let pixel_x = column + (column * lineWidth * 3) + (column * pixelSize * 3);;

  for (let i = 0; i < 4; i++) {
    ctx.fillRect(pixel_y, pixel_x + pixelSize * i + (lineWidth * i), pixelSize * 3 + (lineWidth * 3) + lineWidth, lineWidth);
    ctx.fillRect(pixel_y + pixelSize * i + (lineWidth * i), pixel_x, lineWidth, pixelSize * 3 + (lineWidth * 3) + lineWidth);
  }
  let i = 0
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      let color = closestIndexedColor(colors[i])
      // let color = colors[i]
      ctx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
      ctx.fillRect(
        pixel_y + (lineWidth * r) + (pixelSize * r) + lineWidth,
        pixel_x + (lineWidth * c) + (pixelSize * c) + lineWidth,
        pixelSize, pixelSize
      );
      i++
    }
  }
}

export default function Home() {
  function handleClick() {
    let imageFile = document.getElementById('original').files[0];
    let width = document.getElementById('width').value;
    let height = document.getElementById('height').value;

    var reader = new FileReader();
    reader.onload = function (e) {
      var img = document.createElement("img");
      img.onload = function (event) {
        var canvas = document.createElement('canvas'),
          ctx = canvas.getContext("2d");

        canvas.width = width * 3;
        canvas.height = height * 3;
        ctx.fillStyle = `rgb(255,255,255)`;
        ctx.fillRect(0, 0, width * 3, height * 3)
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        document.getElementById("scaled_down").src = canvas.toDataURL();
        var result = document.createElement('canvas'),
          result_ctx = result.getContext("2d");
        result.width = pixelSize * width * 3 + width * lineWidth * 4
        result.height = pixelSize * height * 3 + height * lineWidth * 4

        for (let row = 0; row < width; row++) {
          for (let column = 0; column < height; column++) {
            let rawImageData = ctx.getImageData(row * 3, column * 3, 3, 3)
            let imageData = [];

            for (let x = 0; x < 9; x++) {
              let imageSet = rawImageData.data.slice(x * 4, x * 4 + 3)
              imageData.push(imageSet)
            }
            drawCube(result_ctx, row, column, imageData);
          }
        }
        document.getElementById("result").src = result.toDataURL();
      }
      document.getElementById("normal").src = e.target.result;
      img.src = e.target.result;
    }
    reader.readAsDataURL(imageFile);
  }

  return (
    <div>
      <div>
      <img id="normal" width="300" />
      <img id="scaled_down" width="300" />
      <img id="result" width="300" />
      </div>
      
      <hr />
Rows: <input type="field" id="width" defaultValue="9" /><br />
Columns: <input type="field" id="height" defaultValue="9" /> <br />
Select image: <input type='file' id="original" accept='image/*' /><br />
      <button onClick={handleClick}>Generate</button>
    </div>
  )
  
//  return (<div></div>)
}