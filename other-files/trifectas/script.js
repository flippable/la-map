    var width, height;
          var viewportWidth = $(window.outerWidth)[0];
          // var viewportHeight = $(window.outerHeight)[0] / 2;
          console.log(viewportWidth);
          if (viewportWidth <= 767) {
            width = $(window).width();
            height = width/1.5;
          }
          else {
            // Need to play around with this
            if ($(window).width() > 800) {
              width = 700;
            }
            else {
              width = $(window).width() * .97;
            }
            height = width/1.5;
          }
          console.log('viewportWidth', viewportWidth, 'width', width);
    var _data = void 0;


var projection = d3.geo.albersUsa()
  .translate([width / 2, height / 2]) // translate to center of screen
  .scale([900]); // scale things down so see entire US

var path = d3.geo.path()
  .projection(projection);

// Define linear scale for output
// var color = d3.scale.linear()
//   .range(["rgb(213,222,217)", "rgb(69,173,168)", "rgb(84,36,55)", "rgb(217,91,67)"]);

// var legendText = ["Cities Lived", "States Lived", "States Visited", "Nada"];


var svg = d3.select("body")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

// Append Div for tooltip to SVG
var div = d3.select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

// svg.append("rect")
svg.append("div")
  .attr("class", "background")
  .attr("width", width)
  .attr("height", height);
//    .on("click", clicked);

//Vector group
var vectors = svg.append("g")
  .attr("class", "polygon");

//Overlay
vectors.append("rect")
  .attr("class", "overlay")
  .attr("width", width)
  .attr("height", height);

//Define 'div' for tooltips
var tip = d3.tip()
  .attr("class", "d3-tip")
  .direction("c");
vectors.call(tip);

var previewTip = d3.tip()
  .attr("class", "d3-preview-tip")
  .direction("c");
vectors.call(previewTip);

// //Vector polygons
// var vectors0 = vectors.append("g");
// var vector0 = void 0;

var g = svg.append("g");

d3.json("us.json", function(unitedState) {
  var data = topojson.feature(unitedState, unitedState.objects.states).features;
  console.log('geojson: ', data);
  d3.csv("us-state-names.csv", function(statesData) {
    console.log('statesData: ', statesData);
    var names = {};
    data.forEach(function(d, i) {
      statesData.forEach(function(f, i) {
        if (f.id == d.id) {
          names[d.id] = f.code;
          d.properties = f;
        }
      });
    });
    console.log(data);

    // var object0 = data;
    var previewTemplate = document.getElementById("flippable").innerHTML;

    g.append("g")
      .attr("class", "states-bundle")
      .selectAll("path")
      .data(data)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("stroke", "white")
      .attr("fill", function(d) {
        // console.log(d);
        if (d.properties.trifecta == 'Democratic Trifecta') {
          return "blue";
        } else if (d.properties.trifecta == 'Republican Trifecta') {
          return "red";
        } else {
          return "grey";
        }
      })
      .attr("class", "states")
      .on("mouseover", function(d) {
        var obj = _.findWhere(data, {
          id: d.id
        });
        console.log(obj);
        console.log(d);
        var thisColor;
          if (d.properties.trifecta == 'Democratic Trifecta') {
            thisColor = "blue";
          } else if (d.properties.trifecta == 'Republican Trifecta') {
            thisColor = "red";
          } else {
            thisColor = "grey";
          }
        previewTip.html(infoMore(obj, previewTemplate));
        tip.attr('class', 'd3-tip').hide();
        return previewTip.show(d)
        .attr('class', 'd3-preview-tip animate ' + d.properties.d3Css)
        .style('color', thisColor);
      })
      .on("mouseout", function (d) { return previewTip.attr('class', 'd3-preview-tip').hide(); });
      // .on("click", function (d) { var obj = _.findWhere(_data, {OBJECTID: d.properties.OBJECTID.toString()}); console.log(obj); window.open(obj.cand_url,'_blank'); });

    // g.append("g")
    //   .attr("class", "states-names")
    //   .selectAll("text")
    //   .data(data)
    //   .enter()
    //   .append("svg:text")
    //   .text(function(d) {
    //     // console.log(d);
    //     return names[d.id];
    //   })
    //   .attr("x", function(d) {
    //     if (path.centroid(d)[0]) {
    //       return path.centroid(d)[0];
    //     }
    //   })
    //   .attr("y", function(d) {
    //     if (path.centroid(d)[1]) {
    //       return path.centroid(d)[1];
    //     }
    //   })
    //   .attr("text-anchor", "middle")
    //   .attr('fill', 'white');

    function infoMore(obj, template) {

      Object.keys(obj).forEach(function(key) {
        if (key == 'properties') {
          Object.keys(obj[key]).forEach(function(meow) {
            template = template.replace("{" + meow + "}", obj[key][meow]);
          });
        }
      });

      return template;
    }

  });
});