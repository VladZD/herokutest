(function() {
  if (window.__IS_C2K_LISTENERS_SET__) {
    window.postMessage('C2K_EMBED_LOADED', '*');
    return;
  }

  var createIframe = function(options) {
    var iframe = document.createElement('iframe');
    iframe.style.borderStyle = 'none';
    if (options.width !== undefined) {
      iframe.style.width = options.width + (options.percent === 'yes' ? '%' : 'px');
    } else {
      iframe.style.width = "100%";
    }
    iframe.src = options.protocol + '//testvlad.herokuapp.com/' + options.id + '.html?auto';
    return iframe;
  };
  var getScriptParams = function(url) {
    url = decodeURIComponent(url);
    var regexp = /(\w+)=([^&]+)/g;
    var params = {}, result;
    while (result = regexp.exec(url)) {
      params[result[1]] = result[2];
    }
    var protocol = url.match(/^https?:/);
    params.protocol = protocol ? protocol[0] : '';
    return params;
  };
  var getScript = function(n) {
    var selectors = [
      'script[src^="http://' + URL + '"]',
      'script[src^="https://' + URL + '"]',
      'script[src^="//' + URL + '"]'
    ];
    return document.querySelectorAll(selectors.join(', '))[n];
  };
  var loadIframe = function(n) {
    var script = getScript(n);
    if (!script) return;
    var params = getScriptParams(script.src);
    var iframe = createIframe(params);
    frames.push(iframe);
    script.parentElement.insertBefore(iframe, script);
  };
  var embedLoadedListener = function(e) {
    if (e.source !== window || e.data !== 'C2K_EMBED_LOADED') return;
    loadIframe(numberOfScripts++);
  };
  var getIframeByWindow = function(iframeWindow) {
    for (var i = 0; i < frames.length; i++ ) {
      if (frames[i].contentWindow === iframeWindow) {
        return frames[i];
      }
    }
  };
  var iframeHeightListener = function(e) {
    if (e.origin.search(originRegexp) === -1) return;
    var iframe = getIframeByWindow(e.source);
    if (!iframe) return;
    iframe.style.height = e.data;
  };
  var iframePopupListener = function(e) {
    if (e.data !== 'C2K_GET_IFRAME_POSITION') return;
    var iframe = getIframeByWindow(e.source);
    if (!iframe) return;
    var windowHeight = document.documentElement.clientHeight;
    var iframeCoords = iframe.getBoundingClientRect();

    var message = {type: 'C2K_IFRAME_POSITION'};
    message.scrollTop = iframeCoords.top < 0 ? -iframeCoords.top : 0;
    message.height = Math.min(iframeCoords.bottom, windowHeight) - Math.max(iframeCoords.top, 0);
    e.source.postMessage(JSON.stringify(message), '*');
  };

  if (window.addEventListener) {
    window.addEventListener("message", embedLoadedListener);
    window.addEventListener("message", iframeHeightListener);
    window.addEventListener("message", iframePopupListener);
  } else {
    window.attachEvent("onmessage", embedLoadedListener);
    window.attachEvent("onmessage", iframeHeightListener);
    window.attachEvent("onmessage", iframePopupListener);
  }
  var URL = 'testvlad.herokuapp.com/embed.js', //without protocol
    originRegexp = /^https*:\/\/testvlad.herokuapp.com/,
    numberOfScripts = 0,
    frames = [];
  window.__IS_C2K_LISTENERS_SET__ = true;
  loadIframe(numberOfScripts++);
})();