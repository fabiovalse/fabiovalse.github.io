width = d3.select('body').node().getBoundingClientRect().width
height = d3.select('body').node().getBoundingClientRect().height

svg = d3.select 'svg'
vis = svg.append 'g'

margin_left = 0.2
diagram_ratio = 0.62

# https://coffeescript-cookbook.github.io/chapters/arrays/removing-duplicate-elements-from-arrays
Array::unique = ->
  output = {}
  output[@[key]] = @[key] for key in [0...@length]
  value for key, value of output

time = d3.scaleTime()
axis_top = null
axis = null
grid = null

bar_height = 6


###
# MAIN visualization function 
#
###
draw = (data, sorting) ->
  if sorting
    data = data.sort (a,b) -> 
      if a.type is 'Publication' and b.type is 'Publication'
        time(new Date(a.date)) - time(new Date(b.date))
      else if a.type is 'Publication'
        time(new Date(a.date)) - time(new Date(b.timerange.start))
      else if b.type is 'Publication'
        time(new Date(a.timerange.start)) - time(new Date(b.date))
      else
        time(new Date(a.timerange.start)) - time(new Date(b.timerange.start))

  ### Nodes
  ###
  nodes = vis.selectAll '.node'
    .data data, (d,i) -> "#{d.label}_#{i}"

  en_nodes = nodes.enter().append 'g'
    .attrs
      class: (d) -> 'node'

  all_nodes = en_nodes.merge nodes
    .attrs
      transform: (d,i) -> "translate(#{width*margin_left}, #{(i+1)*20})"

  en_nodes.append 'a'
    .attrs
      href: (d,i) -> "##{i}"
    .append 'text'
      .attrs
        class: 'label'
        x: -20
        'text-anchor': 'end'
      .html (d) -> if d.short_label.length > 20 then "#{d.short_label.slice(0,20)}..." else "#{d.short_label}"
  
  en_nodes.append 'circle'
    .attrs
      class: (d) -> d.type
      cx: -10
      cy: -4
      r: 5

  nodes.exit().remove()

  ### Time ranges
  ###
  en_nodes.append 'rect'
    .attrs
      class: 'background'
      height: bar_height
      y: -7
  all_nodes.select '.background'
    .attrs
      width: "#{width*diagram_ratio}"

  en_nodes.append 'rect'
    .attrs
      class: 'foreground'
      height: (d) -> if d.type is 'Publication' then bar_height*2 else bar_height
    .append 'title'
      .html (d) -> 
        if d.type is 'Publication'
          d.date
        else if d.timerange?
          if d.timerange.end isnt 'Present'
            "(<span>from</span> #{d.timerange.start.split(' ')[0].slice(0,3)} #{d.timerange.start.split(' ')[1]} <span>to</span> #{d.timerange.end.split(' ')[0].slice(0,3)} #{d.timerange.end.split(' ')[1]})"
          else
            "(<span>from</span> #{d.timerange.start.split(' ')[0].slice(0,3)} #{d.timerange.start.split(' ')[1]} <span>to</span> #{d.timerange.end})"
        else
          "(#{d.date.split(' ')[0].slice(0,3)} #{d.date.split(' ')[1]})"
  all_nodes.select '.foreground'
    .attrs
      width: (d) -> 
        if d.type is 'Publication'
          return 3
        else if d.timerange?
          return time(if d.timerange.end is 'Present' then new Date() else new Date(d.timerange.end)) - time(new Date(d.timerange.start))
      y: (d) -> if d.type is 'Publication' then -10 else -7
      x: (d) -> 
        if d.type is 'Publication'
          return time(new Date(d.date))
        else if d.timerange?
          return time(new Date(d.timerange.start))


###
# Visualization initialization
# it is called on the page load and every time the window is resized
###
init = (data, min, max) ->
  time
    .domain [min, max]
    .range [0, width*diagram_ratio]

  axis_top = d3.axisBottom(time)

  vis.select('.axis').remove()
  axis = vis.append 'g'
    .attrs
      class: 'axis'
      transform: "translate(#{width*margin_left}, #{data.nodes.length*(bar_height+15)})"
    .call(axis_top
      .tickFormat (d) -> if width > 600 then d.getFullYear() else d.getFullYear().toString().slice(2)
    )

  grid = axis.append 'g'
    .attrs
      class: 'grid'
    .call(axis_top
      .tickSize -(data.nodes.length+1)*30
      .tickFormat '')


