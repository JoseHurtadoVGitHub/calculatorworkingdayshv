// src/utils/date-calculator.ts
import { DateTime, Settings } from "luxon";
import { isHoliday } from "./holiday-handler";

// Siempre trabajar en zona horaria de Colombia
Settings.defaultZone = "America/Bogota";

/**
 * 🔹 Tipos de entrada aceptados por el cálculo
 */
export type CalcInput = {
  date?: string; // Fecha inicial en ISO UTC (con sufijo Z)
  days?: number; // Días hábiles a sumar (>= 0)
  hours?: number; // Horas hábiles a sumar (>= 0)
};

/**
 * 🔹 Configuración de la jornada laboral
 */
const WORKING = {
  startHour: 8, // Inicio jornada
  lunchStartHour: 12, // Inicio almuerzo
  lunchEndHour: 13, // Fin almuerzo
  endHour: 17, // Fin jornada
};

/* -------------------------------------------------------------------------- */
/*                                HELPER METHODS                              */
/* -------------------------------------------------------------------------- */

/**
 * Verifica si es fin de semana.
 */
function isWeekend(dt: DateTime): boolean {
  return dt.weekday === 6 || dt.weekday === 7; // 6 = sábado, 7 = domingo
}

/**
 * Verifica si un día es hábil (lunes-viernes y no festivo).
 */
function isBusinessDay(dt: DateTime): boolean {
  return dt.weekday >= 1 && dt.weekday <= 5 && !isHoliday(dt);
}

/**
 * Mueve la fecha al último día hábil anterior a las 17:00.
 * Se usa cuando la fecha cae en fin de semana o festivo.
 */
function moveToPreviousBusinessDayEnd(dt: DateTime): DateTime {
  let d = dt.startOf("day");
  do {
    d = d.minus({ days: 1 });
  } while (!isBusinessDay(d));
  return d.set({ hour: WORKING.endHour, minute: 0, second: 0, millisecond: 0 });
}

/**
 * Normaliza una fecha dentro de un día hábil:
 *  - Antes de 08:00 → se ajusta a 08:00
 *  - Durante almuerzo (12:00–13:00) → se ajusta a 12:00
 *  - Después de 17:00 → se ajusta a 17:00
 *  - Dentro del rango laboral → se deja igual
 */
function normalizeBusinessDayTimeBackward(d: DateTime): DateTime {
  if (d.hour < WORKING.startHour) {
    return d.set({
      hour: WORKING.startHour,
      minute: 0,
      second: 0,
      millisecond: 0,
    });
  }
  if (d.hour >= WORKING.lunchStartHour && d.hour < WORKING.lunchEndHour) {
    return d.set({
      hour: WORKING.lunchStartHour,
      minute: 0,
      second: 0,
      millisecond: 0,
    });
  }
  if (d.hour >= WORKING.endHour) {
    return d.set({
      hour: WORKING.endHour,
      minute: 0,
      second: 0,
      millisecond: 0,
    });
  }
  return d.set({ second: 0, millisecond: 0 });
}

/**
 * Normaliza la fecha de entrada:
 *  - Si no es hábil → se mueve al último hábil a las 17:00
 *  - Si es hábil → se ajusta dentro de la jornada laboral
 */
function normalizeInputBackward(dt: DateTime): DateTime {
  return isBusinessDay(dt)
    ? normalizeBusinessDayTimeBackward(dt)
    : moveToPreviousBusinessDayEnd(dt);
}

/**
 * Avanza 'days' días hábiles hacia adelante.
 * Mantiene la hora/minuto resultante de la normalización inicial.
 */
function addBusinessDaysForward(dt: DateTime, days: number): DateTime {
  let cur = dt;
  let added = 0;
  while (added < days) {
    cur = cur.plus({ days: 1 });
    while (!isBusinessDay(cur)) {
      cur = cur.plus({ days: 1 });
    }
    added++;
  }
  return cur;
}

/**
 * Avanza 'hours' horas hábiles hacia adelante.
 * Maneja bloques de mañana (08–12) y tarde (13–17).
 * - Si cae en almuerzo → se salta hasta 13:00.
 * - Si supera las 17:00 → continúa al siguiente hábil a las 08:00.
 */
