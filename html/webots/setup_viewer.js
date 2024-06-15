document.addEventListener('DOMContentLoaded', async () => {
  await customElements.whenDefined('webots-view');
  const webotsView = document.querySelector('webots-view');

  if (webotsView && typeof webotsView.connect === 'function') {
    const messageListener = (event) => {
      if (event.data?.target === 'simserver') {
        webotsView.sendMessage(event.data.content);
      }
    };

    function onConnect() {
      console.log('Connected from Webots viewer');
      // Extract the port from the wsServer URL string.
      const url = webotsView._view.rocsServer;
      const rocsServerInfo = url.split(':');

      window.addEventListener('message', messageListener);

      // Avoid noisy log
      console.log = ()=>{};

      window.parent.postMessage({
        simulation: 'ready',
        host: rocsServerInfo[0],
        port: rocsServerInfo[1],
      }, '*');
    }

    function onDisconnect() {
      console.log('Disconnected from Webots viewer');
      window.removeEventListener('message', messageListener);
    }

    webotsView.onready = onConnect;
    webotsView.ondisconnect = onDisconnect;

    const wsUrl =
      'https://platform.fftai.top/1999/session?url=https://github.com/tiwater/fftai-webots-simulations/blob/main/gr-1/worlds/SonnyV4.wbt'; // This URL can be dynamically adjusted if needed
    webotsView.connect(wsUrl, 'x3d');
    console.log('Connected to Webots viewer');
  } else {
    console.error('webots-view does not have a connect method');
  }
});
