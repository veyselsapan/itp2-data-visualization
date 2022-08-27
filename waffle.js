function Waffle()
{
  // Name for the visualisation to appear in the menu bar.
  this.name = 'Yeme Aliskanliklari';

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = 'yeme aliskanliklari';

  // Property to represent whether data has been loaded.
  this.loaded = false;

  // Preload the data. This function is called automatically by the
  // gallery when a visualisation is added.
  this.preload = function() {
    var self = this;
    this.data = loadTable(
      './data/yeme_aliskankliklari/finalData.csv', 'csv', 'header',
      // Callback function to set the value
      // this.loaded to true.
      function(table) {
        self.loaded = true;
      });
  };
    
    
    var days = ["Pazartesi", "Sali", "Carsamba", "Persembe", "Cuma", "Cumartesi", "Pazar"];

	var values = ['yemek yemem', 'paket servis', 'disrida yemek', 'hazir yemek', 'kalanlar', 'taze pismis'];

    var x = 150;
    var y = 30;
    var height = 200;
    var width = 200;
    var boxes_down = 10;
    var boxes_across = 10;
    var column = [];
    var possibleValues = values;
    var colours = ["red", "green", "blue", "purple", "yellow", "orange"];
    var categories = [];
    var boxes = [];
    
    this.setup = function() {
        
        if (!this.loaded) {
          console.log('Data not yet loaded');
          return;
        }
        
        
        for(var i = 0; i < days.length; i++)
        {
            column.push(this.data.getColumn(days[i]));
        }
        for(var i = 0; i < days.length; i++)
        {
            categories.push([]);
        }
        console.log(categories)
        addCategories();
        addBoxes();

  };
        

    this.destroy = function() 
    {
        
    };
    
    function categoryLocation(categoryName)
    {
        for(var j = 0; j < categories.length; j++)
        {
            for(var i = 0; i < categories[j].length; i++)
            {
                if(categoryName == categories[j][i].name)
                {
                    return i;
                }
            }
            return -1;
        }
        
    }
    
    
    function addCategories()
    {
        for(var j = 0; j < categories.length; j++)
        {
            for(var i = 0; i < possibleValues.length; i++)
            {
                categories[j].push({"name" : possibleValues[i], "count" : 0, "colour" : colours[i % colours.length]});
            }
            
            for (var i = 0; i < column[j].length; i++)
            {
                var catLocation = categoryLocation(column[j][i]);
                if(catLocation != -1)
                {
                    categories[j][catLocation].count++;
                }
            }
            
            //iterate over the categories and add proportions
            for(var i = 0; i < categories[j].length; i++)
            {
                categories[j][i].boxes = round((categories[j][i].count/column[i].length)*(boxes_down * boxes_across));
            }
        }
    }

    function addBoxes()
    {
        var currentCategory = 0;
        var currentCategoryBox = 0;
        var boxWidth = width / boxes_across;
        var boxHeight = height / boxes_down;
        
        for(var t = 0; t < categories.length; t++)
        {
            boxes.push([]);
            for(var i = 0; i < boxes_down; i++)
            {
                boxes[t].push([]);
                for(var j = 0; j < boxes_across; j++)
                {
                    if(currentCategoryBox == categories[t][currentCategory].boxes)
                    {
                        currentCategoryBox = 0;
                        currentCategory++;
                    }
                    if(t < 4)
                    {
                        boxes[t][i].push(new Box((x + t*220) + (j * boxWidth), y + (i * boxHeight), boxWidth, boxHeight, categories[t][currentCategory]));
                    }
                    else
                    {
                        boxes[t][i].push(new Box(((x+120) + (t-4)*220) + (j * boxWidth), (y+250) + (i * boxHeight), boxWidth, boxHeight, categories[t][currentCategory]));
                    }
                    
                    currentCategoryBox++;
                }
            }
        }
        

    }
    
    
    this.draw = function()
    {
        if (!this.loaded) 
        {
        console.log('Data not yet loaded');
        return;
        }
        //draw waffle diagram
        this.draw = function()
        {
            for(var i = 0; i < boxes.length; i++)
            {
                for(var j = 0; j < boxes[i].length; j++)
                {
                    for(var t = 0; t < boxes[i][j].length; t++)
                    {
                        boxes[i][j][t].draw();
                    }
                    
                }
            }
        }
        this.checkMouse = function(mouseX, mouseY)
        {
            for(var i = 0; i < boxes.length; i++)
            {
                for( var j = 0; j < boxes[i].length; j++)
                {
                    var mouseOver = boxes[i][j].mouseOver(mouseX, mouseY);
                    if(mouseOver != false)
                    {
                        push();
                        fill(0);
                        textSize(20);
                        var tWidth = textWidth(mouseOver);
                        textAlign(LEFT, TOP);
                        rect(mouseX, mouseY, tWidth + 20, 40);
                        fill(255);
                        text(mouseOver, mouseX + 10, mouseY + 10);
                        pop();
                        break;
                    }
                }
            }
        }
    }
    function Box(x, y, width, height, category){

        var x = x;
        var y = y;
        var height;
        var width;
        this.category = category;
        this.mouseOver = function(mouseX, mouseY)
        {
            if(mouseX > x && mouseX < x + width && mouseY > y && mouseY < y + height)
            {
                return this.category.name;
            }
            return false;
        }
        this.draw = function()
        {
            fill(category.colour);
            rect(x, y, width, height);
        }
    }
}