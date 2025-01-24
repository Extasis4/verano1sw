function parseXMIToDiagram(xmiContent) {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmiContent, "application/xml");

    // Validar si el archivo XMI es correcto
    const xmiHeader = xmlDoc.querySelector("XMI");
    if (!xmiHeader) {
      console.error("Archivo XMI no válido.");
      return;
    }

    // Procesar las clases
    const classes = Array.from(xmlDoc.querySelectorAll("UML\\:Class, Class")).map((cls) => {
      return {
        key: cls.getAttribute("xmi.id"),
        name: cls.getAttribute("name") || "Unnamed Class",
        properties: extractProperties(cls),
        methods: extractMethods(cls),
        loc: "0 0", // Posición inicial genérica
      };
    });

    if (classes.length === 0) {
      console.warn("No se encontraron clases en el archivo XMI.");
    }

    // Procesar las asociaciones
    const associations = Array.from(xmlDoc.querySelectorAll("UML\\:Association, Association")).map((assoc) => {
      const ends = assoc.querySelectorAll("UML\\:AssociationEnd, AssociationEnd");
      if (ends.length < 2) {
        return null; // Asociaciones incompletas
      }

      return {
        from: ends[0]?.getAttribute("type"),
        to: ends[1]?.getAttribute("type"),
        relationship: assoc.getAttribute("name") || "association",
        multiplicityFrom: ends[0]?.getAttribute("multiplicity") || "",
        multiplicityTo: ends[1]?.getAttribute("multiplicity") || "",
      };
    }).filter((assoc) => assoc !== null);

    if (associations.length === 0) {
      console.warn("No se encontraron asociaciones en el archivo XMI.");
    }

    // Actualizar el modelo del diagrama
    myDiagram.model = new go.GraphLinksModel({
      nodeDataArray: classes,
      linkDataArray: associations,
    });

    console.log("Importación exitosa. Nodos y enlaces procesados.");
  } catch (error) {
    console.error("Error al procesar el archivo XMI:", error);
  }
}

function extractProperties(cls) {
  return Array.from(cls.querySelectorAll("UML\\:Attribute, Attribute")).map((attr) => ({
    name: attr.getAttribute("name") || "Unnamed Attribute",
    type: attr.querySelector("UML\\:TaggedValue[tag='type'], TaggedValue[tag='type']")?.getAttribute("value") || "String",
    visibility: attr.getAttribute("visibility") || "public",
  }));
}

function extractMethods(cls) {
  return Array.from(cls.querySelectorAll("UML\\:Operation, Operation")).map((op) => ({
    name: op.getAttribute("name") || "Unnamed Method",
    visibility: op.getAttribute("visibility") || "public",
    parameters: Array.from(op.querySelectorAll("UML\\:Parameter, Parameter")).map((param) => ({
      name: param.getAttribute("name") || "Unnamed Parameter",
      type: param.getAttribute("type") || "void",
    })),
  }));
}

// Configuración del botón de importación
function setupImportButton() {
  const importButton = document.getElementById("importarXMI");
  importButton.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const xmiContent = e.target.result;
        parseXMIToDiagram(xmiContent);
      };
      reader.readAsText(file);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupImportButton();
});
