document.addEventListener("DOMContentLoaded", () => {
  let searches = JSON.parse(localStorage.getItem("searches")) || [];
  const api_key = "LCc8yC3V8qH2zpKDNlqx2G9jEKIw2kwPOhuNCX2a";
  const currentDate = new Date().toISOString().split("T")[0];

  function getCurrentImageOfTheDay() {
    fetch(
      `https://api.nasa.gov/planetary/apod?api_key=${api_key}&date=${currentDate}`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        populateData(data);
      })
      .catch((err) => console.error("Error while fetching API", err));
  }

  getCurrentImageOfTheDay();

  function populateData(data) {
    const imageContainer = document.getElementById("current-image-container");
    imageContainer.innerHTML = "";
    const h1 = document.createElement("h1");
    h1.textContent = "NASA Picture of the Day";
    imageContainer.appendChild(h1);

    if (data.media_type == "image") {
      const picture = document.createElement("img");
      picture.src = data.url;
      picture.alt = "Picture of the Day";
      imageContainer.appendChild(picture);
    } else if (data.media_type == "video") {
      const video = document.createElement("iframe");
      video.src = data.url;
      imageContainer.appendChild(video);
    }

    const h3 = document.createElement("h3");
    h3.textContent = `${data.title}`;
    imageContainer.appendChild(h3);
    const para = document.createElement("p");
    para.textContent = `${data.explanation}`;
    imageContainer.appendChild(para);
  }

  function getImageOfTheDay() {
    document.getElementById("search-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const searchInput = document.getElementById("search-input").value;

      if (!searches.some(search => search.date === searchInput)) {
        searches.push({ date: searchInput });
        saveSearch();
        addSearchToHistory();
      }

      fetch(
        `https://api.nasa.gov/planetary/apod?api_key=${api_key}&date=${searchInput}`
      )
        .then((response) => response.json())
        .then((data) => {
          populateData(data);
          document.querySelector(
            "#current-image-container h1"
          ).textContent = `Picture on ${searchInput}`;
        })
        .catch((err) => console.error("Error while fetching data", err));
    });
  }

  getImageOfTheDay();

  function saveSearch() {
    localStorage.setItem("searches", JSON.stringify(searches));
  }

  function addSearchToHistory() {
    const searchHistory = document.getElementById("search-history");
    searchHistory.innerHTML = "";
    searches.forEach((item) => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.textContent = `${item.date}`;
      a.href = "#";
      a.addEventListener("click", () => {
        fetch(
          `https://api.nasa.gov/planetary/apod?api_key=${api_key}&date=${a.textContent}`
        )
          .then((response) => response.json())
          .then((data) => {
            populateData(data);
            document.querySelector(
              "#current-image-container h1"
            ).textContent = `Picture on ${a.textContent}`;
          })
          .catch((err) => console.error("Error while fetching data", err));
      });
      li.appendChild(a);
      searchHistory.appendChild(li);
    });
  }

  addSearchToHistory();
});
