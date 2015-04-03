(function(_, $, window) {
  /**
   * Get list of all properties of the object.
   * for-in is listing of all enumerable properties.
   *
   * @param {Object} object
   * @returns {Object}
   */
  var getObjectProperty = function(object) {
    var property,
      obj = {};
    for (property in object)
      obj[property] = object[property];
    return obj;
  };

  /**
   * Get list of all properties name of the object.
   *
   * @param {Object} object
   * @returns {Array}
   */
  var getObjectPropertyNamesToArray = function(object) {
    var property,
      arr = [];
    for (property in object)
      arr.push(property);
    return arr;
  };

  // fingerprint data
  var data = [];

  // for implements
  var navigatorPropNames = getObjectPropertyNamesToArray(window.navigator),
    screenPropNames = getObjectPropertyNamesToArray(window.screen);

  /**
   * 1. Enumerated the navigator and screen object,
   * i.e., request the listing of all properties
   * of the aforementioned objects.
   */
  data.push({
    'navigator': getObjectProperty(window.navigator),
    'screen': getObjectProperty(window.screen)
  });

  /**
   * 2. Enumerated the navigator object again, to ensure
   * that the order of enumeration does not change.
   */
  data.push({
    'navigator': getObjectProperty(window.navigator),
    'screen': getObjectProperty(window.screen)
  });

  /**
   * 3. Created a custom object, populated it, and enumerated
   * it. A custom, JavaScript-created object, allows us to
   * compare the behavior of browser-populated objects
   * (such as navigator) with the behavior of “classic”
   * JavaScript objects.
   */
  var customObject = {
    'customObject': 'data',
    'fingerprinting': 'fingerprint'
  };
  data.push({
    'customObject': getObjectProperty(customObject)
  });

  /**
   * 4. Attempted to delete a property of the navigator
   * object, the screen object, and the custom object.
   */
  var navigatorTmp = _.cloneDeep(window.navigator),
    screenTmp = _.cloneDeep(window.screen),
    customObjectTmp = _.cloneDeep(customObject);
  data.push({
    'navigator_delete': delete window.navigator[navigatorPropNames[0]],
    'screen_delete': delete window.screen[screenPropNames[0]],
    'customObject_delete': delete customObject.fingerprinting,
    'navigator': getObjectProperty(window.navigator),
    'screen': getObjectProperty(window.screen),
    'customObject': getObjectProperty(customObject)
  });

  /**
   * 5. Add the possibly-deleted properties back to their objects.
   */
  window.navigator[navigatorPropNames[0]] = navigatorTmp[navigatorPropNames[0]];
  window.screen[screenPropNames[0]] = screenTmp[screenPropNames[0]];
  customObject.fingerprinting = customObjectTmp.fingerprinting;
  data.push({
    'navigator': getObjectProperty(window.navigator),
    'screen': getObjectProperty(window.screen),
    'customObject': getObjectProperty(customObject)
  });

  /**
   * 6. Attempted to modify an existing property of the
   * navigator and screen objects.
   */
  window.navigator[navigatorPropNames[1]] = {};
  window.screen[screenPropNames[1]] = {};
  data.push({
    'navigator': getObjectProperty(window.navigator),
    'screen': getObjectProperty(window.screen)
  });

  /**
   * 7. If Object.defineProperty is implemented in
   * the current browser, utilize it to make an existing
   * property in the navigator, screen, and custom
   * object non-enumerable.
   */
  if ('defineProperty' in Object) {
    Object.defineProperty(window.navigator, navigatorPropNames[2], {
      enumerable: false
    });
    Object.defineProperty(window.screen, screenPropNames[2], {
      enumerable: false,
    });
    Object.defineProperty(customObject, 'fingerprinting', {
      enumerable: false,
    });
    data.push({
      'navigator': getObjectProperty(window.navigator),
      'screen': getObjectProperty(window.screen),
      'customObject': getObjectProperty(customObject)
    });
  } else {
    data.push({
      'Object.defineProperty': 'not supported'
    });
  }

  /**
   * 8. Attempt to delete the navigator and screen objects.
   */
  try {
    delete window.navigator;
    delete window.screen;
  } catch (err) {
    console.log(err);
  }
  data.push({
    'navigator': getObjectProperty(window.navigator),
    'screen': getObjectProperty(window.screen)
  });

  /**
   * 9. Attempt to assign new custom objects to the
   * navigator and screen variable names.
   */
  var newCustomObject = {
    'newCustomObject': 'data',
    'fingerprinting': 'fingerprint'
  };
  try {
    window.navigator = newCustomObject;
    window.screen = newCustomObject;
  } catch (err) {
    console.log(err);
  }
  data.push({
    'navigator': getObjectProperty(window.navigator),
    'screen': getObjectProperty(window.screen)
  });

  // console.log(data);
  var $dd;
  _.each(data, function(obj, idx) {
    _.each(obj, function(val, key) {
      $('#step' + (idx + 1)).append($.parseHTML('<dt>' + key + '</dt>' + '<dd id="step' + (idx + 1) + key + '"></dd>'));
      $dd = $('#step' + (idx + 1) + key);
      if (typeof val === 'object') {
        _.each(val, function(value, property) {
          $dd.append(property + ': ' + value + '<br>');
        });
      } else {
        $dd.append(val);
      }
    });
  });
}(_, jQuery, window));
