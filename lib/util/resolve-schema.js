'use strict';

var $ = require('./uri-helpers'),
    jsptr = require('jsonpointer');

var clone = module.exports = function(obj, refs, child) {
  var copy = {};

  if (Array.isArray(obj)) {
    copy = [];
  }

  if ($.isURL(obj.$ref)) {
    var uri = $.getDocumentURI(obj.$ref) || obj.$ref;

    if (refs[uri]) {
      var fixed = refs[uri];

      if (obj.$ref.indexOf('#') > -1) {
        var hash = obj.$ref.split('#')[1];

        if (hash.charAt() === '/') {
          fixed = jsptr.get(refs[uri], hash);
        }

        // TODO: otherwise? (i.e. http://example.com/schema#someId)
        // console.log('REF (find by?)', obj.$ref, typeof refs[uri], uri === obj.$ref);
      }

      return clone(fixed, refs, true);
    }

    return obj;
  }

  for (var key in obj) {
    var value = obj[key];

    if (typeof value === 'object') {
      copy[key] = clone(value, refs, true);
    } else {
      copy[key] = value;
    }
  }

  // TODO: seriously are required or not?
  if (child) {
    if (typeof copy.$schema === 'string') {
      delete copy.$schema;
    }

    if (typeof copy.id === 'string') {
      delete copy.id;
    }
  }

  return copy;
};