class PoolLayout extends go.GridLayout {
  constructor() {
    super();
    this.MINLENGTH = 400; // this controls the minimum length of any swimlane
    this.MINBREADTH = 400; // this controls the minimum breadth of any non-collapsed swimlane
    this.cellSize = new go.Size(1, 1);
    this.wrappingColumn = Infinity;
    this.wrappingWidth = Infinity;
    this.spacing = new go.Size(0, 0);
    this.alignment = go.GridLayout.Position;
  }

  doLayout(coll) {
    const diagram = this.diagram;
    if (diagram === null) return;
    diagram.startTransaction("PoolLayout");
    // make sure all of the Group Shapes are big enough
    const minlen = this.computeMinPoolLength();
    // now do all of the usual stuff, according to whatever properties have been set on this GridLayout
    super.doLayout(coll);
    diagram.commitTransaction("PoolLayout");
  }

  // compute the minimum length of the whole diagram needed to hold all of the Lane Groups
  computeMinPoolLength() {
    let len = this.MINLENGTH;
    myDiagram.findTopLevelGroups().each((lane) => {
      const holder = lane.placeholder;
      if (holder !== null) {
        const sz = holder.actualBounds;
        len = Math.max(len, sz.height);
      }
    });
    return len;
  }

  // compute the minimum size for a particular Lane Group
  computeLaneSize(lane) {
    // assert(lane instanceof go.Group);
    const sz = new go.Size(
      lane.isSubGraphExpanded ? this.MINBREADTH : 1,
      this.MINLENGTH
    );
    if (lane.isSubGraphExpanded) {
      const holder = lane.placeholder;
      if (holder !== null) {
        const hsz = holder.actualBounds;
        sz.width = Math.max(sz.width, hsz.width);
      }
    }
    // minimum breadth needs to be big enough to hold the header
    const hdr = lane.findObject("HEADER");
    if (hdr !== null) sz.width = Math.max(sz.width, hdr.actualBounds.width);
    return sz;
  }
}
// end PoolLayout class

var myDiagram;


function crearDiagramaSinDatos() {
  let roomId = "mi-sala";
  // Conectar con el servidor de sockets
  configDiagrama(roomId);
  window.addEventListener("DOMContentLoaded", init);
}

function cargarDataDiagrama() {
  // setup a few example class nodes and relationships
  var nodedata = [
    {
      key: 1,
      name: "BankAccount",
      tipo:"titulo",
      properties: [
        { 
          key:0, name: "owner",type: "String", visibility: "public", tipo:"propiedad", },
        {
          key:1,
          name: "balance",
          type: "Currency",
          visibility: "public",
          default: "0",
          tipo:"propiedad",},
      ],
      methods: [
        {
          name: "deposit",
          parameters: [{ name: "amount", type: "Currency" }],
          visibility: "public",
        },
        {
          name: "withdraw",
          parameters: [{ name: "amount", type: "Currency" }],
          visibility: "public",
        },
      ],
      color: "0",
      loc: "12 35.52284749830794",
    },
    {
      key: 11,
      name: "Person",
      properties: [
        { key:0, name: "name", type: "String", visibility: "public" },
        { key:1, name: "birth", type: "Date", visibility: "protected" },
      ],
      methods: [{ name: "getCurrentAge", type: "int", visibility: "public" }],
      color: "0",
      loc: "12 35.52284749830794",
    },
    {
      key: 12,
      name: "Student",
      properties: [{ key:0,name: "classes", type: "List", visibility: "public" }],
      methods: [
        {
          name: "attend",
          parameters: [{ name: "class", type: "Course" }],
          visibility: "private",
        },
        { name: "sleep", visibility: "private" },
      ],
      color: "0",
      loc: "12 35.52284749830794",
    },
    {
      key: 13,
      name: "Professor",
      properties: [{ key:0,name: "classes", type: "List", visibility: "public" }],
      methods: [
        {
          name: "teach",
          parameters: [{ name: "class", type: "Course" }],
          visibility: "private",
        },
      ],
      color: "0",
      loc: "12 35.52284749830794",
    },
    {
      key: 14,
      name: "Course",
      properties: [
        { key:1,name: "name", type: "STRING", visibility: "public" },
        { key:2,name: "description", type: "STRING", visibility: "public" },
        { key:3,name: "professor", type: "INTEGER", visibility: "public" },
        { key:4,name: "location", type: "STRING", visibility: "public" },
        { key:5,name: "times", type: "INTEGER", visibility: "public" },
        { key:6,name: "prerequisites", type: "INTEGER", visibility: "public" },
        { key:7,name: "students", type: "INTEGER", visibility: "public" },
      ],
      color: "0",
      loc: "12 35.52284749830794",
    },
  ];
  var linkdata = [
    { from: 12, to: 11, relationship: "generalization" , multiplicityFrom: "0..1", multiplicityTo: "1..*", comment: "Comentario adicional" },
    { from: 13, to: 11, relationship: "generalization", multiplicityFrom: "0..1", multiplicityTo: "1..*", comment: "Comentario adicional" },
    { from: 14, to: 13, relationship: "aggregation", multiplicityFrom: "0..1", multiplicityTo: "1..*",comment: "Comentario adicional" },
  ];
  myDiagram.model = new go.GraphLinksModel({
    copiesArrays: true,
    copiesArrayObjects: true,
    linkFromPortIdProperty: "fromPort",
    linkToPortIdProperty: "toPort",
    nodeDataArray: nodedata,
    linkDataArray: linkdata,
  });
}

function getNewKey() {
  // Obtener el valor más alto de la propiedad "key" de los nodos en el modelo
  var maxKey = 0;
  myDiagram.model.nodeDataArray.forEach(function (node) {
    if (node.key > maxKey) {
      maxKey = node.key;
    }
  });

  // Incrementar el valor en 1 para el nuevo nodo
  return maxKey + 1;
}

