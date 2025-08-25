const markets = [
  { id: 1, market_name: "Forex" },
  { id: 2, market_name: "Indices" },
  { id: 3, market_name: "Cryptomonedas" },
  { id: 4, market_name: "Commodities" },
  { id: 5, market_name: "Sintéticos"}
];

const operationsTypes = [
  { id: 1, operation_type_name: "Buy" },
  { id: 2, operation_type_name: "Sell" },
];

const signalStatus = [
  { id: 1, signal_status_name: "Activa" },
  { id: 2, signal_status_name: "Inactiva" },
  { id: 3, signal_status_name: "Completada" },
  { id: 4, signal_status_name: "Cancelada" },
  { id: 5, signal_status_name: "Pendiente" },
  { id: 6, signal_status_name: "Fallida" },
  { id: 7, signal_status_name: "Programada" },
]

export const list = {
    markets,
    operationsTypes,
    signalStatus
}