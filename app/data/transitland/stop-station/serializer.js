import DS from 'ember-data';
import TransitlandSerializer from "../serializer";

export default TransitlandSerializer.extend(DS.EmbeddedRecordsMixin, {
  primaryKey: 'onestop_id',
  attrs: {
    stop_platforms: {
      deserialize: 'records'
    },
    stop_egresses: {
      deserialize: 'records'
    }
  },
	modelNameFromPayloadKey: function(payloadKey){
		return "data/transitland/stop-station";
	}
});