function configDiagrama(roomId) {
  const $ = go.GraphObject.make;

  myDiagram = new go.Diagram("myDiagramDiv", {
    grid: $(go.Panel, "Grid",  // a simple 10x10 grid
        $(go.Shape, "LineH", { stroke: "lightgray", strokeWidth: 0.5 }),
        $(go.Shape, "LineV", { stroke: "lightgray", strokeWidth: 0.5 })
    ),
    contentAlignment: go.Spot.TopLeft,
    "commandHandler.copiesGroupKey": true,
    "undoManager.isEnabled": true,
    "textEditingTool.starting": go.TextEditingTool.SingleClick,
    LinkDrawn: function (e) {
      var link = e.subject; // enlace creado
      var data = link.data; // objeto de datos del enlace
      data.relationship = "association"; // establecer el valor inicial del campo
      myDiagram.updateAllTargetBindings();
    },
  });
  const token = localStorage.getItem("token");
  const socket = io.connect("http://54.242.7.166");
  socket.emit("joinRoom", {roomId, token});
  myDiagram.socket = socket;
  myDiagram.roomId = roomId;
  // Customize the dragging tool:
  // When dragging a node set its opacity to 0.6 and move it to be in front of other nodes
  myDiagram.toolManager.draggingTool.doActivate = function () {
    // method override must be function, not =>
    go.DraggingTool.prototype.doActivate.call(this);
    this.currentPart.opacity = 0.6;
    this.currentPart.layerName = "Foreground";
  };
  myDiagram.toolManager.draggingTool.doDeactivate = function () {
    // method override must be function, not =>
    this.currentPart.opacity = 1;
    this.currentPart.layerName = "";
    go.DraggingTool.prototype.doDeactivate.call(this);
  };

  // this is called after nodes have been moved
  function relayoutDiagram() {
    myDiagram.selection.each((n) => n.invalidateLayout());
    myDiagram.layoutDiagram();
  }

  // There are only three note colors by default, blue, red, and yellow but you could add more here:
  const noteColors = ["#009CCC", "#CC293D", "#FFD700"];
  function getNoteColor(num) {
    return noteColors[Math.min(num, noteColors.length - 1)];
  }
  // While dragging, highlight the dragged-over group
  function highlightGroup(grp, show) {
    if (show) {
      const part = myDiagram.toolManager.draggingTool.currentPart;
      if (part.containingGroup !== grp) {
        grp.isHighlighted = true;
        return;
      }
    }
    grp.isHighlighted = false;
  }


  function convertVisibility(v) {
    switch (v) {
      case "public":
        return "+";
      case "private":
        return "-";
      case "protected":
        return "#";
      case "package":
        return "~";
      default:
        return v;
    }
  }

  // the item template for properties
  var propertyTemplate = $(
    go.Panel,
    "Horizontal",
    {
      click: function (e, obj) {
        // Obtener el nodo actual
        var node = obj.part;
        // Obtener la propiedad correspondiente al Shape
        var property = obj.data; // Suponiendo que el objeto de datos del nodo contiene la información de la propiedad
        console.log(obj.data)
        // Eliminar la propiedad
        var index = node.data.properties.indexOf(property);
        if (index !== -1) {
          node.data.properties.splice(index, 1);
          // Emitir evento al servidor Socket.IO
          this.myDiagram.socket.emit('deleteAtributo', { 
            roomId: this.myDiagram.roomId, 
            nodeId: node.data.key, 
            index: index });
          myDiagram.updateAllTargetBindings();
        }
        // Actualizar el diagrama
        myDiagram.commitTransaction("eliminarPropiedad");
      }
    },
    // property visibility/access
    $(go.TextBlock,
      { isMultiline: false, editable: false, width: 12 },
      new go.Binding("text", "visibility", convertVisibility)
    ),

    // property name, underlined if scope=="class" to indicate static property
    $(go.TextBlock,
      { isMultiline: false, editable: true },
      new go.Binding("text", "name").makeTwoWay(),
      new go.Binding("isUnderline", "scope", (s) => s[0] === "c")
    ),
    // property type, if known
    $(go.TextBlock, "", new go.Binding("text", "type", (t) => (t ? ": " : ""))),
    $(go.TextBlock,
      { isMultiline: false, editable: true },
      new go.Binding("text", "type").makeTwoWay()
    ),
    
      $(go.Shape, "MinusLine", {
        name: "agregar",
        margin: 6,
        strokeWidth: 2,
        width: 10,
        height: 12,
        stroke: "red",
        background: "#0000",
        
      }),
    // property default value, if any
    $(go.TextBlock,
      { isMultiline: false, editable: false },
      new go.Binding("text", "default", (s) => (s ? " = " + s : ""))
    ),
    new go.Binding("tipo").makeTwoWay(), // Bind the 'tipo' property to the property data

  );

  // the item template for methods
  var methodTemplate = $(
    go.Panel,
    "Horizontal",
    // method visibility/access
    $(go.TextBlock,
      { isMultiline: false, editable: false, width: 12 },
      new go.Binding("text", "visibility", convertVisibility)
    ),
    // method name, underlined if scope=="class" to indicate static method
    $(
      go.TextBlock,
      { isMultiline: false, editable: true },
      new go.Binding("text", "name").makeTwoWay(),
      new go.Binding("isUnderline", "scope", (s) => s[0] === "c")
    ),
    // method parameters
    $(
      go.TextBlock,
      "()",
      // this does not permit adding/editing/removing of parameters via inplace edits
      new go.Binding("text", "parameters", (parr) => {
        var s = "(";
        for (var i = 0; i < parr.length; i++) {
          var param = parr[i];
          if (i > 0) s += ", ";
          s += param.name + ": " + param.type;
        }
        return s + ")";
      })
    ),
    // method return type, if any
    $(go.TextBlock, "", new go.Binding("text", "type", (t) => (t ? ": " : ""))),
    $(
      go.TextBlock,
      { isMultiline: false, editable: true },
      new go.Binding("text", "type").makeTwoWay()
    )
  );



  function makePort(name, align, spot, output, input) {
    var horizontal = align.equals(go.Spot.Top) || align.equals(go.Spot.Bottom);
    return $(go.Shape, {
      fill: "transparent", // changed to a color in the mouseEnter event handler
      strokeWidth: 0, // no stroke
      width: horizontal ? NaN : 8, // if not stretching horizontally, just 8 wide
      height: !horizontal ? NaN : 8, // if not stretching vertically, just 8 tall
      alignment: align, // align the port on the main Shape
      stretch: horizontal ? go.GraphObject.Horizontal : go.GraphObject.Vertical,
      portId: name, // declare this object to be a "port"
      fromSpot: spot, // declare where links may connect at this port
      fromLinkable: output, // declare whether the user may draw links from here
      toSpot: spot, // declare where links may connect at this port
      toLinkable: input, // declare whether the user may draw links to here
      cursor: "pointer", // show a different cursor to indicate potential link point
      mouseEnter: (e, port) => {
        // the PORT argument will be this Shape
        if (!e.diagram.isReadOnly) port.fill = "rgba(255,0,255,0.5)";
      },
      mouseLeave: (e, port) => (port.fill = "transparent"),
    });
  }

  myDiagram.nodeTemplate = $(
    go.Node,
    "Auto",
    {
      locationSpot: go.Spot.Center,
      fromSpot: go.Spot.AllSides,
      toSpot: go.Spot.AllSides,
    },
    new go.Binding("location", "loc", function(loc, node) {
      if (loc) {
        // Si la posición está definida, utilizarla tal cual
        return go.Point.parse(loc);
      } else {
        // Si no hay posición definida, reubicar un poco más lejos del lado izquierdo
        const diagramWidth = node.diagram.viewportBounds.width;
        const x = distanciaDesdeIzquierda + (diagramWidth * 0.5);
        const y = node.diagram.viewportBounds.centerY;
        return new go.Point(x, y);
        // Si no hay posición definida, reubicar en el centro del diagrama
        //return node.diagram.viewportBounds.center;
      }
    }).makeTwoWay(function(pt, node) {
      if (pt.x === distanciaDesdeIzquierda + node.diagram.viewportBounds.x && pt.y === node.diagram.viewportBounds.centerY) {
        // Si la posición está cerca del lado izquierdo, no almacenarla en "loc"
        return null;
      } else {
        // Almacenar la posición en "loc"
        return go.Point.stringify(pt);
      }
    }),
    $(go.Shape, { fill: "lightyellow" }),
    $(go.Panel,
      "Table",
      { defaultRowSeparatorStroke: "black" },
      // header
      $(go.TextBlock,
        {
          row: 0,
          columnSpan: 2,
          margin: 3,
          alignment: go.Spot.Center,
          font: "bold 12pt sans-serif",
          isMultiline: false,
          editable: true,
        },
        new go.Binding("text", "name").makeTwoWay()
      ),
      // properties
      $(go.TextBlock,
        "Properties",
        { row: 1, font: "italic 10pt sans-serif" },
        new go.Binding("visible", "visible", (v) => !v).ofObject("PROPERTIES")
      ),
      // panel de properties array visible
      $(go.Panel,
        "Vertical",
        { name: "PROPERTIES" },
        new go.Binding("itemArray", "properties"),
        {
          row: 1,
          margin: 3,
          stretch: go.GraphObject.Fill,
          defaultAlignment: go.Spot.Left,
          background: "lightyellow",
          itemTemplate: propertyTemplate,
        }
      ),
      // button to add items in properties
      $(go.Panel,
        "Vertical",
        {
          alignment: go.Spot.TopRight,
          margin: 4,
          position: new go.Point(50, 50),
          row: 1,
          click: function (e, obj) {
            var node = obj.part;
            if (node instanceof go.Node) {
              var model = myDiagram.model;
              var key = node.data.key;
              myDiagram.startTransaction("Add");
              propert = { name: "newAtributo", type: "STRING", visibility: "public" };
              model
                .findNodeDataForKey(key)
                .properties.push(propert);
              model.setDataProperty(
                node.data,
                "properties",
                model.findNodeDataForKey(key).properties
              );
              // Emitir evento al servidor Socket.IO
              this.myDiagram.socket.emit('agregarPropiedad', { 
                roomId: this.myDiagram.roomId, nodeId: key, propiedad: propert });

              myDiagram.commitTransaction("Add");
              myDiagram.updateAllTargetBindings();
            }
          },
        },
        $(go.Panel,
          "Auto",
          $(go.Shape, "Rectangle", {
            strokeWidth: 0,
            stroke: null,
            fill: "#0000",
          }),
          $(go.Shape, "PlusLine", {
            width: 8,
            height: 8,
            stroke: "black",
            background: null,
            strokeWidth:1
          })
        )
      ),
      $("PanelExpanderButton",
        "PROPERTIES",
        { row: 1, column: 1, alignment: go.Spot.TopRight, visible: false },
        new go.Binding("visible", "properties", (arr) => arr.length > 0)
      ),

      // methods
      $(
        go.TextBlock,
        "Methods",
        { row: 2, font: "italic 10pt sans-serif" },
        new go.Binding("visible", "visible", (v) => !v).ofObject("METHODS")
      ),
      $(
        go.Panel,
        "Vertical",
        { name: "METHODS" },
        new go.Binding("itemArray", "methods"),
        {
          row: 2,
          margin: 3,
          stretch: go.GraphObject.Fill,
          defaultAlignment: go.Spot.Left,
          background: "lightyellow",
          itemTemplate: methodTemplate,
        }
      ),
      // button to add metodos
      $(go.Panel,
        "Vertical",
        {
          alignment: go.Spot.TopRight,
          margin: 4,
          position: new go.Point(50, 50),
          row: 2,
          click: function (e, obj) {
            var node = obj.part;
            if (node instanceof go.Node) {
              var model = myDiagram.model;
              var key = node.data.key;
              myDiagram.startTransaction("Add");
              method = { name: "newMetodo", parameters: [{ name: "name", type: "Tipo"  }]};
              model
                .findNodeDataForKey(key)
                .methods.push(method);
              model.setDataProperty(
                node.data,
                "methods",
                model.findNodeDataForKey(key).methods
              );
              // Emitir evento al servidor Socket.IO
              this.myDiagram.socket.emit('agregarMetodo', { 
                roomId: this.myDiagram.roomId, nodeId: key, method: method });
              myDiagram.commitTransaction("Add");
              myDiagram.updateAllTargetBindings();
            }
          },
        },
        $(go.Panel,
          "Auto",
          $(go.Shape, "Rectangle", {
            strokeWidth: 0,
            stroke: null,
            fill: "#0000",
          }),
          $(go.Shape, "PlusLine", {
            width: 8,
            height: 8,
            stroke: "black",
            background: null,
            strokeWidth:1
          })
        )
      ),
      $(
        "PanelExpanderButton",
        "METHODS",
        { row: 2, column: 1, alignment: go.Spot.TopRight, visible: false },
        new go.Binding("visible", "methods", (arr) => arr.length > 0)
      )
    ),
    makePort("T", go.Spot.Top, go.Spot.TopSide, true, true),
    makePort("L", go.Spot.Left, go.Spot.LeftSide, true, true),
    makePort("R", go.Spot.Right, go.Spot.RightSide, true, true),
    makePort("B", go.Spot.Bottom, go.Spot.BottomSide, true, true),

  );

  function convertIsTreeLink(r) {
    return r === "generalization";
  }

  function convertFromArrow(r) {
    switch (r) {
      case "generalization":
        return "";
      default:
        return "";
    }
  }

  function convertToArrow(r) {
    switch (r) {
      case "association":
        return "OpenTriangle";
      case "generalization":
        return "Triangle"; //inherent
      case "realization":
        return "Triangle";
      case "dependency":
        return "OpenTriangle";
      case "aggregation":
        return "StretchedDiamond";
      case "composition":
        return "StretchedDiamond";
      default:
        return "Triangle";
    }
  }

  function convertFill(r) {
    switch (r) {
      case "association":
        return "black";
      case "generalization":
        return "white";
      case "realization":
        return "white";
      case "dependency":
        return "black";
      case "aggregation":
        return "white";
      case "composition":
        return "black";
      default:
        return "black";
    }
  }

  function convertDash(r) {
    switch (r) {
      case "realization":
        return [1, 2];
      case "dependency":
        return [1, 2];
      default:
        return null;
    }
  }

  myDiagram.linkTemplate = $(
    go.Link,
    {
      routing: go.Link.AvoidsNodes,
      curve: go.Link.JumpOver,
      relinkableFrom: false,
      relinkableTo: true,
      reshapable: true,
      resegmentable: true,
      mouseEnter: (e, link) => 
        (link.findObject("HIGHLIGHT").stroke = "rgba(30,144,255,0.2)"),
      mouseLeave: (e, link) =>
        (link.findObject("HIGHLIGHT").stroke = "transparent"),
      selectionAdorned: false,
    },
    $(go.Shape, // El highlight shape
      {
        isPanelMain: true,
        strokeWidth: 8,
        stroke: "transparent",
        name: "HIGHLIGHT",
      }
    ),
    $(go.Shape, // La línea del enlace
      {
        isPanelMain: true,
        stroke: "gray",
        strokeWidth: 2,
        strokeDashArray: null,
      },
      new go.Binding("stroke", "isSelected", (sel) =>
        sel ? "dodgerblue" : "gray"
      ).ofObject()
    ),
    $(go.Shape, // La flecha al final
      {
        toArrow: "Standard",
        scale: 1.3,
        fill: "black",
      },
      new go.Binding("toArrow", "relationship", convertToArrow),
      new go.Binding("fill", "relationship", convertFill)
    ),
    $(go.TextBlock, // Multiplicidad desde (origen)
      {
        segmentIndex: 1,
        segmentOffset: new go.Point(NaN, NaN),
        editable: true,
      },
      new go.Binding("text", "multiplicityFrom").makeTwoWay()
    ),
    $(go.TextBlock, // Multiplicidad hasta (destino)
      {
        segmentIndex: -2,
        segmentOffset: new go.Point(NaN, NaN),
        editable: true,
      },
      new go.Binding("text", "multiplicityTo").makeTwoWay()
    )
  );
  


  function handleTextChanged(gohashid,newValue, tipo) {
    myDiagram.socket.emit("valueChangeLink", { roomId: myDiagram.roomId, newValue ,id:gohashid, tipo});
  }

  // create a button that brings up the context menu
  function CMButton(options) {
    return $(
      go.Shape,
      {
        fill: "orange",
        stroke: "gray",
        background: "transparent",
        geometryString: "F1 M0 0 M0 4h4v4h-4z M6 4h4v4h-4z M12 4h4v4h-4z M0 12",
        isActionable: true,
        cursor: "context-menu",
        click: (e, shape) => {
          e.diagram.commandHandler.showContextMenu(shape.part.adornedPart);
        },
      },
      options || {}
    );
  }
  function makeAdornmentPathPattern(w) {
    return $(go.Shape, {
      stroke: "dodgerblue",
      strokeWidth: 2,
      strokeCap: "square",
      geometryString: "M0 0 M4 2 H3 M4 " + (w + 4).toString() + " H3",
    });
  }

  myDiagram.linkTemplate.selectionAdornmentTemplate = $(
    go.Adornment, // use a special selection Adornment that does not obscure the link path itself
    $(
      go.Shape,
      {
        // this uses a pathPattern with a gap in it, in order to avoid drawing on top of the link path Shape
        isPanelMain: true,
        stroke: "transparent",
        strokeWidth: 6,
        pathPattern: makeAdornmentPathPattern(2), // == thickness or strokeWidth
      },
      new go.Binding("pathPattern", "thickness", makeAdornmentPathPattern)
    ),
    CMButton({ alignmentFocus: new go.Spot(0, 0, -6, -4) })
  );

  // Link context menu
  // All buttons in context menu work on both click and contextClick,
  // in case the user context-clicks on the button.
  // All buttons modify the link data, not the Link, so the Bindings need not be TwoWay.
  // num 0:association 1: inherente(generalization) 2:realization
  //{3:dependency 4:composition} 5:aggregation
  function ArrowButton(num, dash, fill) {
    var name = num == 1 ? "generalization" : "realization";
    var geo = "F M14 0 L14 -4 18 0 14 4 Z M0 0 L14 0"; // 1 triangle (1,2)
    if (num === 0 || num === 3) {
      // 0 flecha
      name = num == 0 ? "association" : "dependency";
      geo = "M0 0 M16 16 M0 8 L16 8  M12 11 L16 8 L12 5";
    } else if (num === 4 || num == 5) {
      // 2 diamond
      name = num == 4 ? "composition" : "aggregation";
      geo = "F M14 0 L18 -4 22 0 18 4 Z M0 0 L14 0";
      //geo = "M0 0 M16 16 M0 8 L16 8  M12 11 L16 8 L12 5  M4 11 L0 8 L4 5";
    }
    return $(go.Shape, {
      geometryString: geo,
      fill: fill,
      stroke: "black",
      margin: 2,
      background: "transparent",
      strokeDashArray: dash,
      mouseEnter: (e, shape) => (shape.background = "dodgerblue"),
      mouseLeave: (e, shape) => (shape.background = "transparent"),
      click: ClickFunction(name, num),
      contextClick: ClickFunction("dir", num),
    });
  }

  function AllSidesButton(to) {
    var setter = (e, shape) => {
      e.handled = true;
      e.diagram.model.commit((m) => {
        var link = shape.part.adornedPart;
        m.set(
          link.data,
          to ? "toSpot" : "fromSpot",
          go.Spot.stringify(go.Spot.AllSides)
        );
        // re-spread the connections of other links connected with the node
        (to ? link.toNode : link.fromNode).invalidateConnectedLinks();
      });
    };
    return $(go.Shape, {
      width: 12,
      height: 12,
      fill: "transparent",
      mouseEnter: (e, shape) => (shape.background = "dodgerblue"),
      mouseLeave: (e, shape) => (shape.background = "transparent"),
      click: setter,
      contextClick: setter,
    });
  }

  function ClickFunction(propname, value) {
    return (e, obj) => {
      e.handled = true;
      var link = obj.part;
      link.adornedPart.data.relationship = propname;
      console.log(link.adornedPart.data)
      var gohashid = link.adornedPart.data.__gohashid;
      myDiagram.socket.emit("enlaceActualizado", {gohashid, relationship:propname, roomId:myDiagram.roomId});
      myDiagram.updateAllTargetBindings();
    };
  }

  // Create a context menu button for setting a data property with a stroke width value.
  function ThicknessButton(sw, propname) {
    if (!propname) propname = "thickness";
    return $(go.Shape, "LineH", {
      width: 16,
      height: 16,
      strokeWidth: sw,
      margin: 1,
      background: "transparent",
      mouseEnter: (e, shape) => (shape.background = "dodgerblue"),
      mouseLeave: (e, shape) => (shape.background = "transparent"),
      click: ClickFunction(propname, sw),
      contextClick: ClickFunction(propname, sw),
    });
  }

  // Create a context menu button for setting a data property with a stroke dash Array value.
  function DashButton(dash, propname) {
    if (!propname) propname = "dash";
    return $(go.Shape, "LineH", {
      width: 24,
      height: 16,
      strokeWidth: 2,
      strokeDashArray: dash,
      margin: 1,
      background: "transparent",
      mouseEnter: (e, shape) => (shape.background = "dodgerblue"),
      mouseLeave: (e, shape) => (shape.background = "transparent"),
      click: ClickFunction(propname, dash),
      contextClick: ClickFunction(propname, dash),
    });
  }
  // Create a context menu button for setting a data property with a color value.
  function ColorButton(color, propname) {
    if (!propname) propname = "color";
    return $(go.Shape, {
      width: 16,
      height: 16,
      stroke: "lightgray",
      fill: color,
      margin: 1,
      background: "transparent",
      mouseEnter: (e, shape) => (shape.stroke = "dodgerblue"),
      mouseLeave: (e, shape) => (shape.stroke = "lightgray"),
      click: ClickFunction(propname, color),
      contextClick: ClickFunction(propname, color),
    });
  }

  function SpotButton(spot, to) {
    var ang = 0;
    var side = go.Spot.RightSide;
    if (spot.equals(go.Spot.Top)) {
      ang = 270;
      side = go.Spot.TopSide;
    } else if (spot.equals(go.Spot.Left)) {
      ang = 180;
      side = go.Spot.LeftSide;
    } else if (spot.equals(go.Spot.Bottom)) {
      ang = 90;
      side = go.Spot.BottomSide;
    }
    if (!to) ang -= 180;
    var setter = (e, shape) => {
      e.handled = true;
      e.diagram.model.commit((m) => {
        var link = shape.part.adornedPart;
        m.set(link.data, to ? "toSpot" : "fromSpot", go.Spot.stringify(side));
        // re-spread the connections of other links connected with the node
        (to ? link.toNode : link.fromNode).invalidateConnectedLinks();
      });
    };
    return $(go.Shape, {
      alignment: spot,
      alignmentFocus: spot.opposite(),
      geometryString: "M0 0 M12 12 M12 6 L1 6 L4 4 M1 6 L4 8",
      angle: ang,
      background: "transparent",
      mouseEnter: (e, shape) => (shape.background = "dodgerblue"),
      mouseLeave: (e, shape) => (shape.background = "transparent"),
      click: setter,
      contextClick: setter,
    });
  }
  function DarkColorButtons() {
    // used by multiple context menus
    return [
      $(
        "ContextMenuButton",
        $(
          go.Panel,
          "Horizontal",
          ColorButton("black"),
          ColorButton("green"),
          ColorButton("blue"),
          ColorButton("red")
        )
      ),
      $(
        "ContextMenuButton",
        $(
          go.Panel,
          "Horizontal",
          ColorButton("brown"),
          ColorButton("magenta"),
          ColorButton("purple"),
          ColorButton("orange")
        )
      ),
    ];
  }
  function StrokeOptionsButtons() {
    // used by multiple context menus
    return [
      $(
        "ContextMenuButton",
        $(
          go.Panel,
          "Horizontal",
          ThicknessButton(1),
          ThicknessButton(2),
          ThicknessButton(3),
          ThicknessButton(4)
        )
      ),
      $(
        "ContextMenuButton",
        $(
          go.Panel,
          "Horizontal",
          DashButton(null),
          DashButton([2, 4]),
          DashButton([4, 4])
        )
      ),
    ];
  }
  // 1 triangle 0 flecha 2 diamond
  myDiagram.linkTemplate.contextMenu = $(
    "ContextMenu",
    $(
      "ContextMenuButton",
      $(
        go.Panel,
        "Horizontal",
        ArrowButton(0, null, "black"), // association   0
        ArrowButton(1, null, "black"), // inherent  1
        ArrowButton(5, null, "white") //aggregation  5
      )
    ),
    $(
      "ContextMenuButton",
      $(
        go.Panel,
        "Horizontal",
        ArrowButton(3, [1, 2], "black"), //dependency 3
        ArrowButton(2, [1, 2], "black"), //realization  2
        ArrowButton(4, null, "black") //composition  4
      )
    ),
    $(
      "ContextMenuButton",
      $(go.TextBlock, "Sin Flecha"),
      {
        click: (e, obj) => {
          var link = obj.part.adornedPart;
          link.data.relationship = "none"; // Configurar como relación sin flecha
          myDiagram.updateAllTargetBindings();
        },
      }
    ),
    // Agregando opciones de multiplicidad
    $(
      "ContextMenuButton",
      $(go.TextBlock, "1 a 1"),
      {
        click: (e, obj) => {
          var link = obj.part.adornedPart;
          link.data.multiplicityFrom = "1";
          link.data.multiplicityTo = "1";
          myDiagram.updateAllTargetBindings();
        },
      }
    ),
    $(
      "ContextMenuButton",
      $(go.TextBlock, "1 a muchos"),
      {
        click: (e, obj) => {
          var link = obj.part.adornedPart;
          link.data.multiplicityFrom = "1";
          link.data.multiplicityTo = "*";
          myDiagram.updateAllTargetBindings();
        },
      }
    ),
    $(
      "ContextMenuButton",
      $(go.TextBlock, "muchos a muchos"),
      {
        click: (e, obj) => {
          var link = obj.part.adornedPart;
          link.data.multiplicityFrom = "*";
          link.data.multiplicityTo = "*";
          myDiagram.updateAllTargetBindings();
        },
      }
    )
  );
  

  // temporary links used by LinkingTool and RelinkingTool are also orthogonal:
  myDiagram.toolManager.linkingTool.temporaryLink.routing = go.Link.Orthogonal;
  myDiagram.toolManager.relinkingTool.temporaryLink.routing =
    go.Link.Orthogonal;
}

