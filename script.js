console.clear();

setTimeout(() => {
  document.getElementById('splash').classList.toggle('fade');
  setTimeout(() => {
      document.getElementById('splash').style.zIndex = '0';
      document.querySelector('#splash img').src = '';
  }, 1000);
}, 2000);

var _data = '';
var currentLine = '';

setUP();
async function setLyric() {
  await fetch('./lyric.json', {method: 'GET',})
    .then((response) => response.json())
    .then((result) => { _data = result; console.log(_data);})
    .catch((error) => { console.error('Error:', error);});
}

function align() {
  var a = $('.highlighted').height();
  var c = $('.main').height();
  var d =
    $('.highlighted').offset().top - $('.highlighted').parent().offset().top;
  var e = d + a / 2 - c / 2;
  $('.main').animate(
    { scrollTop: e + 'px' },
    { easing: 'swing', duration: 500 }
  );
}

var lyricHeight = $('.lyrics').height();
$(window).on('resize', function () {
  if ($('.lyrics').height() != lyricHeight) {
    lyricHeight = $('.lyrics').height();
    align();
  }
});

$(document).ready(function () {
  $('audio').on('timeupdate', function (e) {
    var time = this.currentTime * 1000;
    var past = _data['lyrics'].filter(function (item) {
      return item.time < time;
    });
    if (_data['lyrics'][past.length] != currentLine) {
      currentLine = _data['lyrics'][past.length];
      $('.lyrics div').removeClass('highlighted');
      $(`.lyrics div:nth-child(${past.length})`).addClass('highlighted');
      align();
    }
  });
});

function createHTML() {
  var html = '';
  console.log(_data);
  for (var i = 0; i < _data['lyrics'].length; i++) {
    html += '<div';
    if (i == 0) {
      html += ` class="highlighted"`;
      currentLine = 0;
    }
    if (_data['lyrics'][i]['note']) {
      html += ` note="${_data['lyrics'][i]['note']}"`;
    }
    html += '>';
    html += _data['lyrics'][i]['line'] == '' ? '•' : _data['lyrics'][i]['line'];
    html += '</div>';
  }
  $('.lyrics').html(html);
  align();
}

async function setUP() {
  await setLyric();
  await createHTML();
}


