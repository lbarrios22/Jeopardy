const $startBtn = $('.start');
const $spinner = $('.spinner-border').hide();
const $thead = $('thead');
const $catRow = $('.categories');
const $tbody = $('tbody');
let rowCount = -1;
const $restartBtn = $('<button class="restart btn">Restart!</button>');

$startBtn.on('click', (event) => {
  $spinner.show();

  $startBtn.replaceWith($restartBtn);

  getCats(categories());
});

$restartBtn.on('click', () => {
  $spinner.show();

  $('th').empty();
  $('tr').empty();
  $('td').empty();

  getCats(categories());
});

async function categories() {
  const allCatIds = [];
  const randomNum = Math.floor(Math.random() * 1300);
  const res = await axios.get(`https://jservice.io/api/categories`, {
    params: { count: 15, offset: randomNum },
  });

  for (let data of res.data) {
    data.clues_count >= 6 ? allCatIds.push(data.id) : false;
  }
  return allCatIds;
}

const shortClue = [];
const shortAnswer = [];

async function getCats(categories) {
  try {
    categories = await categories;

    const titles = [];
    const allClues = [];

    const shortCats = _.sampleSize(categories, 6);

    for (let i = 0; i < shortCats.length; i++) {
      const res = await axios.get(`https://jservice.io/api/category`, {
        params: { id: shortCats[i] },
      });

      titles.push(res.data.title);
      allClues.push(res.data.clues);
    }

    $spinner.hide();
    for (let title of titles) {
      $catRow.append($(`<th>${title.toUpperCase()}</th>`));
      $tbody.append($(`<tr class='row-${(rowCount += 1)}'></tr>`));
    }

    for (let clues of allClues) {
      clues = _.sampleSize(clues, 5);
      for (let clue of clues) {
        shortAnswer.push(clue.answer);
        shortClue.push(clue.question);
      }
    }

    for (let i = 0; i < shortClue.length; i++) {
      if (i < 6) {
        $('.row-0').append(
          `<td data-td="${i}"class='${i}'><i class="fa fa-question-circle" style="font-size:36px"></i><p class='${i} clue' style='display:none;'>${shortClue[i]}</p><p class='${i} answer' style='display:none;'>${shortAnswer[i]}</p></td>`,
        );
      } else if (i < 12) {
        $('.row-1').append(
          `<td data-td="${i}"class='${i}'><i class="fa fa-question-circle" style="font-size:36px"></i><p class='${i} clue' style='display:none;'>${shortClue[i]}</p><p class='${i} answer' style='display:none;'>${shortAnswer[i]}</p></td>`,
        );
      } else if (i < 18) {
        $('.row-2').append(
          `<td data-td="${i}"class='${i}'><i class="fa fa-question-circle" style="font-size:36px"></i><p class='${i} clue' style='display:none;'>${shortClue[i]}</p><p class='${i} answer' style='display:none;'>${shortAnswer[i]}</p></td>`,
        );
      } else if (i < 24) {
        $('.row-3').append(
          `<td data-td="${i}" class='${i}'><i class="fa fa-question-circle" style="font-size:36px"></i><p class='${i} clue' style='display:none;'>${shortClue[i]}</p><p class='${i} answer' style='display:none;'>${shortAnswer[i]}</p></td>`,
        );
      } else {
        $('.row-4').append(
          `<td data-td="${i}"class='${i}'><i class="fa fa-question-circle" style="font-size:36px"></i><p class='${i} clue' style='display:none;'>${shortClue[i]}</p><p class='${i} answer' style='display:none;'>${shortAnswer[i]}</p></td>`,
        );
      }
    }
    $('tbody').on('click', (e) => {
      const $target = $(e.target);
      const $tdNum = $target.data().td;
      const $clueCell = $(`td.${$tdNum}`);
      const $question = $clueCell.children('.clue');
      const $answer = $clueCell.children('.answer');
      $clueCell.children('i').remove();
      if ($question.css('display') === 'none') {
        $question.css('display', 'inline');
        $answer.css('display', 'none');
      } else {
        $question.remove();
        $answer.css('display', 'inline');
        $clueCell.css('background-color', 'green');
      }
    });
  } catch (e) {
    alert(e, `Couldn't get catergories, try again later`);
  }
}
