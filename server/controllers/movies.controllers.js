const Movie = require('../models/Movie');

async function getAllMovies(req, res) {
    const movies = await Movie.find();
    res.json(movies);
}

async function getMovieById(req, res) {
    const movie = await Movie.findById(req.params.id);
    res.json(movie);
}

async function getMoviesByType(req, res) {
    const type = req.params.type;
    const user = req.params.user;
    const movies = await Movie.find({type: type, user_id: user});
    
    res.json(movies);
}

async function createMovie(req, res) {
    const { movie_id, user_id, type } = req.body;

    const movies = await Movie.find({movie_id, user_id});

    if(type==='vista'){
        movies.forEach(async movie => {
            if(movie.type === type){
                res.json({success: false, msg: 'Already exist'});
            }
            if(movie.type === 'pendiente'){
                await deleteMovieReqId(movie._id)

                const newMovie = new Movie({
                    movie_id: movie_id,
                    user_id: user_id,
                    type: type
                });
            
                newMovie
                    .save()
                    .then(movieSaved => {
                        res.json({success: true, msg: "Cambiada a Vistas"})
                    })
                    .catch(err => console.log(err));
            }
            if(movie.type === 'favorita'){

                const newMovie = new Movie({
                    movie_id: movie_id,
                    user_id: user_id,
                    type: type
                });
            
                newMovie
                    .save()
                    .then(movieSaved => {
                        res.json({success: true, msg: "Guardada en Vistas"})
                    })
                    .catch(err => console.log(err));
            }
        });
    }

    if(type==='favorita'){
        movies.forEach( async movie => {
            if(movie.type === type){
                res.json({success: false, msg: 'Already exist'});
            }
            if(movie.type === 'pendiente'){
                await deleteMovieReqId(movie._id)

                const newMovie = new Movie({
                    movie_id: movie_id,
                    user_id: user_id,
                    type: type
                });
            
                newMovie
                    .save()
                    .then(movieSaved => {
                        res.json({success: true, msg: "Cambiada a Favoritas"})
                    })
                    .catch(err => console.log(err));
            }
            if(movie.type === 'vista'){

                const newMovie = new Movie({
                    movie_id: movie_id,
                    user_id: user_id,
                    type: type
                });
            
                newMovie
                    .save()
                    .then(movieSaved => {
                        res.json({success: true, msg: "Guardada en Favoritas"})
                    })
                    .catch(err => console.log(err));
            }
            
        });
    }

    if(type==='pendiente'){
        movies.forEach(async movie => {
            if(movie.type === type){
                res.json({success: false, msg: 'Already exist'});
            }
            if(movie.type === 'vista'){
                await deleteMovieReqId(movie._id)

                const newMovie = new Movie({
                    movie_id: movie_id,
                    user_id: user_id,
                    type: type
                });
            
                newMovie
                    .save()
                    .then(movieSaved => {
                        res.json({success: true, msg: "Cambiada a Pendientes"})
                    })
                    .catch(err => console.log(err));
            }
            if(movie.type === 'favorita'){
                await deleteMovieReqId(movie._id)

                const newMovie = new Movie({
                    movie_id: movie_id,
                    user_id: user_id,
                    type: type
                });
            
                newMovie
                    .save()
                    .then(movieSaved => {
                        res.json({success: true, msg: "Cambiada a Pendientes"})
                    })
                    .catch(err => console.log(err));
            }
        });
    }

    if(movies.length === 0){
        const newMovie = new Movie({
            movie_id: movie_id,
            user_id: user_id,
            type: type
        });
    
        newMovie
            .save()
            .then(movieSaved => {
                res.json({success: true, msg: "Guardada"})
            })
            .catch(err => console.log(err));
    }
}

async function updateMovie(req, res) {
    await Movie.findByIdAndUpdate(req.params.id, req.body);
    res.json({success: true, msg: "Pelicula Actualizada"});
}

async function deleteMovie(req, res) {
    const { movie_id, user_id } = req.body;
    await Movie.findOneAndDelete({movie_id: movie_id, user_id: user_id});
    res.json({success: true, msg: "Pelicula Eliminada"});
}

async function deleteMovieReqId(req, res) {
    await Movie.findByIdAndDelete(req.id);
    res.json({success: true, msg: "Pelicula Eliminada"});
}

async function deleteMovieById(req, res) {
    await Movie.findByIdAndDelete(req.params.id);
    res.json({success: true, msg: "Pelicula Eliminada"});
}

async function getCountMoviesByType(req, res) {
    const type = req.params.type;
    const user = req.params.user;
    const count = await Movie.countDocuments({type: type, user_id: user});
    res.json(count);
}

module.exports = {
    getAllMovies,
    getMovieById,
    createMovie,
    updateMovie,
    deleteMovie,
    getMoviesByType,
    deleteMovieById,
    getCountMoviesByType
}