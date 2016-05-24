//Variables globales
var datag = [];
var dataTop = [];
var tokenGet = "";
//Se inicializa la libreria de 'spotify web' en var spotifyApi
var spotifyApi = new SpotifyWebApi();

$(document).ready(function() {
    //Se comprueba el si la la pagina ya contiene un token almacenado, sino, muestra el 'login'
    valdiateLogin(localStorage.getItem('tokenGet'));
    
    //Muestra los resultados de la barra de busqueda si los caracteres ingresados son más de 3
    $('#search').on('input', function() {
        var value = $(this).val();
        if (value.length >= 3) {
            $('.msg').addClass('disabled');
            $('.inputSearch').addClass('expand');
            datag = searchSong(value);
            if (datag.tracks.items.length == 0 ) {
                $('.inputSearch').removeClass('expand');
            }
        }else{
            $('.msg').removeClass('disabled');
            $('.inputSearch').removeClass('expand');
            clearDiv("inputSearch");
        }
    });
    
    //Al seleccionar un 'track' de la barra de busqueda, esto limpia los resultados y carga el track en el contenedor .view
    $('.inputSearch').on('click', "li", function(){
        clearDiv("inputSearch");
        showAndPlay(datag.tracks.items[$(this).data('value')]);
        $('.inputSearch').removeClass('expand');
    });
    
    /*Al pocisionarse sobre unos de los 10 temas mostrados este permite escuchar el preview, cuando se sale del area del
    li detiene el preview y al hacerle click cargar el track en el contenedor .view*/
    $('.top').on('mouseenter', 'li',function() {
        value = $(this).data('value');
        url = dataTop.items[value].track.preview_url;
        if (url) {
            $(this).append('<div class="preview-show"><i class="fa fa-cog fa-spin fa-3x fa-fw"></i><p>Escuchando preview</p></div>');
            audioObject = new Audio(url);
            audioObject.play();
        }else{
            $(this).append('<div class="preview-show"><i class="fa fa-frown-o fa-3x"></i><p>No se encontro audio</p></div>');
        }
    }).on('mouseleave', 'li',function() {
        audioObject.pause();
        $(this).find('.preview-show').remove();
    }).on('click', 'li',function() {
        showAndPlay(dataTop.items[value].track);
        getTop($('#top-song'));
    });
    
    //En mobile permite mostrar/ocultar la información que esta oculta.
    $('.info-click a').click(function(e){
        e.preventDefault();
        $(this).find('i').toggleClass('fa-chevron-circle-down fa-chevron-circle-up');
        $('.info').toggleClass('hidden-xs');
        getTop($(this));
    });
    
    //Inicializa el login en la pagina de Spotify
    $('#btn-login').on('click', function(){
        login();
    });
});

//Recive la variable de localStorage si esta vacia muestra el login, sino el login se oculta
function valdiateLogin(validateToken) {
    if (!validateToken) {
        $('.box-login').removeClass('disabled');
    }else{
        spotifyApi.setAccessToken(validateToken);
        dataTop = getListTop();
        $('.box-login').addClass('disabled');
    }
}

//Recive las palabras ingresadas en la busqueda de los traks y luego busca los resultados posibles en spotify y luego retorna el json con las respuestas
function searchSong(value) {
    spotifyApi.searchTracks(value, {limit: 5})
    .then(function(data) {
        clearDiv("inputSearch");
        datag = data;
        $.each(data.tracks.items, function(i, item) {
            liSong(data.tracks.items[i],i, "inputSearch");
        });
    });
    return datag;
}

