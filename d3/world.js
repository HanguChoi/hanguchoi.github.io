const World = () => {

  let svg;
  let totalDeaths = [];
  let totalDeathsPerMillion = [];
  let totalCases = [];
  let totalCasesPerMillion = [];
  let totalVaccinations = [];
  let totalVaccinationsPerHundred = [];

  const PromiseWrapper = (opts) => {
    return new Promise(resolve => {
      opts.resolver(resolve, opts);
    });
  };

  const DataLoader = (resolve, opts) => {
    fetch(opts.url)
      .then(response => {
        resolve(response.json());
      })
  };

  const prepareData = (countries, covid) => {
    let countryNames = countries.features.map(c => c.id);
    totalDeaths = [];
    totalDeathsPerMillion = [];
    totalCases = [];
    totalCasesPerMillion = [];
    totalVaccinations = [];
    totalVaccinationsPerHundred = [];
  
    for (const country in covid) {
      if (countryNames.includes(country)){
        totalDeaths.push(covid[country].total_deaths);
        totalDeathsPerMillion.push(covid[country].total_deaths_per_million);
        totalCases.push(covid[country].total_cases);
        totalCasesPerMillion.push(covid[country].total_cases_per_million);
        totalVaccinations.push(covid[country].total_vaccinations);
        totalVaccinationsPerHundred.push(covid[country].total_vaccinations_per_hundred);
      }
    }
  }

  const thresholdScaler = (arr, colorClass) => {

    const makeThresholdDomain = (arr) => {
      const min = d3.min(arr);
      const max = d3.max(arr);
      const mid = d3.median(arr);

      return [
        // min, 
        // d3.median([min, mid]), 
        // mid, 
        // d3.median([mid, max]), 
        // max
        Math.round(min), 
        Math.round(d3.median([min, mid])), 
        Math.round(mid), 
        Math.round(d3.median([mid, max])), 
        Math.round(max)
      ];
    }
    
    const scale = () => {
      const domain = makeThresholdDomain(_arr);

      return d3.scaleThreshold()
        .domain(domain)
        .range(d3.range(5).map(function(i) { return `${colorClass} q${(i+1)}-5`; }));
    }

    const legend = (title) => {
      return d3.legendColor()
        .labelFormat(d3.format(",d"))
        .title(title)
        .titleWidth(200)
        .labels(d3.legendHelpers.thresholdLabels)
        .useClass(true)
        .scale(_scale)
    }

    let _arr = arr;
    let _scale = scale();

    return {
      scale: _scale,
      legend: legend
    }
  }

  const totalDeathVisualizer = () => {
    const scaler = thresholdScaler(totalDeaths, '');
    const scale = (countryCovid) => {
      return scaler.scale(countryCovid.total_deaths);
    }

    return {
      scale: scale,
      legend: () => scaler.legend('Total Death') 
    }
  }
  const totalDeathPerMillionVisualizer = () => {
    const scaler = thresholdScaler(totalDeathsPerMillion, '');
    const scale = (countryCovid) => {
      return scaler.scale(countryCovid.total_deaths_per_million);
    }

    return {
      scale: scale,
      legend: () => scaler.legend('Total Death /M')
    }
  }
  const totalCaseVisualizer = () => {
    const scaler = thresholdScaler(totalCases, 'o');
    const scale = (countryCovid) => {
      if (countryCovid === 0){
        return 'o';
      }
      return `o ${scaler.scale(countryCovid.total_cases)}`;
    }

    return {
      scale: scale,
      legend: () => scaler.legend('Total Cases')
    }
  }
  const totalCasePerMillionVisualizer = () => {
    const scaler = thresholdScaler(totalCasesPerMillion, 'o');
    const scale = (countryCovid) => {
      if (countryCovid === 0){
        return 'o';
      }
      return `o ${scaler.scale(countryCovid.total_cases_per_million)}`;
    }

    return {
      scale: scale,
      legend: () => scaler.legend('Total Cases /M')
    }
  }
  const totalVaccinationsVisualizer = () => {
    const scaler = thresholdScaler(totalVaccinations, 'g');
    const scale = (countryCovid) => {
      if (countryCovid === 0){
        return 'g';
      }
      return `g ${scaler.scale(countryCovid.total_vaccinations)}`;
    }
  
    return {
      scale: scale,
      legend: () => scaler.legend('Total Vaccinations')
    }
  }
  const totalVaccinationsPerHundredVisualizer = () => {
    const scaler = thresholdScaler(totalVaccinationsPerHundred, 'g');
    const scale = (countryCovid) => {
      if (countryCovid === 0){
        return 'g';
      }
      return `g ${scaler.scale(countryCovid.total_vaccinations_per_hundred)}`;
    }

    return {
      scale: scale,
      legend: () => scaler.legend('Total Vaccinations Per Hundred')
    }
  }
 
  const createMap = (countries, covid) => {
    var MAP_TRANSLATE = [440, 340];
    var MAP_SCALE = 140;
    var projection = d3.geoMercator()
          .rotate([-150,0])
          .scale(MAP_SCALE).translate(MAP_TRANSLATE);
    var geoPath = d3.geoPath().projection(projection);
    
    svg.selectAll("path")
      .data(countries.features)
      .enter()
      .append("path")
        .attr("d", geoPath)
        .attr("id", d => d.id)
        .attr("class", "country");

    // zoom   
    var mapZoom = d3.zoom().on("zoom", zoomed);
    var zoomSettings = d3.zoomIdentity
      .translate(MAP_TRANSLATE[0], MAP_TRANSLATE[1])
      .scale(MAP_SCALE);

    svg.call(mapZoom).call(mapZoom.transform, zoomSettings);

    function zoomed() {
      var e = d3.event;
      projection.translate([e.transform.x, e.transform.y])
        .scale(e.transform.k);
      d3.selectAll("path.country").attr("d", geoPath);
    }

    d3.select("#world-wrap .buttons")
      .append("button")
        .attr("name", "totalDeath").text("Total Death")
        .on("click", () => { vizLayer(totalDeathVisualizer(), covid); });

    d3.select("#world-wrap .buttons")
      .append("button")
        .attr("name", "totalDeathPerMillion").text("Total Death /M")
        .on("click", () => { vizLayer(totalDeathPerMillionVisualizer(), covid); });

    d3.select("#world-wrap .buttons")
      .append("button")
        .attr("name", "totalCase").text("Total Case").attr("class", "o")
        .on("click", () => { vizLayer(totalCaseVisualizer(), covid); });

    d3.select("#world-wrap .buttons")
      .append("button")
        .attr("name", "totalCasePerMillion").text("Total Case /M").attr("class", "o")
        .on("click", () => { vizLayer(totalCasePerMillionVisualizer(), covid); });

    d3.select("#world-wrap .buttons")
      .append("button")
        .attr("name", "totalVaccinations").text("Total Vaccinations").attr("class", "g")
        .on("click", () => { vizLayer(totalVaccinationsVisualizer(), covid); });
        
    d3.select("#world-wrap .buttons")
      .append("button")
        .attr("name", "totalVaccinationsPerHundred").text("Total Vaccinations Per Hundred").attr("class", "g")
        .on("click", () => { vizLayer(totalVaccinationsPerHundredVisualizer(), covid); });
  }

  const vizLayer = (vizer, covid) => {
    svg.append("g")
      .attr("class", "legend")
      .attr("transform", "translate(590,450)");

    svg.select(".legend")
      .call(vizer.legend());

    svg.selectAll("path.country")
      .attr("class", d => {
        const countryCovid = covid[d.id];
        if (!countryCovid){
          return `country ${vizer.scale(0)} q1-5`;
        }
        return `country ${vizer.scale(countryCovid)}`;
      })
      .on("click", d => {
        const countryCovid = covid[d.id];
        if (!countryCovid){
          return;
        }

        d3.select("#world-wrap .desc").html(null);
        
        const descHtml = `
          <h4>${d.properties.name}</h4>\
          <p>Data Date: ${countryCovid.date}</p>\
          <p>Total Death: ${countryCovid.total_deaths}</p>\
          <p>Total Cases: ${countryCovid.total_cases}</p>\
          <p>Total Vaccinations: ${countryCovid.total_vaccinations}</p>\
          <p>Total Hospital Patients: ${countryCovid.hosp_patients}</p>\
          <p>Total Hospital Patients / M: ${countryCovid.hosp_patients_per_million}</p>\
          <p>Total ICU Patients: ${countryCovid.hosp_patients}</p>\
          <p>Total ICU Patients / M: ${countryCovid.icu_patients_per_million}</p>\
        `;

        d3.select("#world-wrap .desc")
          .append("text")
          .style("text-anchor", "middle")
          .style("fill", "#4f442b")
          .html(descHtml);
        
      });
  }

  const viz = (countries, covid) => {
    svg = d3.select("#world-wrap svg");

    createMap(countries, covid);
    prepareData(countries, covid);

    vizLayer(totalDeathVisualizer(), covid);
  }

  const start = async () => {
 
    /* Covid data comes from https://github.com/owid/covid-19-data/tree/master/public/data */
    const data = await Promise.all([
      PromiseWrapper({ resolver: DataLoader, url: "/d3/data/world.geojson" }),
      PromiseWrapper({ resolver: DataLoader, url: "/d3/data/covid.json" })
    ]);

    viz(data[0], data[1]); 

  };

  return {
    start: start
  }
};
