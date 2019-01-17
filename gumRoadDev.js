(function() {
  const style = document.createElement('style');
  style.id = 'gumroad-style';
  style.innerHTML = `
        a.gumroad-button {
          background-color: white;
          background-image: url(https://gumroad.com/button/button_bar.jpg);
          background-repeat: repeat-x;
          border-radius: 4px;
          box-shadow: rgba(0, 0, 0, .4) 0 0 2px;
          color: #999;
          display: inline-block;
          font-family: -apple-system, ".SFNSDisplay-Regular", "Helvetica Neue", Helvetica, Arial, sans-serif;
          font-size: 16px;
          font-style: normal;
          font-weight: 500;
          line-height: 50px;
          padding: 0 15px;
          text-shadow: none;
          text-decoration: none;
          margin-right: 16px;
        }
        .gumroad-iframe-wrapper {
          background: rgba(0,0,0,.0);
          transition: background .3s linear;
          position: fixed;
          z-index: 99998;
          display:flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          top:0;
          left:0;
        }
        .gumroad-iframe-wrapper.loaded,
        .gumroad-iframe-wrapper.loading {
          background: rgba(0,0,0,0.6);
          position:fixed;
          height: 100%;
          width: 100%;
        }
        .gumroad-iframe-wrapper.embed {
          height: 573px;
          background: transparent;
          position: initial;
          display: block;
          margin: 0 auto;
          max-width: 1024px;
          cursor: initial;
        }
        .gumroad-iframe-wrapper.embed.loading {
          width: 100px;
          height: 50px;
          background: transparent;
        }
        .gumroad-iframe-wrapper.loading:before {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 200px;
          height: 50px;
          background: #fff;
          color: #333;
          content: 'Loading';
          position: fixed;
        }
        .gumroad-iframe-wrapper.embed.loading:before {
          width: 100px;
          height: 50px;
          background: transparent;
          display: none;
        }
        .gumroad-iframe-wrapper.loaded .gumroad-iframe {
          width: 100%;
          height: 564px;
        }
        .gumroad-iframe {
          max-width: 670px;
          z-index:2;
          border:none;
          width:0;
          height:0;
        }
        .gumroad-loading-spinner {
          width: 200px;
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
