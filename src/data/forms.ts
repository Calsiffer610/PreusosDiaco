export type InspectionItem = {
  id: number;
  verify: string;
  parameter: string;
  criticality: "Alta" | "Media";
};

export type CompanyForm = {
  id: string;
  title: string;
  source: string;
  area: string;
  section: string;
  equipment: string;
  cadence: string;
  status: "Prototipo" | "Activo";
  items: InspectionItem[];
};

export const companyForms: CompanyForm[] = [
  {
    id: "pre-usos-tren",
    title: "PRE USOS TREN",
    source: "PRE USOS TREN.xlsx",
    area: "Laminacion",
    section: "Tren Laminador T2",
    equipment: "Oxicorte No. 1",
    cadence: "Diario por turno",
    status: "Prototipo",
    items: [
      {
        id: 1,
        verify: "Revisar y limpiar boquilla",
        parameter: "La espiga no debe estar obstruida con escoria.",
        criticality: "Alta",
      },
      {
        id: 2,
        verify: "Tuerca de sujecion de boquilla",
        parameter: "La tuerca debe estar correctamente ajustada y sin fugas.",
        criticality: "Media",
      },
      {
        id: 3,
        verify: "Mangueras",
        parameter: "La union de mangueras debe cumplir la distancia minima definida.",
        criticality: "Media",
      },
      {
        id: 4,
        verify: "Uniones",
        parameter: "Usar abrazaderas y arpones; separar uniones de oxigeno y gas.",
        criticality: "Media",
      },
      {
        id: 5,
        verify: "Antorcha o cana",
        parameter: "Debe estar limpia, en buen estado y sin fugas.",
        criticality: "Alta",
      },
      {
        id: 6,
        verify: "Manometros",
        parameter: "Verificar estado y funcionamiento de conexiones, valvulas y manometros.",
        criticality: "Alta",
      },
      {
        id: 7,
        verify: "Arrestadores de llama",
        parameter: "Debe existir arrestador de llama en gas y oxigeno.",
        criticality: "Media",
      },
      {
        id: 8,
        verify: "Pin de accionamiento",
        parameter: "Debe accionar correctamente, estar limpio y sin fugas.",
        criticality: "Media",
      },
      {
        id: 9,
        verify: "Inspeccion general de fugas",
        parameter: "Revisar fugas en valvulas, racores, red de gas, oxigeno y uniones.",
        criticality: "Alta",
      },
    ],
  },
];

export const productVision = [
  {
    title: "Digitalizar el pre-uso en piso",
    description:
      "Reemplazar el Excel mensual por formularios guiados por equipo, turno y operador, con evidencia y trazabilidad.",
  },
  {
    title: "Convertir hallazgos en acciones",
    description:
      "Cada respuesta no conforme debe abrir un problema con responsable, fecha compromiso, solucion y cierre.",
  },
  {
    title: "Medir confiabilidad operativa",
    description:
      "Tableros por area, equipo e item para detectar reincidencias, retrasos de cierre y condiciones inseguras.",
  },
  {
    title: "Preparar auditorias",
    description:
      "Historial consultable por mes, firma digital, exportacion PDF/Excel y evidencia fotografica por inspeccion.",
  },
];
