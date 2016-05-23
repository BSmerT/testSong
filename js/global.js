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
            $(this).append('<div class="preview-show"><i class="fa fa-cog fa-spin fa-3x fa-fw"></i><p>Escuchando preview</p></div>');
            audioObject = new Audio(url);
            audioObject.play();
        }else{
            $(this).append('<div class="preview-show"><i class="fa fa-frown-o fa-3x"></i><p>No se encontro audio</p></div>');
            console.log('no cargo');
        }
    }).on('mouseleave', 'li',function() {
        audioObject.pause();
        $(this).find('.preview-show').remove();
    }).on('click', 'li',function() {
        showAndPlay(dataTop.items[value].track);
    });
    
    $('.info-click a').click(function(e){
        e.preventDefault();
        $(this).find('i').toggleClass('fa-chevron-circle-down fa-chevron-circle-up');
        $('.info').toggleClass('hidden-xs');
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
    $('.view').find('iframe').attr('src', 'https://embed.spotify.com/?uri='+songData.uri)
    $('.view').find('img').attr('src', songData.album.images[1].url);
    
    info_array = [songData.name , songData.artists[0].name , songData.album.name , songData.album.type , songData.album.external_urls.spotify];
    console.log(info_array);
    $('.info').find('ul li').each(function(y, breach){
        if (y == 4) {
            $(breach).find('a').attr('href',info_array[y]);    
        }else{ $(breach).append(info_array[y]); }
    });
    share(songData.external_urls.spotify);
    
    $('.song ').removeClass('disabled');
}

function share(linkSong) {
    array_social = ['http://www.facebook.com/share.php?u=' , 'http://twitter.com/intent/tweet?status=Debes%20visitar%20esta%20pagina+' , 'https://plus.google.com/share?url='];
    var coding = "";
    
    $('.share').find('a').each(function(y, breach){
        coding = "MyWindow=window.open('"+array_social[y]+""+linkSong+"','MyWindow','toolbar=no,location=no,directories=no,status=yes,menubar=no,scrollbars=yes,resizable=yes,width=600,height=300,left=100,top=225'); return false;";
        $(breach).attr('onclick', coding);
    });
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
    var REDIRECT_URI = 'http://test.local/callback';
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