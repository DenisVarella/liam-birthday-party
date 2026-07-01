/**
 * Geração de arquivo .ics para "Adicionar à agenda".
 * Compatível com Google Calendar, Apple Calendar e Outlook.
 */
import { eventInfo } from "@/lib/event-data";

/** Duração estimada da festa, em horas — usada para calcular o término. */
const DURACAO_HORAS = 4;

/** Converte Date para o formato UTC básico exigido pelo iCalendar (YYYYMMDDTHHMMSSZ). */
function formatarDataIcs(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

/** Escapa caracteres reservados do padrão iCalendar. */
function escaparTextoIcs(texto: string): string {
  return texto
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

/** Monta o conteúdo do arquivo .ics do evento. */
export function buildEventoIcs(): string {
  const inicio = new Date(eventInfo.dateISO);
  const fim = new Date(inicio.getTime() + DURACAO_HORAS * 60 * 60 * 1000);

  const linhas = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Aniversario Liam//PT-BR//",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:aniversario-liam-${inicio.getTime()}@liam-birthday`,
    `DTSTAMP:${formatarDataIcs(new Date())}`,
    `DTSTART:${formatarDataIcs(inicio)}`,
    `DTEND:${formatarDataIcs(fim)}`,
    `SUMMARY:${escaparTextoIcs(eventInfo.title)}`,
    `DESCRIPTION:${escaparTextoIcs(eventInfo.tagline)}`,
    `LOCATION:${escaparTextoIcs(eventInfo.location.full)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  return linhas.join("\r\n");
}

/** Dispara o download do arquivo .ics no navegador. */
export function baixarEventoIcs(): void {
  const blob = new Blob([buildEventoIcs()], {
    type: "text/calendar;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "aniversario-liam.ics";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
