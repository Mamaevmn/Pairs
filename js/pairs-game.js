(function() {
  function createAppTitle(title) {
    let appTitle = document.createElement('h1');
    appTitle.classList.add('text-center', 'display-4', 'fw-bolder', 'mb-4')
    appTitle.innerHTML = title;
    return appTitle;
  }

  function createForm() {
    let form = document.createElement('form');
    let formTitle = document.createElement('h3');
    let formRules = document.createElement('p')
    let inputWrapVer = document.createElement('div')
    let inputVer = document.createElement('input');
    let inputWrapHor = document.createElement('div')
    let inputHor = document.createElement('input');
    let buttonWrap = document.createElement('div');
    let button = document.createElement('button');

    form.classList.add('input-group', 'mb-3', 'row', 'g-2', 'justify-content-center');
    formTitle.classList.add('mb-1')
    formTitle.innerHTML = 'Правила игры:'
    formRules.classList.add('mb-2', 'text-center')
    formRules.innerHTML = 'Необходимо найти все пары чисел в течение 1 минуты. <br> В полях ниже нужно ввести чётное число от 2 до 10. Если значение нечётное или не в пределах 2-10, то при старте игры некорректное значение будет заменено на 4.'
    inputWrapVer.classList.add('mb-3', 'col-4')
    inputVer.classList.add('form-control', 'vertical');
    inputVer.placeholder = 'Количество карточек по вертикали';
    inputVer.type = 'number';
    inputVer.min = '0';
    inputVer.max = '10';
    inputWrapHor.classList.add('mb-3', 'col-4')
    inputHor.classList.add('form-control', 'horizontal');
    inputHor.placeholder = 'Количество карточек по горизонтали';
    inputHor.type = 'number';
    inputHor.min = '0';
    inputHor.max = '10';
    buttonWrap.classList.add('row')
    button.classList.add('btn', 'btn-primary', 'btn-lg', 'col-md-6', 'offset-md-3',  'mx-auto');
    button.setAttribute('disabled', 'true');
    button.textContent = 'Начать игру';

    form.append(formTitle)
    form.append(formRules)
    inputWrapVer.append(inputVer)
    form.append(inputWrapVer);
    inputWrapHor.append(inputHor)
    form.append(inputWrapHor);
    form.append(buttonWrap);
    buttonWrap.append(button)

    return {
      form,
      inputVer,
      inputHor,
      button
    }
  }

  function createCardsField() {
    let field = document.createElement('div');
    field.classList.add('cards-field')
    return field
  }

  function createBtn(title) {
    let btn = document.createElement('button');
    btn.classList.add('btn', 'btn-primary', 'btn-lg', 'restart-btn');
    btn.textContent = title

    btn.addEventListener('click', () => {
      location.reload()
    })

    return btn
  }

  function createCard(title) {
    let item = document.createElement('div');
    let frontSide = document.createElement('label');
    let backSide = document.createElement('img')

    // устанавливаем стили для элемента списка, а также для размещения кнопок в его правой части с помощью флекс
    item.classList.add('card');
    frontSide.classList.add('front')
    frontSide.innerHTML = title;
    backSide.classList.add('back')
    backSide.src = 'image/back-card.webp';

    item.append(frontSide)
    item.append(backSide)

    return {
      item
    };
  }

  function shuffle(array) {
      array.sort(() => Math.random() - 0.5);
  }

  function findPairCard(cardsArray, time, timer) {
    let firstFlippedCard = 0;
    let secondFlippedCard = 0;

    cardsArray.forEach(card => {
      card.addEventListener('click', () => {

        card.classList.toggle('flipped')

        let flippedCard = document.querySelectorAll('.flipped')
        let countFlippedCards = 0;

        flippedCard.forEach(flipcard => {
          if (!flipcard.classList.contains('pair-finded')) {
            countFlippedCards++;
          }
        })

        if (countFlippedCards === 1) {
          firstFlippedCard = card.querySelector('.front').innerHTML
        };

        if (countFlippedCards === 2) {
          secondFlippedCard = card.querySelector('.front').innerHTML
        };

        if (firstFlippedCard === secondFlippedCard && countFlippedCards === 2) {
          setTimeout(() => {
            let cardsPair = document.querySelectorAll('.flipped');

            cardsPair.forEach(pair => {
              pair.classList.add('pair-finded')
            })

            let countPairCards = document.querySelectorAll('.pair-finded').length

            if (countPairCards === cardsArray.length) {
              stopTimer(time);
              stopTimer(timer);

              let restartBtn = document.querySelector('.restart-btn');
              alert('Вы выиграли!');

              restartBtn.removeAttribute('disabled')
              restartBtn.innerText = 'Сыграть еще раз';
            }
          }, 500)
        }

        if (countFlippedCards >= 2 && firstFlippedCard !== secondFlippedCard) {
          setTimeout(() => {
            let cardsPair = document.querySelectorAll('.flipped');

            cardsPair.forEach(pair => {
              if (!pair.classList.contains('pair-finded')) {
                pair.classList.remove('flipped')
              }
            })

            countFlippedCards = 1;
          }, 500)
        }
      })
    })
  }

  function createPairsGame () {
    let container = document.getElementById('pairs')

    let appTitle = createAppTitle('Пары');
    let starterForm = createForm();
    let cardsField = createCardsField();
    let timerValue = 60;
    let restartBtn = createBtn(`${timerValue}`);
    let playerTimer = null;
    let currentTime = null;
    let numberArr;

    const GAME_DURATION = 60000;
    const INTERVAL = 1000;

    container.append(appTitle);
    container.append(starterForm.form);
    container.append(cardsField);

    starterForm.form.addEventListener('input', () => {
      let button = starterForm.button;
      let inputV = starterForm.inputVer.value
      let inputH = starterForm.inputHor.value

        if (inputV && inputH) {
          button.removeAttribute('disabled');
        }
    })

    starterForm.form.addEventListener('submit', function(e) {
      e.preventDefault();
      numberArr = [];

      cardsField.innerHTML = '';

      let button = starterForm.button;
      let inputV = starterForm.inputVer.value
      let inputH = starterForm.inputHor.value

      if ((inputV % 2 !== 0) || (inputV == 0)) {
        inputV = 4
      }
      if ( (inputH % 2 !== 0) || (inputH == 0)) {
        inputH = 4
      }

      let numberPair = (inputV * inputH) / 2;

      for (let i = 1; i <= 2; i++) {
        for (let j = 1; j <= numberPair; j++) {
          numberArr.push(j)
        }
      }

      shuffle(numberArr)

      for (let i = 0; i <= (numberPair * 2 - 1); i++) {
        cardsField.append(createCard(numberArr[i]).item)
      }

      cardsField.scrollIntoView({block: "start", behavior: "smooth"})

      button.setAttribute('disabled', 'true');
      starterForm.inputVer.value = '';
      starterForm.inputHor.value = '';

      let cards = document.querySelectorAll('.card');
      cardsField.append(restartBtn)
      restartBtn.setAttribute('disabled', true)

      if (playerTimer !== null || currentTime !== null) {
        stopTimer(playerTimer);
        stopTimer(currentTime);
      }

      if (timerValue > 0) {
        currentTime = setInterval(() => {

          timerValue -= INTERVAL/1000;
          restartBtn.innerText = timerValue;

          if (timerValue <= 0) {
            stopTimer(currentTime);
            return;
          }
        }, INTERVAL);
      }

      playerTimer = setTimeout(() => {
        alert('Увы... Время вышло.');

        restartBtn.innerText = 'Сыграть ещё раз'
        restartBtn.removeAttribute('disabled');

      }, GAME_DURATION)

      findPairCard(cards, playerTimer, currentTime)
    })
  }

  function stopTimer(timer) {
    clearInterval(timer);
  }

  window.createPairsGame = createPairsGame;
})();
