const Felidae = () => {

  const FELIDAE_KEY = '9703';

  const PromiseWrapper = (opts) => {
    return new Promise(resolve => {
      opts.resolver(resolve, opts);
    });
  };

  const download = (content, fileName, contentType) => {
    var a = document.createElement("a");
    var file = new Blob([JSON.stringify(content)], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
  };

  /* This code is here to show how data collected. */
  const downloadFelidaeData = async () => {
      // Start from `Felidae`
      const url = `https://api.gbif.org/v1/species/${FELIDAE_KEY}/children?rank=GENUS&limit=100&offset=0`;
      const falidaeData = await PromiseWrapper({
        resolver: getChildrenWithImages,
        parent: FELIDAE_KEY,
        url: url,
        nested: true,
        slice: 7
      })

      download(falidaeData, 'felidae.json',  'text/plain');
  };

  const imageFetcher = (resolve, opts) => {
    fetch(opts.url)
      .then(response => response.json())
      .then(json => {
        const imageUrls = json.results.filter(r => r.media[0].identifier !== undefined).slice(0, 5).map(r => {
          return `https://api.gbif.org/v1/image/unsafe/fit-in/500x/${r.media[0].identifier}`; 
        });

        resolve({ key: opts.key, urls: imageUrls });
    });
  };
  
  const getChildrenWithImages = async (resolve, opts) => {
    const result = await fetch(opts.url).then(response => response.json());

    let children = result.results;
    if (opts.nested){
      children = result.results.filter(r => r.numDescendants > 10);
    }

    const imageFetchers = children.map(c => PromiseWrapper({
        resolver: imageFetcher,
        key: c.key,
        url: `https://api.gbif.org/v1/occurrence/search?limit=10&media_type=stillImage&taxon_key=${c.key}`
      }));
    const imageUrls = await Promise.all(imageFetchers);
      

    let descendants = [];
    if (opts.nested){
      const descendantsFetchers = children.map(c => PromiseWrapper({
        resolver: getChildrenWithImages,
        parent: c.key,
        url: `https://api.gbif.org/v1/species/${c.key}/children?rank=SPECIES&limit=100&offset=0`,
        nested: false
      }));
      descendants = await Promise.all(descendantsFetchers);
    } 

    const vernacularName = (data) => data.vernacularName ? ` (${data.vernacularName})` : '';

    children = children.map(c => {
      return {
        key: c.key, 
        rank: c.rank, 
        name: `${c.canonicalName} ${vernacularName(c)}`,
        vernacularName: c.vernacularName, 
        canonicalName: c.canonicalName, 
        images: imageUrls.filter(o => o.key.toString() == c.key.toString())[0].urls,
        values: opts.nested ? descendants.filter(d => d.parent.toString() == c.key.toString())[0].children : []
      }
    }).filter(c => c.images[0] !== undefined).slice(0, (opts.slice || 7));
    
    resolve({ parent: opts.parent, children: children });
  };
  
  const viz = (data) => {
    const onCircleClick = (d)=> {
      const descHtml = `
        <div>
          <h2>${d.data.name}</h2>
          <p><span class="rank ${d.data.rank.toLowerCase()}">${d.data.rank}</span></p>
        </div>
      `; 

      d3.select("#felidae-wrap .desc-wrap").html(null);
      d3.select("#felidae-wrap .desc-wrap")
        .append("div")
          .attr("class", "desc")
          .html(descHtml);

      d3.select("#felidae-wrap .desc-wrap")    
        .selectAll("img")
        .data(d.data.images)
        .enter()
        .append("img")
          .attr("src", imgUrl => imgUrl);
    }


    var felidae = { 
      key: FELIDAE_KEY,
      name: "Felidae", 
      canonicalName: "Felidae", 
      vernacularName: 'cats',
      rank: 'FAMILY',
      images: [
        'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/The_Felidae.jpg/600px-The_Felidae.jpg'
      ],
      values: data.children 
    };
    
    var root = d3.hierarchy(felidae, d => d.values );
    
    var treeChart = d3.tree()
      .nodeSize([100,300])
      .separation(function(a, b) {
      return a.parent == b.parent ? 1 : 1.25;
    });

    var treeData = treeChart(root).descendants();
    
    var svg = d3.select("#felidae-wrap svg");
    
    svg.append("g")
      .attr("id", "felidaeTreeG")
      .attr("transform", "translate(90, 1450)")
      .selectAll("g")
      .data(treeData)
      .enter()
      .append("g")
        .attr("class", "node")
        .attr("transform", d => `translate(${d.y},${d.x})`);
   
        
    // for circle image 
    var defs = svg.append("defs").attr("id", "imgdefs");

    defs.selectAll("pattern")
      .data(treeData)
      .enter()
      .append("pattern")
        .attr("id", d => d.data.key)
        .attr("height", 1)
        .attr("width", 1)
        .attr("x", "0")
        .attr("y", "0")
          .append("image")
            .attr("x", -40)
            .attr("y", -50)
            .attr("height", 160)
            .attr("width", 160)
            .attr("xlink:href", d => d.data.images[0])

    svg.selectAll("g.node")
      .append("circle")
        .attr("r", d => {
          if (d.data.rank.toLowerCase() == 'family'){
            return 60;
          }else{
            return 30;
          }
        })
        .style("fill", d => `url(#${d.data.key}`)
        .style("stroke", "white")
        .style("stroke-width", "1px")
        .on("click", onCircleClick);

    svg.selectAll("g.node")
      .append("text")
        .style("text-anchor", "middle")
        .style("fill", "#4f442b")
        .style("font-weight", d => (d.data.name == 'Felidae') ? 'bold' : 'normal')
        .style("font-size", d => (d.data.name == 'Felidae') ? '1.4em' : '1em')
        .attr("transform", d => `translate(0, ${((d.data.rank.toLowerCase() == 'family') ? 80 : 50)})`)
        .text(d => d.data.name);
    
      svg.select("#felidaeTreeG").selectAll("line")
        .data(treeData.filter(d => d.parent))
        .enter().insert("line","g")
        .attr("x1", d => d.parent.y)
        .attr("y1", d => d.parent.x)
        .attr("x2", d => d.y)
        .attr("y2", d => d.x)
        .style("stroke", "#d1d1d1");
    
  }

  const FelidaeDataLoader = (resolve, opts) => {
    fetch(opts.url)
      .then(response => {
        if (!response.ok){
          downloadFelidaeData();
          throw new("Felidae data downloading... This code is here to show how data collected.");
        }
        resolve(response.json());
      })
  };


  const start = async () => {
 
    const data = await Promise.all([
      PromiseWrapper({
        resolver: FelidaeDataLoader,
        url: "/d3/data/felidae.json"
      })
    ]);

    viz(data[0]); 

  };

  return {
    start: start
  }
};
