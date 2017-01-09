body = d3.select 'body'

main = body.append 'div'
  .attrs
    class: 'main'

### Header
###
header = main.append 'div'
  .attrs
    class: 'header'

header.append 'div'
  .attrs
      class: 'left'
bio = header.append 'div'
  .attrs
    class: 'bio'
header.append 'div'
  .attrs
      class: 'right'

### Central
###
central = main.append 'div'
  .attrs
    class: 'central'

time = d3.scaleTime()

draw = (data) ->
  ### Nodes
  ###
  nodes = central.selectAll '.node'
    .data data

  node_group = nodes.enter().append 'div'
    .attrs
      class: (d) -> 'node'

  label = node_group.append 'div'
    .attrs
      class: 'label left'

  label.append 'div'
    .on 'click', (d) ->
      if d3.select(this.parentNode.parentNode).select('.info').style('opacity') is '0'
        d3.select(this.parentNode.parentNode).select('.info').transition()
          .duration(500)
          .styles
            display: 'inline'
          .transition()
          .duration(1000)
            .styles
              opacity: 1
      else
        d3.select(this.parentNode.parentNode).select('.info').transition()
          .duration(1000)
          .styles
            opacity: 0
          .transition()
          .duration(500)
            .styles
              display: 'none'
    .html (d) -> if d.name.length > 20 then "#{d.name.slice(0,20)}... <i class='fa fa-circle #{d.type}' aria-hidden='true'></i>" else "#{d.name} <i class='fa fa-circle #{d.type}' aria-hidden='true'></i>"

  ### Time ranges
  ###
  bar_height = 6

  nodes_div = node_group.append 'div'
    .attrs
      class: 'middle'

  svg = nodes_div.append 'svg'
    .attrs
      height: bar_height

  ### Info
  ###
  nodes_div.append 'div'
    .styles
      opacity: 0
      display: 'none'
    .attrs
      class: 'info'
    #.classed 'hidden', true
    .html (d) -> 
      switch d.type
        when 'Education' then "#{d.name} in #{d.title}<br>@#{d.location}"
        when 'Experience' then "#{d.name}<br>@#{d.location}, #{d.place}"
        when 'Project' then "#{d.description}"
        when 'Publication' then "#{d.name}<br>#{d.authors.join(', ')}<br>@#{d.conference}, #{d.location}"
        else ''

  time.range [0, d3.select('.middle').node().getBoundingClientRect().width]

  # range rects
  ranges = svg.selectAll '.range'
    .data (d) -> if d.timerange? then [d] else []

  ranges.enter().append 'rect'
    .attrs
      class: 'range'
      height: bar_height
      width: (d) -> 
        if d.timerange?
          time(if d.timerange.end is 'Present' then new Date() else new Date(d.timerange.end)) - time(new Date(d.timerange.start))
      x: (d) -> 
        if d.timerange?
          time(new Date(d.timerange.start))

  # points
  points = svg.selectAll '.point'
    .data (d) -> if d.date? then [d] else []

  points.enter().append 'circle'
    .attrs
      r: bar_height/2
      cx: (d) -> 
        if d.date?
          time(new Date(d.date))  
      cy: bar_height/2

  # periods
  periods_div = node_group.append 'div'
    .attrs
      class: 'right'

  periods = periods_div.selectAll '.period'
    .data (d) -> [d]

  en_periods = periods.enter().append 'div'
    .attrs
      class: 'period'
    .html (d) -> 
      if d.timerange?
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

  bio.text data.bio

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

  # Data drawing
  draw data.nodes

  # Legend
  legend = central.append 'div'
    .attrs
      class: 'legend'
    .html "<span><i class='fa fa-circle Education' aria-hidden='true'></i> Education</span> <span><i class='fa fa-circle Experience' aria-hidden='true'></i> Experience</span> <span><i class='fa fa-circle Project' aria-hidden='true'></i> Project</span> <span><i class='fa fa-circle Publication' aria-hidden='true'></i> Publication</span>"


