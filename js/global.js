$(document).ready(function() {
    var spotifyApi = new SpotifyWebApi();

    LeToken = spotifyApi.getAccessToken('8d1f133be7644028b5835d5c7b450360');
    spotifyApi.setAccessToken(LeToken);
    
    spotifyApi.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE', function(err, data) {
      //if (err) console.error(err);
      //else console.log('Artist albums', data);
      
      //console.log(data.items);
      
      $.each(data.items, function(i, item) {
         console.log(data.items[i]);
      });
      
      
    });
});