function init() {

  myDiagram.addDiagramListener("TextEdited", function(e) {
  var textBlock = e.subject;
  var nodeId = textBlock.part.key;
  var newValue = textBlock.text;
  var oldValue = e.parameter;
  var roomId = myDiagram.roomId;
  var key = -1;
  var node = myDiagram.model.findNodeDataForKey(nodeId);
    if(node!=null){
      // Emitir el evento de enlace creado a través de socket
      myDiagram.socket.emit("changeTextEdit",
          { roomId, nodeId, oldValue, newValue, key, node });
    }
  });
  //esto modifuq hoy
  /*myDiagram.addDiagramListener("LinkDrawn", function(e) {
    var link = e.subject; // enlace creado
    var data = link.data; // objeto de datos del enlace
    data.relationship = "association"; // establecer el valor de la relación
    data.multiplicityFrom = "1"; // establecer la multiplicidad desde
    data.multiplicityTo = "1"; // establecer la multiplicidad hasta
    data.comment = "Comentario por defecto"; // inicializar el comentario
    
    myDiagram.updateAllTargetBindings(); // Actualizar vinculaciones
  });*/

  // Escucha el evento de eliminación de elementos seleccionados
  myDiagram.addDiagramListener("SelectionDeleting", function(e) {
  // Verifica si el evento fue desencadenado por una pulsación de tecla
  if (e.diagram.lastInput.event instanceof KeyboardEvent) {

    var linksToDelete = [];
    // Recorre los elementos seleccionados que se están eliminando
    e.subject.each(function(part) {
      // Verifica si el elemento es un nodo
      if (part instanceof go.Node) {
        var nodoId = part.data.key; // Obtiene el ID o identificador único del nodo
        // Recorre los enlaces conectados al nodo
        part.linksConnected.each(function(link) {
          // Agrega el enlace a la lista de enlaces a eliminar
          linksToDelete.push(link.data.__gohashid);
        });
        var roomId = myDiagram.roomId;
        console.log(nodoId, roomId, linksToDelete);
        // Cuando se detecta la eliminación de un nodo
        myDiagram.socket.emit('nodoEliminado', {nodoId, roomId, linksToDelete});

      }
    });
  }
  });

  // Manejar evento de movimiento de nodo
  myDiagram.addDiagramListener("SelectionMoved", (event) => {
    const node = event.subject.first(); // Obtener el primer nodo movido
    const data = { nodeId: node.data.key, position: node.position };
    node.data.loc = `${data.position.x} ${data.position.y}`;
    console.log(node.data);
    // Enviar evento al servidor
    myDiagram.socket.emit("nodeMoved", { room: myDiagram.roomId, data });
  });

  // Manejar el evento de enlace creado recibido a través de socket
  myDiagram.socket.on("linkCreated", function(data) {
    const { fromNodeKey, toNodeKey, fromPort, toPort, relationship, gohashid } = data;
  
      // Obtener los nodos de origen y destino del diagrama
      const fromNode = myDiagram.findNodeForKey(fromNodeKey);
      const toNode = myDiagram.findNodeForKey(toNodeKey);

      // Verificar si los nodos existen en el diagrama
      if (fromNode && toNode) {
      // Crear el enlace en el diagrama
      const newLink = myDiagram.model.addLinkData({ 
        from: fromNode.key,
        fromPort: fromPort,
        relationship: relationship,
        to: toNode.key,
        toPort: toPort,
        __gohashid: gohashid
      });
      myDiagram.updateAllTargetBindings();
    }
  });

  // Manejar evento de movimiento de nodo recibido del servidor
  myDiagram.socket.on("nodeMoved", (data) => {
    console.log("actualizando el nodo");
    const node = myDiagram.findNodeForKey(data.nodeId);
    if (node) {
      console.log(data.position.x, data.position.y)
      // Actualizar posición del nodo en el diagrama
      node.position = new go.Point(data.position.x, data.position.y);
      node.loc = `${data.position.x} ${data.position.y}`;
    }
  });

  myDiagram.socket.on('actualizarPropiedad', ({ nodeId, propiedad }) => {
    // Actualizar las propiedades del nodo en el diagrama del invitado
    var node = myDiagram.findNodeForKey(nodeId);
    if (node) {
      myDiagram.model.findNodeDataForKey(nodeId).properties.push(propiedad);
      myDiagram.updateAllTargetBindings();  
    }
  });

  myDiagram.socket.on('actualizarMetodos', ({ nodeId, method }) => {
    // Actualizar las propiedades del nodo en el diagrama del invitado
    var node = myDiagram.findNodeForKey(nodeId);
    if (node) {
      myDiagram.model.findNodeDataForKey(nodeId).methods.push(method);
      myDiagram.updateAllTargetBindings();  
    }
  });

  myDiagram.socket.on('actualizarAtributos', ({ nodeId, index }) => {
    // Actualizar las propiedades del nodo en el diagrama del invitado
    var node = myDiagram.findNodeForKey(nodeId);
    if (index !== -1 && node) {
      node.data.properties.splice(index, 1);
      myDiagram.updateAllTargetBindings();
    }
  });
  
  // Manejar evento de agregar nuevo nodo recibido del servidor
  myDiagram.socket.on("addNode", (data) => {
    // Agregar el nuevo nodo al diagrama local
    myDiagram.model.addNodeData(data);
  });

  // Manejar evento de agregar nuevo nodo recibido del servidor
  myDiagram.socket.on("actualizarValues", ({ nodeId, oldValue, newValue, key, node}) => {
    var nodeData = myDiagram.model.findNodeDataForKey(nodeId);
    //myDiagram.model.set(nodeData, node);
    myDiagram.model.removeNodeData(nodeData);
    myDiagram.model.addNodeData(node);
    const [primeraParte, segundaParte] = node.loc.split(" ");
    console.log(primeraParte,segundaParte)
    // Actualizar posición del nodo en el diagrama
    myDiagram.updateAllTargetBindings();
    //nodeData.position = new go.Point(parseFloat(primeraParte),parseFloat(segundaParte));

  });

  // Escucha el evento de eliminación de un nodo
  myDiagram.socket.on('eliminarNodo', ({nodoId, linksToDelete}) => {
    const nodo = myDiagram.model.findNodeDataForKey(nodoId);
    if (nodo !== null) {
      myDiagram.model.removeNodeData(nodo);
      linksToDelete.forEach(function(gohashid) {
        var linkToRemove = findLinkById(gohashid);
        if(linkToRemove!=null){
          myDiagram.model.removeLinkData(linkToRemove);    
        }
      });
      myDiagram.updateAllTargetBindings();
    }
  });

  myDiagram.socket.on('actualizarEnlace', ({gohashid, relationship}) => {
    var linkToRemove = findLinkById(gohashid);
    console.log(linkToRemove, gohashid)
    if(linkToRemove!=null){
      console.log('eliminando link')
      linkToRemove.relationship = relationship;
      myDiagram.updateAllTargetBindings();
    }
  })

  myDiagram.socket.on('actualizarValueEnlace', ({id, newValue, tipo}) => {
    var linkToRemove = findLinkById(id);
    console.log(linkToRemove, id, newValue, tipo)
    if(linkToRemove!=null){
      if(tipo==0){// comentario
        linkToRemove.comment = newValue;
      }else if(tipo==1){ // to
        linkToRemove.multiplicityTo = newValue;
      }else if(tipo==2){ //from
        linkToRemove.multiplicityFrom = newValue;
      }
      myDiagram.updateAllTargetBindings();
    }
  })


  myDiagram.socket.on('actualizarRol', function(newRole) {
    if(newRole=='lector'){
      myDiagram.isReadOnly = true;
    } else{
      myDiagram.isReadOnly = false;
    }
  });

  myDiagram.socket.on("guestMouseMove", (data) => {
    const { x, y, username } = data;
  
    // Obtener el elemento del cursor del invitado
  const guestCursor = document.getElementById("guestCursorDiv");
  guestCursor.style.transform = `translate(${x}px, ${y}px)`;
  const label = document.getElementById("guest-name");
  label.textContent = username;

  });



}

