function generateEpisode() {
    var radios = document.getElementsByName("optionsRadios");
    var element = document.getElementById("output");

    var selection;
    var season;
    var episodeNumbers;
    var episode;

	for (var i = 0; i < radios.length; i++)
	{
   		if (radios[i].checked == true)
   		{
       		selection = radios[i].value;
   		}
 	}

    if (selection == "all")
    {
    	var min = 1;
    	var max = 24;

		season = Math.floor((Math.random() * (max-min+1)) + min);
    	episodeNumbers = [10, 10, 9, 10, 9, 11, 7, 8, 6, 10, 6, 8, 7, 7, 6, 8, 6, 8, 7, 6, 7, 10, 6, 7];
    	episode = Math.floor((Math.random() * (episodeNumbers[season - 1])) + 1);
    }

    else if (selection == "amazon")
    {
    	var min = 2;
    	var max = 17;

		season = Math.floor((Math.random() * (max-min+1)) + min);
    	episodeNumbers = [10, 10, 9, 10, 9, 11, 7, 8, 6, 10, 6, 8, 7, 7, 6, 8, 6, 8, 7, 6, 7, 10, 6, 7];
    	episode = Math.floor((Math.random() * (episodeNumbers[season - 1])) + 1);
    }

    else if (selection == "netflix")
    {
    	var min = 19;
    	var max = 23;

		season = Math.floor((Math.random() * (max-min+1)) + min);
    	episodeNumbers = [10, 10, 9, 10, 9, 11, 7, 8, 6, 10, 6, 8, 7, 7, 6, 8, 6, 8, 7, 6, 7, 10, 6, 7];
    	episode = Math.floor((Math.random() * (episodeNumbers[season - 1])) + 1);
    }

    element.innerHTML = "Season " + season + ", Episode " + episode;
}
