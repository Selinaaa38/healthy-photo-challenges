import { Ionicons } from "@react-native-vector-icons/ionicons";
import { Picker } from "@react-native-picker/picker";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Button } from "../../../components/Button";
import { Chip } from "../../../components/Chip";
import { Sheet } from "../../../components/Sheet";
import { colours, radius, space, type } from "../../../constants/theme";
import DataService from "../../../services/DataService";
import { formatTime } from "../../../utils/time";

const presetTimes = ["07:30", "12:30", "19:00"];
// Every half hour from 6 am to 10 pm, for "Other time" (B4)
const allTimes = Array.from({ length: 33 }, (_, i) => {
  const minutes = 6 * 60 + i * 30;
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${minutes % 60 ? "30" : "00"}`;
});

// The date `daysAhead` days from now at "HH:MM".
const toDate = (daysAhead: number, time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  date.setHours(hours, minutes, 0, 0);
  return date;
};

const dayLabel = (date: Date) => date.toLocaleDateString("en-AU", { weekday: "short", day: "numeric", month: "short" });

// Schedule for later. The challenge then waits in Upcoming on
// Today (US09). B4 adds "Other time" for any half-hour slot.
export default function ScheduleSheet() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [daysAhead, setDaysAhead] = useState(1); // 0 today, 1 tomorrow, 2-7 a picked date
  const [time, setTime] = useState("19:00");
  const [showOtherTimes, setShowOtherTimes] = useState(false);
  const [showDates, setShowDates] = useState(false);

  // Times that have already passed today are hidden.
  const isFuture = (t: string) => toDate(daysAhead, t) > new Date();
  const when = toDate(daysAhead, time);
  const canSchedule = when > new Date();
  const dayName = daysAhead === 0 ? "Today" : daysAhead === 1 ? "Tomorrow" : "";

  const chooseDay = (days: number, pickDate: boolean) => {
    setDaysAhead(days);
    setShowDates(pickDate);
  };

  const schedule = async () => {
    await DataService.scheduleChallenge(id, when.toISOString());
    router.dismissTo("/today");
  };

  return (
    <ScrollView style={styles.screen}>
      <Sheet title="Schedule for later" subtitle="It'll wait in Upcoming on your Today screen.">
        <Text style={styles.label}>Day</Text>
        <View style={styles.chips}>
          <Chip label="Today" state={daysAhead === 0 ? "selected" : "default"} onPress={() => chooseDay(0, false)} />
          <Chip label="Tomorrow" state={daysAhead === 1 && !showDates ? "selected" : "default"} onPress={() => chooseDay(1, false)} />
          <Chip label="Pick a date" state={showDates ? "selected" : "default"} onPress={() => chooseDay(2, true)} />
        </View>
        {showDates && (
          <Picker
            selectedValue={daysAhead}
            onValueChange={setDaysAhead}
            itemStyle={styles.wheel}
            accessibilityLabel="Date"
          >
            {[2, 3, 4, 5, 6, 7].map((days) => (
              <Picker.Item key={days} label={dayLabel(toDate(days, "12:00"))} value={days} />
            ))}
          </Picker>
        )}

        <Text style={styles.label}>Time</Text>
        <View style={styles.chips}>
          {presetTimes.filter(isFuture).map((t) => (
            <Chip
              key={t}
              label={formatTime(toDate(0, t))}
              state={time === t && !showOtherTimes ? "selected" : "default"}
              onPress={() => {
                setTime(t);
                setShowOtherTimes(false);
              }}
            />
          ))}
          <Chip
            label="Other time"
            state={showOtherTimes ? "selected" : "default"}
            onPress={() => setShowOtherTimes(true)}
          />
        </View>
        {showOtherTimes && (
          <Picker
            selectedValue={time}
            onValueChange={setTime}
            itemStyle={styles.wheel}
            accessibilityLabel="Time"
          >
            {allTimes.filter(isFuture).map((t) => (
              <Picker.Item key={t} label={formatTime(toDate(0, t))} value={t} />
            ))}
          </Picker>
        )}

        {daysAhead === 0 && (
          <View style={styles.note}>
            <Ionicons name="information-circle-outline" size={16} color={colours.muted} />
            <Text style={styles.noteText}>For today, times that have already passed are hidden.</Text>
          </View>
        )}

        <View style={styles.summary} accessible>
          <Ionicons name="calendar-outline" size={18} color={colours.text} />
          <Text style={styles.summaryText}>
            {canSchedule
              ? `${dayName ? `${dayName}, ` : ""}${dayLabel(when)} at ${formatTime(when)}`
              : "Choose a time later today"}
          </Text>
        </View>

        <Button label="Schedule" disabled={!canSchedule} onPress={schedule} />
        <Button label="Cancel" variant="text" onPress={() => router.back()} />
      </Sheet>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colours.bg,
  },
  wheel: {
    color: colours.text,
  },
  label: {
    ...type.bodyStrong,
    color: colours.text,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: space.sm,
  },
  note: {
    flexDirection: "row",
    gap: space.sm,
    padding: space.md,
    borderRadius: radius.md,
    backgroundColor: colours.surface,
  },
  noteText: {
    ...type.footnote,
    color: colours.muted,
    flex: 1,
  },
  summary: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
  },
  summaryText: {
    ...type.bodyStrong,
    color: colours.text,
  },
});
