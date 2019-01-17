(function() {
  const style = document.createElement('style');
  style.id = 'gumroad-style';
  style.innerHTML = `
        a.gumroad-button {
          background: #ffcf42;
          border-radius: 3px;
          color: #333;
          display: inline-block;
          font-weight: bold;
          margin-right: 16px;
          padding: 15px 15px;
          text-decoration: none;
        }
        .gumroad-iframe-wrapper {
          align-items: center;
          background: rgba(0,0,0,.0);
          cursor: pointer;
          display:flex;
          justify-content: center;
          left:0;
          position: fixed;
          top:0;
          transition: background .3s linear;
          z-index: 99998;
        }
        .gumroad-iframe-wrapper.loaded,
        .gumroad-iframe-wrapper.loading {
          background: rgba(0,0,0,0.6);
          height: 100%;
          width: 100%;
        }
        .gumroad-iframe-wrapper.embed {
          background: transparent;
          cursor: initial;
          display: block;
          height: 573px;
          margin: 0 auto;
          max-width: 1024px;
          position: initial;
        }
        .gumroad-iframe-wrapper.embed.loading {
          height: 50px;
          width: 100px;
        }
        .gumroad-iframe-wrapper.loading:before {
          align-items: center;
          background: #fff;
          color: #333;
          content: 'Loading';
          display: flex;
          justify-content: center;
          padding: 10px 50px;
        }
        .gumroad-iframe-wrapper.embed.loading:before {
          display: none;
        }
        .gumroad-iframe-wrapper.loaded .gumroad-iframe {
          height: 564px;
          width: 100%;
        }
        .gumroad-iframe {
          max-width: 670px;
          z-index:2;
          border:none;
          width:0;
          height:0;
        }
      `;
  document.head.appendChild(style);
})();

(function() {
  const Gumroad = {
    init: function() {
      /**
       * Let's first collect all the links to Gumroad products on the page.
       */
      let gumroadLinks = document.querySelectorAll('a[href*="https://gum.co"]');

      /**
       * if there are no valid links to Gumroad, the user most likely made a typo
       * let's be nice about it and let them know.
       * Alerts are very intrusive but it gets the users attention
       */
      if (gumroadLinks.length === 0) {
        alert(
          `You included Gumroad widget JavaScript but no valid product link was found.
        \nRefer to https://gumroad.com/widgets to set it up properly.`
        );
      }
      gumroadLinks = Array.from(gumroadLinks); // by default querySelectorAll doesn't return an array but rather a NodeList
      gumroadLinks.forEach(gumroadLink => {
        const productLink = gumroadLink.getAttribute('href');
        const displayStyle = gumroadLink.getAttribute('data-display-style');
        const iframeWrapper = Gumroad.createIframeWrapper(displayStyle);
        const iframeToBeLoaded = Gumroad.createIframe(
          gumroadLink,
          iframeWrapper
        );

        /**
         * Here is where we are handling whether it should be embeded directly,
         * or wait for the user to click on the button and open it as an overlay,
         * the attribute `data-display-style` dictates which style of display (overlay or embed) the user chose.
         */
        if (displayStyle === 'embed') {
          iframeWrapper.classList.add('loading', 'embed');
          iframeToBeLoaded.setAttribute('src', productLink);
        } else {
          gumroadLink.addEventListener('click', event => {
            event.preventDefault();
            iframeWrapper.classList.add('loading');
            iframeToBeLoaded.setAttribute('src', productLink);
          });
        }
      });
    },
    createIframeWrapper: displayStyle => {
      const iframeWrapper = document.createElement('div');
      iframeWrapper.classList.add('gumroad-iframe-wrapper');
      document.body.appendChild(iframeWrapper);

      // if it is an overlay, clicking on the overlay should dismiss it.
      if (displayStyle !== 'embed') {
        iframeWrapper.addEventListener('click', event => {
          iframeWrapper.classList.remove('loaded');
        });
      }
      return iframeWrapper;
    },
    createIframe: (gumroadLink, iframeWrapper) => {
      const gumroadIframe = document.createElement('iframe');
      gumroadIframe.setAttribute('data-src', gumroadLink);
      gumroadIframe.classList.add('gumroad-iframe');

      //setup iframe load event listener
      gumroadIframe.addEventListener('load', () => {
        const iframeSrc = gumroadIframe.getAttribute('src');
        if (iframeSrc) {
          iframeWrapper.classList.remove('loading');
          iframeWrapper.classList.add('loaded');
        }
        // after it is done loading if it is an embedable form hide the source link
        const displayStyle = gumroadLink.getAttribute('data-display-style');
        if (displayStyle === 'embed') {
          gumroadLink.style.display = 'none';
        }
      });

      iframeWrapper.appendChild(gumroadIframe);
      return gumroadIframe;
    }
  };

  Gumroad.init();
})();
