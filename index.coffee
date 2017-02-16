width = d3.select('body').node().getBoundingClientRect().width
height = d3.select('body').node().getBoundingClientRect().height

svg = d3.select 'svg'

sorting = svg.append 'g'
vis = svg.append 'g'

time = d3.scaleTime()
axis_top = null
axis = null
grid = null

bar_height = 6

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
    .data data, (d,i) -> "#{d.name}_#{i}"

  en_nodes = nodes.enter().append 'g'
    .attrs
      class: (d) -> 'node'

  all_nodes = en_nodes.merge nodes
    .attrs
      transform: (d,i) -> "translate(#{width*0.25}, #{(i+1)*20})"

  en_nodes.append 'a'
    .attrs
      href: (d,i) -> "##{i}"
    .append 'text'
      .attrs
        class: 'label'
        x: -20
        'text-anchor': 'end'
      .html (d) -> if d.name.length > 20 then "#{d.name.slice(0,20)}..." else "#{d.name}"
  
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
      width: "#{width*0.5}"
      height: bar_height
      y: -7
#    .on 'click', () ->
#      draw data, true

  en_nodes.append 'rect'
    .attrs
      class: 'foreground'
      height: (d) -> if d.type is 'Publication' then bar_height*2 else bar_height
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

### Data loading
###
d3.json 'data.json', (error, data) ->
  if error
    console.warn error

  d3.select '.header .bio'
    .text data.bio

  # svg height
  header_h = d3.select('.header').node().getBoundingClientRect().height

  svg
    .styles
      height: height - header_h

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

  time
    .domain [min, max]
    .range [0, width*0.5]

  axis_top = d3.axisBottom(time)

  axis = vis.append 'g'
    .attrs
      transform: "translate(#{width*0.25}, #{data.nodes.length*(bar_height+15)})"
    .call axis_top

  grid = axis.append 'g'
    .attrs
      class: 'grid'
    .call(axis_top
      .tickSize -(data.nodes.length+1)*30
      .tickFormat '')

  # SVG Visualization
  draw data.nodes

  # HTML Information 
  info = d3.select '.inner_info'

  items = info.selectAll '.item'
    .data data.nodes

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
    .text (d) -> d.name

  en_items.append 'div'
    .attrs
      class: 'description'
    .html (d) -> 
      str = switch d.type
        when 'Publication' then "<div class='subtitle'>@#{d.conference}, #{d.location}, #{d.date}</div><div class='justified'>#{d.abstract}</div>"
        when 'Education' then "<div class='subtitle'>@#{d.location} in #{d.title}</div><div class='justified'>#{d.description}</div>"
        when 'Experience' then "<div class='subtitle'>@#{d.location} in #{d.place}</div>"
        else ''

      if d.imgs?
        str += "<div class='imgs'>"
        for img in d.imgs
          str += "<img src='img/#{img}'>"
        str += "</div>"

      return str

  items.exit().remove()