###
# MAIN rendering function
# - loads data
# - computes scales
# - initialize the visualization
# - draw the visualization
# - renders all the other information that are not a chart
###
d3.json 'data.json', (error, data) ->
  if error
    console.warn error

  d3.select '.header .bio'
    .text data.bio

  # svg height
  svg
    .styles
      height: '420px'

  # time scale
  max = d3.max(
    data.nodes.map(
      (d) -> d3.max(
        if d.timerange?
          [new Date(d.timerange.start), if d.timerange.end is 'Present' then new Date() else new Date(d.timerange.end)]
        else
          new Date(d.date)
      )
    )
  )
  min = d3.min(
    data.nodes.map(
      (d) -> d3.min(
        if d.timerange?
          [new Date(d.timerange.start), if d.timerange.end is 'Present' then new Date() else new Date(d.timerange.end)]
        else
          new Date(d.date)
      )
    )
  )
  
  min = new Date(min).setMonth(min.getMonth() - 6)
  max = new Date(max).setMonth(max.getMonth() + 6)

  cv_data = { ...data }
  cv_data.nodes = data.nodes.filter((d) -> d.type != 'gist')

  init(cv_data, min, max)

  # SVG Visualization
  draw cv_data.nodes

  # On window resize, recompute the visualization
  window.onresize = (e) ->
    width = e.currentTarget.innerWidth
    init(cv_data, min, max)

    draw cv_data.nodes

  # Legend
  entries = d3.select('.legend').selectAll '.entry'
    .data cv_data.nodes.map((d) -> d.type).unique()

  en_entries = entries.enter().append 'div'
    .attrs
      class: 'entry'

  en_entries.append 'div'
    .attrs
      class: (d) -> "circle #{d}"

  en_entries.append 'div'
    .text (d) -> d

  # CV Information 
  info = d3.select '.inner_info'

  items = info.selectAll '.item'
    .data data.nodes.filter((d) -> d.type != 'gist')

  en_items = items.enter().append 'div'
    .attrs
      id: (d,i) -> "#{i}"
      class: 'item'

  all_items = en_items.merge(items)

  en_items.append 'div'
    .attrs
      class: (d) -> "circle #{d.type}"

  en_items.append 'div'
    .attrs
      class: 'title justified'
    .text (d) -> d.label

  en_items.append 'div'
    .attrs
      class: 'subtitle'
    .html (d) -> 
      switch d.type
        when 'Publication' then "@ #{d.conference}, #{d.location}, #{d.date}"
        when 'Education'   then "@ #{d.location}"
        when 'Experience'
          if d.location? then "@ #{d.location}, #{d.place}" else ""
        when 'Project'     then "> #{d.technologies.join(' - ')}"

  en_items.append 'div'
    .attrs
      class: 'description'
    .html (d) -> 
      switch d.type
        when 'Publication' then "#{d.abstract}"
        when 'Education'   then "#{d.description}"
        when 'Experience'  then "#{d.description}"
        when 'Project'     then "#{d.description}"
        else ''

  en_items.append 'div'
    .attrs
      class: 'imgs'
    .html (d) -> 
      if d.imgs
        return d.imgs.map((img) -> "<img src='img/#{img}'>").join('')
      else
        return ""

  en_items.append 'div'
    .attrs
      class: 'links'
    .html (d) -> """
      #{if d.presentation != undefined then '<a href="data/' + d.presentation + '">Slides</a>' else ''}
      #{if d.paper != undefined then '<a href="data/' + d.paper + '">Paper</a>' else ''}
      #{if d.thesis != undefined then '<a href="data/' + d.thesis + '">Thesis</a>' else ''}"""

  items.exit().remove()

  #
  gists_node = d3.select '.inner_other'

  gists = gists_node.selectAll '.gist'
    .data data.nodes.filter((d) -> d.type == 'gist')

  en_gists = gists.enter().append 'div'
    .attrs
      id: (d,i) -> "gist#{i}"
      class: 'gist'

  all_gists = en_gists.merge(gists)

  en_gists.append 'div'
    .attrs
      class: 'title'
    .text (d) -> d.label
  
  en_gists.append 'a'
    .attrs
      class: 'img'
      href: (d) -> "#{d.link}"
    .html (d) ->  "<img src='img/#{d.img}'>"

  en_gists.append 'a'
    .attrs
      class: 'code'
      href: (d) -> "#{d.code}"
    .text () -> 'Code'
