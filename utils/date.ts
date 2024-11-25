import {
  format,
  endOfMonth,
  endOfWeek,
  startOfMonth,
  startOfWeek,
  sub,
} from "date-fns";

export const startEndDateMap = {
  today: {
    label: "Today",
    startDate: new Date(),
    endDate: new Date(),
  },
  yesterday: {
    label: "Yesterday",
    startDate: sub(new Date(), {
      days: 1,
    }),
    endDate: sub(new Date(), {
      days: 1,
    }),
  },
  // last7Days: {
  //   label: "Last 7 days",
  //   startDate: sub(new Date(), {
  //     days: 7,
  //   }),
  //   endDate: new Date(),
  // },
  thisWeek: {
    label: "This week",
    startDate: startOfWeek(new Date(), { weekStartsOn: 1 }),
    endDate: new Date(),
  },
  lastWeek: {
    label: "Last week",
    startDate: startOfWeek(
      sub(new Date(), {
        days: 7,
      }),
      { weekStartsOn: 1 }
    ),
    endDate: endOfWeek(
      sub(new Date(), {
        days: 7,
      }),
      { weekStartsOn: 1 }
    ),
  },
  last30Days: {
    label: "Last 30 days",
    startDate: sub(new Date(), {
      days: 30,
    }),
    endDate: new Date(),
  },
  thisMonth: {
    label: "This month",
    startDate: startOfMonth(new Date()),
    endDate: new Date(),
  },
  lastMonth: {
    label: "Last month",
    startDate: startOfMonth(
      sub(new Date(), {
        months: 1,
      })
    ),
    endDate: endOfMonth(
      sub(new Date(), {
        months: 1,
      })
    ),
  },
  yearToDate: {
    label: "Year to date",
    startDate: sub(new Date(), {
      years: 1,
    }),
    endDate: new Date(),
  },
  lifetime: {
    label: "Lifetime",
    startDate: new Date(0),
    endDate: new Date(),
  },
};

type StartEndDateEnum = keyof typeof startEndDateMap;

export const getStartEndDate = (
  sentence: StartEndDateEnum,
  formatStr: string = "yyyy-MM-dd"
): { startDate: string; endDate: string } => {
  try {
    let { endDate, startDate } = startEndDateMap[sentence];
    return {
      startDate: format(new Date(startDate), formatStr),
      endDate: format(new Date(endDate), formatStr),
    };
  } catch (error) {
    console.log("ERROR getStartEndDate:", error);
    return { startDate: "", endDate: "" };
  }
};

export const actualEndDateMap = {
  today: {
    label: "Today",
    startDate: new Date(),
    endDate: new Date(),
  },
  yesterday: {
    label: "Yesterday",
    startDate: sub(new Date(), {
      days: 1,
    }),
    endDate: sub(new Date(), {
      days: 1,
    }),
  },
  thisWeek: {
    label: "This week",
    startDate: startOfWeek(new Date()),
    endDate: endOfWeek(new Date()),
  },
  thisMonth: {
    label: "This month",
    startDate: startOfMonth(new Date()),
    endDate: endOfMonth(new Date()),
  },
};

type ActualStartEndDateEnum = keyof typeof actualEndDateMap;

export const getActualStartEndDate = (
  sentence: ActualStartEndDateEnum,
  formatStr: string = "yyyy-MM-dd"
): { startDate: string; endDate: string } => {
  try {
    let { endDate, startDate } = actualEndDateMap[sentence];
    return {
      startDate: format(new Date(startDate), formatStr),
      endDate: format(new Date(endDate), formatStr),
    };
  } catch (error) {
    console.log("ERROR getStartEndDate:", error);
    return { startDate: "", endDate: "" };
  }
};

export const formatDate = (date: string, dateFormat: string = "PPP") => {
  return format(new Date(date), dateFormat);
};
