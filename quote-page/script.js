window.onload = function () {
  const quoteBox = document.getElementById("quoteBox");
  const quoteText = document.getElementById("quoteText");
  const quoteAuthor = document.getElementById("quoteAuthor");
  const quoteButton = document.getElementById("quoteButton");

  const quotes = [
    {
      text: "No pain, no gain.",
      author: "Training Mindset"
    },
    {
      text: "Small progress still counts. Stack enough of it and your whole life starts looking different.",
      author: "Shinoske"
    },
    {
      text: "Discipline is doing the right thing before your feelings agree.",
      author: "Daily Reminder"
    },
    {
      text: "You do not need a perfect day. You need a day that moves forward.",
      author: "Growth Rule"
    },
    {
      text: "The strongest comeback starts with boring consistency.",
      author: "Builder Energy"
    }
  ];

  let currentQuoteIndex = -1;

  function getRandomQuoteIndex() {
    if (quotes.length === 1) {
      return 0;
    }

    let nextIndex = Math.floor(Math.random() * quotes.length);

    while (nextIndex === currentQuoteIndex) {
      nextIndex = Math.floor(Math.random() * quotes.length);
    }

    return nextIndex;
  }

  function showQuote(index) {
    quoteBox.classList.add("is-changing");

    setTimeout(function () {
      quoteText.textContent = '“' + quotes[index].text + '”';
      quoteAuthor.textContent = '— ' + quotes[index].author;
      quoteBox.classList.remove("is-changing");
    }, 180);
  }

  quoteButton.onclick = function () {
    currentQuoteIndex = getRandomQuoteIndex();
    showQuote(currentQuoteIndex);
  };

  currentQuoteIndex = getRandomQuoteIndex();
  showQuote(currentQuoteIndex);
};
