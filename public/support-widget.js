(function() {
  var scriptTag = document.currentScript;
  var widgetHost = (scriptTag && scriptTag.src) ? new URL(scriptTag.src).origin : window.location.origin;
  var widgetUrl = 'https://crm.zawrindustries.com/widget/support';

  if (document.getElementById('zawr-support-iframe')) return;

  var iframe = document.createElement('iframe');
  iframe.src = widgetUrl;
  iframe.id = 'zawr-support-iframe';
  iframe.style.cssText = 'position:fixed;bottom:16px;right:16px;width:380px;height:560px;max-width:calc(100vw - 32px);max-height:calc(100vh - 32px);border:none;z-index:999999;border-radius:16px;box-shadow:0 20px 50px rgba(0,0,0,0.5);transition:all 0.3s cubic-bezier(0.16, 1, 0.3, 1);';

  document.body.appendChild(iframe);

  window.addEventListener('message', function(e) {
    if (!e.data) return;

    var isExpand = e.data === 'widget-expand' || (e.data.type === 'widget-expand' && e.data.isExpanded);
    var isCompress = e.data === 'widget-compress' || (e.data.type === 'widget-expand' && !e.data.isExpanded);

    if (isExpand) {
      // POP-UP WINDOW MODAL MODE
      iframe.style.width = '90vw';
      iframe.style.height = '85vh';
      iframe.style.maxWidth = '920px';
      iframe.style.maxHeight = '780px';
      iframe.style.top = '50%';
      iframe.style.left = '50%';
      iframe.style.bottom = 'auto';
      iframe.style.right = 'auto';
      iframe.style.transform = 'translate(-50%, -50%)';
      iframe.style.borderRadius = '20px';
      iframe.style.boxShadow = '0 30px 80px rgba(0,0,0,0.8)';
    } else if (isCompress) {
      // NORMAL FLOATING WIDGET MODE
      iframe.style.width = '380px';
      iframe.style.height = '560px';
      iframe.style.maxWidth = 'calc(100vw - 32px)';
      iframe.style.maxHeight = 'calc(100vh - 32px)';
      iframe.style.top = 'auto';
      iframe.style.left = 'auto';
      iframe.style.bottom = '16px';
      iframe.style.right = '16px';
      iframe.style.transform = 'none';
      iframe.style.borderRadius = '16px';
      iframe.style.boxShadow = '0 20px 50px rgba(0,0,0,0.5)';
    } else if (e.data === 'widget-close') {
      iframe.style.display = 'none';
    } else if (e.data === 'widget-open') {
      iframe.style.display = 'block';
    }
  });

  iframe.onload = function() {
    try {
      iframe.contentWindow.postMessage({
        type: 'page-context',
        url: window.location.href,
        title: document.title,
        snippet: document.body.innerText ? document.body.innerText.substring(0, 300) : ''
      }, '*');
    } catch(err) {}
  };
})();
