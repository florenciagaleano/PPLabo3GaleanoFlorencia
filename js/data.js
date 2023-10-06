let dataJson = '[{"id":14, "modelo":"Ferrari F100", "anoFab":1998, "velMax":400, "cantPue":2, "cantRue":4},{"id":51, "modelo":"DodgeViper", "anoFab":1991, "velMax":266, "cantPue":2, "cantRue":4},{"id":67, "modelo":"Boeing CH-47 Chinook","anoFab":1962, "velMax":302, "altMax":6, "autonomia":1200},{"id":666, "modelo":"Aprilia RSV 1000 R","anoFab":2004, "velMax":280, "cantPue":0, "cantRue":2},{"id":872, "modelo":"Boeing 747-400", "anoFab":1989,"velMax":988, "altMax":13, "autonomia":13450},{"id":742, "modelo":"Cessna CH-1 SkyhookR", "anoFab":1953,"velMax":174, "altMax":3, "autonomia":870}]';
let data = JSON.parse(dataJson);

let arrayVehiculos = data.map(
    (elemento)=>{
        if ('cantPue' in elemento) {
            return new Terrestre(elemento.id, elemento.modelo, elemento.anoFab, elemento.velMax, elemento.cantPue, elemento.cantRue);
          } else if ('altMax' in elemento) {
            return new Aereo(elemento.id, elemento.modelo, elemento.anoFab, elemento.velMax, elemento.altMax, elemento.autonomia);
          }
    }
);
