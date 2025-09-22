```bash
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
- Desplegado en **Railway / **AWS Lambda**.

---

## 📂 Estructura del proyecto

src/
├── common/
│   └── enums/
│       └── httpStatus.ts
├── config/
│   ├── appRouter.ts
│   └── httpException.ts
├── controllers/
│   └── workingDaysController.ts
├── middleWares/
│   ├── errorHandlerMiddleware.ts
│   └── zodErrorHandlerMiddleware.ts
├── models/
│   └── workingDaysDto.ts
├── services/
│   └── workingDaysService.ts
├── utils/
│   └── holiday-handler.ts
└── index.ts

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

Instrucciones de instalación:

git clone https://github.com/JoseHurtadoVGitHub/calculatorworkingdayshv.git
cd working-days-api-calculator
npm install
npm run build
npm start

Mode Dev:
npm run dev

## 🚀 Despliegue

- **Railway:**  
  [https://workingdayscalculator-production.up.railway.app/api/working-days/?hours=1&date=2025-09-13T19:00:00Z](https://workingdayscalculator-production.up.railway.app/api/working-days/?hours=1&date=2025-09-13T19:00:00Z)  
  ![Railway Deploy](https://github.com/user-attachments/assets/b093340b-c6ae-4319-90b1-0d967548ebd2)

- **AWS Lambda (bonus):**  
  [https://ycbradp9fg.execute-api.us-east-1.amazonaws.com/prod/api/working-days?date=2025-09-15T17:30:00Z&days=1](https://ycbradp9fg.execute-api.us-east-1.amazonaws.com/prod/api/working-days?date=2025-09-15T17:30:00Z&days=1)  
  ![AWS Lambda Deploy](https://github.com/user-attachments/assets/d3f1ce0f-ea24-4b47-a763-02d1c89080ca)


  
👤Autor  
Desarrollado por **José Luis Hurtado Villa**  
🚀 Ingeniero de Software | APIs | Arquitectura Backend | Cloud
Prueba técnica – Working Days Calculator CAPTA.
