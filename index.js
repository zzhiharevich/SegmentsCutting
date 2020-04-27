const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

var number_of_segments = null;
var segments_coords = null;
var rectangle_coords = null;

function readFile(input) {
    let file = input.files[0];
    let reader = new FileReader();
    reader.readAsText(file);

    reader.onload = function () {
        var result = reader.result;

        //var spletted_result = result.replace(/\r?\n/g, "").replace(/\s+/g,'');
        var spletted_result = result.split('\n');

        number_of_segments = parseInt(spletted_result[0]);
        segments_coords = [];

        for(let i = 1; i <= number_of_segments; i++){
            segments_coords.push(spletted_result[i].split(' '));
        }

        rectangle_coords = spletted_result[number_of_segments + 1].split(' ');

        //console.log(number_of_segments);
        //console.log(segments_coords);
        //console.log(rectangle_coords);
    };
    reader.onerror = function () {
        console.log(reader.error);
    };

    return number_of_segments, segments_coords, rectangle_coords;
}

function drawSegments(n, coords, rect_coords){

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.transform(1, 0, 0, -1, 0, canvas.height);

    ctx.strokeStyle = "green";
    ctx.beginPath();
    let width = rect_coords[2] - rect_coords[0];
    let height = rect_coords[3] - rect_coords[1];
    ctx.strokeRect(rect_coords[0], rect_coords[1], width, height);
    ctx.stroke();

    for(let i = 0; i < n; i++){
        var coordinates = liang_barsky_clipper(coords[i], rect_coords, i);
        console.log('i: ' + i)
        console.log('New coords: ' + coordinates);
        ctx.strokeStyle = "lightgrey";
        ctx.beginPath();
        ctx.moveTo(coordinates[0], coordinates[1]);
        ctx.lineTo(coordinates[2], coordinates[3]);
        ctx.stroke();

        ctx.strokeStyle = "black";
        ctx.beginPath();

        ctx.moveTo(coords[i][0], coords[i][1]);
        ctx.lineTo(coordinates[0], coordinates[1]);

        ctx.moveTo(coords[i][2], coords[i][3]);
        ctx.lineTo(coordinates[2], coordinates[3]);
        ctx.stroke();
    }
    ctx.transform(1, 0, 0, -1, 0, canvas.height)
}

function liang_barsky_clipper(coords, rect, line_number){
    console.log('Coords: ' + typeof coords + coords);
    console.log('Rect coords: ' + typeof rect + rect);

    var floatCoords = [];
    var floatRect = [];
    for(let i = 0; i < coords.length; i++){
        floatCoords.push(parseFloat(coords[i]));
    }
    console.log(floatCoords);
    for(let i = 0; i < rect.length; i++){
        floatRect.push(parseFloat(rect[i]));
    }
    console.log(floatRect)

    var p1 = -(floatCoords[2] - floatCoords[0]);
    var p2 = -p1;
    var p3 = -(floatCoords[3] - floatCoords[1]);
    var p4 = -p3;

    var q1 = floatCoords[0] - floatRect[0];
    var q2 = floatRect[2] - floatCoords[0];
    var q3 = floatCoords[1] - floatRect[1];
    var q4 = floatRect[3] - floatCoords[1];

    var posarr = new Array(5);
    var negarr = new Array(5);
    var posind = 1;
    var negind = 1;
    posarr[0] = 1;
    negarr[0] = 0;

    if((p1 == 0 && q1 < 0) || (p3 == 0 && q3 < 0)) {
        alert('Line №' + (line_number + 1) + ' is parallel to clipping window!');
        return;
    }
    if(p1 != 0) {
        let r1 = q1 / p1;
        let r2 = q2 / p2;
        if (p1 < 0) {
            negarr[negind++] = r1; // При отрицательном p1, добавляем r1 к отрицательному массиву
            posarr[posind++] = r2; // и добавляем r2 к положительному массиву
        } else {
            negarr[negind++] = r2;
            posarr[posind++] = r1;
        }
    }
    if (p3 != 0) {
        let r3 = q3 / p3;
        let r4 = q4 / p4;
        if (p3 < 0) {
            negarr[negind++] = r3;
            posarr[posind++] = r4;
        } else {
            negarr[negind++] = r4;
            posarr[posind++] = r3;
        }
    }

    var xn1, yn1, xn2, yn2;
    var rn1, rn2;
    rn1 = maxi(negarr, negind); // Максимум отрицательного массива
    rn2 = mini(posarr, posind); // Минимум положительного массива

    if (rn1 > rn2) { // Отклоняем
        alert('Line №' + (line_number + 1) + ' is outside the clipping window!');
        return;
    }

    xn1 = floatCoords[0] + p2 * rn1;
    yn1 = floatCoords[1] + p4 * rn1; // Вычисляем новые точки

    xn2 = floatCoords[0] + p2 * rn2;
    yn2 = floatCoords[1] + p4 * rn2;
    return [xn1, yn1, xn2, yn2];
}

// Функция, возвращающая максимум в массиве
function maxi(arr, n) {
    var m = 0;
    for (let i = 0; i < n; ++i)
        if (m < arr[i])
            m = arr[i];
    return m;
}

// Функция, возвращающая минимум в массиве
function mini(arr, n) {
    var m = 1;
    for (let i = 0; i < n; ++i)
        if (m > arr[i])
            m = arr[i];
    return m;
}

function drawRectangle(rectangle_coords){

}

function LBA(){

    drawSegments(number_of_segments, segments_coords, rectangle_coords);
    //console.log(number_of_segments);
    //console.log(segments_coords);
    //console.log(rectangle_coords);
}