function MapGrid(tiles) {
    this.tiles = tiles;
  }
  
  MapGrid.prototype = {
    getHeight: function() {
      return this.tiles.length;
    },
    getWidth: function() {
      return this.tiles[0].length;
    },
    getTileColor: function(x, y) {
      if (x < 0 || y < 0) return -1;
      if (y >= this.getHeight()) return -1;
      if (x >= this.getWidth()) return -1;
      return this.tiles[y][x];
    },
    setTileColor: function(x, y, c) {
      if (x < 0 || y < 0) return;
      if (y >= this.getHeight()) return;
      var row = this.tiles[y];
      if (x >= row.length) return;
      this.tiles[y][x] = c;
    },
    getMapTable: function() {
      var htm = '<table><tbody>';
      for (var y = 0; y < this.tiles.length; ++y) {
        var row = this.tiles[y];
        htm += '<tr>'
        for (var x = 0; x < row.length; ++x) {
          var color = this.getTileColor(x, y);
          htm += '<td class="m' + color + '"></td>';
        }
        htm += '</tr>';
      }
      htm += '</tbody></table>';
      return htm;
    },
    clone: function() {
      var clonedTiles = [];
      for (var y = 0; y < this.tiles.length; ++y) {
        var clonedRow = [];
        for (var x = 0; x < this.tiles[y].length; ++x) {
          clonedRow.push(this.tiles[y][x]);
        }
        clonedTiles.push(clonedRow);
      }
      return new MapGrid(clonedTiles);
    }
  }
  
  
  
  /**
   * elementary recursive floodfill algorithm (use a non-recursive version for large maps!)
   * @param map the MapGrid instance to floodfill
   * @param x the x coord of tile to flood fill from
   * @param y the y coord of tile to flood fill from
   * @param colorToReplace the target color we're looking to fill
   * @param colorToUse the color to fill with
   */
  function floodfill(map, x, y, colorToReplace, colorToUse) {
    if (x < 0 || x >= map.width) return;
    if (y < 0 || y >= map.height) return;
    var tileColor = map.getTileColor(x, y);
    if (tileColor === colorToUse) return;
    if (tileColor !== colorToReplace) return;
    map.setTileColor(x, y, colorToUse);
    floodfill(map, x, y - 1, colorToReplace, colorToUse); //floodfill tile to North
    floodfill(map, x - 1, y, colorToReplace, colorToUse); //floodfill tile to the West
    floodfill(map, x + 1, y, colorToReplace, colorToUse); //floodfill tile to the East
    floodfill(map, x, y + 1, colorToReplace, colorToUse); //floodfill tile to the South   
  }
  
  /**
   * displays map in div with the supplied id
   * @param mapDivId id of the div to draw the map in
   * @param mapToDraw MapGrid instance to be drawn
   */
  function drawMap(mapDivId, mapToDraw) {
    var mapdiv = document.getElementById(mapDivId);
    mapdiv.innerHTML = mapToDraw.getMapTable();
  }
  
  /**
   * shows the specified count in div with the supplied id
   * @param counterDivId id of the div to show the count in
   * @param count the count to display
   */
  function updateCounter(counterDivId, count) {
    var counterdiv = document.getElementById(counterDivId);
    counterdiv.innerHTML = `COUNTRIES COUNTED: <span class='countryCount'>${count}</span>`;
  }
  
  
  // Initialise our map here (NB. map must have the same number of entries in every row)
  var tiles = [
    [1, 3, 3, 3, 4, 4, 1],
    [1, 2, 2, 2, 1, 1, 1],
    [1, 2, 2, 3, 3, 1, 1],
    [1, 3, 2, 4, 3, 1, 4],
    [4, 3, 2, 2, 3, 4, 4],
    [2, 1, 4, 4, 2, 2, 2],
    [2, 1, 4, 4, 3, 3, 1],
    [2, 2, 1, 1, 2, 2, 1]
  ]
  var testMap = new MapGrid(tiles);
  
  /**
   * method that performs the floodfilling process as explained in the pseudo code on Stack Overflow
   * https://stackoverflow.com/a/26770683/3651800
   */
  function countCountries() {
    // we first make a deep clone of our map so that the floodfilling doesn't overwrite the countries in our map!
    var map = testMap.clone();
    var numberOfCountries = 0;
    for (var x = 0; x < map.getWidth(); ++x) {
      for (var y = 0; y < map.getHeight(); ++y) {
        var countryColor = map.getTileColor(x, y);
        // only floodfill a country if it hasn't yet been visited
        if (countryColor !== VISITED_COLOR) {
          numberOfCountries++;
          floodfill(map, x, y, countryColor, VISITED_COLOR);
        }
      }
    }
    // update our display of the country count:
    updateCounter('counter', numberOfCountries);
  }
  
  /**
   * method that shows a visual representation of the floodfilling process
   * uses setInterval and unrolls the nested loops so that the webpage updates between fills 
   * - ugly and inefficient code, but allows me to demonstrate visually the way the algorithm works
   */
  function countCountriesShowingWorking() {
  
    // disable buttons whilst the algorithm executes
    document.getElementById('countButton').disabled = true;
    document.getElementById('showWorkingButton').disabled = true;
  
    // deep clone our map so that the floodfilling doesn't overwrite our countries:
    var floodfillMap = testMap.clone();
    var x = 0;
    var y = 0;
    var numberOfCountries = 0;
    var myInterval = window.setInterval(function() {
      if (x < floodfillMap.getWidth()) {
        var countryColor = floodfillMap.getTileColor(x, y);
        if (countryColor !== VISITED_COLOR) {
          numberOfCountries++;
          floodfill(floodfillMap, x, y, countryColor, VISITED_COLOR);
          drawMap('map', floodfillMap);
          updateCounter('counter', numberOfCountries);
        } 
      }
      x++;
      if (x >= floodfillMap.getWidth()) {
        x = 0;
        y++;
      }
      if (y >= floodfillMap.getHeight()) {
        // we're done, cease updating, redraw our original map and reenable our buttons
        window.clearInterval(myInterval);
        drawMap('map', testMap);
        document.getElementById('countButton').disabled = false;
        document.getElementById('showWorkingButton').disabled = false;
      }
    }, 125);
  }
  
  // draw the first view of the map
  drawMap('map', testMap);
  
  // wire-up button handlers
  document.getElementById('countButton').addEventListener("click", countCountries);
  document.getElementById('showWorkingButton').addEventListener("click", countCountriesShowingWorking);