(function() {
  const form = document.querySelector("#search-form");
  const searchField = document.querySelector("#search-keyword");
  let searchedForText;
  const responseContainer = document.querySelector("#response-container");

  form.addEventListener("submit", function(e) {
    e.preventDefault();
    responseContainer.innerHTML = "";
    searchedForText = searchField.value;

    // send the request to the unsplash API:
    fetch(
      `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`,
      {
        headers: {
          Authorization:
            "Client-ID 7a2a7c1469e4d82003486a488086a9b5779ef577a23da83d64f7530766aabbfa"
        }
      }
    )
      // convert the response to json:
      .then(response => response.json())
      // pass the actually json data off to the addImage:
      .then(addImage)
      // in case of error, call the requestError function and declares that "image" required this error
      .catch(e => requestError(e, "image"));

    // send the request to the nytimes API:
    fetch(
      `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=71664fb6a5e649dabd0c3be9a029de6c`
    )
      // converts its response to json:
      .then(response => response.json())
      // pass the data json to the addArticles function
      .then(addArticles)
      .catch(e => requestError(e, "articles"));
  });

  function requestError(e, part) {
    console.log(e);
    responseContainer.insertAdjacentHTML(
      "beforeend",
      `<p class="network-warning">Oh no! There was an error making a request for the ${part}.</p>`
    );
  }

  function addImage(data) {
    let htmlContent = "";

    if (data && data.results && data.results.length > 1) {
      const firstImage = data.results[0];

      htmlContent = `<figure>
        <img src="${firstImage.urls.regular}" alt= "${searchedForText}">
        <figcaption>${searchedForText} by ${firstImage.user.name}</figcaption>
        </figure>`;
    } else {
      htmlContent = '<div class="error-no-image">No images available</div>';
    }

    responseContainer.insertAdjacentHTML("afterbegin", htmlContent);
  }

  function addArticles(data) {
    let htmlContent = "";

    if (data.response && data.response.docs && data.response.docs.length > 1) {
      const articles = data.response.docs;
      htmlContent =
        "<ul>" +
        articles
          .map(
            article => `<li class="article">
                        <h2><a href="${article.web_url}">${
              article.headline.main
            } </a> </h2>
                        <p>${article.snippet}</p>
                        </li>`
          )
          .join("") +
        "</ul>";
    } else {
      htmlContent =
        '<div class="error-no-articles">No articles available</div>';
    }

    responseContainer.insertAdjacentHTML("beforeend", htmlContent);
  }
})();
