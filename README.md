# Comte Bureau's website

In order to use the development server, you need to configure the environment variables. They should not be commited to the repo since the repo is open. Log in to Prismic and get the API key, client ID, client secret and endpoint, and add them all to the ```.env``` file.

Install all dependencies using

```
npm install
```

The development server uses port 5000 and can be started with

```
npm run dev
```

Now, you're ready to do some work.

## Directories

**./app**

This is where the backend is. It's a slim application based on [Express](http://expressjs.com/), and uses https://github.com/mandarinx/prismic-website to simplyfy working with the Prismic API. It's a matter of opinion whether it actually simplifies it or not. I would consider rewriting it to something much more dynamic, or just work directly with the Prismic API. It didn't turn out the way I hoped it would.

**./client/js**

This is where you'll find all the client javascript files. They are mostly for handling the intro animation. All the files are bundled using Browserify with the task "build:js" defined in ```package.json```.

**./public**

All static files referenced by the templates. CSS, logos, favicon, etc. This is also where Browserify builds the client js file.

## Document masks

I've kept a backup of the document masks, used to define the document types in Prismic, as json files at the root of the project folder.

## Deployment

An automatic deployment has been setup with Heroku. When you push to the repo, Heroku will automatically deploy a new build. I've experienced that the deployment doesn't always trigger, so you might need to log in to Heroky and hit the Deploy button.

## Ideas for future development

**Cache busting**

Amazon CloudFront is used for distribution of the website. A better way of validating the cache would be beneficial for faster updating of the CloudFront distribution cache. A hash could be used for auto generating the names of the static assets. I'm not quite sure what would be the best way to handle changes in HTML pages.

**Backend**

The backend could be made a whole lot simpler by utilizing the document mask for automatic setup of the communication with Prismic. The backend would probably end up more rigid, but easier to maintain. You would only need to update the document mask at Prismic and at the backend.