function addBusinessHoursForward(dt: DateTime, hours: number): DateTime {
  let cur = dt;
  let minutesRemaining = Math.round(hours * 60);

  // Si por alguna razón estamos en un día no hábil → mover al siguiente hábil a las 08:00
  if (!isBusinessDay(cur)) {
    cur = cur
      .plus({ days: 1 })
      .set({ hour: WORKING.startHour, minute: 0, second: 0 });
    while (!isBusinessDay(cur)) {
      cur = cur.plus({ days: 1 });
    }
  }

  // Si cae dentro del almuerzo → mover a las 13:00
  if (cur.hour >= WORKING.lunchStartHour && cur.hour < WORKING.lunchEndHour) {
    cur = cur.set({ hour: WORKING.lunchEndHour, minute: 0, second: 0 });
  }

  // Mientras haya minutos por consumir
  while (minutesRemaining > 0) {
    const curMinutes = cur.hour * 60 + cur.minute;

    // Límite actual de bloque (12:00 o 17:00)
    const blockEndMinutes =
      cur.hour < WORKING.lunchStartHour
        ? WORKING.lunchStartHour * 60
        : WORKING.endHour * 60;

    const available = blockEndMinutes - curMinutes;

    if (available <= 0) {
      // Estamos fuera del bloque laboral → mover correctamente
      if (
        cur.hour >= WORKING.lunchStartHour &&
        cur.hour < WORKING.lunchEndHour
      ) {
        cur = cur.set({ hour: WORKING.lunchEndHour, minute: 0, second: 0 });
      } else {
        cur = cur
          .plus({ days: 1 })
          .set({ hour: WORKING.startHour, minute: 0, second: 0 });
        while (!isBusinessDay(cur)) {
          cur = cur.plus({ days: 1 });
        }
      }
      continue;
    }

    // Consumir minutos disponibles o los que falten
    const consume = Math.min(available, minutesRemaining);
    cur = cur.plus({ minutes: consume });
    minutesRemaining -= consume;

    // Ajustes especiales: almuerzo o fin de jornada
    if (cur.hour === WORKING.lunchStartHour && cur.minute === 0) {
      cur = cur.set({ hour: WORKING.lunchEndHour, minute: 0, second: 0 });
    } else if (cur.hour >= WORKING.endHour && minutesRemaining > 0) {
      cur = cur
        .plus({ days: 1 })
        .set({ hour: WORKING.startHour, minute: 0, second: 0 });
      while (!isBusinessDay(cur)) {
        cur = cur.plus({ days: 1 });
      }
    }
  }

  return cur;
}

/* -------------------------------------------------------------------------- */
/*                               MAIN FUNCTION                                */
/* -------------------------------------------------------------------------- */

/**
 * Calcula una nueva fecha hábil en base a la fecha inicial + días + horas.
 *
 * Pasos:
 * 1. Normalizar fecha inicial (ajustar hacia atrás si está fuera de jornada o no es hábil).
 * 2. Sumar los días hábiles hacia adelante.
 * 3. Sumar las horas hábiles hacia adelante.
 *
 * Retorna un `DateTime` en zona "America/Bogota".
 * El consumidor debe convertirlo a UTC al exponerlo en la API.
 */
export function calculateBusinessDateFromInput(input: CalcInput): DateTime {
  const { date, days = 0, hours = 0 } = input;

  // Validación
  if ((days ?? 0) <= 0 && (hours ?? 0) <= 0) {
    throw new Error("InvalidParameters");
  }

  // Parsear fecha inicial
  const start = date
    ? DateTime.fromISO(date, { zone: "utc" }).setZone("America/Bogota")
    : DateTime.now().setZone("America/Bogota");

  // 1) Normalizar entrada
  let current = normalizeInputBackward(start);

  // 2) Sumar días hábiles
  if (days > 0) {
    current = addBusinessDaysForward(current, days);
  }

  // 3) Sumar horas hábiles
  if (hours > 0) {
    current = addBusinessHoursForward(current, hours);
  }

  return current;
}