// Show the diagram's model in JSON format
function save() {
  console.log("Guardando el modelo...");
  console.log("Nodos:", myDiagram.model.nodeDataArray);
  console.log("Enlaces:", myDiagram.model.linkDataArray);
  const jsonModel = myDiagram.model.toJson();
  document.getElementById("mySavedModel").value = jsonModel;
  myDiagram.isModified = false;
  console.log("Modelo guardado:", jsonModel);
}


function load() {
  myDiagram.model = go.Model.fromJson(
    document.getElementById("mySavedModel").value
  );
}

// Define una función de comparación personalizada para buscar el enlace por su go.HashId
function findLinkById(hashId) {
  var linkArray = myDiagram.model.linkDataArray;
  for (var i = 0; i < linkArray.length; i++) {
    var link = linkArray[i];
    console.log(link)
    if (link.__gohashid === hashId) {
      return link;
    }
  }
  return null;
}

// Función para extraer nodos y relaciones del diagrama
function extractDiagramData(diagram) {
  const nodes = diagram.model.nodeDataArray; // Nodos del diagrama
  const links = diagram.model.linkDataArray; // Enlaces del diagrama

  const classes = nodes.map(node => ({
    name: node.name,
    properties: node.properties.map(prop => ({
      name: prop.name,
      type: mapTypeToJava(prop.type),
    })),
  }));

  const relationships = links.map(link => {
    const fromNode = diagram.model.findNodeDataForKey(link.from); // Nodo origen
    const toNode = diagram.model.findNodeDataForKey(link.to); // Nodo destino

    return {
      from: fromNode.name, // Clase origen
      to: toNode.name, // Clase destino
      type: link.relationship || "association", // Tipo de relación
      multiplicityFrom: link.multiplicityFrom || "1", // Multiplicidad origen
      multiplicityTo: link.multiplicityTo || "1", // Multiplicidad destino
      comment: link.comment || "", // Comentario adicional
    };
  });

  return { classes, relationships };
}


