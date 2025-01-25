This gist shows a political map of Italy. It represents a baseline for constructing more sophisticated map such as choropleth or geographic bubble maps.

The visualization shows regions, provinces and towns (i.e., comuni). The level of detail of the map changes on zoom. Labels of administrative area are loaded according to zoom level in a way that tries to avoid collision and overcrowding.

In order to improve the visualization performance, a viewport filtering technique has been adopted. The SVG objects visible to the user are rendered while the ones outside the viewport are filtered out from the DOM.

2016 administrative boundaries have been downloaded from [ISTAT archive](https://www.istat.it/it/archivio/124086). The following procedure shows how to obtain a topojson file containing towns, provinces, regions and country data together and mantaining their metadata.

```bash
## Installing topojson & ogr2ogr
sudo npm install -g topojson
sudo npm install -g ndjson-cli
sudo npm install -g json-to-ndjson

## Download official boundaries
wget http://www.istat.it/storage/cartografia/confini_amministrativi/non_generalizzati/2016/Limiti_2016_WGS84.zip

## Unzip package
unzip Limiti_2016_WGS84.zip

## Convert Shapefile to GeoJSON
ogr2ogr -f GeoJSON -s_srs Limiti_2016_WGS84/Com2016_WGS84/Com2016_WGS84.prj -t_srs EPSG:4326 towns.geojson Limiti_2016_WGS84/Com2016_WGS84/Com2016_WGS84.shp

ogr2ogr -f GeoJSON -s_srs Limiti_2016_WGS84/CMProv2016_WGS84/CMprov2016_WGS84.prj -t_srs EPSG:4326 provinces.geojson Limiti_2016_WGS84/CMProv2016_WGS84/CMprov2016_WGS84.shp

ogr2ogr -f GeoJSON -s_srs Limiti_2016_WGS84/Reg2016_WGS84/Reg_2016_WGS84.prj -t_srs EPSG:4326 regions.geojson Limiti_2016_WGS84/Reg2016_WGS84/Reg_2016_WGS84.shp

## Convert GeoJSON to NDJSON
json-to-ndjson -p 'features.*' -o towns.ndjson towns.geojson
json-to-ndjson -p 'features.*' -o provinces.ndjson provinces.geojson
json-to-ndjson -p 'features.*' -o regions.ndjson regions.geojson

## Create final NDJSON
cat towns.ndjson > final.ndjson
cat provinces.ndjson >> final.ndjson
cat regions.ndjson >> final.ndjson

## Create final GeoJSON
cat final.ndjson | ndjson-reduce 'p.features.push(d), p' '{type: "FeatureCollection", features: []}' > final.geojson

## Convert GeoJSON to TopoJSON
geo2topo --out final.topo.json final.geojson

## Simplify TopoJSON
toposimplify -p 1 -f < final.topo.json > final.simplified.topo.json

## country
topomerge -f "d.properties.REGIONE != undefined" -k "d.type" country=final < final.simplified.topo.json > italy.topo.json
```