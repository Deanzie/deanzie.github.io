#Service Workers

##OVERVIEW

###Document Purpose
The purpose of this document is to provide a quick introduction on service workers ( SW ), outline the service worker demo and provide a review of their pros and cons. Links have been provided to tutorials and more in-depth documentation.

###Definition
Service worker is an event-driven API that lives inside of the browser. It sits between your web pages and your application servers. You can think of them similar to a proxy server, something that intercepts network requests and allows developers to provide different experiences, depending on the status of network connectivity. It is a great way to enhance the offline experience for users. You can see other use cases [here](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API#Other_use_case_ideas).

###Secure Connection
The spec for SWs recommends that they SHOULD be implemented over HTTPS-only. My experience shows me that SWs will work over a non-secure network connection locally, but not over an internet connection. [Github.io](https://pages.github.com/) pages supports HTTPS and was mentioned in multiple resources, as a good place to host dev projects.

[http://www.w3.org/TR/service-workers/#security-considerations](http://www.w3.org/TR/service-workers/#security-considerations)

###Promises
Service workers are a promise-based API. If you need a refresher on promises, check out this [article](https://ponyfoo.com/articles/es6-promises-in-depth).

###Lifecycle
A service worker has a lifecycle which is independent from the browser. I’ve outlined the steps of a basic setup:
1.  Installation begins with the registration of the SW. Registering the SW will cause the browser to trigger the install step in the background.
2.  During the install step, you’ll have the option to cache static assets. If any of the files fail to download, the install will fail and the service worker will not activate.
3.  After a successful installation, we the activation step will then follow. The activation step allows the developer the opportunity to cleanup old cached assets.
4.  Once the activation step has completed, the SW will now have the ability to control all pages that fall under it's [scope](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope). The page that registered the SW will have to be reloaded to gain control. Once the SW has control, it will be in one of two states: the SW will be terminated or it will be able to handle `fetch` and `message` events, which will occur when a request is made to the page. For this reason, Nicolas Bevacqua recommends that “your code should aim to be stateless”.

###Storage
The two main recommendations for storing assets locally include SW's storage API - [cache](https://developer.mozilla.org/en-US/docs/Web/API/Cache) ( lacks browser support ) and [indexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) ( answer to lack of cache's browser support ). During my research, I've noticed more developers utilize cache over indexedDB.  It's fair to note that one of the early solutions to storage was AppCache. AppCache is good at easily specifying which assets to cache, however eventually caused more harm than good. Jake Archibald discusses this in detail, in his article [Application Cache is a Douchebag](http://alistapart.com/article/application-cache-is-a-douchebag).

###Leaders and Evangelists
I found the Nicolas Bevacqua ( of [PonyFoo](https://ponyfoo.com/), they have more articles on SWs ), [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers), and [Matt Gaunt](http://www.html5rocks.com/en/tutorials/service-worker/introduction/) to be great resources for SW. Jake Archibald’s name also popped up quit often. He wrote a really nice article on [Background Sync](https://developers.google.com/web/updates/2015/12/background-sync), which works with SWs to send requests to the server. I plan on writing up another article about Background Sync, to further explore the potential of offline experiences.


##MY DEMO (kinda)

The demo is taken from Nicolas' article [Making a Simple Site Work Offline with ServiceWorker](https://css-tricks.com/serviceworker-for-offline/). I made very minor changes and added Node, so that the demo can be run locally. To fire up the server, run `node app`.

###Good
Access cached content sans-internet. Maintain branding.
Manually specify assets to download and cache without having to visit a page.
Set graceful 500s and 400s when offline.
Overall, allows us to maintain a good experience without internet access ( after previously accessed ).
Control over cache
[https://www.theguardian.com/info/developer-blog](https://www.theguardian.com/info/developer-blog) ( cross-word puzzle )


##Bad
Bad, bad caching issues. SW will first check for cached data, then network data.
Browser support is poor ( but we have a polypill - [https://github.com/coonsta/cache-polyfill](https://github.com/coonsta/cache-polyfill) ):
Chrome ( 43+ ) - Yes
FireFox - Not now, but will in 44+
Edge - No
IE - No
Safari - No
Opera ( 33+ ) - Surprisingly, yes
iOS Safari - No
Opera Mini - No
Android ( 46+ ) - Yes
Chrome for Android ( 47+ ) - Yes
Inappropriately handled errors and exceptions


##OTHER NOTEWORTHY ITEMS

Client or user specific data and any privacy requirements.
No DOM access


##USE CASES

Great for articles, tutorials, simple content driven pages, etc...  Bookmark a page and read it on the train.
Thanks, David Walsh - [https://serviceworke.rs/](https://serviceworke.rs/)


##REAL DEMOS

* [https://deanzie.github.io/](https://deanzie.github.io/)
* [https://www.google.com/](https://www.google.com/)
* [https://ponyfoo.com/](https://ponyfoo.com/)
* [https://www.theguardian.com/info/developer-blog/2015/nov/04/building-an-offline-page-for-theguardiancom](https://www.theguardian.com/info/developer-blog/2015/nov/04/building-an-offline-page-for-theguardiancom)


##RESOURCES

* [https://css-tricks.com/serviceworker-for-offline/](https://css-tricks.com/serviceworker-for-offline/)
* [https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
* [https://ponyfoo.com/](https://ponyfoo.com/)
* [http://www.html5rocks.com/en/tutorials/service-worker/introduction/](http://www.html5rocks.com/en/tutorials/service-worker/introduction/)
* [https://davidwalsh.name/offline-recipes-service-workers](https://davidwalsh.name/offline-recipes-service-workers)
* [http://www.html5rocks.com/en/tutorials/service-worker/introduction/](http://www.html5rocks.com/en/tutorials/service-worker/introduction/)
* [https://github.com/coonsta/cache-polyfill](https://github.com/coonsta/cache-polyfill)


##DEBUGGING

chrome://serviceworker-internals - See registered SWs
chrome://inspect/#service-workers - See active/running SWs