// Función para mapear tipos UML a tipos Java
function mapTypeToJava(type) {
  const typeMap = {
    String: "String",
    Integer: "int",
    Long: "Long",
    BigDecimal: "java.math.BigDecimal",
    Date: "java.util.Date",
    Float: "float",
    Double: "double",
    Boolean: "boolean",
  };
  return typeMap[type] || "String"; //usara string por defecto 
}

// Función para generar el código de una entidad
function generateEntity(classData, relationships) {
  const { name, properties } = classData;

  // Propiedades básicas de la entidad
  const fields = `
      @Id
      @GeneratedValue(strategy = GenerationType.IDENTITY)
      private Long id;
  ` + properties.map(
    prop => `    private ${prop.type} ${prop.name};\n`
  ).join("");

  // Herencia (si aplica)
  const inheritanceAnnotation = relationships.some(rel => rel.type === "generalization" && rel.from === name)
    ? "@Inheritance(strategy = InheritanceType.JOINED)"
    : "";

  // Generar relaciones
  const relationshipFields = relationships
    .filter(rel => rel.from === name || rel.to === name)
    .map(rel => {
      if (rel.type === "aggregation" || rel.type === "composition") {
        if (rel.from === name) {
          // Relación OneToMany
          return `
      @OneToMany(mappedBy = "${name.toLowerCase()}", cascade = CascadeType.ALL, orphanRemoval = true)
      private List<${rel.to}> ${rel.to.toLowerCase()}s = new ArrayList<>();
          `;
        } else {
          // Relación inversa ManyToOne
          return `
      @ManyToOne
      @JoinColumn(name = "${rel.from.toLowerCase()}_id")
      private ${rel.from} ${rel.from.toLowerCase()};`;
        }
      } else if (rel.type === "association") {
        // Asociación básica
        return `
      @OneToOne
      @JoinColumn(name = "${rel.to.toLowerCase()}_id")
      private ${rel.to} ${rel.to.toLowerCase()};`;
      }
      return "";
    })
    .join("");

  // Métodos Getters y Setters
  const gettersSetters = properties.map(
    prop => `
    public ${prop.type} get${capitalize(prop.name)}() {
        return ${prop.name};
    }

    public void set${capitalize(prop.name)}(${prop.type} ${prop.name}) {
        this.${prop.name} = ${prop.name};
    }
    `
  ).join("");

  // Código final de la entidad
  return `
package com.example.demo.entity;

import jakarta.persistence.*;
import java.util.List;
import java.util.ArrayList;

@Entity
${inheritanceAnnotation}
public class ${name} {

${fields}

${relationshipFields}

${gettersSetters}

}
  `;
}


