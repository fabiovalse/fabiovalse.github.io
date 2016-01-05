bar_w = 105
bar_offset = 110

height = 150

d3.json 'data.json', (error, data) ->
  if error
    console.warn error

  ## SETUP
  svg = d3.select 'svg'
  .attr
    width: bar_offset*(data.sections.filter (d) -> d.name != "About").length
    height: height

  color = d3.scale.ordinal()
    .domain data.sections.filter (d) -> d.name != "About"
    .range ["#bebada", "#fb8072", "#80b1d3", "#fdb462", "#b3de69"]

  ## MENU
  menu = svg.append 'g'

  section_scale = d3.scale.linear()
    .domain [0, (d3.max data.sections, (d) -> d.items.length)]
    .range [40, height]

  # SECTIONS: draw the name of the sections in a menù
  sections = menu.selectAll '.section_menu'
    .data data.sections.filter (d) -> d.name != "About"

  bars = sections.enter().append 'g'
    .attr
      class: 'section_menu'
      transform: (d,i) -> "translate(#{i*bar_offset}, 0)"

  bars.append 'a'
    .attr
      'xlink:href': (d) -> "##{d.name}"
    .append 'rect'
      .attr
        class: 'bar'
        width: bar_w
        height: (d) -> section_scale d.items.length
        fill: (d) -> color d.name
      .on 'mouseover', () ->
        d3.select(this)
          .transition().duration(300)
          .style
            opacity: 0.7
      .on 'mouseout', () ->
        d3.select(this)
          .transition().duration(300)
          .style
            opacity: 1
  
  bars.append 'text'
      .attr
        'y': 20
        'x': 4
      .text (d) -> d.name

  ## DATABOX: contains all the sections details
  data.sections.map (section) ->
    section.items.map (item) ->
      item.parent = section

  databox = d3.select '#databox'

  section_databox = databox.selectAll '.section_databox'
    .data data.sections

  enter_sd = section_databox.enter().append 'div'
    .attr
      class: 'section_databox'

  enter_sd.append 'a'
    .attr
      name: (d) -> d.name
  enter_sd.append 'h3'
    .style
      background: (d) -> if d.name != "About" then color d.name
      width: (d) -> "#{(section_scale d.items.length)*2}px"
    .text (d) -> d.name

  items = section_databox.selectAll '.item'
    .data (d) -> d.items

  items.enter().append 'div'
    .attr
      class: 'item'
    .html (d) -> 
      if d.parent.name is "Publications"
        "<div class='gray'>#{d.authors}</div><div>#{d.name}</div><div class='gray'>#{d.conference}</div>"
      else if d.parent.name is "Education"
        "<div>#{d.name}</div><div class='gray'>#{d.university}, #{d.years}</div>"
      else if d.parent.name is "Experience"
        "<div>#{d.name}</div><div class='gray'>#{d.place}, #{d.years}</div>"
      else if d.parent.name is "Projects"
        "<div>#{d.name}</div><div class='gray'>#{d.description}</div>"
      else if d.parent.name is "About"
        "<div>#{d.text}</div>"
      else if d.parent.name is "Skills"
        "<div>#{d.name}</div><div class='gray'>#{d.list}</div>"