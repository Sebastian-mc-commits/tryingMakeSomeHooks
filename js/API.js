import useSignal from "../useSignal.js";
import useSignalJs from "../useSignalJs.js";
import bindEvent from "../utils/DOM/bindEvents.js";
import { rickAndMortyApi } from "../utils/const/urls.js";
const handlerEvent = {};
const render = document.querySelector("#render");

const renderData = useSignalJs([]);

const setPage = useSignal(
  {
    next: 2,
    prev: 0,
    disabled: true,
    current_page: 1,
    random: "Random"
  },
  "page"
);

const setLoader = useSignal(
  {
    value: "Loading...",
    hidden: true
  },
  "loader"
);

const chapterOps = useSignal(
  {
    search_chapter: 1,
    top_chapter: "",
    src: ""
  },
  "input"
);

const getRandomNumber = ({ avoid = 0, number }) => {
  const randomNumber = Math.floor(Math.random() * number);

  if (randomNumber === avoid) {
    getRandomNumber({
      avoid,
      number
    });
  }

  return randomNumber;
};
const fetchData = (data) => {
  setLoader.current.hidden = false;
  fetch(data)
    .then((data) => data.json())
    .then((data) => (renderData.current = data))
    .catch(
      (err) => (renderData.current = { message: err.message, errorFound: true })
    )
    .finally(() => (setLoader.current.hidden = true));
};

fetchData(rickAndMortyApi);

setPage.onHandlerChangeValues = (_, { key, valueChanged }) => {
  if (setPage.current.prev <= 0) {
    setPage.current._disabled = true;
  } else if (setPage.current.disabled) {
    setPage.current._disabled = false;
  }

  if (typeof valueChanged !== "number") return;
  let value = valueChanged;

  if (key === "next") {
    value--;
  } else if (key === "prev") {
    value++;
  }

  setPage.current._current_page = value;
};

handlerEvent.nextPage = () => {
  setPage.current.next++;
  setPage.current.prev++;
  fetchData(rickAndMortyApi + `?page=${setPage.current.next}`);
};

handlerEvent.prevPage = () => {
  setPage.current.prev--;
  setPage.current.next--;
  fetchData(rickAndMortyApi + `?page=${setPage.current.prev}`);
};

chapterOps.current._top_chapter = {
  onclick: (event) => {
    const image = chapterOps.current?.src;
    if (!event.isTrusted || !image) return;
    window.open(chapterOps.current.src, "_blank");
  }
};

const handleSetInterval = ({ setRandomData }) => {
  chapterOps.current._top_chapter = "";
  const interval = setInterval(() => {
    const desireWord =
      setRandomData?.name[chapterOps.current?.top_chapter?.length];

    if (!desireWord) {
      clearInterval(interval);
      chapterOps.current._src = setRandomData.image;
      return;
    }
    
    chapterOps.current.top_chapter += desireWord;
  }, 140);
};

renderData.onHandlerChangeValue = ({
  info,
  results: data,
  errorFound,
  message
}) => {
  if (errorFound) {
    setPage.current.next = 2;
    setPage.current.prev = 0;
    fetchData(rickAndMortyApi);
    return;
  }

  const topRandomChapter = data[Math.floor(Math.random() * data.length)];
  handleSetInterval({
    setRandomData: topRandomChapter
  });

  let HTML = "";

  setPage.current.random = {
    onclick: (event) => {
      if (!event?.isTrusted) return;

      const randomPage = getRandomNumber({ number: info.pages });

      setPage.current.next = randomPage + 1;
      setPage.current.prev = randomPage - 1;
      fetchData(rickAndMortyApi + `?page=${randomPage}`);
    }
  };

  chapterOps.current._search_chapter = {
    oninput: (event) => {
      if (!event?.isTrusted) return;

      chapterOps.current._search_chapter = event.target.value.replace(
        /-?\d+/g,
        (match) => {
          const num = Number(match);
          if (num <= 0) {
            return 1;
          } else if (num > info.pages) {
            return 1;
          } else {
            return match;
          }
        }
      );
    },

    onblur: (event) => {
      let chapterSelected = +chapterOps.current?.search_chapter;
      if (!event?.isTrusted || isNaN(chapterSelected) || chapterSelected <= 0)
        return;

      setPage.current.next = chapterSelected + 1;
      setPage.current.prev = chapterSelected - 1;
      fetchData(rickAndMortyApi + `?page=${chapterSelected}`);
    }
  };

  for (let { name, status, type, image, id } of data) {
    HTML += `

      <div>
      
        <img src=${image} alt=${name}/>
        ${
          id === topRandomChapter.id
            ? "<h3 data-input-top_chapter></h3>"
            : `<h3>${name}</h3>`
        }
        <p>${status}</p>
        <p>${type}</p>
      </div>
    `;
  }

  render.innerHTML = HTML;
};

bindEvent({});
Object.assign(bindEvent, handlerEvent);
