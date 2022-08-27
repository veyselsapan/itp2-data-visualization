function LandUsage() {

  // Name for the visualisation to appear in the menu bar.
  this.name = 'Turkey Land Usage';

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = 'turkey-land-usage';

  // Property to represent whether data has been loaded.
  this.loaded = false;

  // Preload the data. This function is called automatically by the
  // gallery when a visualisation is added.
  this.preload = function() 
  {
    var self = this;
    this.data = loadTable(
      './data/land-usage/turkey-land-usage.csv', 'csv', 'header',
      // Callback function to set the value
      // this.loaded to true.
      function(table) {
        self.loaded = true;
      });
  };

  this.setup = function() 
  {
    if (!this.loaded) {
      console.log('Data not yet loaded');
      return;
    }

    // Create a select DOM element.
    this.select = createSelect();
    this.select.position(350, 40);

    // Fill the options with all company names.
    var towns = this.data.columns;
    // First entry is empty.
    for (let i = 1; i < towns.length; i++) {
      this.select.option(towns[i]);
    }
  };

  this.destroy = function() {
    this.select.remove();
  };

  // Create a new pie chart object.
  this.pie = new PieChart(width / 2, height / 2, width * 0.4);

  this.draw = function() {
    if (!this.loaded) {
      console.log('Data not yet loaded');
      return;
    }

    // Get the value of the company we're interested in from the
    // select item.
    var townName = this.select.value();

    // Get the column of raw data for companyName.
    var col = this.data.getColumn(townName);

    // Convert all data strings to numbers.
    col = stringsToNumbers(col);

    // Copy the row labels from the table (the first item of each row).
    var labels = this.data.getColumn(0);

    // Colour to use for each category.
    var colours = ['#00FFFF', '#0000FF', '#008B8B', '#B8860B', '#006400', '#8B008B', '#00BFFF', '#FFD700', '#4B0082', '#00FF00', '#191970', '#FF0000'];

    // Make a title.
    var title = 'Turkey land usage by ' + townName;

    // Draw the pie chart!
    this.pie.draw(col, labels, colours, title);
  };
}
