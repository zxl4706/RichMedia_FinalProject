const handleAnime = (e) => {
    e.preventDefault();

    $("#animeMessage").animate({width:'hide'},350);

    if($("#animeName").val() == '') {
        return false;
    }

    const temp = $("#animeForm").serializeArray();
    console.log(temp);

    sendAjax('POST', $("#animeForm").attr("action"), $("#animeForm").serialize(), function() {
        loadAnimesFromServer(temp[1].value);
    });

    return false;
};

const handleDelAnime = (e) => {
    e.preventDefault();

    const temp = $("#animeForm").serializeArray();
    console.log(temp);

    sendAjax('POST', $(e.target).attr("action"), $(e.target).serialize(), () => {
        loadAnimesFromServer(temp[1].value);
    });

    return false;
}

const AnimeForm = (props) => {
    return (
        <form id="animeForm"
        onSubmit={handleAnime}
        name="animeForm"
        action="/maker"
        method="POST"
        className="animeForm"
        >
            <label htmlFor="name">Name: </label>
            <input id="animeName" type="text" name="name" placeholder="Anime Name"/>
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input className="makeAnimeSubmit" type="submit" value="Make Anime" />
        </form>
    );
};

const AnimeList = function(props) {
    if(props.animes.length === 0) {
        return (
            <div className="animeList">
                <h3 className="emptyAnime">No Animes yet</h3>
            </div>
        );
    }

    const animeNodes = props.animes.map(function(anime) {
        return (
            <div key={anime._id} className="anime">
                <img src={anime.picture} alt="anime face" className="animeFace" />
                <h3 className="animeName"> Name: {anime.name} </h3>
                <h3 className="animeAge"> ID: {anime.id} </h3>
                <h3 className="animeLevel"> Type: {anime.type} </h3>
                <p className="animeSynopsis">{anime.synopsis} </p>
                <form name="delAnimeForm"
                    onSubmit={handleDelAnime}
                    action="/delAnime"
                    method="POST"
                    className="delAnimeForm"
                >
                    <input type="hidden" name="name" value={anime.name} />
                    <input type="hidden" name="id" value={anime.id} />
                    <input type="hidden" name="type" value={anime.type} />
                    <input type="hidden" name="_csrf" value={props.csrf} />
                    <input className="delAnimeSubmit" type="submit" value="Delete Anime"/>
                </form>
            </div>
        );
    });

    return (
        <div className="animeList">
            {animeNodes}
        </div>
    );
};

const loadAnimesFromServer = (csrf) => {
    sendAjax("GET", '/getAnimes', null, (data) => {
        ReactDOM.render(
            <AnimeList animes={data.animes} csrf={csrf}/>, 
            document.querySelector("#animes")
        );
    });
};

const setup = function(csrf) {
    ReactDOM.render(
        <AnimeForm csrf={csrf} />, document.querySelector("#makeAnime")
    );

    ReactDOM.render(
        <AnimeList animes={[]} />, document.querySelector("#animes")
    );

    loadAnimesFromServer(csrf);
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});