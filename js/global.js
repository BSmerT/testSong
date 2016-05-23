var datag = [];
var dataTop = [];
var tokenGet = "";
var spotifyApi = new SpotifyWebApi();

$(document).ready(function() {
    valdiateLogin(localStorage.getItem('tokenGet'));
    
    $('#search').on('input', function() {
        var value = $(this).val();
        if (value.length >= 3) {
            $('.msg').addClass('disabled');
            datag = searchSong(value);
        }else{
            $('.msg').removeClass('disabled');
            clearDiv("inputSearch");
        }
    });
    $('.inputSearch').on('click', "li", function(){
        clearDiv("inputSearch");
        showAndPlay(datag.tracks.items[$(this).data('value')]);    
    });
    
    $('.top').on('mouseenter', 'li',function() {
        value = $(this).data('value');
        url = dataTop.items[value].track.preview_url;
        if (url) {
            console.log('le carog');
        }else{
            console.log('no cargo');
        }
        
        audioObject = new Audio(url);
        audioObject.play();
    }).on('mouseleave', 'li',function() {
        audioObject.pause();
    });
    
    $('#btn-login').on('click', function(){
        login();
    });
});

function valdiateLogin(validateToken) {
    if (!validateToken) {
        $('.box-login').removeClass('disabled');
    }else{
        spotifyApi.setAccessToken(validateToken);
        dataTop = getListTop();
        $('.box-login').addClass('disabled');
    }
}

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

function showAndPlay(songData) {
    console.log(songData);
    $('.view').html("<img alt='Album' src='"+songData.album.images[1].url+"'><h4>"+songData.name+"</h4><b>By "+ songData.artists[0].name +" </b><em>Albúm "+ songData.album.name +"</em>");
}

function getListTop() {
    spotifyApi.getPlaylistTracks('spotifyenchile','2Q3ZdOPitcusSmSXhmdIDB',{limit: 10})
    .then(function(data) {
        console.log(data);
        dataTop = data;
        $.each(data.items, function(i, item) {
            liSong(data.items[i].track,i, "top");
        });
    }, function(err) {
        //console.error(err);
    });
    return dataTop;
}
function clearDiv(div) {
    $("."+div).html("");
}
function liSong(datos,i,div) {
    $("."+div).append("<li data-value='"+i+"'><img alt='Album' src='"+datos.album.images[1].url+"'><h4>"+datos.name+"</h4><b>By "+datos.artists[0].name+" </b><em>Albúm "+datos.album.name+"</em></li>");
}

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
        '' // no scopes required
    ]);
    var width = 450,
        height = 730,
        left = (screen.width / 2) - (width / 2),
        top = (screen.height / 2) - (height / 2);
    
    // listen for callback
    window.addEventListener("message", function(event) {
        var hash = JSON.parse(event.data);
        if (hash.type == 'access_token') {
            console.log(hash.access_token);
            localStorage.setItem('tokenGet', hash.access_token);
            lala = localStorage.getItem('tokenGet');
            valdiateLogin(lala);
        }
    }, false);
    
    var w = window.open(url,'Spotify','menubar=no,location=no,resizable=no,scrollbars=no,status=no, width=' + width + ', height=' + height + ', top=' + top + ', left=' + left);
}