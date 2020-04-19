"use strict";

var handleAnime = function handleAnime(e) {
  e.preventDefault();
  $("#animeMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#animeName").val() == '') {
    return false;
  }

  var temp = $("#animeForm").serializeArray();
  console.log(temp);
  sendAjax('POST', $("#animeForm").attr("action"), $("#animeForm").serialize(), function () {
    loadAnimesFromServer(temp[1].value);
  });
  return false;
};

var handleDelAnime = function handleDelAnime(e) {
  e.preventDefault();
  var temp = $("#animeForm").serializeArray();
  console.log(temp);
  sendAjax('POST', $(e.target).attr("action"), $(e.target).serialize(), function () {
    loadAnimesFromServer(temp[1].value);
  });
  return false;
};

var AnimeForm = function AnimeForm(props) {
  return (/*#__PURE__*/React.createElement("form", {
      id: "animeForm",
      onSubmit: handleAnime,
      name: "animeForm",
      action: "/maker",
      method: "POST",
      className: "animeForm"
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: "name"
    }, "Name: "), /*#__PURE__*/React.createElement("input", {
      id: "animeName",
      type: "text",
      name: "name",
      placeholder: "Anime Name"
    }), /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      name: "_csrf",
      value: props.csrf
    }), /*#__PURE__*/React.createElement("input", {
      className: "makeAnimeSubmit",
      type: "submit",
      value: "Make Anime"
    }))
  );
};

var AnimeList = function AnimeList(props) {
  if (props.animes.length === 0) {
    return (/*#__PURE__*/React.createElement("div", {
        className: "animeList"
      }, /*#__PURE__*/React.createElement("h3", {
        className: "emptyAnime"
      }, "No Animes yet"))
    );
  }

  var animeNodes = props.animes.map(function (anime) {
    return (/*#__PURE__*/React.createElement("div", {
        key: anime._id,
        className: "anime"
      }, /*#__PURE__*/React.createElement("img", {
        src: anime.picture,
        alt: "anime face",
        className: "animeFace"
      }), /*#__PURE__*/React.createElement("h3", {
        className: "animeName"
      }, " Name: ", anime.name, " "), /*#__PURE__*/React.createElement("h3", {
        className: "animeAge"
      }, " ID: ", anime.id, " "), /*#__PURE__*/React.createElement("h3", {
        className: "animeLevel"
      }, " Type: ", anime.type, " "), /*#__PURE__*/React.createElement("p", {
        className: "animeSynopsis"
      }, anime.synopsis, " "), /*#__PURE__*/React.createElement("form", {
        name: "delAnimeForm",
        onSubmit: handleDelAnime,
        action: "/delAnime",
        method: "POST",
        className: "delAnimeForm"
      }, /*#__PURE__*/React.createElement("input", {
        type: "hidden",
        name: "name",
        value: anime.name
      }), /*#__PURE__*/React.createElement("input", {
        type: "hidden",
        name: "id",
        value: anime.id
      }), /*#__PURE__*/React.createElement("input", {
        type: "hidden",
        name: "type",
        value: anime.type
      }), /*#__PURE__*/React.createElement("input", {
        type: "hidden",
        name: "_csrf",
        value: props.csrf
      }), /*#__PURE__*/React.createElement("input", {
        className: "delAnimeSubmit",
        type: "submit",
        value: "Delete Anime"
      })))
    );
  });
  return (/*#__PURE__*/React.createElement("div", {
      className: "animeList"
    }, animeNodes)
  );
};

var loadAnimesFromServer = function loadAnimesFromServer(csrf) {
  sendAjax("GET", '/getAnimes', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(AnimeList, {
      animes: data.animes,
      csrf: csrf
    }), document.querySelector("#animes"));
  });
};

var setup = function setup(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(AnimeForm, {
    csrf: csrf
  }), document.querySelector("#makeAnime"));
  ReactDOM.render( /*#__PURE__*/React.createElement(AnimeList, {
    animes: []
  }), document.querySelector("#animes"));
  loadAnimesFromServer(csrf);
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
"use strict";

var handleError = function handleError(message) {
  $("#errorMessage").text(message);
  $("#animeMessage").animate({
    width: 'toggle'
  }, 350);
};

var redirect = function redirect(response) {
  $("#animeMessage").animate({
    width: 'hide'
  }, 350);
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
