import { Component, OnInit, OnDestroy } from '@angular/core';

import { environment } from '../../../environments/environment';

import { Place } from '../../shared/place';

import { DatabaseService } from '../../services/database.service';

import * as Mapboxgl from 'mapbox-gl';
import { GeolocationService } from '../../services/geolocation.service';
import { Point } from '../../shared/point';


@Component({
    selector: 'app-urban-circuit',
    templateUrl: './urban-circuit.page.html',
    styleUrls: ['./urban-circuit.page.scss'],
})
export class UrbanCircuitPage implements OnInit, OnDestroy {

    items: Place[];
    points: Point[] = [];
    point: Point;
    lat = 0;
    lon = 0;

    //mapa: Mapboxgl.Map;

    su = this.database.getPlaces().snapshotChanges().subscribe(data => {
        this.items = [];
        data.forEach(item => {
            let a = item.payload.toJSON();
            a['$key'] = item.key;
            this.items.push(a as Place);
        })

        var largo = 0;

        this.items.forEach(data => {
            if (data.tipo == 'Urbano') {
                largo = largo + 1;
            }
        })

        //console.log(largo);

        this.items.forEach(data => {
            if (data.tipo == 'Urbano') {
                this.point = {latitud: +data.latitud, longitud: +data.longitud}
                this.points.push(this.point);
            }
        })
        console.log(this.points.length)
        this.geolocationService.crearMapa(this.points)

        this.items.forEach(data => {
            if (data.tipo == 'Urbano') {
                var popup = new Mapboxgl.Popup({ offset: 25 }).setHTML(
                    `<a href="http://localhost/places/${data.$key}"><img src="${data.imagenPrincipal}" /><h5 style="text-align: center">${data.nombre}</h5></a>`
                );
                const marker = new Mapboxgl.Marker({
                        draggable: false,
                        color: "#ea4335"
                    }).setLngLat([data.longitud, data.latitud])
                    .setPopup(popup)
                    .addTo(this.geolocationService.mapa);
            }
        })

        this.geolocationService.mapa.on('load', () => {
            this.geolocationService.mapa.addSource('route', {
                'type': 'geojson',
                'data': {
                    'type': 'Feature',
                    'properties': {},
                    'geometry': {
                        'type': 'LineString',
                        'coordinates': [
                            [
        -56.70840727522763,
        -34.31858678790833
      ],
      [
        -56.70999390264306,
        -34.32242002914016
      ],
      [
        -56.71129848390058,
        -34.323816025999925
      ],
      [
        -56.71343950881156,
        -34.32508633072112
      ],
      [
        -56.71399778315565,
        -34.322339981794684
      ],
      [
        -56.71395869069619,
        -34.32155899162894
      ],
      [
        -56.71587420772967,
        -34.32034706788567
      ],
      [
        -56.71483584126389,
        -34.319505755732614
      ],
      [
        -56.71519930124947,
        -34.31808780631834
      ],
      [
        -56.71711320382815,
        -34.31958447016697
      ],
      [
        -56.71767180214222,
        -34.31945479042862
      ],
      [
        -56.7188710605388,
        -34.32057387054478
      ],
      [
        -56.72018921076777,
        -34.32132738663783
      ],
      [
        -56.72190797501894,
        -34.32153577608793
      ],
      [
        -56.72662294683499,
        -34.32463354515574
      ],
      [
        -56.7243478466645,
        -34.3270796627196
      ],
      [
        -56.721460517536656,
        -34.329562794122104
      ],
      [
        -56.716734884385374,
        -34.32697000697697
      ],
      [
        -56.715167967881186,
        -34.332731235184575
      ],
      [
        -56.71146422458803,
        -34.33175985363635
      ],
      [
        -56.70996160006149,
        -34.33710858725552
      ],
      [
        -56.711290411625654,
        -34.33735722044838
      ],
      [
        -56.71052149155693,
        -34.33954927187477
      ],
      [
        -56.70930284891645,
        -34.339348129767615
      ],
      [
        -56.70880728396702,
        -34.3412501538973
      ],
      [
        -56.71243746026606,
        -34.34198657869165
      ],
      [
        -56.71275588291779,
        -34.341033359489956
      ],
      [
        -56.71348249606805,
        -34.34115328770201
      ],
      [
        -56.71316465130718,
        -34.34207914819867
      ],
      [
        -56.713765544099545,
        -34.34223259997188
      ],
      [
        -56.714371366684446,
        -34.34024600814102
      ],
      [
        -56.71304759126876,
        -34.33999415366054
      ],
      [
        -56.71335260933067,
        -34.33890109890837
      ],
      [
        -56.714635419119844,
        -34.3391856227908
      ],
      [
        -56.71437277119742,
        -34.34017951700327
      ],
      [
        -56.71559518593146,
        -34.34046316676944
      ],
      [
        -56.71620487092815,
        -34.338293678410366
      ],
      [
        -56.71433894452974,
        -34.33796749692872
      ],
      [
        -56.71512794168166,
        -34.334935828841225
      ],
      [
        -56.718196853385464,
        -34.33551215113973
      ],
      [
        -56.71852287120005,
        -34.3345088254844
      ],
      [
        -56.71876115289061,
        -34.33433997436604
      ],
      [
        -56.7191137247753,
        -34.333698988018185
      ],
      [
        -56.720740771018754,
        -34.334454627444146
      ],
      [
        -56.72121187765431,
        -34.33437527107957
      ],
      [
        -56.728738058117074,
        -34.33063834281268
      ],
      [
        -56.732186746654406,
        -34.33236686817769
      ]
                        ]
                    }
                }
            });
            this.geolocationService.mapa.addLayer({
                'id': 'route',
                'type': 'line',
                'source': 'route',
                'layout': {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                'paint': {
                    'line-color': '#1d77b4',
                    'line-width': 5
                }
            });
        });

    })

    constructor(
    	private database: DatabaseService,
    	private geolocationService: GeolocationService
    	) {}

    ngOnInit() {
        this.su;
        
    }

    ngOnDestroy() {
        this.su.unsubscribe();
        if(this.geolocationService.isWatching){
            this.geolocationService.isWatching = false;
            //this.geolocationService.sourceGpsSubject$.unsubscribe(); 
            this.geolocationService.myPositionMarker = null;
            this.geolocationService.points = [];
            //this.geolocationService.stopLocationWatch()          
        }
    }

}