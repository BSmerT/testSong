# Test HTML y CSS (y varias cosas más).

-Funcionamiento:

Buscador de musica que utiliza la api de spotify web para realizar consultas a su base de 'tracks'. Como la api no deja realizar consultas de listas musicales sin autorización de un usuario, se implemeto un login
al inicio que se muestra como un pop-up.


-Tecnologías/Librerias ocupadas:

Se utilizo HTML5, CSS, LESS, Jquery, JavaScript, Bootstrap, LessJS, NodeJs(solo al inicio del desarrollo para probar la api de spotify), SpotifyWeb JS y FontAwesome

LessJS: Compilador de less en html, es decir, solo cargo en el html el .less (no el css), y este amiguin lo compilara cuando carge la pagina, y cuando se encuentre un error mostrara la fila y la columna de donde se encuentra este. Lo malo es que sobre-carga la pagina, así que solo se ocupo al momento del desarrollo.


-Fallas y Bugs:

La pagina en si tiene ciertos bugs o fallas que pueden mostrarse al navegar despues de un tiempo (estas no se corrigieron por falta de tiempo, pero las mencionare para tenerlas en cuenta).

-Al momento de logearse a travez de la ventana de spotify, si uno no acepta las credenciales, este manda un error de exepción ya que no se configuro a que ruta debia ir si las credenciales fallaran.
-Cuando se reproduce una canción y uno selecciona otra, esta seguira sonando, ya que no se programo que cuando se cambiara de tema esta canción tambien deberia pausarse en aplicación de spotify(escritorio). La canción en reprodución solo se detendra pausandola directamente o iniciando una nueva canción desde la web o la aplicación escritorio.
-Los resultados de búsqueda a veces se 'marean' un poco al mostrarse (solo a veces), debido a que la función de mostrar/ocultar resultados es llamada cada vez que el usuario escribe, a veces jquery no procesa bien los datos cuando se ingresan muy rapido.

Fabian Zurita








