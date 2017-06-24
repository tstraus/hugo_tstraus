function generateEpisode() {
    var element = document.getElementById("output");
    var season = Math.floor((Math.random() * 15) + 1);
    var episodeNumbers = [18, 12, 24, 28, 25, 21, 24, 29, 22, 13, 8, 12, 8, 5, 14];
    var episode = Math.floor((Math.random() * (episodeNumbers[season - 1])) + 1);
    
    element.innerHTML = "Season " + season + ", Episode " + episode;
}

function generateEpisode() {
    var radios = document.getElementsByName("optionsRadios");
    var element = document.getElementById("output");

    var selection;
    var season;
    var episodeNumbers;
    var episode;

	for(var i = 0; i < radios.length; i++)
	{
   		if(radios[i].checked == true)
   		{
       		selection = radios[i].value;
   		}
 	}

    if (selection == "all")
    {
    	var min = 1;
    	var max = 15;
    	
		season = Math.floor((Math.random() * (max-min+1)) + min);
    	episodeNumbers = [18, 12, 24, 28, 25, 21, 24, 29, 22, 13, 8, 12, 8, 5, 14];
    	episode = Math.floor((Math.random() * (episodeNumbers[season - 1])) + 1);
    }

    else if (selection == "hulu")
    {
    	var min = 10;
    	var max = 16;
    	
		season = Math.floor((Math.random() * (max-min+1)) + min);
    	episodeNumbers = [18, 12, 24, 28, 25, 21, 24, 29, 22, 12, 10, 12, 8, 11, 8, 7];
    	episode = Math.floor((Math.random() * (episodeNumbers[season - 1])) + 1);
    }

 
    element.innerHTML = "Season " + season + ", Episode " + episode;
}