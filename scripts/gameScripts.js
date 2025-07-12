$(document).ready(() => {
  
    // dataset
  const fullData = [
    { country: "France", capital: "Paris", flag: "france" },
    { country: "Germany", capital: "Berlin", flag: "germany" },
    { country: "Italy", capital: "Rome", flag: "italy" },
    { country: "Spain", capital: "Madrid", flag: "spain" },
    { country: "Netherlands", capital: "Amsterdam", flag: "netherlands" },
    { country: "Austria", capital: "Vienna", flag: "austria" },
    { country: "Poland", capital: "Warsaw", flag: "poland" },
    { country: "Sweden", capital: "Stockholm", flag: "sweden" },
    { country: "Norway", capital: "Oslo", flag: "norway" },
    { country: "Greece", capital: "Athens", flag: "greece" }
  ];

  // variables
  const LEVELS = 3;
  const PAIRS_PER_LEVEL = 4;
  let currentLevel = 0;
  let score = 0;
  let timer = 0;
  let timerInterval;
  let flippedCards = [];

  // timer for game
  function startTimer() {
    timer = 0;
    $('#timer').text(`Time: 0s`);
    timerInterval = setInterval(() => {
      timer++;
      $('#timer').text(`Time: ${timer}s`);
    }, 1000);
  }
  // stop timer
  function stopTimer() {
    clearInterval(timerInterval);
  }
  // reset game
  function resetGame() {
    score = 0;
    currentLevel = 0;
    stopTimer();
    $('#greeting').text('');
    $('#score').text(`Score: 0`);
    $('#level').text(`Level: 1 / ${LEVELS}`);
    $('.game-board').empty();
  }
  
  // setup the game level
  function setupLevel() {
    const board = $('.game-board');
    board.empty();
    flippedCards = [];

    if (currentLevel >= LEVELS) {
      board.append(`<h3>🎉 Game Complete! Your time: ${timer}s</h3>`);
      stopTimer();
      return;
    }

    const startIndex = currentLevel * PAIRS_PER_LEVEL;
    const levelData = fullData.slice(startIndex, startIndex + PAIRS_PER_LEVEL);
    let cards = [];

    levelData.forEach(item => {
      // pushes the flag and capital cards to the cards array
      cards.push({ type: 'flag', content: item.flag, match: item.capital });
      cards.push({ type: 'capital', content: item.capital, match: item.flag });
    });

    cards = shuffle(cards);

    // creates the card elements and appends them to the game board
    cards.forEach(item => {
      const card = $('<div>').addClass('card').attr('data-type', item.type);
      card.data('content', item.content);
      card.data('match', item.match);
      card.on('click', handleCardClick);

      // workaround to display flag images
      if (item.type === 'flag') {
        card.html(`<img src="images/${item.content}.png" alt="${item.content} flag" />`);
      } else {
        card.text('?');
      }

      $('.game-board').append(card);
    });

    $('#level').text(`Level: ${currentLevel + 1} / ${LEVELS}`);
  }
  
  // handle card click
  function handleCardClick() {
    if ($(this).hasClass('flipped') || $(this).hasClass('matched') || flippedCards.length === 2) return;

    $(this).addClass('flipped');
    if ($(this).data('type') === 'capital') {
      $(this).text($(this).data('content'));
    }

    flippedCards.push($(this));

    if (flippedCards.length === 2) {
      const [first, second] = flippedCards;
      const isMatch = first.data('match') === second.data('content') &&
                      second.data('match') === first.data('content');

      if (isMatch) {
        first.addClass('matched');
        second.addClass('matched');
        score++;
        $('#score').text(`Score: ${score}`);
        setTimeout(() => {
          if ($('.card:not(.matched)').length === 0) {
            currentLevel++;
            setupLevel();
          }
        }, 800);
      } else {
        setTimeout(() => {
          if (first.data('type') === 'capital') first.text('?');
          if (second.data('type') === 'capital') second.text('?');
          first.removeClass('flipped');
          second.removeClass('flipped');
        }, 1000);
      }

      flippedCards = [];
    }
  }

  // shuffles cards
  function shuffle(array) {
    let currentIndex = array.length, temp, randomIndex;
    while (currentIndex > 0) {
      randomIndex = Math.floor(Math.random() * currentIndex--);
      temp = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temp;
    }
    return array;
  }
  
  // buttons
  $('#startBtn').on('click', () => {
    const name = $('#username').val().trim();
    if (name.length === 0) return;
    $('#greeting').text(`Hello, ${name}! Good luck!`);
    score = 0;
    currentLevel = 0;
    startTimer();
    setupLevel();
  });

  $('#resetBtn').on('click', () => {
    resetGame();
  });
});
