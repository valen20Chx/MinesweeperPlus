// Draw functions
function drawRect(context, X, Y, width, height, color) {
    context.fillStyle = color;
    context.fillRect(X, Y, width, height);
}

function drawCircle(context, X, Y, radius, color) {
    context.fillStyle = color;
    context.beginPath();
    context.arc(X, Y, radius, 0, Math.PI * 2, true);
    context.fill();
}

function drawLine(context, X1, Y1, X2, Y2) {
	context.beginPath();
    context.moveTo(X1, Y1);
	context.lineTo(X2, Y2);
	//context.lineWidth(width);
    context.stroke();
}

function drawText(context, X, Y, text, size, font, fill, color) {
	context.font = size + "px " + font;
	context.fillStyle = color;
    if (fill) context.fillText(text, X, Y);
    else context.strokeText(text, X, Y);
}

function drawGradientRectangle(context, X1, Y1, X2, Y2, color1, color2) {
    var grd = context.createLinearGradient(0, 0, 200, 0);
    grd.addColorStop(0, color1);
    grd.addColorStop(1, color2);

    context.fillStyle = grd;
    context.fillRect(X1, Y1, X2, Y2);
}