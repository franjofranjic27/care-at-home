import type {
  AppointmentSlot,
  AppointmentType,
  ConsultationChannel,
  TimeOfDay,
  VitalStatus,
} from "@/server/domain";

export interface AppointmentTypeLabel {
  readonly title: string;
  readonly subtitle: string;
  /** Vollständige Bezeichnung, z. B. in der Terminkarte. */
  readonly longTitle: string;
}

export const APPOINTMENT_TYPE_LABELS: Readonly<Record<AppointmentType, AppointmentTypeLabel>> = {
  blood_draw: {
    title: "Blutentnahme",
    subtitle: "Dauert etwa 10 Minuten",
    longTitle: "Blutentnahme zuhause",
  },
  home_checkup: {
    title: "Untersuchung zuhause",
    subtitle: "Blutdruck, Gewicht, Befinden",
    longTitle: "Untersuchung zuhause",
  },
};

export interface AppointmentSlotLabel {
  readonly label: string;
  /** Zeitfenster als Text, z. B. "08–10 Uhr". */
  readonly time: string;
}

export const APPOINTMENT_SLOT_LABELS: Readonly<Record<AppointmentSlot, AppointmentSlotLabel>> = {
  morning: { label: "Früh morgens", time: "08–10 Uhr" },
  late_morning: { label: "Am Vormittag", time: "10–12 Uhr" },
  afternoon: { label: "Am Nachmittag", time: "14–16 Uhr" },
};

export interface ChannelLabel {
  readonly label: string;
  readonly hint: string;
  /** Beschreibung in der Bestätigung. */
  readonly confirmation: string;
}

export const CHANNEL_LABELS: Readonly<Record<ConsultationChannel, ChannelLabel>> = {
  phone: {
    label: "Per Telefon",
    hint: "Dr. Keller ruft Sie zur gewählten Zeit an. Sie müssen nichts vorbereiten.",
    confirmation: "Per Telefon – Dr. Keller ruft Sie an",
  },
  onsite: {
    label: "Im Spital",
    hint: "Bitte kommen Sie 10 Minuten vorher ans Kantonsspital St. Gallen, Empfang Kardiologie.",
    confirmation: "Im Kantonsspital St. Gallen, Empfang Kardiologie",
  },
};

export const VITAL_STATUS_LABELS: Readonly<Record<VitalStatus, string>> = {
  good: "gut",
  stable: "stabil",
  in_range: "im Ziel",
};

export const TIME_OF_DAY_LABELS: Readonly<Record<TimeOfDay, string>> = {
  morning: "Morgens",
  evening: "Abends",
};

export const EMERGENCY_NUMBER = "144";
export const HELP_LINE = { display: "0800 123 456", tel: "+41800123456" } as const;
