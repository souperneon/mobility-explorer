import Ember from 'ember';
import mapBboxController from 'mobility-playground/mixins/map-bbox-controller';

export default Ember.Controller.extend(mapBboxController, {
	queryParams: ['onestop_id', 'isochrone_mode', 'pin', 'departure_time'],
	bbox: null,
	leafletBbox: null,
  leafletBounds: [[37.706911598228466, -122.54287719726562],[37.84259697150785, -122.29568481445312]],
  isochrone_mode: null,
  pin: null,
  onestop_id: null,
  departure_time: null,
  pinLocation: Ember.computed('pin', function(){
    if (typeof(this.get('pin'))==="string"){
      var pinArray = this.get('pin').split(',');
      return pinArray;
    } else {
      return this.get('pin');
    }
  }),
  place: null,
	moment: moment(),
  currentlyLoading: Ember.inject.service(),
	icon: L.icon({
		iconUrl: 'assets/images/marker1.png',		
		iconSize: (20, 20),
    iconAnchor: [10, 24],
	}),
  markerUrl: 'assets/images/marker1.png',
  // zoom: 12,
  mousedOver: false,
  attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors | <a href="http://www.mapzen.com">Mapzen</a> | <a href="http://www.transit.land">Transitland</a> | Imagery © <a href="https://carto.com/">CARTO</a>',

	actions: {
		updateLeafletBbox(e) {
      // this.set('zoom', e.target._zoom);
			var leafletBounds = e.target.getBounds();
			this.set('leafletBbox', leafletBounds.toBBoxString());
		},
		updateMapMoved(e){
			if (this.get('mousedOver') === true){
				this.set('mapMoved', true);
			}
		},
    mouseOver(){
      this.set('mousedOver', true);
    },
  	searchRepo(term) {
      if (Ember.isBlank(term)) { return []; }
      const url = `https://search.mapzen.com/v1/autocomplete?api_key=search-ab7NChg&text=${term}`;      
      return Ember.$.ajax({ url }).then(json => json.features);
    },
  	setPlace: function(selected){
			if (selected.geometry){
        var lng = selected.geometry.coordinates[0];
        var lat = selected.geometry.coordinates[1];
        var coordinates = [];
        coordinates.push(lat);
        coordinates.push(lng);
        this.set('pin', coordinates);
      }
  		this.set('place', selected);
  		this.set('bbox', selected.bbox);
  		this.transitionToRoute('index', {queryParams: {bbox: this.get('bbox'), pin: this.get('pin'), isochrone_mode: null}});
  	},
  	clearPlace: function(){
  		this.set('place', null);
  	},
    closePopup: function(e){
      // debugger;
      e.target.closePopup();
    },
    removePin: function(){
      this.set('pin', null);
    },
    dropPin: function(e){
      var lat = e.latlng.lat;
      var lng = e.latlng.lng;
      var coordinates = [];
      coordinates.push(lat);
      coordinates.push(lng);
      this.set('pin', coordinates);
      var bounds = this.get('leafletBbox');
      this.set('bbox', bounds);
    },
    updatePin: function(e){
      var lat = e.target._latlng.lat;
      var lng = e.target._latlng.lng;
      var coordinates = [];
      coordinates.push(lat);
      coordinates.push(lng);
      this.set('pin', coordinates);
      var bounds = this.get('leafletBbox');
      this.set('bbox', bounds);
    },
    removePin: function(){
      this.set('pin', null);
      this.set('isochrone_mode', null);
    },
    setIsochroneMode: function(mode){
      this.set('departure_time', null);
      if (this.get('isochrone_mode') === mode){
        this.set('isochrone_mode', null);
      } else {
        this.set('isochrone_mode', mode);
      }
    },
    change(date){

      // This is the local date and time at the location.
      // type:
      // 0 - Current departure time.
      // 1 - Specified departure time
      // 2 - Specified arrival time. Not yet implemented for multimodal costing method.
      
      // value:
      // the date and time is specified in ISO 8601 format (YYYY-MM-DDThh:mm) in 
      // the local time zone of departure or arrival. For example "2016-07-03T08:06"
      // ISO 8601 uses the 24-hour clock system. 
      // A single point in time can be represented by concatenating a complete date expression, 
      // the letter T as a delimiter, and a valid time expression. For example, "2007-04-05T14:30".
			

      var newDepartureTime = date.toISOString().slice(0,16);
      this.set('departure_time', newDepartureTime);
		},
  }
});