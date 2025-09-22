import { DateTime } from "luxon";

// Mock del handler de festivos
jest.mock("./holiday-handler", () => ({
  isHoliday: jest.fn().mockReturnValue(false),
}));
import { isHoliday } from "./holiday-handler";

describe("calculateBusinessDate", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("mantiene la hora al sumar días hábiles", () => {
    const start = "2024-06-10T10:30:00.000Z"; // lunes
    const result = calculateBusinessDate(start, 2); // +2 días
    expect(result.weekday).toBe(3); // miércoles
    expect(result.hour).toBe(10);
    expect(result.minute).toBe(30);
  });

  it("mueve al siguiente día hábil si empieza después de la jornada", () => {
    const start = "2024-06-10T20:00:00.000Z"; // lunes 8pm
    const result = calculateBusinessDate(start, 1); // +1 día
    expect(result.weekday).toBe(2); // martes
    expect(result.hour).toBe(8);
  });

  it("se salta el fin de semana", () => {
    const start = "2024-06-07T10:00:00.000Z"; // viernes 10am
    const result = calculateBusinessDate(start, 1); // +1 día hábil
    expect(result.weekday).toBe(1); // lunes
    expect(result.hour).toBe(10);
  });

  it("se salta un feriado", () => {
    (isHoliday as jest.Mock).mockImplementation((d: DateTime) =>
      d.hasSame(DateTime.fromISO("2024-06-11"), "day")
    );

    const start = "2024-06-10T10:00:00.000Z"; // lunes
    const result = calculateBusinessDate(start, 1); // +1 día hábil
    expect(result.weekday).toBe(3); // miércoles (salta el martes feriado)
  });

  it("suma horas y respeta la hora de almuerzo", () => {
    const start = "2024-06-10T11:00:00.000Z"; // lunes 11am
    const result = calculateBusinessDate(start, 0, 2); // +2h
    expect(result.hour).toBe(13); // debería caer en 1pm, no 12pm
  });

  it("suma horas y salta al siguiente día si pasa la jornada", () => {
    const start = "2024-06-10T16:00:00.000Z"; // lunes 4pm
    const result = calculateBusinessDate(start, 0, 2); // +2h
    expect(result.weekday).toBe(2); // martes
    expect(result.hour).toBe(10); // 10am
  });

  it("lanza error si no se pasa daysToAdd ni hoursToAdd", () => {
    const start = "2024-06-10T10:00:00.000Z";
    expect(() => calculateBusinessDate(start)).toThrow("InvalidParameters");
  });
});
