var Twit = require('twit')

var fs = require('fs'),
    path = require('path');
    Twit = require('twit'),
    config = require(path.join(__dirname, 'config.js'));
var T = new Twit(config);

//Delay between posts
var post_delay = 60000



//Random image from current folder
function random_from_array(images){
  return images[Math.floor(Math.random() * images.length)];
}


function fetch_caption(image_name) {
    // Image metadata, such as captions
    var metadata = JSON.parse(fs.readFileSync(path.join(__dirname, 'metadata.json')));
    
    var image_metadata = metadata[image_name];
    return image_metadata ? image_metadata.caption : undefined;
}

//This function call now recieves a current folder argument
//so it can select the image from the working direcory with path.join

function upload_random_image(images, current_folder){
  console.log('Opening an image...');
  var posted = random_from_array(images);


  var image_path = path.join(__dirname, current_folder + posted),
      b64content = fs.readFileSync(image_path, { encoding: 'base64' });

  var caption = fetch_caption(posted);

  T.post('media/upload', { media_data: b64content }, function (err, data, response) {
    if (err){
      console.log('ERROR:');
      console.log(err);
    }
    else{
      console.log('Image uploaded!');
      console.log('Now tweeting it...');

      T.post('statuses/update', {
        status: caption,
        media_ids: new Array(data.media_id_string)
      },
        function(err, data, response) {
          if (err){
            console.log('ERROR:');
            console.log(err);
          }
          else{
            console.log('Posted an image!');
          }
        }
      );
    }
  });

    return posted;

}





//Always assumes the first folder with all the images will be /images/
//It will keep running even if you add images BUT IT WILL OVERWRITE FILES WITH THE SAME NAME IGNORING SIZE OR DATE


var current_folder = '/images1/';
var empty_folder = '/images2/';


//If /images2/ has the bookmark file start posting from there instead
if(fs.existsSync(__dirname + empty_folder + '.bookmark'))
{
	console.log('Found .bookmark starting at folder 2 instead' );
	var temp = current_folder;
	current_folder = empty_folder;
	empty_folder = temp;
}


//Populates and returns an array with the images in the current directory
function populate(current_folder)
{

	var images = []
	var files = fs.readdirSync(__dirname + current_folder);
	var to_move;
	for (var f in files) {

		//Only add to array if the file is not the bookmark
		if( !(files[f] === '.bookmark') )
		{
			images.push(files[f]);
		}
	}
	return images;
}


//Adds bookmark to /images2/ if the bot is posting from this folder, removes it otherwise
function handle_bookmark(current_folder)
{
	if(current_folder === '/images2/')
	{
		fs.writeFileSync(__dirname + current_folder + '.bookmark', '1');
	}
	else
	{


		if(fs.existsSync(__dirname + '/images2/' + '.bookmark'))
		{
		fs.unlinkSync(__dirname + '/images2/' + '.bookmark');
		}
	}

}


setInterval(function(){


	//Read the directory on each pass
	var images = populate(current_folder);

	//Change folders if the size of the array is 0
	if(images.length !=0)
	{
		 to_move = upload_random_image(images, current_folder);
		 fs.renameSync(__dirname + current_folder + to_move, __dirname + empty_folder + to_move);

	}
	else
	{
		var temp = current_folder;
		current_folder = empty_folder;
		empty_folder = temp;



		 //Handle the bookmark after the directory change
		 handle_bookmark(current_folder);

		 //Array has to be updated to reflect dir change
		 var images = populate(current_folder);

		 //Post after dir change
		 to_move = upload_random_image(images, current_folder);
		 fs.renameSync(__dirname + current_folder + to_move, __dirname + empty_folder + to_move);



	}




}, post_delay);

