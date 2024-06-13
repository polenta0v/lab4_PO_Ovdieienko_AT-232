const $fon = document.querySelector('.fon');
const $addbutton = document.querySelector('#button');

let action = false;
let $selectedNote = null;
let selectedNoteIndex = null;
let notes = [];

const areaWidth = $fon.offsetWidth;
const areaHeight = $fon.offsetHeight;
let noteWidth = 0;
let noteHeight = 0;

let startCoords = {
  x: 0,
  y: 0
}
let distance = {
  x: 0,
  y: 0
}

if (!!getLS('notes')) {
  notes = getLS('notes');
  noteGenerator(notes);
}

function setLS(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getLS(key) {
  return JSON.parse(localStorage.getItem(key));
}

function noteGenerator(list) {
  let template = '';
  for (let i = 0; i < list.length; i++) {
    template += '<div class="block" style="left: ' + list[i].x + 'px; top: ' + list[i].y + 'px;" data-index="' + i + '">' +
      '<div class="up">' +
      '<h3>Title</h3>' +
      '<a class="close" data-index="' + i + '">X</a>' +
      '</div>' +
      '<div class="general">' +
      '<textarea class="enter-text">' + list[i].text + '</textarea>' +
      '</div>' +
      '</div>';
  }
  $fon.innerHTML = template;

  setTimeout(() => {
    noteWidth = document.querySelector('.block').offsetWidth;
    noteHeight = document.querySelector('.block').offsetHeight;

    document.querySelectorAll('.enter-text').forEach((textarea, index) => {
      textarea.addEventListener('input', function () {
        notes[index].text = textarea.value;
        setLS('notes', notes);
      });
    });

    document.querySelectorAll('.close').forEach(closeBtn => {
      closeBtn.addEventListener('click', function () {
        const index = closeBtn.getAttribute('data-index');
        notes.splice(index, 1);
        setLS('notes', notes);
        noteGenerator(notes);
      });
    });
  }, 0);
}

function noteController(x, y) {
  $selectedNote.style.left = x + 'px';
  $selectedNote.style.top = y + 'px';
}

$fon.addEventListener('mousedown', function (e) {
  let target = e.target;

  // Find the closest .block element
  if (!target.classList.contains('block')) {
    target = target.closest('.block');
  }

  if (target && target.classList.contains('block')) {
    action = true;
    $selectedNote = target;
    selectedNoteIndex = $selectedNote.getAttribute('data-index');
    startCoords.x = e.pageX;
    startCoords.y = e.pageY;
  }
});

$fon.addEventListener('mouseup', function (e) {
  action = false;
  notes[selectedNoteIndex].x = distance.x;
  notes[selectedNoteIndex].y = distance.y;
  setLS('notes', notes);
});

$fon.addEventListener('mousemove', function (e) {
  if (action) {
    distance.x = notes[selectedNoteIndex].x + (e.pageX - startCoords.x);
    distance.y = notes[selectedNoteIndex].y + (e.pageY - startCoords.y);

    if (distance.x <= 0) distance.x = 0;
    if (distance.x >= (areaWidth - noteWidth)) distance.x = areaWidth - noteWidth;

    if (distance.y <= 0) distance.y = 0;
    if (distance.y >= (areaHeight - noteHeight)) distance.y = areaHeight - noteHeight;

    noteController(distance.x, distance.y);
  }
});

$addbutton.addEventListener('click', function () {
  notes.push({
    x: 0,
    y: 0,
    text: ''
  });
  noteGenerator(notes);
  setLS('notes', notes);
});