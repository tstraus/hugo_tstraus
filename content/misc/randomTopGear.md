+++
Categories = []
Description = ""
Tags = []
date = "2016-05-21T09:30:29-04:00"
title = "Random Top Gear UK Episode Generator"

+++

<button class="pure-button" onclick="generateEpisode()">Generate</button>
<label for="all" class="pure-radio">
    <input id="all" type="radio" name="optionsRadios" value="all" checked>
        All episodes
</label>
<label for="hulu" class="pure-radio">
    <input id="hulu" type="radio" name="optionsRadios" value="hulu">
        Hulu only
</label>
<label for="netflix" class="pure-radio">
    <input id="netflix" type="radio" name="optionsRadios" value="netflix">
        Netflix only
</label>
<h4 class="ouput" id="output"></h4>

<link rel="stylesheet" href="http://yui.yahooapis.com/pure/0.6.0/pure-min.css">

<script src="../../scripts/randomTopGear.js" type="text/javascript"></script>