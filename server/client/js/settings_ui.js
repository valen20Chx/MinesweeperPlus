var sizeRange = document.getElementById('size');
var difficultyRange = document.getElementById('difficulty');

sizeRange.onchange = () => {
	document.getElementById('sizeValue').innerText = sizeRange.value;
};

difficultyRange.onchange = () => {
	document.getElementById('difficultyValue').innerText = difficultyRange.value;
};