// ------------------------
// *** Handlers Block ***
// ------------------------


function checkPartner (req, res, next) {
  var properties = req.params.path.split('&');
  var params = splitParams(properties);

  Partner.find({'secret': params.secret}).exec(function(err, partner) {
    if (!partner) {
      res.send({ error: { status: 'Key Not Found'} });
    }
    else if (partner.length != 0 && partner[0].services.api == true) {
      next();
    }
    else {
      res.send({ error: { status: 'Not Key Param'} });
    }
  });
}


function splitParams (properties) {
  var params = {};

  properties.forEach(function(property) {
    var tup = property.split('=');
    params[tup[0]] = tup[1];
  });

  return params;
}


// ------------------------
// *** API Block ***
// ------------------------


app.get('/api/v1/:path', checkPartner, function(req, res) {
  var properties = req.params.path.split('&');
  var params = splitParams(properties);

  if (params.location == 'events') {
    var query = params.id ? {'_id': params.id} : {}
    var exclude = params.fields ? params.fields.replace(/\,/g,' ') : '-__v -meta.columns.one -meta.columns.two -en -date -members._id';
    var populated = params.populate == 'true' ? 'members.m_id' : '';

    Event.find(query, exclude).populate(populated).sort(params.sort).skip(params.skip).limit(params.limit || 10).exec(function(err, events) {
      res.send(events);
    });
  }

  else if (params.location == 'schedule') {
    var exclude = params.fields ? params.fields.replace(/\,/g,' ') : '-__v -events.banner';
    var populated = params.populate == 'true' ? 'events.event' : '';
    var def = new Date();

    var start = params.start ? new Date(+params.start) : new Date();
    var end = params.end ? new Date(+params.end) : new Date(def.setFullYear(def.getFullYear(), (def.getMonth()+1), 0));

    var Query = params.id ?
      Schedule.findById(params.id, exclude).populate(populated) :
      Schedule.find({}, exclude).populate(populated).sort(params.sort).where('date').gte(start).lte(end);

    Query.exec(function(err, schedule) {
      res.send(schedule);
    });
  }

  else res.send({ error: { status: 'Wrong Location'} });
});
