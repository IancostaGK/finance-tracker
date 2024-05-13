import {
    endOfDay,
    endOfMonth,
    endOfYear,
    startOfDay,
    startOfMonth,
    startOfYear,
    sub,
} from 'date-fns';

export const useSelectedTimePeriod = (period: Ref<string>) => {
    const yearlyDates = () => {
        return {
            current: {
                from: startOfYear(new Date()),
                to: endOfYear(new Date()),
            },
            previous: {
                from: startOfYear(sub(new Date(), { years: 1 })),
                to: endOfYear(sub(new Date(), { years: 1 })),
            },
        };
    };

    const monthlyDates = () => {
        return {
            current: {
                from: startOfMonth(new Date()),
                to: endOfMonth(new Date()),
            },
            previous: {
                from: startOfMonth(sub(new Date(), { months: 1 })),
                to: endOfMonth(sub(new Date(), { months: 1 })),
            },
        };
    };

    const dailyDates = () => {
        return {
            current: {
                from: startOfDay(new Date()),
                to: endOfDay(new Date()),
            },
            previous: {
                from: startOfDay(sub(new Date(), { days: 1 })),
                to: endOfDay(sub(new Date(), { days: 1 })),
            },
        };
    };

    const dates = computed(() => {
        const periods: Record<string, () => ReturnType<typeof yearlyDates>> = {
            Yearly: yearlyDates,
            Monthly: monthlyDates,
            Daily: dailyDates,
        };

        return periods[period.value]
            ? periods[period.value]()
            : periods.Monthly();
    });

    const previous = computed(() => dates.value.previous);
    const current = computed(() => dates.value.current);

    return { previous, current };
};
