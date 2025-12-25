interface Movie {
    movie_id:number,
    id: number,
    title : string,
    adult : boolean,
    backdrop_path : string,
    genre_ids : number[],
    original_languages : string,
    original_title : string,
    overview : string,
    popularity : number,
    poster_path : string,
    release_date : string,
    video : boolean,
    vote_average : number,
    vote_count : number
}

interface TrendingMovie {
    searchTerm: string,
    movie_id : number,
    title : string,
    count : number,
    poster_url : string
}

interface MovieDetails {
    movie_id: number,
    movie_title: string,
    id:number,
    adult : boolean,
    backdrop_path : string,
    belongs_to_collection: {
        
    }
    title : string,
    genres : [{id:number, name:string}],
    overview : string,
    release_date : string,
    runtime : number,
    vote_average : number,
    vote_count : number,
    budget : number,
    revenue : number,
    original_language : string,
    homepage : string,
    poster_path : string,
    status : string,
    tagline : string,
    production_companies : {id:number, logo_path:string, name:string, origin_country:string}[],
    genre_ids : number[],
    original_languages : string,
    original_title : string,
    popularity : number,
    video : boolean
}

interface SavedMovie {
    movie_id: number,
    movie_title: string,
    genres : [],
    poster_path : string,
    
}