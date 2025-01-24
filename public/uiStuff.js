

var baseurl = "http://54.242.7.166"


$(document).ready(function () {
  // Obtener la referencia al elemento contenedor de la lista
  const listaDiagramas = document.getElementById("lista-diagramas");

  // Ocultar el div del diagrama al cargar la página
  $("#myDiagramDiv").hide();

  // Mostrar el modal de inicio de sesión al cargar la página
  $("#loginModal").css("display", "block");


  // Cerrar el modal de inicio de sesión cuando se hace clic en el botón de cierre (x)
  $(".close").click(function () {
    $(".modal").css("display", "none");
  });

  // Mostrar el modal de registro y ocultar el modal de inicio de sesión al hacer clic en "Regístrate aquí"
  $("#showRegistration").click(function () {
    $("#loginModal").css("display", "none");
    $("#registrationModal").css("display", "block");
  });

  // Mostrar el modal de inicio de sesión y ocultar el modal de registro al hacer clic en "Inicia sesión aquí"
  $("#showLogin").click(function () {
    $("#registrationModal").css("display", "none");
    $("#loginModal").css("display", "block");
  });
  // Detectar clic en el botón eliminar
  $(document).on("click", ".eliminar-diagrama", function () {
    var diagramaId = $(this).data("id");  // Obtener el ID del diagrama
    eliminarDiagrama(diagramaId);  // Llamar a la función para eliminar el diagrama
  });

  // Enviar el formulario de inicio de sesión
  $("#loginForm").submit(function (event) {
    event.preventDefault();
    // Obtener los valores del formulario de inicio de sesión
    var loginUsername = $("#loginUsername").val();
    var loginPassword = $("#loginPassword").val();
    var userData = {
      username: loginUsername,
      password: loginPassword,
    };
    // Enviar la solicitud AJAX al servidor
    $.ajax({
      url: baseurl +"user/login", // Ruta del endpoint de registro en tu servidor
      type: "POST",
      data: JSON.stringify(userData),
      contentType: "application/json",
      success: function (response) {
        // Procesar la respuesta del servidor en caso de éxito
        localStorage.setItem("token", response.token);
        // Ocultar el modal de inicio de sesión
        $("#loginModal").css("display", "none");
        // Buscar diagramas creados anteriomente por el usuario
        obtenerDiagramas();
        // Mostrar el nuevo modal para crear el diagrama
        $("#crearDiagramaModal").css("display", "block");
      },
      error: function (error) {
        // Procesar errores de la solicitud al servidor
        console.error("Error en el login:", error);
      },
    });
  });

  // Enviar el formulario de registro
  $("#registrationForm").submit(function (event) {
    event.preventDefault();

    // Obtener los valores del formulario de registro
    var username = $("#username").val();
    var email = $("#email").val();
    var password = $("#password").val();
    // Crear un objeto con los datos del usuario a enviar
    var userData = {
      username: username,
      email: email,
      password: password,
    };

    // Enviar la solicitud AJAX al servidor
    $.ajax({
      url: baseurl +"user/registro", // Ruta del endpoint de registro en tu servidor
      type: "POST",
      data: JSON.stringify(userData),
      contentType: "application/json",
      success: function (response) {
        // Procesar la respuesta del servidor en caso de éxito
        console.log("Registro exitoso:", response);
      },
      error: function (error) {
        // Procesar errores de la solicitud al servidor
        console.error("Error en el registro:", error);
      },
    });

    // Aquí puedes realizar la lógica de registro

    // Cerrar el modal de registro
    $("#registrationModal").css("display", "none");
  });

  $("#crearDiagramaBtn").click(function () {
    $.ajax({
      url: "diagrams/generarCode",
      method: "GET",
      success: function (response) {
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
        // guardar diagrama en la nube
        var diagramData = {
          copiesArrays: true,
          copiesArrayObjects: true,
          linkFromPortIdProperty: "fromPort",
          linkToPortIdProperty: "toPort",
          nodeDataArray: nodedata,
          linkDataArray: linkdata,
        }
        const token = localStorage.getItem("token");
        // Enviar los datos del diagrama al servidor
        $.ajax({
          url: "diagrams/guardarDiagrama",
          method: "POST",
          data: JSON.stringify({
            diagramData: JSON.stringify(diagramData),
            roomId: response,
          }),
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token, // Agregar el token al encabezado de autorización
          },
          success: function (response) {
            console.log(response)
            // Manejar la respuesta del servidor si es necesario
            cargarDiagrama(response.data, response._id, response.roomId, response.name);
          },
          error: function (error) {
            // Manejar errores de comunicación con el servidor
          },
        });
      },
      error: function (error) {
        // Manejar errores de comunicación con el servidor
      },
    });

  });

  // Ingresa a un room a traves de un codigo
  $("#joinDiagramaBtn").click(function () {
    // Obtén el valor del roomId del input correspondiente
    const roomId = $("#roomCode").val();
    const token = localStorage.getItem("token");
    $.ajax({
      url: "diagrams/sala/" + roomId,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token, // Agregar el token al encabezado de autorización
      },
      success: function (response) {
        cargarDiagrama(
            response.diagrama.data,
            response.diagrama._id,
            roomId,
            response.diagrama.name);
        console.log(response.tipoUser);
        // Cierra el modal de creación de diagrama
        if(response.tipoUser=='lector'){
          myDiagram.isReadOnly = true;
        }

        $("#crearDiagramaModal").modal("hide");
      },
      error: function (error) {
        // Manejar errores de comunicación con el servidor
        console.error(error);
        alert("Ocurrió un error al obtener el diagrama.");
      },
    });
  });

  /* add listen when i click an item from list
  $("#lista").on("click", "li", function () {
    var diagrama = $(this).attr("data-diagrama");
    var id = $(this).attr("data-id");
    var room_id = $(this).attr("room-id");
    var name = $(this).attr("name");
    cargarDiagrama(diagrama, id, room_id, name); // Cargar el diagrama de GoJS

    // Realizar la acción deseada, como mostrar el diagrama correspondiente
    //console.log("Mostrar diagrama:", diagrama);
  });*/
  // Escuchar los clicks en la lista para abrir o eliminar un diagrama
  $("#lista").on("click", "li", function (event) {
    // Verifica si se hizo clic en el botón "Eliminar"
    if ($(event.target).hasClass("eliminar-diagrama")) {
      event.stopPropagation(); // Evitar que se dispare el evento de abrir el diagrama

      var id = $(this).attr("data-id"); // Obtener el ID del diagrama a eliminar
      var room_id = $(this).attr("room-id"); // Obtener el room ID (si es necesario)

      // Confirmar si el usuario quiere eliminar el diagrama
      if (confirm("¿Estás seguro de que deseas eliminar este diagrama?")) {
        eliminarDiagrama(id, room_id); // Llamar a la función para eliminar el diagrama
        $(this).remove(); // Eliminar el elemento visualmente de la lista
      }

      return; // Salir de la función para evitar que se abra el diagrama
    }

    // Si no es un clic en el botón "Eliminar", abrir el diagrama
    var diagrama = $(this).attr("data-diagrama");
    var id = $(this).attr("data-id");
    var room_id = $(this).attr("room-id");
    var name = $(this).attr("name");

    cargarDiagrama(diagrama, id, room_id, name); // Cargar el diagrama
  });

  // Función para eliminar el diagrama en el servidor
  function eliminarDiagrama(id, room_id) {
    const token = localStorage.getItem("token");

    $.ajax({
      url: baseurl + "diagrams/" + id, // Endpoint para eliminar el diagrama
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token, // Agregar el token al encabezado
      },
      success: function (response) {
        console.log("Diagrama eliminado exitosamente");
      },
      error: function (error) {
        console.error("Error al eliminar el diagrama:", error);
      },
    });
  }


  $("#download").on("click", downloadDiagram);

  $("#guestButton").click( function(){
    $("#myDiagramDiv").hide();
    var roomId = myDiagram.roomId;
    const token = localStorage.getItem("token");
    $.ajax({
      url: `/api/room/${roomId}/users`,// Ruta del endpoint de registro en tu servidor
      type: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token, // Agregar el token al encabezado de autorización
      },
      success: function (response) {
        console.log(response.usernames, response.role)
        document.getElementById("guestList").innerHTML = '';
        response.usernames.forEach((user)=>{
          console.log(user.username);
          const listItem = document.createElement('li');
          listItem.textContent = user.username;
          listItem.dataset.userId = user.id;

          const expelButton = document.createElement('button');
          expelButton.textContent = 'Expulsar';
          expelButton.classList.add('expelButton');
          expelButton.disabled = response.role != 'anfitrion'; // Deshabilitar el botón si el rol es 'anfitrion'

          listItem.appendChild(expelButton);

          const roleSelect = document.createElement('select');
          roleSelect.value = (user.role!='anfitrion')?user.role:'-';
          roleSelect.classList.add('roleSelect');
          roleSelect.disabled = response.role != 'anfitrion';

          const editorOption = document.createElement('option');
          editorOption.value = 'editor';
          editorOption.textContent = 'Editor';
          roleSelect.appendChild(editorOption);

          const lectorOption = document.createElement('option');
          lectorOption.value = 'lector';
          lectorOption.textContent = 'Lector';
          roleSelect.appendChild(lectorOption);

          listItem.appendChild(roleSelect);

          const editButton = document.createElement('button');
          editButton.textContent = 'Editar';
          editButton.classList.add('editButton');
          editButton.disabled = response.role != 'anfitrion';
          listItem.appendChild(editButton);

          if (user.role === 'anfitrion') {
            const banner = document.createElement('span');
            banner.innerHTML = '¡Es el <span style="font-weight: bold;">anfitrión</span>!';
            banner.style.color = 'green';
            listItem.appendChild(banner);
          }else {
            const banner = document.createElement('span');
            banner.innerHTML = '<span style="font-weight: bold;">Invitado</span>';
            banner.style.color = 'green';
            listItem.appendChild(banner);
          }
          // Obtener el rol del usuario seleccionado (por ejemplo, 'editor')
          const selectedRole = user.role;

// Recorrer las opciones del select y establecer la opción seleccionada
          for (let i = 0; i < roleSelect.options.length; i++) {
            const option = roleSelect.options[i];

            if (option.value === selectedRole) {
              option.selected = true;
              break;
            }
          }
          $("#guestList").append(listItem);
        });
      },
      error: function (error) {
        console.error("Error :", error);
      },
    });
    var guestModal = document.getElementById("guestModal");
    guestModal.style.display = "block";
  })


  function getNodeByName(name){
    for (const node of myDiagram.model.nodeDataArray) {
      if(node.name=== name){
        return node;
      }
    }
  }

  // Asigna un controlador de eventos al botón de carga
  $("#load-button").on("click", function () {
    //configDiagrama("mi-sala");
    // Obtiene el elemento de entrada de archivo
    var fileInput = document.getElementById("file-input");
    // Verifica si se seleccionó un archivo
    if (fileInput.files.length > 0) {
      // Obtiene el primer archivo seleccionado
      var file = fileInput.files[0];
      var fileExtension = "";
      if (fileInput.value.lastIndexOf(".") > 0) {
        fileExtension = fileInput.value.substring(
          fileInput.value.lastIndexOf(".") + 1,
          fileInput.value.length
        );
      }
      // Crea un lector de archivos
      var reader = new FileReader();

      reader.readAsText(file);
      if (fileExtension.toLowerCase() == "pgsql" ||fileExtension.toLowerCase() == "sql") {
        // Define el controlador de evento para cuando se haya cargado el archivo
        reader.onload = function (e) {
          $.ajax({
            url: "diagrams/generarCode",
            method: "GET",
            success: function (response) {
              const token = localStorage.getItem("token");
              // Enviar los datos del diagrama al servidor
              $.ajax({
                url: "diagrams/guardarDiagrama",
                method: "POST",
                data: JSON.stringify({
                  diagramData: JSON.stringify({}),
                  roomId: response,
                }),
                headers: {
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + token, // Agregar el token al encabezado de autorización
                },
                success: function (response) {
                  console.log(response)

                  // Manejar la respuesta del servidor si es necesario
                  cargarDiagrama(null, response._id, response.roomId, response.name);
                  const parserF = new NodeSQLParser.Parser();
                  var fileContent = e.target.result;
                  const ast = parserF.parse(fileContent);
                  const tableInfo = [];
                  const relationships = [];
                  extractTableInfo(ast, tableInfo);
                  extractRelationshipInfo(ast,relationships);
                  // Imprime la información de tabla y atributos
                  tableInfo.forEach((table, index) => {
                    console.log(`Tabla: ${table.tableName}`);
                    console.log("Atributos:");
                    var propertiesArray = [];
                    table.columns.forEach((column) => {
                      if (!column[0].includes("id")) {
                        var type = column[1];
                        switch (type) {
                          case "VARCHAR":
                            type = "String";
                            break;
                          case "INTEGER":
                            type = "Integer";
                            break;

                          case "DATE":
                            type = "Date";
                            break;
                          default:
                            type = "Type";
                            break;
                        }
                        propertiesArray.push({
                          name: column[0],
                          type: type,
                          visibility: "public",
                        });
                        console.log(`- ${column}`);
                      }
                    });
                    console.log("----------------------");

                    const key = getNewKey();
                    const newdata = {
                      key: key,
                      name: table.tableName,
                      properties: propertiesArray,
                      methods: [],
                      color: 0,
                    };
                    myDiagram.model.addNodeData(newdata);
                    myDiagram.updateAllTargetBindings();
                  });
                  relationships.forEach( (relation)=>{
                    const nodeFrom = getNodeByName(relation.tableName);
                    const nodeTo = getNodeByName(relation.referencedTable);
                    // Verifica si se encontraron ambos nodos
                    if (nodeTo !== null && nodeFrom !== null) {
                      // Crea un nuevo enlace entre los nodos
                      var link = { from: nodeFrom.key, to: nodeTo.key, relationship:"association",
                        multiplicityTo: "1..*", comment: "Comentario"};
                      myDiagram.model.addLinkData(link);
                      myDiagram.updateAllTargetBindings();
                    } else {
                      console.log("Nodos no encontrados");
                    }
                  });
                  $("#crearDiagramaModal").css("display", "none");
                  $("#myDiagramDiv").show();
                  },
                error: function (error) {
                  // Manejar errores de comunicación con el servidor
                },
              });
            },
            error: function (error) {
              // Manejar errores de comunicación con el servidor
            },
          });

        };
      } else if(fileExtension.toLowerCase() == "sql"){
        crearDiagramaSinDatos();
        // Define el controlador de evento para cuando se haya cargado el archivo
        reader.onload = function (e) {
          const parserF = new NodeSQLParser.Parser();
          var fileContent = e.target.result;
          const ast = parserF.parse(fileContent);
          const tableInfo = [];
          const relationships = [];
          extractTableInfo(ast, tableInfo);
          extractRelationshipInfo(ast,relationships);
          // Imprime la información de tabla y atributos
          tableInfo.forEach((table, index) => {
            console.log(`Tabla: ${table.tableName}`);
            console.log("Atributos:");
            var propertiesArray = [];
            table.columns.forEach((column) => {
              if (!column[0].includes("id")) {
                var type = column[1];
                switch (type) {
                  case "VARCHAR":
                    type = "String";
                    break;
                  case "INTEGER":
                    type = "Integer";
                    break;

                  case "DATE":
                    type = "Date";
                    break;
                  default:
                    type = "Type";
                    break;
                }
                propertiesArray.push({
                  name: column[0],
                  type: type,
                  visibility: "public",
                });
                console.log(`- ${column}`);
              }
            });
            console.log("----------------------");

            const key = getNewKey();
            const newdata = {
              key: key,
              name: table.tableName,
              properties: propertiesArray,
              methods: [],
              color: 0,
            };
            myDiagram.model.addNodeData(newdata);
            myDiagram.updateAllTargetBindings();
          });
          relationships.forEach( (relation)=>{
            const nodeFrom = getNodeByName(relation.tableName);
            const nodeTo = getNodeByName(relation.referencedTable);
            // Verifica si se encontraron ambos nodos
            if (nodeTo !== null && nodeFrom !== null) {
              // Crea un nuevo enlace entre los nodos
              var link = { from: nodeFrom.key, to: nodeTo.key, relationship:"association",
                multiplicityTo: "1..*",multiplicityFrom: "1..*", comment: "Comentario"};
              myDiagram.model.addLinkData(link);
              myDiagram.updateAllTargetBindings();
            } else {
              console.log("Nodos no encontrados");
            }
          });
          $("#crearDiagramaModal").css("display", "none");
          $("#myDiagramDiv").show();
        }
      }else{
        // Crea un lector de archivos
        //var reader = new FileReader();

        // Define el controlador de evento para cuando se haya cargado el archivo
        reader.onload = function (e) {
          // Obtiene el contenido del archivo como texto
          var fileContent = e.target.result;

          const token = localStorage.getItem("token");
          // Enviar los datos del diagrama al servidor
          $.ajax({
            url: "diagrams/guardarDiagrama",
            method: "POST",
            data: JSON.stringify({
              diagramData: fileContent,
            }),
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token, // Agregar el token al encabezado de autorización
            },
            success: function (response) {
              console.log(response);

              cargarDiagrama(
                response.data,
                response._id,
                response.roomId,
                response.name
              );

              // Manejar la respuesta del servidor si es necesario
              $("#crearDiagramaModal").css("display", "none");
              $("#myDiagramDiv").show();
            },
            error: function (error) {
              // Manejar errores de comunicación con el servidor
            },
          });
          // Actualiza el modelo del diagrama con el contenido del archivo
          //myDiagram.model = go.Model.fromJson(fileContent);
        };
      }
      // Lee el contenido del archivo como texto
      //reader.readAsText(file);
      //$("#crearDiagramaModal").css("display", "none");
      //$("#myDiagramDiv").show();
    }
  });

  $("#downloadPostgre").on("click", function () {
    // Ejemplo de uso
    var postgresqlScript = generatePostgreSQLScript();
    //console.log(postgresqlScript);
    // Crear un objeto Blob con el contenido del archivo
    var blob = new Blob([postgresqlScript], { type: "text/plain" });

    // Crear una URL para el objeto Blob
    var url = window.URL.createObjectURL(blob);

    // Crear un enlace de descarga
    var link = document.createElement("a");
    link.href = url;
    link.download = "script.pgsql";

    // Hacer clic en el enlace para iniciar la descarga
    link.click();

    // Liberar el objeto URL
    window.URL.revokeObjectURL(url);
  });

  $("#downloadMySQL").on("click", function () {
    // Ejemplo de uso
    var postgresqlScript = generateMySQLScript();
    //console.log(postgresqlScript);
    // Crear un objeto Blob con el contenido del archivo
    var blob = new Blob([postgresqlScript], { type: "text/plain" });

    // Crear una URL para el objeto Blob
    var url = window.URL.createObjectURL(blob);

    // Crear un enlace de descarga
    var link = document.createElement("a");
    link.href = url;
    link.download = "script.sql";

    // Hacer clic en el enlace para iniciar la descarga
    link.click();

    // Liberar el objeto URL
    window.URL.revokeObjectURL(url);
  });

  // Agrega eventos clic a los botones dentro de la lista de invitados
  $("#guestList").click(function(event) {
    var target = event.target;
    // Si se hizo clic en el botón de "Expulsar"
    if (target.classList.contains("expelButton")) {
    }

    if (target.classList.contains("editButton")) {
      var listItem = target.closest("li");
      var guestId = listItem.dataset.userId;
      var roleSelect = listItem.querySelector(".roleSelect");
      var selectedRole = roleSelect.value;

      // Lógica para el botón de "Editar" con el ID del invitado y el rol seleccionado
      console.log("ID del invitado:", guestId);
      console.log("Rol seleccionado:", selectedRole);
      const token = localStorage.getItem("token");
      $.ajax({
        url: "user/updateRole",
        type: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token, // Agregar el token al encabezado de autorización
        },
        data: JSON.stringify({
          newRole: selectedRole,
          guestId: guestId
        }),
        success: function (response) {
          myDiagram.socket.emit('actualizarRolDiagrama', {newRole: response.role, socketId: response.socketId});
        },
        error: function (error) {
          console.log(error)
        },
      });
      // Lógica para el botón de "Editar"
    }
  });

  $("#downloadImg").click(function(){
    // Genera la imagen del diagrama
    const imageData = myDiagram.makeImageData({ background: "white" });

    // Crea un enlace de descarga
    const link = document.createElement("a");
    link.href = imageData;
    link.download = "diagram.png"; // Nombre de archivo para la descarga

    // Simula un clic en el enlace de descarga
    link.click();
  });

  $("#copyButton").click(function(){
    const textarea = document.createElement("textarea");
    textarea.value = myDiagram.roomId;
    // Agrega el textarea al cuerpo del documento
    document.body.appendChild(textarea);
    // Selecciona el contenido del textarea
    textarea.select();
    // Copia el contenido al portapapeles
    document.execCommand("copy");
    // Remueve el textarea temporal
    document.body.removeChild(textarea);
    // Puedes mostrar una notificación o realizar otras acciones después de copiar el código
    console.log("Código copiado al portapapeles");
    alert("Código copiado");

  });

  $("#addNode").click(function(){
    const key = getNewKey();
    const newdata = {
      key: key,
      name: "Nueva Tabla",
      properties: [
        { name: "atributo", type: "String", visibility: "public" },
      ],
      methods: [
        {
          name: "metodo",
          parameters: [{ name: "parametro", type: "Currency" }],
          visibility: "public",
        },
      ],
      //group: sel.key,
      loc: "400 100",
      color: 0,
    };
    myDiagram.model.addNodeData(newdata);
    myDiagram.commitTransaction("add node");
    const newnode = myDiagram.findNodeForData(newdata);
    myDiagram.select(newnode);
    myDiagram.commandHandler.editTextBlock();
    myDiagram.commandHandler.scrollToPart(newnode);
    const socket = myDiagram.socket;
    if (socket) {
      console.log("socket verificado");
      socket.emit("createNode", {
        room: myDiagram.roomId,
        data: newdata,
      });
    }
  });


  // Agrega un evento clic fuera del modal para cerrarlo
  window.addEventListener("click", function(event) {
    var guestModal = document.getElementById("guestModal");
    if (event.target === guestModal) {
      // Oculta el modal si se hizo clic fuera de él
      guestModal.style.display = "none";
      $("#myDiagramDiv").show();
    }
  });


  ///////////
  // Función para descargar el diagrama como archivo JSON
  function downloadDiagram() {
    // Obtén el objeto JSON del diagrama
    const diagramData = myDiagram.model.toJson();
    // Crea un objeto Blob a partir de los datos del diagrama
    const blob = new Blob([diagramData], { type: "application/json" });
    // Genera una URL para el objeto Blob
    const url = window.URL.createObjectURL(blob);
    // Crea un enlace temporal para descargar el archivo
    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    var nameDiagram = document.getElementById("diagram-name");
    var name = nameDiagram.textContent;
    downloadLink.download = `${name}.json`;
    // Simula el clic en el enlace de descarga
    downloadLink.click();
  }

  function cargarDiagrama(diagrama, id, roomId, name) {

    configDiagrama(roomId);
    var nameDiagram = document.getElementById("diagram-name");
    nameDiagram.textContent = name;
    var delay = 1000; // Período de tiempo de inactividad en milisegundos
    var timeoutId;
    nameDiagram.addEventListener("input", function (event) {
      clearTimeout(timeoutId); // Limpiar el temporizador anterior
      timeoutId = setTimeout(function () {
        // Obtén el nuevo nombre del diagrama
        const newName = event.target.textContent.trim();
        // Actualiza el nombre del diagrama en tu sistema o realiza otras acciones necesarias
        console.log("Nuevo nombre del diagrama:", newName);
        // Realiza una llamada a la API para actualizar el nombre del diagrama en tu base de datos
        myDiagram.socket.emit("changeName", {
          roomId: myDiagram.roomId,
          newName,
          id,
        });
      }, delay);
    });

    nameDiagram.addEventListener("keydown", function (event) {
      // Evita que se realicen saltos de línea al presionar Enter
      if (event.keyCode === 13) {
        event.preventDefault();
      }
    });

    // Manejar evento de agregar nuevo nodo recibido del servidor
    myDiagram.socket.on("actualizarName", ({ newName }) => {
      // Agregar el nuevo nodo al diagrama local
      nameDiagram.textContent = newName;
    });

    // Cargar el modelo de diagrama desde el objeto JSON
    if(diagrama!=null){
      myDiagram.model = go.Model.fromJson(diagrama);
    }


    const diagramaDiv = $("<div>")
      .attr("id", "myDiagramDiv")
      .data("diagrama-id", JSON.stringify(id));
    $("#myDiagramDiv").append(diagramaDiv);
    $("#crearDiagramaModal").css("display", "none");
    $("#myDiagramDiv").show();

    // Suscribirse al evento "Changed" del diagrama
    myDiagram.addModelChangedListener(function (evt) {
      if (evt.isTransactionFinished) {
        var diagramData = myDiagram.model.toJson();
        const token = localStorage.getItem("token");
        $.ajax({
          url: "diagrams/guardar-diagrama",
          type: "POST",
          data: JSON.stringify({
            diagramData: diagramData,
            id: id,
          }),
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token, // Agregar el token al encabezado de autorización
          },
          success: function (response) {
            var messageDiv = document.getElementById("messageDiv");
            messageDiv.textContent = "guardando...";
            messageDiv.style.display = "block";
            setTimeout(function () {
              messageDiv.style.display = "none";
            }, 3000); // Ocultar después de 3 segundos (ajusta el tiempo según tus necesidades)
          },
          error: function (error) {
            // Manejar los errores si es necesario
            console.error(error);
          },
        });
      }
    });
    
    myDiagram.model.addChangedListener(function (e) {
      // Detectar cambios en las propiedades de un enlace
      if (e.change === go.ChangedEvent.Property && e.propertyName === "relationship") {
        console.log("Tipo de relación cambiado:", e.object);
    
        const token = localStorage.getItem("token");
        var diagramData = myDiagram.model.toJson();
    
        // Guardar automáticamente los cambios en el servidor
        $.ajax({
          url: "diagrams/guardar-diagrama",
          type: "POST",
          data: JSON.stringify({
            diagramData: diagramData,
            id: id,
          }),
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          success: function (response) {
            console.log("Cambio en relación guardado exitosamente.");
          },
          error: function (error) {
            console.error("Error al guardar el cambio en relación:", error);
          },
        });
      }
    });
    
    init();

    const token = localStorage.getItem("token");
    $.ajax({
      url: "user/getUser",
      type: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token, // Agregar el token al encabezado de autorización
      },
      success: function (response) {
        activar(response);
      },
      error: function (error) {
        console.error(error);
      },
    });

  }

  function activar(username){
    // Captura los eventos de movimiento del mouse y envía las coordenadas al servidor
    document.addEventListener("mousemove", (event) => {
      const { clientX, clientY } = event;
      myDiagram.socket.emit("mouseMove", {
        x: clientX,
        y: clientY,
        roomId: myDiagram.roomId,
        username:username
      });
    });
  }
  // Función para mostrar los diagramas en la lista
  function mostrarDiagramas(diagramas) {
    // Limpiar la lista
    //listaDiagramas.innerHTML = "";

    // Iterar sobre cada diagrama y crear un elemento de lista para cada uno
    diagramas.forEach((diagrama) => {
      agregarElementoLista(
        diagrama.name,
        JSON.stringify(diagrama.data),
        diagrama._id,
        diagrama.roomId
      );
    });
  }

  // Llamada a la API para obtener los diagramas del usuario
  function obtenerDiagramas() {
    const token = localStorage.getItem("token");
    $.ajax({
      url: `/diagrams/`,
      method: "GET",
      headers: {
        Authorization: "Bearer " + token, // Agregar el token al encabezado de autorización
      },
      success: function (response) {
        const diagramas = response.diagramas;
        mostrarDiagramas(diagramas);
      },
      error: function (error) {
        console.error("Error al obtener los diagramas:", error);
      },
    });
  }

  /*/function agregarElementoLista(texto, diagrama, id, roomId) {
    var elemento = $("<li>").addClass("list-group-item").text(texto);
    elemento.attr("data-diagrama", diagrama); // Agregar el atributo de datos
    elemento.attr("data-id", id); // Agregar el atributo de datos
    elemento.attr("room-id", roomId); // Agregar el atributo de datos
    elemento.attr("name", texto); // Agregar el atributo de datos
    $("#lista").append(elemento);
  }*/

  /*function agregarElementoLista(texto, diagrama, id, roomId) {
    var elemento = $("<li>").addClass("list-group-item d-flex justify-content-between align-items-center");
    
    elemento.attr("data-diagrama", diagrama); // Agregar el atributo de datos
    elemento.attr("data-id", id); // Agregar el atributo de datos
    elemento.attr("room-id", roomId); // Agregar el atributo de datos
    elemento.attr("name", texto); // Agregar el atributo de datos
    
    // Crear el contenido del elemento con el botón eliminar
    elemento.html(`
      <span>${texto}</span>
      <button class="btn btn-danger btn-sm eliminar-diagrama" data-id="${id}">Eliminar</button>
    `);
    
    $("#lista").append(elemento);
  }*/
  function agregarElementoLista(texto, diagrama, id, roomId) {
    var elemento = $("<li>").addClass("list-group-item").text(texto);
    
      // Atributos de datos necesarios
    elemento.attr("data-diagrama", diagrama); // Agregar el diagrama
    elemento.attr("data-id", id); // ID del diagrama
    elemento.attr("room-id", roomId); // Room ID
    elemento.attr("name", texto); // Nombre del diagrama
    
      // Crear el botón de eliminar
    var botonEliminar = $("<button>")
        .addClass("eliminar-diagrama btn btn-danger btn-sm")
        .text("Eliminar");
    
      // Agregar el botón de eliminar al elemento de la lista
    elemento.append(botonEliminar);
    
      // Agregar el elemento a la lista
    $("#lista").append(elemento);
  }
    
    
  // Función para eliminar un diagrama
  function eliminarDiagrama(id) {
    const token = localStorage.getItem("token");

    if (confirm("¿Estás seguro de que deseas eliminar este diagrama?")) {
      // Solicitud para eliminar el diagrama
      $.ajax({
        url: `/diagrams/eliminar/${id}`,  // La URL de tu servidor para eliminar el diagrama
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + token, // Agregar el token al encabezado de autorización
        },
        success: function (response) {
          // Eliminar el diagrama de la lista en la interfaz
          $(`#lista li[data-id='${id}']`).remove();
          console.log("Diagrama eliminado:", response);
        },
        error: function (error) {
          console.error("Error al eliminar el diagrama:", error);
        },
      });
    }
  }


  function getNewName(name, index){
    const count = myDiagram.model.nodeDataArray.slice(index).filter(obj => obj.name === name).length;
    if(count>1){
      return `${name}${count-1}`;
    }
    return name
  }
  // Recorre los nodos del diagrama y genera comandos SQL para crear tablas
  function generateTableCommands() {
    var tableCommands = [];

    myDiagram.model.nodeDataArray.forEach(function (node,index) {
      var tableName = getNewName(node.name, index); // Nombre de la tabla
      var attributes = node.properties; // Atributos de la tabla

      var createTableCommand =
          "CREATE TABLE " + tableName.replace(/\s/g, "") + "(\n";
      createTableCommand +=
        "id_" + tableName.replace(/\s/g, "") + " " + "BIGSERIAL PRIMARY KEY,\n";
      attributes.forEach(function (attribute) {
        var type = attribute.type;
        switch (type.toUpperCase()) {
          case "STRING":
            type = "VARCHAR(40)";
            break;
          case "INTEGER":
            type = type.toUpperCase();
            break;

          case "DATE":
            type = type.toUpperCase();
            break;
          default:
            type = "VARCHAR(40)";
            break;
        }
        createTableCommand += attribute.name.replace(/\s/g, "") + " " + type;

        createTableCommand += ",\n";
      });

      createTableCommand = createTableCommand.slice(0, -2); // Elimina la última coma y espacio
      createTableCommand += ");\n";
      tableCommands.push(createTableCommand);
    });

    return tableCommands;
  }

  function generateTableCommandsMySQL() {
    var tableCommands = [];

    myDiagram.model.nodeDataArray.forEach(function (node,index) {
      var tableName = getNewName(node.name, index); // Nombre de la tabla
      var attributes = node.properties; // Atributos de la tabla

      var createTableCommand =
          "CREATE TABLE " + tableName.replace(/\s/g, "") + " (\n";
      createTableCommand +=
          "id_" + tableName.replace(/\s/g, "") + " " + "INT AUTO_INCREMENT PRIMARY KEY, \n";
      attributes.forEach(function (attribute) {
        var type = attribute.type;
        switch (type.toUpperCase()) {
          case "STRING":
            type = "VARCHAR(40)";
            break;
          case "INTEGER":
            type = 'INT';
            break;

          case "DATE":
            type = type.toUpperCase();
            break;
          default:
            type = "VARCHAR(40)";
            break;
        }
        createTableCommand += attribute.name.replace(/\s/g, "") + " " + type;

        createTableCommand += ",\n";
      });

      createTableCommand = createTableCommand.slice(0, -2); // Elimina la última coma y espacio
      createTableCommand += ");\n";
      tableCommands.push(createTableCommand);
    });

    return tableCommands;
  }

  // Recorre los enlaces del diagrama y genera comandos SQL para crear relaciones entre tablas
  function generateRelationshipCommands() {
    var relationshipCommands = [];

    myDiagram.model.linkDataArray.forEach(function (link) {
      var fromTableName = myDiagram.model.findNodeDataForKey(link.from).name; // Nombre de la tabla de origen
      var toTableName = myDiagram.model.findNodeDataForKey(link.to).name; // Nombre de la tabla de destino

      var createRelationshipCommand =
        "ALTER TABLE " +fromTableName + " ADD COLUMN " + "id_" + toTableName +
        " BIGSERIAL;";
      var createRelationshipCommand2 =
          "ALTER TABLE " + fromTableName +
          " ADD CONSTRAINT " + "id_" + toTableName +
          " FOREIGN KEY " + `(id_${toTableName})` +
          " REFERENCES " + toTableName + "(" + "id_" + toTableName + ")"+
          " ON DELETE CASCADE;";

      relationshipCommands.push(createRelationshipCommand,createRelationshipCommand2);
    });

    return relationshipCommands;
  }


  function generateRelationshipCommandsMySQL() {
    var relationshipCommands = [];

    myDiagram.model.linkDataArray.forEach(function (link) {
      var fromTableName = myDiagram.model.findNodeDataForKey(link.from).name; // Nombre de la tabla de origen
      var toTableName = myDiagram.model.findNodeDataForKey(link.to).name; // Nombre de la tabla de destino

      var createRelationshipCommand =
          "ALTER TABLE " +fromTableName + " ADD COLUMN " + "id_" + toTableName +
          " INT;";
      var createRelationshipCommand2 =
          "ALTER TABLE " + fromTableName +
          " ADD CONSTRAINT " + "id_" + toTableName +
          " FOREIGN KEY " + `(id_${toTableName})` +
          " REFERENCES " + toTableName + "(" + "id_" + toTableName + ")"+
          " ON DELETE CASCADE;";

      relationshipCommands.push(createRelationshipCommand,createRelationshipCommand2);
    });

    return relationshipCommands;
  }

  // Genera el script completo de PostgreSQL
  function generatePostgreSQLScript() {
    var tableCommands = generateTableCommands();
    var relationshipCommands = generateRelationshipCommands();
    var script = "";
    tableCommands.forEach(function (command) {
      script += command + "\n";
    });
    script += "\n";
    relationshipCommands.forEach(function (command) {
      script += command + "\n";
    });
    return script;
  }

  function generateMySQLScript() {
    var tableCommands = generateTableCommandsMySQL();
    var relationshipCommands = generateRelationshipCommandsMySQL();
    var script = "";
    tableCommands.forEach(function (command) {
      script += command + "\n";
    });
    script += "\n";
    relationshipCommands.forEach(function (command) {
      script += command + "\n";
    });
    return script;
  }

  function extractTableInfo(node, tableInfo) {
    if (
      node &&
      node.type === "create" &&
      node.table &&
      node.create_definitions
    ) {
      const tableName = node.table[0].table;
      console.log(tableName, node);
      var columns = node.create_definitions.map((definition) => [
        definition.column.column,
        definition.definition.dataType,
      ]);
      tableInfo.push({ tableName, columns });
    }

    for (const key in node) {
      if (node.hasOwnProperty(key) && typeof node[key] === "object") {
        extractTableInfo(node[key], tableInfo);
      }
    }
  }

  function extractRelationshipInfo(ast,relationships){
    ast.ast.forEach((statement) => {
      if (statement.type === 'create' && statement.as === null && statement.create_definitions) {
        // Estructura CREATE TABLE
        const tableName = statement.table[0].table;
        statement.create_definitions.forEach((definition) => {
          if (definition.resource === 'column' && definition.column && definition.column.column) {
            const columnName = definition.column.column;
            if (definition.definition.suffix && definition.definition.suffix.includes('foreign key')) {
              relationships.push({
                tableName: tableName,
                foreignKey: columnName,
                // Agregar más detalles de la relación si es necesario
              });
            }
          }
        });
      } else if (statement.type === 'alter' && statement.table && statement.expr && statement.expr[0].create_definitions &&
          statement.expr[0].create_definitions.constraint_type=="FOREIGN KEY") {
        // Estructura ALTER TABLE
        const tableName = statement.table[0].table;

        const foreignKey = statement.expr[0].create_definitions;
        const foreignKeyName = foreignKey.constraint;
        const referencedTable = foreignKey.reference_definition.table[0].table;
        const referencedColumn = foreignKey.reference_definition.definition[0].column;

        // Agregar la relación a la lista
        relationships.push({
          tableName: tableName,
          foreignKey: foreignKeyName,
          referencedTable: referencedTable,
          referencedColumn: referencedColumn,
        });
      }
    });

  }
});
