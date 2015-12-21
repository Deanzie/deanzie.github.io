#Service Workers

##OVERVIEW

###Document Purpose
The purpose of this document is to provide a quick introduction on service workers ( SW ), walk through a scenario with the SW [demo](https://deanzie.github.io/) ( slightly modified from [CSS-Tricks article](https://css-tricks.com/serviceworker-for-offline/) ) and provide a review the good and bad of SWs.

###Definition
Service workers play a huge part in [offline first]( http://offlinefirst.org/ ) websites and applications. It is an event-driven API that lives inside of the browser, which sits between your web pages and your application servers. You can think of them similar to a ( caching ) proxy server. A developer can use them to intercept network requests and control what content is displayed by serving assets from cache, when network resources are not available. This is great because it will allow us to provide a much better experience to users when the network resources are not available.

###Secure Connection
The [w3c specs]( http://www.w3.org/TR/service-workers/#security-considerations ) for SWs recommends that they SHOULD be implemented over HTTPS-only. My experience shows me that SWs will work over a non-secure network connection locally, but not over an internet connection. [Github.io]( https://pages.github.com/ ) pages supports HTTPS and was mentioned in multiple resources, as a good place to host dev projects.

###Promises
Service workers are a promise-based API. If you need a refresher on promises, check out this [article](https://ponyfoo.com/articles/es6-promises-in-depth).

###Lifecycle
A service worker has a lifecycle which is independent from the browser. I've outlined the steps of a basic setup:

1.  Installation begins with the registration of the SW. Registering the SW will cause the browser to trigger the install step in the background.
2.  During the install step, you'll have the option to cache static assets. If any of the files fail to download, the install will fail and the service worker will not activate.
3.  After a successful installation, we the activation step will then follow. The activation step allows the developer the opportunity to cleanup old cached assets.
4.  Once the activation step has completed, the SW will now have the ability to control all pages that fall under it's [scope](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope). The page that registered the SW will have to be reloaded to gain control. Once the SW has control, it will be in one of two states: the SW will be terminated or it will be able to handle `fetch` and `message` events, which will occur when a request is made to the page. For this reason, Nicolas Bevacqua recommends that "your code should aim to be stateless".

###Storage
The two main recommendations for storing assets locally include SW's storage API - [cache](https://developer.mozilla.org/en-US/docs/Web/API/Cache) ( lacks browser support ) and [indexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) ( answer to lack of cache's browser support ). During my research, I've noticed more developers utilize cache ( as is the [demo](https://deanzie.github.io/) ) over indexedDB. It's fair to note that one of the early solutions to storage was AppCache. AppCache is good at easily specifying which assets to cache, however eventually caused more harm than good. Jake Archibald discusses this in detail, in his article [Application Cache is a Douchebag](http://alistapart.com/article/application-cache-is-a-douchebag).

###Leaders and Evangelists
I found the Nicolas Bevacqua ( of [PonyFoo](https://ponyfoo.com/), they also have more articles on SWs ), [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers), and [Matt Gaunt](http://www.html5rocks.com/en/tutorials/service-worker/introduction/) to be great resources for SW. Jake Archibald's name also popped up quit often. He wrote a really nice article on [Background Sync](https://developers.google.com/web/updates/2015/12/background-sync), which works with SWs to send requests to the server. I plan on writing up another article about Background Sync ( out of this document's scope ), to further explore the potential of offline experiences.

###File Location
The location where your service-worker.js file is located matters! Given this example, the majority of the JavaScript files are located in `/js/`. This will only allow the SW access to `/js/`, which isn't ideal. We want our SW to have access to the root of our site/application.

##THE DEMO

The demo is taken from Nicolas' article [Making a Simple Site Work Offline with ServiceWorker](https://css-tricks.com/serviceworker-for-offline/). Nicolas did a great job of commenting all of events and processes ( logged to console ). I purposely made my demo with very few assets, so you can more easily follow the events and processes in the console. I made very minor changes to it. As previously mentioned, it works sans-https, locally. I used a super simple implementation of Node and it worked just great.

1.  Load [demo](https://deanzie.github.io/)
2.  Click on the `Murray` link.
3.  Disable internet connection.
4.  Refresh page. Assuming that you're using Chrome, you can see that instead of the standard `Unable to connect to Internet` message that Chrome usually displays, you see the content for the page. When you access a page, the SW caches the assets. This demo will attempt to retrieve assets from network resources. When an assets is not available through a network connection, it will look for the asset in cache storage.
5.  Click on the Star Wars link. This link takes us back to the home page. As you would expect, you can see the page rendered with content as if we had a network connection.
6.  Click on the `Dogs` link. Since we have not yet visited the Dogs page, we can not access it's content. We instead see a custom 503 page that's being served from cache. If you're thinking, "Wat... we never visited this page. How is it cached?". Please look at service-worker.js, lines 19-25. In this section, the SW is being installed. As previously mentioned, during the install, we have the ability to manually specify assets to be cached. This is great for caching global assets such as CSS, fonts, error messages, etc...

###Good
*   As previously mentioned, the main use for SWs has been to provide a better offline experience than the browser's default "You are not connected to the Internet" message.
*   Performance gains! Clone a site, implement SWs and test to see your gains!
*   Having an "offline presence" will allow an entity to maintain their branding.
*   In addition to caching assets to user visited pages, developers also have the ability to manually specify assets to cache and serve to the end user. I found this to be most beneficial for serving up things like global assets, custom error messages and even providing a reason to stay on your page or application, with say a [game]( https://www.theguardian.com/info/developer-blog ).
*   As just mentioned, with the ability to manually specify which assets are cached, developers can appropriately display a more meaningful set of 500s and 400s, when offline.
*   SWs also allow for assets to be cached when they're served up from an external source. So if you're serving assets from CDNs, you're still good to go!
*   SW have value and great potential, but stand-alone are limited. I've seen some really neat demos when SWs are teamed up with other web APIs like [background sync]( https://developers.google.com/web/updates/2015/12/background-sync?hl=en ), [notifications]( https://notifications.spec.whatwg.org/ ), and [push]( https://developer.mozilla.org/en-US/docs/Web/API/PushManager ) to name a few. David Walsh has some nice demo's in his [Service Worker Cookbook]( https://serviceworke.rs/index.html ).


###Bad
*   I've experienced a lot of issues with stale content. Since we're serving content from cache, I expected some amount of old content to be served. The order in which content is fetched, in the demo should be network and then cache. There were times when I updated the content, refreshed the page and it still served the cached content instead of content from a server. I highly recommend going through this process to witness the inconsistency.
*   Browser support is poor ( but we have a polypill - [https://github.com/coonsta/cache-polyfill](https://github.com/coonsta/cache-polyfill) ). I've listed the browser support ( crediting caniuse ), accurate to the time of this writing:
    *   Chrome ( 43+ ) - Yes
    *   FireFox - Not now, but will in 44+
    *   Edge - No
    *   IE - No
    *   Safari - No
    *   Opera ( 33+ ) - Surprisingly, yes
    *   iOS Safari - No
    *   Opera Mini - No
    *   Android ( 46+ ) - Yes
    *   Chrome for Android ( 47+ ) - Yes
*   Inappropriately handled errors and exceptions from service-worker.js file, `net::ERR_FILE_EXISTS`. There is a bug logged with Chromium and is being addressed [here]( https://code.google.com/p/chromium/issues/detail?id=541797 ).


##TUTORIALS

* [https://css-tricks.com/serviceworker-for-offline/]( https://css-tricks.com/serviceworker-for-offline/ ) - Demo is taken from here.
* [https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API]( https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API )
* [http://www.html5rocks.com/en/tutorials/service-worker/introduction/]( http://www.html5rocks.com/en/tutorials/service-worker/introduction/ )


##MORE DEMOS

*   [https://serviceworke.rs/]( https://serviceworke.rs/ )
*   [https://jakearchibald.com/2014/offline-cookbook/]( https://jakearchibald.com/2014/offline-cookbook/ )
* [https://www.theguardian.com/info/developer-blog/2015/nov/04/building-an-offline-page-for-theguardiancom]( https://www.theguardian.com/info/developer-blog/2015/nov/04/building-an-offline-page-for-theguardiancom )
*   [https://developers.google.com/web/updates/2015/12/background-sync?hl=en]( https://developers.google.com/web/updates/2015/12/background-sync?hl=en )
*   [https://deanzie.github.io/]( https://deanzie.github.io/ )


##MORE RESOURCES
* [https://ponyfoo.com/]( https://ponyfoo.com/ )
* [https://github.com/coonsta/cache-polyfill]( https://github.com/coonsta/cache-polyfill ) - Polyfill


##DEBUGGING

*   chrome://serviceworker-internals - See registered Service Workers
*   chrome://inspect/#service-workers - See active/running Service Workers
