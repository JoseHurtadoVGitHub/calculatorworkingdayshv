# 📅 Working Days API Calculator

API en **TypeScript + Express** que calcula fechas hábiles sumando días y horas, respetando la jornada laboral en Colombia (08:00–12:00, 13:00–17:00) y los días festivos oficiales.

---

## ⚡️ Características principales

- Implementada en **TypeScript** con arquitectura organizada:
  - **Rutas**
  - **Controladores**
  - **Servicios**
  - **Middlewares**
- Validación robusta con **Zod** para parámetros de entrada.
- Manejo de errores centralizado con **middlewares**.
- Cálculo de días/horas hábiles teniendo en cuenta:
  - Fines de semana.
  - Festivos oficiales de Colombia.
  - Jornada laboral (08:00–12:00 / 13:00–17:00).
- Listo para desplegar en **Railway / Render / Vercel** o como **AWS Lambda** (bonus).

---

## 📂 Estructura del proyecto

src/
├── common/
│ └── enums/
│ └── httpStatus.ts
├── config/
│ ├── appRouter.ts
│ ├── httpException.ts
│ └── zodValidator.decorator.ts
├── controllers/
│ └── workingDaysController.ts
├── middleWares/
│ ├── errorHandlerMiddleware.ts
│ └── zodErrorHandlerMiddleware.ts
├── models/
│ └── workingDaysDto.ts
├── services/
│ └── workingDaysService.ts
├── utils/
│ ├── date-calculator.ts
│ └── holiday-handler.ts
└── index.ts

▶️ Ejecución
Modo desarrollo

Con recarga automática gracias a ts-node-dev:

npm run dev

🌐 Endpoints

1. Calcular fecha hábil

Método: GET

URL: /api/working-days

Query Params:

| Parámetro | Tipo   | Requerido | Descripción                                                                                        |
| --------- | ------ | --------- | -------------------------------------------------------------------------------------------------- |
| `date`    | string | Opcional  | Fecha inicial en UTC (ISO 8601 con sufijo `Z`). Si no se envía, se usa la hora actual en Colombia. |
| `days`    | number | Opcional  | Número de días hábiles a sumar (entero positivo).                                                  |
| `hours`   | number | Opcional  | Número de horas hábiles a sumar (entero positivo).                                                 |

⚠️ Nota: Se debe enviar al menos uno de days u hours.

📖 Ejemplos de uso
Ejemplo 1: sumar días

GET /api/working-days?date=2025-09-14T23:00:00Z&days=1

Response:

{
"date": "2025-09-15T17:00:00Z"
}

👤 Autor

Desarrollado por José Luis Hurtado Villa Ingeniero de Sofrware ✨

Prueba técnica – Working Days Calculator CAPTA.
