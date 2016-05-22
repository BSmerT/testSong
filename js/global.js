var datag = [];
var spotifyApi = new SpotifyWebApi();
spotifyApi.setAccessToken('BQAYBHE8kDFxrP1r_45ybAV9W4wNlxNqOMLLr1-Kr4-bVmDNLL7W4jOX4ZCDrmWdqNEENstL8dZk2KNYVF2YF3vjlO594N2U5Aib_2xuqTCMwT7oi6HOHEqa6nfFJWChuIHxww');

$(document).ready(function() {
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
    
    userId = "digsterchile";
    ListT = "4i9ilOIkmFL4bn1Xag1G5n";
    getListTop(userId, ListT);
});

function searchSong(value, types) {
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

function getListTop(user,list) {
    spotifyApi.getPlaylistTracks('spotifyenchile','2Q3ZdOPitcusSmSXhmdIDB',{limit: 10})
    .then(function(data) {
        console.log(data);
        $.each(data.items, function(i, item) {
            liSong(data.items[i].track,i, "top");
        });
    });
}
function clearDiv(div) {
    $("."+div).html("");
}
function liSong(datos,i,div) {
    $("."+div).append("<li data-value='"+i+"'><img alt='Album' src='"+datos.album.images[1].url+"'><h4>"+datos.name+"</h4><b>By "+datos.artists[0].name+" </b><em>Albúm "+datos.album.name+"</em></li>");
}