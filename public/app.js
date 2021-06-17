class APIData{
    constructor(){
        this.url = "http://www.omdbapi.com/";
        this.apikey = "d754c507";
    }

    getDataById(id){
        return $.ajax({
            type: "GET",
            url: `${this.url}?apikey=${this.apikey}&type=movie&i=${id}`,
            dataType: "json",
        })
    }

    getDataByTitle(title){
        return $.ajax({
            type: "GET",
            url: `${this.url}?apikey=${this.apikey}&type=movie&t=${title}`,
            dataType: "json",
        })
    }

    getDataBySearch(search){
        return $.ajax({
            type: "GET",
            url: `${this.url}?apikey=${this.apikey}&type=movie&s=${search}`,
            dataType: "json",
        })
    }
}

class UI{
    constructor(){
        this.list = $(".list");
        this.details = $(".details");
        this.search = $(".search");
        this.msg = $(".msg");
    }

    getSearchField(){
        let titleInput = this.search.find("form .title")[0].value;
        if(titleInput !== ""){
            return titleInput;
        }
    }

    showMsg(text, bg){
        $(this.msg).text(text);
        $(this.msg).css("background-color", bg);
    }
    hideMsg(){
        $(this.msg).text("");
    }
    showLoading(){
        $(this.list).html(`<img class="loading" src="loading.gif">`);
    }
    hideLoading(){
        $(this.list).find(".loading").remove();
    }
    showLoadingDetails(){
        $(this.details).html(`<img class="loading" src="loading.gif">`);
    }
    hideLoadingDetails(){
        $(this.details).find(".loading").remove();
    }


    showDetails(movie){
        let html =`
        <div class="film_details">
            <div class="film_infos">
                <div class="img">
                    <img src="${movie.Poster}">
                </div>
                <div class="infos">
                    <h2>${movie.Title}</h2>
                    <ul>
                        <li>Genre : <span class="genre">${movie.Genre}</span></li>
                        <li>Released : <span class="released">${movie.Released}</span></li>
                        <li>IMDB Rating : <span class="imdb">${movie.imdbRating}</span></li>
                        <li>Director : <span class="director">${movie.Director}</span></li>
                        <li>Writer : <span class="genre">${movie.Writer}</span></li>
                    </ul>
                </div>
            </div>
            <a class="imdb_link">Go to IMDB</a>
        </div>
        `;
        $(this.details).append(html);
        $(".film_details").hide();
        $(".film_details").slideDown(500);
        
    }

    listFilms(movie){

        let html = `
            <div class="film">
                <div class="img_box">
                    <img class="smale_loading" src="smale_loading.gif">
                    <img class="poster" src="${movie.Poster}">
                </div>
                <div class="info_box">
                    <h3 class="title">${movie.Title}</h3>
                    <h3 class="year">${movie.Year}</h3>
                    <a class="more_info" data-id="${movie.imdbID}" >Detail</a>
                </div>
            </div>
        `;
        $(this.list).append(html);
        
        
    }

}

class Film{
    constructor(title, genre, released, imdbRating, director, writer){
        this.title = title,
        this.genre = genre,
        this.released = released,
        this.imdbRating = imdbRating,
        this.director = director,
        this.writer = writer;
    } 
}

class App{
    constructor(ctrlAPIData, ctrlUI){
        this.ctrlAPIData = ctrlAPIData;
        this.ctrlUI = ctrlUI;
    }

    addEvents(){
        $(".search form").on("submit", e=>{
            e.preventDefault();
            ctrlUI.showLoading();
            ctrlUI.hideMsg();
            ctrlAPIData.getDataBySearch(ctrlUI.getSearchField()).done(e=>{
                ctrlUI.hideLoading();
                
                if(e.Response === "False"){
                    ctrlUI.showMsg(e.Error,"#b52222");
                }else{
                    ctrlUI.showMsg(` Result : ${e.totalResults} movie (API shows only fist 10 movies) `,"#2bad17");
                    e.Search.forEach(m=>{
                        
                        ctrlUI.listFilms(m);
                    });
                    $(".film .poster").each((i,e)=>{
                        $(e).on("error",e=>{
                            $(e.target).prev().remove()
                            $(e.target).attr("src","no_poster.jpg");
                        });
                        $(e).on("load",e=>{
                            $(e.target).prev().remove()
                        });
                        
                    });
                    
                }
            }).fail(e=>{
                ctrlUI.hideLoading();
                ctrlUI.showMsg("API Problems","#b52222");
                console.log(e.responseJSON.Error);
            });
        });
    
    
        $(".list").on("click",e=>{
            if($(e.target).hasClass("more_info")){
                $(".details").show();
                ctrlUI.showLoadingDetails();
                ctrlAPIData.getDataById($(e.target).attr("data-id")).done(m=>{
                    ctrlUI.hideLoadingDetails();
                    ctrlUI.showDetails(m);
                }).fail(e=>{
                    ctrlUI.showMsg("Error","#b52222");
                    console.log(e);
                });
        
            }
        });

        $(".details").on("click",e=>{
            if($(e.target).hasClass("details")){
                //$(".film_details").slideDown(500);
                $(".film_details").hide(1000);
                $(".details").fadeOut(800);
                $(".details").html("");
            }
        });
    
    
    
    
    
    }



}


const ctrlAPIData = new APIData(),
    ctrlUI = new UI(),
    ctrlApp = new App(ctrlAPIData,ctrlUI);

$(".details").hide();
ctrlApp.addEvents();