// Capitalizar nombres de métodos y atributos
function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

// Asignar la funcionalidad al botón
$(document).ready(() => {
  $("#generateBackend").click(() => {
    generateSpringBootProject(myDiagram);
  });
});
// Función para generar un repositorio
function generateRepository(className) {
  return `
package com.example.demo.repository;

import com.example.demo.entity.${className};
import org.springframework.data.jpa.repository.JpaRepository;

public interface ${className}Repository extends JpaRepository<${className}, Long> {
}
  `;
}

// Función para generar un servicio
function generateService(className) {
  const lowerName = className.charAt(0).toLowerCase() + className.slice(1);
  return `
package com.example.demo.service;

import com.example.demo.entity.${className};
import com.example.demo.repository.${className}Repository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ${className}Service {

    @Autowired
    private ${className}Repository ${lowerName}Repository;

    public List<${className}> findAll() {
        return ${lowerName}Repository.findAll();
    }

    public ${className} save(${className} ${lowerName}) {
        return ${lowerName}Repository.save(${lowerName});
    }

    public void deleteById(Long id) {
        ${lowerName}Repository.deleteById(id);
    }
}
  `;
}

// Función para generar un controlador
function generateController(className) {
  const lowerName = className.charAt(0).toLowerCase() + className.slice(1);
  return `
package com.example.demo.controller;

import com.example.demo.entity.${className};
import com.example.demo.service.${className}Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.validation.annotation.Validated;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/${lowerName}s")
@Validated
public class ${className}Controller {

    @Autowired
    private ${className}Service ${lowerName}Service;

    @GetMapping
    public List<${className}> getAll${className}s() {
        return ${lowerName}Service.findAll();
    }

    @PostMapping
    public ${className} create${className}(@Valid @RequestBody ${className} ${lowerName}) {
        return ${lowerName}Service.save(${lowerName});
    }

    @DeleteMapping("/{id}")
    public void delete${className}(@PathVariable Long id) {
        ${lowerName}Service.deleteById(id);
    }
}
  `;
}