//Recive el Json con los datos del track a mostra en el contenedor .view
function showAndPlay(songData) {
    $('.view').find('iframe').attr('src', 'https://embed.spotify.com/?uri='+songData.uri)
    $('.view').find('img').attr('src', songData.album.images[1].url);
    
    info_array = [songData.name , songData.artists[0].name , songData.album.name , songData.album.type , songData.album.external_urls.spotify];
    
    $('.info').find('ul li').each(function(y, breach){
        if (y == 4) {
            $(breach).find('a').attr('href',info_array[y]);    
        }else{ $(breach).find('em').text(info_array[y]); }
    });
    share(songData.external_urls.spotify);
    
    $('.song ').removeClass('disabled');
}

//Recibe el la url externa del track seleccionado y modifica los links de compartir de las redes sociales segun el tema
function share(linkSong) {
    array_social = ['http://www.facebook.com/share.php?u=' , 'http://twitter.com/intent/tweet?status=Debes%20visitar%20esta%20pagina+' , 'https://plus.google.com/share?url='];
    var coding = "";
    
    $('.share').find('a').each(function(y, breach){
        coding = "MyWindow=window.open('"+array_social[y]+""+linkSong+"','MyWindow','toolbar=no,location=no,directories=no,status=yes,menubar=no,scrollbars=yes,resizable=yes,width=600,height=300,left=100,top=225'); return false;";
        $(breach).attr('onclick', coding);
    });
}

//Envia a spotify el usuario y el clien_id para poder acceder a las listas de spotify, en este caso la lista son las canciones más escuchadas en chile
function getListTop() {
    spotifyApi.getPlaylistTracks('spotifyenchile','2Q3ZdOPitcusSmSXhmdIDB',{limit: 10})
    .then(function(data) {
        //console.log(data);
        dataTop = data;
        $.each(data.items, function(i, item) {
            liSong(data.items[i].track,i, "top");
        });
    }, function(err) {
        //console.error(err);
    });
    return dataTop;
}

//Recive el id/class de algún contenedor y limpia todo el codigo dentro de el
function clearDiv(div) {
    $("."+div).html("");
}

//Escribe en el html los resultados del json de las canciones. datos = json de los tracks / i = posicion de la cancion dentro del data / div = contenedor donde se mostraran los tracks
function liSong(datos,i,div) {
    $("."+div).append("<li data-value='"+i+"'><img alt='Album' src='"+datos.album.images[1].url+"'><h4>"+datos.name+"</h4><b>By "+datos.artists[0].name+" </b><em>Albúm "+datos.album.name+"</em></li>");
}

//El scroll o la pagina en si se posicionara en la altura del id/class recibido
function getTop(container) {
    $('html,body').animate({scrollTop: container.offset().top});
}

//Envia a spotify los datos de la api (NONAMe), para poder acceder al token (clave), para poder realizar la busqueda de las listas y los tracks
function login(callback) {
    var CLIENT_ID = '8d1f133be7644028b5835d5c7b450360';
    var REDIRECT_URI = 'http://localhost/test/callback';
    function getLoginURL(scopes) {
        return 'https://accounts.spotify.com/authorize?client_id=' + CLIENT_ID +
          '&redirect_uri=' + encodeURIComponent(REDIRECT_URI) +
          '&scope=' + encodeURIComponent(scopes.join(' ')) +
          '&response_type=token'; //Using client credentials flow
    }
    var url = getLoginURL([
        ''
    ]);
    var width = 450,
        height = 730,
        left = (screen.width / 2) - (width / 2),
        top = (screen.height / 2) - (height / 2);
    
    // Escucha la respuesta de callback y se guarda el token en el localStorage
    window.addEventListener("message", function(event) {
        var hash = JSON.parse(event.data);
        if (hash.type == 'access_token') {
            //console.log(hash.access_token);
            localStorage.setItem('tokenGet', hash.access_token);
            tokenvar = localStorage.getItem('tokenGet');
            valdiateLogin(tokenvar);
        }
    }, false);
    
    //Abre la ventana del login de spotify
    var w = window.open(url,'Spotify','menubar=no,location=no,resizable=no,scrollbars=no,status=no, width=' + width + ', height=' + height + ', top=' + top + ', left=' + left);
}