import { NextResponse } from "next/server";
import { handle, loadState, requireSession } from "@/server/http";
import { getDashboard } from "@/server/store";

export async function GET() {
  return handle(async () => {
    await requireSession();
    const { state, now } = await loadState();
    const dashboard = getDashboard(state, now);
    return NextResponse.json({
      patient: dashboard.patient,
      summary: {
        trafficLight: dashboard.trafficLight,
        doctorStatus: dashboard.doctorStatus,
        nextAppointment: dashboard.nextAppointment,
      },
    });
  });
}