// Modificar la generación del proyecto para incluir estas capas
function generateSpringBootProject(diagram) {
  const data = extractDiagramData(diagram);
  const zip = new JSZip();

  // Crear estructura de carpetas
  const srcMainJava = zip.folder("src/main/java/com/example/demo");
  const srcMainResources = zip.folder("src/main/resources");

  // Generar entidades
  const entitiesFolder = srcMainJava.folder("entity");
  data.classes.forEach(cls => {
    const entityCode = generateEntity(cls, data.relationships);// pasa las relaciones
    entitiesFolder.file(`${cls.name}.java`, entityCode);
  });

  // Generar repositorios
  const repositoriesFolder = srcMainJava.folder("repository");
  data.classes.forEach(cls => {
    const repositoryCode = generateRepository(cls.name);
    repositoriesFolder.file(`${cls.name}Repository.java`, repositoryCode);
  });

  // Generar servicios
  const servicesFolder = srcMainJava.folder("service");
  data.classes.forEach(cls => {
    const serviceCode = generateService(cls.name);
    servicesFolder.file(`${cls.name}Service.java`, serviceCode);
  });

  // Generar controladores
  const controllersFolder = srcMainJava.folder("controller");
  data.classes.forEach(cls => {
    const controllerCode = generateController(cls.name);
    controllersFolder.file(`${cls.name}Controller.java`, controllerCode);
  });

  // Generar otros archivos básicos como Application.java
  srcMainJava.file(
    "DemoApplication.java",
    `
package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DemoApplication {
    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }
}
    `
  );

  // Generar archivo application.properties
  srcMainResources.file(
    "application.properties",
    `
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=password
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
`
  );

  // Descargar el ZIP
  zip.generateAsync({ type: "blob" }).then(content => {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(content);
    link.download = "spring-boot-project.zip";
    link.click();
  });
}

// Capitalizar nombres de métodos y atributos
function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

// Asignar la funcionalidad al botón
$(document).ready(() => {
  $("#generateBackend").click(() => {
    generateSpringBootProject(myDiagram);
  });
});
