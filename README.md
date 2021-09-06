# twitter-image-bot
A bot for Twitter that will post a random image from a local folder

# How to Setup
1. Install [Node.Js](https://nodejs.org/en/download/)
2. ```cd``` to the extracted twitter-image-bot folder you downloaded
3. Install node with ```npm install```
4. Edit ```config.js``` and add your Twitter developer credentials which you can get [here](https://developer.twitter.com/en/portal/dashboard)
5. In ```server.js``` edit ```var post_delay =``` to how many ms you want between posts.
6. Start by running ```node server.js```

- If you wish to caption the images with text, you can edit ```metadata.json```

# How it works
After the post delay, the bot will look at ```images1``` pick a random image and post it to Twitter.

After posting the image, it will move that image into ```images2``` so that it will not be picked again.

After ```images1``` folder is exausted a ```.bookmark``` file will be created in ```images2```

The bot will look at ```images2``` to pick a random image to post to Twitter as long as the ```.bookmark``` file exists.

After posting an image from ```images2``` it will move the image to ```images1``` so it is not picked again.

Once ```images2``` is exausted of images, the ```.bookmark``` file will be deleted, thus the bot will look to ```images1``` again for images to post to Twitter.

# Run Using docker
1. Install [Docker](https://docs.docker.com/get-docker/)
2. ```cd``` to the extracted twitter-image-bot folder you downloaded.
3. Edit ```config.js``` and add your Twitter developer credentials which you can get [here](https://developer.twitter.com/en/portal/dashboard)
4. In ```server.js``` edit ```var post_delay =``` to how many ms you want between posts.
5. Build your docker image ```docker build -t reponame/twitter-image-bot . --no-cache```
6. Deploy your new container 
```bash
docker run -d \
--name=twitter-image-bot \
-v /opt/twitter-image-bot/images1:/images1 \
-v /opt/twitter-image-bot/images2:/images1 \
--restart unless-stopped \
reponame/twitter-image-bot:latest
```

- If you dont want your images to be mounted to the host remove the `-v` flags


# Hopes for the future
Video files will crash the bot currently. I hope I can use the bot to post video files in the future.
