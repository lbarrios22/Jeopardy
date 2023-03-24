const $startBtn = $('.start');
const $spinner = $('.spinner-border').hide();
const $thead = $('thead');
const $catRow = $('.categories');
const $tbody = $('tbody');
let rowCount = -1;
const $restartBtn = $(
  '<button class="restart btn">Restart!</button>',
);

$startBtn.on('click', (event) => {
  $spinner.show();

  $startBtn.replaceWith($restartBtn);

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

async function getCats(categories) {
  categories = await categories;

  const titles = [];
  const allClues = [];
  const shortClue = [];
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
      shortClue.push(clue.question);
    }
  }

  for (let i = 0; i < shortClue.length; i++) {
      if(i < 6){
        $('.row-0').append(`<td><p>${shortClue[i]}<p></td>`)
      } else if(i < 12){
        $('.row-1').append(`<td><p>${shortClue[i]}<p></td>`)
      } else if(i < 18){
        $('.row-2').append(`<td><p>${shortClue[i]}</p></td>`)
      } else if(i < 24){
        $('.row-3').append(`<td><p>${shortClue[i]}</p></td>`)
      } else {
        $('.row-4').append(`<td><p>${shortClue[i]}</p></td>`)
      }
  }
}